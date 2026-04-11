import './MapInspector.css'

function StatRow({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function MapInspector({
  activeBand,
  activeProfileLabel,
  camera,
  cells,
  coastline,
  detailBandId,
  landCells,
  selectedCell,
  waterCells,
}) {
  return (
    <aside className="map-inspector">
      <p className="page-shell__eyebrow">Cell Inspector</p>

      {selectedCell ? (
        <dl className="map-inspector__stats">
          <StatRow label="Cell" value={selectedCell.id} />
          <StatRow label="Terrain" value={selectedCell.terrain} />
          <StatRow label="Water" value={selectedCell.isWater ? 'Yes' : 'No'} />
          <StatRow label="Elevation" value={selectedCell.elevation} />
          <StatRow label="Moisture" value={selectedCell.moisture} />
          <StatRow label="Neighbors" value={selectedCell.neighbors.length} />
          <StatRow label="Biome" value={selectedCell.biome} />
          <StatRow label="Coastal" value={selectedCell.isCoastal ? 'Yes' : 'No'} />
          <StatRow
            label="Center"
            value={`${Math.round(selectedCell.center.x)}, ${Math.round(selectedCell.center.y)}`}
          />
          <StatRow label="Shape Weight" value={selectedCell.shapeStrength} />
        </dl>
      ) : (
        <p className="map-inspector__empty">Click a cell to inspect the generated topology and terrain data.</p>
      )}

      <dl className="map-inspector__stats map-inspector__stats--summary">
        <StatRow label="Total Cells" value={cells.length} />
        <StatRow label="Land Cells" value={landCells} />
        <StatRow label="Water Cells" value={waterCells} />
        <StatRow label="Coast Segments" value={coastline.length} />
        <StatRow label="World Profile" value={activeProfileLabel} />
        <StatRow label="Detail Band" value={activeBand?.label ?? detailBandId} />
        <StatRow label="Zoom" value={`${camera.zoom.toFixed(2)}x`} />
      </dl>
    </aside>
  )
}

export default MapInspector
