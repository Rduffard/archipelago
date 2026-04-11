export const attributePairings = [
  {
    key: 'skirmish',
    name: 'Skirmish',
    attributes: ['might', 'agility'],
    category: 'combat',
    summary: 'Fast violence, dueling tempo, and closing the gap before someone can react.',
    examples: ['boarding actions', 'sword duels', 'aggressive chases'],
    formulaLabel: 'Might + Agility',
  },
  {
    key: 'leverage',
    name: 'Leverage',
    attributes: ['might', 'wit'],
    category: 'utility',
    summary: 'Using strength intelligently: breaching, hauling, engineering under strain, and forcing the environment to cooperate.',
    examples: ['forcing a hatch', 'improvised siege work', 'muscling through a machine jam'],
    formulaLabel: 'Might + Wit',
  },
  {
    key: 'conviction',
    name: 'Conviction',
    attributes: ['might', 'spirit'],
    category: 'social',
    summary: 'The force of soul behind a declaration, oath, prayer, or war cry.',
    examples: ['rallying with zeal', 'prophetic declarations', 'sacred menace'],
    formulaLabel: 'Might + Spirit',
  },
  {
    key: 'pressure',
    name: 'Pressure',
    attributes: ['might', 'resolve'],
    category: 'social',
    summary: 'Command presence, intimidation, and forcing someone to bend under your will.',
    examples: ['threats', 'hard bargaining', 'battlefield authority'],
    formulaLabel: 'Might + Resolve',
  },
  {
    key: 'pursuit',
    name: 'Pursuit',
    attributes: ['might', 'instinct'],
    category: 'exploration',
    summary: 'Predatory momentum, relentless tracking, and running something down.',
    examples: ['hunting prey', 'survival chases', 'pressing an advantage through wilderness'],
    formulaLabel: 'Might + Instinct',
  },
  {
    key: 'precision',
    name: 'Precision',
    attributes: ['agility', 'wit'],
    category: 'combat',
    summary: 'Aim, control, and exact action under pressure.',
    examples: ['marksmanship', 'fine sabotage', 'surgical strikes'],
    formulaLabel: 'Agility + Wit',
  },
  {
    key: 'flourish',
    name: 'Flourish',
    attributes: ['agility', 'spirit'],
    category: 'social',
    summary: 'Style, magnetism, and performative grace that turns motion into influence.',
    examples: ['performance', 'ceremonial display', 'seductive presence'],
    formulaLabel: 'Agility + Spirit',
  },
  {
    key: 'balance',
    name: 'Balance',
    attributes: ['agility', 'resolve'],
    category: 'exploration',
    summary: 'Control under stress, footwork, and staying steady when the world lurches.',
    examples: ['rope bridges', 'storm decks', 'keeping your footing under fire'],
    formulaLabel: 'Agility + Resolve',
  },
  {
    key: 'reflex',
    name: 'Reflex',
    attributes: ['agility', 'instinct'],
    category: 'combat',
    summary: 'Pure reaction speed, evasive motion, and split-second positioning.',
    examples: ['dodging ambushes', 'quickdraw contests', 'reactive movement'],
    formulaLabel: 'Agility + Instinct',
  },
  {
    key: 'guile',
    name: 'Guile',
    attributes: ['wit', 'spirit'],
    category: 'social',
    summary: 'Misdirection, layered lies, reading the room, and steering attention away from the truth.',
    examples: ['deception', 'secret negotiations', 'double meanings'],
    formulaLabel: 'Wit + Spirit',
  },
  {
    key: 'tactics',
    name: 'Tactics',
    attributes: ['wit', 'resolve'],
    category: 'combat',
    summary: 'Discipline, planning, and making the smart move when panic would be easier.',
    examples: ['battle plans', 'coordinating allies', 'staying sharp in chaos'],
    formulaLabel: 'Wit + Resolve',
  },
  {
    key: 'sense',
    name: 'Sense',
    attributes: ['wit', 'instinct'],
    category: 'exploration',
    summary: 'Reading danger, seeing patterns, and noticing what others miss.',
    examples: ['scouting', 'trap reading', 'navigational judgment'],
    formulaLabel: 'Wit + Instinct',
  },
  {
    key: 'grace',
    name: 'Grace',
    attributes: ['spirit', 'resolve'],
    category: 'social',
    summary: 'Poise, diplomacy, trust-building, and holding yourself with calm authority.',
    examples: ['persuasion', 'court etiquette', 'soft leadership'],
    formulaLabel: 'Spirit + Resolve',
  },
  {
    key: 'attunement',
    name: 'Attunement',
    attributes: ['spirit', 'instinct'],
    category: 'arcane',
    summary: 'Sensitivity to spirits, relic resonance, omens, and the unseen pulse of a place.',
    examples: ['reading relics', 'spirit contact', 'feeling corruption in the air'],
    formulaLabel: 'Spirit + Instinct',
  },
  {
    key: 'nerve',
    name: 'Nerve',
    attributes: ['resolve', 'instinct'],
    category: 'exploration',
    summary: 'Staying sharp in danger, trusting your gut, and not breaking when fear arrives first.',
    examples: ['fear resistance', 'disaster response', 'making the call under stress'],
    formulaLabel: 'Resolve + Instinct',
  },
]

export const coreSheetPairings = ['grace', 'guile', 'pressure']

export const suggestedExpansionPairings = ['precision', 'sense', 'attunement', 'conviction', 'skirmish']

export function getPairingByKey(pairingKey) {
  return attributePairings.find((pairing) => pairing.key === pairingKey) ?? null
}

export function getPairingByAttributes(leftAttribute, rightAttribute) {
  const lookup = [leftAttribute, rightAttribute].sort().join(':')

  return (
    attributePairings.find((pairing) => pairing.attributes.slice().sort().join(':') === lookup) ?? null
  )
}
