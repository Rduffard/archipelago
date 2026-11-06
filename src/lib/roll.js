import { calculateCheckModifier } from "./checkModifier.js";
import { proficiencyBonus } from "./training.js";

export const skillAttributes = Object.freeze({
  bargain: "spirit",
  command: "resolve",
  deceive: "spirit",
  read: "instinct",
  perform: "spirit",
  threaten: "resolve",
  persuade: "spirit",
  navigate: "wit",
  track: "instinct",
  endure: "resolve",
  climb: "might",
  dive: "might",
  stealth: "agility",
  perception: "instinct",
  investigate: "wit",
  lore: "wit",
  finesse: "agility",
  "jury-rig": "wit",
  stabilize: "wit",
  attune: "spirit",
});
export const rollAttributes = [
  "might",
  "agility",
  "wit",
  "spirit",
  "resolve",
  "instinct",
];
export const signed = (value) => `${value >= 0 ? "+" : "−"}${Math.abs(value)}`;
export const appendRollHistory = (history, result) =>
  [result, ...history].slice(0, 8);
export function skillIsTrained(character, id) {
  return (
    character.trainingRulesVersion === 1 &&
    (character.training ?? []).includes(id)
  );
}
export function createRoll(
  { character, type, name, attribute, skillId },
  random = Math.random
) {
  if (!["attribute", "skill", "save"].includes(type))
    throw new Error("Unknown roll type");
  if (type === "skill" && attribute === undefined)
    attribute = skillAttributes[skillId];
  const modifier = calculateCheckModifier(character.attributes, attribute);
  const proficient =
    type === "skill"
      ? skillIsTrained(character, skillId)
      : type === "save" &&
        (character.advancement?.savingThrows ?? []).includes(attribute);
  const proficiency = proficient
    ? proficiencyBonus(character.progression?.rank)
    : 0;
  const restrictions = character.equipmentDerived?.restrictions;
  const disadvantage =
    (["might", "agility"].includes(attribute) &&
      restrictions?.physicalD20Disadvantage) ||
    (type === "skill" &&
      skillId === "stealth" &&
      restrictions?.stealthDisadvantage);
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1)
    throw new Error("Invalid die source");
  let natural = Math.floor(sample * 20) + 1;
  if (disadvantage) {
    const second = random();
    if (!Number.isFinite(second) || second < 0 || second >= 1)
      throw new Error("Invalid die source");
    natural = Math.min(natural, Math.floor(second * 20) + 1);
  }
  return {
    type,
    name,
    attribute,
    modifier,
    proficiency,
    natural,
    total: natural + modifier + proficiency,
  };
}
export function rollTone(natural) {
  return natural === 20 ? "high" : natural === 1 ? "low" : "normal";
}
