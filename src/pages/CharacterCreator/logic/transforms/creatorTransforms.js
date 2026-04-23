import { createEmptyAttributes, parseAttributeBonus } from '../../../../lib/character'
import {
  createEmptyCustomAbility,
  createEmptySkills,
  removeAttributeBonus,
} from '../state/creatorState'

export function toSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function mapAbilityType(typeLabel = '') {
  const normalized = typeLabel.trim().toLowerCase()

  if (normalized === 'reaction') {
    return 'reaction'
  }

  if (normalized === 'passive') {
    return 'passive'
  }

  return 'active'
}

export function formatAbilitySource(source = '') {
  const normalized = source.trim().toLowerCase()

  if (['calling', 'origin', 'relic', 'custom'].includes(normalized)) {
    return normalized
  }

  return 'custom'
}

export function normalizeSkills(initialSkills = {}, expandedSkillList = {}) {
  return Object.keys(expandedSkillList).reduce((skills, categoryKey) => {
    const savedSkills = initialSkills?.[categoryKey] ?? []
    skills[categoryKey] = savedSkills
      .filter((skill) => expandedSkillList[categoryKey].some((entry) => entry.id === skill.id))
      .map((skill) => ({
        ...skill,
        rank: Math.max(0, Math.min(3, skill.rank ?? 0)),
        specialty: skill.specialty ?? '',
      }))
    return skills
  }, createEmptySkills())
}

export function normalizeCustomAbilities(abilities = []) {
  const normalizedAbilities = abilities
    .filter((ability) => ability?.source !== 'calling')
    .map((ability) => ({
      name: ability.name ?? '',
      source: formatAbilitySource(ability.source),
      type: mapAbilityType(ability.type),
      costResource: ability.cost?.resource ?? '',
      costAmount: ability.cost?.amount ?? 0,
      scalingAttribute: ability.scaling?.attribute ?? '',
      scalingSkill: ability.scaling?.skill ?? '',
      tagsText: Array.isArray(ability.tags) ? ability.tags.join(', ') : '',
      effect: ability.effect || ability.description || '',
    }))

  return normalizedAbilities.length ? normalizedAbilities : [createEmptyCustomAbility()]
}

export function parseCustomAbilityTags(tagsText = '') {
  const parsedTags = tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return parsedTags.length ? parsedTags : ['custom']
}

export function parseCustomAbilities(customAbilities = []) {
  return customAbilities
    .map((ability, index) => {
      const name = ability.name.trim()
      const effect = ability.effect.trim()

      if (!name && !effect) {
        return null
      }

      return {
        id: `ability-custom-${toSlug(name || `entry-${index + 1}`)}`,
        name: name || `Custom Ability ${index + 1}`,
        type: mapAbilityType(ability.type),
        description: effect,
        source: formatAbilitySource(ability.source),
        cost: {
          resource: ability.costResource ?? '',
          amount: Math.max(0, Number(ability.costAmount) || 0),
        },
        scaling: {
          attribute: ability.scalingAttribute ?? '',
          skill: ability.scalingSkill?.trim() ?? '',
        },
        tags: parseCustomAbilityTags(ability.tagsText),
        effect,
      }
    })
    .filter(Boolean)
}

export function formatEquipmentText(items = []) {
  return items.map((item) => [item.name, item.description || ''].join(' | ')).join('\n')
}

export function parseEquipmentText(text = '', type) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const description = descriptionParts.join('|').trim()

      return {
        id: `${type}-${toSlug(name || `entry-${index + 1}`)}`,
        name: name || `${type} ${index + 1}`,
        type,
        skillLinks: [],
        tags: [],
        grants: [],
        description,
      }
    })
}

export function formatInventoryText(items = []) {
  return items.map((item) => [item.name, item.quantity ?? 1, item.description || ''].join(' | ')).join('\n')
}

export function parseInventoryText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', quantityPart = '1', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const quantity = Number(quantityPart.trim()) || 1
      const description = descriptionParts.join('|').trim()

      return {
        name: name || `Item ${index + 1}`,
        quantity: Math.max(1, quantity),
        description,
      }
    })
}

export function formatRelicsText(relics = []) {
  return relics
    .map((relic) => [relic.name, relic.bonded ? 'yes' : 'no', relic.description || ''].join(' | '))
    .join('\n')
}

export function parseRelicsText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', bondedPart = 'no', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const bonded = ['yes', 'true', 'bonded', 'y'].includes(bondedPart.trim().toLowerCase())
      const description = descriptionParts.join('|').trim()

      return {
        name: name || `Relic ${index + 1}`,
        bonded,
        description,
      }
    })
}

export function normalizeWounds(wounds = []) {
  return wounds.length
    ? wounds.map((wound) => ({
        name: wound.name ?? '',
        severity: wound.severity ?? 'minor',
        statPenalty: wound.statPenalty ?? '',
        description: wound.description ?? '',
      }))
    : []
}

export function parseWounds(wounds = []) {
  return wounds
    .map((wound) => {
      const name = wound.name.trim()

      if (!name) {
        return null
      }

      return {
        name,
        severity: wound.severity || 'minor',
        statPenalty: wound.statPenalty || null,
        description: wound.description.trim(),
      }
    })
    .filter(Boolean)
}

export function getCreatorIdentity(character, origin) {
  return {
    name: character?.name ?? '',
    pronouns: character?.pronouns ?? '',
    callingId: character?.calling ?? '',
    path: origin?.path ?? '',
    originId: character?.origin ?? '',
  }
}

export function formatCustomTraitsText(traits = []) {
  return traits
    .map((trait) =>
      trait.mechanicalImpact ? `${trait.label} | ${trait.mechanicalImpact}` : trait.label,
    )
    .join('\n')
}

export function parseCustomTraitsText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelPart, ...impactParts] = line.split('|')
      const label = labelPart.trim()
      const mechanicalImpact = impactParts.join('|').trim()

      return {
        type: 'trait',
        key: `custom-trait-${toSlug(label || `entry-${index + 1}`)}`,
        label: label || `Trait ${index + 1}`,
        mechanicalImpact,
      }
    })
}

export function getGeneratedTraitKeys(pathId, originId, callingId) {
  return new Set([`path-${pathId}`, `origin-${originId}`, `calling-${callingId}`].filter(Boolean))
}

export function removeOriginBonus(attributes, originBonus) {
  return removeAttributeBonus(
    attributes ?? createEmptyAttributes(),
    originBonus,
    parseAttributeBonus,
  )
}
