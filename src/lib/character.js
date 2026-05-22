import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_POINTS,
  FALLBACK_ATTRIBUTES,
} from '../data/archipelagoSystemBlueprint'

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
