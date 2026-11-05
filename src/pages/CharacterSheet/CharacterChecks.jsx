import { useState } from 'react'
import { createRoll, rollAttributes, rollTone, signed, skillIsTrained, skillAttributes, appendRollHistory } from '../../lib/roll.js'
import { calculateCheckModifier } from '../../lib/checkModifier.js'
import { proficiencyBonus } from '../../lib/training.js'
import './CharacterChecks.css'

export function RollResult({ roll }) {
  return <span className={`sheet-roll sheet-roll--${rollTone(roll.natural)}`}>
    <strong>{roll.name} · {roll.type === 'save' ? 'Saving throw' : roll.type === 'skill' ? 'Skill check' : 'Attribute check'}: {roll.total}</strong>
    {' '}<span>d20 {roll.natural} · {roll.attribute} {signed(roll.modifier)}{roll.proficiency ? ` · proficiency ${signed(roll.proficiency)}` : ''}</span>
    {roll.natural === 20 || roll.natural === 1 ? <small> Natural {roll.natural}</small> : null}
  </span>
}

export default function CharacterChecks({ character, skills = [], legacyOptions = [] }) {
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  let bonus = 'Unavailable'
  try { bonus = signed(proficiencyBonus(character.progression?.rank)) } catch { /* Preserve invalid legacy levels. */ }
  const legacy = character.trainingRulesVersion !== 1 ? character.training ?? [] : (character.training ?? []).filter(id => !skills.some(skill => skill.id === id))
  function roll(type, name, attribute, skillId) {
    try {
      const result = createRoll({ character, type, name, attribute, skillId })
      setHistory(current => appendRollHistory(current, result))
      setError('')
    } catch (err) { setError(err.message) }
  }
  return <section className="character-sheet__panel character-sheet__panel--wide sheet-checks" aria-label="Character checks">
    <header><h2>Attributes & Saving Throws</h2><span>Proficiency {bonus}</span></header>
    <div className="sheet-checks__attributes">{rollAttributes.map(attribute => {
      let modifier = null
      try { modifier = calculateCheckModifier(character.attributes, attribute) } catch { /* Missing scores are not zero. */ }
      const proficient = character.advancement?.savingThrows?.includes(attribute)
      return <div key={attribute}>
        <button type="button" disabled={modifier === null} onClick={() => roll('attribute', attribute, attribute)} aria-label={`Roll ${attribute} attribute check`}>
          <span>{attribute}</span> <strong>{character.attributes?.[attribute] ?? '—'}</strong> <span className="sheet-checks__modifier">{modifier === null ? '—' : signed(modifier)}</span>
        </button>
        <button type="button" disabled={modifier === null || (proficient && bonus === 'Unavailable')} onClick={() => roll('save', attribute, attribute)} aria-label={`Roll ${attribute} saving throw`}>
          Save {modifier === null || (proficient && bonus === 'Unavailable') ? '—' : signed(modifier + (proficient ? proficiencyBonus(character.progression?.rank) : 0))}{proficient ? ' · proficient' : ''}
        </button>
      </div>
    })}</div>
    {!character.advancement?.savingThrows ? <p>Saving-throw proficiencies are unrecorded; no proficiency is added.</p> : null}
    <h3>General Skills</h3>
    <div className="sheet-checks__skills">{skills.map(skill => {
      const attribute = skillAttributes[skill.id]
      const trained = skillIsTrained(character, skill.id)
      let modifier = null
      try { modifier = calculateCheckModifier(character.attributes, attribute) + (trained ? proficiencyBonus(character.progression?.rank) : 0) } catch { /* Unavailable saved score or level. */ }
      return <button type="button" className={trained ? 'is-trained' : undefined} key={skill.id} disabled={modifier === null} onClick={() => roll('skill', skill.name, undefined, skill.id)} title={skill.description} aria-label={'Roll ' + skill.name + ' skill check'}>
        <span>{skill.name}<small>{attribute}</small></span><strong>{modifier === null ? '—' : signed(modifier)}</strong>
      </button>
    })}</div>
    {legacy.length ? <aside><h3>Unresolved legacy Training</h3><p>Preserved selections; no General Skill proficiency inferred.</p><ul>{legacy.map(id => <li key={id}>{legacyOptions.find(option => option.id === id)?.name ?? id}</li>)}</ul></aside> : null}
    {character.training === undefined ? <p>Training unavailable: historical selections have not been converted.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    <div role="status" aria-live="polite" aria-atomic="true">{history[0] ? <RollResult roll={history[0]} /> : 'Select an attribute, saving throw, or skill to roll.'}</div>
    {history.length > 1 ? <details><summary>Earlier rolls ({history.length - 1})</summary><ol>{history.slice(1).map((result, index) => <li key={index}><RollResult roll={result} /></li>)}</ol></details> : null}
    <small>Natural 1 and 20 are highlighted; no automatic success or failure applies. Rolls last only for this sheet session.</small>
  </section>
}
