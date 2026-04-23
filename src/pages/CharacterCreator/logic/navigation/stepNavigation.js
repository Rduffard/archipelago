import { CREATOR_STEPS } from '../config/creatorConfig'

export function createNavigation({
  currentStep,
  setCurrentStep,
  validations,
}) {
  function getStepValidity(stepId) {
    return validations[stepId]
  }

  function isStepAccessible(stepIndex) {
    return CREATOR_STEPS.slice(0, stepIndex).every((step) => getStepValidity(step.id))
  }

  function handleGoToStep(stepIndex) {
    if (stepIndex === currentStep || isStepAccessible(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  function handleNextStep() {
    const nextStep = Math.min(currentStep + 1, CREATOR_STEPS.length - 1)

    if (isStepAccessible(nextStep)) {
      setCurrentStep(nextStep)
    }
  }

  function handlePreviousStep() {
    setCurrentStep((current) => Math.max(current - 1, 0))
  }

  const currentStepMeta = CREATOR_STEPS[currentStep]
  const canGoNext = currentStepMeta.id === 'review' ? false : isStepAccessible(currentStep + 1)

  return {
    canGoNext,
    currentStepMeta,
    getStepValidity,
    handleGoToStep,
    handleNextStep,
    handlePreviousStep,
    isStepAccessible,
  }
}
