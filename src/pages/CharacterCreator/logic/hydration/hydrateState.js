import { createEmptyAttributes } from '../../../../lib/character'
import {
  createEmptySkills,
  createProgression,
  createResources,
  normalizeProgression,
} from '../state/creatorState'
import {
  formatCustomTraitsText,
  formatEquipmentText,
  formatInventoryText,
  formatRelicsText,
  getCreatorIdentity,
  getGeneratedTraitKeys,
  normalizeCustomAbilities,
  normalizeSkills,
  normalizeWounds,
  removeOriginBonus,
} from '../transforms/creatorTransforms'

export function hydrateCreatorState({
  blueprint,
  initialCharacter,
  origins,
}) {
  const initialOrigin =
    origins.find((entry) => entry.id === initialCharacter.origin) ??
    origins.find((entry) => entry.name === initialCharacter.identity?.background?.origin) ??
    null
  const generatedTraitKeys = getGeneratedTraitKeys(
    initialOrigin?.path,
    initialCharacter.origin,
    initialCharacter.calling,
  )
  const customTraits = (initialCharacter.identity?.tags ?? []).filter(
    (trait) => !generatedTraitKeys.has(trait.key),
  )
  const fallbackResources = createResources(
    initialCharacter.attributes ?? createEmptyAttributes(),
    initialCharacter.derivedStats ?? {},
  )

  return {
    identity: getCreatorIdentity(initialCharacter, initialOrigin),
    attributeValues: removeOriginBonus(initialCharacter.attributes, initialOrigin?.bonus),
    skills: normalizeSkills(
      initialCharacter.skills ?? createEmptySkills(),
      blueprint?.expandedSkillList ?? {},
    ),
    loadout: {
      customAbilities: normalizeCustomAbilities(initialCharacter.abilities ?? []),
      weaponsText: formatEquipmentText(initialCharacter.equipment?.weapons ?? []),
      armorText: formatEquipmentText(initialCharacter.equipment?.armor ?? []),
      techRelicsText: formatEquipmentText(initialCharacter.equipment?.techRelics ?? []),
      cargoText: formatEquipmentText(initialCharacter.equipment?.cargo ?? []),
      inventoryText: formatInventoryText(initialCharacter.inventory ?? []),
      relicsText: formatRelicsText(initialCharacter.relics ?? []),
    },
    details: {
      pastRole: initialCharacter.identity?.background?.pastRole ?? '',
      definingEvent: initialCharacter.identity?.background?.definingEvent ?? '',
      notes: initialCharacter.notes ?? '',
      customTraitsText: formatCustomTraitsText(customTraits),
    },
    resourceValues: {
      health: initialCharacter.resources?.health?.current ?? fallbackResources.health.current,
      stamina: initialCharacter.resources?.stamina?.current ?? fallbackResources.stamina.current,
      focus: initialCharacter.resources?.focus?.current ?? fallbackResources.focus.current,
      corruption:
        initialCharacter.resources?.corruption?.current ?? fallbackResources.corruption.current,
      wounds: initialCharacter.resources?.wounds?.current ?? 0,
    },
    wounds: normalizeWounds(initialCharacter.resources?.wounds?.active ?? []),
    progressionValues: normalizeProgression(initialCharacter.progression ?? createProgression()),
  }
}
