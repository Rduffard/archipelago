import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getRankedSystemSpecializations,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from '../../data/archipelagoSystemSelectors'
import { resolveCharacterSkillGroups } from '../../data/archipelagoSkills'
import { getCheckGroups, resolveCharacterChecks } from '../../data/archipelagoChecks'
import {
  getRollModifier,
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
  const rankedSpecializations = getRankedSystemSpecializations(character.calling, character.skills ?? {}, blueprint)
  const specialization =
    rankedSpecializations.find((entry) => entry.id === progression.specializationPath) ??
    getSystemSpecialization(progression.specializationPath, blueprint)
  const recommendedSpecializations = rankedSpecializations.filter((entry) => entry.recommendationScore > 0)
  const advancementSpent =
    specialization?.nodes
      ?.filter((node) => progression.unlockedNodes?.includes(node.id))
      .reduce((total, node) => total + (node.cost ?? 0), 0) ?? 0

  return [
    {
      key: 'progression-rank',
      label: 'Rank',
      meta: 'Progression',
      value: progression.rank ?? 1,
      detail: 'The character tier that gates advancement, durability, and long-term system growth.',
    },
    {
      key: 'progression-skill-points',
      label: 'Skill Points',
      meta: 'Banked',
      value: progression.skillPoints ?? 0,
      detail: 'Unspent points available for skill growth.',
    },
    {
      key: 'progression-advancement-points',
      label: 'Advancement Points',
      meta: 'Banked',
      value: progression.advancementPoints ?? 0,
      detail: 'Campaign-earned advancement currency waiting to be invested.',
    },
    {
      key: 'progression-advancement-invested',
      label: 'Advancement Invested',
      meta: 'Spent',
      value: advancementSpent,
      detail: 'Total advancement already committed into the active specialization path.',
    },
    {
      key: 'progression-specialization',
      label: 'Specialization Path',
      meta: 'Path',
      value: specialization?.name || progression.specializationPath || 'Unchosen',
      detail:
        [
          specialization ? specialization.summary : null,
          specialization?.recommendationReasons?.length
            ? `Why it fits: ${specialization.recommendationReasons.join(', ')}`
            : null,
          !specialization && recommendedSpecializations.length
            ? `Suggested paths: ${recommendedSpecializations.map((entry) => entry.name).join(', ')}`
            : null,
          !specialization && !recommendedSpecializations.length && progression.specializationPath
            ? `Current path: ${progression.specializationPath}`
            : null,
          !specialization && !recommendedSpecializations.length && !progression.specializationPath
            ? 'No specialization path recorded yet.'
            : null,
        ]
          .filter(Boolean)
          .join('\n\n'),
    },
    {
      key: 'progression-unlocked-nodes',
      label: 'Unlocked Nodes',
      meta: 'Progression',
      value: progression.unlockedNodes?.length ?? 0,
      detail: progression.unlockedNodes?.length
        ? progression.unlockedNodes
            .map((nodeId) => {
              const node = getSystemSpecializationNode(progression.specializationPath, nodeId, blueprint)
              return node ? `${node.name}\n${node.effect}` : nodeId
            })
            .join('\n\n')
        : 'No unlocked nodes recorded yet.',
    },
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

  if (!calling?.starterAbility) {
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

export function getSkillGroups(character, expandedSkillList = {}) {
  return resolveCharacterSkillGroups({
    characterSkills: character.skills ?? {},
    expandedSkillList,
    includeUntrained: true,
  })
}

export function getCharacterCheckStats(character, blueprint) {
  return resolveCharacterChecks(character, blueprint)
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

export function getTrackerValue(resource, fallbackCurrent, fallbackMax) {
  if (typeof resource === 'number') {
    return {
      current: resource,
      max: fallbackMax,
    }
  }

  return {
    current: resource?.current ?? fallbackCurrent,
    max: resource?.max ?? fallbackMax,
  }
}

export function buildReferenceGroups({
  blueprint,
  character,
  derivedStatDetails,
  pairingCategoryDetails,
}) {
  const checkStats = getCharacterCheckStats(character, blueprint)
  const legacyDetails = {
    ...derivedStatDetails,
  }

  return getCheckGroups(blueprint)
    .map((group) => ({
      key: group.key,
      ...pairingCategoryDetails[group.key],
      label: pairingCategoryDetails[group.key]?.label ?? group.label,
      entries: group.checks.map((check) => {
        const score = checkStats[check.key] ?? 10
        const legacyDetail = legacyDetails[check.key]

        return {
          key: check.key,
          label: check.name,
          value: score,
          modifier: getRollModifier(score),
          detail: [
            check.summary ?? legacyDetail?.description ?? 'A core gameplay check available to every character.',
            `Formula: ${check.formulaLabel}`,
            `Roll Modifier: ${getRollModifier(score)}`,
            check.examples?.length ? `Examples: ${check.examples.join(', ')}` : null,
            'Skills do not replace this check; trained skills may modify it when the fiction fits.',
          ]
            .filter(Boolean)
            .join('\n\n'),
        }
      }),
    }))
    .filter((group) => group.entries.length)
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
