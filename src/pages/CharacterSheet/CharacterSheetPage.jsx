import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import { attributePairings, coreSheetPairings } from '../../data/pairingData'
import {
  formatReputationScore,
  getActiveReputationEntries,
  getOriginStartingReputation,
  getReputationTier,
  getReputationTrack,
} from '../../data/reputationData'
import { deleteCharacter, getCharacterById } from '../../lib/api'
import { calculatePairingStats, getRollModifier } from '../../lib/character'
import { useAuth } from '../../hooks/useAuth'
import '../shared/PageShell.css'
import './CharacterSheetPage.css'

const ATTRIBUTE_LABELS = {
  might: 'Might',
  agility: 'Agility',
  wit: 'Wit',
  spirit: 'Spirit',
  resolve: 'Resolve',
  instinct: 'Instinct',
}

const STAT_LABELS = {
  vitality: 'Vitality',
  guard: 'Guard',
  initiative: 'Initiative',
  focus: 'Focus',
}

const SOCIAL_STAT_LABELS = {
  grace: 'Grace',
  guile: 'Guile',
  pressure: 'Pressure',
}

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

function CharacterSheetPage() {
  const navigate = useNavigate()
  const { characterId } = useParams()
  const { token, characters, setCharacters } = useAuth()
  const rosterCharacter = useMemo(
    () => characters.find((character) => character._id === characterId) ?? null,
    [characterId, characters]
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

  const activeReputation = getActiveReputationEntries(getCharacterReputation(character))
  const pairingGlossary = attributePairings.filter(
    (pairing) => !coreSheetPairings.includes(pairing.key),
  )
  const pairingStats = getCharacterPairingStats(character)

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Character Sheet"
        title={character.name}
        description={`${titleCase(character.calling)} from ${titleCase(character.origin)}. This is the first-pass single page version of the sheet.`}
        backTo="/characters"
        backLabel="Back to roster"
      />

      <section className="character-sheet">
        <article className="dashboard-card character-sheet__hero">
          <div className="character-sheet__identity">
            <div>
              <p className="page-shell__eyebrow">Identity</p>
              <h2>{character.name}</h2>
              <p className="character-sheet__subtitle">
                {titleCase(character.calling)} | {titleCase(character.origin)}
              </p>
              <p className="character-sheet__meta">
                Rank {character.rank} {character.pronouns ? `| ${character.pronouns}` : ''}
              </p>
            </div>

            {character.portraitUrl ? (
              <img
                className="character-sheet__portrait"
                src={character.portraitUrl}
                alt={`${character.name} portrait`}
              />
            ) : (
              <div className="character-sheet__portrait character-sheet__portrait--placeholder">
                <span>{character.name.slice(0, 1).toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="character-sheet__actions">
            <Link className="character-sheet__action-link" to="/characters/new">
              Create Another Character
            </Link>
            <button
              className="character-sheet__delete"
              type="button"
              onClick={handleDeleteCharacter}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Character'}
            </button>
          </div>

          {deleteError ? <p className="dashboard-card__error">{deleteError}</p> : null}
        </article>

        <section className="character-sheet__grid">
          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Attributes</h2>
              <p>Core scores that feed the rest of the sheet.</p>
            </div>

            <div className="character-sheet__stat-grid">
              {Object.entries(ATTRIBUTE_LABELS).map(([key, label]) => (
                <div key={key} className="character-sheet__stat-card">
                  <span>{label}</span>
                  <strong>{character.attributes?.[key] ?? 0}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Derived Stats</h2>
              <p>Auto-calculated from the current build.</p>
            </div>

            <div className="character-sheet__stat-grid">
              {Object.entries(STAT_LABELS).map(([key, label]) => (
                <div key={key} className="character-sheet__stat-card">
                  <span>{label}</span>
                  <strong>{character.derivedStats?.[key] ?? 0}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Social Stats</h2>
              <p>How this character bends rooms, masks intent, or applies pressure.</p>
            </div>

            <div className="character-sheet__stat-grid">
              {Object.entries(SOCIAL_STAT_LABELS).map(([key, label]) => (
                <div key={key} className="character-sheet__stat-card">
                  <span>{label}</span>
                  <strong>{character.socialStats?.[key] ?? 0}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Passives</h2>
              <p>Ongoing perks and traits tied to the build.</p>
            </div>

            {character.passives?.length ? (
              <div className="character-sheet__stack">
                {character.passives.map((passive) => {
                  const parsedPassive = parseLabeledRule(passive)

                  return (
                    <section key={passive} className="character-sheet__detail-card">
                      <header>
                        <h3>{parsedPassive.label}</h3>
                      </header>
                      <p>{parsedPassive.detail || 'No passive rule yet.'}</p>
                    </section>
                  )
                })}
              </div>
            ) : (
              <p className="dashboard-card__empty">No passives recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Abilities</h2>
              <p>Active tools and notable moves.</p>
            </div>

            {character.abilities?.length ? (
              <div className="character-sheet__stack">
                {character.abilities.map((ability) => (
                  <section key={`${ability.name}-${ability.source}`} className="character-sheet__detail-card">
                    <header>
                      <h3>{ability.name}</h3>
                      <span>{titleCase(ability.source)}</span>
                    </header>
                    <p>{ability.description || 'No ability description yet.'}</p>
                  </section>
                ))}
              </div>
            ) : (
              <p className="dashboard-card__empty">No abilities recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Reputation</h2>
              <p>How the wider Vale is predisposed to read this character.</p>
            </div>

            {activeReputation.length ? (
              <div className="character-sheet__stack">
                {activeReputation.map(([trackKey, score]) => {
                  const track = getReputationTrack(trackKey)
                  const tier = getReputationTier(score)

                  return (
                    <section key={trackKey} className="character-sheet__detail-card">
                      <header>
                        <h3>{track?.name ?? trackKey}</h3>
                        <span
                          className={`character-sheet__reputation-score ${
                            score > 0 ? 'is-positive' : 'is-negative'
                          }`}
                        >
                          {formatReputationScore(score)}
                        </span>
                      </header>
                      <p>{tier.label}. {tier.effect}</p>
                      <p className="character-sheet__detail-meta">{track?.scope}</p>
                    </section>
                  )
                })}
              </div>
            ) : (
              <p className="dashboard-card__empty">No reputation pressure recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Inventory</h2>
              <p>Gear, supplies, and carried story hooks.</p>
            </div>

            {character.inventory?.length ? (
              <div className="character-sheet__stack">
                {character.inventory.map((item) => (
                  <section key={`${item.name}-${item.quantity}`} className="character-sheet__detail-card">
                    <header>
                      <h3>{item.name}</h3>
                      <span>x{item.quantity}</span>
                    </header>
                    <p>{item.description || 'No inventory notes yet.'}</p>
                  </section>
                ))}
              </div>
            ) : (
              <p className="dashboard-card__empty">No inventory recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Relics</h2>
              <p>Bound artifacts and notable objects of power.</p>
            </div>

            {character.relics?.length ? (
              <div className="character-sheet__stack">
                {character.relics.map((relic) => (
                  <section key={relic.name} className="character-sheet__detail-card">
                    <header>
                      <h3>{relic.name}</h3>
                      <span>{relic.bonded ? 'Bonded' : 'Unbonded'}</span>
                    </header>
                    <p>{relic.description || 'No relic notes yet.'}</p>
                  </section>
                ))}
              </div>
            ) : (
              <p className="dashboard-card__empty">No relics recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Wounds</h2>
              <p>Tracked injuries and their penalties.</p>
            </div>

            {character.wounds?.length ? (
              <div className="character-sheet__stack">
                {character.wounds.map((wound) => (
                  <section key={`${wound.name}-${wound.severity}`} className="character-sheet__detail-card">
                    <header>
                      <h3>{wound.name}</h3>
                      <span>{titleCase(wound.severity)}</span>
                    </header>
                    <p>{wound.description || 'No wound description yet.'}</p>
                    {wound.statPenalty ? (
                      <p className="character-sheet__detail-meta">Penalty: {titleCase(wound.statPenalty)}</p>
                    ) : null}
                  </section>
                ))}
              </div>
            ) : (
              <p className="dashboard-card__empty">No wounds recorded yet.</p>
            )}
          </article>

          <article className="dashboard-card character-sheet__notes">
            <div className="dashboard-card__header">
              <h2>Pairing Glossary</h2>
              <p>The wider Archipelago language of two-attribute actions beyond your default social trio.</p>
            </div>

            <details className="character-sheet__accordion">
              <summary>
                <span>Show Full Pairing Matrix</span>
                <span>{pairingGlossary.length} pairings</span>
              </summary>

              <div className="character-sheet__glossary-grid">
                {pairingGlossary.map((pairing) => (
                  <section key={pairing.key} className="character-sheet__detail-card">
                    <header>
                      <h3>{pairing.name}</h3>
                      <span>{pairing.category}</span>
                    </header>
                    <p>{pairing.summary}</p>
                    <p className="character-sheet__detail-meta">
                      Score: {pairingStats[pairing.key] ?? 10} | Modifier:{' '}
                      {getRollModifier(pairingStats[pairing.key] ?? 10)}
                    </p>
                    <p className="character-sheet__detail-meta">Formula: {pairing.formulaLabel}</p>
                    <p className="character-sheet__detail-meta">
                      Examples: {pairing.examples.join(', ')}
                    </p>
                  </section>
                ))}
              </div>
            </details>
          </article>

          <article className="dashboard-card character-sheet__notes">
            <div className="dashboard-card__header">
              <h2>Notes</h2>
              <p>Campaign hooks, personality beats, and reminders.</p>
            </div>

            <p className="character-sheet__notes-copy">{character.notes || 'No notes saved yet.'}</p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default CharacterSheetPage
