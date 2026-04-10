import { getWorldProfile } from './worldProfiles'

function hashSeed(seed) {
  const value = String(seed)
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function sampleNoise(x, y, seed) {
  const value = Math.sin((x * 12.9898) + (y * 78.233) + (seed * 0.001)) * 43758.5453
  return value - Math.floor(value)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalize(value, max) {
  return max === 0 ? 0 : value / max
}

function classifyTerrain(elevation, isWater) {
  if (isWater) {
    return elevation < 0.18 ? 'ocean' : 'shoal'
  }

  if (elevation > 0.82) {
    return 'mountain'
  }

  if (elevation > 0.68) {
    return 'highland'
  }

  if (elevation > 0.5) {
    return 'upland'
  }

  return 'lowland'
}

function sampleEllipse(x, y, blob) {
  const dx = (x - blob.x) / blob.rx
  const dy = (y - blob.y) / blob.ry
  const distance = Math.sqrt((dx ** 2) + (dy ** 2))
  return clamp(1 - distance, 0, 1) * blob.strength
}

function pointInPolygon(x, y, points) {
  let isInside = false

  for (let index = 0, previousIndex = points.length - 1; index < points.length; previousIndex = index, index += 1) {
    const [x1, y1] = points[index]
    const [x2, y2] = points[previousIndex]
    const intersects = ((y1 > y) !== (y2 > y))
      && (x < (((x2 - x1) * (y - y1)) / ((y2 - y1) || 1e-7)) + x1)

    if (intersects) {
      isInside = !isInside
    }
  }

  return isInside
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = (dx ** 2) + (dy ** 2)

  if (lengthSquared === 0) {
    return Math.sqrt(((px - x1) ** 2) + ((py - y1) ** 2))
  }

  const t = clamp((((px - x1) * dx) + ((py - y1) * dy)) / lengthSquared, 0, 1)
  const projectionX = x1 + (t * dx)
  const projectionY = y1 + (t * dy)

  return Math.sqrt(((px - projectionX) ** 2) + ((py - projectionY) ** 2))
}

function sampleRidge(x, y, ridge) {
  const distance = distanceToSegment(x, y, ridge.x1, ridge.y1, ridge.x2, ridge.y2)
  return clamp(1 - (distance / ridge.width), 0, 1) * ridge.strength
}

function samplePolygon(x, y, polygon) {
  if (!polygon.points?.length || !pointInPolygon(x, y, polygon.points)) {
    return 0
  }

  let minDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < polygon.points.length; index += 1) {
    const [startX, startY] = polygon.points[index]
    const [endX, endY] = polygon.points[(index + 1) % polygon.points.length]
    minDistance = Math.min(
      minDistance,
      distanceToSegment(x, y, startX, startY, endX, endY),
    )
  }

  const feather = polygon.feather ?? 0.035
  const edgeLift = polygon.edgeLift ?? 0.58
  const interiorStrength = clamp(minDistance / feather, 0, 1)

  return ((edgeLift + ((1 - edgeLift) * interiorStrength)) * polygon.strength)
}

function sampleMaskShape(x, y, shape) {
  if (shape.points) {
    return samplePolygon(x, y, shape)
  }

  return sampleEllipse(x, y, shape)
}

function sampleShapeMask(x, y, masks) {
  const positive = (masks.land ?? []).reduce((sum, shape) => sum + sampleMaskShape(x, y, shape), 0)
  const negative = (masks.voids ?? []).reduce((sum, shape) => sum + sampleMaskShape(x, y, shape), 0)
  const ridges = (masks.ridges ?? []).reduce((sum, ridge) => sum + sampleRidge(x, y, ridge), 0)

  return clamp((positive + ridges) - negative, 0, 1)
}

function resolveProfile(profileOrId) {
  if (typeof profileOrId === 'string') {
    return getWorldProfile(profileOrId)
  }

  return profileOrId
}

function generateElevation(cells, width, height, seed = 1, profileOrId) {
  const profile = resolveProfile(profileOrId)
  const seedValue = hashSeed(seed || profile.seed)

  return cells.map((cell) => {
    const x = normalize(cell.center.x, width)
    const y = normalize(cell.center.y, height)
    const macroNoise = sampleNoise(x * 3.1, y * 3.1, seedValue)
    const detailNoise = sampleNoise(x * 8.7, y * 8.7, seedValue + 97)
    const ridgeNoise = sampleNoise(x * 16.2, y * 16.2, seedValue + 211)
    const shorelineNoise = sampleNoise(x * 21.5, y * 21.5, seedValue + 401)
    const shapeMask = sampleShapeMask(x, y, profile.masks)
    const shapedMask = clamp(
      shapeMask < 0.12
        ? shapeMask * 0.34
        : (shapeMask ** 0.8),
      0,
      1,
    )
    const interiorLift = shapedMask > 0.58 ? 0.09 : 0
    const coastalCut = shapedMask < 0.08 ? 0.18 : 0
    const noiseWeight = clamp(0.16 - (shapedMask * 0.11), 0.035, 0.16)
    const elevation = clamp(
      (shapedMask * 0.9)
        + (macroNoise * noiseWeight)
        + (detailNoise * (noiseWeight * 0.65))
        + (ridgeNoise * 0.04)
        + (shorelineNoise * (0.018 + (shapedMask * 0.02)))
        + interiorLift
        - coastalCut,
      0,
      1,
    )
    const moisture = clamp((macroNoise * 0.55) + (detailNoise * 0.45), 0, 1)
    const isWater = elevation < profile.seaLevel

    return {
      ...cell,
      shapeStrength: Number(shapeMask.toFixed(3)),
      elevation: Number(elevation.toFixed(3)),
      moisture: Number(moisture.toFixed(3)),
      isWater,
      terrain: classifyTerrain(elevation, isWater),
    }
  })
}

export default generateElevation
