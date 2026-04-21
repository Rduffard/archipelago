const ABILITY_SOURCE_OPTIONS = ['custom', 'origin', 'relic']
const ABILITY_TYPE_OPTIONS = ['active', 'passive', 'reaction']
const RESOURCE_OPTIONS = ['', 'stamina', 'focus', 'corruption', 'health']
const ATTRIBUTE_OPTIONS = ['', 'might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']

function titleCase(value = '') {
  if (!value) {
    return 'None'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function LoadoutStep({
  loadout,
  onLoadoutChange,
  onCustomAbilityChange,
  onAddCustomAbility,
  onRemoveCustomAbility,
}) {
  const gearSections = [
    {
      key: 'weaponsText',
      title: 'Weapons',
      hint: 'One per line: Name | description',
    },
    {
      key: 'armorText',
      title: 'Armor',
      hint: 'One per line: Name | description',
    },
    {
      key: 'techRelicsText',
      title: 'Tech / Relics',
      hint: 'One per line: Name | description',
    },
    {
      key: 'cargoText',
      title: 'Cargo',
      hint: 'One per line: Name | description',
    },
    {
      key: 'inventoryText',
      title: 'Inventory',
      hint: 'One per line: Name | quantity | description',
    },
    {
      key: 'relicsText',
      title: 'Bonded Relics',
      hint: 'One per line: Name | bonded yes/no | description',
    },
  ]

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 5</p>
        <h2>Pack the sheet</h2>
        <p>
          Add the custom abilities, gear, and carried items that should already exist on this
          character before play begins.
        </p>
      </div>

      <div className="choice-group">
        <div className="choice-group__header choice-group__header--split">
          <div>
            <h3>Custom Abilities</h3>
            <p>Give non-calling abilities a proper shape so the sheet can show source, cost, scaling, and effect.</p>
          </div>
          <button type="button" className="creator-inline-back" onClick={onAddCustomAbility}>
            Add Ability
          </button>
        </div>

        <div className="creator-stack creator-stack--cards">
          {loadout.customAbilities.map((ability, index) => (
            <article key={`custom-ability-${index}`} className="review-card">
              <div className="choice-group__header choice-group__header--split">
                <div>
                  <h3>{ability.name || `Custom Ability ${index + 1}`}</h3>
                  <p>
                    {titleCase(ability.source)} | {titleCase(ability.type)}
                  </p>
                </div>
                <button
                  type="button"
                  className="creator-inline-back"
                  onClick={() => onRemoveCustomAbility(index)}
                >
                  Remove
                </button>
              </div>

              <div className="creator-grid">
                <div className="creator-field">
                  <label htmlFor={`ability-name-${index}`}>Name</label>
                  <input
                    id={`ability-name-${index}`}
                    type="text"
                    value={ability.name}
                    onChange={(event) => onCustomAbilityChange(index, 'name', event.target.value)}
                  />
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-source-${index}`}>Source</label>
                  <select
                    id={`ability-source-${index}`}
                    value={ability.source}
                    onChange={(event) => onCustomAbilityChange(index, 'source', event.target.value)}
                  >
                    {ABILITY_SOURCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {titleCase(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-type-${index}`}>Type</label>
                  <select
                    id={`ability-type-${index}`}
                    value={ability.type}
                    onChange={(event) => onCustomAbilityChange(index, 'type', event.target.value)}
                  >
                    {ABILITY_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {titleCase(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-cost-resource-${index}`}>Cost Resource</label>
                  <select
                    id={`ability-cost-resource-${index}`}
                    value={ability.costResource}
                    onChange={(event) =>
                      onCustomAbilityChange(index, 'costResource', event.target.value)
                    }
                  >
                    {RESOURCE_OPTIONS.map((option) => (
                      <option key={option || 'none'} value={option}>
                        {option ? titleCase(option) : 'None'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-cost-amount-${index}`}>Cost Amount</label>
                  <input
                    id={`ability-cost-amount-${index}`}
                    type="number"
                    min="0"
                    value={ability.costAmount}
                    onChange={(event) => onCustomAbilityChange(index, 'costAmount', event.target.value)}
                  />
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-scaling-attribute-${index}`}>Scaling Attribute</label>
                  <select
                    id={`ability-scaling-attribute-${index}`}
                    value={ability.scalingAttribute}
                    onChange={(event) =>
                      onCustomAbilityChange(index, 'scalingAttribute', event.target.value)
                    }
                  >
                    {ATTRIBUTE_OPTIONS.map((option) => (
                      <option key={option || 'none'} value={option}>
                        {option ? titleCase(option) : 'None'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-scaling-skill-${index}`}>Scaling Skill</label>
                  <input
                    id={`ability-scaling-skill-${index}`}
                    type="text"
                    placeholder="Channel, Negotiate, etc."
                    value={ability.scalingSkill}
                    onChange={(event) =>
                      onCustomAbilityChange(index, 'scalingSkill', event.target.value)
                    }
                  />
                </div>

                <div className="creator-field">
                  <label htmlFor={`ability-tags-${index}`}>Tags</label>
                  <input
                    id={`ability-tags-${index}`}
                    type="text"
                    placeholder="combat, utility, arcane"
                    value={ability.tagsText}
                    onChange={(event) => onCustomAbilityChange(index, 'tagsText', event.target.value)}
                  />
                </div>
              </div>

              <div className="creator-field creator-field--wide">
                <label htmlFor={`ability-effect-${index}`}>Effect</label>
                <textarea
                  id={`ability-effect-${index}`}
                  rows="4"
                  value={ability.effect}
                  onChange={(event) => onCustomAbilityChange(index, 'effect', event.target.value)}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="review-grid">
        {gearSections.map((section) => (
          <article key={section.key} className="review-card">
            <h3>{section.title}</h3>
            <p className="creator-loadout-hint">{section.hint}</p>
            <textarea
              className="creator-loadout-textarea"
              rows="6"
              value={loadout[section.key]}
              onChange={(event) => onLoadoutChange(section.key, event.target.value)}
            />
          </article>
        ))}
      </div>
    </section>
  )
}

export default LoadoutStep
