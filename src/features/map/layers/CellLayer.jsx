import useMapStore from '../store/useMapStore'

function getCellFill(cell) {
  if (cell.isWater) {
    const lightness = 38 + (cell.elevation * 9)
    return `hsl(209 39% ${lightness}%)`
  }

  return cell.fillColor ?? 'hsl(102 24% 42%)'
}

function getFocusRegionForCell(cell, focusRegions) {
  return focusRegions.find((region) => {
    if (cell.isWater) {
      return false
    }

    return (
      cell.center.x >= region.x &&
      cell.center.x <= region.x + region.width &&
      cell.center.y >= region.y &&
      cell.center.y <= region.y + region.height
    )
  }) ?? null
}

function CellLayer({ cells, focusRegions = [], onActivateFocusRegion }) {
  const selectedCellId = useMapStore((state) => state.ui.selectedCellId)
  const activeFocusRegionId = useMapStore((state) => state.ui.activeFocusRegionId)
  const showCellEdges = useMapStore((state) => state.ui.showCellEdges)
  const setActiveFocusRegionId = useMapStore((state) => state.setActiveFocusRegionId)
  const setSelectedCellId = useMapStore((state) => state.setSelectedCellId)

  return (
    <g className="map-layer map-layer--cells">
      {cells.map((cell) => {
        const focusRegion = getFocusRegionForCell(cell, focusRegions)
        const isFocusActive = activeFocusRegionId && focusRegion?.id === activeFocusRegionId
        const isFocusEdge = Boolean(isFocusActive && cell.isCoastal)

        function handleClick() {
          if (focusRegion && onActivateFocusRegion) {
            setActiveFocusRegionId(focusRegion.id)
            onActivateFocusRegion(focusRegion)
            return
          }

          setSelectedCellId(cell.id)
        }

        return (
          <polygon
            key={cell.id}
            className={`map-layer__cell ${selectedCellId === cell.id ? 'is-selected' : ''} ${isFocusEdge ? 'is-focus-active' : ''}`}
            points={cell.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
            fill={getCellFill(cell)}
            stroke={
              isFocusEdge
                ? 'rgba(255, 243, 219, 0.98)'
                : showCellEdges
                  ? 'rgba(232, 221, 203, 0.3)'
                  : 'transparent'
            }
            onClick={handleClick}
          />
        )
      })}
    </g>
  )
}

export default CellLayer
