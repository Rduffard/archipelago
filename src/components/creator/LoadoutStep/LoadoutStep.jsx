import {
  ABILITY_SOURCE_OPTIONS,
  ABILITY_TYPE_OPTIONS,
  ATTRIBUTE_OPTIONS,
  GEAR_SECTIONS,
  RESOURCE_OPTIONS,
  titleCase,
} from './loadoutStepHelpers'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorChoiceStyles/CreatorChoiceStyles.css'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import {
  CreatorField,
  CreatorInput,
  CreatorLabel,
  CreatorSectionHeader,
  CreatorTextarea,
} from '../shared/CreatorForm/CreatorForm'
import CreatorRecordCardHeader from '../shared/CreatorRecordCardHeader/CreatorRecordCardHeader'
import './LoadoutStep.css'

function AbilitySelectField({ id, label, onChange, options, value }) {
  return (
    <CreatorField>
      <CreatorLabel htmlFor={id}>{label}</CreatorLabel>
      <select id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option || 'none'} value={option}>
            {option ? titleCase(option) : 'None'}
          </option>
        ))}
      </select>
    </CreatorField>
  )
}

function CustomAbilityCard({
  ability,
  index,
  onCustomAbilityChange,
  onRemoveCustomAbility,
}) {
  return (
    <article className="review-card">
      <CreatorRecordCardHeader
        title={ability.name || `Custom Ability ${index + 1}`}
        meta={`${titleCase(ability.source)} | ${titleCase(ability.type)}`}
        onRemove={() => onRemoveCustomAbility(index)}
      />

      <div className="creator-grid">
        <CreatorField>
          <CreatorLabel htmlFor={`ability-name-${index}`}>Name</CreatorLabel>
          <CreatorInput
            id={`ability-name-${index}`}
            type="text"
            value={ability.name}
            onChange={(event) => onCustomAbilityChange(index, 'name', event.target.value)}
          />
        </CreatorField>

        <AbilitySelectField
          id={`ability-source-${index}`}
          label="Source"
          options={ABILITY_SOURCE_OPTIONS}
          value={ability.source}
          onChange={(event) => onCustomAbilityChange(index, 'source', event.target.value)}
        />

        <AbilitySelectField
          id={`ability-type-${index}`}
          label="Type"
          options={ABILITY_TYPE_OPTIONS}
          value={ability.type}
          onChange={(event) => onCustomAbilityChange(index, 'type', event.target.value)}
        />

        <AbilitySelectField
          id={`ability-cost-resource-${index}`}
          label="Cost Resource"
          options={RESOURCE_OPTIONS}
          value={ability.costResource}
          onChange={(event) => onCustomAbilityChange(index, 'costResource', event.target.value)}
        />

        <CreatorField>
          <CreatorLabel htmlFor={`ability-cost-amount-${index}`}>Cost Amount</CreatorLabel>
          <CreatorInput
            id={`ability-cost-amount-${index}`}
            type="number"
            min="0"
            value={ability.costAmount}
            onChange={(event) => onCustomAbilityChange(index, 'costAmount', event.target.value)}
          />
        </CreatorField>

        <AbilitySelectField
          id={`ability-scaling-attribute-${index}`}
          label="Scaling Attribute"
          options={ATTRIBUTE_OPTIONS}
          value={ability.scalingAttribute}
          onChange={(event) => onCustomAbilityChange(index, 'scalingAttribute', event.target.value)}
        />

        <CreatorField>
          <CreatorLabel htmlFor={`ability-scaling-skill-${index}`}>Scaling Skill</CreatorLabel>
          <CreatorInput
            id={`ability-scaling-skill-${index}`}
            type="text"
            placeholder="Channel, Negotiate, etc."
            value={ability.scalingSkill}
            onChange={(event) => onCustomAbilityChange(index, 'scalingSkill', event.target.value)}
          />
        </CreatorField>

        <CreatorField>
          <CreatorLabel htmlFor={`ability-tags-${index}`}>Tags</CreatorLabel>
          <CreatorInput
            id={`ability-tags-${index}`}
            type="text"
            placeholder="combat, utility, arcane"
            value={ability.tagsText}
            onChange={(event) => onCustomAbilityChange(index, 'tagsText', event.target.value)}
          />
        </CreatorField>
      </div>

      <CreatorField className="creator-field--wide">
        <CreatorLabel htmlFor={`ability-effect-${index}`}>Effect</CreatorLabel>
        <CreatorTextarea
          id={`ability-effect-${index}`}
          rows="4"
          value={ability.effect}
          onChange={(event) => onCustomAbilityChange(index, 'effect', event.target.value)}
        />
      </CreatorField>
    </article>
  )
}

function GearSectionCard({ loadout, onLoadoutChange, section }) {
  return (
    <article className="review-card">
      <h3>{section.title}</h3>
      <p className="creator-loadout-hint">{section.hint}</p>
      <CreatorTextarea
        className="creator-loadout-textarea"
        rows="6"
        value={loadout[section.key]}
        onChange={(event) => onLoadoutChange(section.key, event.target.value)}
      />
    </article>
  )
}

function LoadoutStep({
  loadout,
  onLoadoutChange,
  onCustomAbilityChange,
  onAddCustomAbility,
  onRemoveCustomAbility,
}) {
  return (
    <CreatorStepFrame
      step="Step 5"
      title="Pack the sheet"
      description="Add the custom abilities, gear, and carried items that should already exist on this character before play begins."
    >

      <div className="choice-group">
        <CreatorSectionHeader
          title="Custom Abilities"
          description="Give non-calling abilities a proper shape so the sheet can show source, cost, scaling, and effect."
          action={
            <button type="button" className="creator-inline-back" onClick={onAddCustomAbility}>
              Add Ability
            </button>
          }
        />

        <div className="creator-stack creator-stack--cards">
          {loadout.customAbilities.map((ability, index) => (
            <CustomAbilityCard
              key={`custom-ability-${index}`}
              ability={ability}
              index={index}
              onCustomAbilityChange={onCustomAbilityChange}
              onRemoveCustomAbility={onRemoveCustomAbility}
            />
          ))}
        </div>
      </div>

      <div className="review-grid">
        {GEAR_SECTIONS.map((section) => (
          <GearSectionCard
            key={section.key}
            loadout={loadout}
            onLoadoutChange={onLoadoutChange}
            section={section}
          />
        ))}
      </div>
    </CreatorStepFrame>
  )
}

export default LoadoutStep
