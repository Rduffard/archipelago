import ReviewStep from '../../../../components/creator/ReviewStep/ReviewStep'

function ReviewSection({
  attributeValues,
  details,
  identity,
  loadout,
  progressionValues,
  resourceMaximums,
  resourceValues,
  training,
  trainingOptions,
  startingReputation,
  wounds,
}) {
  return (
    <ReviewStep
      identity={identity}
      attributeValues={attributeValues}
      reputation={startingReputation}
      details={details}
      loadout={loadout}
      resources={resourceValues}
      resourceMaximums={resourceMaximums}
      training={training}
      trainingOptions={trainingOptions}
      wounds={wounds}
      progression={progressionValues}
    />
  )
}

export default ReviewSection
