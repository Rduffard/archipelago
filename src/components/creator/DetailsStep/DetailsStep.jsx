import {
  RESOURCE_FIELDS,
  titleCase,
  WOUND_SEVERITY_OPTIONS,
  WOUND_STAT_PENALTY_OPTIONS,
} from './detailsStepHelpers'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import {
  CreatorField,
  CreatorInput,
  CreatorLabel,
  CreatorSectionHeader,
  CreatorSelect,
  CreatorTextarea,
} from '../shared/CreatorForm/CreatorForm'
import CreatorRecordCardHeader from '../shared/CreatorRecordCardHeader/CreatorRecordCardHeader'
import '../shared/CreatorChoiceStyles/CreatorChoiceStyles.css'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import './DetailsStep.css'

function BackgroundFields({ details, onDetailsChange }) {
  return (
    <>
      <div className="creator-grid">
        <CreatorField>
          <CreatorLabel htmlFor="character-past-role">Past Role</CreatorLabel>
          <CreatorInput
            id="character-past-role"
            name="pastRole"
            type="text"
            placeholder="Smuggler, quartermaster, shrine diver..."
            value={details.pastRole}
            onChange={(event) => onDetailsChange('pastRole', event.target.value)}
          />
        </CreatorField>

        <CreatorField>
          <CreatorLabel htmlFor="character-defining-event">Defining Event</CreatorLabel>
          <CreatorInput
            id="character-defining-event"
            name="definingEvent"
            type="text"
            placeholder="The storm, the mutiny, the exile..."
            value={details.definingEvent}
            onChange={(event) => onDetailsChange('definingEvent', event.target.value)}
          />
        </CreatorField>
      </div>

      <CreatorField className="creator-field--wide">
        <CreatorLabel htmlFor="character-traits">Custom Traits</CreatorLabel>
        <CreatorTextarea
          id="character-traits"
          name="traits"
          rows="5"
          placeholder={'One per line. Use "Label | mechanical impact" when you want extra detail.'}
          value={details.customTraitsText}
          onChange={(event) => onDetailsChange('customTraitsText', event.target.value)}
        />
      </CreatorField>

      <CreatorField className="creator-field--wide">
        <CreatorLabel htmlFor="character-notes">Notes</CreatorLabel>
        <CreatorTextarea
          id="character-notes"
          name="notes"
          rows="5"
          placeholder="Hooks, scars, rumors, obligations, or campaign-facing notes."
          value={details.notes}
          onChange={(event) => onDetailsChange('notes', event.target.value)}
        />
      </CreatorField>
    </>
  )
}

function ResourceTrackFields({ onResourceChange, resourceMaximums, resources }) {
  return (
    <div className="creator-grid creator-grid--resources">
      {RESOURCE_FIELDS.map(([key, label]) => (
        <CreatorField key={key}>
          <CreatorLabel htmlFor={`resource-${key}`}>
            {label} Current
            {resourceMaximums[key] !== undefined ? ` / ${resourceMaximums[key]}` : ''}
          </CreatorLabel>
          <CreatorInput
            id={`resource-${key}`}
            name={key}
            type="number"
            min="0"
            max={resourceMaximums[key] ?? undefined}
            value={resources[key]}
            onChange={(event) => onResourceChange(key, event.target.value)}
          />
        </CreatorField>
      ))}
    </div>
  )
}

function WoundCard({ index, onRemoveWound, onWoundChange, wound }) {
  return (
    <article className="review-card">
      <CreatorRecordCardHeader
        title={wound.name || `Wound ${index + 1}`}
        meta={titleCase(wound.severity)}
        onRemove={() => onRemoveWound(index)}
      />

      <div className="creator-grid">
        <CreatorField>
          <CreatorLabel htmlFor={`wound-name-${index}`}>Name</CreatorLabel>
          <CreatorInput
            id={`wound-name-${index}`}
            type="text"
            value={wound.name}
            onChange={(event) => onWoundChange(index, 'name', event.target.value)}
          />
        </CreatorField>

        <CreatorField>
          <CreatorLabel htmlFor={`wound-severity-${index}`}>Severity</CreatorLabel>
          <CreatorSelect
            id={`wound-severity-${index}`}
            value={wound.severity}
            onChange={(event) => onWoundChange(index, 'severity', event.target.value)}
          >
            {WOUND_SEVERITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </CreatorSelect>
        </CreatorField>

        <CreatorField>
          <CreatorLabel htmlFor={`wound-penalty-${index}`}>Stat Penalty</CreatorLabel>
          <CreatorSelect
            id={`wound-penalty-${index}`}
            value={wound.statPenalty}
            onChange={(event) => onWoundChange(index, 'statPenalty', event.target.value)}
          >
            {WOUND_STAT_PENALTY_OPTIONS.map((option) => (
              <option key={option || 'none'} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </CreatorSelect>
        </CreatorField>
      </div>

      <CreatorField className="creator-field--wide">
        <CreatorLabel htmlFor={`wound-description-${index}`}>Description</CreatorLabel>
        <CreatorTextarea
          id={`wound-description-${index}`}
          rows="4"
          value={wound.description}
          onChange={(event) => onWoundChange(index, 'description', event.target.value)}
        />
      </CreatorField>
    </article>
  )
}

function DetailsStep({
  details,
  resources,
  resourceMaximums,
  wounds,
  onDetailsChange,
  onResourceChange,
  onWoundChange,
  onAddWound,
  onRemoveWound,
}) {
  return (
    <CreatorStepFrame
      step="Step 6"
      title="Shape the deeper record"
      description="Give the sheet a little lived-in history and set the starting state of the character's active resource tracks."
    >

      <BackgroundFields details={details} onDetailsChange={onDetailsChange} />

      <div className="choice-group">
        <CreatorSectionHeader
          title="Starting Tracks"
          description="These values feed the saved character sheet directly and can start below the maximum."
        />

        <ResourceTrackFields
          onResourceChange={onResourceChange}
          resourceMaximums={resourceMaximums}
          resources={resources}
        />
      </div>

      <div className="choice-group">
        <CreatorSectionHeader
          title="Active Wounds"
          description="Record any injuries or lingering harm that should already be on the sheet at session start."
          action={
            <button type="button" className="creator-inline-back" onClick={onAddWound}>
              Add Wound
            </button>
          }
        />

        {wounds.length ? (
          <div className="creator-stack creator-stack--cards">
            {wounds.map((wound, index) => (
              <WoundCard
                key={`wound-${index}`}
                index={index}
                onRemoveWound={onRemoveWound}
                onWoundChange={onWoundChange}
                wound={wound}
              />
            ))}
          </div>
        ) : (
          <p className="review-card__empty">No active wounds recorded yet.</p>
        )}
      </div>
    </CreatorStepFrame>
  )
}

export default DetailsStep
