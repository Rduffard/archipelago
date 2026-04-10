import useMapStore from '../store/useMapStore'

function CoastlineLayer({ coastline }) {
  const hoveredIslandId = useMapStore((state) => state.ui.hoveredIslandId)

  return (
    <g className="map-layer map-layer--coastline">
      {coastline
        .filter((edge) => hoveredIslandId !== null && edge.islandId === hoveredIslandId)
        .map((edge) => (
        <g key={edge.id}>
          <line
            className="map-layer__shelf map-layer__shelf--outer"
            x1={edge.points[0][0]}
            y1={edge.points[0][1]}
            x2={edge.points[1][0]}
            y2={edge.points[1][1]}
          />
          <line
            className="map-layer__shelf map-layer__shelf--mid"
            x1={edge.points[0][0]}
            y1={edge.points[0][1]}
            x2={edge.points[1][0]}
            y2={edge.points[1][1]}
          />
          <line
            className="map-layer__shelf map-layer__shelf--inner"
            x1={edge.points[0][0]}
            y1={edge.points[0][1]}
            x2={edge.points[1][0]}
            y2={edge.points[1][1]}
          />
          <line
            className="map-layer__coastline"
            x1={edge.points[0][0]}
            y1={edge.points[0][1]}
            x2={edge.points[1][0]}
            y2={edge.points[1][1]}
          />
        </g>
        ))}
    </g>
  )
}

export default CoastlineLayer
