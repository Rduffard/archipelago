import { getBlueprintAttributes } from '../../../data/archipelagoSystemBlueprint'
import { useSystem } from '../../../hooks/useSystem'
import { getRemainingPoints } from '../../../lib/creatorAttributes.js'
import { calculateCheckModifier } from '../../../lib/checkModifier.js'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'

export default function AttributesStep({ attributeValues, finalAttributes, selectedOrigin, resourceMaximums, onAttributeChange }) {
  const { blueprint } = useSystem()
  const remainingPoints = getRemainingPoints(attributeValues)
  return (
    <CreatorStepFrame step="Step 3" title="Spend your attribute points"
      description="27 points. Scores begin at 8 and can reach 15 before origin bonuses. Scores 14 and 15 each cost 2 points to reach.">
      <div className="points-banner"><span>Points remaining</span><strong>{remainingPoints}</strong></div>
      <p>Origin bonus: {selectedOrigin ? `${selectedOrigin.name}: ${selectedOrigin.bonus}` : 'Choose an origin'}</p>
      <div className="attribute-list">
        {getBlueprintAttributes(blueprint).map((attribute) => {
          const value = attributeValues[attribute.key]
          const final = finalAttributes[attribute.key]
          const modifier = final >= 1 ? calculateCheckModifier(finalAttributes, attribute.key) : 0
          const cost = value >= 13 ? 2 : 1
          return (
            <div key={attribute.key} className="attribute-row">
              <div><h3>{attribute.name}</h3><p>{attribute.description}</p>
                <p>Allocated {value} · Origin {final - value >= 0 ? '+' : ''}{final - value} · Final {final} · Modifier {modifier >= 0 ? '+' : ''}{modifier}</p>
              </div>
              <div className="attribute-row__controls">
                <button type="button" aria-label={`Decrease ${attribute.name}`} onClick={() => onAttributeChange(attribute.key, value - 1)} disabled={value <= 8}>-</button>
                <span>{value}</span>
                <button type="button" aria-label={`Increase ${attribute.name}`} onClick={() => onAttributeChange(attribute.key, value + 1)} disabled={value >= 15 || remainingPoints < cost}>+</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="points-banner"><span>Initial base capacities (level 1)</span>
        <strong>Health {resourceMaximums.health} · Stamina {resourceMaximums.stamina} · Focus {resourceMaximums.focus}</strong>
      </div>
    </CreatorStepFrame>
  )
}
