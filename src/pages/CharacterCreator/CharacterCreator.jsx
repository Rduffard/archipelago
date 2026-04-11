import { useMemo, useState } from 'react'
import AttributesStep from '../../components/creator/AttributesStep'
import { CallingStep, WorldPathStep } from '../../components/creator/IdentityStep'
import ReviewStep from '../../components/creator/ReviewStep'
import { ATTRIBUTE_POINTS, callings, origins, originPaths } from '../../data/gameData'
import { getOriginStartingReputation } from '../../data/reputationData'
import {
  applyAttributeBonus,
  calculateDerivedStats,
  calculatePairingStats,
  calculateSocialStats,
  createEmptyAttributes,
  getRemainingPoints,
} from '../../lib/character'
import './CharacterCreator.css'

const initialIdentity = {
  name: '',
  pronouns: '',
  callingId: '',
  path: '',
  originId: '',
}

const PATH_ORIGIN_MAP = {
  yuma: 'yuma-core',
  lilin: 'lilin-core',
}

const steps = [
  {
    id: 'identity',
    title: 'Roots',
    description: 'Name the character and choose a world path or island origin.',
  },
  {
    id: 'calling',
    title: 'Calling',
    description: 'Define the role this character plays.',
  },
  {
    id: 'attributes',
    title: 'Attributes',
    description: 'Spend the 12 starting points.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Check the frame and save the sheet.',
  },
]

