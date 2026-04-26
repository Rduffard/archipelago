import ProgressionStep from '../../../../components/creator/ProgressionStep/ProgressionStep'

function ProgressionSection({
  activeSpecialization,
  advancementSpent,
  onProgressionChange,
  progressionValues,
  rankedSpecializations,
  recommendedSpecializations,
  specializations,
}) {
  return (
    <ProgressionStep
      progression={progressionValues}
      specializations={specializations}
      activeSpecialization={activeSpecialization}
      recommendedSpecializations={recommendedSpecializations}
      rankedSpecializations={rankedSpecializations}
      advancementSpent={advancementSpent}
      onProgressionChange={onProgressionChange}
    />
  )
}

export default ProgressionSection
