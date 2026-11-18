import { displayName } from '../../game/creator/choiceLabels';

export default function ruleLabel(id, rules) {
  if(id.startsWith('language:'))return displayName(id, rules);
  if(id.startsWith('skill:'))return 'Skill: '+ruleLabel(id.slice(6),rules);
  if(id.startsWith('tool:'))return 'Tool: '+displayName(id.slice(5));
  return (
    [...rules.skills, ...rules.paths, ...rules.spells, ...rules.feats, ...rules.equipment.items].find(
      (item) => item.id === id
    )?.name ?? displayName(id)
  );
}
