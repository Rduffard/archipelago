import { useState } from 'react'
import { SectionCard, SectionCardHeader } from '../../../components/ui/SectionCard/SectionCard'
import { trainingCheckModifier, proficiencyBonus } from '../../../lib/training.js'
import { ATTRIBUTE_KEYS } from '../characterSheetHelpers'
import './CharacterSheetSkills.css'

function CharacterSheetSkills({ character, trainingOptions }) {
  const [attribute, setAttribute] = useState('might')
  const [trainingId, setTrainingId] = useState('')
  const owned = character.training ?? []
  const level = character.progression?.rank ?? 1
  let modifier = null, bonus = null
  try {
    modifier = trainingCheckModifier(character.attributes, attribute, level, owned, trainingId)
    bonus = proficiencyBonus(level)
  } catch { /* Invalid historical scores remain unavailable. */ }
  const trained = Boolean(trainingId && owned.includes(trainingId))
  return <SectionCard className="character-sheet__panel character-sheet__panel--wide">
    <SectionCardHeader title="Training & Checks" description="The GM chooses the attribute and whether relevant Training applies." />
    {character.training === undefined ? <p>Training unavailable: historical Specialty ownership has not been converted.</p> :
      <ul>{owned.map((id) => { const option = trainingOptions.find((entry) => entry.id === id); return <li key={id}><strong>{option?.name ?? id}</strong> — {option?.description}</li> })}</ul>}
    <label>GM-selected attribute <select value={attribute} onChange={(event) => setAttribute(event.target.value)}>
      {ATTRIBUTE_KEYS.map((key) => <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>)}
    </select></label>
    <label>Relevant Training <select value={trainingId} onChange={(event) => setTrainingId(event.target.value)}>
      <option value="">None applies (untrained)</option>
      {trainingOptions.map((option) => <option key={option.id} value={option.id}>{option.name}{owned.includes(option.id) ? ' — trained' : ' — untrained'}</option>)}
    </select></label>
    <p role="status">{modifier === null ? 'Check unavailable: attribute or level unavailable.' : `Roll d20 ${modifier >= 0 ? '+' : '−'} ${Math.abs(modifier)}. ${trained ? `Includes proficiency +${bonus} once.` : 'No proficiency added.'}`}</p>
  </SectionCard>
}
export default CharacterSheetSkills
