const labels = {
  skills: 'Calling skill Training',
  backgroundSkills: 'Background skill Training',
  backgroundTool: 'Background tool Training',
  instrument: 'Starting instrument',
  expertise: 'Expertise',
  scholar: 'Scholar Expertise',
  languages: 'Standard language',
  callingLanguages: 'Calling language',
  featTraining: 'Origin feat Training',
  mastery: 'Weapon Mastery',
  style: 'Fighting Style',
  divineOrder: 'Divine Order',
  equipment: 'Calling loadout',
  initiateList: 'Magic Initiate spell list',
  initiateAttribute: 'Magic Initiate casting attribute',
  initiateCantrips: 'Magic Initiate cantrips',
  initiateSpell: 'Magic Initiate spell',
  styleCantrips: 'Fighting Style cantrips',
};

export const choiceTitle = key => labels[key] ?? key.replace(/([A-Z])/g, ' $1');

export const skillExamples = {
  acrobatics: 'Keep your balance or tumble past an obstacle.',
  'animal-handling': 'Calm or guide an animal.',
  arcana: 'Recognize magical effects or traditions.',
  athletics: 'Climb, jump, or swim under pressure.',
  deception: 'Sell a bluff or conceal your intentions.',
  history: 'Recall past events and notable figures.',
  insight: 'Read someone’s motives or mood.',
  intimidation: 'Pressure someone with a credible threat.',
  investigation: 'Piece together clues or work out how something fits.',
  medicine: 'Assess an injury or stabilize a companion.',
  nature: 'Identify plants, creatures, or natural hazards.',
  perception: 'Notice a hidden threat or a faint sound.',
  performance: 'Entertain or hold an audience’s attention.',
  persuasion: 'Win cooperation through diplomacy or reasoning.',
  religion: 'Recognize religious rites, symbols, or traditions.',
  'sleight-of-hand': 'Palm an object or manipulate it unnoticed.',
  stealth: 'Move quietly or stay out of sight.',
  survival: 'Follow tracks or find a route through the wild.',
};

export function displayName(id, rules) {
  if (!id) return '';
  if (id === 'thieves-cant') return "Thieves' Cant";
  if (/[A-Z]/.test(id[0])) return id;
  if (id.startsWith('language:')) {
    const origin = rules?.creation?.origins.find(entry => entry.id === id.slice(9));
    if (origin) return origin.name;
    id = id.slice(9);
  }
  return id.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('-', ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

export function equipmentQuantities(items, nameOf) {
  const counts = new Map();
  for (const item of items) {
    const name = nameOf(item);
    counts.set(name, (counts.get(name) ?? 0) + (item.quantity ?? 1));
  }
  return Array.from(counts, ([name, quantity]) => ({ name, quantity }));
}
