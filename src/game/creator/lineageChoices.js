import engineFeats from '@crossworld/sanguine-engine/feats';

const { magicInitiateChoices, magicInitiateSpells } = engineFeats;

const labels = {
  size: 'Size', skill: 'Skill Training', skills: 'Skill Training', originFeat: 'Origin feat',
  castingAttribute: 'Casting attribute', heritage: 'Heritage', formId: 'Starting animal form',
};

const asOptions = values => values.map(value => ({ id: value, name: value.replaceAll('-', ' ').replace(/^./, letter => letter.toUpperCase()) }));

export function lineageFields(lineage, rules) {
  return Object.entries(lineage.choices ?? {}).map(([key, choice]) => {
    let options;
    if (Array.isArray(choice)) {
      options = asOptions(choice).map(option => ({
        ...option,
        name: lineage.heritages?.[option.id]?.name ??
          rules.skills.find(entry => entry.id === option.id)?.name ?? option.name,
      }));
    } else if (choice === 'catalog') {
      options = rules.skills;
    } else if (choice === 'origin-feat') {
      options = rules.feats.filter(feat => feat.category === 'origin');
    } else if (choice === 'level-one-form') {
      options = rules.creation.beastshifterForms.filter(form => form.level === 1);
    } else if (choice.options) {
      options = rules.skills.filter(skill => choice.options.includes(skill.id));
    }
    return { key, label: labels[key] ?? key, count: choice.count ?? 1, options: options ?? [] };
  });
}

export function lineageFeatFields(feat, rules) {
  if (feat.id === 'skilled') return [{
    key: 'training', label: 'Additional Training', count: 3,
    options: [
      ...rules.skills.map(skill => ({ id: 'skill:' + skill.id, name: skill.name })),
      ...asOptions(rules.creation.tools).map(tool => ({ ...tool, id: 'tool:' + tool.id })),
    ],
  }];
  if (feat.id !== 'magic-initiate') return [];

  const list = feat.options?.list;
  const spells = level => {
    const ids = magicInitiateSpells(list, level);
    return rules.spells.filter(spell => ids.includes(spell.id));
  };
  return [
    { key: 'list', label: 'Spell list', count: 1, options: asOptions(magicInitiateChoices.lists) },
    { key: 'attribute', label: 'Feat casting attribute', count: 1, options: asOptions(magicInitiateChoices.attributes) },
    ...(list ? [
      { key: 'cantrips', label: 'Feat cantrips', count: magicInitiateChoices.cantripCount, options: spells(0) },
      { key: 'spell', label: 'Feat spell', count: 1, options: spells(1) },
    ] : []),
  ];
}

export function hasLineageChoices(fields, values, rules) {
  if (!fields.every(({ key, count, options }) => {
    const value = key === 'originFeat' ? values[key]?.id : values[key];
    return hasSelection(count, options, value);
  })) return false;
  const feat = values.originFeat;
  return !feat || lineageFeatFields(feat, rules).every(({ key, count, options }) =>
    hasSelection(count, options, feat.options?.[key]));
}

function hasSelection(count, options, value) {
  const selected = Array.isArray(value) ? value : [value];
  return selected.length === count && new Set(selected).size === count &&
    selected.every(id => options.some(option => option.id === id));
}

export function creationWithLineage(creation, id, values) {
  const { size: legacySize, ...roots } = creation;
  void legacySize;
  const { size, ...choices } = values;
  const selected = Object.fromEntries(Object.entries(choices).filter(([, value]) => value !== undefined));
  return {
    ...roots,
    lineage: {
      id,
      ...(size ? { size } : {}),
      ...(Object.keys(selected).length ? { choices: selected } : {}),
    },
  };
}

export function splitLineageFields(fields) {
  const contextual = fields.filter(field => ['skill', 'skills', 'originFeat'].includes(field.key));
  return { contextual, structural: fields.filter(field => !contextual.includes(field)) };
}
