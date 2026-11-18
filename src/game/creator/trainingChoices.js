import { lineageFeatFields } from './lineageChoices.js';

export function unavailableTrainingOptions(choice, summary, choices, rules, background, creation) {
  const unavailable = {};
  const add = (id, source) => {
    if (!choice.options.includes(id)) unavailable[id] = 'Already granted by ' + source + '.';
  };
  if (['languages', 'callingLanguages'].includes(choice.key)) {
    for (const id of summary.languages) {
      if (id === 'thieves-cant') add(id, 'your Calling');
      else if (id === 'common') add(id, 'the starting language rules');
      else add(id, choices.languages?.includes(id) ? 'your standard language choice' : 'your Origin');
    }
  }
  if (choice.key === 'featTraining') {
    const backgroundSkills = creation.custom?.skills ?? background.skills;
    for (const id of summary.training) {
      if (!rules.skills.some(skill => skill.id === id)) continue;
      add('skill:' + id, choices.skills?.includes(id) ? 'your Calling'
        : backgroundSkills.includes(id) || choices.backgroundSkills?.includes(id) ? 'your Background' : 'another starting feature');
    }
    for (const id of summary.equipmentTraining.tools) {
      if (!rules.creation.tools.includes(id)) continue;
      add('tool:' + id, id === (creation.custom?.tool ?? background.tool) ||
        choices.backgroundTool?.includes(id) ? 'your Background' : 'your Calling');
    }
  }
  if (choice.key === 'backgroundSkills') {
    for (const id of creation.custom?.skills ?? background.skills) {
      if (!choice.requiredOptions?.includes(id)) add(id, 'your Calling');
    }
  }
  return unavailable;
}

export function trainingPrompt(choice, rules, background, creation) {
  const skillName = id => rules.skills.find(skill => skill.id === id)?.name ?? id;
  if (choice.key === 'backgroundSkills') {
    const conflicts = (creation.custom?.skills ?? background.skills)
      .filter(id => !choice.requiredOptions?.includes(id));
    return 'Your Calling already grants ' + conflicts.map(skillName).join(' and ') +
      '. Choose ' + (conflicts.length === 1 ? 'another skill' : 'two other skills') +
      ' for ' + background.name + '.';
  }
  if (choice.key === 'backgroundTool') {
    return 'Your Calling already grants your Background tool. Choose another tool.';
  }
  if (choice.key === 'featTraining') return 'Choose three new skills or tools for Skilled.';
  if (choice.key === 'skills') return 'Choose the skills you learned from your Calling.';
}

export function lineageTraining(fields, values, rules, summary, background, creation, choices) {
  const backgroundFeat = creation.custom?.feat ?? background.feat;
  const backgroundSkills = creation.custom?.skills ?? background.skills;
  const backgroundTool = creation.custom?.tool ?? background.tool;
  const ownFeat = summary?.lineage?.originFeat;
  const ownTraining = ownFeat?.options?.training ?? [];
  const skills = (summary?.training ?? []).filter(id =>
    !summary?.lineage?.trainedSkills?.includes(id) && !ownTraining.includes('skill:' + id));
  const tools = (summary?.equipmentTraining?.tools ?? []).filter(id => !ownTraining.includes('tool:' + id));
  const skillSource = id => choices.skills?.includes(id) ? 'your Calling'
    : backgroundSkills.includes(id) || choices.backgroundSkills?.includes(id) ? 'your Background'
    : choices.featTraining?.includes('skill:' + id) ? 'your Background feat'
    : 'another starting feature';
  const toolSource = id => choices.featTraining?.includes('tool:' + id) ? 'your Background feat'
    : backgroundTool === id || choices.backgroundTool?.includes(id) ? 'your Background'
    : 'your Calling';
  const feat = values.originFeat;
  const nested = lineageFeatFields(feat ?? {}, rules).map(field => ({ ...field, nested: true }));
  return [...fields, ...nested].map(field => {
    const { key, nested } = field;
    const value = nested ? feat.options?.[key] : key === 'originFeat' ? feat?.id : values[key];
    const entries = field.options.map(option => {
      const id = option.id;
      let source;
      if (key === 'skill' || key === 'skills') source = skills.includes(id) && skillSource(id);
      if (key === 'originFeat') source = id === backgroundFeat && !option.repeatable && 'your Background';
      if (key === 'list') source = id === (choices.initiateList?.[0] ?? background.list) && 'your Background feat';
      if (key === 'training') {
        const [kind, permission] = id.split(':');
        source = kind === 'skill'
          ? (values.skill === permission || values.skills?.includes(permission)) ? 'your Lineage'
            : skills.includes(permission) && skillSource(permission)
          : tools.includes(permission) && toolSource(permission);
      }
      return { ...option, unavailable: source ? 'Already granted by ' + source + '.' : undefined };
    });
    const previous = Array.isArray(value) ? value : value === undefined ? [] : [value];
    const selected = previous.filter(id => entries.some(entry => entry.id === id && !entry.unavailable));
    return {
      ...field, entries, selected, complete: selected.length === field.count && new Set(selected).size === field.count,
      invalid: previous.length !== selected.length,
    };
  });
}

export function lineageTrainingErrorKey(path) {
  const prefix = 'creation.lineage.choices.';
  if (!path?.startsWith(prefix)) return null;
  const [choice, part, option] = path.slice(prefix.length).split('.');
  if (choice === 'originFeat' && part === 'options') return option ?? 'originFeat';
  return ['skill', 'skills', 'originFeat'].includes(choice) ? choice : null;
}
