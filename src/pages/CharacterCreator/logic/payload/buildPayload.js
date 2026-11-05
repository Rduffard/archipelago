import {
  clampTrackValue,
  createProgression,
  createResources,
} from '../state/creatorState'
import {
  formatAbilitySource,
  mapAbilityType,
  parseCustomAbilities,
  parseCustomTraitsText,
  parseEquipmentText,
  parseInventoryText,
  parseRelicsText,
  parseWounds,
  toSlug,
} from '../transforms/creatorTransforms'

function createIdentityTags(selectedPath, selectedOrigin, selectedCalling) {
  return [
    selectedPath
      ? {
          type: 'tag',
          key: `path-${selectedPath.id}`,
          label: selectedPath.name,
          mechanicalImpact: selectedPath.description ?? selectedPath.summary ?? '',
        }
      : null,
    selectedOrigin
      ? {
          type: 'trait',
          key: `origin-${selectedOrigin.id}`,
          label: selectedOrigin.identityTag || `${selectedOrigin.name} Born`,
          mechanicalImpact:
            selectedOrigin.identityTagDetail ||
            `${selectedOrigin.summary} ${selectedOrigin.passiveRule}`.trim(),
        }
      : null,
    selectedCalling
      ? {
          type: 'tag',
          key: `calling-${selectedCalling.id}`,
          label: selectedCalling.name,
          mechanicalImpact: `${selectedCalling.focus}. ${selectedCalling.description}`.trim(),
        }
      : null,
  ].filter(Boolean)
}

function createStarterAbilities(selectedCalling) {
  if (!selectedCalling) {
    return []
  }

  return [
    {
      id: `ability-${selectedCalling.id}-${toSlug(selectedCalling.starterAbility)}`,
      name: selectedCalling.starterAbility,
      type: mapAbilityType(selectedCalling.starterAbilityType),
      description: `${selectedCalling.starterAbilityType}. ${selectedCalling.starterAbilityRule}`,
      source: formatAbilitySource('calling'),
      cost: {
        resource: '',
        amount: 0,
      },
      scaling: {
        attribute: selectedCalling.primaryStats?.[0]?.toLowerCase() ?? '',
        skill: '',
      },
      tags: ['calling', 'starter', selectedCalling.id],
      effect: selectedCalling.starterAbilityRule,
    },
  ]
}

export function buildCharacterPayload({
  details,
  finalAttributes,
  attributeValues,
  identity,
  initialCharacter,
  loadout,
  progressionValues,
  resourceValues,
  selectedCalling,
  selectedOrigin,
  selectedPath,
  training,
  startingReputation,
  trimmedName,
  wounds,
}) {
  const rank = progressionValues.rank
  const generatedTraits = createIdentityTags(selectedPath, selectedOrigin, selectedCalling)
  const customTraits = parseCustomTraitsText(details.customTraitsText)
  const traits = [...generatedTraits, ...customTraits]
  const customAbilities = parseCustomAbilities(loadout.customAbilities)
  const abilities = [...(initialCharacter?._id ? createStarterAbilities(selectedCalling) : []), ...customAbilities]
  const isEditing = Boolean(initialCharacter?._id)
  const baseResources = isEditing
    ? Object.fromEntries(['health', 'stamina', 'focus', 'wounds', 'corruption'].map((key) => [key, initialCharacter.resources?.[key] ?? { current: null, max: null }]))
    : createResources(finalAttributes, 1)
  const activeWounds = parseWounds(wounds)
  const savedWoundCount = Math.max(resourceValues.wounds, activeWounds.length)
  const resources = {
    ...baseResources,
    health: {
      current: clampTrackValue(resourceValues.health, baseResources.health.max),
      max: baseResources.health.max,
    },
    wounds: {
      current: clampTrackValue(savedWoundCount, baseResources.wounds.max),
      max: baseResources.wounds.max,
      active: activeWounds,
    },
    stamina: {
      current: clampTrackValue(resourceValues.stamina, baseResources.stamina.max),
      max: baseResources.stamina.max,
    },
    focus: {
      current: clampTrackValue(resourceValues.focus, baseResources.focus.max),
      max: baseResources.focus.max,
    },
    corruption: {
      current: clampTrackValue(resourceValues.corruption, baseResources.corruption.max),
      max: baseResources.corruption.max,
    },
  }
  const progression = {
    ...createProgression(rank),
    rank: isEditing ? rank : 1,
    advancementPoints: progressionValues.advancementPoints,
    specializationPath: isEditing ? progressionValues.specializationPath.trim() : '',
    unlockedNodes: isEditing ? progressionValues.unlockedNodes : [],
  }

  return {
    name: trimmedName,
    pronouns: identity.pronouns.trim(),
    calling: identity.callingId,
    origin: identity.originId,
    identity: {
      background: {
        origin: selectedOrigin?.name ?? '',
        pastRole: details.pastRole.trim() || selectedCalling?.name || '',
        definingEvent:
          details.definingEvent.trim() || selectedPath?.summary || selectedOrigin?.summary || '',
      },
      tags: traits,
    },
    attributes: isEditing ? finalAttributes : attributeValues,
    reputation: startingReputation,
    training,
    abilities,
    resources: isEditing ? resources : { wounds: resources.wounds, corruption: resources.corruption },
    inventory: parseInventoryText(loadout.inventoryText),
    relics: parseRelicsText(loadout.relicsText),
    equipment: {
      weapons: parseEquipmentText(loadout.weaponsText, 'weapon'),
      armor: parseEquipmentText(loadout.armorText, 'armor'),
      techRelics: parseEquipmentText(loadout.techRelicsText, 'tech'),
      cargo: parseEquipmentText(loadout.cargoText, 'cargo'),
    },
    progression,
    notes: details.notes.trim(),
    portraitUrl: initialCharacter?.portraitUrl ?? '',
    campaignId: initialCharacter?.campaignId ?? null,
    status: initialCharacter?.status ?? 'active',
  }
}
