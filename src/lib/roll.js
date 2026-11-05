import { calculateCheckModifier } from './checkModifier.js'
import { proficiencyBonus } from './training.js'

export const rollAttributes = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']
export const signed = value => `${value >= 0 ? '+' : '−'}${Math.abs(value)}`
export function skillIsTrained(character, id) {
  return character.trainingRulesVersion === 1 && (character.training ?? []).includes(id)
}
export function createRoll({ character, type, name, attribute, skillId }, random = Math.random) {
  if (!['attribute', 'skill', 'save'].includes(type)) throw new Error('Unknown roll type')
  const modifier = calculateCheckModifier(character.attributes, attribute)
  const proficient = type === 'skill' ? skillIsTrained(character, skillId)
    : type === 'save' && (character.advancement?.savingThrows ?? []).includes(attribute)
  const proficiency = proficient ? proficiencyBonus(character.progression?.rank) : 0
  const sample = random()
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new Error('Invalid die source')
  const natural = Math.floor(sample * 20) + 1
  return { type, name, attribute, modifier, proficiency, natural, total: natural + modifier + proficiency }
}
export function rollTone(natural) {
  return natural === 20 ? 'high' : natural === 1 ? 'low' : 'normal'
}
