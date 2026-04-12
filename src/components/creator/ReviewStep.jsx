import { callings, origins, originPaths } from '../../data/gameData'
import {
  formatReputationScore,
  getActiveReputationEntries,
  getOriginStartingReputation,
  getReputationTier,
  getReputationTrack,
} from '../../data/reputationData'
import {
  applyAttributeBonus,
  getRollModifier,
  getAttributeLabel,
  getStatLabel,
  parseAttributeBonus,
} from '../../lib/character'
import { DERIVED_STAT_DETAILS, SOCIAL_STAT_DETAILS } from '../../data/characterSheetData'

function ReviewDataRow({ detail, label, value }) {
  return (
    <div className={`review-card__row ${detail ? 'has-detail' : ''}`} tabIndex={detail ? 0 : undefined}>
      <dt>{label}</dt>
      <dd>
        {value}
        {detail ? <span className="review-card__detail">{detail}</span> : null}
      </dd>
    </div>
  )
}

function ReviewStep({ identity, attributeValues, derivedStats, socialStats, reputation }) {
  const calling = callings.find((entry) => entry.id === identity.callingId)
  const origin = origins.find((entry) => entry.id === identity.originId)
  const path = originPaths.find((entry) => entry.id === identity.path)
  const parsedOriginBonus = parseAttributeBonus(origin?.bonus)
  const finalAttributes = applyAttributeBonus(attributeValues, origin?.bonus)
  const activeReputation = getActiveReputationEntries(
    reputation ?? getOriginStartingReputation(identity.originId),
  )
  const gains = [
    path ? { label: 'World Path', value: path.name, detail: path.description } : null,
    calling?.primaryStats?.length
      ? {
          label: 'Calling Focus',
          value: calling.primaryStats.join(' / '),
          detail: `${calling.name} leans on these attributes most heavily in play.`,
        }
      : null,
    calling?.passive
      ? {
          label: 'Calling Passive',
          value: calling.passive,
          detail: calling.passiveRule,
        }
      : null,
    calling?.starterAbility
      ? {
          label: 'Starter Ability',
          value: calling.starterAbility,
          detail: `${calling.starterAbilityType}. ${calling.starterAbilityRule}`,
        }
      : null,
    origin?.bonus
      ? {
          label: 'Origin Bonus',
          value: origin.bonus,
          detail: `${origin.summary} Final ${parsedOriginBonus?.label ?? 'attribute'} gains ${parsedOriginBonus?.amount ?? 0}.`,
        }
      : null,
    origin?.passive
      ? {
          label: 'Origin Passive',
          value: origin.passive,
          detail: origin.passiveRule,
        }
      : null,
    origin?.drawback
      ? {
          label: 'Origin Drawback',
          value: origin.drawback,
          detail: origin.drawbackRule,
        }
      : null,
  ].filter(Boolean)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 4</p>
        <h2>Read the shape of your legend</h2>
        <p>
          Before the Vale learns your name, it reads your roots, your calling, your island,
          and only then the numbers that follow you into the storm.
        </p>
      </div>

      <div className="review-grid">
        <article className="review-card">
          <h3>Identity</h3>
          <dl>
            <ReviewDataRow label="Name" value={identity.name || 'Unnamed'} />
            <ReviewDataRow label="Pronouns" value={identity.pronouns || 'Unspecified'} />
            <ReviewDataRow label="World Path" value={path?.name || 'Choose one'} detail={path?.description} />
            <ReviewDataRow label="Calling" value={calling?.name || 'Choose one'} detail={calling?.description} />
            <ReviewDataRow label="Origin" value={origin?.name || 'Choose one'} detail={origin?.summary} />
          </dl>
        </article>

        <article className="review-card">
          <h3>Attributes</h3>
          <dl>
            {Object.entries(finalAttributes).map(([key, value]) => (
              <ReviewDataRow
                key={key}
                label={getAttributeLabel(key)}
                value={value}
                detail={
                  parsedOriginBonus?.key === key
                    ? `Allocated: ${attributeValues[key] ?? 0}\nOrigin Bonus: +${parsedOriginBonus.amount}`
                    : undefined
                }
              />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Derived Stats</h3>
          <dl>
            {Object.entries(derivedStats).map(([key, value]) => (
              <ReviewDataRow
                key={key}
                label={getStatLabel(key)}
                value={value}
                detail={`${DERIVED_STAT_DETAILS[key]?.description}\n\nFormula: ${
                  DERIVED_STAT_DETAILS[key]?.formula
                }\nRoll Modifier: ${getRollModifier(value)}`}
              />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Social Stats</h3>
          <dl>
            {Object.entries(socialStats ?? {}).map(([key, value]) => (
              <ReviewDataRow
                key={key}
                label={getStatLabel(key)}
                value={value}
                detail={`${SOCIAL_STAT_DETAILS[key]?.description}\n\nFormula: ${
                  SOCIAL_STAT_DETAILS[key]?.formula
                }\nRoll Modifier: ${getRollModifier(value)}`}
              />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Choice Gains</h3>
          <dl>
            {gains.map((gain) => (
              <ReviewDataRow key={gain.label} label={gain.label} value={gain.value} detail={gain.detail} />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Starting Reputation</h3>
          {activeReputation.length ? (
            <dl>
              {activeReputation.map(([trackKey, score]) => {
                const track = getReputationTrack(trackKey)
                const tier = getReputationTier(score)

                return (
                  <ReviewDataRow
                    key={trackKey}
                    label={track?.name ?? trackKey}
                    value={formatReputationScore(score)}
                    detail={`${tier.label}. ${tier.effect} ${track?.scope ?? ''}`.trim()}
                  />
                )
              })}
            </dl>
          ) : (
            <p className="review-card__empty">
              This origin starts politically neutral until campaign choices reshape it.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}

export default ReviewStep
