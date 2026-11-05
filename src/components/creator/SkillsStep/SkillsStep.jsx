import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
function SkillsStep({ trainingOptions, training, onTrainingToggle, historical }) {
  return <CreatorStepFrame step="Step 4" title="Choose your Training" description="Choose exactly four proficiencies. The GM chooses the attribute for each check; relevant Training adds proficiency once.">
    <p role="status" aria-live="polite">{training.length} / 4 selected</p>
    {historical ? <p>Historical Specialty ownership is preserved separately. It does not grant Training. Leave unchanged or explicitly select four proficiencies.</p> : null}
    <div className="review-grid">{trainingOptions.map((option) => <label className="review-card" key={option.id}>
      <input type="checkbox" checked={training.includes(option.id)} disabled={training.length >= 4 && !training.includes(option.id)} onChange={() => onTrainingToggle(option.id)} />
      <strong>{option.name}</strong><p>{option.description}</p>
    </label>)}</div>
  </CreatorStepFrame>
}
export default SkillsStep
