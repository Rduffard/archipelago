import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import './SkillsStep.css'

function SkillsStep({
  skillGroups,
  skills,
  finalAttributes,
  remainingSkillPoints,
  totalSkillPoints,
  onSkillRankChange,
}) {
  function titleCase(value = '') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  function getSkillScore(skill, rank) {
    return (
      10 +
      skill.linkedAttributes.reduce(
        (total, attribute) => total + (finalAttributes?.[attribute] ?? 0),
        0,
      ) +
      rank
    )
  }

  return (
    <CreatorStepFrame
      step="Step 4"
      title="Train the skills"
      description="Spend your starting training on the skills this character can already bring to bear under pressure."
    >
      <div className="points-banner">
        <div>
          <span className="creator-summary__label">Skill Training</span>
          <p>These ranks feed directly into the canonical grouped `skills` structure.</p>
        </div>
        <strong>
          {remainingSkillPoints} / {totalSkillPoints}
        </strong>
      </div>

      <div className="creator-skill-columns">
        {skillGroups.map((group) => (
          <section key={group.key} className="choice-group choice-group--skill-category">
            <div className="choice-group__header">
              <h3>{group.label}</h3>
              <p>{group.description}</p>
            </div>

            <div className="attribute-list attribute-list--skill-grid">
              {group.skills.map((skill) => {
                const savedSkill = skills[group.key]?.find((entry) => entry.id === skill.id)
                const rank = savedSkill?.rank ?? 0
                const canIncrease = remainingSkillPoints > 0 && rank < 3
                const score = getSkillScore(skill, rank)

                return (
                  <article key={`${group.key}-${skill.id}`} className="attribute-row attribute-row--skill">
                    <div className="attribute-row__copy attribute-row__copy--skill">
                      <div className="creator-skill-topline">
                        <span className="creator-skill-name has-detail" tabIndex={0}>
                          {skill.name}
                          <span className="creator-skill-name__detail">{skill.verb}</span>
                        </span>
                        <span className="creator-skill-links">
                          {skill.linkedAttributes.map((attribute) => attribute[0].toUpperCase() + attribute.slice(1)).join(' / ')}
                        </span>
                      </div>
                    </div>

                    <div className="creator-skill-score has-detail" tabIndex={0}>
                      {score}
                      <span className="creator-skill-score__detail">
                        {`Base 10\n${skill.linkedAttributes
                          .map((attribute) => `${titleCase(attribute)} ${finalAttributes?.[attribute] ?? 0}`)
                          .join('\n')}\nSkill Rank ${rank}\nCurrent Score ${score}`}
                      </span>
                    </div>

                    <div className="attribute-row__controls">
                      <button
                        type="button"
                        onClick={() => onSkillRankChange(group.key, skill, rank - 1)}
                        disabled={rank <= 0}
                      >
                        -
                      </button>
                      <span>{rank}</span>
                      <button
                        type="button"
                        onClick={() => onSkillRankChange(group.key, skill, rank + 1)}
                        disabled={!canIncrease}
                      >
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </CreatorStepFrame>
  )
}

export default SkillsStep
