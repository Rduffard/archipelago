import { getWorldProfile } from '../generate/worldProfiles'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  const normalized = value.length === 3
    ? value.split('').map((char) => `${char}${char}`).join('')
    : value

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function mixColors(baseColor, mixColor, weight) {
  const left = hexToRgb(baseColor)
  const right = hexToRgb(mixColor)
  const ratio = clamp(weight, 0, 1)

  return `rgb(${Math.round((left.r * (1 - ratio)) + (right.r * ratio))} ${Math.round((left.g * (1 - ratio)) + (right.g * ratio))} ${Math.round((left.b * (1 - ratio)) + (right.b * ratio))})`
}

function getNearestVisualRegion(cell, profile) {
  if (!profile.visualRegions?.length || cell.isWater) {
    return null
  }

  const x = cell.center.x / 1600
  const y = cell.center.y / 1000
  let winningRegion = null
  let bestScore = -Infinity

  profile.visualRegions.forEach((region) => {
    const dx = (x - region.x) / region.rx
    const dy = (y - region.y) / region.ry
    const score = 1 - Math.sqrt((dx ** 2) + (dy ** 2))

    if (score > bestScore) {
      bestScore = score
      winningRegion = region
    }
  })

  return winningRegion
}

function getLandFill(cell, region) {
  const base = region?.color ?? '#7da86a'

  if (cell.elevation > 0.8) {
    return mixColors(base, '#efe6db', 0.58)
  }

  if (cell.elevation > 0.65) {
    return mixColors(base, '#b49a73', 0.34)
  }

  if (cell.moisture < 0.34) {
    return mixColors(base, '#d8c097', 0.26)
  }

  return mixColors(base, '#6d8e49', 0.12)
}

function assignBiomes(cells, profileId) {
  const profile = getWorldProfile(profileId)

  return cells.map((cell) => {
    let biome = 'sea'

    if (!cell.isWater) {
      if (cell.elevation > 0.84) {
        biome = 'alpine'
      } else if (cell.elevation > 0.7 && cell.moisture < 0.4) {
        biome = 'windswept highlands'
      } else if (cell.elevation > 0.62) {
        biome = 'highland forest'
      } else if (cell.moisture < 0.24) {
        biome = 'barren steppe'
      } else if (cell.moisture < 0.45) {
        biome = 'grassland'
      } else if (cell.moisture < 0.7) {
        biome = 'temperate forest'
      } else {
        biome = 'rainforest'
      }

      if (cell.isCoastal) {
        biome = cell.moisture < 0.45 ? 'coastal scrub' : 'coastal forest'
      }
    } else if (cell.isCoastal) {
      biome = 'coastal water'
    }

    const visualRegion = getNearestVisualRegion(cell, profile)
    const fillColor = cell.isWater
      ? null
      : getLandFill(cell, visualRegion)

    return {
      ...cell,
      biome,
      visualRegionId: visualRegion?.id ?? null,
      fillColor,
    }
  })
}

export default assignBiomes
