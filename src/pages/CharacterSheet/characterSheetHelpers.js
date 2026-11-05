import { proficiencyBonus } from '../../lib/training.js'
import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from '../../data/archipelagoSystemSelectors'
import {
  parseAttributeBonus,
} from '../../lib/character'

export const ATTRIBUTE_KEYS = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']
export function titleCase(value = '') {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getCharacterReputation(character) {
  return character?.reputation
}

export function getTraitEntries(character, calling, origin) {
  const savedTraits = (character.identity?.tags ?? []).map((trait) => ({
    label: trait.label,
    source: titleCase(trait.type || 'tag'),
    detail: trait.mechanicalImpact || 'No mechanical notes recorded yet.',
    tone: trait.type === 'scar' ? 'negative' : 'default',
  }))

  const structuredTraits = [
    calling?.passive
      ? {
          label: calling.passive,
          source: 'Calling Passive',
          detail: calling.passiveRule,
          tone: 'default',
        }
      : null,
    origin?.passive
      ? {
          label: origin.passive,
          source: 'Origin Passive',
          detail: origin.passiveRule,
          tone: 'default',
        }
      : null,
    origin?.drawback
      ? {
          label: origin.drawback,
          source: 'Origin Drawback',
          detail: origin.drawbackRule,
          tone: 'negative',
        }
      : null,
  ].filter(Boolean)

  return [...savedTraits, ...structuredTraits]
}

export function getIdentityEntries(character) {
  const background = character.identity?.background ?? {}

  return [
    background.origin
      ? {
          key: 'background-origin',
          label: 'Origin',
          meta: 'Background',
          detail: background.origin,
        }
      : null,
    background.pastRole
      ? {
          key: 'background-past-role',
          label: 'Past Role',
          meta: 'Background',
          detail: background.pastRole,
        }
      : null,
    background.definingEvent
      ? {
          key: 'background-defining-event',
          label: 'Defining Event',
          meta: 'Background',
          detail: background.definingEvent,
        }
      : null,
    ...(character.identity?.tags ?? []).map((tag) => ({
      key: `identity-tag-${tag.key}`,
      label: tag.label,
      meta: titleCase(tag.type || 'tag'),
      detail: tag.mechanicalImpact || 'No identity effect recorded yet.',
    })),
  ].filter(Boolean)
}

export function getProgressionEntries(character, blueprint) {
  const progression = character.progression ?? {}
  const level = progression.rank ?? 1
  const path = getSystemSpecialization(progression.specializationPath, blueprint)
  let bonus = 'Unavailable'
  try { bonus = `+${proficiencyBonus(level)}` } catch { /* Historical invalid level. */ }
  return [
    { key: 'level', label: 'Level', value: level, detail: 'Character level.' },
    { key: 'proficiency', label: 'Proficiency Bonus', value: bonus, detail: 'Derived from level; added at most once when relevant Training applies.' },
    { key: 'path', label: 'Specialized Path', value: path?.name ?? progression.specializationPath ?? 'Unchosen', detail: `${path?.summary ?? ''} Path advancement is unavailable pending progression rules.` },
    { key: 'nodes', label: 'Recorded Path Nodes', value: progression.unlockedNodes?.length ?? 0,
      detail: (progression.unlockedNodes ?? []).map((id) => { const node = getSystemSpecializationNode(progression.specializationPath, id, blueprint); return node ? `${node.name}: ${node.effect}` : id }).join('\n') || 'No nodes recorded.' },
  ]
}

export function getAbilityEntries(character, calling) {
  if (character.abilities?.length) {
    return character.abilities.map((ability) => ({
      label: ability.name,
      source: titleCase(ability.source),
      detail:
        [
          ability.type ? `Type: ${titleCase(ability.type)}` : null,
          ability.cost?.resource
            ? `Cost: ${ability.cost.amount ?? 0} ${titleCase(ability.cost.resource)}`
            : null,
          ability.scaling?.skill || ability.scaling?.attribute
            ? `Scaling: ${[ability.scaling?.attribute, ability.scaling?.skill].filter(Boolean).map(titleCase).join(' + ')}`
            : null,
          ability.tags?.length ? `Tags: ${ability.tags.map(titleCase).join(', ')}` : null,
          ability.effect || ability.description || 'No ability description yet.',
        ]
          .filter(Boolean)
          .join('\n\n'),
    }))
  }

  if (character.advancement || !calling?.starterAbility) {
    return []
  }

  return [
    {
      label: calling.starterAbility,
      source: 'Calling',
      detail: `${calling.starterAbilityType}. ${calling.starterAbilityRule}`,
    },
  ]
}

export function getCatalogGroups(character) {
  const woundEntries = character.resources?.wounds?.active ?? []
  const equipmentGroups = [
    {
      key: 'weapons',
      title: 'Weapons',
      empty: 'No weapons recorded yet.',
      entries: (character.equipment?.weapons ?? []).map((item) => ({
        label: item.name,
        meta: 'Weapon',
        detail: item.description || 'No weapon notes yet.',
      })),
    },
    {
      key: 'armor',
      title: 'Armor',
      empty: 'No armor recorded yet.',
      entries: (character.equipment?.armor ?? []).map((item) => ({
        label: item.name,
        meta: 'Armor',
        detail: item.description || 'No armor notes yet.',
      })),
    },
    {
      key: 'techRelics',
      title: 'Tech / Relics',
      empty: 'No tech or relic gear recorded yet.',
      entries: (character.equipment?.techRelics ?? []).map((item) => ({
        label: item.name,
        meta: 'Gear',
        detail: item.description || 'No tech or relic notes yet.',
      })),
    },
    {
      key: 'cargo',
      title: 'Cargo',
      empty: 'No cargo recorded yet.',
      entries: (character.equipment?.cargo ?? []).map((item) => ({
        label: item.name,
        meta: 'Cargo',
        detail: item.description || 'No cargo notes yet.',
      })),
    },
  ]

  return [
    ...equipmentGroups,
    {
      key: 'inventory',
      title: 'Inventory',
      empty: 'No inventory recorded yet.',
      entries: (character.inventory ?? []).map((item) => ({
        label: item.name,
        meta: `x${item.quantity}`,
        detail: item.description || 'No inventory notes yet.',
      })),
    },
    {
      key: 'relics',
      title: 'Relics',
      empty: 'No relics recorded yet.',
      entries: (character.relics ?? []).map((relic) => ({
        label: relic.name,
        meta: relic.bonded ? 'Bonded' : 'Unbonded',
        detail: relic.description || 'No relic notes yet.',
      })),
    },
    {
      key: 'wounds',
      title: 'Wounds',
      empty: 'No wounds recorded yet.',
      entries: woundEntries.map((wound) => ({
        label: wound.name,
        meta: titleCase(wound.severity),
        detail: `${wound.description || 'No wound description yet.'}${
          wound.statPenalty ? ` Penalty: ${titleCase(wound.statPenalty)}.` : ''
        }`,
        tone: 'negative',
      })),
    },
  ]
}

export function toReferenceEntries(items, config = {}) {
  return items.map((item, index) => ({
    key: item.key ?? `${config.prefix ?? 'entry'}-${index}`,
    label: item.label,
    meta: item.meta,
    value: item.value ?? item.source ?? item.score ?? '',
    modifier: item.modifier,
    detail: item.detail,
  }))
}

export function getTrackerValue(resource) {
  return Number.isFinite(resource?.current) && Number.isFinite(resource?.max)
    ? { current: resource.current, max: resource.max }
    : { current: null, max: null }
}

export function buildReputationEntries(character, blueprint) {
  return getActiveSystemReputationEntries(
    getCharacterReputation(character) ?? getSystemOriginStartingReputation(character?.origin, blueprint),
    blueprint,
  ).map(([trackKey, score]) => {
    const track = getSystemReputationTrack(trackKey, blueprint)
    const tier = getSystemReputationTier(score, blueprint)

    return {
      key: trackKey,
      label: track?.name ?? trackKey,
      meta: score > 0 ? 'Trusted' : 'Distrusted',
      value: formatSystemReputationScore(score),
      detail: `${tier.label}. ${tier.effect}\n\n${track?.scope ?? 'No scope notes yet.'}`,
    }
  })
}

export function getOriginBonus(origin) {
  return parseAttributeBonus(origin?.bonus)
}
