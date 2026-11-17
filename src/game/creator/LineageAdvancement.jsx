import { useState } from 'react';

export default function LineageAdvancement({ options, rules, onChange }) {
  const [learnFormId, setLearnFormId] = useState('');
  const [fromFormId, setFromFormId] = useState('');
  const [toFormId, setToFormId] = useState('');
  const label = id => rules.creation.beastshifterForms.find(form => form.id === id)?.name ?? id;
  const option = id => <option key={id} value={id}>{label(id)}</option>;
  const replacementIds = options.eligibleFormIds.filter(id => id !== learnFormId);

  return <fieldset>
    <legend>Beastshifter animal forms</legend>
    <label>Learn an animal form <select value={learnFormId} onChange={event => {
      setLearnFormId(event.target.value);
      if (event.target.value === toFormId) setToFormId('');
    }}>
      <option value="">Choose a form</option>
      {options.eligibleFormIds.map(option)}
    </select></label>
    {options.canReplace && <label>Replace a known form <select value={fromFormId}
      onChange={event => setFromFormId(event.target.value)}>
      <option value="">Keep all known forms</option>
      {options.replaceableFormIds.map(option)}
    </select></label>}
    {fromFormId && <label>Replacement form <select value={toFormId} onChange={event => setToFormId(event.target.value)}>
      <option value="">Choose a replacement</option>
      {replacementIds.map(option)}
    </select></label>}
    <button type="button" disabled={!learnFormId || Boolean(fromFormId && !toFormId)} onClick={() => onChange({
      learnFormId, ...(fromFormId && { replaceForm: { fromFormId, toFormId } }),
    })}>Confirm animal forms</button>
  </fieldset>;
}
