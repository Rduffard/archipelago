
export function getSystemCallings(blueprint) {
  return blueprint?.catalogs?.callings ?? []
}

export function getSystemOriginPaths(blueprint) {
  return blueprint?.catalogs?.originPaths ?? []
}

export function getSystemOrigins(blueprint) {
  return blueprint?.catalogs?.origins ?? []
}

export function getSystemSpecializations(blueprint) {
  return blueprint?.catalogs?.specializations ?? []
}

export function getSystemSpecialization(pathKey, blueprint) {
  if (!pathKey) {
    return null
  }

  const normalizedPathKey = pathKey.trim().toLowerCase()

  return (
    getSystemSpecializations(blueprint).find(
      (specialization) =>
        specialization.id === normalizedPathKey || specialization.name.toLowerCase() === normalizedPathKey,
    ) ?? null
  )
}

export function getSystemSpecializationNodes(pathKey, blueprint) {
  return getSystemSpecialization(pathKey, blueprint)?.nodes ?? []
}

export function getSystemSpecializationNode(pathKey, nodeId, blueprint) {
  return getSystemSpecializationNodes(pathKey, blueprint).find((node) => node.id === nodeId) ?? null
}

export function getRecommendedSystemSpecializations(callingId, blueprint) {
  if (!callingId) {
    return []
  }

  return getSystemSpecializations(blueprint).filter((specialization) =>
    (specialization.recommendedCallings ?? []).includes(callingId),
  )
}

export function getSystemReputationTracks(blueprint) {
  return blueprint?.catalogs?.reputation?.tracks ?? []
}

export function getSystemReputationTiers(blueprint) {
  return blueprint?.catalogs?.reputation?.tiers ?? []
}

export function getSystemOriginReputationModifiers(blueprint) {
  return blueprint?.catalogs?.reputation?.originModifiers ?? {}
}

export function clampSystemReputationScore(score, blueprint) {
  const min = blueprint?.catalogs?.reputation?.min ?? -3
  const max = blueprint?.catalogs?.reputation?.max ?? 3
  return Math.max(min, Math.min(max, score))
}

export function createNeutralSystemReputation(blueprint) {
  return getSystemReputationTracks(blueprint).reduce((reputation, track) => {
    reputation[track.key] = 0
    return reputation
  }, {})
}

export function applySystemReputationModifiers(baseReputation, modifiers = {}, blueprint) {
  const nextReputation = { ...baseReputation }

  Object.entries(modifiers).forEach(([key, amount]) => {
    nextReputation[key] = clampSystemReputationScore((nextReputation[key] ?? 0) + amount, blueprint)
  })

  return nextReputation
}

export function getSystemOriginStartingReputation(originId, blueprint) {
  return applySystemReputationModifiers(
    createNeutralSystemReputation(blueprint),
    getSystemOriginReputationModifiers(blueprint)[originId] ?? {},
    blueprint,
  )
}

export function getSystemReputationTier(score, blueprint) {
  const tiers = getSystemReputationTiers(blueprint)

  return tiers.find((tier) => tier.score === clampSystemReputationScore(score, blueprint)) ?? null
}

export function getSystemReputationTrack(trackKey, blueprint) {
  return getSystemReputationTracks(blueprint).find((track) => track.key === trackKey) ?? null
}

export function formatSystemReputationScore(score) {
  return score > 0 ? `+${score}` : `${score}`
}

export function getSortedSystemReputationEntries(reputation = {}, blueprint) {
  return Object.entries(reputation).sort((left, right) => {
    const leftScore = Math.abs(left[1] ?? 0)
    const rightScore = Math.abs(right[1] ?? 0)

    if (rightScore !== leftScore) {
      return rightScore - leftScore
    }

    const leftTrack = getSystemReputationTrack(left[0], blueprint)
    const rightTrack = getSystemReputationTrack(right[0], blueprint)

    return (leftTrack?.name ?? left[0]).localeCompare(rightTrack?.name ?? right[0])
  })
}

export function getActiveSystemReputationEntries(reputation = {}, blueprint) {
  return getSortedSystemReputationEntries(reputation, blueprint).filter(([, score]) => score !== 0)
}
