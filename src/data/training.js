export function getTrainingOptions(blueprint) { return blueprint?.training ?? [] }
export function toggleTraining(current, id, options) {
  if (!options.some((entry) => entry.id === id)) return current;
  if (current.includes(id)) return current.filter((entry) => entry !== id);
  return current.length < 4 ? [...current, id] : current;
}
