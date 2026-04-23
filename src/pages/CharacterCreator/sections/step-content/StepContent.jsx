import { STEP_COMPONENTS } from './stepRegistry'

function StepContent({ currentStepId, stepPropsById }) {
  const ActiveStepComponent = STEP_COMPONENTS[currentStepId]

  if (!ActiveStepComponent) {
    return null
  }

  return <ActiveStepComponent {...(stepPropsById[currentStepId] ?? {})} />
}

export default StepContent
