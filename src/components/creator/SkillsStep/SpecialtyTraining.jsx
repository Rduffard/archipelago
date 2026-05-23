import { memo, useCallback, useMemo } from 'react'
import HoverInfo from '../../ui/HoverInfo/HoverInfo'
import {
  formatSpecialtyPrerequisites,
  getNextSpecialtyRankEffect,
  getSpecialtyPrerequisiteStatus,
  getSpecialtyRankLabel,
  getSpecialtyRankTitle,
  meetsSpecialtyPrerequisites,
} from '../../../data/archipelagoSkills'

function titleCase(value = '') {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function shouldProfileSpecialtyPerf() {
  return Boolean(globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__)
}

const SpecialtyRankDisplay = memo(function SpecialtyRankDisplay({ maxRank, rank }) {
  return (
    <div className="specialty-rank-display" aria-label={`Rank ${rank} of ${maxRank}`}>
      {Array.from({ length: maxRank }, (_, index) => (
        <span
          key={index}
          className={[
            index < rank ? 'is-filled' : '',
            index + 1 === rank ? 'is-current' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {getSpecialtyRankLabel(index + 1)}
        </span>
      ))}
    </div>
  )
})

const SpecialtyPrerequisites = memo(function SpecialtyPrerequisites({ checks, rank, specialty }) {
  const prerequisiteStatus = useMemo(
    () => getSpecialtyPrerequisiteStatus(specialty, rank, checks),
    [checks, rank, specialty],
  )

  if (!prerequisiteStatus.length) {
    return <span className="specialty-prereq specialty-prereq--met">No prerequisite</span>
  }

  return (
    <span className="specialty-prereq-list">
      {prerequisiteStatus.map((prerequisite) => (
        <span
          key={`${prerequisite.label}-${prerequisite.min ?? ''}`}
          className={`specialty-prereq ${prerequisite.met ? 'specialty-prereq--met' : 'specialty-prereq--locked'}`}
        >
          {prerequisite.label}
          {prerequisite.current !== undefined ? ` (${prerequisite.current})` : ''}
        </span>
      ))}
    </span>
  )
})

const SpecialtyRelatedChecks = memo(function SpecialtyRelatedChecks({ relatedChecks = [] }) {
  if (!relatedChecks.length) {
    return <span className="creator-specialty-context">No related checks listed</span>
  }

  return <span className="creator-specialty-context">{relatedChecks.map(titleCase).join(' / ')}</span>
})

const SpecialtyTooltip = memo(function SpecialtyTooltip({ checks, rank, specialty }) {
  const maxRank = specialty.maxRank ?? specialty.ranks?.length ?? 3
  const nextRank = Math.min(rank + 1, maxRank)
  const nextEffect = useMemo(() => getNextSpecialtyRankEffect(specialty, rank), [rank, specialty])
  const prerequisites = nextEffect
    ? formatSpecialtyPrerequisites(specialty.prerequisites?.[nextRank] ?? [])
    : 'None'
  const unlockedRanks = useMemo(
    () => (specialty.ranks ?? []).filter((rankDefinition) => rankDefinition.rank <= rank),
    [rank, specialty],
  )

  return (
    <div className="specialty-tooltip">
      <strong>{specialty.name}</strong>
      <span>{titleCase(specialty.category)}</span>
      <p>{specialty.description}</p>
      <dl>
        <dt>Current Rank</dt>
        <dd>
          {getSpecialtyRankLabel(rank)} - {getSpecialtyRankTitle(specialty, rank)}
        </dd>
      </dl>
      <section className="specialty-tooltip__effects">
        <span>Unlocked Effects Stack</span>
        {unlockedRanks.length ? (
          <ul>
            {unlockedRanks.map((rankDefinition) => (
              <li key={rankDefinition.rank}>
                <strong>{rankDefinition.title}</strong>
                <small>{rankDefinition.effect}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ranked effects unlocked yet.</p>
        )}
      </section>
      <section className="specialty-tooltip__next">
        <span>Next Unlock</span>
        <strong>{nextEffect ? getSpecialtyRankTitle(specialty, nextRank) : 'Mastery capped for now.'}</strong>
        {nextEffect ? <p>{nextEffect}</p> : null}
      </section>
      <SpecialtyPrerequisites checks={checks} rank={nextRank} specialty={specialty} />
      <p className="specialty-tooltip__context">
        Related Core Checks: {specialty.relatedChecks?.map(titleCase).join(' / ') || 'None listed'}
      </p>
      <p className="specialty-tooltip__context">Next Prerequisite: {prerequisites}</p>
    </div>
  )
})

const SpecialtyRow = memo(function SpecialtyRow({
  canSpendSpecialtyPick,
  checks,
  groupKey,
  onSkillRankChange,
  rank,
  skill,
}) {
  if (shouldProfileSpecialtyPerf()) {
    console.count(`SpecialtyRow render:${skill.id}`)
  }

  const maxRank = skill.maxRank ?? skill.ranks?.length ?? 3
  const nextRank = Math.min(rank + 1, maxRank)
  const canMeetNextPrerequisites = useMemo(
    () => meetsSpecialtyPrerequisites(skill, nextRank, checks),
    [checks, nextRank, skill],
  )
  const canIncrease = canSpendSpecialtyPick && rank < maxRank && canMeetNextPrerequisites
  const rankLabel = getSpecialtyRankLabel(rank)
  const rankTitle = getSpecialtyRankTitle(skill, rank)
  const renderTooltip = useCallback(
    () => <SpecialtyTooltip checks={checks} rank={rank} specialty={skill} />,
    [checks, rank, skill],
  )
  const handleDecrease = useCallback(() => {
    onSkillRankChange(groupKey, skill, rank - 1)
  }, [groupKey, onSkillRankChange, rank, skill])
  const handleIncrease = useCallback(() => {
    onSkillRankChange(groupKey, skill, rank + 1)
  }, [groupKey, onSkillRankChange, rank, skill])

  return (
    <article className="attribute-row attribute-row--skill attribute-row--specialty">
      <div className="attribute-row__copy attribute-row__copy--skill">
        <div className="creator-skill-topline">
          <HoverInfo
            className="creator-skill-name"
            contentClassName="creator-skill-name__detail specialty-tooltip-shell"
            preserveLineBreaks={false}
            renderContent={renderTooltip}
          >
            {skill.name}
          </HoverInfo>
          <SpecialtyRelatedChecks relatedChecks={skill.relatedChecks} />
        </div>
        <p className="creator-specialty-effect">{skill.description}</p>
      </div>

      <HoverInfo
        as="div"
        className="creator-specialty-rank"
        contentClassName="creator-skill-score__detail specialty-tooltip-shell"
        placement="bottom-end"
        preserveLineBreaks={false}
        renderContent={renderTooltip}
      >
        <span>{rankLabel}</span>
        <small>{rankTitle}</small>
        <SpecialtyRankDisplay maxRank={maxRank} rank={rank} />
      </HoverInfo>

      <div className="attribute-row__controls">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={rank <= 0}
        >
          -
        </button>
        <span>{rank}</span>
        <button
          type="button"
          onClick={handleIncrease}
          disabled={!canIncrease}
        >
          +
        </button>
      </div>
    </article>
  )
})

export {
  SpecialtyPrerequisites,
  SpecialtyRankDisplay,
  SpecialtyRelatedChecks,
  SpecialtyRow,
  SpecialtyTooltip,
}
