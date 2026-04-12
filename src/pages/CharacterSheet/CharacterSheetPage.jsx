import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import DetailPill from '../../components/ui/DetailPill'
import { attributePairings } from '../../data/pairingData'
import {
  ATTRIBUTE_DETAILS,
  DERIVED_STAT_DETAILS,
  PAIRING_CATEGORY_DETAILS,
  SOCIAL_STAT_DETAILS,
} from '../../data/characterSheetData'
import { callings, origins } from '../../data/gameData'
import {
  formatReputationScore,
  getActiveReputationEntries,
  getOriginStartingReputation,
  getReputationTier,
  getReputationTrack,
} from '../../data/reputationData'
import { deleteCharacter, getCharacterById } from '../../lib/api'
import {
  calculatePairingStats,
  getAttributeLabel,
  getRollModifier,
  getStatLabel,
  parseAttributeBonus,
} from '../../lib/character'
import { useAuth } from '../../hooks/useAuth'
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

function parseLabeledRule(entry = '') {
  const separatorIndex = entry.indexOf(':')

  if (separatorIndex === -1) {
    return {
      label: entry,
      detail: '',
    }
  }

  return {
    label: entry.slice(0, separatorIndex).trim(),
    detail: entry.slice(separatorIndex + 1).trim(),
  }
}

function getCharacterReputation(character) {
  if (character?.reputation) {
    return character.reputation
  }

  return getOriginStartingReputation(character?.origin)
}

function getCharacterPairingStats(character) {
  if (character?.pairingStats) {
    return character.pairingStats
  }

  return calculatePairingStats(character?.attributes ?? {})
}

function getTraitEntries(character, calling, origin) {
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

  if (structuredTraits.length) {
    return structuredTraits
  }

  return (character.passives ?? []).map((entry) => {
    const parsed = parseLabeledRule(entry)
    const isDrawback = parsed.label.toLowerCase().includes('drawback')

    return {
      label: parsed.label,
      source: isDrawback ? 'Drawback' : 'Passive',
      detail: parsed.detail || 'No rule text recorded yet.',
      tone: isDrawback ? 'negative' : 'default',
    }
  })
}

function getAbilityEntries(character, calling) {
  if (character.abilities?.length) {
    return character.abilities.map((ability) => ({
      label: ability.name,
      source: titleCase(ability.source),
      detail: ability.description || 'No ability description yet.',
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

function getCatalogGroups(character) {
  return [
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
      entries: (character.wounds ?? []).map((wound) => ({
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

  const calling = callings.find((entry) => entry.id === character.calling) ?? null
  const origin = origins.find((entry) => entry.id === character.origin) ?? null
  const activeReputation = getActiveReputationEntries(getCharacterReputation(character))
  const pairingStats = getCharacterPairingStats(character)
  const originBonus = parseAttributeBonus(origin?.bonus)
  const traits = getTraitEntries(character, calling, origin)
  const abilities = getAbilityEntries(character, calling)
  const vitality = character.derivedStats?.vitality ?? 0
  const health = getTrackerValue(character.health, vitality, vitality)
  const spellSlots = getTrackerValue(
    character.spellSlots,
    character.spellSlots?.max ?? 0,
    character.spellSlots?.max ?? 0,
  )
  const corruption = getTrackerValue(character.corruption, 0, character.corruption?.max ?? 6)
  const woundTrack = {
    current: character.wounds?.length ?? 0,
    max: character.woundCapacity ?? 3,
  }
  const catalogGroups = getCatalogGroups(character)
  const visibleCatalogGroups = catalogGroups.filter(
    (group) => group.entries.length || (group.key === 'notes' && character.notes),
  )
  const referenceGroups = PAIRING_CATEGORY_ORDER.map((categoryKey) => {
    const categoryPairings = attributePairings.filter((pairing) => pairing.category === categoryKey)
    const entries = []

    if (categoryKey === 'combat') {
      entries.push(
        {
          key: 'vitality',
          label: 'Vitality',
          value: character.derivedStats?.vitality ?? 0,
          modifier: getRollModifier(character.derivedStats?.vitality ?? 0),
          detail: `${DERIVED_STAT_DETAILS.vitality.description}\n\nFormula: ${
            DERIVED_STAT_DETAILS.vitality.formula
          }\nRoll Modifier: ${getRollModifier(character.derivedStats?.vitality ?? 0)}`,
        },
        {
          key: 'guard',
          label: 'Guard',
          value: character.derivedStats?.guard ?? 0,
          modifier: getRollModifier(character.derivedStats?.guard ?? 0),
          detail: `${DERIVED_STAT_DETAILS.guard.description}\n\nFormula: ${
            DERIVED_STAT_DETAILS.guard.formula
          }\nRoll Modifier: ${getRollModifier(character.derivedStats?.guard ?? 0)}`,
        },
        {
          key: 'initiative',
          label: 'Initiative',
          value: character.derivedStats?.initiative ?? 0,
          modifier: getRollModifier(character.derivedStats?.initiative ?? 0),
          detail: `${DERIVED_STAT_DETAILS.initiative.description}\n\nFormula: ${
            DERIVED_STAT_DETAILS.initiative.formula
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
          detail: `${SOCIAL_STAT_DETAILS[key]?.description}\n\nFormula: ${
            SOCIAL_STAT_DETAILS[key]?.formula
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
        detail: `${DERIVED_STAT_DETAILS.focus.description}\n\nFormula: ${
          DERIVED_STAT_DETAILS.focus.formula
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
      ...PAIRING_CATEGORY_DETAILS[categoryKey],
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
                {titleCase(character.calling)} | {titleCase(character.origin)} | Rank {character.rank}
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
                    detail: `${ATTRIBUTE_DETAILS[key]}\n\nModifier: ${getRollModifier(character.attributes?.[key] ?? 0)}${
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
                  detail={`Current: ${health.current}\nMax: ${health.max}\nDerived from Vitality unless a separate health track is saved.`}
                  tone="health"
                />
                <TrackerCard
                  label="Spell Slots"
                  current={spellSlots.current}
                  max={spellSlots.max}
                  detail={`Current: ${spellSlots.current}\nMax: ${spellSlots.max}\nUses saved spell slot data when present.`}
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
                  <h2>Traits</h2>
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
                <p className="dashboard-card__empty">No traits recorded yet.</p>
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
                    const track = getReputationTrack(trackKey)
                    const tier = getReputationTier(score)

                    return {
                      key: trackKey,
                      label: track?.name ?? trackKey,
                      meta: score > 0 ? 'Trusted' : 'Distrusted',
                      value: formatReputationScore(score),
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
                <h2>Field Notes</h2>
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
