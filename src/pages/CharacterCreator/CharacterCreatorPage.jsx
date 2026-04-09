import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import CharacterCreator from './CharacterCreator'
import { createCharacter } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

function CharacterCreatorPage() {
  const navigate = useNavigate()
  const { token, setCharacters } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleCreateCharacter(payload) {
    setIsSaving(true)
    setSaveError('')

    try {
      const createdCharacter = await createCharacter(token, payload)
      setCharacters((current) => [createdCharacter, ...current])
      navigate('/dashboard')
    } catch (error) {
      setSaveError(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="standalone-page">
      <PageHeader
        eyebrow="New Character"
        title="Forge a New Sheet"
        description="Build outside the dashboard, save when the spread feels right, then head back to your roster."
        backTo="/dashboard"
        backLabel="Return to dashboard"
      />

      {saveError ? <p className="dashboard-card__error standalone-page__error">{saveError}</p> : null}

      <CharacterCreator
        onCreateCharacter={handleCreateCharacter}
        isSaving={isSaving}
        showIntro={false}
      />
    </main>
  )
}

export default CharacterCreatorPage
