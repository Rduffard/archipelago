import './SubmitBar.css'

function SubmitBar({
  actionHint,
  canGoNext,
  currentStep,
  currentStepId,
  isEditing,
  isSaving,
  onNextStep,
  onPreviousStep,
  onSaveCharacter,
  saveMessage,
  isReviewValid,
}) {
  return (
    <section className="creator-submit">
      <div>
        <p>
          {currentStepId === 'review'
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
            onClick={onPreviousStep}
            disabled={isSaving}
          >
            Back
          </button>
        ) : null}

        {currentStepId !== 'review' ? (
          <div className="creator-submit__primary">
            <button type="button" onClick={onNextStep} disabled={!canGoNext}>
              Next Step
            </button>
            {!canGoNext ? <p className="creator-submit__hint">{actionHint}</p> : null}
          </div>
        ) : (
          <div className="creator-submit__primary">
            <button
              type="button"
              onClick={onSaveCharacter}
              disabled={!isReviewValid || isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Character' : 'Save Character'}
            </button>
            {!isReviewValid ? <p className="creator-submit__hint">{actionHint}</p> : null}
          </div>
        )}
      </div>
    </section>
  )
}

export default SubmitBar
