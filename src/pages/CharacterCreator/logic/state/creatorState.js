import { createEmptyAttributes } from '../../../../lib/character'

export function createEmptyDetails() {
  return {
    pastRole: '',
    definingEvent: '',
    notes: '',
    customTraitsText: '',
  }
}

export function createEmptyCustomAbility() {
  return {
    name: '',
    source: 'custom',
    type: 'active',
    costResource: '',
    costAmount: 0,
    scalingAttribute: '',
    scalingSkill: '',
    tagsText: '',
    effect: '',
  }
}

export function createEmptyLoadout() {
  return {
    customAbilities: [createEmptyCustomAbility()],
    weaponsText: '',
    armorText: '',
    techRelicsText: '',
    cargoText: '',
    inventoryText: '',
    relicsText: '',
  }
}

export function createEmptyResourceValues() {
  return {
    health: 0,
    stamina: 0,
    focus: 0,
    corruption: 0,
    wounds: 0,
  }
}

export function createEmptySkills() {
  return {
    combat: [],
    social: [],
    exploration: [],
    utility: [],
    arcane: [],
  }
}

export function countAllocatedSkillPoints(skills = {}) {
  return Object.values(skills).reduce(
    (total, entries) => total + (entries ?? []).reduce((groupTotal, skill) => groupTotal + (skill.rank ?? 0), 0),
    0,
  )
}

export function createEmptyWound() {
  return {
    name: '',
    severity: 'minor',
    statPenalty: '',
    description: '',
  }
}

export function createResources(attributes, derivedStats) {
  const staminaMax = 4 + (attributes.might ?? 0) + (attributes.agility ?? 0)
  const focusMax = Math.max(0, (derivedStats.focus ?? 10) - 10)
  const woundMax = Math.max(3, 2 + Math.ceil((attributes.resolve ?? 0) / 2))

  return {
    health: {
      current: derivedStats.vitality ?? 0,
      max: derivedStats.vitality ?? 0,
    },
    wounds: {
      current: 0,
      max: woundMax,
      active: [],
    },
    stamina: {
      current: staminaMax,
      max: staminaMax,
    },
    focus: {
      current: focusMax,
      max: focusMax,
    },
    corruption: {
      current: 0,
      max: 6,
    },
  }
}

export function clampTrackValue(value, max) {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.max(0, Math.min(max, numericValue))
}

export function createProgression(rank = 1) {
  return {
    rank,
    skillPoints: 0,
    advancementPoints: 0,
    specializationPath: '',
    unlockedNodes: [],
  }
}

export function normalizeProgression(progression = {}) {
  return {
    rank: Math.max(1, Number(progression.rank) || 1),
    skillPoints: Math.max(0, Number(progression.skillPoints) || 0),
    advancementPoints: Math.max(0, Number(progression.advancementPoints) || 0),
    specializationPath: progression.specializationPath ?? '',
    unlockedNodes: progression.unlockedNodes ?? [],
  }
}

export function removeAttributeBonus(attributeValues, bonusText = '', parseAttributeBonus) {
  const parsedBonus = parseAttributeBonus(bonusText)

  if (!parsedBonus) {
    return attributeValues
  }

  return {
    ...createEmptyAttributes(),
    ...attributeValues,
    [parsedBonus.key]: Math.max(0, (attributeValues?.[parsedBonus.key] ?? 0) - parsedBonus.amount),
  }
}
