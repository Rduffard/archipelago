import CreatorStepFrame from '../../../../components/creator/shared/CreatorStepFrame/CreatorStepFrame'

function StatusPanel({ description, step = 'System Data', title }) {
  return (
    <CreatorStepFrame
      step={step}
      title={title}
      description={description}
    />
  )
}

export default StatusPanel
