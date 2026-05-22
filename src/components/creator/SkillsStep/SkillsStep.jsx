import HoverInfo from '../../ui/HoverInfo/HoverInfo'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import './SkillsStep.css'

function SkillsStep({
  skillGroups,
  skills,
  remainingSkillPoints,
  totalSkillPoints,
  onSkillRankChange,
}) {
  function titleCase(value = '') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <CreatorStepFrame
      step="Step 4"
      title="Train specialties"
      description="Spend starting training on skills that modify core checks when the situation fits."
    >
      <div className="points-banner">
        <div>
          <span className="creator-summary__label">Skill Training</span>
          <p>Checks are the rolls. Skills add trained edges, permissions, and situational modifiers.</p>
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

                return (
                  <article key={`${group.key}-${skill.id}`} className="attribute-row attribute-row--skill">
                    <div className="attribute-row__copy attribute-row__copy--skill">
                      <div className="creator-skill-topline">
                        <HoverInfo
                          className="creator-skill-name"
                          content={skill.verb}
                          contentClassName="creator-skill-name__detail"
                        >
                          {skill.name}
                        </HoverInfo>
                        <span className="creator-skill-links">
                          {skill.linkedAttributes.map((attribute) => attribute[0].toUpperCase() + attribute.slice(1)).join(' / ')}
                        </span>
                      </div>
                    </div>

                    <HoverInfo
                      as="div"
                      className="creator-skill-score"
                      content={`Trained specialty\nLinked Attributes: ${skill.linkedAttributes
                        .map(titleCase)
                        .join(' / ')}\nRank ${rank}\nApplies as a contextual modifier to core checks.`}
                      contentClassName="creator-skill-score__detail"
                      placement="bottom-end"
                    >
                      +{rank}
                    </HoverInfo>

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
