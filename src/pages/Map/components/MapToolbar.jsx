import './MapToolbar.css'

function MapToolbar({
  activeProfileLabel,
  canRedo,
  canUndo,
  handleProfileChange,
  hasSelectedPoint,
  onDeleteSelectedPoint,
  onRedo,
  onRemoveLastPoint,
  onResetShape,
  onTitleChange,
  onToggleUiFlag,
  onUndo,
  profileId,
  profileMenuRef,
  resetShapeDisabled,
  selectedShapeId,
  selectedShapePoints,
  setShapeEditorSelectedShape,
  shapeIds,
  ui,
  worldProfiles,
}) {
  return (
    <>
      <div className="map-toolbar" aria-label="Map debug controls">
        <div className="map-toolbar__group">
          <span className="map-toolbar__label">World Profile</span>
          <details ref={profileMenuRef} className="map-profile-menu">
            <summary className="map-profile-menu__trigger">
              <span>{activeProfileLabel}</span>
              <span className="map-profile-menu__caret">v</span>
            </summary>

            <div className="map-profile-menu__list" role="listbox" aria-label="World profile">
              {Object.values(worldProfiles).map((profile) => (
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

        <button
          type="button"
          className={`map-toolbar__button ${ui.showCoastline ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showCoastline')}
        >
          Coastline
        </button>
        <button
          type="button"
          className={`map-toolbar__button ${ui.showCellEdges ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showCellEdges')}
        >
          Cell Edges
        </button>
        <button
          type="button"
          className={`map-toolbar__button ${ui.showShapeMask ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showShapeMask')}
        >
          Shape Mask
        </button>
        <button
          type="button"
          className={`map-toolbar__button ${ui.showAuthoredShapes ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showAuthoredShapes')}
        >
          Authored Shapes
        </button>
        <button
          type="button"
          className={`map-toolbar__button ${ui.showShapeEditor ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showShapeEditor')}
        >
          Shape Editor
        </button>
        <button
          type="button"
          className={`map-toolbar__button ${ui.showPoints ? 'is-active' : ''}`}
          onClick={() => onToggleUiFlag('showPoints')}
        >
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
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>

          <button type="button" className="map-toolbar__button" onClick={onUndo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" className="map-toolbar__button" onClick={onRedo} disabled={!canRedo}>
            Redo
          </button>
          <button
            type="button"
            className="map-toolbar__button"
            onClick={onDeleteSelectedPoint}
            disabled={!selectedShapeId || !hasSelectedPoint || selectedShapePoints.length <= 3}
          >
            Delete Selected Point
          </button>
          <button
            type="button"
            className="map-toolbar__button"
            onClick={onRemoveLastPoint}
            disabled={!selectedShapeId || selectedShapePoints.length <= 3}
          >
            Remove Last Point
          </button>
          <button
            type="button"
            className="map-toolbar__button"
            onClick={onResetShape}
            disabled={resetShapeDisabled}
          >
            Reset Shape
          </button>

          <p className="map-shape-editor__hint">
            Drag points to reshape the coast. Click a point to select it, then press Delete or Backspace to remove it.
            Right-click still works too. Click a midpoint to insert a new vertex, or click empty map space to append
            one. Use Ctrl+Z / Ctrl+Shift+Z to undo and redo.
          </p>
        </div>
      ) : null}
    </>
  )
}

export default MapToolbar
