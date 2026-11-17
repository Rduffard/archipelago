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
