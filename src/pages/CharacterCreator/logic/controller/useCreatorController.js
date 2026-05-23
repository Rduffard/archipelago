import { useCallback, useMemo, useState } from 'react'
import {
  getRankedSystemSpecializations,
  getSystemCallings,
  getSystemOrigins,
  getSystemOriginPaths,
  getSystemOriginStartingReputation,
  getSystemSpecialization,
  getSystemSpecializations,
} from '../../../../data/archipelagoSystemSelectors'
import { getCanonicalSkillGroups } from '../../../../data/archipelagoSkills'
import {
  calculateChecks,
  getLegacyDerivedStats,
  getLegacySocialStats,
} from '../../../../data/archipelagoChecks'
import {
  applyAttributeBonus,
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
  STARTING_CORE_POINTS,
  STARTING_SPECIALTY_PICKS,
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
  countAllocatedCorePoints,
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
  const [skills, setSkills] = useState(
    () => hydratedState?.skills ?? createEmptySkills(blueprint?.specialties ?? blueprint?.expandedSkillList ?? {}),
  )
  const [resourceValues, setResourceValues] = useState(
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
  const checks = useMemo(
    () => calculateChecks(finalAttributes, blueprint, progressionValues.coreCheckInvestments),
    [blueprint, finalAttributes, progressionValues.coreCheckInvestments],
  )
  const derivedStats = useMemo(() => getLegacyDerivedStats(checks), [checks])
  const socialStats = useMemo(() => getLegacySocialStats(checks), [checks])
  const skillGroups = useMemo(() => getCanonicalSkillGroups(blueprint), [blueprint])
  const totalCorePoints = useMemo(
    () =>
      Math.max(
        STARTING_CORE_POINTS,
        countAllocatedCorePoints(initialCharacter?.progression?.coreCheckInvestments ?? {}),
      ),
    [initialCharacter],
  )
  const totalSpecialtyPicks = useMemo(
    () => Math.max(STARTING_SPECIALTY_PICKS, countAllocatedSkillPoints(initialCharacter?.skills ?? {})),
    [initialCharacter],
  )
  const allocatedCorePoints = useMemo(
    () => countAllocatedCorePoints(progressionValues.coreCheckInvestments),
    [progressionValues.coreCheckInvestments],
  )
  const allocatedSpecialtyPicks = useMemo(() => countAllocatedSkillPoints(skills), [skills])
  const remainingCorePoints = Math.max(0, totalCorePoints - allocatedCorePoints)
  const remainingSpecialtyPicks = Math.max(0, totalSpecialtyPicks - allocatedSpecialtyPicks)
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
        remainingCorePoints,
        remainingSpecialtyPicks,
      }),
    [identity, isIdentityComplete, progressionValues, remainingCorePoints, remainingPoints, remainingSpecialtyPicks],
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
        setSkills,
        setWounds,
        totalCorePoints,
        totalSpecialtyPicks,
      }),
    [activeSpecialization, resourceMaximums, totalCorePoints, totalSpecialtyPicks],
  )
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
    handleCoreCheckInvestmentChange,
    handleWoundChange,
  } = mutations
  const handleSkillRankChange = useCallback(
    (categoryKey, blueprintSkill, nextRank) => {
      const profile = Boolean(globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__)

      if (profile) {
        console.time(`handleSkillRankChange:${blueprintSkill.id}`)
      }

      setSaveMessage('')
      setSkills((current) => {
        const clampedRank = Math.max(0, Math.min(blueprintSkill.maxRank ?? 3, nextRank))
        const currentGroup = current[categoryKey] ?? []
        const existingEntry = currentGroup.find((entry) => entry.id === blueprintSkill.id)
        const nextGroup =
          clampedRank === 0
            ? currentGroup.filter((entry) => entry.id !== blueprintSkill.id)
            : [
                ...currentGroup.filter((entry) => entry.id !== blueprintSkill.id),
                {
                  id: blueprintSkill.id,
                  rank: clampedRank,
                  specialty: existingEntry?.specialty ?? '',
                },
              ].sort((left, right) => left.id.localeCompare(right.id))
        const nextSkills = {
          ...current,
          [categoryKey]: nextGroup,
        }

        if (countAllocatedSkillPoints(nextSkills) > totalSpecialtyPicks) {
          if (profile) {
            console.timeEnd(`handleSkillRankChange:${blueprintSkill.id}`)
          }

          return current
        }

        if (profile) {
          console.timeEnd(`handleSkillRankChange:${blueprintSkill.id}`)
        }

        return nextSkills
      })
    },
    [totalSpecialtyPicks],
  )

  async function handleSaveCharacter() {
    if (!onSaveCharacter || !validations.review) {
      return
    }

    const payload = buildCharacterPayload({
      details,
      derivedStats,
      finalAttributes,
      checks,
      identity,
      initialCharacter,
      loadout,
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
    remainingCorePoints,
    remainingSpecialtyPicks,
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
      remainingCorePoints,
      remainingSpecialtyPicks,
      totalCorePoints,
      totalSpecialtyPicks,
      checks,
      coreCheckInvestments: progressionValues.coreCheckInvestments,
      onCoreCheckInvestmentChange: handleCoreCheckInvestmentChange,
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
      checks,
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
    checks,
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
    handleCoreCheckInvestmentChange,
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
    remainingCorePoints,
    remainingSpecialtyPicks,
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
    totalCorePoints,
    totalSpecialtyPicks,
    validations,
    wounds,
  }
}

export default useCreatorController
