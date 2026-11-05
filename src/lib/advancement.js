export function unspentRewards(character, rules) {
  if (!character.advancement || !rules) return []
  const level = character.progression.rank
  const used = new Set(character.advancement.spends.map(s => s.rewardId))
  const exchanges = new Map(character.advancement.exchanges.map(e => [e.rewardId, e.kind]))
  return [['calling', rules.callingLevels], ['path', rules.pathLevels], ['attribute', rules.attributeLevels]]
    .flatMap(([kind, levels]) => levels.filter(n => n <= level).map(n => ({ id: `${kind}:${n}`, level: n, kind: exchanges.get(`${kind}:${n}`) ?? kind })))
    .filter(reward => !used.has(reward.id))
    .sort((a, b) => a.level - b.level || a.kind.localeCompare(b.kind))
}

export function advancementRequest(character, changes) {
  return { advancementOperation: { ...changes, expectedRevision: character.advancement.revision } }
}
