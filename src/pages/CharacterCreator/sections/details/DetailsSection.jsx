import DetailsStep from '../../../../components/creator/DetailsStep/DetailsStep'

function DetailsSection({
  isEditing,
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
      isEditing={isEditing}
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
