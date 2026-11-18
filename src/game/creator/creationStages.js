export const creationStages = [
  { title: 'Identity', steps: ['Identity'] },
  { title: 'Lineage', steps: ['Lineage'] },
  { title: 'Roots and Background', steps: ['Origin', 'Background'] },
  { title: 'Calling', steps: ['Calling'] },
  { title: 'Attributes and Training', steps: ['Attributes', 'Training'] },
  { title: 'Abilities and Feats', steps: ['Abilities and feats'] },
  { title: 'Equipment and Spells', steps: ['Equipment', 'Spells'] },
  { title: 'Review', steps: ['Review'] },
];

export const stageIndexFor = step => creationStages.findIndex(stage => stage.steps.includes(step));

export function retainCreationOptions(decision, previous = []) {
  return [...new Set([...(decision.requiredOptions ?? []), ...previous.filter(id => decision.options.includes(id))])];
}

export const callingRoles = {
  corsair: 'Precision strikes and skilled infiltration',
  gunslinger: 'Firearms and ranged pressure',
  navigator: 'Exploration and battlefield positioning',
  tidecaller: 'Innate magic and spell shaping',
  warden: 'Protection and martial support',
  reaver: 'Relentless frontline offense',
  doctor: 'Healing and field medicine',
  shipwright: 'Invention and magical outfitting',
};

export function prerequisiteStage(prerequisites, completed, index) {
  return prerequisites.findIndex((message, prior) => prior < index &&
    (message || (prior >= stageIndexFor('Training') && !completed.includes(prior))));
}

const spread = (primary, secondary, third, fourth, fifth, sixth) =>
  Object.fromEntries([[primary, 15], [secondary, 14], [third, 14], [fourth, 10], [fifth, 10], [sixth, 8]]);

export const recommendedAttributes = {
  corsair: { scores: spread('agility', 'resolve', 'spirit', 'wit', 'instinct', 'might'),
    reason: 'Agility supports finesse strikes and stealth. Resolve helps you survive close fights, and Spirit supports social skills.' },
  gunslinger: { scores: spread('agility', 'resolve', 'instinct', 'wit', 'spirit', 'might'),
    reason: 'Agility supports firearm attacks. Resolve helps you stay standing, and Instinct supports spotting threats.' },
  navigator: { scores: spread('agility', 'instinct', 'resolve', 'wit', 'might', 'spirit'),
    reason: 'Agility supports ranged and finesse weapons. Instinct helps with exploration and Navigator spellcasting.' },
  tidecaller: { scores: spread('spirit', 'resolve', 'agility', 'instinct', 'wit', 'might'),
    reason: 'Spirit powers Tidecaller spells. Resolve supports Health and Concentration, while Agility helps with Initiative.' },
  warden: { scores: spread('might', 'spirit', 'resolve', 'agility', 'instinct', 'wit'),
    reason: 'Might supports melee strikes. Spirit powers Warden spellcasting, and Resolve supports frontline Health.' },
  reaver: { scores: spread('might', 'resolve', 'agility', 'instinct', 'spirit', 'wit'),
    reason: 'Might supports Reaver attacks. Resolve supports Health, and Agility helps with Initiative and Guard outside heavy armor.' },
  doctor: { scores: spread('instinct', 'resolve', 'agility', 'wit', 'spirit', 'might'),
    reason: 'Instinct powers Doctor spells. Resolve supports Concentration, and Agility helps with Initiative.' },
  shipwright: { scores: spread('wit', 'resolve', 'agility', 'instinct', 'might', 'spirit'),
    reason: 'Wit powers Shipwright spellcasting. Resolve supports Concentration, and Agility helps with Initiative.' },
};
