import { proficiencyBonus } from "../../lib/training.js";
import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from "../../data/archipelagoSystemSelectors";
import { parseAttributeBonus } from "../../lib/character";

export const ATTRIBUTE_KEYS = [
  "might",
  "agility",
  "wit",
  "spirit",
  "resolve",
  "instinct",
];
export function titleCase(value = "") {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCharacterReputation(character) {
  return character?.reputation;
}

export function getTraitEntries(character, calling, origin) {
  const savedTraits = (character.identity?.tags ?? []).map((trait) => ({
    label: trait.label,
    source: titleCase(trait.type || "tag"),
    detail: trait.mechanicalImpact || "No mechanical notes recorded yet.",
    tone: trait.type === "scar" ? "negative" : "default",
  }));

  const structuredTraits = [
    calling?.passive
      ? {
          label: calling.passive,
          source: "Calling Passive",
          detail: calling.passiveRule,
          tone: "default",
        }
      : null,
    origin?.passive
      ? {
          label: origin.passive,
          source: "Origin Passive",
          detail: origin.passiveRule,
          tone: "default",
        }
      : null,
    origin?.drawback
      ? {
          label: origin.drawback,
          source: "Origin Drawback",
          detail: origin.drawbackRule,
          tone: "negative",
        }
      : null,
  ].filter(Boolean);

  return [...savedTraits, ...structuredTraits];
}

export function getIdentityEntries(character) {
  const background = character.identity?.background ?? {};

  return [
    background.origin
      ? {
          key: "background-origin",
          label: "Origin",
          meta: "Background",
          detail: background.origin,
        }
      : null,
    background.pastRole
      ? {
          key: "background-past-role",
          label: "Past Role",
          meta: "Background",
          detail: background.pastRole,
        }
      : null,
    background.definingEvent
      ? {
          key: "background-defining-event",
          label: "Defining Event",
          meta: "Background",
          detail: background.definingEvent,
        }
      : null,
    ...(character.identity?.tags ?? []).map((tag) => ({
      key: `identity-tag-${tag.key}`,
      label: tag.label,
      meta: titleCase(tag.type || "tag"),
      detail: tag.mechanicalImpact || "No identity effect recorded yet.",
    })),
  ].filter(Boolean);
}

export function getProgressionEntries(character, blueprint) {
  const progression = character.progression ?? {};
  const level = progression.rank ?? 1;
  const path = getSystemSpecialization(
    progression.specializationPath,
    blueprint
  );
  let bonus = "Unavailable";
  try {
    bonus = `+${proficiencyBonus(level)}`;
  } catch {
    /* Historical invalid level. */
  }
  return [
    { key: "level", label: "Level", value: level, detail: "Character level." },
    {
      key: "proficiency",
      label: "Proficiency Bonus",
      value: bonus,
      detail:
        "Derived from level; added at most once when relevant Training applies.",
    },
    {
      key: "path",
      label: "Specialized Path",
      value: path?.name ?? progression.specializationPath ?? "Unchosen",
      detail: `${
        path?.summary ?? ""
      } Path advancement is unavailable pending progression rules.`,
    },
    {
      key: "nodes",
      label: "Recorded Path Nodes",
      value: progression.unlockedNodes?.length ?? 0,
      detail:
        (progression.unlockedNodes ?? [])
          .map((id) => {
            const node = getSystemSpecializationNode(
              progression.specializationPath,
              id,
              blueprint
            );
            return node ? `${node.name}: ${node.effect}` : id;
          })
          .join("\n") || "No nodes recorded.",
    },
  ];
}

export function getAbilityEntries(character) {
  return (character.progressionDerived?.abilities ?? []).map((a) => ({
    label: a.name,
    source: a.source.type + " · " + a.timing + " · " + a.implementationStatus,
    detail:
      a.description +
      " · level " +
      a.minimumLevel +
      " · " +
      a.missingDependencies.join(", "),
  }));
}
export function getCatalogGroups(character) {
  const woundEntries = character.resources?.wounds?.active ?? [];
  return [
    {
      key: "wounds",
      title: "Wounds",
      empty: "No wounds recorded yet.",
      entries: woundEntries.map((wound) => ({
        label: wound.name,
        meta: titleCase(wound.severity),
        detail: `${wound.description || "No wound description yet."}${
          wound.statPenalty ? ` Penalty: ${titleCase(wound.statPenalty)}.` : ""
        }`,
        tone: "negative",
      })),
    },
  ];
}

export function toReferenceEntries(items, config = {}) {
  return items.map((item, index) => ({
    key: item.key ?? `${config.prefix ?? "entry"}-${index}`,
    label: item.label,
    meta: item.meta,
    value: item.value ?? item.source ?? item.score ?? "",
    modifier: item.modifier,
    detail: item.detail,
  }));
}

export function getTrackerValue(resource) {
  return Number.isFinite(resource?.current) && Number.isFinite(resource?.max)
    ? { current: resource.current, max: resource.max }
    : { current: null, max: null };
}

export function buildReputationEntries(character, blueprint) {
  return getActiveSystemReputationEntries(
    getCharacterReputation(character) ??
      getSystemOriginStartingReputation(character?.origin, blueprint),
    blueprint
  ).map(([trackKey, score]) => {
    const track = getSystemReputationTrack(trackKey, blueprint);
    const tier = getSystemReputationTier(score, blueprint);

    return {
      key: trackKey,
      label: track?.name ?? trackKey,
      meta: score > 0 ? "Trusted" : "Distrusted",
      value: formatSystemReputationScore(score),
      detail: `${tier.label}. ${tier.effect}\n\n${
        track?.scope ?? "No scope notes yet."
      }`,
    };
  });
}

export function getOriginBonus(origin) {
  return parseAttributeBonus(origin?.bonus);
}
