import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import CharacterCreator from './CharacterCreator'
import { createCharacter, getCharacterById, updateCharacter } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import '../shared/PageShell.css'

function CharacterCreatorPage() {
  const navigate = useNavigate()
  const { characterId } = useParams()
  const { token, characters, setCharacters } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadedCharacter, setLoadedCharacter] = useState(null)
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(Boolean(characterId))
  const [loadError, setLoadError] = useState('')
  const isEditing = Boolean(characterId)
  const rosterCharacter = useMemo(
    () => characters.find((character) => character._id === characterId) ?? null,
    [characterId, characters],
  )

  useEffect(() => {
    if (!characterId) {
      setLoadedCharacter(null)
      setIsLoadingCharacter(false)
      setLoadError('')
      return
    }

    if (rosterCharacter) {
      setLoadedCharacter(rosterCharacter)
      setIsLoadingCharacter(false)
      setLoadError('')
      return
    }

    let cancelled = false

    async function loadCharacter() {
      setIsLoadingCharacter(true)
      setLoadError('')

      try {
        const fetchedCharacter = await getCharacterById(token, characterId)

        if (cancelled) {
          return
        }

        setLoadedCharacter(fetchedCharacter)
        setCharacters((current) => {
          if (current.some((entry) => entry._id === fetchedCharacter._id)) {
            return current.map((entry) => (entry._id === fetchedCharacter._id ? fetchedCharacter : entry))
          }

          return [fetchedCharacter, ...current]
        })
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message)
          setLoadedCharacter(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCharacter(false)
        }
      }
    }

    loadCharacter()

    return () => {
      cancelled = true
    }
  }, [characterId, rosterCharacter, setCharacters, token])

  async function handleSaveCharacter(payload) {
    setIsSaving(true)
    setSaveError('')

    try {
      if (isEditing && characterId) {
        const updatedCharacter = await updateCharacter(token, characterId, payload)
        setCharacters((current) =>
          current.map((entry) => (entry._id === updatedCharacter._id ? updatedCharacter : entry)),
        )
        navigate(`/characters/${updatedCharacter._id}`)
        return
      }

      const createdCharacter = await createCharacter(token, payload)
      setCharacters((current) => [createdCharacter, ...current])
      navigate(`/characters/${createdCharacter._id}`)
    } catch (error) {
      setSaveError(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isEditing && isLoadingCharacter) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Edit Character"
          title="Loading Character"
          description="Pulling the saved sheet before opening the editor."
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  if (isEditing && !loadedCharacter) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Edit Character"
          title="Character Not Found"
          description={loadError || 'This character could not be loaded for editing.'}
          backTo="/characters"
          backLabel="Back to roster"
        />
      </main>
    )
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow={isEditing ? 'Edit Character' : 'New Character'}
        title={isEditing ? `Refit ${loadedCharacter?.name ?? 'Sheet'}` : 'Forge a New Sheet'}
        description={
          isEditing
            ? 'Reopen the sheet, refine the build, and save it back into the richer Archipelago character format.'
            : 'Build outside the dashboard, save when the spread feels right, then head back to your roster.'
        }
        backTo={isEditing && loadedCharacter ? `/characters/${loadedCharacter._id}` : '/dashboard'}
        backLabel={isEditing ? 'Return to sheet' : 'Return to dashboard'}
      />

      {saveError ? <p className="dashboard-card__error page-shell__error">{saveError}</p> : null}

      <CharacterCreator
        onSaveCharacter={handleSaveCharacter}
        initialCharacter={loadedCharacter}
        isSaving={isSaving}
        showIntro={false}
      />
    </main>
  )
}

export default CharacterCreatorPage
