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
import {
  calculatePairingStats,
  getRollModifier,
  parseAttributeBonus,
} from '../../lib/character'

export const ATTRIBUTE_KEYS = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']
export const PAIRING_CATEGORY_ORDER = ['combat', 'social', 'exploration', 'utility', 'arcane']

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

export function getCharacterPairingStats(character, pairings) {
  if (character?.pairingStats) {
    return character.pairingStats
  }

  return calculatePairingStats(character?.attributes ?? {}, pairings)
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

function getSkillCatalogMap(expandedSkillList = {}) {
  return Object.values(expandedSkillList).reduce((catalog, categorySkills) => {
    categorySkills.forEach((skill) => {
      catalog[skill.id] = skill
    })

    return catalog
  }, {})
}

export function getSkillGroups(character, expandedSkillList = {}) {
  const skillCatalog = getSkillCatalogMap(expandedSkillList)

  return Object.entries(expandedSkillList)
    .map(([categoryKey, categorySkills]) => {
      const savedSkills = character.skills?.[categoryKey] ?? []

      if (!savedSkills.length) {
        return null
      }

      return {
        key: categoryKey,
        label: titleCase(categoryKey),
        entries: savedSkills.map((savedSkill) => {
          const blueprintSkill = skillCatalog[savedSkill.id] ?? categorySkills.find((entry) => entry.id === savedSkill.id)
          const score = savedSkill.rank ?? 0

          return {
            key: `${categoryKey}-${savedSkill.id}`,
            label: blueprintSkill?.name ?? titleCase(savedSkill.id),
            value: score,
            modifier: `Rank ${score}`,
            detail: [
              blueprintSkill?.verb ?? 'No system description loaded yet.',
              blueprintSkill?.linkedAttributes?.length
                ? `Linked Attributes: ${blueprintSkill.linkedAttributes.map(titleCase).join(' + ')}`
                : null,
              savedSkill.specialty
                ? `Granted Focus: ${savedSkill.specialty}\nThis is a system- or progression-granted edge inside the skill, not a separate stat players assign freely.`
                : null,
            ]
              .filter(Boolean)
              .join('\n\n'),
          }
        }),
      }
    })
    .filter(Boolean)
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
  character,
  derivedStatDetails,
  pairingCategoryDetails,
  pairingStats,
  pairings,
  socialStatDetails,
}) {
  return PAIRING_CATEGORY_ORDER.map((categoryKey) => {
    const categoryPairings = pairings.filter((pairing) => pairing.category === categoryKey)
    const entries = []

    if (categoryKey === 'combat') {
      entries.push(
        {
          key: 'vitality',
          label: 'Vitality',
          value: character.derivedStats?.vitality ?? 0,
          modifier: getRollModifier(character.derivedStats?.vitality ?? 0),
          detail: `${derivedStatDetails.vitality.description}\n\nFormula: ${
            derivedStatDetails.vitality.formula
          }\nRoll Modifier: ${getRollModifier(character.derivedStats?.vitality ?? 0)}`,
        },
        {
          key: 'guard',
          label: 'Guard',
          value: character.derivedStats?.guard ?? 0,
          modifier: getRollModifier(character.derivedStats?.guard ?? 0),
          detail: `${derivedStatDetails.guard.description}\n\nFormula: ${
            derivedStatDetails.guard.formula
          }\nRoll Modifier: ${getRollModifier(character.derivedStats?.guard ?? 0)}`,
        },
        {
          key: 'initiative',
          label: 'Initiative',
          value: character.derivedStats?.initiative ?? 0,
          modifier: getRollModifier(character.derivedStats?.initiative ?? 0),
          detail: `${derivedStatDetails.initiative.description}\n\nFormula: ${
            derivedStatDetails.initiative.formula
          }\nRoll Modifier: ${getRollModifier(character.derivedStats?.initiative ?? 0)}`,
        },
      )
    }

    if (categoryKey === 'social') {
      entries.push(
        ...['grace', 'guile', 'pressure'].map((key) => ({
          key,
          label: titleCase(key),
          value: character.socialStats?.[key] ?? pairingStats[key] ?? 0,
          modifier: getRollModifier(character.socialStats?.[key] ?? pairingStats[key] ?? 0),
          detail: `${socialStatDetails[key]?.description}\n\nFormula: ${
            socialStatDetails[key]?.formula
          }\nRoll Modifier: ${getRollModifier(character.socialStats?.[key] ?? pairingStats[key] ?? 0)}`,
        })),
      )
    }

    if (categoryKey === 'arcane') {
      entries.push({
        key: 'focus',
        label: 'Focus',
        value: character.derivedStats?.focus ?? 0,
        modifier: getRollModifier(character.derivedStats?.focus ?? 0),
        detail: `${derivedStatDetails.focus.description}\n\nFormula: ${
          derivedStatDetails.focus.formula
        }\nRoll Modifier: ${getRollModifier(character.derivedStats?.focus ?? 0)}`,
      })
    }

    entries.push(
      ...categoryPairings.map((pairing) => {
        if (categoryKey === 'social' && ['grace', 'guile', 'pressure'].includes(pairing.key)) {
          return null
        }

        const score = pairingStats[pairing.key] ?? 10

        return {
          key: pairing.key,
          label: pairing.name,
          value: score,
          modifier: getRollModifier(score),
          detail: `${pairing.summary}\n\nFormula: ${pairing.formulaLabel}\nRoll Modifier: ${getRollModifier(
            score,
          )}\nExamples: ${pairing.examples.join(', ')}`,
        }
      }).filter(Boolean),
    )

    return {
      key: categoryKey,
      ...pairingCategoryDetails[categoryKey],
      entries,
    }
  }).filter((group) => group.entries.length)
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
