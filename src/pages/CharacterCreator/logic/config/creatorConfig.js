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
    description: 'Allocate up to 27 points before origin bonuses.',
  },
  {
    id: 'skills',
    title: 'Training',
    description: 'Choose exactly four Training proficiencies.',
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
    title: 'Paths',
    description: 'Inspect Paths and their recorded benefits.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Check the frame and save the sheet.',
  },
]
