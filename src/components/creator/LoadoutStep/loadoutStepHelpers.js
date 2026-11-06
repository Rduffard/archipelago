export const ABILITY_SOURCE_OPTIONS = ["custom", "origin", "relic"];
export const ABILITY_TYPE_OPTIONS = ["active", "passive", "reaction"];
export const RESOURCE_OPTIONS = [
  "",
  "stamina",
  "focus",
  "corruption",
  "health",
];
export const ATTRIBUTE_OPTIONS = [
  "",
  "might",
  "agility",
  "wit",
  "spirit",
  "resolve",
  "instinct",
];

export function titleCase(value = "") {
  if (!value) {
    return "None";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
