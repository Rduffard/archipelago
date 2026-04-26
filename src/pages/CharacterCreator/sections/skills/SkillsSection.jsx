import SkillsStep from '../../../../components/creator/SkillsStep/SkillsStep'

function SkillsSection({
  finalAttributes,
  onSkillRankChange,
  remainingSkillPoints,
  skillGroups,
  skills,
  totalSkillPoints,
}) {
  return (
    <SkillsStep
      skillGroups={skillGroups}
      skills={skills}
      finalAttributes={finalAttributes}
      remainingSkillPoints={remainingSkillPoints}
      totalSkillPoints={totalSkillPoints}
      onSkillRankChange={onSkillRankChange}
    />
  )
}

export default SkillsSection
