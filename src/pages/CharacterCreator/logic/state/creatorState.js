import { calculateResourceMaximums } from "../../../../lib/resources.js";
import { createEmptyAttributes } from "../../../../lib/creatorAttributes.js";

export function createEmptyDetails() {
  return {
    pastRole: "",
    definingEvent: "",
    notes: "",
    customTraitsText: "",
  };
}

export function createEmptyLoadout() {
  return {
    abilitySelections: {},
    startingEquipment: null,
  };
}

export function createEmptyResourceValues() {
  return {
    health: 0,
    stamina: 0,
    focus: 0,
    corruption: 0,
    wounds: 0,
  };
}

export function createEmptyWound() {
  return {
    name: "",
    severity: "minor",
    statPenalty: "",
    description: "",
  };
}

export function createResources(attributes, level = 1) {
  const maxima = calculateResourceMaximums(attributes, level);
  return {
    ...Object.fromEntries(
      Object.entries(maxima).map(([key, max]) => [key, { current: max, max }])
    ),
    wounds: { current: 0, max: 3, active: [] },
    corruption: { current: 0, max: 6 },
  };
}

export function clampTrackValue(value, max) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(max, numericValue));
}

export function createProgression(rank = 1) {
  return {
    rank,
    advancementPoints: 0,
    specializationPath: "",
    unlockedNodes: [],
  };
}

export function normalizeProgression(progression = {}) {
  return {
    rank: Math.max(1, Number(progression.rank) || 1),
    advancementPoints: Math.max(0, Number(progression.advancementPoints) || 0),
    specializationPath: progression.specializationPath ?? "",
    unlockedNodes: progression.unlockedNodes ?? [],
  };
}

export function removeAttributeBonus(
  attributeValues,
  bonusText = "",
  parseAttributeBonus
) {
  const parsedBonus = parseAttributeBonus(bonusText);

  if (!parsedBonus) {
    return attributeValues;
  }

  return {
    ...createEmptyAttributes(),
    ...attributeValues,
    [parsedBonus.key]: Math.max(
      0,
      (attributeValues?.[parsedBonus.key] ?? 0) - parsedBonus.amount
    ),
  };
}
