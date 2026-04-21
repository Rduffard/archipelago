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
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 4</p>
        <h2>Train the verb skills</h2>
        <p>
          Spend your starting training on the verbs this character can already do under pressure.
        </p>
      </div>

      <div className="points-banner">
        <div>
          <span className="creator-summary__label">Skill Training</span>
          <p>These ranks feed directly into the canonical grouped `skills` structure.</p>
        </div>
        <strong>
          {remainingSkillPoints} / {totalSkillPoints}
        </strong>
      </div>

      <div className="creator-panel__callout">
        <strong>Skill scope</strong>
        <p>
          Players only set verb skill ranks here. Narrow focuses or specialties can still exist
          later, but those should come from progression, equipment, or GM-facing rules instead of
          open text on the sheet.
        </p>
      </div>

      <div className="creator-stack creator-stack--skill-groups">
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
    </section>
  )
}

export default SkillsStep
