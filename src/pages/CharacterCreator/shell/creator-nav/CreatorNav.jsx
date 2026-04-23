import './CreatorNav.css'

function CreatorNav({
  currentStep,
  currentStepMeta,
  getStepValidity,
  onGoToStep,
  originSummaryValue,
  remainingPoints,
  remainingSkillPoints,
  selectedCalling,
  steps,
  isStepAccessible,
}) {
  return (
    <section className="creator-nav">
      <div className="creator-nav__header">
        <div>
          <p className="creator-summary__label">Step {currentStep + 1} of {steps.length}</p>
          <h2>{currentStepMeta.title}</h2>
          <p>{currentStepMeta.description}</p>
        </div>
        <div className="creator-nav__progress">
          <strong>{Math.round(((currentStep + 1) / steps.length) * 100)}%</strong>
          <span>Flow Progress</span>
        </div>
      </div>

      <section className="creator-stepper">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep
          const isComplete = index < currentStep && getStepValidity(step.id)
          const isAccessible = isStepAccessible(index)

          return (
            <button
              key={step.id}
              type="button"
              className={`creator-stepper__item ${isCurrent ? 'is-current' : ''} ${
                isComplete ? 'is-complete' : ''
              } ${!isAccessible ? 'is-locked' : ''} ${
                isAccessible && !isCurrent && !isComplete ? 'is-open' : ''
              }`}
              onClick={() => onGoToStep(index)}
              disabled={!isAccessible}
            >
              <span className="creator-stepper__index">{index + 1}</span>
              <div className="creator-stepper__copy">
                <strong>{step.title}</strong>
                <span>
                  {isCurrent ? 'Current' : isComplete ? 'Done' : isAccessible ? 'Available' : 'Locked'}
                </span>
              </div>
            </button>
          )
        })}
      </section>

      <section className="creator-summary">
        <p className="creator-summary__label">Current Build</p>
        <div className="creator-summary__chips">
          <span>
            <strong>Origin</strong> {originSummaryValue}
          </span>
          <span>
            <strong>Calling</strong> {selectedCalling?.name || 'Not chosen'}
          </span>
          <span>
            <strong>Attr</strong> {remainingPoints} left
          </span>
          <span>
            <strong>Skills</strong> {remainingSkillPoints} left
          </span>
        </div>
      </section>
    </section>
  )
}

export default CreatorNav
