import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import CharacterSheetHeader from './CharacterSheetHeader/CharacterSheetHeader'
import CharacterSheetLoadout from './CharacterSheetLoadout/CharacterSheetLoadout'
import CharacterSheetOverview from './CharacterSheetOverview/CharacterSheetOverview'
import CharacterSheetReferenceGroups from './CharacterSheetReferenceGroups/CharacterSheetReferenceGroups'
import CharacterSheetSkills from './CharacterSheetSkills/CharacterSheetSkills'
import {
  getAttributeDetails,
  getDerivedStatDetails,
  getPairingCategoryDetails,
  getSocialStatDetails,
} from '../../data/characterSheetData'
import {
  getSystemCallings,
  getSystemOrigins,
  getSystemPairings,
} from '../../data/archipelagoSystemSelectors'
import { deleteCharacter, getCharacterById } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { useSystem } from '../../hooks/useSystem'
import '../shared/PageShell.css'
import {
  buildReferenceGroups,
  buildReputationEntries,
  getAbilityEntries,
  getCatalogGroups,
  getCharacterPairingStats,
  getIdentityEntries,
  getOriginBonus,
  getProgressionEntries,
  getTrackerValue,
  getTraitEntries,
  getSkillGroups,
} from './characterSheetHelpers'
import './CharacterSheetPage.css'

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
  const activeReputation = buildReputationEntries(character, blueprint)
  const pairingStats = getCharacterPairingStats(character, pairings)
  const originBonus = getOriginBonus(origin)
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
  const skillGroups = getSkillGroups(character, blueprint?.expandedSkillList ?? {})
  const referenceGroups = buildReferenceGroups({
    blueprint,
    character,
    derivedStatDetails,
    pairingCategoryDetails,
    pairingStats,
    pairings,
    socialStatDetails,
  })

  return (
    <main className="page-shell">
      <section className="character-sheet">
        <Link className="character-sheet__back" to="/characters">
          {'<-'} Back to roster
        </Link>

        <CharacterSheetHeader
          calling={calling}
          character={character}
          characterRank={characterRank}
          deleteError={deleteError}
          isDeleting={isDeleting}
          onDelete={handleDeleteCharacter}
          origin={origin}
        />

        <section className="character-sheet__layout">
          <CharacterSheetOverview
            abilities={abilities}
            activeReputation={activeReputation}
            attributeDetails={attributeDetails}
            blueprint={blueprint}
            character={character}
            corruption={corruption}
            focus={focus}
            health={health}
            identityEntries={identityEntries}
            originBonus={originBonus}
            progressionEntries={progressionEntries}
            stamina={stamina}
            traits={traits}
            woundTrack={woundTrack}
          />

          <CharacterSheetSkills skillGroups={skillGroups} />
          <CharacterSheetReferenceGroups referenceGroups={referenceGroups} />
          <CharacterSheetLoadout character={character} visibleCatalogGroups={visibleCatalogGroups} />
        </section>
      </section>
    </main>
  )
}

export default CharacterSheetPage
