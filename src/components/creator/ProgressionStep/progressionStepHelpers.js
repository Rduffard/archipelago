export function getRemainingAdvancement(progression) {
  return Math.max(0, progression.advancementPoints ?? 0)
}

export function getNodeUnlockState({
  node,
  progression,
  remainingAdvancement,
  unlockedNodes,
}) {
  const isUnlocked = unlockedNodes.includes(node.id)
  const meetsRank = progression.rank >= node.rankRequired
  const canAfford = isUnlocked || remainingAdvancement >= node.cost

  return {
    canAfford,
    isUnlocked,
    meetsRank,
  }
}

export function getVisibleRankedSpecializations(rankedSpecializations = [], limit = 3) {
  return rankedSpecializations.slice(0, limit)
}
