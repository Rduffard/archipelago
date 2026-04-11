import { useEffect, useMemo } from 'react'
import './MapCanvas.css'
import buildCells from '../engine/build/buildCells'
import assignBiomes from '../engine/derive/assignBiomes'
import deriveCellFeatures from '../engine/derive/deriveCellFeatures'
import generateElevation from '../engine/generate/generateElevation'
import generatePoints from '../engine/generate/generatePoints'
import { getProfileBand, getWorldProfile } from '../engine/generate/worldProfiles'
import AuthoredShapeLayer from '../layers/AuthoredShapeLayer'
import CellLayer from '../layers/CellLayer'
import CoastlineLayer from '../layers/CoastlineLayer'
import IslandHoverLayer from '../layers/IslandHoverLayer'
import PointLayer from '../layers/PointLayer'
import ShapeEditorLayer from '../layers/ShapeEditorLayer'
import ShapeMaskLayer from '../layers/ShapeMaskLayer'
import useMapStore from '../store/useMapStore'

export const MAP_WORLD_WIDTH = 1600
export const MAP_WORLD_HEIGHT = 1000
const MAP_SURFACE_RADIUS = 44
const MAP_OUTER_BORDER_OFFSET = 10
const worldCache = new Map()
const EMPTY_SHAPE_OVERRIDES = {}

function MapLabelLayer({ label, profile }) {
  if (!profile.mapLabel) {
    return null
  }

  return (
    <g className="map-layer__map-label" aria-hidden="true">
      <text
        x={profile.mapLabel.x}
        y={profile.mapLabel.y}
        fontSize={profile.mapLabel.fontSize ?? 28}
        letterSpacing={profile.mapLabel.letterSpacing ?? '0.12em'}
      >
        {label}
      </text>
    </g>
  )
}

function createTickSegments(width, height, inset, spacing, minorLength, majorEvery = 4, majorLength = 18) {
  const segments = []

  for (let x = inset + spacing; x <= width - inset - spacing; x += spacing) {
    const isMajor = ((x - inset) / spacing) % majorEvery === 0
    const tickLength = isMajor ? majorLength : minorLength
    segments.push(`M ${x} ${inset} v ${tickLength}`)
    segments.push(`M ${x} ${height - inset} v ${-tickLength}`)
  }

  for (let y = inset + spacing; y <= height - inset - spacing; y += spacing) {
    const isMajor = ((y - inset) / spacing) % majorEvery === 0
    const tickLength = isMajor ? majorLength : minorLength
    segments.push(`M ${inset} ${y} h ${tickLength}`)
    segments.push(`M ${width - inset} ${y} h ${-tickLength}`)
  }

  return segments.join(' ')
}

