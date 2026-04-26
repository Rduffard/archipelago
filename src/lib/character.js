import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_POINTS,
  FALLBACK_ATTRIBUTES,
} from '../data/archipelagoSystemBlueprint'

const DEFAULT_PAIRING_FORMULAS = [
  { key: 'skirmish', attributes: ['might', 'agility'] },
  { key: 'leverage', attributes: ['might', 'wit'] },
  { key: 'conviction', attributes: ['might', 'spirit'] },
  { key: 'pressure', attributes: ['might', 'resolve'] },
  { key: 'pursuit', attributes: ['might', 'instinct'] },
  { key: 'precision', attributes: ['agility', 'wit'] },
  { key: 'flourish', attributes: ['agility', 'spirit'] },
  { key: 'balance', attributes: ['agility', 'resolve'] },
  { key: 'reflex', attributes: ['agility', 'instinct'] },
  { key: 'guile', attributes: ['wit', 'spirit'] },
  { key: 'tactics', attributes: ['wit', 'resolve'] },
  { key: 'sense', attributes: ['wit', 'instinct'] },
  { key: 'grace', attributes: ['spirit', 'resolve'] },
  { key: 'attunement', attributes: ['spirit', 'instinct'] },
  { key: 'nerve', attributes: ['resolve', 'instinct'] },
]

export function createEmptyAttributes() {
  return ATTRIBUTE_KEYS.reduce((accumulator, key) => {
    accumulator[key] = 0
    return accumulator
  }, {})
}

export function getSpentPoints(attributeValues) {
  return Object.values(attributeValues).reduce((total, value) => total + value, 0)
}

export function getRemainingPoints(attributeValues) {
  return ATTRIBUTE_POINTS - getSpentPoints(attributeValues)
}

export function calculateDerivedStats(attributeValues) {
  return {
    vitality: 10 + attributeValues.might + attributeValues.resolve,
    guard: 10 + attributeValues.agility,
    initiative: 10 + attributeValues.agility + attributeValues.instinct,
    focus: 10 + attributeValues.spirit + attributeValues.resolve,
  }
}

export function calculateSocialStats(attributeValues) {
  return {
    grace: 10 + attributeValues.resolve + attributeValues.spirit,
    guile: 10 + attributeValues.wit + attributeValues.spirit,
    pressure: 10 + attributeValues.might + attributeValues.resolve,
  }
}

export function calculatePairingStats(attributeValues, pairings = DEFAULT_PAIRING_FORMULAS) {
  return pairings.reduce((pairingStats, pairing) => {
    const [leftAttribute, rightAttribute] = pairing.attributes
    pairingStats[pairing.key] = 10 + (attributeValues[leftAttribute] ?? 0) + (attributeValues[rightAttribute] ?? 0)
    return pairingStats
  }, {})
}

export function getRollModifier(score) {
  const modifier = Number(score ?? 0) - 10
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

export function getAttributeLabel(attributeKey) {
  return FALLBACK_ATTRIBUTES.find((attribute) => attribute.key === attributeKey)?.name ?? attributeKey
}

export function getStatLabel(statKey) {
  return statKey
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function parseAttributeBonus(bonusText = '') {
  const match = bonusText.match(/^([+-]?\d+)\s+(.+)$/)

  if (!match) {
    return null
  }

  const amount = Number(match[1])
  const label = match[2].trim()
  const attribute = FALLBACK_ATTRIBUTES.find((entry) => entry.name.toLowerCase() === label.toLowerCase())

  if (!attribute || Number.isNaN(amount)) {
    return null
  }

  return {
    amount,
    key: attribute.key,
    label: attribute.name,
  }
}

export function applyAttributeBonus(attributeValues, bonusText = '') {
  const parsedBonus = parseAttributeBonus(bonusText)

  if (!parsedBonus) {
    return attributeValues
  }

  return {
    ...attributeValues,
    [parsedBonus.key]: (attributeValues[parsedBonus.key] ?? 0) + parsedBonus.amount,
  }
}
