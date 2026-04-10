import {
  getResolvedProfileShapePolygons,
} from './worldShapePolygons'

function resolveMaskShapes(profileId, masks, shapeOverrides = {}) {
  const resolvedPolygons = getResolvedProfileShapePolygons(profileId, shapeOverrides)

  return {
    ...masks,
    land: (masks.land ?? []).map((shape) => (
      shape.shapeId
        ? { ...shape, points: resolvedPolygons[shape.shapeId] ?? shape.points }
        : shape
    )),
    voids: (masks.voids ?? []).map((shape) => (
      shape.shapeId
        ? { ...shape, points: resolvedPolygons[shape.shapeId] ?? shape.points }
        : shape
    )),
  }
}

export const WORLD_PROFILES = {
  emerald_vale: {
    id: 'emerald_vale',
    label: 'Emerald Vale',
    description: 'The greater world frame with the Saguine Archipelago centered among surrounding powers.',
    seed: 'emerald-vale',
    seaLevel: 0.48,
    islandGrouping: {
      mergeDistance: 0,
    },
    overviewBounds: {
      x: 120,
      y: 70,
      width: 1360,
      height: 860,
    },
    defaultBandId: 'world',
    detailBands: [
      {
        id: 'world',
        label: 'World',
        minZoom: 0,
        pointCount: 1750,
        overviewBounds: {
          x: 120,
          y: 70,
          width: 1360,
          height: 860,
        },
      },
    ],
    focusRegions: [
      {
        id: 'sanguine_archipelago',
        label: 'Zoom to Sanguine Archipelago',
        x: 540,
        y: 390,
        width: 470,
        height: 240,
        targetProfileId: 'sanguine_archipelago',
        previewBounds: {
          x: 420,
          y: 310,
          width: 700,
          height: 420,
        },
      },
    ],
    visualRegions: [
      { id: 'yuma', x: -0.03, y: 0.56, rx: 0.18, ry: 0.42, color: '#9e8bd4' },
      { id: 'jasheaf', x: 0.51, y: 0.16, rx: 0.13, ry: 0.12, color: '#7fe0ab' },
      { id: 'sanguine-sea', x: 0.52, y: 0.52, rx: 0.17, ry: 0.11, color: '#f29f8c' },
      { id: 'turaz', x: 0.46, y: 0.92, rx: 0.18, ry: 0.16, color: '#cec985' },
      { id: 'lilin', x: 1.02, y: 0.52, rx: 0.16, ry: 0.48, color: '#d794bd' },
    ],
    masks: {
      land: [
        { shapeId: 'yuma', feather: 0.06, edgeLift: 0.52, strength: 1.06 },
        { shapeId: 'lilin', feather: 0.06, edgeLift: 0.52, strength: 1.06 },
        { shapeId: 'turaz', feather: 0.055, edgeLift: 0.56, strength: 0.98 },
        { shapeId: 'jasheaf', feather: 0.045, edgeLift: 0.6, strength: 1.02 },
        { shapeId: 'archipelagoWest', feather: 0.03, edgeLift: 0.62, strength: 0.82 },
        { shapeId: 'archipelagoEast', feather: 0.035, edgeLift: 0.62, strength: 0.86 },
        { shapeId: 'archipelagoNorth', feather: 0.025, edgeLift: 0.62, strength: 0.76 },
      ],
      voids: [
        { x: 0.5, y: 0.52, rx: 0.18, ry: 0.19, strength: 0.3 },
        { x: 0.51, y: 0.66, rx: 0.2, ry: 0.1, strength: 0.22 },
      ],
      ridges: [
        { x1: 0.39, y1: 0.53, x2: 0.66, y2: 0.53, width: 0.06, strength: 0.06 },
      ],
    },
  },
  sanguine_archipelago: {
    id: 'sanguine_archipelago',
    label: 'Sanguine Archipelago',
    description: 'The central playable island cluster with dense islands and navigable channels.',
    seed: 'sanguine-archipelago',
    seaLevel: 0.52,
    islandGrouping: {
      mergeDistance: 38,
    },
    overviewBounds: {
      x: 120,
      y: 250,
      width: 1280,
      height: 520,
    },
    defaultBandId: 'overview',
    detailBands: [
      {
        id: 'overview',
        label: 'Overview',
        minZoom: 0,
        pointCount: 2700,
        overviewBounds: {
          x: 120,
          y: 250,
          width: 1280,
          height: 520,
        },
      },
      {
        id: 'detail',
        label: 'Detail',
        minZoom: 1.15,
        pointCount: 3500,
        overviewBounds: {
          x: 210,
          y: 290,
          width: 1100,
          height: 460,
        },
      },
      {
        id: 'close',
        label: 'Close',
        minZoom: 1.85,
        pointCount: 4300,
        overviewBounds: {
          x: 280,
          y: 320,
          width: 980,
          height: 390,
        },
      },
    ],
    focusRegions: [],
    visualRegions: [
      { id: 'lyvimi', x: 0.06, y: 0.48, rx: 0.06, ry: 0.12, color: '#8b88c8' },
      { id: 'grand-duchy-tethynco', x: 0.24, y: 0.46, rx: 0.09, ry: 0.11, color: '#a6d77b' },
      { id: 'khiz', x: 0.24, y: 0.66, rx: 0.08, ry: 0.14, color: '#d5cd72' },
      { id: 'harshinium', x: 0.33, y: 0.56, rx: 0.06, ry: 0.09, color: '#c38ec8' },
      { id: 'arannia', x: 0.43, y: 0.28, rx: 0.05, ry: 0.09, color: '#7fd7b3' },
      { id: 'dengz-guo', x: 0.44, y: 0.45, rx: 0.06, ry: 0.12, color: '#74c7c9' },
      { id: 'dazibinan', x: 0.56, y: 0.57, rx: 0.09, ry: 0.12, color: '#d493d7' },
      { id: 'sha-ni', x: 0.75, y: 0.26, rx: 0.09, ry: 0.11, color: '#9adce8' },
      { id: 'selvia', x: 0.76, y: 0.41, rx: 0.08, ry: 0.09, color: '#ea8f98' },
      { id: 'kirkh', x: 0.71, y: 0.61, rx: 0.08, ry: 0.08, color: '#db7c79' },
      { id: 'puraret', x: 0.84, y: 0.58, rx: 0.06, ry: 0.07, color: '#d97fb9' },
      { id: 'tribes-of-akshan', x: 0.95, y: 0.58, rx: 0.12, ry: 0.16, color: '#f1a091' },
      { id: 'rukkh', x: 0.9, y: 0.76, rx: 0.08, ry: 0.08, color: '#99a0d6' },
      { id: 'busha', x: 0.98, y: 0.84, rx: 0.05, ry: 0.07, color: '#d47fb0' },
    ],
    masks: {
      land: [
        { shapeId: 'lyvimi', feather: 0.028, edgeLift: 0.62, strength: 0.9 },
        { shapeId: 'klecchi', feather: 0.026, edgeLift: 0.62, strength: 0.82 },
        { shapeId: 'tethynco', feather: 0.03, edgeLift: 0.6, strength: 0.96 },
        { shapeId: 'khiz', feather: 0.036, edgeLift: 0.58, strength: 0.98 },
        { shapeId: 'harshinium', feather: 0.026, edgeLift: 0.62, strength: 0.9 },
        { shapeId: 'arannia', feather: 0.022, edgeLift: 0.64, strength: 0.8 },
        { shapeId: 'dengzGuo', feather: 0.03, edgeLift: 0.6, strength: 0.94 },
        { shapeId: 'outerIsletWest', feather: 0.015, edgeLift: 0.72, strength: 0.5 },
        { shapeId: 'outerIsletCenter', feather: 0.015, edgeLift: 0.72, strength: 0.5 },
        { shapeId: 'centralIsletA', feather: 0.014, edgeLift: 0.7, strength: 0.58 },
        { shapeId: 'centralIsletB', feather: 0.014, edgeLift: 0.7, strength: 0.58 },
        { shapeId: 'centralIsletC', feather: 0.016, edgeLift: 0.7, strength: 0.54 },
        { shapeId: 'dazibinan', feather: 0.034, edgeLift: 0.58, strength: 0.98 },
        { shapeId: 'shaNi', feather: 0.03, edgeLift: 0.6, strength: 0.98 },
        { shapeId: 'selvia', feather: 0.028, edgeLift: 0.6, strength: 0.92 },
        { shapeId: 'kirkh', feather: 0.028, edgeLift: 0.6, strength: 0.88 },
        { shapeId: 'puraret', feather: 0.024, edgeLift: 0.64, strength: 0.82 },
        { shapeId: 'akshan', feather: 0.04, edgeLift: 0.58, strength: 1.08 },
        { shapeId: 'rukkh', feather: 0.028, edgeLift: 0.62, strength: 0.84 },
        { shapeId: 'busha', feather: 0.025, edgeLift: 0.64, strength: 0.8 },
      ],
      voids: [
        { x: 0.34, y: 0.65, rx: 0.06, ry: 0.08, strength: 0.22 },
        { x: 0.66, y: 0.5, rx: 0.06, ry: 0.08, strength: 0.2 },
      ],
      ridges: [
        { x1: 0.17, y1: 0.48, x2: 0.98, y2: 0.56, width: 0.04, strength: 0.04 },
      ],
    },
  },
}

export const DEFAULT_WORLD_PROFILE = 'emerald_vale'

export function getWorldProfile(profileId, shapeOverrides = {}) {
  const profile = WORLD_PROFILES[profileId] ?? WORLD_PROFILES[DEFAULT_WORLD_PROFILE]

  return {
    ...profile,
    masks: resolveMaskShapes(profile.id, profile.masks, shapeOverrides),
  }
}

export function getProfileBand(profileId, bandId) {
  const profile = getWorldProfile(profileId)
  return (
    profile.detailBands.find((band) => band.id === bandId)
    ?? profile.detailBands.find((band) => band.id === profile.defaultBandId)
    ?? profile.detailBands[0]
  )
}

export function getBandForZoom(profileId, zoom) {
  const profile = getWorldProfile(profileId)
  const sortedBands = [...profile.detailBands].sort((left, right) => left.minZoom - right.minZoom)
  let activeBand = sortedBands[0]

  sortedBands.forEach((band) => {
    if (zoom >= band.minZoom) {
      activeBand = band
    }
  })

  return activeBand
}