function MapCanvas({
  onActivateFocusRegion,
  onWorldReady,
  onDeleteShapePoint,
  suppressRender = false,
}) {
  const points = useMapStore((state) => state.world.points)
  const cells = useMapStore((state) => state.world.cells)
  const coastline = useMapStore((state) => state.world.coastline)
  const islandAreas = useMapStore((state) => state.world.islandAreas)
  const profileId = useMapStore((state) => state.world.profileId)
  const detailBandId = useMapStore((state) => state.world.detailBandId)
  const overridesByProfile = useMapStore((state) => state.shapeEditor.overridesByProfile)
  const shapeRevision = useMapStore((state) => state.shapeEditor.revision)
  const selectedShapeId = useMapStore((state) => state.shapeEditor.selectedShapeId)
  const selectedPointIndex = useMapStore((state) => state.shapeEditor.selectedPointIndex)
  const showCoastline = useMapStore((state) => state.ui.showCoastline)
  const showShapeMask = useMapStore((state) => state.ui.showShapeMask)
  const showAuthoredShapes = useMapStore((state) => state.ui.showAuthoredShapes)
  const showShapeEditor = useMapStore((state) => state.ui.showShapeEditor)
  const showPoints = useMapStore((state) => state.ui.showPoints)
  const mapLabelOverrides = useMapStore((state) => state.mapEditor.labelsByProfile)
  const setWorld = useMapStore((state) => state.setWorld)
  const updateShapeOverride = useMapStore((state) => state.updateShapeOverride)
  const setShapeEditorSelectedPoint = useMapStore((state) => state.setShapeEditorSelectedPoint)
  const shapeOverrides = useMemo(
    () => overridesByProfile[profileId] ?? EMPTY_SHAPE_OVERRIDES,
    [overridesByProfile, profileId],
  )

  useEffect(() => {
    const profile = getWorldProfile(profileId, shapeOverrides)
    const detailBand = getProfileBand(profileId, detailBandId)
    const cacheKey = `${profileId}:${detailBandId}:${shapeRevision}`
    const cachedWorld = worldCache.get(cacheKey)

    if (cachedWorld) {
      setWorld(cachedWorld)
      onWorldReady?.(cacheKey)
      return
    }

    const nextPoints = generatePoints(
      detailBand.pointCount,
      MAP_WORLD_WIDTH,
      MAP_WORLD_HEIGHT,
      profile.seed,
    )
    const builtCells = buildCells(nextPoints, MAP_WORLD_WIDTH, MAP_WORLD_HEIGHT)
    const elevatedCells = generateElevation(
      builtCells,
      MAP_WORLD_WIDTH,
      MAP_WORLD_HEIGHT,
      profile.seed,
      profile,
    )
    const derived = deriveCellFeatures(
      elevatedCells,
      profile.islandGrouping,
    )
    const nextCells = assignBiomes(derived.cells, profileId)
    const nextWorld = {
      points: nextPoints,
      cells: nextCells,
      coastline: derived.coastline,
      islandAreas: derived.islandAreas,
    }

    worldCache.set(cacheKey, nextWorld)

    setWorld(nextWorld)
    onWorldReady?.(cacheKey)
  }, [setWorld, profileId, detailBandId, onWorldReady, shapeOverrides, shapeRevision])

  const profile = getWorldProfile(profileId, shapeOverrides)
  const profileLabel = mapLabelOverrides[profileId] ?? profile.label

  return (
    <g>
      <defs>
        <filter id="map-world-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#08121a" floodOpacity="0.36" />
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#0e1d2a" floodOpacity="0.22" />
        </filter>
        <filter id="map-compass-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#efe0be" floodOpacity="0.16" />
        </filter>
        <linearGradient id="map-parchment-vignette" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(241, 229, 199, 0.12)" />
          <stop offset="45%" stopColor="rgba(245, 238, 223, 0.03)" />
          <stop offset="100%" stopColor="rgba(110, 76, 49, 0.12)" />
        </linearGradient>
        <radialGradient id="map-parchment-center" cx="50%" cy="48%" r="62%">
          <stop offset="0%" stopColor="rgba(255, 248, 236, 0.06)" />
          <stop offset="100%" stopColor="rgba(255, 248, 236, 0)" />
        </radialGradient>
        <clipPath id="map-world-surface">
          <rect
            x="0"
            y="0"
            width={MAP_WORLD_WIDTH}
            height={MAP_WORLD_HEIGHT}
            rx={MAP_SURFACE_RADIUS}
            ry={MAP_SURFACE_RADIUS}
          />
        </clipPath>
      </defs>

      <MapLabelLayer label={profileLabel} profile={profile} />

      <rect
        className="map-layer__world-shadow"
        x="0"
        y="0"
        width={MAP_WORLD_WIDTH}
        height={MAP_WORLD_HEIGHT}
        rx={MAP_SURFACE_RADIUS}
        ry={MAP_SURFACE_RADIUS}
        fill="#08141c"
        opacity="0.92"
        filter="url(#map-world-shadow)"
      />

      <g clipPath="url(#map-world-surface)">
        <rect
          x="0"
          y="0"
          width={MAP_WORLD_WIDTH}
          height={MAP_WORLD_HEIGHT}
          rx={MAP_SURFACE_RADIUS}
          ry={MAP_SURFACE_RADIUS}
          fill="#08141c"
        />
        <rect
          className="map-layer__world-wash"
          x="0"
          y="0"
          width={MAP_WORLD_WIDTH}
          height={MAP_WORLD_HEIGHT}
          fill="url(#map-parchment-vignette)"
        />
        <rect
          className="map-layer__world-wash map-layer__world-wash--center"
          x="0"
          y="0"
          width={MAP_WORLD_WIDTH}
          height={MAP_WORLD_HEIGHT}
          fill="url(#map-parchment-center)"
        />
        {suppressRender ? null : (
          <>
            {showShapeMask ? <ShapeMaskLayer cells={cells} /> : null}
            {showAuthoredShapes || showShapeEditor ? (
              <AuthoredShapeLayer
                profileId={profileId}
                shapeOverrides={shapeOverrides}
                selectedShapeId={selectedShapeId}
              />
            ) : null}
            <CellLayer
              cells={cells}
              focusRegions={onActivateFocusRegion ? profile.focusRegions : []}
              onActivateFocusRegion={onActivateFocusRegion}
            />
            {showShapeEditor && selectedShapeId ? (
              <ShapeEditorLayer
                points={shapeOverrides[selectedShapeId] ?? profile.masks.land.find((shape) => shape.shapeId === selectedShapeId)?.points ?? []}
                selectedPointIndex={selectedPointIndex}
                onChange={(nextPoints) => updateShapeOverride(profileId, selectedShapeId, nextPoints)}
                onDeletePoint={onDeleteShapePoint}
                onSelectPoint={setShapeEditorSelectedPoint}
              />
            ) : null}
            {onActivateFocusRegion ? (
              <IslandHoverLayer
                islandAreas={islandAreas}
                focusRegions={profile.focusRegions}
                onActivateFocusRegion={onActivateFocusRegion}
              />
            ) : null}
            {showCoastline ? <CoastlineLayer coastline={coastline} /> : null}
            {showPoints ? <PointLayer points={points} /> : null}
          </>
        )}
      </g>

      <rect
        className="map-layer__world-frame map-layer__world-frame--outer"
        x={-MAP_OUTER_BORDER_OFFSET}
        y={-MAP_OUTER_BORDER_OFFSET}
        width={MAP_WORLD_WIDTH + (MAP_OUTER_BORDER_OFFSET * 2)}
        height={MAP_WORLD_HEIGHT + (MAP_OUTER_BORDER_OFFSET * 2)}
        rx={MAP_SURFACE_RADIUS + MAP_OUTER_BORDER_OFFSET}
        ry={MAP_SURFACE_RADIUS + MAP_OUTER_BORDER_OFFSET}
        fill="none"
      />
      <rect
        className="map-layer__world-frame"
        x="0.75"
        y="0.75"
        width={MAP_WORLD_WIDTH - 1.5}
        height={MAP_WORLD_HEIGHT - 1.5}
        rx={MAP_SURFACE_RADIUS}
        ry={MAP_SURFACE_RADIUS}
        fill="none"
      />
      <rect
        className="map-layer__world-frame map-layer__world-frame--inner"
        x="12"
        y="12"
        width={MAP_WORLD_WIDTH - 24}
        height={MAP_WORLD_HEIGHT - 24}
        rx={MAP_SURFACE_RADIUS - 12}
        ry={MAP_SURFACE_RADIUS - 12}
        fill="none"
      />
      <g className="map-layer__world-ornaments" aria-hidden="true">
        <path
          d={`
            M 34 24 h 72
            M 24 34 v 72
            M ${MAP_WORLD_WIDTH - 106} 24 h 72
            M ${MAP_WORLD_WIDTH - 24} 34 v 72
            M 34 ${MAP_WORLD_HEIGHT - 24} h 72
            M 24 ${MAP_WORLD_HEIGHT - 106} v 72
            M ${MAP_WORLD_WIDTH - 106} ${MAP_WORLD_HEIGHT - 24} h 72
            M ${MAP_WORLD_WIDTH - 24} ${MAP_WORLD_HEIGHT - 106} v 72
          `}
          fill="none"
        />
        <path
          d={`
            M 54 24 h 26
            M 24 54 v 26
            M ${MAP_WORLD_WIDTH - 80} 24 h 26
            M ${MAP_WORLD_WIDTH - 24} 54 v 26
            M 54 ${MAP_WORLD_HEIGHT - 24} h 26
            M 24 ${MAP_WORLD_HEIGHT - 80} v 26
            M ${MAP_WORLD_WIDTH - 80} ${MAP_WORLD_HEIGHT - 24} h 26
            M ${MAP_WORLD_WIDTH - 24} ${MAP_WORLD_HEIGHT - 80} v 26
          `}
          fill="none"
        />
      </g>
      <g className="map-layer__world-grid" aria-hidden="true">
        <path
          d={createTickSegments(MAP_WORLD_WIDTH, MAP_WORLD_HEIGHT, 18, 92, 10, 4, 16)}
          fill="none"
        />
      </g>
      <g
        className="map-layer__compass"
        transform={`translate(${MAP_WORLD_WIDTH - 128} 126)`}
        aria-hidden="true"
      >
        <circle r="44" fill="rgba(10, 17, 23, 0.08)" />
        <circle r="38" fill="none" />
        <path
          d="M 0 -46 L 9 -9 L 0 -18 L -9 -9 Z M 46 0 L 9 9 L 18 0 L 9 -9 Z M 0 46 L -9 9 L 0 18 L 9 9 Z M -46 0 L -9 -9 L -18 0 L -9 9 Z"
          fill="rgba(238, 223, 193, 0.78)"
          filter="url(#map-compass-glow)"
        />
        <path
          d="M 0 -30 L 5 -5 L 0 -10 L -5 -5 Z M 30 0 L 5 5 L 10 0 L 5 -5 Z M 0 30 L -5 5 L 0 10 L 5 5 Z M -30 0 L -5 -5 L -10 0 L -5 5 Z"
          fill="rgba(77, 52, 34, 0.68)"
        />
        <circle r="6" fill="rgba(73, 49, 31, 0.8)" />
        <text x="0" y="-58">N</text>
        <text x="58" y="5">E</text>
        <text x="0" y="70">S</text>
        <text x="-58" y="5">W</text>
      </g>
    </g>
  )
}

export default MapCanvas
