import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import DetailPill from '../../components/ui/DetailPill'
import {
  getAttributeDetails,
  getDerivedStatDetails,
  getPairingCategoryDetails,
  getSocialStatDetails,
} from '../../data/characterSheetData'
import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getRankedSystemSpecializations,
  getSystemCallings,
  getSystemOrigins,
  getSystemPairings,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from '../../data/archipelagoSystemSelectors'
import { deleteCharacter, getCharacterById } from '../../lib/api'
import {
  calculatePairingStats,
  getAttributeLabel,
  getRollModifier,
  getStatLabel,
  parseAttributeBonus,
} from '../../lib/character'
import { useAuth } from '../../hooks/useAuth'
import { useSystem } from '../../hooks/useSystem'
import '../shared/PageShell.css'
import './CharacterSheetPage.css'

const ATTRIBUTE_KEYS = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']
const PAIRING_CATEGORY_ORDER = ['combat', 'social', 'exploration', 'utility', 'arcane']

function titleCase(value = '') {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getCharacterReputation(character) {
  return character?.reputation
}

function getCharacterPairingStats(character, pairings) {
  if (character?.pairingStats) {
    return character.pairingStats
  }

  return calculatePairingStats(character?.attributes ?? {}, pairings)
}

function getTraitEntries(character, calling, origin) {
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

function getIdentityEntries(character) {
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

function getProgressionEntries(character, blueprint) {
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
      detail: 'Unspent points available for verb-skill growth.',
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

function getAbilityEntries(character, calling) {
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

function getVerbSkillGroups(character, expandedSkillList = {}) {
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
                ? `Granted Focus: ${savedSkill.specialty}\nThis is a system- or progression-granted edge inside the verb, not a separate stat players assign freely.`
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

function getCatalogGroups(character) {
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

function CompactInfoCard({ className = '', detail, eyebrow, title, value }) {
  return (
    <article
      className={`character-sheet__hover-card ${detail ? 'has-detail' : ''} ${className}`.trim()}
      tabIndex={detail ? 0 : undefined}
    >
      <div className="character-sheet__hover-card-face">
        {eyebrow ? <span className="character-sheet__eyebrow">{eyebrow}</span> : null}
        <strong>{value}</strong>
        <span className="character-sheet__hover-card-title">{title}</span>
      </div>
      {detail ? <div className="character-sheet__hover-card-detail">{detail}</div> : null}
    </article>
  )
}

function CompactTextCard({ className = '', detail, eyebrow, meta, title, tone = 'default' }) {
  return (
    <article
      className={`character-sheet__hover-card character-sheet__hover-card--text character-sheet__hover-card--${tone} ${
        detail ? 'has-detail' : ''
      } ${className}`.trim()}
      tabIndex={detail ? 0 : undefined}
    >
      <div className="character-sheet__hover-card-face">
        {eyebrow ? <span className="character-sheet__eyebrow">{eyebrow}</span> : null}
        <h3>{title}</h3>
        {meta ? <span className="character-sheet__hover-card-meta">{meta}</span> : null}
      </div>
      {detail ? <div className="character-sheet__hover-card-detail">{detail}</div> : null}
    </article>
  )
}

function ReferenceList({ entries, variant = 'default' }) {
  return (
    <div className={`character-sheet__reference-list character-sheet__reference-list--${variant}`}>
      {entries.map((entry) => (
        <article
          key={entry.key}
          className={`character-sheet__reference-row ${entry.detail ? 'has-detail' : ''} ${
            !entry.value && !entry.modifier ? 'is-text-only' : ''
          }`}
          tabIndex={entry.detail ? 0 : undefined}
        >
          <div className="character-sheet__reference-main">
            <div className="character-sheet__reference-copy">
              <strong>{entry.label}</strong>
              {entry.meta ? <span>{entry.meta}</span> : null}
            </div>
            {entry.value || entry.modifier ? (
              <div className="character-sheet__reference-values">
                {entry.value ? <span className="character-sheet__reference-score">{entry.value}</span> : null}
                {entry.modifier ? <span className="character-sheet__reference-modifier">{entry.modifier}</span> : null}
              </div>
            ) : null}
          </div>
          {entry.detail ? <div className="character-sheet__reference-detail">{entry.detail}</div> : null}
        </article>
      ))}
    </div>
  )
}

function toReferenceEntries(items, config = {}) {
  return items.map((item, index) => ({
    key: item.key ?? `${config.prefix ?? 'entry'}-${index}`,
    label: item.label,
    meta: item.meta,
    value: item.value ?? item.source ?? item.score ?? '',
    modifier: item.modifier,
    detail: item.detail,
  }))
}

function getTrackerValue(resource, fallbackCurrent, fallbackMax) {
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

function TrackerCard({ current, detail, label, max, tone = 'default' }) {
  const pipCount = Math.max(max ?? 0, current ?? 0)
  const safeCurrent = Math.max(0, Math.min(current ?? 0, pipCount))

  return (
    <article
      className={`character-sheet__tracker-card ${detail ? 'has-detail' : ''} character-sheet__tracker-card--${tone}`}
      tabIndex={detail ? 0 : undefined}
    >
      <div className="character-sheet__tracker-head">
        <strong>{label}</strong>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className="character-sheet__tracker-pips" aria-hidden="true">
        {Array.from({ length: pipCount }).map((_, index) => (
          <span
            key={`${label}-${index}`}
            className={index < safeCurrent ? 'is-filled' : ''}
          />
        ))}
      </div>
      {detail ? <div className="character-sheet__tracker-detail">{detail}</div> : null}
    </article>
  )
}

function CharacterSheetPage() {
  const navigate = useNavigate()
  const { characterId } = useParams()
  const { token, characters, setCharacters } = useAuth()
  const { blueprint, isBlueprintLoading, blueprintError } = useSystem()
  const rosterCharacter = useMemo(
    () => characters.find((character) => character._id === characterId) ?? null,
    [characterId, characters],
  )
  const [character, setCharacter] = useState(rosterCharacter)
  const [isLoading, setIsLoading] = useState(!rosterCharacter)
  const [loadError, setLoadError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setCharacter(rosterCharacter)
  }, [rosterCharacter])

  useEffect(() => {
    if (rosterCharacter || !token || !characterId) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadCharacter() {
      setIsLoading(true)
      setLoadError('')

      try {
        const fetchedCharacter = await getCharacterById(token, characterId)

        if (cancelled) {
          return
        }

        setCharacter(fetchedCharacter)
        setCharacters((current) => {
          if (current.some((entry) => entry._id === fetchedCharacter._id)) {
            return current.map((entry) => (entry._id === fetchedCharacter._id ? fetchedCharacter : entry))
          }

          return [fetchedCharacter, ...current]
        })
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadCharacter()

    return () => {
      cancelled = true
    }
  }, [characterId, rosterCharacter, setCharacters, token])

  async function handleDeleteCharacter() {
    if (!character || isDeleting) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${character.name}? This removes the saved sheet from your roster.`)

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteCharacter(token, character._id)
      setCharacters((current) => current.filter((entry) => entry._id !== character._id))
      navigate('/characters')
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isBlueprintLoading && !blueprint) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Character Sheet"
          title="Loading System Blueprint"
          description="Pulling the shared creator and sheet catalogs before rendering the sheet."
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  if (blueprintError || !blueprint) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Character Sheet"
          title="System Blueprint Unavailable"
          description={blueprintError || 'The shared system blueprint could not be loaded.'}
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Character Sheet"
          title="Loading Sheet"
          description="Pulling the saved build from your roster."
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  if (!character) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Character Sheet"
          title="Character Not Found"
          description={loadError || 'This sheet could not be found in your roster.'}
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  const callings = getSystemCallings(blueprint)
  const origins = getSystemOrigins(blueprint)
  const pairings = getSystemPairings(blueprint)
  const attributeDetails = getAttributeDetails(blueprint)
  const derivedStatDetails = getDerivedStatDetails(blueprint)
  const pairingCategoryDetails = getPairingCategoryDetails(blueprint)
  const socialStatDetails = getSocialStatDetails(blueprint)
  const calling = callings.find((entry) => entry.id === character.calling) ?? null
  const origin = origins.find((entry) => entry.id === character.origin) ?? null
  const characterRank = character.progression?.rank ?? 1
  const activeReputation = getActiveSystemReputationEntries(
    getCharacterReputation(character) ?? getSystemOriginStartingReputation(character?.origin, blueprint),
    blueprint,
  )
  const pairingStats = getCharacterPairingStats(character, pairings)
  const originBonus = parseAttributeBonus(origin?.bonus)
  const traits = getTraitEntries(character, calling, origin)
  const identityEntries = getIdentityEntries(character)
  const progressionEntries = getProgressionEntries(character, blueprint)
  const abilities = getAbilityEntries(character, calling)
  const vitality = character.derivedStats?.vitality ?? 0
  const health = getTrackerValue(
    character.resources?.health ?? character.health,
    vitality,
    character.resources?.health?.max ?? vitality,
  )
  const stamina = getTrackerValue(character.resources?.stamina, 0, character.resources?.stamina?.max ?? 0)
  const focus = getTrackerValue(
    character.resources?.focus ?? character.spellSlots,
    character.derivedStats?.focus ?? 0,
    character.resources?.focus?.max ?? character.derivedStats?.focus ?? 0,
  )
  const corruption = getTrackerValue(
    character.resources?.corruption ?? character.corruption,
    0,
    character.resources?.corruption?.max ?? character.corruption?.max ?? 6,
  )
  const woundTrack = character.resources?.wounds
    ? {
        current: character.resources.wounds.current ?? character.resources.wounds.active?.length ?? 0,
        max: character.resources.wounds.max ?? 3,
      }
    : {
        current: 0,
        max: character.woundCapacity ?? 3,
      }
  const catalogGroups = getCatalogGroups(character)
  const visibleCatalogGroups = catalogGroups.filter(
    (group) => group.entries.length || (group.key === 'notes' && character.notes),
  )
  const verbSkillGroups = getVerbSkillGroups(character, blueprint?.expandedSkillList ?? {})
  const referenceGroups = PAIRING_CATEGORY_ORDER.map((categoryKey) => {
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
          label: getStatLabel(key),
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

  return (
    <main className="page-shell">
      <section className="character-sheet">
        <Link className="character-sheet__back" to="/characters">
          {'<-'} Back to roster
        </Link>

        <article className="dashboard-card character-sheet__toolbar">
          <div className="character-sheet__toolbar-main">
                <div className="character-sheet__toolbar-copy">
                  <h1>{character.name}</h1>
                  <p>
                {titleCase(character.calling)} | {titleCase(character.origin)} | Rank {characterRank}
                {character.pronouns ? ` | ${character.pronouns}` : ''}
                  </p>
                </div>

            <div className="character-sheet__hero-pills">
              {calling?.primaryStats?.length ? (
                <DetailPill detail={`${calling.name} leans on ${calling.primaryStats.join(' and ')} most heavily.`}>
                  {calling.primaryStats.join(' / ')}
                </DetailPill>
              ) : null}
              {origin?.bonus ? (
                <DetailPill detail={`${origin.summary} This grants ${origin.bonus} to your starting attributes.`}>
                  {origin.bonus}
                </DetailPill>
              ) : null}
              {character.notes ? <DetailPill detail={character.notes}>Notes</DetailPill> : null}
            </div>
          </div>

          <div className="character-sheet__actions">
            <Link className="character-sheet__action-link" to={`/characters/${character._id}/edit`}>
              Edit
            </Link>
            <Link className="character-sheet__action-link" to="/characters/new">
              New
            </Link>
            <button
              className="character-sheet__delete"
              type="button"
              onClick={handleDeleteCharacter}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {deleteError ? <p className="dashboard-card__error">{deleteError}</p> : null}
        </article>

        <section className="character-sheet__layout">
          <section className="character-sheet__overview-shell">
            <div className="character-sheet__overview-grid">
          <article className="dashboard-card character-sheet__panel character-sheet__panel--compact">
            <div className="dashboard-card__header character-sheet__panel-header">
              <div>
                <h2>Sheet Core</h2>
              </div>
            </div>

            <div className="character-sheet__stat-board">
              <section className="character-sheet__stat-section">
                <header>
                  <h3>Attributes</h3>
                </header>
                <ReferenceList
                  entries={ATTRIBUTE_KEYS.map((key) => ({
                    key,
                    label: getAttributeLabel(key),
                    meta: originBonus?.key === key ? `+${originBonus.amount}` : '',
                    value: character.attributes?.[key] ?? 0,
                    modifier: getRollModifier(character.attributes?.[key] ?? 0),
                    detail: `${attributeDetails[key]}\n\nModifier: ${getRollModifier(character.attributes?.[key] ?? 0)}${
                      originBonus?.key === key ? `\nOrigin Bonus: +${originBonus.amount}` : ''
                    }`,
                  }))}
                />
              </section>
            </div>
          </article>

          <div className="character-sheet__middle-stack">
            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Abilities</h2>
                </div>
              </div>

              {abilities.length ? (
                <ReferenceList
                  entries={toReferenceEntries(
                    abilities.map((ability) => ({
                      key: `${ability.source}-${ability.label}`,
                      label: ability.label,
                      meta: ability.source,
                      detail: ability.detail,
                    })),
                    { prefix: 'ability' },
                  )}
                  variant="tight"
                />
              ) : (
                <p className="dashboard-card__empty">No abilities recorded yet.</p>
              )}
            </article>

            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Trackers</h2>
                </div>
              </div>

              <div className="character-sheet__tracker-grid">
                <TrackerCard
                  label="Health"
                  current={health.current}
                  max={health.max}
                  detail={`Current: ${health.current}\nMax: ${health.max}\nPulled from the saved resource track and defaults to Vitality when absent.`}
                  tone="health"
                />
                <TrackerCard
                  label="Stamina"
                  current={stamina.current}
                  max={stamina.max}
                  detail={`Current: ${stamina.current}\nMax: ${stamina.max}\nTracks physical exertion, movement bursts, and martial ability costs.`}
                  tone="default"
                />
                <TrackerCard
                  label="Focus"
                  current={focus.current}
                  max={focus.max}
                  detail={`Current: ${focus.current}\nMax: ${focus.max}\nUses the canonical mental and arcane resource track.`}
                  tone="arcane"
                />
                <TrackerCard
                  label="Wounds"
                  current={woundTrack.current}
                  max={woundTrack.max}
                  detail={`Current wounds: ${woundTrack.current}\nCapacity: ${woundTrack.max}\nTracks active wound entries on the sheet.`}
                  tone="danger"
                />
                <TrackerCard
                  label="Corruption"
                  current={corruption.current}
                  max={corruption.max}
                  detail={`Current: ${corruption.current}\nMax: ${corruption.max}\nDefaults to an empty track unless corruption data is saved.`}
                  tone="corruption"
                />
              </div>
            </article>
          </div>

          <div className="character-sheet__top-stack">
            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Identity</h2>
                </div>
              </div>

              {identityEntries.length ? (
                <ReferenceList entries={identityEntries} variant="tight" />
              ) : (
                <p className="dashboard-card__empty">No background details recorded yet.</p>
              )}
            </article>

            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Progression</h2>
                </div>
              </div>

              <ReferenceList entries={progressionEntries} variant="tight" />
            </article>

            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Identity Tags</h2>
                </div>
              </div>

              {traits.length ? (
                <ReferenceList
                  entries={toReferenceEntries(
                    traits.map((trait) => ({
                      key: `${trait.source}-${trait.label}`,
                      label: trait.label,
                      meta: trait.source,
                      detail: trait.detail,
                    })),
                    { prefix: 'trait' },
                  )}
                  variant="tight"
                />
              ) : (
                <p className="dashboard-card__empty">No identity tags recorded yet.</p>
              )}
            </article>

            <article className="dashboard-card character-sheet__panel character-sheet__panel--stacked">
              <div className="dashboard-card__header character-sheet__panel-header">
                <div>
                  <h2>Reputation</h2>
                </div>
              </div>

              {activeReputation.length ? (
                <ReferenceList
                  entries={activeReputation.map(([trackKey, score]) => {
                    const track = getSystemReputationTrack(trackKey, blueprint)
                    const tier = getSystemReputationTier(score, blueprint)

                    return {
                      key: trackKey,
                      label: track?.name ?? trackKey,
                      meta: score > 0 ? 'Trusted' : 'Distrusted',
                      value: formatSystemReputationScore(score),
                      detail: `${tier.label}. ${tier.effect}\n\n${track?.scope ?? 'No scope notes yet.'}`,
                    }
                  })}
                  variant="reputation"
                />
              ) : (
                <p className="dashboard-card__empty">No reputation pressure recorded yet.</p>
              )}
            </article>
          </div>
            </div>
          </section>

          <article className="dashboard-card character-sheet__panel character-sheet__panel--wide">
            <div className="dashboard-card__header character-sheet__panel-header">
              <div>
                <h2>Verb Skills</h2>
                <p>Loaded from the shared system blueprint.</p>
              </div>
            </div>

            {verbSkillGroups.length ? (
              <div className="character-sheet__skill-groups">
                {verbSkillGroups.map((group) => (
                  <section key={group.key} className="character-sheet__skill-group">
                    <header className="character-sheet__skill-group-header">
                      <div>
                        <h3>{group.label}</h3>
                      </div>
                    </header>

                    <ReferenceList entries={group.entries} variant="skill-chart" />
                  </section>
                ))}
              </div>
            ) : (
              <p className="dashboard-card__empty">
                No verb skills recorded on this character yet.
              </p>
            )}
          </article>

          <article className="dashboard-card character-sheet__panel character-sheet__panel--wide">
            <div className="dashboard-card__header character-sheet__panel-header">
              <div>
                <h2>Skill Chart</h2>
              </div>
            </div>

            <div className="character-sheet__skill-groups">
              {referenceGroups.map((group) => (
                <section key={group.key} className="character-sheet__skill-group">
                  <header className="character-sheet__skill-group-header">
                    <div>
                      <h3>{group.label}</h3>
                    </div>
                  </header>

                  <ReferenceList entries={group.entries} variant="skill-chart" />
                </section>
              ))}
            </div>
          </article>

          <article className="dashboard-card character-sheet__panel character-sheet__panel--wide">
            <div className="dashboard-card__header character-sheet__panel-header">
              <div>
                <h2>Loadout & Notes</h2>
              </div>
            </div>

            <div className="character-sheet__resource-groups">
              {visibleCatalogGroups.map((group) => (
                <section key={group.key} className="character-sheet__resource-group">
                  <header className="character-sheet__resource-header">
                    <h3>{group.title}</h3>
                  </header>

                  {group.entries.length ? (
                    <ReferenceList
                      entries={toReferenceEntries(
                        group.entries.map((entry) => ({
                          key: `${group.key}-${entry.label}-${entry.meta ?? 'base'}`,
                          label: entry.label,
                          meta: entry.meta ?? group.title,
                          detail: entry.detail,
                        })),
                        { prefix: group.key },
                      )}
                      variant="tight"
                    />
                  ) : (
                    <p className="dashboard-card__empty">{group.empty}</p>
                  )}
                </section>
              ))}

              {character.notes ? (
                <section className="character-sheet__resource-group">
                  <header className="character-sheet__resource-header">
                    <h3>Notes</h3>
                  </header>
                  <div className="character-sheet__notes-panel">
                    <p className="character-sheet__notes-copy">{character.notes}</p>
                  </div>
                </section>
              ) : null}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default CharacterSheetPage
