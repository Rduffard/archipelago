import { MAP_WORLD_HEIGHT, MAP_WORLD_WIDTH } from '../components/MapCanvas'
import { getResolvedProfileShapePolygons } from '../engine/generate/worldShapePolygons'

function AuthoredShapeLayer({ profileId, shapeOverrides, selectedShapeId = null }) {
  const polygons = Object.entries(getResolvedProfileShapePolygons(profileId, shapeOverrides))

  return (
    <g className="map-layer map-layer--authored-shapes">
      {polygons.map(([shapeId, points]) => {
        const resolvedPoints = points.map(([x, y]) => [
          Number((x * MAP_WORLD_WIDTH).toFixed(2)),
          Number((y * MAP_WORLD_HEIGHT).toFixed(2)),
        ])
        const labelPoint = resolvedPoints[0]

        return (
          <g
            key={shapeId}
            className={`map-layer__authored-shape ${selectedShapeId === shapeId ? 'is-selected' : ''}`}
          >
            <polygon
              className="map-layer__authored-shape-outline"
              points={resolvedPoints.map(([x, y]) => `${x},${y}`).join(' ')}
            />
            {resolvedPoints.map(([x, y], index) => (
              <circle
                key={`${shapeId}-${index}`}
                className="map-layer__authored-shape-point"
                cx={x}
                cy={y}
                r="4"
              />
            ))}
            <text
              className="map-layer__authored-shape-label"
              x={labelPoint[0] + 8}
              y={labelPoint[1] - 8}
            >
              {shapeId}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default AuthoredShapeLayer
