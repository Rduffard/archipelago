function PointLayer({ points }) {
  return (
    <g className="map-layer map-layer--points">
      {points.map((point) => (
        <circle
          key={point.id}
          className="map-layer__point"
          cx={point.x}
          cy={point.y}
          r="2.4"
        />
      ))}
    </g>
  )
}

export default PointLayer
