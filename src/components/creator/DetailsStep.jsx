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
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 6</p>
        <h2>Shape the deeper record</h2>
        <p>
          Give the sheet a little lived-in history and set the starting state of the character&apos;s
          active resource tracks.
        </p>
      </div>

      <div className="creator-grid">
        <div className="creator-field">
          <label htmlFor="character-past-role">Past Role</label>
          <input
            id="character-past-role"
            name="pastRole"
            type="text"
            placeholder="Smuggler, quartermaster, shrine diver..."
            value={details.pastRole}
            onChange={(event) => onDetailsChange('pastRole', event.target.value)}
          />
        </div>

        <div className="creator-field">
          <label htmlFor="character-defining-event">Defining Event</label>
          <input
            id="character-defining-event"
            name="definingEvent"
            type="text"
            placeholder="The storm, the mutiny, the exile..."
            value={details.definingEvent}
            onChange={(event) => onDetailsChange('definingEvent', event.target.value)}
          />
        </div>
      </div>

      <div className="creator-field creator-field--wide">
        <label htmlFor="character-traits">Custom Traits</label>
        <textarea
          id="character-traits"
          name="traits"
          rows="5"
          placeholder={'One per line. Use "Label | mechanical impact" when you want extra detail.'}
          value={details.customTraitsText}
          onChange={(event) => onDetailsChange('customTraitsText', event.target.value)}
        />
      </div>

      <div className="creator-field creator-field--wide">
        <label htmlFor="character-notes">Notes</label>
        <textarea
          id="character-notes"
          name="notes"
          rows="5"
          placeholder="Hooks, scars, rumors, obligations, or campaign-facing notes."
          value={details.notes}
          onChange={(event) => onDetailsChange('notes', event.target.value)}
        />
      </div>

      <div className="choice-group">
        <div className="choice-group__header">
          <h3>Starting Tracks</h3>
          <p>These values feed the saved character sheet directly and can start below the maximum.</p>
        </div>

        <div className="creator-grid creator-grid--resources">
          {[
            ['health', 'Health'],
            ['stamina', 'Stamina'],
            ['focus', 'Focus'],
            ['corruption', 'Corruption'],
            ['wounds', 'Wounds'],
          ].map(([key, label]) => (
            <div key={key} className="creator-field">
              <label htmlFor={`resource-${key}`}>
                {label} Current
                {resourceMaximums[key] !== undefined ? ` / ${resourceMaximums[key]}` : ''}
              </label>
              <input
                id={`resource-${key}`}
                name={key}
                type="number"
                min="0"
                max={resourceMaximums[key] ?? undefined}
                value={resources[key]}
                onChange={(event) => onResourceChange(key, event.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="choice-group">
        <div className="choice-group__header choice-group__header--split">
          <div>
            <h3>Active Wounds</h3>
            <p>Record any injuries or lingering harm that should already be on the sheet at session start.</p>
          </div>
          <button type="button" className="creator-inline-back" onClick={onAddWound}>
            Add Wound
          </button>
        </div>

        {wounds.length ? (
          <div className="creator-stack creator-stack--cards">
            {wounds.map((wound, index) => (
              <article key={`wound-${index}`} className="review-card">
                <div className="choice-group__header choice-group__header--split">
                  <div>
                    <h3>{wound.name || `Wound ${index + 1}`}</h3>
                    <p>{wound.severity}</p>
                  </div>
                  <button
                    type="button"
                    className="creator-inline-back"
                    onClick={() => onRemoveWound(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="creator-grid">
                  <div className="creator-field">
                    <label htmlFor={`wound-name-${index}`}>Name</label>
                    <input
                      id={`wound-name-${index}`}
                      type="text"
                      value={wound.name}
                      onChange={(event) => onWoundChange(index, 'name', event.target.value)}
                    />
                  </div>

                  <div className="creator-field">
                    <label htmlFor={`wound-severity-${index}`}>Severity</label>
                    <select
                      id={`wound-severity-${index}`}
                      value={wound.severity}
                      onChange={(event) => onWoundChange(index, 'severity', event.target.value)}
                    >
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div className="creator-field">
                    <label htmlFor={`wound-penalty-${index}`}>Stat Penalty</label>
                    <select
                      id={`wound-penalty-${index}`}
                      value={wound.statPenalty}
                      onChange={(event) => onWoundChange(index, 'statPenalty', event.target.value)}
                    >
                      <option value="">None</option>
                      <option value="might">Might</option>
                      <option value="agility">Agility</option>
                      <option value="wit">Wit</option>
                      <option value="spirit">Spirit</option>
                      <option value="resolve">Resolve</option>
                      <option value="instinct">Instinct</option>
                    </select>
                  </div>
                </div>

                <div className="creator-field creator-field--wide">
                  <label htmlFor={`wound-description-${index}`}>Description</label>
                  <textarea
                    id={`wound-description-${index}`}
                    rows="4"
                    value={wound.description}
                    onChange={(event) => onWoundChange(index, 'description', event.target.value)}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="review-card__empty">No active wounds recorded yet.</p>
        )}
      </div>
    </section>
  )
}

export default DetailsStep
