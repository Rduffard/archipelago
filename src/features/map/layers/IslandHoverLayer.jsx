import useMapStore from '../store/useMapStore'

function getFocusRegionForIsland(area, focusRegions) {
  const centerX = (area.bounds.minX + area.bounds.maxX) / 2
  const centerY = (area.bounds.minY + area.bounds.maxY) / 2

  return focusRegions.find((region) => (
    centerX >= region.x &&
    centerX <= region.x + region.width &&
    centerY >= region.y &&
    centerY <= region.y + region.height
  )) ?? null
}

function IslandHoverLayer({ islandAreas, focusRegions = [], onActivateFocusRegion }) {
  const setHoveredIslandId = useMapStore((state) => state.setHoveredIslandId)
  const setActiveFocusRegionId = useMapStore((state) => state.setActiveFocusRegionId)

  return (
    <g className="map-layer map-layer--island-hover">
      {islandAreas.map((area) => {
        const focusRegion = getFocusRegionForIsland(area, focusRegions)

        return (
          <path
            key={area.id}
            className="map-layer__island-hit"
            d={area.path}
            onMouseEnter={() => {
              setHoveredIslandId(area.id)

              if (focusRegion) {
                setActiveFocusRegionId(focusRegion.id)
              }
            }}
            onMouseLeave={() => {
              setHoveredIslandId(null)

              if (focusRegion) {
                setActiveFocusRegionId(null)
              }
            }}
            onClick={() => {
              if (focusRegion && onActivateFocusRegion) {
                setActiveFocusRegionId(focusRegion.id)
                onActivateFocusRegion(focusRegion)
              }
            }}
          />
        )
      })}
    </g>
  )
}

export default IslandHoverLayer
