import {
  ATTRIBUTE_CAP,
  getBlueprintAttributes,
} from '../../../data/archipelagoSystemBlueprint'
import { useSystem } from '../../../hooks/useSystem'
import { getRemainingPoints } from '../../../lib/character'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'

function AttributesStep({ attributeValues, onAttributeChange }) {
  const { blueprint } = useSystem()
  const remainingPoints = getRemainingPoints(attributeValues)
  const attributes = getBlueprintAttributes(blueprint)

  return (
    <CreatorStepFrame
      step="Step 3"
      title="Spend your attribute points"
      description={`Keep it readable and thematic: 12 points total, up to ${ATTRIBUTE_CAP} in any one attribute.`}
    >

      <div className="points-banner">
        <span>Points remaining</span>
        <strong>{remainingPoints}</strong>
      </div>

      <div className="attribute-list">
        {attributes.map((attribute) => {
          const value = attributeValues[attribute.key]

          return (
            <div key={attribute.key} className="attribute-row">
              <div>
                <h3>{attribute.name}</h3>
                <p>{attribute.description}</p>
              </div>

              <div className="attribute-row__controls">
                <button
                  type="button"
                  onClick={() => onAttributeChange(attribute.key, value - 1)}
                  disabled={value <= 0}
                >
                  -
                </button>
                <span>{value}</span>
                <button
                  type="button"
                  onClick={() => onAttributeChange(attribute.key, value + 1)}
                  disabled={value >= ATTRIBUTE_CAP || remainingPoints <= 0}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </CreatorStepFrame>
  )
}

export default AttributesStep
