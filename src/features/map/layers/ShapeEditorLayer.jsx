import { useEffect, useMemo, useRef, useState } from 'react'
import { MAP_WORLD_HEIGHT, MAP_WORLD_WIDTH } from '../components/MapCanvas'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function toWorldPoint(event, layerElement) {
  const svg = layerElement?.ownerSVGElement
  const matrix = layerElement?.getScreenCTM()

  if (!svg || !matrix) {
    return null
  }

  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY

  const transformed = point.matrixTransform(matrix.inverse())

  return {
    x: clamp(transformed.x, 0, MAP_WORLD_WIDTH),
    y: clamp(transformed.y, 0, MAP_WORLD_HEIGHT),
  }
}

function normalizePoints(points) {
  return points.map(([x, y]) => [
    Number((x / MAP_WORLD_WIDTH).toFixed(4)),
    Number((y / MAP_WORLD_HEIGHT).toFixed(4)),
  ])
}

function ShapeEditorLayer({ points, onChange, onDeletePoint }) {
  const layerRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)

  const resolvedPoints = useMemo(
    () => points.map(([x, y]) => [x * MAP_WORLD_WIDTH, y * MAP_WORLD_HEIGHT]),
    [points],
  )

  useEffect(() => {
    if (dragIndex === null) {
      return undefined
    }

    function handleMouseMove(event) {
      const nextPoint = toWorldPoint(event, layerRef.current)

      if (!nextPoint) {
        return
      }

      onChange(
        normalizePoints(resolvedPoints.map((point, index) => (
          index === dragIndex
            ? [
                nextPoint.x,
                nextPoint.y,
              ]
            : point
        ))),
      )
    }

    function handleMouseUp() {
      setDragIndex(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragIndex, onChange, resolvedPoints])

  function handleAddPoint(event) {
    if (event.target !== event.currentTarget) {
      return
    }

    const nextPoint = toWorldPoint(event.nativeEvent, layerRef.current)

    if (!nextPoint) {
      return
    }

    onChange([
      ...normalizePoints(resolvedPoints),
      ...normalizePoints([[nextPoint.x, nextPoint.y]]),
    ])
  }

  function handleInsertPoint(segmentIndex) {
    const startPoint = resolvedPoints[segmentIndex]
    const endPoint = resolvedPoints[(segmentIndex + 1) % resolvedPoints.length]

    if (!startPoint || !endPoint) {
      return
    }

    const nextPoints = [...resolvedPoints]
    nextPoints.splice(segmentIndex + 1, 0, [
      Number((((startPoint[0] + endPoint[0]) * 0.5)).toFixed(2)),
      Number((((startPoint[1] + endPoint[1]) * 0.5)).toFixed(2)),
    ])

    onChange(normalizePoints(nextPoints))
  }

  const segments = resolvedPoints.map((point, index) => {
    const nextPoint = resolvedPoints[(index + 1) % resolvedPoints.length]

    return {
      id: `shape-editor-segment-${index}`,
      x1: point[0],
      y1: point[1],
      x2: nextPoint[0],
      y2: nextPoint[1],
      midX: (point[0] + nextPoint[0]) * 0.5,
      midY: (point[1] + nextPoint[1]) * 0.5,
      index,
    }
  })

  return (
    <g ref={layerRef} className="map-layer map-layer--shape-editor">
      <rect
        className="map-layer__shape-editor-hit"
        x="0"
        y="0"
        width={MAP_WORLD_WIDTH}
        height={MAP_WORLD_HEIGHT}
        onMouseDown={handleAddPoint}
      />
      {resolvedPoints.length > 0 ? (
        <polygon
          className="map-layer__shape-editor-polygon"
          points={resolvedPoints.map(([x, y]) => `${x},${y}`).join(' ')}
        />
      ) : null}
      <polyline
        className="map-layer__shape-editor-line"
        points={resolvedPoints.map(([x, y]) => `${x},${y}`).join(' ')}
      />
      {resolvedPoints.length > 1 ? segments.map((segment) => (
        <g key={segment.id}>
          <line
            className="map-layer__shape-editor-segment-hit"
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            onMouseDown={(event) => {
              event.stopPropagation()
              handleInsertPoint(segment.index)
            }}
          />
          <circle
            className="map-layer__shape-editor-midpoint"
            cx={segment.midX}
            cy={segment.midY}
            r="5"
            onMouseDown={(event) => {
              event.stopPropagation()
              handleInsertPoint(segment.index)
            }}
          />
        </g>
      )) : null}
      {resolvedPoints.map(([x, y], index) => (
        <circle
          key={`shape-editor-point-${index}`}
          className="map-layer__shape-editor-point"
          cx={x}
          cy={y}
          r="7"
          onMouseDown={(event) => {
            event.stopPropagation()
            setDragIndex(index)
          }}
          onContextMenu={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDeletePoint?.(index)
          }}
        />
      ))}
    </g>
  )
}

export default ShapeEditorLayer
