function getMaskOpacity(cell) {
  return Math.max(0.08, cell.shapeStrength * 0.45)
}

function ShapeMaskLayer({ cells }) {
  return (
    <g className="map-layer map-layer--shape-mask">
      {cells.map((cell) => (
        <polygon
          key={cell.id}
          className="map-layer__shape-mask"
          points={cell.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
          fill={`rgba(244, 201, 135, ${getMaskOpacity(cell)})`}
        />
      ))}
    </g>
  )
}

export default ShapeMaskLayer
