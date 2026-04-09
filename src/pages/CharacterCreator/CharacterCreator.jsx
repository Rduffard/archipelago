import { useState } from 'react'
import AttributesStep from '../../components/creator/AttributesStep'
import { IdentityStep, OriginStep } from '../../components/creator/IdentityStep'
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

const steps = [
  {
    id: 'calling',
    title: 'Calling',
    description: 'Choose the playstyle and basic identity.',
  },
  {
    id: 'origin',
    title: 'Origin',
    description: 'Pick the path and place that shaped the character.',
  },
  {
    id: 'attributes',
    title: 'Attributes',
    description: 'Spend the 12 starting points.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm the sheet and save it.',
  },
]

function CharacterCreator({ onCreateCharacter, isSaving = false, showIntro = true }) {
  const [identity, setIdentity] = useState(initialIdentity)
  const [attributeValues, setAttributeValues] = useState(createEmptyAttributes)
  const [saveMessage, setSaveMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

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

  function handleNextStep() {
    setCurrentStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function handlePreviousStep() {
    setCurrentStep((current) => Math.max(current - 1, 0))
  }

  const isIdentityValid = Boolean(identity.name.trim()) && Boolean(identity.callingId)
  const isOriginValid = Boolean(identity.path) && Boolean(identity.originId)
  const isAttributesValid = remainingPoints === 0
  const canSave = Boolean(identity.name.trim()) && remainingPoints === 0
  const currentStepMeta = steps[currentStep]

  let stepContent = null
  let canGoNext = false

  if (currentStepMeta.id === 'calling') {
    stepContent = <IdentityStep identity={identity} onIdentityChange={handleIdentityChange} />
    canGoNext = isIdentityValid
  }

  if (currentStepMeta.id === 'origin') {
    stepContent = <OriginStep identity={identity} onIdentityChange={handleIdentityChange} />
    canGoNext = isOriginValid
  }

  if (currentStepMeta.id === 'attributes') {
    stepContent = (
      <AttributesStep attributeValues={attributeValues} onAttributeChange={handleAttributeChange} />
    )
    canGoNext = isAttributesValid
  }

  if (currentStepMeta.id === 'review') {
    stepContent = (
      <ReviewStep
        identity={identity}
        attributeValues={attributeValues}
        derivedStats={derivedStats}
      />
    )
  }

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

      <section className="creator-stepper">
        {steps.map((step, index) => (
          <article
            key={step.id}
            className={`creator-stepper__item ${
              index === currentStep ? 'is-current' : index < currentStep ? 'is-complete' : ''
            }`}
          >
            <span className="creator-stepper__index">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </section>

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

      <div className="creator-stack">{stepContent}</div>

      <section className="creator-submit">
        <div>
          <p>
            {currentStepMeta.id === 'review'
              ? `Spend all ${ATTRIBUTE_POINTS} points and give the character a name to save.`
              : 'Move one step at a time. We only ask for what matters right now.'}
          </p>
          {saveMessage ? <strong>{saveMessage}</strong> : null}
        </div>

        <div className="creator-submit__actions">
          {currentStep > 0 ? (
            <button
              type="button"
              className="creator-submit__secondary"
              onClick={handlePreviousStep}
              disabled={isSaving}
            >
              Back
            </button>
          ) : null}

          {currentStepMeta.id !== 'review' ? (
            <button type="button" onClick={handleNextStep} disabled={!canGoNext}>
              Next Step
            </button>
          ) : (
            <button type="button" onClick={handleSaveCharacter} disabled={!canSave || isSaving}>
              {isSaving ? 'Saving...' : 'Save Character'}
            </button>
          )}
        </div>
      </section>
    </section>
  )
}

export default CharacterCreator