function CharacterCreator({ onCreateCharacter, isSaving = false, showIntro = true }) {
  const [identity, setIdentity] = useState(initialIdentity)
  const [attributeValues, setAttributeValues] = useState(createEmptyAttributes)
  const [saveMessage, setSaveMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

  const selectedCalling = callings.find((entry) => entry.id === identity.callingId)
  const selectedOrigin = origins.find((entry) => entry.id === identity.originId)
  const selectedPath = originPaths.find((entry) => entry.id === identity.path)
  const finalAttributes = useMemo(
    () => applyAttributeBonus(attributeValues, selectedOrigin?.bonus),
    [attributeValues, selectedOrigin?.bonus],
  )
  const startingReputation = useMemo(
    () => getOriginStartingReputation(identity.originId),
    [identity.originId],
  )
  const derivedStats = useMemo(() => calculateDerivedStats(finalAttributes), [finalAttributes])
  const socialStats = useMemo(() => calculateSocialStats(finalAttributes), [finalAttributes])
  const pairingStats = useMemo(() => calculatePairingStats(finalAttributes), [finalAttributes])
  const remainingPoints = getRemainingPoints(attributeValues)
  const trimmedName = identity.name.trim()
  const hasValidName = trimmedName.length >= 2

  const isIdentityComplete =
    hasValidName &&
    Boolean(identity.path) &&
    (identity.path === 'archipelago' ? Boolean(identity.originId) : Boolean(PATH_ORIGIN_MAP[identity.path]))

  const validations = useMemo(
    () => ({
      identity: isIdentityComplete,
      calling: Boolean(identity.callingId),
      attributes: remainingPoints === 0,
      review:
        isIdentityComplete &&
        Boolean(identity.callingId) &&
        Boolean(identity.originId) &&
        remainingPoints === 0,
    }),
    [identity.callingId, identity.originId, isIdentityComplete, remainingPoints],
  )

  function handleIdentityChange(field, value) {
    setSaveMessage('')

    setIdentity((current) => {
      if (field === 'path') {
        return {
          ...current,
          path: value,
          originId: value === 'archipelago' ? '' : PATH_ORIGIN_MAP[value] ?? '',
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  function handleAttributeChange(key, nextValue) {
    setSaveMessage('')

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
    if (!onCreateCharacter || !validations.review) {
      return
    }

    const payload = {
      name: trimmedName,
      pronouns: identity.pronouns.trim(),
      calling: identity.callingId,
      origin: identity.originId,
      rank: 1,
      attributes: finalAttributes,
      derivedStats,
      socialStats,
      pairingStats,
      reputation: startingReputation,
      passives: [
        selectedCalling ? `${selectedCalling.passive}: ${selectedCalling.passiveRule}` : null,
        selectedOrigin ? `${selectedOrigin.passive}: ${selectedOrigin.passiveRule}` : null,
        selectedOrigin ? `Drawback - ${selectedOrigin.drawback}: ${selectedOrigin.drawbackRule}` : null,
      ].filter(Boolean),
      wounds: [],
      abilities: selectedCalling
        ? [
            {
              name: selectedCalling.starterAbility,
              description: `${selectedCalling.starterAbilityType}. ${selectedCalling.starterAbilityRule}`,
              source: 'calling',
            },
          ]
        : [],
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

  function getStepValidity(stepId) {
    return validations[stepId]
  }

  function isStepAccessible(stepIndex) {
    return steps.slice(0, stepIndex).every((step) => getStepValidity(step.id))
  }

  function handleGoToStep(stepIndex) {
    if (stepIndex === currentStep || isStepAccessible(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  function handleNextStep() {
    const nextStep = Math.min(currentStep + 1, steps.length - 1)

    if (isStepAccessible(nextStep)) {
      setCurrentStep(nextStep)
    }
  }

  function handlePreviousStep() {
    setCurrentStep((current) => Math.max(current - 1, 0))
  }

  const currentStepMeta = steps[currentStep]
  const canGoNext = currentStepMeta.id === 'review' ? false : isStepAccessible(currentStep + 1)

  let stepContent = null

  if (currentStepMeta.id === 'identity') {
    stepContent = <WorldPathStep identity={identity} onIdentityChange={handleIdentityChange} />
  }

  if (currentStepMeta.id === 'calling') {
    stepContent = <CallingStep identity={identity} onIdentityChange={handleIdentityChange} />
  }

  if (currentStepMeta.id === 'attributes') {
    stepContent = (
      <AttributesStep attributeValues={attributeValues} onAttributeChange={handleAttributeChange} />
    )
  }

  if (currentStepMeta.id === 'review') {
    stepContent = (
      <ReviewStep
        identity={identity}
        attributeValues={attributeValues}
        derivedStats={derivedStats}
        socialStats={socialStats}
        reputation={startingReputation}
      />
    )
  }

  let actionHint = 'You can jump between unlocked steps from the rail above.'

  if (currentStepMeta.id === 'identity' && !validations.identity) {
    if (!trimmedName) {
      actionHint = 'Give the character a name before moving on.'
    } else if (!hasValidName) {
      actionHint = 'Character names need at least 2 characters.'
    } else if (!identity.path) {
      actionHint = 'Pick Yuma, Lilin, or the Archipelago to continue.'
    } else {
      actionHint = 'Choose one of the island origins to continue.'
    }
  }

  if (currentStepMeta.id === 'calling' && !validations.calling) {
    actionHint = 'Choose a calling before moving on.'
  }

  if (currentStepMeta.id === 'attributes' && !validations.attributes) {
    actionHint = `Spend the remaining ${remainingPoints} point${remainingPoints === 1 ? '' : 's'} to continue.`
  }

  if (currentStepMeta.id === 'review' && !validations.review) {
    actionHint = `Spend all ${ATTRIBUTE_POINTS} points and finish the earlier choices to save.`
  }

  return (
    <section className="creator-page creator-page--embedded">
      {showIntro ? (
        <section className="hero-banner">
          <p className="hero-banner__eyebrow">Sanguine Archipelago</p>
          <h1>Character Creator</h1>
          <p className="hero-banner__copy">
            A guided first pass for your tabletop app, grounded in world paths, callings,
            island origins, thematic attributes, and the politics waiting for you offshore.
          </p>
        </section>
      ) : null}

      <section className="creator-stepper">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep
          const isComplete = getStepValidity(step.id)
          const isAccessible = isStepAccessible(index)

          return (
            <button
              key={step.id}
              type="button"
              className={`creator-stepper__item ${isCurrent ? 'is-current' : ''} ${
                isComplete ? 'is-complete' : ''
              }`}
              onClick={() => handleGoToStep(index)}
              disabled={!isAccessible}
            >
              <span className="creator-stepper__index">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </button>
          )
        })}
      </section>

      <section className="creator-summary">
        <p className="creator-summary__label">Current Build</p>
        <div className="creator-summary__chips">
          <span>
            <strong>World Path:</strong> {selectedPath?.name || 'Not chosen'}
          </span>
          <span>
            <strong>Origin:</strong>{' '}
            {selectedOrigin?.name ||
              (identity.path === 'archipelago' ? 'Select an island' : 'Pending from world path')}
          </span>
          <span>
            <strong>Calling:</strong> {selectedCalling?.name || 'Not chosen'}
          </span>
          <span>
            <strong>Points Left:</strong> {remainingPoints}
          </span>
        </div>
      </section>

      <div className="creator-stack">{stepContent}</div>

      <section className="creator-submit">
        <div>
          <p>
            {currentStepMeta.id === 'review'
              ? 'One last breath, and this name is no longer a rumor. Save the sheet, and let the sea decide what survives it.'
              : 'The flow is staged so new players can stay simple while island-born builds open deeper nuance.'}
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
            <div className="creator-submit__primary">
              <button type="button" onClick={handleNextStep} disabled={!canGoNext}>
                Next Step
              </button>
              {!canGoNext ? <p className="creator-submit__hint">{actionHint}</p> : null}
            </div>
          ) : (
            <div className="creator-submit__primary">
              <button
                type="button"
                onClick={handleSaveCharacter}
                disabled={!validations.review || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Character'}
              </button>
              {!validations.review ? <p className="creator-submit__hint">{actionHint}</p> : null}
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default CharacterCreator
