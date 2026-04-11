import { useEffect, useRef, useState } from 'react'
import useMapStore from '../store/useMapStore'
import './MapViewport.css'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function MapViewport({ children }) {
  const storeCamera = useMapStore((state) => state.camera)
  const setCamera = useMapStore((state) => state.setCamera)
  const setViewport = useMapStore((state) => state.setViewport)
  const containerRef = useRef(null)
  const translateGroupRef = useRef(null)
  const scaleGroupRef = useRef(null)
  const isPanningRef = useRef(false)
  const cameraRef = useRef(storeCamera)
  const syncTimeoutRef = useRef(null)
  const panStartRef = useRef({
    clientX: 0,
    clientY: 0,
    x: 0,
    y: 0,
  })
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const viewportWidth = Math.max(1, viewportSize.width)
  const viewportHeight = Math.max(1, viewportSize.height)
  const surfaceInset = 18
  const surfaceRadius = 20
  const surfaceWidth = Math.max(1, viewportWidth - (surfaceInset * 2))
  const surfaceHeight = Math.max(1, viewportHeight - (surfaceInset * 2))

  function applyCamera(nextCamera) {
    cameraRef.current = nextCamera

    if (translateGroupRef.current) {
      translateGroupRef.current.setAttribute(
        'transform',
        `translate(${nextCamera.x} ${nextCamera.y})`,
      )
    }

    if (scaleGroupRef.current) {
      scaleGroupRef.current.setAttribute('transform', `scale(${nextCamera.zoom})`)
    }
  }

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return undefined
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      setViewportSize({
        width: Math.max(1, Math.round(entry.contentRect.width)),
        height: Math.max(1, Math.round(entry.contentRect.height)),
      })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!viewportSize.width || !viewportSize.height) {
      return
    }

    setViewport(viewportSize)
  }, [setViewport, viewportSize])

  useEffect(() => {
    applyCamera(storeCamera)
  }, [storeCamera])

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return undefined
    }

    function handleNativeWheel(event) {
      event.preventDefault()
    }

    element.addEventListener('wheel', handleNativeWheel, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleNativeWheel)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  function commitCamera(nextCamera) {
    applyCamera(nextCamera)

    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current)
    }

    syncTimeoutRef.current = window.setTimeout(() => {
      setCamera(nextCamera)
    }, 120)
  }

  function handleMouseDown(event) {
    if (event.button !== 0) {
      return
    }

    isPanningRef.current = true
    setIsPanning(true)
    panStartRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      x: cameraRef.current.x,
      y: cameraRef.current.y,
    }
  }

  function handleMouseMove(event) {
    if (!isPanningRef.current) {
      return
    }

    const deltaX = event.clientX - panStartRef.current.clientX
    const deltaY = event.clientY - panStartRef.current.clientY

    commitCamera({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
      zoom: cameraRef.current.zoom,
    })
  }

  function handleMouseUp() {
    isPanningRef.current = false
    setIsPanning(false)
  }

  function handleWheel(event) {
    const svgBounds = event.currentTarget.getBoundingClientRect()
    const mouseX = ((event.clientX - svgBounds.left) / svgBounds.width) * viewportSize.width
    const mouseY = ((event.clientY - svgBounds.top) / svgBounds.height) * viewportSize.height
    const currentCamera = cameraRef.current
    const zoomFactor = Math.exp(-event.deltaY * 0.0015)
    const nextZoom = clamp(currentCamera.zoom * zoomFactor, 0.35, 8)
    const worldX = (mouseX - currentCamera.x) / currentCamera.zoom
    const worldY = (mouseY - currentCamera.y) / currentCamera.zoom

    commitCamera({
      x: mouseX - worldX * nextZoom,
      y: mouseY - worldY * nextZoom,
      zoom: nextZoom,
    })
  }

  return (
    <section className="map-viewport">
      <div className="map-viewport__hint">
        <span>Drag to pan</span>
        <span>Scroll to zoom</span>
      </div>

      <div
        ref={containerRef}
        className={`map-viewport__frame ${isPanning ? 'is-panning' : ''}`}
      >
        <svg
          className="map-viewport__svg"
          viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <defs>
            <linearGradient id="map-sea-depth" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6f96c2" />
              <stop offset="42%" stopColor="#587faa" />
              <stop offset="100%" stopColor="#355d82" />
            </linearGradient>
            <radialGradient id="map-sea-glow" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stopColor="rgba(205, 224, 246, 0.24)" />
              <stop offset="58%" stopColor="rgba(155, 188, 224, 0.08)" />
              <stop offset="100%" stopColor="rgba(32, 55, 78, 0)" />
            </radialGradient>
            <pattern id="map-sea-ripples" width="180" height="180" patternUnits="userSpaceOnUse">
              <path
                d="M-8 32 C20 12, 54 12, 82 32 S144 52, 172 32"
                fill="none"
                stroke="rgba(228, 238, 248, 0.11)"
                strokeWidth="2"
              />
              <path
                d="M8 96 C36 76, 70 76, 98 96 S160 116, 188 96"
                fill="none"
                stroke="rgba(228, 238, 248, 0.08)"
                strokeWidth="1.5"
              />
              <path
                d="M-18 148 C14 128, 48 128, 80 148 S146 168, 178 148"
                fill="none"
                stroke="rgba(228, 238, 248, 0.07)"
                strokeWidth="1.25"
              />
            </pattern>
            <pattern id="map-sea-speckle" width="140" height="140" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="26" r="1.3" fill="rgba(255, 255, 255, 0.08)" />
              <circle cx="78" cy="38" r="0.9" fill="rgba(255, 255, 255, 0.06)" />
              <circle cx="110" cy="82" r="1.2" fill="rgba(255, 255, 255, 0.07)" />
              <circle cx="36" cy="112" r="1" fill="rgba(255, 255, 255, 0.05)" />
            </pattern>
            <pattern id="map-sea-grain" width="96" height="96" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="16" r="0.8" fill="rgba(255, 246, 228, 0.07)" />
              <circle cx="48" cy="24" r="0.7" fill="rgba(255, 246, 228, 0.05)" />
              <circle cx="78" cy="44" r="0.85" fill="rgba(255, 246, 228, 0.06)" />
              <circle cx="24" cy="58" r="0.75" fill="rgba(255, 246, 228, 0.05)" />
              <circle cx="66" cy="72" r="0.65" fill="rgba(255, 246, 228, 0.04)" />
              <circle cx="18" cy="84" r="0.7" fill="rgba(255, 246, 228, 0.06)" />
            </pattern>
            <linearGradient id="map-sea-vignette" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(10, 22, 31, 0.28)" />
              <stop offset="30%" stopColor="rgba(255, 248, 234, 0)" />
              <stop offset="72%" stopColor="rgba(255, 248, 234, 0)" />
              <stop offset="100%" stopColor="rgba(9, 19, 28, 0.34)" />
            </linearGradient>
            <clipPath id="map-surface-clip">
              <rect
                x={surfaceInset}
                y={surfaceInset}
                width={surfaceWidth}
                height={surfaceHeight}
                rx={surfaceRadius}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#map-surface-clip)">
            <rect
              className="map-viewport__backdrop"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
            />
            <rect
              className="map-viewport__backdrop map-viewport__backdrop--ripples"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              fill="url(#map-sea-ripples)"
            />
            <rect
              className="map-viewport__backdrop map-viewport__backdrop--speckle"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              fill="url(#map-sea-speckle)"
            />
            <rect
              className="map-viewport__backdrop map-viewport__backdrop--grain"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              fill="url(#map-sea-grain)"
            />
            <rect
              className="map-viewport__backdrop map-viewport__backdrop--glow"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              fill="url(#map-sea-glow)"
            />
            <g className="map-viewport__nautical-lines" aria-hidden="true">
              <path
                d={`
                  M ${surfaceInset - 30} ${surfaceInset + 112}
                  C ${surfaceInset + 120} ${surfaceInset + 46}, ${surfaceInset + 238} ${surfaceInset + 168}, ${surfaceInset + 362} ${surfaceInset + 124}
                  S ${surfaceInset + 650} ${surfaceInset + 62}, ${surfaceInset + 782} ${surfaceInset + 132}
                  S ${surfaceInset + 1044} ${surfaceInset + 220}, ${surfaceInset + 1240} ${surfaceInset + 146}
                  S ${surfaceInset + 1472} ${surfaceInset + 76}, ${surfaceInset + 1670} ${surfaceInset + 156}
                `}
              />
              <path
                d={`
                  M ${surfaceInset - 20} ${surfaceInset + 314}
                  C ${surfaceInset + 132} ${surfaceInset + 248}, ${surfaceInset + 258} ${surfaceInset + 392}, ${surfaceInset + 430} ${surfaceInset + 352}
                  S ${surfaceInset + 742} ${surfaceInset + 236}, ${surfaceInset + 912} ${surfaceInset + 314}
                  S ${surfaceInset + 1206} ${surfaceInset + 434}, ${surfaceInset + 1432} ${surfaceInset + 336}
                  S ${surfaceInset + 1594} ${surfaceInset + 280}, ${surfaceInset + 1700} ${surfaceInset + 326}
                `}
              />
              <path
                d={`
                  M ${surfaceInset + 24} ${surfaceInset + 624}
                  C ${surfaceInset + 164} ${surfaceInset + 556}, ${surfaceInset + 344} ${surfaceInset + 718}, ${surfaceInset + 506} ${surfaceInset + 662}
                  S ${surfaceInset + 848} ${surfaceInset + 524}, ${surfaceInset + 1016} ${surfaceInset + 612}
                  S ${surfaceInset + 1284} ${surfaceInset + 730}, ${surfaceInset + 1514} ${surfaceInset + 640}
                `}
              />
              <path
                d={`
                  M ${surfaceInset + 86} ${surfaceInset + 828}
                  C ${surfaceInset + 286} ${surfaceInset + 760}, ${surfaceInset + 514} ${surfaceInset + 902}, ${surfaceInset + 724} ${surfaceInset + 846}
                  S ${surfaceInset + 1114} ${surfaceInset + 742}, ${surfaceInset + 1332} ${surfaceInset + 812}
                `}
              />
            </g>
            <g className="map-viewport__chart-circles" aria-hidden="true">
              <circle cx={surfaceInset + 220} cy={surfaceInset + 188} r="96" />
              <circle cx={surfaceInset + 220} cy={surfaceInset + 188} r="146" />
              <circle cx={surfaceInset + 220} cy={surfaceInset + 188} r="196" />
              <circle cx={surfaceInset + surfaceWidth - 172} cy={surfaceInset + 270} r="86" />
              <circle cx={surfaceInset + surfaceWidth - 172} cy={surfaceInset + 270} r="138" />
              <circle cx={surfaceInset + 364} cy={surfaceInset + surfaceHeight - 144} r="104" />
            </g>
            <rect
              className="map-viewport__backdrop map-viewport__backdrop--vignette"
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              fill="url(#map-sea-vignette)"
            />

            <g ref={translateGroupRef} transform={`translate(${storeCamera.x} ${storeCamera.y})`}>
              <g ref={scaleGroupRef} transform={`scale(${storeCamera.zoom})`}>{children}</g>
            </g>
          </g>

          <g className="map-viewport__surface-frame" aria-hidden="true">
            <rect
              x={surfaceInset}
              y={surfaceInset}
              width={surfaceWidth}
              height={surfaceHeight}
              rx={surfaceRadius}
            />
            <rect
              x={surfaceInset + 6}
              y={surfaceInset + 6}
              width={Math.max(1, surfaceWidth - 12)}
              height={Math.max(1, surfaceHeight - 12)}
              rx={Math.max(1, surfaceRadius - 6)}
            />
          </g>

          <g className="map-viewport__ornaments" aria-hidden="true">
            <rect
              x="16"
              y="16"
              width={Math.max(1, viewportWidth - 32)}
              height={Math.max(1, viewportHeight - 32)}
              rx="18"
              fill="none"
              stroke="rgba(222, 201, 166, 0.62)"
              strokeWidth="1.35"
            />
            <rect
              x="28"
              y="28"
              width={Math.max(1, viewportWidth - 56)}
              height={Math.max(1, viewportHeight - 56)}
              rx="14"
              fill="none"
              stroke="rgba(71, 48, 31, 0.45)"
              strokeWidth="1"
            />
            <path
              d={`M48 34 h52 M34 48 v52 M${viewportWidth - 100} 34 h52 M${viewportWidth - 34} 48 v52 M48 ${viewportHeight - 34} h52 M34 ${viewportHeight - 100} v52 M${viewportWidth - 100} ${viewportHeight - 34} h52 M${viewportWidth - 34} ${viewportHeight - 100} v52`}
              fill="none"
              stroke="rgba(236, 222, 194, 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </section>
  )
}

export default MapViewport
