import { useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import MapCanvas, {
  MAP_WORLD_HEIGHT,
  MAP_WORLD_WIDTH,
} from '../../features/map/components/MapCanvas'
import MapViewport from '../../features/map/components/MapViewport'
import {
  DEFAULT_WORLD_PROFILE,
  getBandForZoom,
  getProfileBand,
  WORLD_PROFILES,
} from '../../features/map/engine/generate/worldProfiles'
import { getResolvedProfileShapePolygons } from '../../features/map/engine/generate/worldShapePolygons'
import useMapStore from '../../features/map/store/useMapStore'
import fitCameraToBounds from '../../features/map/utils/fitCameraToBounds'

function MapPage() {
  const cells = useMapStore((state) => state.world.cells)
  const coastline = useMapStore((state) => state.world.coastline)
  const profileId = useMapStore((state) => state.world.profileId)
  const detailBandId = useMapStore((state) => state.world.detailBandId)
  const camera = useMapStore((state) => state.camera)
  const ui = useMapStore((state) => state.ui)
  const selectedCellId = useMapStore((state) => state.ui.selectedCellId)
  const shapeEditor = useMapStore((state) => state.shapeEditor)
  const mapLabelOverrides = useMapStore((state) => state.mapEditor.labelsByProfile)
  const activateProfile = useMapStore((state) => state.activateProfile)
  const clearWorldGeometry = useMapStore((state) => state.clearWorldGeometry)
  const setDetailBandId = useMapStore((state) => state.setDetailBandId)
  const setShapeEditorSelectedShape = useMapStore((state) => state.setShapeEditorSelectedShape)
  const updateShapeOverride = useMapStore((state) => state.updateShapeOverride)
  const deleteShapePoint = useMapStore((state) => state.deleteShapePoint)
  const resetShapeOverride = useMapStore((state) => state.resetShapeOverride)
  const undoShapeEditor = useMapStore((state) => state.undoShapeEditor)
  const redoShapeEditor = useMapStore((state) => state.redoShapeEditor)
  const setShapeEditorSelectedPoint = useMapStore((state) => state.setShapeEditorSelectedPoint)
  const setMapLabelOverride = useMapStore((state) => state.setMapLabelOverride)
  const toggleUiFlag = useMapStore((state) => state.toggleUiFlag)
  const selectedCell = cells.find((cell) => cell.id === selectedCellId) ?? null
  const landCells = cells.filter((cell) => !cell.isWater).length
  const waterCells = cells.length - landCells
  const activeProfile = WORLD_PROFILES[profileId]
  const activeProfileLabel = mapLabelOverrides[profileId] ?? activeProfile.label
  const activeBand = getProfileBand(profileId, detailBandId)
  const resolvedShapes = getResolvedProfileShapePolygons(
    profileId,
    shapeEditor.overridesByProfile[profileId] ?? {},
  )
  const shapeIds = Object.keys(resolvedShapes)
  const selectedShapeId = shapeEditor.selectedShapeId && resolvedShapes[shapeEditor.selectedShapeId]
    ? shapeEditor.selectedShapeId
    : (shapeIds[0] ?? null)
  const drillTimeoutRef = useRef(null)
  const detailBandTimeoutRef = useRef(null)
  const lastViewportKeyRef = useRef('')
  const profileMenuRef = useRef(null)
  const isTransitioningRef = useRef(false)
  const pendingTransitionKeyRef = useRef('')
  const releaseTransitionTimeoutRef = useRef(null)
  const [isProfileTransitioning, setIsProfileTransitioning] = useState(false)
  const canUndo = shapeEditor.past.length > 0
  const canRedo = shapeEditor.future.length > 0
  const selectedShapePoints = selectedShapeId ? (resolvedShapes[selectedShapeId] ?? []) : []
  const selectedPointIndex = shapeEditor.selectedPointIndex
  const hasSelectedPoint = selectedPointIndex !== null
    && selectedPointIndex >= 0
    && selectedPointIndex < selectedShapePoints.length

  useEffect(() => {
    return () => {
      if (drillTimeoutRef.current) {
        window.clearTimeout(drillTimeoutRef.current)
      }

      if (detailBandTimeoutRef.current) {
        window.clearTimeout(detailBandTimeoutRef.current)
      }

      if (releaseTransitionTimeoutRef.current) {
        window.clearTimeout(releaseTransitionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedShapeId && selectedShapeId !== shapeEditor.selectedShapeId) {
      setShapeEditorSelectedShape(selectedShapeId)
    }
  }, [selectedShapeId, setShapeEditorSelectedShape, shapeEditor.selectedShapeId])

  useEffect(() => {
    if (!hasSelectedPoint && shapeEditor.selectedPointIndex !== null) {
      setShapeEditorSelectedPoint(null)
    }
  }, [hasSelectedPoint, setShapeEditorSelectedPoint, shapeEditor.selectedPointIndex])

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        profileMenuRef.current?.removeAttribute('open')
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  useEffect(() => {
    function isTypingTarget(target) {
      if (!(target instanceof HTMLElement)) {
        return false
      }

      return target.isContentEditable
        || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    }

    function handleKeyDown(event) {
      if (!ui.showShapeEditor || isTypingTarget(event.target)) {
        return
      }

      const isUndo = (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'z'
      const isRedo = (event.ctrlKey || event.metaKey)
        && !event.altKey
        && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))

      if (isRedo) {
        event.preventDefault()
        redoShapeEditor()
        return
      }

      if (isUndo) {
        event.preventDefault()
        undoShapeEditor()
        return
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && hasSelectedPoint && selectedShapeId) {
        event.preventDefault()
        deleteShapePoint(profileId, selectedShapeId, selectedPointIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    deleteShapePoint,
    hasSelectedPoint,
    profileId,
    redoShapeEditor,
    selectedPointIndex,
    selectedShapeId,
    ui.showShapeEditor,
    undoShapeEditor,
  ])

  useEffect(() => {
    if (
      isTransitioningRef.current
      || !activeProfile?.overviewBounds
      || !ui.viewport?.width
      || !ui.viewport?.height
      || ui.viewport.width < 200
      || ui.viewport.height < 200
    ) {
      return
    }

    const viewportKey = `${profileId}:${ui.viewport.width}:${ui.viewport.height}`

    if (lastViewportKeyRef.current === viewportKey) {
      return
    }

    activateProfile(
      profileId,
      fitCameraToBounds(activeProfile.overviewBounds, ui.viewport, profileId === 'emerald_vale' ? 96 : 72),
    )
    lastViewportKeyRef.current = viewportKey
  }, [activateProfile, activeProfile, profileId, ui.viewport])

  useEffect(() => {
    if (isTransitioningRef.current) {
      return
    }

    const nextBand = getBandForZoom(profileId, camera.zoom)

    if (nextBand.id === detailBandId) {
      return
    }

    if (detailBandTimeoutRef.current) {
      window.clearTimeout(detailBandTimeoutRef.current)
    }

    detailBandTimeoutRef.current = window.setTimeout(() => {
      if (!isTransitioningRef.current) {
        setDetailBandId(nextBand.id)
      }
    }, 180)
  }, [camera.zoom, detailBandId, profileId, setDetailBandId])

  function transitionToProfile(nextProfileId, padding = 72) {
    const nextProfile = WORLD_PROFILES[nextProfileId]

    if (!nextProfile || !ui.viewport?.width || !ui.viewport?.height) {
      return
    }

    if (drillTimeoutRef.current) {
      window.clearTimeout(drillTimeoutRef.current)
    }

    if (detailBandTimeoutRef.current) {
      window.clearTimeout(detailBandTimeoutRef.current)
    }

    if (releaseTransitionTimeoutRef.current) {
      window.clearTimeout(releaseTransitionTimeoutRef.current)
    }

    isTransitioningRef.current = true
    setIsProfileTransitioning(true)
    profileMenuRef.current?.removeAttribute('open')
    pendingTransitionKeyRef.current = `${nextProfileId}:${nextProfile.defaultBandId}:`
    clearWorldGeometry()

    drillTimeoutRef.current = window.setTimeout(() => {
      lastViewportKeyRef.current = ''
      activateProfile(
        nextProfileId,
        fitCameraToBounds(nextProfile.overviewBounds, ui.viewport, padding),
      )
    }, 120)
  }

  function handleWorldReady(worldKey) {
    if (!isTransitioningRef.current || !worldKey.startsWith(pendingTransitionKeyRef.current)) {
      return
    }

    if (releaseTransitionTimeoutRef.current) {
      window.clearTimeout(releaseTransitionTimeoutRef.current)
    }

    releaseTransitionTimeoutRef.current = window.setTimeout(() => {
      pendingTransitionKeyRef.current = ''
      isTransitioningRef.current = false
      setIsProfileTransitioning(false)
    }, 420)
  }

  useEffect(() => {
    return () => {
      isTransitioningRef.current = false
      pendingTransitionKeyRef.current = ''
    }
  }, [clearWorldGeometry])

  function handleActivateFocusRegion(region) {
    if (!region?.targetProfileId) {
      return
    }

    transitionToProfile(region.targetProfileId, 96)
  }

  function handleProfileChange(nextProfileId) {
    if (nextProfileId === profileId) {
      profileMenuRef.current?.removeAttribute('open')
      return
    }

    transitionToProfile(nextProfileId, nextProfileId === 'emerald_vale' ? 96 : 84)
  }

  return (
    <main className="standalone-page map-page">
      <PageHeader
        eyebrow="World Engine"
        title="Explore the Lore"
        description={activeProfile?.description ?? 'A base world substrate with seeded cells and authored masks.'}
        backTo="/dashboard"
        backLabel="Return to dashboard"
      />

      <section className="map-shell">
        <div className="map-shell__meta">
          <p className="standalone-page__eyebrow">Base World Model</p>
          <p>
            World size {MAP_WORLD_WIDTH} x {MAP_WORLD_HEIGHT} with authored macro and regional world profiles.
          </p>
        </div>

        <div className="map-toolbar" aria-label="Map debug controls">
          <div className="map-toolbar__group">
            <span className="map-toolbar__label">World Profile</span>
            <details ref={profileMenuRef} className="map-profile-menu">
              <summary className="map-profile-menu__trigger">
                <span>{activeProfileLabel}</span>
                <span className="map-profile-menu__caret">▾</span>
              </summary>

              <div className="map-profile-menu__list" role="listbox" aria-label="World profile">
                {Object.values(WORLD_PROFILES).map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    className={`map-profile-menu__option ${profile.id === profileId ? 'is-active' : ''}`}
                    onClick={() => {
                      handleProfileChange(profile.id)
                      profileMenuRef.current?.removeAttribute('open')
                    }}
                  >
                    <span>{profile.label}</span>
                    <small>{profile.description}</small>
                  </button>
                ))}
              </div>
            </details>
          </div>
          <button type="button" className={`map-toolbar__button ${ui.showCoastline ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showCoastline')}>
            Coastline
          </button>
          <button type="button" className={`map-toolbar__button ${ui.showCellEdges ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showCellEdges')}>
            Cell Edges
          </button>
          <button type="button" className={`map-toolbar__button ${ui.showShapeMask ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showShapeMask')}>
            Shape Mask
          </button>
          <button type="button" className={`map-toolbar__button ${ui.showAuthoredShapes ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showAuthoredShapes')}>
            Authored Shapes
          </button>
          <button type="button" className={`map-toolbar__button ${ui.showShapeEditor ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showShapeEditor')}>
            Shape Editor
          </button>
          <button type="button" className={`map-toolbar__button ${ui.showPoints ? 'is-active' : ''}`} onClick={() => toggleUiFlag('showPoints')}>
            Seed Points
          </button>
        </div>

        {ui.showShapeEditor ? (
          <div className="map-shape-editor">
            <div className="map-shape-editor__group">
              <span className="map-toolbar__label">Editing Shape</span>
              <select
                className="map-shape-editor__select"
                value={selectedShapeId ?? ''}
                onChange={(event) => setShapeEditorSelectedShape(event.target.value)}
              >
                {shapeIds.map((shapeId) => (
                  <option key={shapeId} value={shapeId}>
                    {shapeId}
                  </option>
                ))}
              </select>
            </div>
            <div className="map-shape-editor__group">
              <span className="map-toolbar__label">Map Title</span>
              <input
                className="map-shape-editor__input"
                type="text"
                value={activeProfileLabel}
                onChange={(event) => setMapLabelOverride(profileId, event.target.value)}
              />
            </div>
            <button
              type="button"
              className="map-toolbar__button"
              onClick={() => undoShapeEditor()}
              disabled={!canUndo}
            >
              Undo
            </button>
            <button
              type="button"
              className="map-toolbar__button"
              onClick={() => redoShapeEditor()}
              disabled={!canRedo}
            >
              Redo
            </button>
            <button
              type="button"
              className="map-toolbar__button"
              onClick={() => {
                if (selectedShapeId && hasSelectedPoint) {
                  deleteShapePoint(profileId, selectedShapeId, selectedPointIndex)
                }
              }}
              disabled={!selectedShapeId || !hasSelectedPoint || selectedShapePoints.length <= 3}
            >
              Delete Selected Point
            </button>
            <button
              type="button"
              className="map-toolbar__button"
              onClick={() => {
                const currentPoints = selectedShapePoints

                if (selectedShapeId && currentPoints.length > 3) {
                  updateShapeOverride(profileId, selectedShapeId, currentPoints.slice(0, -1))
                }
              }}
              disabled={!selectedShapeId || selectedShapePoints.length <= 3}
            >
              Remove Last Point
            </button>
            <button
              type="button"
              className="map-toolbar__button"
              onClick={() => {
                if (selectedShapeId) {
                  resetShapeOverride(profileId, selectedShapeId)
                }
              }}
              disabled={!selectedShapeId}
            >
              Reset Shape
            </button>
            <p className="map-shape-editor__hint">
              Drag points to reshape the coast. Click a point to select it, then press Delete or Backspace to remove it. Right-click still works too. Click a midpoint to insert a new vertex, or click empty map space to append one. Use Ctrl+Z / Ctrl+Shift+Z to undo and redo.
            </p>
          </div>
        ) : null}

        <div className="map-shell__layout">
          <div className={`map-viewport-shell ${isProfileTransitioning ? 'is-transitioning' : ''}`}>
            {profileId !== DEFAULT_WORLD_PROFILE ? (
              <button
                type="button"
                className="map-viewport-shell__back"
                onClick={() => transitionToProfile(DEFAULT_WORLD_PROFILE, 96)}
              >
                <span className="map-viewport-shell__back-arrow" aria-hidden="true">←</span>
                <span>Back to Emerald Vale</span>
              </button>
            ) : null}
            <MapViewport>
              <MapCanvas
                onActivateFocusRegion={ui.showShapeEditor ? undefined : handleActivateFocusRegion}
                onWorldReady={handleWorldReady}
                suppressRender={isProfileTransitioning}
                onDeleteShapePoint={(pointIndex) => {
                  if (selectedShapeId) {
                    deleteShapePoint(profileId, selectedShapeId, pointIndex)
                  }
                }}
              />
            </MapViewport>
            <div className="map-viewport-shell__veil" aria-hidden="true" />
          </div>

          <aside className="map-inspector">
            <p className="standalone-page__eyebrow">Cell Inspector</p>

            {selectedCell ? (
              <dl className="map-inspector__stats">
                <div>
                  <dt>Cell</dt>
                  <dd>{selectedCell.id}</dd>
                </div>
                <div>
                  <dt>Terrain</dt>
                  <dd>{selectedCell.terrain}</dd>
                </div>
                <div>
                  <dt>Water</dt>
                  <dd>{selectedCell.isWater ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt>Elevation</dt>
                  <dd>{selectedCell.elevation}</dd>
                </div>
                <div>
                  <dt>Moisture</dt>
                  <dd>{selectedCell.moisture}</dd>
                </div>
                <div>
                  <dt>Neighbors</dt>
                  <dd>{selectedCell.neighbors.length}</dd>
                </div>
                <div>
                  <dt>Biome</dt>
                  <dd>{selectedCell.biome}</dd>
                </div>
                <div>
                  <dt>Coastal</dt>
                  <dd>{selectedCell.isCoastal ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt>Center</dt>
                  <dd>
                    {Math.round(selectedCell.center.x)}, {Math.round(selectedCell.center.y)}
                  </dd>
                </div>
                <div>
                  <dt>Shape Weight</dt>
                  <dd>{selectedCell.shapeStrength}</dd>
                </div>
              </dl>
            ) : (
              <p className="map-inspector__empty">
                Click a cell to inspect the generated topology and terrain data.
              </p>
            )}

            <dl className="map-inspector__stats map-inspector__stats--summary">
              <div>
                <dt>Total Cells</dt>
                <dd>{cells.length}</dd>
              </div>
              <div>
                <dt>Land Cells</dt>
                <dd>{landCells}</dd>
              </div>
              <div>
                <dt>Water Cells</dt>
                <dd>{waterCells}</dd>
              </div>
              <div>
                <dt>Coast Segments</dt>
                <dd>{coastline.length}</dd>
              </div>
              <div>
                <dt>World Profile</dt>
                <dd>{activeProfileLabel}</dd>
              </div>
              <div>
                <dt>Detail Band</dt>
                <dd>{activeBand?.label ?? detailBandId}</dd>
              </div>
              <div>
                <dt>Zoom</dt>
                <dd>{camera.zoom.toFixed(2)}x</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default MapPage
