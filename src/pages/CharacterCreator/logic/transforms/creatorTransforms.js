import { parseAttributeBonus } from "../../../../lib/character";
import { createEmptyAttributes } from "../../../../lib/creatorAttributes.js";
import { removeAttributeBonus } from "../state/creatorState";

export function toSlug(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeWounds(wounds = []) {
  return wounds.length
    ? wounds.map((wound) => ({
        name: wound.name ?? "",
        severity: wound.severity ?? "minor",
        statPenalty: wound.statPenalty ?? "",
        description: wound.description ?? "",
      }))
    : [];
}

export function parseWounds(wounds = []) {
  return wounds
    .map((wound) => {
      const name = wound.name.trim();

      if (!name) {
        return null;
      }

      return {
        name,
        severity: wound.severity || "minor",
        statPenalty: wound.statPenalty || null,
        description: wound.description.trim(),
      };
    })
    .filter(Boolean);
}

export function getCreatorIdentity(character, origin) {
  return {
    name: character?.name ?? "",
    pronouns: character?.pronouns ?? "",
    callingId: character?.calling ?? "",
    path: origin?.path ?? "",
    originId: character?.origin ?? "",
  };
}

export function formatCustomTraitsText(traits = []) {
  return traits
    .map((trait) =>
      trait.mechanicalImpact
        ? `${trait.label} | ${trait.mechanicalImpact}`
        : trait.label
    )
    .join("\n");
}

export function parseCustomTraitsText(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelPart, ...impactParts] = line.split("|");
      const label = labelPart.trim();
      const mechanicalImpact = impactParts.join("|").trim();

      return {
        type: "trait",
        key: `custom-trait-${toSlug(label || `entry-${index + 1}`)}`,
        label: label || `Trait ${index + 1}`,
        mechanicalImpact,
      };
    });
}

export function getGeneratedTraitKeys(pathId, originId, callingId) {
  return new Set(
    [`path-${pathId}`, `origin-${originId}`, `calling-${callingId}`].filter(
      Boolean
    )
  );
}

export function removeOriginBonus(attributes, originBonus) {
  return removeAttributeBonus(
    attributes ?? createEmptyAttributes(),
    originBonus,
    parseAttributeBonus
  );
}
