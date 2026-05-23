import { useMemo } from 'react'
import HoverInfo from '../../ui/HoverInfo/HoverInfo'
import { getCheckGroups } from '../../../data/archipelagoChecks'
import { getRollModifier } from '../../../lib/character'
import { useSystem } from '../../../hooks/useSystem'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import { SpecialtyRow } from './SpecialtyTraining'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import './SkillsStep.css'

function SkillsStep({
  checks,
  coreCheckInvestments = {},
  skillGroups,
  skills,
  remainingCorePoints,
  remainingSpecialtyPicks,
  totalCorePoints,
  totalSpecialtyPicks,
  onCoreCheckInvestmentChange,
  onSkillRankChange,
}) {
  const { blueprint } = useSystem()
  const checkGroups = useMemo(() => getCheckGroups(blueprint), [blueprint])
  const specialtyRanksById = useMemo(
    () =>
      Object.values(skills ?? {}).reduce((rankMap, entries) => {
        ;(entries ?? []).forEach((entry) => {
          rankMap[entry.id] = entry.rank ?? 0
        })
        return rankMap
      }, {}),
    [skills],
  )
  const canSpendSpecialtyPick = remainingSpecialtyPicks > 0

  function titleCase(value = '') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <CreatorStepFrame
      step="Step 4"
      title="Training"
      description="Invest in core checks as the primary rolls, then choose specialties as ranked techniques."
    >
      <div className="training-point-grid">
        <div className="points-banner points-banner--core">
          <div>
            <span className="creator-summary__label">Core Training</span>
            <p>Core Checks are the main numerical progression layer.</p>
          </div>
          <strong>
            {remainingCorePoints} / {totalCorePoints}
          </strong>
        </div>
        <div className="points-banner points-banner--specialty">
          <div>
            <span className="creator-summary__label">Specialty Training</span>
            <p>Specialties are ranked permissions, techniques, and situational edges.</p>
          </div>
          <strong>
            {remainingSpecialtyPicks} / {totalSpecialtyPicks}
          </strong>
        </div>
      </div>

      <section className="training-section training-section--core">
        <div className="training-section__header">
          <div>
            <span className="creator-summary__label">Core Training</span>
            <h3>Invest in Core Checks</h3>
          </div>
        </div>

        <div className="core-training-columns">
          {checkGroups.map((group) => (
            <section key={group.key} className="choice-group choice-group--core-category">
              <div className="choice-group__header">
                <h4>{group.label}</h4>
                <p>{group.description}</p>
              </div>

              <div className="attribute-list attribute-list--core-grid">
                {group.checks.map((check) => {
                  const invested = coreCheckInvestments[check.key] ?? 0
                  const value = checks?.[check.key] ?? 10
                  const canIncrease = remainingCorePoints > 0

                  return (
                    <article key={`${group.key}-${check.key}`} className="attribute-row attribute-row--core-check">
                      <div className="attribute-row__copy attribute-row__copy--skill">
                        <div className="creator-skill-topline">
                          <HoverInfo
                            className="creator-skill-name"
                            content={`${check.summary}\n\nLinked Attributes: ${(check.attributes ?? [])
                              .map(titleCase)
                              .join(' / ')}\nInvestment: +${invested}`}
                            contentClassName="creator-skill-name__detail"
                          >
                            {check.name}
                          </HoverInfo>
                          <span className="creator-skill-links">
                            {(check.attributes ?? []).map(titleCase).join(' / ')}
                          </span>
                        </div>
                      </div>

                      <HoverInfo
                        as="div"
                        className="creator-core-score"
                        content={`Core Check\nValue ${value}\nRoll Modifier: ${getRollModifier(value)}\nDirect investment increases this roll.`}
                        contentClassName="creator-skill-score__detail"
                        placement="bottom-end"
                      >
                        {value}
                      </HoverInfo>

                      <div className="attribute-row__controls">
                        <button
                          type="button"
                          onClick={() => onCoreCheckInvestmentChange(check.key, invested - 1)}
                          disabled={invested <= 0}
                        >
                          -
                        </button>
                        <span>+{invested}</span>
                        <button
                          type="button"
                          onClick={() => onCoreCheckInvestmentChange(check.key, invested + 1)}
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

      <section className="training-section training-section--specialties">
        <div className="training-section__header">
          <div>
            <span className="creator-summary__label">Specialties</span>
            <h3>Choose Specialties</h3>
          </div>
        </div>

        <div className="creator-skill-columns">
          {skillGroups.map((group) => (
            <section key={group.key} className="choice-group choice-group--skill-category">
              <div className="choice-group__header">
                <h3>{group.label}</h3>
                <p>{group.description}</p>
              </div>

              <div className="attribute-list attribute-list--skill-grid">
                {group.skills.map((skill) => (
                  <SpecialtyRow
                    key={`${group.key}-${skill.id}`}
                    canSpendSpecialtyPick={canSpendSpecialtyPick}
                    checks={checks}
                    groupKey={group.key}
                    onSkillRankChange={onSkillRankChange}
                    rank={specialtyRanksById[skill.id] ?? 0}
                    skill={skill}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </CreatorStepFrame>
  )
}

export default SkillsStep
