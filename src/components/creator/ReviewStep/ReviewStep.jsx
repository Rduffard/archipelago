import { calculateCheckModifier } from "../../../lib/checkModifier.js";
import { useSystem } from "../../../hooks/useSystem";
import HoverInfo from "../../ui/HoverInfo/HoverInfo";
import { getAttributeLabel } from "../../../lib/character";
import "../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css";
import "./ReviewStep.css";
import {
  getReputationEntries,
  getReviewContext,
  getStartingFeatures,
  getUnlockedNodeDetail,
} from "./reviewHelpers";
import CreatorStepFrame from "../shared/CreatorStepFrame/CreatorStepFrame";

function ReviewDataRow({ detail, label, value }) {
  return (
    <HoverInfo
      as="div"
      className="review-card__row"
      content={detail}
      contentClassName="review-card__detail"
      placement="bottom-end"
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </HoverInfo>
  );
}

function ReviewStep({
  identity,
  attributeValues,
  reputation,
  details,
  loadout,
  resources,
  resourceMaximums,
  training,
  trainingOptions,
  wounds,
  progression,
}) {
  const { blueprint } = useSystem();
  const {
    activeReputation,
    advancementSpent,
    calling,
    finalAttributes,
    origin,
    parsedOriginBonus,
    path,
    specialization,
  } = getReviewContext({
    attributeValues,
    blueprint,
    identity,
    progression,
    reputation,
    training,
    trainingOptions,
  });
  const startingFeatures = getStartingFeatures({
    calling,
    origin,
    parsedOriginBonus,
    path,
  });
  const reputationEntries = getReputationEntries(activeReputation, blueprint);

  return (
    <CreatorStepFrame
      step="Step 8"
      title="Read the shape of your legend"
      description="Before the Vale learns your name, it reads your roots, your calling, your island, and only then the numbers that follow you into the storm."
    >
      <section className="review-strip">
        <div className="review-strip__item">
          <span>Name</span>
          <strong>{identity.name || "Unnamed"}</strong>
        </div>
        <div className="review-strip__item">
          <span>Path</span>
          <strong>{path?.name || "Unset"}</strong>
        </div>
        <div className="review-strip__item">
          <span>Calling</span>
          <strong>{calling?.name || "Unset"}</strong>
        </div>
        <div className="review-strip__item">
          <span>Training</span>
          <strong>{training.length} selected</strong>
        </div>
        <div className="review-strip__item">
          <span>Loadout</span>
          <strong>Inventory managed in Equipment</strong>
        </div>
        <div className="review-strip__item">
          <span>Progression</span>
          <strong>Level {progression?.rank ?? 1}</strong>
        </div>
      </section>

      <div className="review-grid review-grid--dense">
        <article className="review-card">
          <h3>Identity</h3>
          <dl>
            <ReviewDataRow label="Name" value={identity.name || "Unnamed"} />
            <ReviewDataRow
              label="Pronouns"
              value={identity.pronouns || "Unspecified"}
            />
            <ReviewDataRow
              label="World Path"
              value={path?.name || "Choose one"}
              detail={path?.description}
            />
            <ReviewDataRow
              label="Calling"
              value={calling?.name || "Choose one"}
              detail={calling?.description}
            />
            <ReviewDataRow
              label="Origin"
              value={origin?.name || "Choose one"}
              detail={origin?.summary}
            />
            <ReviewDataRow
              label="Past Role"
              value={details?.pastRole || calling?.name || "Unwritten"}
            />
            <ReviewDataRow
              label="Defining Event"
              value={details?.definingEvent ? "Recorded" : "Unwritten"}
              detail={details?.definingEvent || undefined}
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
                value={`${value} (${
                  value >= 1 &&
                  calculateCheckModifier(finalAttributes, key) >= 0
                    ? "+"
                    : ""
                }${
                  value >= 1
                    ? calculateCheckModifier(finalAttributes, key)
                    : "—"
                })`}
                detail={
                  parsedOriginBonus?.key === key
                    ? `Allocated: ${
                        attributeValues[key] ?? 0
                      }\nOrigin Bonus: +${parsedOriginBonus.amount}`
                    : undefined
                }
              />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Starting Features</h3>
          <dl>
            {startingFeatures.map((feature) => (
              <ReviewDataRow
                key={feature.label}
                label={feature.label}
                value={feature.value}
                detail={feature.detail}
              />
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Training</h3>
          <dl>
            {training.map((id) => {
              const option = trainingOptions.find((entry) => entry.id === id);
              return (
                <ReviewDataRow
                  key={id}
                  label={option?.name ?? id}
                  value="Trained"
                  detail={option?.description}
                />
              );
            })}
          </dl>
        </article>

        <article className="review-card">
          <h3>Starting Reputation</h3>
          {reputationEntries.length ? (
            <dl>
              {reputationEntries.map((entry) => (
                <ReviewDataRow
                  key={entry.key}
                  label={entry.label}
                  value={entry.value}
                  detail={entry.detail}
                />
              ))}
            </dl>
          ) : (
            <p className="review-card__empty">
              This origin starts politically neutral until campaign choices
              reshape it.
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
                  (ability) => ability.name?.trim() || ability.effect?.trim()
                ).length
                  ? `${
                      loadout.customAbilities.filter(
                        (ability) =>
                          ability.name?.trim() || ability.effect?.trim()
                      ).length
                    } recorded`
                  : "None"
              }
              detail={
                loadout?.customAbilities?.filter(
                  (ability) => ability.name?.trim() || ability.effect?.trim()
                ).length
                  ? loadout.customAbilities
                      .filter(
                        (ability) =>
                          ability.name?.trim() || ability.effect?.trim()
                      )
                      .map((ability) =>
                        [
                          ability.name || "Unnamed ability",
                          `${ability.source || "custom"} | ${
                            ability.type || "active"
                          }`,
                          ability.costResource
                            ? `Cost ${ability.costAmount || 0} ${
                                ability.costResource
                              }`
                            : null,
                          ability.scalingAttribute || ability.scalingSkill
                            ? `Scaling ${[
                                ability.scalingAttribute,
                                ability.scalingSkill,
                              ]
                                .filter(Boolean)
                                .join(" + ")}`
                            : null,
                          ability.effect || null,
                        ]
                          .filter(Boolean)
                          .join("\n")
                      )
                      .join("\n\n")
                  : undefined
              }
            />
            <ReviewDataRow
              label="Equipment"
              value="Server-issued starting cutlass for new characters; saved inventory for existing characters"
              detail="Equipment changes save separately in the Equipment step."
            />
          </dl>
        </article>

        <article className="review-card">
          <h3>Tracks and Notes</h3>
          <dl>
            <ReviewDataRow
              label="Health"
              value={
                resourceMaximums?.health == null
                  ? "Unavailable"
                  : `${resources?.health ?? 0}/${resourceMaximums.health}`
              }
            />
            <ReviewDataRow
              label="Stamina"
              value={
                resourceMaximums?.stamina == null
                  ? "Unavailable"
                  : `${resources?.stamina ?? 0}/${resourceMaximums.stamina}`
              }
            />
            <ReviewDataRow
              label="Focus"
              value={
                resourceMaximums?.focus == null
                  ? "Unavailable"
                  : `${resources?.focus ?? 0}/${resourceMaximums.focus}`
              }
            />
            <ReviewDataRow
              label="Corruption"
              value={`${resources?.corruption ?? 0}/${
                resourceMaximums?.corruption ?? 0
              }`}
            />
            <ReviewDataRow
              label="Wounds"
              value={`${resources?.wounds ?? 0}/${
                resourceMaximums?.wounds ?? 0
              }`}
            />
            <ReviewDataRow
              label="Active Wound Entries"
              value={wounds?.length ? `${wounds.length} recorded` : "None"}
              detail={
                wounds?.length
                  ? wounds
                      .map((wound) =>
                        [
                          wound.name,
                          wound.severity,
                          wound.statPenalty
                            ? `Penalty: ${wound.statPenalty}`
                            : null,
                          wound.description,
                        ]
                          .filter(Boolean)
                          .join("\n")
                      )
                      .join("\n\n")
                  : undefined
              }
            />
            <ReviewDataRow
              label="Custom Traits"
              value={
                details?.customTraitsText
                  ? `${
                      details.customTraitsText.split("\n").filter(Boolean)
                        .length
                    } recorded`
                  : "None"
              }
              detail={details?.customTraitsText || undefined}
            />
            <ReviewDataRow
              label="Notes"
              value={details?.notes ? "Recorded" : "None"}
              detail={details?.notes || undefined}
            />
          </dl>
        </article>

        <article className="review-card">
          <h3>Progression</h3>
          <dl>
            <ReviewDataRow label="Rank" value={progression?.rank ?? 1} />
            <ReviewDataRow
              label="Advancement Points"
              value={progression?.advancementPoints ?? 0}
            />
            <ReviewDataRow
              label="Advancement Invested"
              value={advancementSpent}
            />
            <ReviewDataRow
              label="Specialization Path"
              value={
                specialization?.name ||
                progression?.specializationPath ||
                "Unchosen"
              }
              detail={
                [
                  specialization?.summary,
                  specialization?.recommendationReasons?.length
                    ? `Why it fits: ${specialization.recommendationReasons.join(
                        ", "
                      )}`
                    : null,
                ]
                  .filter(Boolean)
                  .join("\n\n") || undefined
              }
            />
            <ReviewDataRow
              label="Unlocked Nodes"
              value={
                progression?.unlockedNodes?.length
                  ? `${progression.unlockedNodes.length} recorded`
                  : "None"
              }
              detail={getUnlockedNodeDetail(
                progression?.unlockedNodes,
                progression,
                blueprint
              )}
            />
          </dl>
        </article>
      </div>
    </CreatorStepFrame>
  );
}

export default ReviewStep;
