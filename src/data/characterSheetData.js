import { attributes } from './gameData'

export const ATTRIBUTE_DETAILS = attributes.reduce((detailMap, attribute) => {
  detailMap[attribute.key] = attribute.description
  return detailMap
}, {})

export const DERIVED_STAT_DETAILS = {
  vitality: {
    category: 'derived',
    formula: '10 + Might + Resolve',
    description: 'Your health pool and ability to stay standing through punishment.',
  },
  guard: {
    category: 'derived',
    formula: '10 + Agility',
    description: 'Your baseline defense against direct attacks and incoming pressure.',
  },
  initiative: {
    category: 'derived',
    formula: '10 + Agility + Instinct',
    description: 'How quickly you react, reposition, and act when the action starts.',
  },
  focus: {
    category: 'derived',
    formula: '10 + Spirit + Resolve',
    description: 'Mental stability, magical control, and resistance against strain.',
  },
}

export const SOCIAL_STAT_DETAILS = {
  grace: {
    category: 'social',
    formula: '10 + Spirit + Resolve',
    description: 'Charm, diplomacy, poise, and the ability to win trust without force.',
  },
  guile: {
    category: 'social',
    formula: '10 + Wit + Spirit',
    description: 'Lies, misdirection, concealment, and reading the hidden angle in a conversation.',
  },
  pressure: {
    category: 'social',
    formula: '10 + Might + Resolve',
    description: 'Threat, command presence, hard bargaining, and forcing someone to fold.',
  },
}

export const PAIRING_CATEGORY_DETAILS = {
  combat: {
    label: 'Combat',
    description: 'Fast reads for direct conflict, tempo, positioning, and execution under pressure.',
  },
  social: {
    label: 'Social',
    description: 'How the character persuades, deceives, performs, commands, or bends a room.',
  },
  exploration: {
    label: 'Exploration',
    description: 'Navigation, survival, reaction speed, and steady judgment when the world turns hostile.',
  },
  utility: {
    label: 'Utility',
    description: 'Practical problem-solving, force applied intelligently, and making environments cooperate.',
  },
  arcane: {
    label: 'Arcane',
    description: 'Relic sense, spiritual attunement, omens, and the unseen pulse of a place.',
  },
}
