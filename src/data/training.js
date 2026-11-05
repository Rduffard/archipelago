export function getTrainingOptions(blueprint, character) {
  return (character && character.trainingRulesVersion !== 1 ? (blueprint?.legacyTraining ?? blueprint?.training) : blueprint?.training) ?? []
}
export function toggleTraining(current, id, options) {
  if (current.includes(id)) return current.filter((entry) => entry !== id);
  if (!options.some((entry) => entry.id === id)) return current;
  return current.length < 4 ? [...current, id] : current;
}
