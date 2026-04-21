import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getRankedSystemSpecializations,
  getSystemCallings,
  getSystemOrigins,
  getSystemOriginPaths,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from '../../data/archipelagoSystemSelectors'
import { useSystem } from '../../hooks/useSystem'
import {
  applyAttributeBonus,
  getRollModifier,
  getAttributeLabel,
  getStatLabel,
  parseAttributeBonus,
} from '../../lib/character'
import { getDerivedStatDetails, getSocialStatDetails } from '../../data/characterSheetData'

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

function ReviewStep({
  identity,
  attributeValues,
  derivedStats,
  socialStats,
  reputation,
  details,
  loadout,
  resources,
  resourceMaximums,
  skills,
  wounds,
  progression,
}) {
  const { blueprint } = useSystem()
  const callings = getSystemCallings(blueprint)
  const origins = getSystemOrigins(blueprint)
  const originPaths = getSystemOriginPaths(blueprint)
  const calling = callings.find((entry) => entry.id === identity.callingId)
  const origin = origins.find((entry) => entry.id === identity.originId)
  const path = originPaths.find((entry) => entry.id === identity.path)
  const rankedSpecializations = getRankedSystemSpecializations(identity.callingId, skills, blueprint)
  const specialization =
    rankedSpecializations.find((entry) => entry.id === progression?.specializationPath) ??
    getSystemSpecialization(progression?.specializationPath, blueprint)
  const recommendedSpecializations = rankedSpecializations.filter((entry) => entry.recommendationScore > 0)
  const advancementSpent =
    specialization?.nodes
      ?.filter((node) => progression?.unlockedNodes?.includes(node.id))
      .reduce((total, node) => total + (node.cost ?? 0), 0) ?? 0
  const derivedStatDetails = getDerivedStatDetails(blueprint)
  const socialStatDetails = getSocialStatDetails(blueprint)
  const parsedOriginBonus = parseAttributeBonus(origin?.bonus)
  const finalAttributes = applyAttributeBonus(attributeValues, origin?.bonus)
  const activeReputation = getActiveSystemReputationEntries(
    reputation ?? getSystemOriginStartingReputation(identity.originId, blueprint),
    blueprint,
  )
  const savedSkills = Object.entries(skills ?? {}).flatMap(([categoryKey, entries]) =>
    (entries ?? []).map((skill) => ({
      ...skill,
      categoryKey,
    })),
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
        <p className="creator-panel__kicker">Step 8</p>
        <h2>Read the shape of your legend</h2>
        <p>
          Before the Vale learns your name, it reads your roots, your calling, your island,
          and only then the numbers that follow you into the storm.
        </p>
      </div>

      <section className="review-strip">
        <div className="review-strip__item">
          <span>Name</span>
          <strong>{identity.name || 'Unnamed'}</strong>
        </div>
        <div className="review-strip__item">
          <span>Path</span>
          <strong>{path?.name || 'Unset'}</strong>
        </div>
        <div className="review-strip__item">
          <span>Calling</span>
          <strong>{calling?.name || 'Unset'}</strong>
        </div>
        <div className="review-strip__item">
          <span>Skills</span>
          <strong>{savedSkills.length} trained</strong>
        </div>
        <div className="review-strip__item">
          <span>Loadout</span>
          <strong>
            {(loadout?.weaponsText?.split('\n').filter(Boolean).length ?? 0) +
              (loadout?.armorText?.split('\n').filter(Boolean).length ?? 0) +
              (loadout?.techRelicsText?.split('\n').filter(Boolean).length ?? 0)}
            {' '}items
          </strong>
        </div>
        <div className="review-strip__item">
          <span>Progression</span>
          <strong>Rank {progression?.rank ?? 1}</strong>
        </div>
      </section>

      <div className="review-grid review-grid--dense">
        <article className="review-card">
          <h3>Identity</h3>
          <dl>
            <ReviewDataRow label="Name" value={identity.name || 'Unnamed'} />
            <ReviewDataRow label="Pronouns" value={identity.pronouns || 'Unspecified'} />
            <ReviewDataRow label="World Path" value={path?.name || 'Choose one'} detail={path?.description} />
            <ReviewDataRow label="Calling" value={calling?.name || 'Choose one'} detail={calling?.description} />
            <ReviewDataRow label="Origin" value={origin?.name || 'Choose one'} detail={origin?.summary} />
            <ReviewDataRow label="Past Role" value={details?.pastRole || calling?.name || 'Unwritten'} />
            <ReviewDataRow
              label="Defining Event"
              value={details?.definingEvent || path?.summary || origin?.summary || 'Unwritten'}
            />
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
                detail={`${derivedStatDetails[key]?.description}\n\nFormula: ${
                  derivedStatDetails[key]?.formula
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
                detail={`${socialStatDetails[key]?.description}\n\nFormula: ${
                  socialStatDetails[key]?.formula
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
          <h3>Verb Skills</h3>
          <dl>
            {savedSkills.length ? (
              savedSkills.map((skill) => (
                <ReviewDataRow
                  key={`${skill.categoryKey}-${skill.id}`}
                  label={skill.name || skill.id}
                  value={`Rank ${skill.rank ?? 0}`}
                  detail={[
                    skill.categoryKey.charAt(0).toUpperCase() + skill.categoryKey.slice(1),
                    skill.linkedAttributes?.length
                      ? `Linked: ${skill.linkedAttributes.join(' / ')}`
                      : null,
                    skill.specialty ? `Granted Focus: ${skill.specialty}` : null,
                  ]
                    .filter(Boolean)
                    .join('\n')}
                />
              ))
            ) : (
              <ReviewDataRow label="Training" value="None recorded" />
            )}
          </dl>
        </article>

        <article className="review-card">
          <h3>Starting Reputation</h3>
          {activeReputation.length ? (
            <dl>
              {activeReputation.map(([trackKey, score]) => {
                const track = getSystemReputationTrack(trackKey, blueprint)
                const tier = getSystemReputationTier(score, blueprint)

                return (
                  <ReviewDataRow
                    key={trackKey}
                    label={track?.name ?? trackKey}
                    value={formatSystemReputationScore(score)}
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

        <article className="review-card">
          <h3>Loadout</h3>
          <dl>
            <ReviewDataRow
              label="Custom Abilities"
              value={
                loadout?.customAbilities?.filter(
                  (ability) => ability.name?.trim() || ability.effect?.trim(),
                ).length
                  ? `${
                      loadout.customAbilities.filter(
                        (ability) => ability.name?.trim() || ability.effect?.trim(),
                      ).length
                    } recorded`
                  : 'None'
              }
              detail={
                loadout?.customAbilities?.filter(
                  (ability) => ability.name?.trim() || ability.effect?.trim(),
                ).length
                  ? loadout.customAbilities
                      .filter((ability) => ability.name?.trim() || ability.effect?.trim())
                      .map((ability) =>
                        [
                          ability.name || 'Unnamed ability',
                          `${ability.source || 'custom'} | ${ability.type || 'active'}`,
                          ability.costResource
                            ? `Cost ${ability.costAmount || 0} ${ability.costResource}`
                            : null,
                          ability.scalingAttribute || ability.scalingSkill
                            ? `Scaling ${[ability.scalingAttribute, ability.scalingSkill]
                                .filter(Boolean)
                                .join(' + ')}`
                            : null,
                          ability.effect || null,
                        ]
                          .filter(Boolean)
                          .join('\n')
                      )
                      .join('\n\n')
                  : undefined
              }
            />
            <ReviewDataRow
              label="Weapons"
              value={loadout?.weaponsText ? `${loadout.weaponsText.split('\n').filter(Boolean).length} recorded` : 'None'}
              detail={loadout?.weaponsText || undefined}
            />
            <ReviewDataRow
              label="Armor"
              value={loadout?.armorText ? `${loadout.armorText.split('\n').filter(Boolean).length} recorded` : 'None'}
              detail={loadout?.armorText || undefined}
            />
            <ReviewDataRow
              label="Tech / Relics"
              value={
                loadout?.techRelicsText ? `${loadout.techRelicsText.split('\n').filter(Boolean).length} recorded` : 'None'
              }
              detail={loadout?.techRelicsText || undefined}
            />
            <ReviewDataRow
              label="Inventory"
              value={
                loadout?.inventoryText ? `${loadout.inventoryText.split('\n').filter(Boolean).length} recorded` : 'None'
              }
              detail={loadout?.inventoryText || undefined}
            />
            <ReviewDataRow
              label="Relics"
              value={loadout?.relicsText ? `${loadout.relicsText.split('\n').filter(Boolean).length} recorded` : 'None'}
              detail={loadout?.relicsText || undefined}
            />
          </dl>
        </article>

        <article className="review-card">
          <h3>Tracks and Notes</h3>
          <dl>
            <ReviewDataRow
              label="Health"
              value={`${resources?.health ?? 0}/${resourceMaximums?.health ?? 0}`}
            />
            <ReviewDataRow
              label="Stamina"
              value={`${resources?.stamina ?? 0}/${resourceMaximums?.stamina ?? 0}`}
            />
            <ReviewDataRow
              label="Focus"
              value={`${resources?.focus ?? 0}/${resourceMaximums?.focus ?? 0}`}
            />
            <ReviewDataRow
              label="Corruption"
              value={`${resources?.corruption ?? 0}/${resourceMaximums?.corruption ?? 0}`}
            />
            <ReviewDataRow
              label="Wounds"
              value={`${resources?.wounds ?? 0}/${resourceMaximums?.wounds ?? 0}`}
            />
            <ReviewDataRow
              label="Active Wound Entries"
              value={wounds?.length ? `${wounds.length} recorded` : 'None'}
              detail={
                wounds?.length
                  ? wounds
                      .map((wound) =>
                        [wound.name, wound.severity, wound.statPenalty ? `Penalty: ${wound.statPenalty}` : null, wound.description]
                          .filter(Boolean)
                          .join('\n'),
                      )
                      .join('\n\n')
                  : undefined
              }
            />
            <ReviewDataRow
              label="Custom Traits"
              value={
                details?.customTraitsText
                  ? `${details.customTraitsText.split('\n').filter(Boolean).length} recorded`
                  : 'None'
              }
              detail={details?.customTraitsText || undefined}
            />
            <ReviewDataRow
              label="Notes"
              value={details?.notes ? 'Recorded' : 'None'}
              detail={details?.notes || undefined}
            />
          </dl>
        </article>

        <article className="review-card">
          <h3>Progression</h3>
          <dl>
            <ReviewDataRow label="Rank" value={progression?.rank ?? 1} />
            <ReviewDataRow label="Skill Points" value={progression?.skillPoints ?? 0} />
            <ReviewDataRow label="Advancement Points" value={progression?.advancementPoints ?? 0} />
            <ReviewDataRow label="Advancement Invested" value={advancementSpent} />
            <ReviewDataRow
              label="Specialization Path"
              value={specialization?.name || progression?.specializationPath || 'Unchosen'}
              detail={
                [
                  specialization?.summary,
                  specialization?.recommendationReasons?.length
                    ? `Why it fits: ${specialization.recommendationReasons.join(', ')}`
                    : null,
                  !specialization && recommendedSpecializations.length
                    ? `Recommended alternatives: ${recommendedSpecializations.map((entry) => entry.name).join(', ')}`
                    : null,
                ]
                  .filter(Boolean)
                  .join('\n\n') || undefined
              }
            />
            <ReviewDataRow
              label="Unlocked Nodes"
              value={
                progression?.unlockedNodes?.length
                  ? `${progression.unlockedNodes.length} recorded`
                  : 'None'
              }
              detail={
                progression?.unlockedNodes?.length
                  ? progression.unlockedNodes
                      .map((nodeId) => {
                        const node = getSystemSpecializationNode(progression?.specializationPath, nodeId, blueprint)
                        return node ? `${node.name}\n${node.effect}` : nodeId
                      })
                      .join('\n\n')
                  : undefined
              }
            />
          </dl>
        </article>
      </div>
    </section>
  )
}

export default ReviewStep
