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

export function hasLineageChoices(fields, values) {
  return fields.every(({ key, count, options }) => {
    const selected = Array.isArray(values[key]) ? values[key] : [values[key]];
    return selected.length === count && new Set(selected).size === count &&
      selected.every(id => options.some(option => option.id === id));
  });
}
