import ReviewStep from '../../../../components/creator/ReviewStep/ReviewStep'

function ReviewSection({
  attributeValues,
  checks,
  details,
  identity,
  loadout,
  progressionValues,
  resourceMaximums,
  resourceValues,
  skills,
  startingReputation,
  wounds,
}) {
  return (
    <ReviewStep
      identity={identity}
      attributeValues={attributeValues}
      checks={checks}
      reputation={startingReputation}
      details={details}
      loadout={loadout}
      resources={resourceValues}
      resourceMaximums={resourceMaximums}
      skills={skills}
      wounds={wounds}
      progression={progressionValues}
    />
  )
}

export default ReviewSection
