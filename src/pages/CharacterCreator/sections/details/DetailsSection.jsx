import DetailsStep from '../../../../components/creator/DetailsStep/DetailsStep'

function DetailsSection({
  details,
  onAddWound,
  onDetailsChange,
  onRemoveWound,
  onResourceChange,
  onWoundChange,
  resourceMaximums,
  resourceValues,
  wounds,
}) {
  return (
    <DetailsStep
      details={details}
      resources={resourceValues}
      resourceMaximums={resourceMaximums}
      wounds={wounds}
      onDetailsChange={onDetailsChange}
      onResourceChange={onResourceChange}
      onWoundChange={onWoundChange}
      onAddWound={onAddWound}
      onRemoveWound={onRemoveWound}
    />
  )
}

export default DetailsSection
