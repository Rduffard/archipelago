function roundPoint([x, y]) {
  return [Number(x.toFixed(2)), Number(y.toFixed(2))]
}

function createEdgeKey(start, end) {
  const [ax, ay] = start
  const [bx, by] = end
  const a = `${ax},${ay}`
  const b = `${bx},${by}`

  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function getIslandGroups(cellsById) {
  const islandIds = new Map()
  let nextIslandId = 0

  cellsById.forEach((cell) => {
    if (cell.isWater || islandIds.has(cell.id)) {
      return
    }

    const stack = [cell.id]

    while (stack.length) {
      const currentId = stack.pop()

      if (islandIds.has(currentId)) {
        continue
      }

      islandIds.set(currentId, nextIslandId)

      const currentCell = cellsById.get(currentId)

      currentCell?.neighbors.forEach((neighborId) => {
        const neighbor = cellsById.get(neighborId)

        if (neighbor && !neighbor.isWater && !islandIds.has(neighborId)) {
          stack.push(neighborId)
        }
      })
    }

    nextIslandId += 1
  })

  return islandIds
}

function createBoundsFromPolygon(polygon) {
  const xs = polygon.map(([x]) => x)
  const ys = polygon.map(([, y]) => y)

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

function getBoundsGap(boundsA, boundsB) {
  const gapX = Math.max(0, Math.max(boundsA.minX - boundsB.maxX, boundsB.minX - boundsA.maxX))
  const gapY = Math.max(0, Math.max(boundsA.minY - boundsB.maxY, boundsB.minY - boundsA.maxY))

  return Math.sqrt((gapX ** 2) + (gapY ** 2))
}

function mergeNearbyIslandGroups(cellsById, islandIds, mergeDistance = 0) {
  if (!mergeDistance) {
    return islandIds
  }

  const islandBounds = new Map()
  const parents = new Map()

  islandIds.forEach((islandId, cellId) => {
    const cell = cellsById.get(cellId)

    if (!cell) {
      return
    }

    parents.set(islandId, islandId)
    const cellBounds = createBoundsFromPolygon(cell.polygon)
    const currentBounds = islandBounds.get(islandId)

    islandBounds.set(
      islandId,
      currentBounds
        ? {
            minX: Math.min(currentBounds.minX, cellBounds.minX),
            maxX: Math.max(currentBounds.maxX, cellBounds.maxX),
            minY: Math.min(currentBounds.minY, cellBounds.minY),
            maxY: Math.max(currentBounds.maxY, cellBounds.maxY),
          }
        : cellBounds,
    )
  })

  function find(id) {
    const parent = parents.get(id)

    if (parent === id) {
      return id
    }

    const resolvedParent = find(parent)
    parents.set(id, resolvedParent)
    return resolvedParent
  }

  function union(left, right) {
    const leftRoot = find(left)
    const rightRoot = find(right)

    if (leftRoot !== rightRoot) {
      parents.set(rightRoot, leftRoot)
    }
  }

  const islandEntries = [...islandBounds.entries()]

  for (let index = 0; index < islandEntries.length; index += 1) {
    const [leftId, leftBounds] = islandEntries[index]

    for (let compareIndex = index + 1; compareIndex < islandEntries.length; compareIndex += 1) {
      const [rightId, rightBounds] = islandEntries[compareIndex]

      if (getBoundsGap(leftBounds, rightBounds) <= mergeDistance) {
        union(leftId, rightId)
      }
    }
  }

  const normalizedIds = new Map()
  const remappedIslandIds = new Map()
  let nextIslandId = 0

  islandIds.forEach((islandId, cellId) => {
    const rootId = find(islandId)

    if (!normalizedIds.has(rootId)) {
      normalizedIds.set(rootId, nextIslandId)
      nextIslandId += 1
    }

    remappedIslandIds.set(cellId, normalizedIds.get(rootId))
  })

  return remappedIslandIds
}

function polygonToPath(polygon) {
  if (!polygon?.length) {
    return ''
  }

  const [startX, startY] = polygon[0]
  const segments = [`M ${startX} ${startY}`]

  for (let index = 1; index < polygon.length; index += 1) {
    const [x, y] = polygon[index]
    segments.push(`L ${x} ${y}`)
  }

  segments.push('Z')
  return segments.join(' ')
}

function deriveCellFeatures(cells, options = {}) {
  const cellsById = new Map(cells.map((cell) => [cell.id, cell]))
  const coastlineEdges = new Map()
  const islandAreas = new Map()

  const nextCells = cells.map((cell) => {
    const hasLandNeighbor = cell.neighbors.some((neighborId) => !cellsById.get(neighborId)?.isWater)
    const hasWaterNeighbor = cell.neighbors.some((neighborId) => cellsById.get(neighborId)?.isWater)
    const isCoastal = cell.isWater ? hasLandNeighbor : hasWaterNeighbor

    return {
      ...cell,
      isCoastal,
    }
  })

  const resolvedCells = new Map(nextCells.map((cell) => [cell.id, cell]))
  const islandIds = mergeNearbyIslandGroups(
    resolvedCells,
    getIslandGroups(resolvedCells),
    options.mergeDistance ?? 0,
  )

  const islandResolvedCells = new Map(
    nextCells.map((cell) => [
      cell.id,
      {
        ...cell,
        islandId: cell.isWater ? null : islandIds.get(cell.id) ?? null,
      },
    ]),
  )

  islandResolvedCells.forEach((cell) => {
    if (!cell.isWater && cell.islandId !== null) {
      const nextPath = polygonToPath(cell.polygon)
      const currentArea = islandAreas.get(cell.islandId)
      const nextBounds = createBoundsFromPolygon(cell.polygon)

      islandAreas.set(cell.islandId, {
        id: cell.islandId,
        path: currentArea ? `${currentArea.path} ${nextPath}` : nextPath,
        bounds: currentArea
          ? {
              minX: Math.min(currentArea.bounds.minX, nextBounds.minX),
              maxX: Math.max(currentArea.bounds.maxX, nextBounds.maxX),
              minY: Math.min(currentArea.bounds.minY, nextBounds.minY),
              maxY: Math.max(currentArea.bounds.maxY, nextBounds.maxY),
            }
          : nextBounds,
      })
    }

    if (!cell.isCoastal || cell.isWater) {
      return
    }

    for (let index = 0; index < cell.polygon.length - 1; index += 1) {
      const start = roundPoint(cell.polygon[index])
      const end = roundPoint(cell.polygon[index + 1])
      const midpointX = (start[0] + end[0]) / 2
      const midpointY = (start[1] + end[1]) / 2
      const sharedWithWater = cell.neighbors.some((neighborId) => {
        const neighbor = islandResolvedCells.get(neighborId)

        if (!neighbor?.isWater) {
          return false
        }

        return neighbor.polygon.some(([x, y], pointIndex) => {
          if (pointIndex >= neighbor.polygon.length - 1) {
            return false
          }

          const neighborStart = roundPoint([x, y])
          const neighborEnd = roundPoint(neighbor.polygon[pointIndex + 1])
          return createEdgeKey(start, end) === createEdgeKey(neighborStart, neighborEnd)
        })
      })

      if (!sharedWithWater) {
        continue
      }

      coastlineEdges.set(createEdgeKey(start, end), {
        id: createEdgeKey(start, end),
        points: [
          [start[0], start[1]],
          [end[0], end[1]],
        ],
        midpoint: [midpointX, midpointY],
        islandId: cell.islandId,
      })
    }
  })

  return {
    cells: [...islandResolvedCells.values()],
    coastline: [...coastlineEdges.values()],
    islandAreas: [...islandAreas.values()],
  }
}

export default deriveCellFeatures
