import { getRemainingPoints } from '../../../../lib/character'
import { PATH_ORIGIN_MAP } from '../config/creatorConfig'
import {
  clampTrackValue,
  countAllocatedSkillPoints,
  createEmptyCustomAbility,
  createEmptyWound,
} from '../state/creatorState'

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
  totalSkillPoints,
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

  function handleSkillRankChange(categoryKey, blueprintSkill, nextRank) {
    clearSaveMessage()

    setSkills((current) => {
      const clampedRank = Math.max(0, Math.min(3, nextRank))
      const currentGroup = current[categoryKey] ?? []
      const existingEntry = currentGroup.find((entry) => entry.id === blueprintSkill.id)
      const nextGroup =
        clampedRank === 0
          ? currentGroup.filter((entry) => entry.id !== blueprintSkill.id)
          : [
              ...currentGroup.filter((entry) => entry.id !== blueprintSkill.id),
              {
                id: blueprintSkill.id,
                name: blueprintSkill.name,
                rank: clampedRank,
                linkedAttributes: blueprintSkill.linkedAttributes ?? [],
                specialty: existingEntry?.specialty ?? '',
              },
            ].sort((left, right) => left.name.localeCompare(right.name))

      const nextSkills = {
        ...current,
        [categoryKey]: nextGroup,
      }

      if (countAllocatedSkillPoints(nextSkills) > totalSkillPoints) {
        return current
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
          field === 'rank' || field === 'skillPoints' || field === 'advancementPoints'
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
