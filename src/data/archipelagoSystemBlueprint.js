export const ARCHIPELAGO_SYSTEM_BLUEPRINT_VERSION = '2026-04-12'
export const ARCHIPELAGO_SYSTEM_BLUEPRINT_ENDPOINT = '/archipelago/system/blueprint'
export const ATTRIBUTE_KEYS = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']
export const ATTRIBUTE_POINTS = 12
export const ATTRIBUTE_CAP = 4

export const FALLBACK_ATTRIBUTES = [
  {
    key: 'might',
    name: 'Might',
    description: 'Raw power, endurance, and physical force.',
  },
  {
    key: 'agility',
    name: 'Agility',
    description: 'Reflexes, aim, speed, and evasive movement.',
  },
  {
    key: 'wit',
    name: 'Wit',
    description: 'Planning, observation, engineering, and tactics.',
  },
  {
    key: 'spirit',
    name: 'Spirit',
    description: 'Magic, emotion, relic strain, and the unseen.',
  },
  {
    key: 'resolve',
    name: 'Resolve',
    description: 'Willpower, grit, and resistance under pressure.',
  },
  {
    key: 'instinct',
    name: 'Instinct',
    description: 'Survival sense, navigation, and reading the world.',
  },
]

export const ARCHIPELAGO_SYSTEM_BLUEPRINT_NOTES = [
  'Canonical system blueprint lives on the backend so creator, sheet, and API can converge on one source of truth.',
  'This frontend module exists as the import point for future UI work that consumes the blueprint.',
]

function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getBlueprintAttributes(blueprint) {
  const properties = blueprint?.schema?.Attributes?.properties

  if (!properties) {
    return FALLBACK_ATTRIBUTES
  }

  const attributes = ATTRIBUTE_KEYS.map((key) => {
    const entry = properties[key]

    if (!entry) {
      return FALLBACK_ATTRIBUTES.find((attribute) => attribute.key === key)
    }

    return {
      key,
      name: titleCase(key),
      description: entry.description ?? FALLBACK_ATTRIBUTES.find((attribute) => attribute.key === key)?.description ?? '',
    }
  }).filter(Boolean)

  return attributes.length ? attributes : FALLBACK_ATTRIBUTES
}

export function getBlueprintAttributeMap(blueprint) {
  return getBlueprintAttributes(blueprint).reduce((attributeMap, attribute) => {
    attributeMap[attribute.key] = attribute
    return attributeMap
  }, {})
}
