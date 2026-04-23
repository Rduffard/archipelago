import { useEffect, useMemo, useState } from 'react'
import {
  getRankedSystemSpecializations,
  getSystemCallings,
  getSystemOrigins,
  getSystemOriginPaths,
  getSystemOriginStartingReputation,
  getSystemSpecialization,
  getSystemSpecializations,
} from '../../../../data/archipelagoSystemSelectors'
import {
  applyAttributeBonus,
  calculateDerivedStats,
  calculatePairingStats,
  calculateSocialStats,
  createEmptyAttributes,
  getRemainingPoints,
} from '../../../../lib/character'
import {
  getCreatorActionHint,
  getCreatorValidations,
  getOriginSummaryValue,
} from '../guidance/creatorGuidance'
import { hydrateCreatorState } from '../hydration/hydrateState'
import { buildCharacterPayload } from '../payload/buildPayload'
import {
  INITIAL_IDENTITY,
  PATH_ORIGIN_MAP,
  STARTING_SKILL_POINTS,
} from '../config/creatorConfig'
import { createMutations } from '../mutations/createMutations'
import { createNavigation } from '../navigation/stepNavigation'
import {
  countAllocatedSkillPoints,
  createEmptyDetails,
  createEmptyLoadout,
  createEmptyResourceValues,
  createEmptySkills,
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

  const [identity, setIdentity] = useState(INITIAL_IDENTITY)
  const [attributeValues, setAttributeValues] = useState(createEmptyAttributes)
  const [details, setDetails] = useState(createEmptyDetails)
  const [loadout, setLoadout] = useState(createEmptyLoadout)
  const [skills, setSkills] = useState(createEmptySkills)
  const [resourceValues, setResourceValues] = useState(createEmptyResourceValues)
  const [wounds, setWounds] = useState([])
  const [progressionValues, setProgressionValues] = useState(() =>
    normalizeProgression(createProgression()),
  )
  const [saveMessage, setSaveMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [hydratedCharacterId, setHydratedCharacterId] = useState(null)

  const isEditing = Boolean(initialCharacter?._id)
  const selectedCalling = callings.find((entry) => entry.id === identity.callingId)
  const selectedOrigin = origins.find((entry) => entry.id === identity.originId)
  const selectedPath = originPaths.find((entry) => entry.id === identity.path)
  const rankedSpecializations = useMemo(
    () => getRankedSystemSpecializations(identity.callingId, skills, blueprint),
    [blueprint, identity.callingId, skills],
  )
  const activeSpecialization =
    rankedSpecializations.find((entry) => entry.id === progressionValues.specializationPath) ??
    getSystemSpecialization(progressionValues.specializationPath, blueprint)
  const recommendedSpecializations = rankedSpecializations.filter(
    (specialization) => specialization.recommendationScore > 0,
  )
  const advancementSpent = useMemo(
    () =>
      (activeSpecialization?.nodes ?? [])
        .filter((node) => progressionValues.unlockedNodes.includes(node.id))
        .reduce((total, node) => total + (node.cost ?? 0), 0),
    [activeSpecialization, progressionValues.unlockedNodes],
  )
  const finalAttributes = useMemo(
    () => applyAttributeBonus(attributeValues, selectedOrigin?.bonus),
    [attributeValues, selectedOrigin?.bonus],
  )
  const startingReputation = useMemo(
    () => getSystemOriginStartingReputation(identity.originId, blueprint),
    [blueprint, identity.originId],
  )
  const derivedStats = useMemo(() => calculateDerivedStats(finalAttributes), [finalAttributes])
  const socialStats = useMemo(() => calculateSocialStats(finalAttributes), [finalAttributes])
  const pairings = useMemo(() => blueprint?.catalogs?.pairings ?? [], [blueprint])
  const skillGroups = useMemo(
    () =>
      Object.entries(blueprint?.expandedSkillList ?? {}).map(([categoryKey, categorySkills]) => ({
        key: categoryKey,
        label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
        description: blueprint?.display?.pairingCategories?.[categoryKey]?.description ?? '',
        skills: categorySkills,
      })),
    [blueprint],
  )
  const pairingStats = useMemo(
    () => calculatePairingStats(finalAttributes, pairings),
    [finalAttributes, pairings],
  )
  const totalSkillPoints = useMemo(
    () => Math.max(STARTING_SKILL_POINTS, countAllocatedSkillPoints(initialCharacter?.skills ?? {})),
    [initialCharacter],
  )
  const allocatedSkillPoints = useMemo(() => countAllocatedSkillPoints(skills), [skills])
  const remainingSkillPoints = Math.max(0, totalSkillPoints - allocatedSkillPoints)
  const resourceMaximums = useMemo(() => {
    const generatedResources = createResources(finalAttributes, derivedStats)

    return {
      health: generatedResources.health.max,
      stamina: generatedResources.stamina.max,
      focus: generatedResources.focus.max,
      corruption: generatedResources.corruption.max,
      wounds: generatedResources.wounds.max,
    }
  }, [derivedStats, finalAttributes])
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
        remainingSkillPoints,
      }),
    [identity, isIdentityComplete, progressionValues, remainingPoints, remainingSkillPoints],
  )

  useEffect(() => {
    if (!initialCharacter?._id || !blueprint || hydratedCharacterId === initialCharacter._id) {
      return
    }

    const hydratedState = hydrateCreatorState({
      blueprint,
      initialCharacter,
      origins,
    })

    setIdentity(hydratedState.identity)
    setAttributeValues(hydratedState.attributeValues)
    setSkills(hydratedState.skills)
    setLoadout(hydratedState.loadout)
    setDetails(hydratedState.details)
    setResourceValues(hydratedState.resourceValues)
    setWounds(hydratedState.wounds)
    setProgressionValues(hydratedState.progressionValues)
    setHydratedCharacterId(initialCharacter._id)
  }, [blueprint, hydratedCharacterId, initialCharacter, origins])

  const {
    handleAddCustomAbility,
    handleAddWound,
    handleAttributeChange,
    handleCustomAbilityChange,
    handleDetailsChange,
    handleIdentityChange,
    handleLoadoutChange,
    handleProgressionChange,
    handleRemoveCustomAbility,
    handleRemoveWound,
    handleResourceChange,
    handleSkillRankChange,
    handleWoundChange,
  } = createMutations({
    activeSpecialization,
    resourceMaximums,
    setAttributeValues,
    setDetails,
    setIdentity,
    setLoadout,
    setProgressionValues,
    setResourceValues,
    setSaveMessage,
    setSkills,
    setWounds,
    totalSkillPoints,
  })

  async function handleSaveCharacter() {
    if (!onSaveCharacter || !validations.review) {
      return
    }

    const payload = buildCharacterPayload({
      details,
      derivedStats,
      finalAttributes,
      identity,
      initialCharacter,
      loadout,
      pairingStats,
      progressionValues,
      resourceValues,
      selectedCalling,
      selectedOrigin,
      selectedPath,
      skills,
      socialStats,
      startingReputation,
      trimmedName,
      wounds,
    })

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
    remainingSkillPoints,
    trimmedName,
    validations,
  })
  const originSummaryValue = getOriginSummaryValue(selectedOrigin, identity.path)
  const stepPropsById = {
    identity: {
      identity,
      onIdentityChange: handleIdentityChange,
    },
    calling: {
      identity,
      onIdentityChange: handleIdentityChange,
    },
    attributes: {
      attributeValues,
      onAttributeChange: handleAttributeChange,
    },
    skills: {
      skillGroups,
      skills,
      finalAttributes,
      remainingSkillPoints,
      totalSkillPoints,
      onSkillRankChange: handleSkillRankChange,
    },
    loadout: {
      loadout,
      onLoadoutChange: handleLoadoutChange,
      onCustomAbilityChange: handleCustomAbilityChange,
      onAddCustomAbility: handleAddCustomAbility,
      onRemoveCustomAbility: handleRemoveCustomAbility,
    },
    details: {
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
      progressionValues,
      specializations,
      activeSpecialization,
      recommendedSpecializations,
      rankedSpecializations,
      advancementSpent,
      onProgressionChange: handleProgressionChange,
    },
    review: {
      identity,
      attributeValues,
      derivedStats,
      socialStats,
      startingReputation,
      details,
      loadout,
      resourceValues,
      resourceMaximums,
      skills,
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
    derivedStats,
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
    handleSkillRankChange,
    handleWoundChange,
    identity,
    isEditing,
    isStepAccessible,
    loadout,
    originSummaryValue,
    progressionValues,
    rankedSpecializations,
    recommendedSpecializations,
    remainingPoints,
    remainingSkillPoints,
    resourceMaximums,
    resourceValues,
    saveMessage,
    selectedCalling,
    skillGroups,
    skills,
    socialStats,
    specializations,
    startingReputation,
    stepPropsById,
    totalSkillPoints,
    validations,
    wounds,
  }
}

export default useCreatorController
