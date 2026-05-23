import SkillsStep from '../../../../components/creator/SkillsStep/SkillsStep'

function SkillsSection({
  checks,
  coreCheckInvestments,
  finalAttributes,
  onCoreCheckInvestmentChange,
  onSkillRankChange,
  remainingCorePoints,
  remainingSpecialtyPicks,
  skillGroups,
  skills,
  totalCorePoints,
  totalSpecialtyPicks,
}) {
  return (
    <SkillsStep
      checks={checks}
      coreCheckInvestments={coreCheckInvestments}
      skillGroups={skillGroups}
      skills={skills}
      finalAttributes={finalAttributes}
      remainingCorePoints={remainingCorePoints}
      remainingSpecialtyPicks={remainingSpecialtyPicks}
      totalCorePoints={totalCorePoints}
      totalSpecialtyPicks={totalSpecialtyPicks}
      onCoreCheckInvestmentChange={onCoreCheckInvestmentChange}
      onSkillRankChange={onSkillRankChange}
    />
  )
}

export default SkillsSection
