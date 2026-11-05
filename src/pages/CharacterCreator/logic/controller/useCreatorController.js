import { useCallback, useMemo, useState } from 'react'
import {
  getSystemCallings,
  getSystemOrigins,
  getSystemOriginPaths,
  getSystemOriginStartingReputation,
  getSystemSpecialization,
  getSystemSpecializations,
} from '../../../../data/archipelagoSystemSelectors'
import { getTrainingOptions, toggleTraining, selectCallingTraining } from '../../../../data/training.js'
import { applyOriginBonus } from '../../../../lib/originBonus.js'
import {
  applyAttributeBonus,
  createEmptyAttributes,
  getRemainingPoints,
} from '../../../../lib/creatorAttributes.js'
import {
  getCreatorActionHint,
  getCreatorValidations,
  getOriginSummaryValue,
} from '../guidance/creatorGuidance'
import { hydrateCreatorState } from '../hydration/hydrateState'
import { buildCharacterPayload } from '../payload/buildPayload'
import { buildCharacterPatch } from '../payload/buildPatch'
import {
  INITIAL_IDENTITY,
  PATH_ORIGIN_MAP,
} from '../config/creatorConfig'
import { createMutations } from '../mutations/createMutations'
import { createNavigation } from '../navigation/stepNavigation'
import {
  createEmptyDetails,
  createEmptyLoadout,
  createEmptyResourceValues,
  createProgression,
  createResources,
  normalizeProgression,
} from '../state/creatorState'

