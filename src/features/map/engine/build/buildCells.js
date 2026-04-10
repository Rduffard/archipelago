import { Delaunay } from 'd3-delaunay'

function buildCells(points, width, height) {
  if (!points.length) {
    return []
  }

  const delaunay = Delaunay.from(
    points,
    (point) => point.x,
    (point) => point.y,
  )
  const voronoi = delaunay.voronoi([0, 0, width, height])
  const cells = []

  for (let index = 0; index < points.length; index += 1) {
    const polygon = voronoi.cellPolygon(index)

    if (!polygon || polygon.length < 3) {
      continue
    }

    cells.push({
      id: points[index].id,
      center: {
        x: points[index].x,
        y: points[index].y,
      },
      point: [points[index].x, points[index].y],
      neighbors: [...delaunay.neighbors(index)].map((neighborIndex) => points[neighborIndex].id),
      polygon: polygon.map(([x, y]) => [Number(x.toFixed(2)), Number(y.toFixed(2))]),
    })
  }

  return cells
}

export default buildCells
