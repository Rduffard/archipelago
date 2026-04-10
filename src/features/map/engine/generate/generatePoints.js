function hashSeed(seed) {
  const value = String(seed)
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createSeededRandom(seed) {
  let state = hashSeed(seed) || 1

  return function seededRandom() {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
}

function generatePoints(count, width, height, seed = 1) {
  const random = createSeededRandom(seed)
  const points = []

  for (let index = 0; index < count; index += 1) {
    points.push({
      id: index,
      x: random() * width,
      y: random() * height,
    })
  }

  return points
}

export default generatePoints
