export const REPUTATION_MIN = -3
export const REPUTATION_MAX = 3

export const reputationTracks = [
  {
    key: 'yumaRepublic',
    name: 'Yuma Republic',
    scope: 'Imperial industry, officers, state inventors, and western occupation forces.',
  },
  {
    key: 'lilinEmpire',
    name: 'Lilin Empire',
    scope: 'Eastern arcanists, spirit courts, and ritual-aligned imperial interests.',
  },
  {
    key: 'freeCaptains',
    name: 'Free Captains',
    scope: 'Pirate crews, independent sailors, and people loyal to the Pirate King myth.',
  },
  {
    key: 'rebelMovements',
    name: 'Rebel Movements',
    scope: 'Insurgents, anti-occupation cells, labor agitators, and revolutionary networks.',
  },
  {
    key: 'guildConsortium',
    name: 'Guild Consortium',
    scope: 'Shipwrights, artificers, trade guilds, and industrial craft elites.',
  },
  {
    key: 'nobleCourts',
    name: 'Noble Courts',
    scope: 'Duchies, principalities, feudal houses, court functionaries, and legitimacy politics.',
  },
  {
    key: 'underworld',
    name: 'Underworld Networks',
    scope: 'Smugglers, assassins, black markets, secret police, and criminal brokers.',
  },
  {
    key: 'faithOrders',
    name: 'Faith Orders',
    scope: 'Monastics, shrine keepers, spirit clergy, and sacred institutions.',
  },
  {
    key: 'seaPeoples',
    name: 'Sea Peoples',
    scope: 'Fishfolk nations, coralborn communities, tide mystics, and submerged polities.',
  },
  {
    key: 'frontierTribes',
    name: 'Frontier Tribes',
    scope: 'Akshan tribes, wildland guardians, spirit-tamers, and non-imperial ancestral cultures.',
  },
]

export const reputationTiers = [
  {
    score: -3,
    label: 'Hated',
    effect: 'Hostile attention, closed doors, and routine disadvantage on social checks with that track.',
  },
  {
    score: -2,
    label: 'Distrusted',
    effect: 'Suspicion, worse prices, and frequent scrutiny or extra demands.',
  },
  {
    score: -1,
    label: 'Wary',
    effect: 'People hesitate, ask for proof, and start guarded rather than friendly.',
  },
  {
    score: 0,
    label: 'Unknown',
    effect: 'No built-in edge or penalty. Your actions in play define the relationship.',
  },
  {
    score: 1,
    label: 'Known Favorably',
    effect: 'Small courtesies, easier introductions, and occasional advantage on first impressions.',
  },
  {
    score: 2,
    label: 'Trusted',
    effect: 'Reliable access, material help, and support when risk is reasonable.',
  },
  {
    score: 3,
    label: 'Champion',
    effect: 'You are treated as an insider, symbol, or protected asset by that track.',
  },
]

export const originReputationModifiers = {
  'yuma-core': {
    yumaRepublic: 2,
    guildConsortium: 1,
    lilinEmpire: -2,
    freeCaptains: -1,
    rebelMovements: -1,
  },
  'lilin-core': {
    lilinEmpire: 2,
    faithOrders: 1,
    yumaRepublic: -2,
    guildConsortium: -1,
  },
  yayimi: {
    yumaRepublic: -2,
    freeCaptains: 1,
    rebelMovements: 2,
  },
  klechi: {
    guildConsortium: 2,
    freeCaptains: 1,
    underworld: 1,
    nobleCourts: -1,
  },
  tetlanco: {
    nobleCourts: 2,
    underworld: 1,
    freeCaptains: -1,
    rebelMovements: -1,
  },
  harshanum: {
    freeCaptains: 2,
    rebelMovements: 1,
    nobleCourts: -2,
    faithOrders: -1,
  },
  khiz: {
    rebelMovements: 1,
    nobleCourts: -1,
    guildConsortium: -1,
    underworld: 1,
  },
  'dengz-guo': {
    guildConsortium: 1,
    nobleCourts: 1,
    yumaRepublic: -1,
    lilinEmpire: -1,
    rebelMovements: -1,
  },
  arannia: {
    nobleCourts: 1,
    underworld: 2,
    faithOrders: 1,
  },
  dazibinian: {
    nobleCourts: 1,
    guildConsortium: 1,
    rebelMovements: 1,
  },
  kirkia: {
    frontierTribes: 2,
    faithOrders: 1,
    nobleCourts: -1,
    guildConsortium: -1,
  },
  silvia: {
    nobleCourts: 2,
    faithOrders: 1,
    freeCaptains: -1,
  },
  'sha-ni': {
    nobleCourts: 2,
    frontierTribes: 1,
    freeCaptains: -2,
    underworld: -1,
  },
  purapet: {
    faithOrders: 2,
    nobleCourts: 1,
    underworld: -1,
  },
  thult: {
    seaPeoples: 2,
    freeCaptains: 1,
    yumaRepublic: -1,
  },
  rukka: {
    seaPeoples: 2,
    rebelMovements: 1,
    nobleCourts: -1,
    yumaRepublic: -1,
  },
  busha: {
    seaPeoples: -1,
    underworld: 1,
    freeCaptains: -1,
    rebelMovements: 1,
  },
  akshan: {
    frontierTribes: 2,
    rebelMovements: 1,
    yumaRepublic: -1,
    lilinEmpire: -1,
  },
}

export function createNeutralReputation() {
  return reputationTracks.reduce((reputation, track) => {
    reputation[track.key] = 0
    return reputation
  }, {})
}

export function clampReputationScore(score) {
  return Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, score))
}

export function applyReputationModifiers(baseReputation, modifiers = {}) {
  const nextReputation = { ...baseReputation }

  Object.entries(modifiers).forEach(([key, amount]) => {
    nextReputation[key] = clampReputationScore((nextReputation[key] ?? 0) + amount)
  })

  return nextReputation
}

export function getOriginStartingReputation(originId) {
  return applyReputationModifiers(createNeutralReputation(), originReputationModifiers[originId] ?? {})
}

export function getReputationTier(score) {
  return reputationTiers.find((tier) => tier.score === clampReputationScore(score)) ?? reputationTiers[3]
}

export function getReputationTrack(trackKey) {
  return reputationTracks.find((track) => track.key === trackKey) ?? null
}

export function formatReputationScore(score) {
  return score > 0 ? `+${score}` : `${score}`
}

export function getSortedReputationEntries(reputation = {}) {
  return Object.entries(reputation).sort((left, right) => {
    const leftScore = Math.abs(left[1] ?? 0)
    const rightScore = Math.abs(right[1] ?? 0)

    if (rightScore !== leftScore) {
      return rightScore - leftScore
    }

    const leftTrack = getReputationTrack(left[0])
    const rightTrack = getReputationTrack(right[0])

    return (leftTrack?.name ?? left[0]).localeCompare(rightTrack?.name ?? right[0])
  })
}

export function getActiveReputationEntries(reputation = {}) {
  return getSortedReputationEntries(reputation).filter(([, score]) => score !== 0)
}