function useCreatorController({
  blueprint,
  initialCharacter = null,
  onSaveCharacter,
}) {
  const callings = getSystemCallings(blueprint)
  const origins = getSystemOrigins(blueprint)
  const originPaths = getSystemOriginPaths(blueprint)
  const specializations = getSystemSpecializations(blueprint)
  const hydratedState = useMemo(() => {
    if (!initialCharacter?._id || !blueprint) {
      return null
    }

    return hydrateCreatorState({
      blueprint,
      initialCharacter,
      origins,
    })
  }, [blueprint, initialCharacter, origins])

  const [identity, setIdentity] = useState(() => hydratedState?.identity ?? INITIAL_IDENTITY)
  const [attributeValues, setAttributeValues] = useState(
    () => hydratedState?.attributeValues ?? createEmptyAttributes(),
  )
  const [details, setDetails] = useState(() => hydratedState?.details ?? createEmptyDetails())
  const [loadout, setLoadout] = useState(() => hydratedState?.loadout ?? createEmptyLoadout())
  const [training, setTraining] = useState(() => hydratedState?.training ?? [])
  const [storedResourceValues, setResourceValues] = useState(
    () => hydratedState?.resourceValues ?? createEmptyResourceValues(),
  )
  const [wounds, setWounds] = useState(() => hydratedState?.wounds ?? [])
  const [progressionValues, setProgressionValues] = useState(() =>
    hydratedState?.progressionValues ?? normalizeProgression(createProgression(), blueprint),
  )
  const [saveMessage, setSaveMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

  const isEditing = Boolean(initialCharacter?._id)
  const selectedCalling = callings.find((entry) => entry.id === identity.callingId)
  const selectedOrigin = origins.find((entry) => entry.id === identity.originId)
  const selectedPath = originPaths.find((entry) => entry.id === identity.path)
  const activeSpecialization = getSystemSpecialization(progressionValues.specializationPath, blueprint)
  const advancementSpent = useMemo(
    () =>
      (activeSpecialization?.nodes ?? [])
        .filter((node) => progressionValues.unlockedNodes.includes(node.id))
        .reduce((total, node) => total + (node.cost ?? 0), 0),
    [activeSpecialization, progressionValues.unlockedNodes],
  )
  const finalAttributes = useMemo(
    () => {
      try { return applyOriginBonus(attributeValues, selectedOrigin?.id, blueprint) }
      catch { return applyAttributeBonus(attributeValues, selectedOrigin?.bonus) }
    },
    [attributeValues, selectedOrigin, blueprint],
  )
  const startingReputation = useMemo(
    () => getSystemOriginStartingReputation(identity.originId, blueprint),
    [blueprint, identity.originId],
  )
  const trainingOptions = getTrainingOptions(blueprint)
  const trainingUnchanged = isEditing && JSON.stringify(training) === JSON.stringify(hydratedState?.training)
  const validTraining = trainingUnchanged || (training.length === 4 && new Set(training).size === 4 && training.every((id) => trainingOptions.some((entry) => entry.id === id)))
  const resourceMaximums = useMemo(() => {
    const canCalculate = Object.values(finalAttributes).every((score) => score >= 8)
    const generatedResources = canCalculate
      ? createResources(finalAttributes, isEditing ? progressionValues.rank : 1)
      : initialCharacter?.resources ?? {}

    return {
      health: isEditing && !initialCharacter?.resources?.health ? null : generatedResources.health?.max ?? null,
      stamina: isEditing && !initialCharacter?.resources?.stamina ? null : generatedResources.stamina?.max ?? null,
      focus: isEditing && !initialCharacter?.resources?.focus ? null : generatedResources.focus?.max ?? null,
      corruption: initialCharacter?.resources?.corruption?.max ?? generatedResources.corruption?.max ?? 6,
      wounds: initialCharacter?.resources?.wounds?.max ?? generatedResources.wounds?.max ?? 3,
    }
  }, [finalAttributes, initialCharacter, isEditing, progressionValues.rank])
  const resourceValues = {
    ...storedResourceValues,
    ...Object.fromEntries(['health', 'stamina', 'focus'].map((key) => [key,
      isEditing ? (resourceMaximums[key] === null ? null : Math.min(storedResourceValues[key], resourceMaximums[key])) : resourceMaximums[key],
    ])),
  }
  const remainingPoints = getRemainingPoints(attributeValues)
  const trimmedName = identity.name.trim()
  const hasValidName = trimmedName.length >= 2
  const isIdentityComplete =
    hasValidName &&
    Boolean(identity.path) &&
    (identity.path === 'archipelago'
      ? Boolean(identity.originId)
      : Boolean(PATH_ORIGIN_MAP[identity.path]))
  const validations = useMemo(
    () =>
      getCreatorValidations({
        identity,
        isIdentityComplete,
        progressionValues,
        remainingPoints,
        isEditing,
        attributesUnchanged: JSON.stringify(attributeValues) === JSON.stringify(hydratedState?.attributeValues) && identity.originId === hydratedState?.identity.originId,
        validTraining,
      }),
    [identity, isIdentityComplete, progressionValues, validTraining, remainingPoints, isEditing, attributeValues, hydratedState],
  )

  const mutations = useMemo(
    () =>
      createMutations({
        activeSpecialization,
        resourceMaximums,
        setAttributeValues,
        setDetails,
        setIdentity,
        setLoadout,
        setProgressionValues,
        setResourceValues,
        setSaveMessage,
        setWounds,
      }),
    [activeSpecialization, resourceMaximums],
  )
  const {
    handleAddCustomAbility,
    handleAddWound,
    handleAttributeChange,
    handleCustomAbilityChange,
    handleDetailsChange,
    handleIdentityChange: mutateIdentity,
    handleLoadoutChange,
    handleProgressionChange,
    handleRemoveCustomAbility,
    handleRemoveWound,
    handleResourceChange,
    handleWoundChange,
  } = mutations
  function handleIdentityChange(field, value) {
    if (field === 'callingId' && value !== identity.callingId && !isEditing) {
      const packages = blueprint?.startingProficiencies?.callings ?? {}
      setTraining(current => selectCallingTraining(current, packages[identity.callingId]?.skills, packages[value]?.skills))
    }
    mutateIdentity(field, value)
  }
  const handleTrainingToggle = useCallback((id) => {
    setSaveMessage('')
    setTraining((current) => toggleTraining(current, id, trainingOptions))
  }, [trainingOptions])

  async function handleSaveCharacter() {
    if (!onSaveCharacter || !validations.review) {
      return
    }

    const payloadArguments = {
      details,
      finalAttributes,
      attributeValues,
      identity,
      initialCharacter,
      loadout,
      progressionValues,
      resourceValues,
      selectedCalling,
      selectedOrigin,
      selectedPath,
      training,
      startingReputation,
      trimmedName,
      wounds,
    }
    let payload = buildCharacterPayload(payloadArguments)
    if (isEditing) {
      const initialOrigin = origins.find((origin) => origin.id === hydratedState.identity.originId)
      const baseline = buildCharacterPayload({
        ...payloadArguments,
        ...hydratedState,
        selectedOrigin: initialOrigin,
        selectedCalling: callings.find((calling) => calling.id === hydratedState.identity.callingId),
        selectedPath: originPaths.find((path) => path.id === hydratedState.identity.path),
        finalAttributes: applyAttributeBonus(hydratedState.attributeValues, initialOrigin?.bonus),
        trimmedName: hydratedState.identity.name.trim(),
      })
      // Compare against stored current values, not the clamped preview; the server applies clamping.
      try {
        payload = buildCharacterPatch(payload, baseline, initialCharacter)
      } catch (error) {
        setSaveMessage(error.message)
        return
      }
      const resourcePatch = {}
      Object.entries(storedResourceValues).forEach(([track, current]) => {
        if (current !== hydratedState.resourceValues[track]) resourcePatch[track] = { current }
      })
      if (JSON.stringify(wounds) !== JSON.stringify(hydratedState.wounds)) {
        resourcePatch.wounds = { ...resourcePatch.wounds, active: buildCharacterPayload(payloadArguments).resources.wounds.active }
      }
      delete payload.resources
      if (Object.keys(resourcePatch).length) payload.resources = resourcePatch
      for (const field of ['pastRole', 'definingEvent']) {
        if (details[field] === hydratedState.details[field] && payload.identity?.background) {
          delete payload.identity.background[field]
        } else if (payload.identity?.background) {
          payload.identity.background[field] = details[field].trim()
        }
      }
    }

    await onSaveCharacter(payload)
    setSaveMessage(
      `${payload.name || 'Character'} ${isEditing ? 'updated' : 'saved'} ${isEditing ? 'successfully' : 'to your roster'}.`,
    )
  }

  const {
    canGoNext,
    currentStepMeta,
    getStepValidity,
    handleGoToStep,
    handleNextStep,
    handlePreviousStep,
    isStepAccessible,
  } = createNavigation({
    currentStep,
    setCurrentStep,
    validations,
  })
  const actionHint = getCreatorActionHint({
    currentStepId: currentStepMeta.id,
    hasValidName,
    identity,
    remainingPoints,
    trimmedName,
    validations,
  })
  const originSummaryValue = getOriginSummaryValue(selectedOrigin, identity.path)
  const stepPropsById = {
    identity: {
      locked: Boolean(initialCharacter?.advancement),
      identity,
      onIdentityChange: initialCharacter?.advancement ? (field, value) => { if (!['callingId', 'originId', 'path'].includes(field)) handleIdentityChange(field, value) } : handleIdentityChange,
    },
    calling: {
      locked: Boolean(initialCharacter?.advancement),
      identity,
      onIdentityChange: handleIdentityChange,
    },
    attributes: {
      locked: Boolean(initialCharacter?.advancement),
      attributeValues,
      finalAttributes,
      selectedOrigin,
      resourceMaximums,
      onAttributeChange: initialCharacter?.advancement ? () => {} : handleAttributeChange,
    },
    skills: { trainingOptions, training, onTrainingToggle: handleTrainingToggle,
      historical: isEditing && initialCharacter.trainingRulesVersion !== 1,
      startingPackage: blueprint?.startingProficiencies?.callings?.[identity.callingId] },
    loadout: {
      loadout,
      onLoadoutChange: handleLoadoutChange,
      onCustomAbilityChange: handleCustomAbilityChange,
      onAddCustomAbility: handleAddCustomAbility,
      onRemoveCustomAbility: handleRemoveCustomAbility,
    },
    details: {
      isEditing,
      details,
      resourceValues,
      resourceMaximums,
      wounds,
      onDetailsChange: handleDetailsChange,
      onResourceChange: handleResourceChange,
      onWoundChange: handleWoundChange,
      onAddWound: handleAddWound,
      onRemoveWound: handleRemoveWound,
    },
    progression: {
      isEditing,
      progressionValues,
      specializations,
      activeSpecialization,
      advancementSpent,
      onProgressionChange: handleProgressionChange,
    },
    review: {
      identity,
      attributeValues,
      startingReputation,
      details,
      loadout,
      resourceValues,
      resourceMaximums,
      training,
      trainingOptions,
      wounds,
      progressionValues,
    },
  }

  return {
    actionHint,
    activeSpecialization,
    advancementSpent,
    attributeValues,
    canGoNext,
    currentStep,
    currentStepMeta,
    details,
    finalAttributes,
    getStepValidity,
    handleAddCustomAbility,
    handleAddWound,
    handleAttributeChange,
    handleCustomAbilityChange,
    handleDetailsChange,
    handleGoToStep,
    handleIdentityChange,
    handleLoadoutChange,
    handleNextStep,
    handlePreviousStep,
    handleProgressionChange,
    handleRemoveCustomAbility,
    handleRemoveWound,
    handleResourceChange,
    handleSaveCharacter,
    handleWoundChange,
    identity,
    isEditing,
    isStepAccessible,
    loadout,
    originSummaryValue,
    progressionValues,
    remainingPoints,
    trainingCount: training.length,
    resourceMaximums,
    resourceValues,
    saveMessage,
    selectedCalling,
      training,
    specializations,
    startingReputation,
    stepPropsById,
    validations,
    wounds,
  }
}

export default useCreatorController
