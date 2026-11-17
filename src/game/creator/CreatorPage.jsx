import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCharacterRules } from '../../lib/api';
import { GameButton, GamePanel, GameStatus, SelectionCard, Tooltip } from '../ui/GameUI';
import CharacterPreview from '../scene/CharacterPreview';
import { defaultAppearance } from '../scene/appearance';
import { hasLineageChoices, lineageFields } from './lineageChoices';

const steps = ['Identity', 'Lineage', 'Origin', 'Background', 'Calling', 'Attributes',
  'Training', 'Abilities and feats', 'Equipment', 'Spells', 'Review'];

function LineageField({ field, value, onChange }) {
  const { label, count, options } = field;
  if (count === 1) return <label className="sa-field">
    {label}
    <select value={value ?? ''} onChange={event => onChange(event.target.value)}>
      <option value="">Choose {label.toLowerCase()}</option>
      {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
    </select>
  </label>;
  const selected = value ?? [];
  return <fieldset className="sa-field">
    <legend>{label} ({count} choices)</legend>
    {options.map(option => <label key={option.id}>
      <input type="checkbox" checked={selected.includes(option.id)}
        disabled={selected.length >= count && !selected.includes(option.id)}
        onChange={event => onChange(event.target.checked
          ? [...selected, option.id] : selected.filter(id => id !== option.id))} />
      {option.name}
    </label>)}
  </fieldset>;
}

export default function CreatorPage() {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState({ rules: null, error: '' });
  const [attempt, setAttempt] = useState(0);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [draft, setDraft] = useState({ name: '', lineageId: '', lineageChoices: {} });
  const [validation, setValidation] = useState('');
  const heading = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getCharacterRules(token, controller.signal).then(rules => {
      if (!controller.signal.aborted) setCatalog({ rules, error: '' });
    }).catch(error => {
      if (!controller.signal.aborted) setCatalog({ rules: null, error: error.message });
    });
    return () => controller.abort();
  }, [token, attempt]);

  const { rules, error } = catalog;
  const lineages = rules?.creation?.lineages;
  const lineage = lineages?.find(entry => entry.id === draft.lineageId);
  const fields = lineage ? lineageFields(lineage, rules) : [];

  function go(next) {
    setValidation('');
    setStep(next);
    setFurthest(value => Math.max(value, next));
    heading.current.focus();
  }

  function advance(next = step + 1) {
    if (!draft.name.trim()) {
      if (step !== 0) go(0);
      setValidation('Enter a character name to continue.');
      return;
    }
    if (next > 1 && (!lineage || !hasLineageChoices(fields, draft.lineageChoices))) {
      if (step !== 1) go(1);
      setValidation('Choose a Lineage and complete its starting choices.');
      return;
    }
    go(next);
  }

  return <main className="sa-creator">
    <header className="sa-creator__header">
      <div><h1>Character Creator</h1><p>In development · Drafts stay on this screen.</p></div>
      <GameButton to="/characters/new">Open current creator</GameButton>
    </header>
    <nav aria-label="Character creation steps">
      <ol className="sa-steps">
        {steps.map((label, index) => <li key={label}>
          <GameButton disabled={index > furthest} aria-current={step === index ? 'step' : undefined}
            onClick={() => index <= step ? go(index) : advance(index)}>{label}</GameButton>
        </li>)}
      </ol>
    </nav>
    <div className="sa-creator__body">
      <GamePanel>
        <h2 ref={heading} tabIndex={-1}>{steps[step]}</h2>
        {step === 0 && <label className="sa-field">
          Character name
          <input value={draft.name} maxLength={100} onChange={event => {
            setDraft({ ...draft, name: event.target.value });
            setValidation('');
          }} />
        </label>}
        {step === 1 && <>
          <p>Lineage describes your character’s inherited traits. Origin describes where they come from, and Calling describes what they do.</p>
          {error && <>
            <GameStatus error>{error}</GameStatus>
            <GameButton onClick={() => { setCatalog({ rules: null, error: '' }); setAttempt(value => value + 1); }}>
              Retry catalog
            </GameButton>
          </>}
          {!error && !rules && <GameStatus>Loading Lineages…</GameStatus>}
          {rules && !lineages?.length && <GameStatus error>This server’s catalog has no Lineages.</GameStatus>}
          {!!lineages?.length && <fieldset className="sa-lineages">
            <legend>Choose a Lineage</legend>
            {lineages.map(entry => <SelectionCard key={entry.id} name="lineage" value={entry.id}
              title={entry.name} description={entry.description} selected={entry.id === draft.lineageId}
              onChange={() => { setDraft({ ...draft, lineageId: entry.id, lineageChoices: {} }); setValidation(''); }} />)}
          </fieldset>}
          {lineage && <div className="sa-lineage-details">
            <h3>{lineage.name} traits</h3>
            <ul>{lineage.traits.map(trait => <li key={trait.id}>{trait.name}</li>)}</ul>
            <p>{Object.entries(lineage.movement).map(([mode, speed]) => `${mode} ${speed} ft`).join(' · ')}
              {lineage.darkvision ? ` · Darkvision ${lineage.darkvision} ft` : ''}</p>
            {fields.map(field => <LineageField key={field.key} field={field}
              value={draft.lineageChoices[field.key]} onChange={value => {
                setDraft({ ...draft, lineageChoices: { ...draft.lineageChoices, [field.key]: value } });
                setValidation('');
              }} />)}
            {lineage.choices?.originFeat && <p>Origin feat options will be configured in Abilities and feats.</p>}
          </div>}
        </>}
        {step === 2 && <p>Origin and the steps that follow are still in development. Use the current creator to save a playable character.</p>}
        {validation && <GameStatus error>{validation}</GameStatus>}
        <footer className="sa-actions">
          <GameButton disabled={step === 0} onClick={() => go(step - 1)}>Back</GameButton>
          {step < 2 && <GameButton onClick={() => advance()}>Next</GameButton>}
          {step === 2 && <GameButton to="/characters/new">Open current creator</GameButton>}
        </footer>
      </GamePanel>
      <aside className="sa-creator__aside">
        <CharacterPreview name={draft.name} appearance={{ ...defaultAppearance, lineageId: draft.lineageId || null }} />
        {lineage && <GamePanel title="Draft">
          <p>{lineage.name}</p>
          <Tooltip id="draft-tip" text="The preview uses placeholder geometry. Your Lineage choices are held locally in this draft.">About this preview</Tooltip>
        </GamePanel>}
      </aside>
    </div>
  </main>;
}
