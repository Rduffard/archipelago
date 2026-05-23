export const INITIAL_IDENTITY = {
  name: '',
  pronouns: '',
  callingId: '',
  path: '',
  originId: '',
}

export const PATH_ORIGIN_MAP = {
  yuma: 'yuma-core',
  lilin: 'lilin-core',
}

export const STARTING_CORE_POINTS = 3
export const STARTING_SPECIALTY_PICKS = 5

export const CREATOR_STEPS = [
  {
    id: 'identity',
    title: 'Roots',
    description: 'Name the character and choose a world path or island origin.',
  },
  {
    id: 'calling',
    title: 'Calling',
    description: 'Define the role this character plays.',
  },
  {
    id: 'attributes',
    title: 'Attributes',
    description: 'Spend the 12 starting points.',
  },
  {
    id: 'skills',
    title: 'Training',
    description: 'Invest in core checks and choose ranked specialties.',
  },
  {
    id: 'loadout',
    title: 'Loadout',
    description: 'Add custom abilities, gear, relics, and carried inventory.',
  },
  {
    id: 'details',
    title: 'Details',
    description: 'Set background notes, custom traits, and starting tracks.',
  },
  {
    id: 'progression',
    title: 'Progression',
    description: 'Set rank, specialization path, and unlocked advancement.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Check the frame and save the sheet.',
  },
]
