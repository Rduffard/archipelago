import { attributes, ATTRIBUTE_POINTS } from '../data/gameData'

export function createEmptyAttributes() {
  return attributes.reduce((accumulator, attribute) => {
    accumulator[attribute.key] = 0
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
