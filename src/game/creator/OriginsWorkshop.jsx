import { useState } from 'react';
import { displayName } from './choiceLabels';
import { attributeNames } from '../../pages/Rules2024/labels';

const featPresentation = {
  alert: ['◈', 'Read the danger before it strikes.', 'Initiative bonus', 'Swap Initiative with an ally'],
  'magic-initiate': ['✧', 'Learn the fundamentals of spellcasting.', 'Two cantrips', 'One level-one spell', 'Free cast each Long Rest'],
  'savage-attacker': ['⚔', 'Make each weapon strike count.', 'Roll weapon damage twice', 'Choose either roll once per turn'],
  skilled: ['⚒', 'Expand your practical expertise.', 'Three skill or tool choices', 'Repeatable'],
};

const backgroundIdentity = {
  deckhand: 'Life aboard ship',
  'dock-artisan': 'Trade and craft on the waterfront',
  'archive-apprentice': 'Study and scholarship',
  'field-medic': 'Care under pressure',
  'free-agent': 'Work beyond the harbor watch',
  'oath-witness': 'Ritual and diplomacy',
  custom: 'Build your own background',
};

export function FeatInspector({ feat }) {
  if (!feat) return null;
  const [sigil, identity, ...benefits] = featPresentation[feat.id] ?? ['◇'];
  return <article className="sa-origin-inspector" aria-label={feat.name + ' rules'}>
    <header><span className="sa-origin-sigil" aria-hidden="true">{sigil}</span>
      <div><h3>{feat.name}</h3>{identity && <p>{identity}</p>}</div>
    </header>
    {benefits.length > 0 && <ul className="sa-benefit-tags">{benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>}
    <p className="sa-feat-rules">{feat.description.replace(/^Origin Feat\s+/, '')}</p>
  </article>;
}

export function FeatWorkshop({ entries, value, onChange }) {
  const [inspected, setInspected] = useState(value);
  const feat = entries.find(entry => entry.id === inspected) ??
    entries.find(entry => entry.id === value) ?? entries[0];
  return <section className="sa-origin-workshop" aria-label="Origin feat">
    <div className="sa-origin-options" aria-label="Inspect Origin feats" role="group">
      {entries.map(entry => {
        const [sigil, identity, benefit] = featPresentation[entry.id] ?? ['◇'];
        return <button key={entry.id} type="button" className="sa-origin-option" aria-pressed={feat?.id === entry.id}
          onClick={() => setInspected(entry.id)}>
          <span className="sa-origin-sigil" aria-hidden="true">{sigil}</span>
          <span><strong>{entry.name}</strong><small>{identity}</small><small>{benefit}</small>
            {entry.id === value && <small className="sa-origin-status">Selected</small>}
          </span>
        </button>;
      })}
    </div>
    {feat && <div>
      <FeatInspector feat={feat} />
      <div className="sa-feat-select">
        {feat.unavailable ? <p>{feat.unavailable}</p> :
          <button type="button" className="sa-button" disabled={feat.id === value}
            onClick={() => onChange(feat.id)}>{feat.id === value ? feat.name + ' selected' : 'Choose ' + feat.name}</button>}
      </div>
    </div>}
  </section>;
}

export function BackgroundWorkshop({ rules, background, creation, onChange }) {
  const details = creation.custom ?? background;
  const feat = rules.feats.find(entry => entry.id === details.feat);
  const skillNames = details.skills.map(id => rules.skills.find(skill => skill.id === id)?.name ?? displayName(id));
  return <section className="sa-origin-workshop" aria-label="Background">
    <fieldset className="sa-origin-options">
      <legend>Life before your Calling</legend>
      {rules.creation.backgrounds.map(entry => <label key={entry.id} className="sa-origin-option">
        <input type="radio" name="background" value={entry.id} checked={entry.id === background.id}
          onChange={() => onChange(entry.id)} />
        <span className="sa-origin-sigil" aria-hidden="true">{featPresentation[entry.feat]?.[0] ?? '◇'}</span>
        <span><strong>{entry.name}</strong><small>{backgroundIdentity[entry.id]}</small></span>
      </label>)}
    </fieldset>
    <article className="sa-origin-inspector" aria-label={background.name + ' benefits'}>
      <h3>{background.name}</h3>
      <dl className="sa-background-benefits">
        <div><dt>Skill Training</dt><dd>{skillNames.join(' · ') || 'Choose two skills below'}</dd></div>
        <div><dt>Tool Training</dt><dd>{details.tool ? displayName(details.tool, rules) : 'Choose a tool below'}</dd></div>
        <div><dt>Origin feat</dt><dd>{feat?.name ?? 'Choose a feat below'}
          {feat && <small>{featPresentation[feat.id]?.[2]}</small>}</dd></div>
        <div><dt>Attribute bonuses</dt><dd>{Object.entries(creation.increases).map(([id, count]) =>
          '+' + count + ' ' + attributeNames[id]).join(' · ')}</dd></div>
      </dl>
      {feat && <details><summary>{feat.name} rules</summary>
        <p>{feat.description.replace(/^Origin Feat\s+/, '')}</p>
      </details>}
    </article>
  </section>;
}
