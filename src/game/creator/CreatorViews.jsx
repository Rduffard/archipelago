import { RuleDetails } from '../ui/RuleDetails';
import { choiceTitle, displayName, equipmentQuantities } from './choiceLabels';
import { originGroups } from './originGroups';
import { SelectionCard } from '../ui/GameUI';
import { attributeNames } from '../../pages/Rules2024/labels';

export function CatalogCards({ label, entries, value, onChange, describe }) {
  return <fieldset className="sa-lineages">
    <legend>{label}</legend>
    {entries.map(entry => <SelectionCard key={entry.id} name={label} value={entry.id}
      title={entry.name} description={describe?.(entry)} selected={entry.id === value}
      onChange={() => onChange(entry.id)} />)}
  </fieldset>;
}

export function FeatureCards({ calling, future = false }) {
  const rows = future ? calling.progression.slice(1) : calling.progression.slice(0, 1);
  const features = row => row.features.map((feature, index) =>
    <RuleDetails key={index} title={feature.rules[0]?.name ?? feature.name}>
      {feature.rules.map((rule, ruleIndex) => <p key={ruleIndex}>{rule.description}</p>)}
    </RuleDetails>);
  return <div className="sa-feature-list">{rows.filter(row => row.features.length).map(row =>
    future ? <details key={row.callingLevel}>
      <summary>Level {row.callingLevel}</summary>
      <div className="sa-feature-list">{features(row)}</div>
    </details> : <div key={row.callingLevel} className="sa-feature-list">{features(row)}</div>
  )}</div>;
}

export function CallingPaths({ calling, rules }) {
  return <div className="sa-feature-list">
    <h3>Paths · Level 3</h3>
    {rules.paths.filter(path => path.callingId === calling.id).map(path => <details key={path.id}>
      <summary>{path.name}</summary>
      <p>{path.description}</p>
    </details>)}
  </div>;
}

export function CreatorReview({ summary, rules, identity, calling, choices, spellKeys }) {
  const spellNames = ids => ids.map(id => rules.spells.find(spell => spell.id === id)?.name ?? id).join(', ');
  return <>
    {identity.pronouns && <p>{identity.pronouns}</p>}
    {identity.appearance && <p>{identity.appearance}</p>}
    <dl className="sa-review">
      {Object.entries(attributeNames).map(([id, name]) => <div key={id}>
        <dt>{name}</dt><dd>{summary.attributes[id]}</dd>
      </div>)}
      <div><dt>Training</dt><dd>{summary.training.map(id => rules.skills.find(skill => skill.id === id)?.name ?? id).join(', ')}</dd></div>
      <div><dt>Feats</dt><dd>{summary.feats.map(id => rules.feats.find(feat => feat.id === id)?.name ?? id).join(', ')}</dd></div>
      <div><dt>Calling features</dt><dd><FeatureCards calling={calling} /></dd></div>
      {Object.entries(choices).filter(([key]) => spellKeys.includes(key)).map(([key, ids]) =>
        <div key={key}><dt>{choiceTitle(key)}</dt><dd>{spellNames(ids)}</dd></div>)}
    </dl>
  </>;
}

export function EquipmentList({ items }) {
  const lines = equipmentQuantities(items, item => item.name);
  return <ul className="sa-quantity-list">{lines.map(({ name, quantity }) =>
    <li key={name}><span>{name}</span><strong>×{quantity}</strong></li>)}</ul>;
}

export function OriginCards({ origins, group, origin, onGroup, onIsland }) {
  const { entries, islands } = originGroups(origins);
  return <>
    <p>Your Origin is your homeland. Your Background describes your life before taking up a Calling.</p>
    <CatalogCards label="Homeland" entries={entries} value={group}
      onChange={id => onGroup(id, id === 'archipelago' ? '' : id)} describe={entry => entry.summary} />
    {group === 'archipelago' && <CatalogCards label="Island" entries={islands} value={origin?.id}
      onChange={onIsland} describe={entry => entry.summary} />}
  </>;
}

export function TrainingOverview({ rules, background, creation, choices, summary }) {
  const skillName = id => rules.skills.find(skill => skill.id === id)?.name ?? id;
  const backgroundSkills = creation.custom?.skills ?? background.skills;
  const grantedSkills = backgroundSkills.filter(id => !choices.skills?.includes(id));
  const replacements = choices.backgroundSkills?.filter(id => !grantedSkills.includes(id)) ?? [];
  const backgroundTool = creation.custom?.tool ?? background.tool;
  const grants = [...grantedSkills.map(skillName), ...(!choices.backgroundTool?.length && !choices.instrument?.length
    ? [displayName(backgroundTool)] : [])].filter(Boolean);
  return <div className="sa-training-overview">
    <p>Training adds {summary ? '+' + summary.trainingBonus : 'your Training Bonus'} to checks with that skill.
      Expertise adds the bonus twice.</p>
    <dl className="sa-review">
      {grants.length > 0 && <div><dt>Granted by Background</dt><dd>{grants.join(', ')}</dd></div>}
      {replacements.length > 0 && <div><dt>Chosen Background skill replacements</dt><dd>{replacements.map(skillName).join(', ')}</dd></div>}
      {choices.backgroundTool?.length > 0 && <div><dt>Chosen Background tool</dt><dd>{displayName(choices.backgroundTool[0])}</dd></div>}
      {choices.instrument?.length > 0 && <div><dt>Chosen instrument</dt><dd>{displayName(choices.instrument[0])}</dd></div>}
      <div><dt>Chosen for Calling</dt><dd>{choices.skills?.map(skillName).join(', ') || 'Choose below'}</dd></div>
      {choices.languages?.length > 0 && <div><dt>Chosen languages</dt><dd>{choices.languages.map(id => displayName(id, rules)).join(', ')}</dd></div>}
      {summary?.languages?.length > 0 && <div><dt>All languages</dt><dd>{summary.languages.map(id => displayName(id, rules)).join(', ')}</dd></div>}
      {choices.featTraining?.length > 0 && <div><dt>Chosen for Origin feat</dt><dd>{choices.featTraining.map(id => displayName(id.split(':').at(-1))).join(', ')}</dd></div>}
      {summary?.training?.length > 0 && <div><dt>Current Training</dt><dd>{summary.training.map(skillName).join(', ')}</dd></div>}
    </dl>
  </div>;
}

export function CheckCards({ label, count, entries, selected, onChange, describe, replaceSingle }) {
  return <fieldset className="sa-choice-grid">
    <legend>{label}</legend>
    {entries.map(entry => {
      const checked = selected.includes(entry.id);
      const description = describe?.(entry);
      if (entry.unavailable) return <div key={entry.id} className="sa-card sa-card--unavailable" tabIndex={0} aria-disabled="true">
        <span><strong>{entry.name}</strong><small>{entry.unavailable}</small></span>
      </div>;
      return <label key={entry.id} className="sa-card">
        <input type={replaceSingle && count === 1 ? 'radio' : 'checkbox'} name={replaceSingle && count === 1 ? label : undefined}
          checked={checked} disabled={!checked && selected.length >= count && !(replaceSingle && count === 1)}
          onChange={() => onChange(checked ? selected.filter(id => id !== entry.id) :
            replaceSingle && count === 1 ? [entry.id] : [...selected, entry.id])} />
        <span><strong>{entry.name}</strong>{description && <small>{description}</small>}</span>
      </label>;
    })}
    <p role="status">{selected.length} of {count} selected</p>
  </fieldset>;
}
