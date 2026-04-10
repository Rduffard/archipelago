function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function fitCameraToBounds(bounds, viewport, padding = 64) {
  if (!bounds || !viewport?.width || !viewport?.height) {
    return { x: 0, y: 0, zoom: 1 }
  }

  const innerWidth = Math.max(1, viewport.width - (padding * 2))
  const innerHeight = Math.max(1, viewport.height - (padding * 2))
  const boundsWidth = Math.max(1, bounds.width)
  const boundsHeight = Math.max(1, bounds.height)
  const zoom = clamp(
    Math.min(innerWidth / boundsWidth, innerHeight / boundsHeight),
    0.35,
    8,
  )
  const x = ((viewport.width - (boundsWidth * zoom)) / 2) - (bounds.x * zoom)
  const y = ((viewport.height - (boundsHeight * zoom)) / 2) - (bounds.y * zoom)

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    zoom: Number(zoom.toFixed(3)),
  }
}

export default fitCameraToBounds
