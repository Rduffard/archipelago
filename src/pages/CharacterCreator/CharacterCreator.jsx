import CreatorNav from './shell/creator-nav/CreatorNav'
import Hero from './shell/hero/Hero'
import StatusPanel from './shell/status/StatusPanel'
import StepContent from './sections/step-content/StepContent'
import SubmitBar from './shell/submit/SubmitBar'
import { useSystem } from '../../hooks/useSystem'
import { CREATOR_STEPS } from './logic/config/creatorConfig'
import useCreatorController from './logic/controller/useCreatorController'
import './CharacterCreator.css'

function CharacterCreatorSession({
  blueprint,
  initialCharacter,
  isSaving,
  onSaveCharacter,
  showIntro,
}) {
  const {
    actionHint,
    canGoNext,
    currentStep,
    currentStepMeta,
    getStepValidity,
    handleGoToStep,
    handleNextStep,
    handlePreviousStep,
    handleSaveCharacter,
    isEditing,
    isStepAccessible,
    originSummaryValue,
    remainingPoints,
    remainingSkillPoints,
    saveMessage,
    selectedCalling,
    stepPropsById,
    validations,
  } = useCreatorController({
    blueprint,
    initialCharacter,
    onSaveCharacter,
  })

  return (
    <section className="creator-page creator-page--embedded">
      {showIntro ? (
        <Hero copy="A guided first pass for your tabletop app, grounded in world paths, callings, island origins, thematic attributes, and the politics waiting for you offshore." />
      ) : null}

      <CreatorNav
        currentStep={currentStep}
        currentStepMeta={currentStepMeta}
        getStepValidity={getStepValidity}
        onGoToStep={handleGoToStep}
        originSummaryValue={originSummaryValue}
        remainingPoints={remainingPoints}
        remainingSkillPoints={remainingSkillPoints}
        selectedCalling={selectedCalling}
        steps={CREATOR_STEPS}
        isStepAccessible={isStepAccessible}
      />

      <div className="creator-stack">
        <StepContent currentStepId={currentStepMeta.id} stepPropsById={stepPropsById} />
      </div>

      <SubmitBar
        actionHint={actionHint}
        canGoNext={canGoNext}
        currentStep={currentStep}
        currentStepId={currentStepMeta.id}
        isEditing={isEditing}
        isReviewValid={validations.review}
        isSaving={isSaving}
        onNextStep={handleNextStep}
        onPreviousStep={handlePreviousStep}
        onSaveCharacter={handleSaveCharacter}
        saveMessage={saveMessage}
      />
    </section>
  )
}

function CharacterCreator({
  onSaveCharacter,
  initialCharacter = null,
  isSaving = false,
  showIntro = true,
}) {
  const { blueprint, isBlueprintLoading, blueprintError } = useSystem()

  if (isBlueprintLoading && !blueprint) {
    return (
      <section className="creator-page creator-page--embedded">
        {showIntro ? (
          <Hero copy="Pulling the shared system blueprint so this creator uses the canonical world paths, callings, origins, and sheet math." />
        ) : null}

        <StatusPanel
          title="Loading creator blueprint"
          description="The creator is waiting for the backend system package before it unlocks choices."
        />
      </section>
    )
  }

  if (blueprintError || !blueprint) {
    return (
      <section className="creator-page creator-page--embedded">
        {showIntro ? (
          <Hero copy="This flow is now driven by the shared system blueprint instead of local fallback data." />
        ) : null}

        <StatusPanel
          title="Blueprint unavailable"
          description={blueprintError || 'The shared system blueprint could not be loaded.'}
        />
      </section>
    )
  }

  return (
    <CharacterCreatorSession
      key={`${initialCharacter?._id ?? 'new'}-${blueprint?.updatedAt ?? 'blueprint'}`}
      blueprint={blueprint}
      initialCharacter={initialCharacter}
      isSaving={isSaving}
      onSaveCharacter={onSaveCharacter}
      showIntro={showIntro}
    />
  )
}

export default CharacterCreator
