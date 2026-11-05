import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
function SkillsStep({ trainingOptions, training, onTrainingToggle, historical, startingPackage }) {
  return <CreatorStepFrame step="Step 4" title="Choose your Training" description="Choose exactly four proficiencies. The GM chooses the attribute for each check; relevant Training adds proficiency once.">
    {startingPackage ? <p>Calling recommendations: {startingPackage.skills.map(id => trainingOptions.find(e=>e.id===id)?.name ?? id).join(', ')}. Informational only. Select any four distinct General Skills yourself. Saving throws: {startingPackage.saves.join(', ')}.</p> : null}
    {training.filter(id=>!trainingOptions.some(option=>option.id===id)).map(id=><p key={id}>Legacy Training: {id}. <button type="button" onClick={()=>onTrainingToggle(id)}>Remove for explicit replacement</button></p>)}
    <p role="status" aria-live="polite">{training.length} / 4 selected</p>
    {historical ? <p>Legacy Training and Specialty ownership remain unchanged unless you explicitly replace the four Training selections. Retired selections are shown above.</p> : null}
    <div className="review-grid">{trainingOptions.map((option) => <label className="review-card" key={option.id}>
      <input type="checkbox" checked={training.includes(option.id)} disabled={training.length >= 4 && !training.includes(option.id)} onChange={() => onTrainingToggle(option.id)} />
      <strong>{option.name}</strong><p>{option.description}</p>
    </label>)}</div>
  </CreatorStepFrame>
}
export default SkillsStep
