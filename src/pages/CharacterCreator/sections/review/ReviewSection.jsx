import ReviewStep from '../../../../components/creator/ReviewStep/ReviewStep'

function ReviewSection({
  attributeValues,
  derivedStats,
  details,
  identity,
  loadout,
  progressionValues,
  resourceMaximums,
  resourceValues,
  skills,
  socialStats,
  startingReputation,
  wounds,
}) {
  return (
    <ReviewStep
      identity={identity}
      attributeValues={attributeValues}
      derivedStats={derivedStats}
      socialStats={socialStats}
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
