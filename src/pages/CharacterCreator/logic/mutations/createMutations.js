import { getRemainingPoints } from '../../../../lib/character'
import { PATH_ORIGIN_MAP } from '../config/creatorConfig'
import {
  clampTrackValue,
  countAllocatedCorePoints,
  countAllocatedSkillPoints,
  createEmptyCustomAbility,
  createEmptyWound,
} from '../state/creatorState'

function shouldProfileSpecialtyPerf() {
  return Boolean(globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__)
}

export function createMutations({
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
}) {
  function clearSaveMessage() {
    setSaveMessage('')
  }

  function handleIdentityChange(field, value) {
    clearSaveMessage()

    setIdentity((current) => {
      if (field === 'path') {
        return {
          ...current,
          path: value,
          originId: value === 'archipelago' ? '' : PATH_ORIGIN_MAP[value] ?? '',
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  function handleAttributeChange(key, nextValue) {
    clearSaveMessage()

    setAttributeValues((current) => {
      const clampedValue = Math.max(0, Math.min(4, nextValue))
      const draft = { ...current, [key]: clampedValue }

      if (getRemainingPoints(draft) < 0) {
        return current
      }

      return draft
    })
  }

  function handleDetailsChange(field, value) {
    clearSaveMessage()
    setDetails((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleLoadoutChange(field, value) {
    clearSaveMessage()
    setLoadout((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCustomAbilityChange(index, field, value) {
    clearSaveMessage()
    setLoadout((current) => ({
      ...current,
      customAbilities: current.customAbilities.map((ability, abilityIndex) =>
        abilityIndex === index
          ? {
              ...ability,
              [field]: field === 'costAmount' ? Math.max(0, Number(value) || 0) : value,
            }
          : ability,
      ),
    }))
  }

  function handleAddCustomAbility() {
    clearSaveMessage()
    setLoadout((current) => ({
      ...current,
      customAbilities: [...current.customAbilities, createEmptyCustomAbility()],
    }))
  }

  function handleRemoveCustomAbility(index) {
    clearSaveMessage()
    setLoadout((current) => ({
      ...current,
      customAbilities:
        current.customAbilities.length === 1
          ? [createEmptyCustomAbility()]
          : current.customAbilities.filter((_, abilityIndex) => abilityIndex !== index),
    }))
  }

  function handleCoreCheckInvestmentChange(checkKey, nextValue) {
    clearSaveMessage()

    setProgressionValues((current) => {
      const currentInvestments = current.coreCheckInvestments ?? {}
      const clampedValue = Math.max(0, Math.min(20, Number(nextValue) || 0))
      const nextInvestments = {
        ...currentInvestments,
        [checkKey]: clampedValue,
      }

      if (countAllocatedCorePoints(nextInvestments) > totalCorePoints) {
        return current
      }

      return {
        ...current,
        coreCheckInvestments: nextInvestments,
      }
    })
  }

  function handleSkillRankChange(categoryKey, blueprintSkill, nextRank) {
    const profile = shouldProfileSpecialtyPerf()

    if (profile) {
      console.time(`handleSkillRankChange:${blueprintSkill.id}`)
    }

    clearSaveMessage()

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
  }

  function handleResourceChange(key, nextValue) {
    clearSaveMessage()
    setResourceValues((current) => ({
      ...current,
      [key]: clampTrackValue(nextValue, resourceMaximums[key] ?? Number.MAX_SAFE_INTEGER),
    }))
  }

  function handleProgressionChange(field, value) {
    clearSaveMessage()
    setProgressionValues((current) => {
      if (field === 'specializationPath') {
        const refundedAdvancement =
          current.advancementPoints +
          ((activeSpecialization?.nodes ?? [])
            .filter((node) => current.unlockedNodes.includes(node.id))
            .reduce((total, node) => total + (node.cost ?? 0), 0) ?? 0)

        return {
          ...current,
          advancementPoints: refundedAdvancement,
          specializationPath: value,
          unlockedNodes: [],
        }
      }

      return {
        ...current,
        [field]:
          field === 'rank' ||
          field === 'corePoints' ||
          field === 'specialtyPicks' ||
          field === 'advancementPoints'
            ? Math.max(field === 'rank' ? 1 : 0, Number(value) || 0)
            : value,
      }
    })
  }

  function handleWoundChange(index, field, value) {
    clearSaveMessage()
    setWounds((current) =>
      current.map((wound, woundIndex) =>
        woundIndex === index
          ? {
              ...wound,
              [field]: value,
            }
          : wound,
      ),
    )
  }

  function handleAddWound() {
    clearSaveMessage()
    setWounds((current) => [...current, createEmptyWound()])
  }

  function handleRemoveWound(index) {
    clearSaveMessage()
    setWounds((current) => current.filter((_, woundIndex) => woundIndex !== index))
  }

  return {
    clearSaveMessage,
    handleAddCustomAbility,
    handleAddWound,
    handleAttributeChange,
    handleCustomAbilityChange,
    handleDetailsChange,
    handleCoreCheckInvestmentChange,
    handleIdentityChange,
    handleLoadoutChange,
    handleProgressionChange,
    handleRemoveCustomAbility,
    handleRemoveWound,
    handleResourceChange,
    handleSkillRankChange,
    handleWoundChange,
  }
}
