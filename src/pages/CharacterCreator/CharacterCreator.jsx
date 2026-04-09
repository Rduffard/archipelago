import { useState } from 'react'
import AttributesStep from '../../components/creator/AttributesStep'
import IdentityStep from '../../components/creator/IdentityStep'
import ReviewStep from '../../components/creator/ReviewStep'
import { ATTRIBUTE_POINTS, callings, origins } from '../../data/gameData'
import { calculateDerivedStats, createEmptyAttributes, getRemainingPoints } from '../../lib/character'
import './CharacterCreator.css'

const initialIdentity = {
  name: '',
  pronouns: '',
  callingId: callings[0].id,
  path: 'archipelago',
  originId: origins.find((origin) => origin.path === 'archipelago')?.id ?? '',
}

function CharacterCreator({ onCreateCharacter, isSaving = false, showIntro = true }) {
  const [identity, setIdentity] = useState(initialIdentity)
  const [attributeValues, setAttributeValues] = useState(createEmptyAttributes)
  const [saveMessage, setSaveMessage] = useState('')

  const derivedStats = calculateDerivedStats(attributeValues)
  const remainingPoints = getRemainingPoints(attributeValues)

  function handleIdentityChange(field, value) {
    setIdentity((current) => {
      if (field === 'path') {
        const nextOrigin = origins.find((origin) => origin.path === value)

        return {
          ...current,
          path: value,
          originId: nextOrigin?.id ?? '',
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  function handleAttributeChange(key, nextValue) {
    setAttributeValues((current) => {
      const clampedValue = Math.max(0, Math.min(4, nextValue))
      const draft = { ...current, [key]: clampedValue }

      if (getRemainingPoints(draft) < 0) {
        return current
      }

      return draft
    })
  }

  async function handleSaveCharacter() {
    if (!onCreateCharacter) {
      return
    }

    const payload = {
      name: identity.name.trim(),
      pronouns: identity.pronouns.trim(),
      calling: identity.callingId,
      origin: identity.originId,
      rank: 1,
      attributes: attributeValues,
      passives: [],
      wounds: [],
      abilities: [],
      inventory: [],
      relics: [],
      notes: '',
      portraitUrl: '',
      campaignId: null,
      status: 'active',
    }

    await onCreateCharacter(payload)
    setSaveMessage(`${payload.name || 'Character'} saved to your roster.`)
  }

  const canSave = Boolean(identity.name.trim()) && remainingPoints === 0

  return (
    <section className="creator-page creator-page--embedded">
      {showIntro ? (
        <section className="hero-banner">
          <p className="hero-banner__eyebrow">Sanguine Archipelago</p>
          <h1>Character Creator</h1>
          <p className="hero-banner__copy">
            A guided first pass for your DnD Beyond style app, grounded in callings,
            origin islands, and thematic attributes.
          </p>
        </section>
      ) : null}

      <section className="status-strip">
        <div>
          <span>Calling</span>
          <strong>{callings.find((entry) => entry.id === identity.callingId)?.name}</strong>
        </div>
        <div>
          <span>Origin</span>
          <strong>{origins.find((entry) => entry.id === identity.originId)?.name}</strong>
        </div>
        <div>
          <span>Points Left</span>
          <strong>{remainingPoints}</strong>
        </div>
      </section>

      <div className="creator-stack">
        <IdentityStep identity={identity} onIdentityChange={handleIdentityChange} />
        <AttributesStep attributeValues={attributeValues} onAttributeChange={handleAttributeChange} />
        <ReviewStep
          identity={identity}
          attributeValues={attributeValues}
          derivedStats={derivedStats}
        />
      </div>

      <section className="creator-submit">
        <div>
          <p>Spend all {ATTRIBUTE_POINTS} points and give the character a name to save.</p>
          {saveMessage ? <strong>{saveMessage}</strong> : null}
        </div>
        <button type="button" onClick={handleSaveCharacter} disabled={!canSave || isSaving}>
          {isSaving ? 'Saving...' : 'Save Character'}
        </button>
      </section>
    </section>
  )
}

export default CharacterCreator
