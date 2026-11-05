import { createPointBuyAttributes, calculateRemainingPointBuyPoints } from './pointBuy.js'
export { applyAttributeBonus, parseAttributeBonus, getAttributeLabel } from './character.js'
export const createEmptyAttributes = createPointBuyAttributes
export function getRemainingPoints(attributes) {
  try { return calculateRemainingPointBuyPoints(attributes) }
  catch { return -1 }
}
