import { create } from 'zustand'
import { DEFAULT_WORLD_PROFILE, getWorldProfile } from '../engine/generate/worldProfiles'

const initialCamera = {
  x: 0,
  y: 0,
  zoom: 1,
}

const initialWorld = {
  points: [],
  cells: [],
  coastline: [],
  islandAreas: [],
  profileId: DEFAULT_WORLD_PROFILE,
  detailBandId: getWorldProfile(DEFAULT_WORLD_PROFILE).defaultBandId,
}

const initialUi = {
  selectedCellId: null,
  showCellEdges: false,
  showCoastline: true,
  showPoints: false,
  showShapeMask: false,
  showAuthoredShapes: false,
  showShapeEditor: false,
  activeFocusRegionId: null,
  hoveredIslandId: null,
  viewport: {
    width: 0,
    height: 0,
  },
}

const initialShapeEditor = {
  selectedShapeId: null,
  selectedPointIndex: null,
  overridesByProfile: {},
  revision: 0,
  past: [],
  future: [],
}

const initialMapEditor = {
  labelsByProfile: {},
}

function cloneOverrides(overridesByProfile) {
  return JSON.parse(JSON.stringify(overridesByProfile))
}

function pushShapeHistory(state, nextOverridesByProfile) {
  return {
    ...state.shapeEditor,
    revision: state.shapeEditor.revision + 1,
    past: [...state.shapeEditor.past, cloneOverrides(state.shapeEditor.overridesByProfile)],
    future: [],
    overridesByProfile: nextOverridesByProfile,
  }
}

const useMapStore = create((set) => ({
  camera: initialCamera,
  world: initialWorld,
  ui: initialUi,
  shapeEditor: initialShapeEditor,
  mapEditor: initialMapEditor,
  setCamera: (nextCamera) =>
    set((state) => ({
      camera:
        typeof nextCamera === 'function'
          ? nextCamera(state.camera)
          : { ...state.camera, ...nextCamera },
    })),
  setWorld: (nextWorld) =>
    set((state) => ({
      world:
        typeof nextWorld === 'function'
          ? nextWorld(state.world)
          : { ...state.world, ...nextWorld },
    })),
  clearWorldGeometry: () =>
    set((state) => ({
      world: {
        ...state.world,
        points: [],
        cells: [],
        coastline: [],
        islandAreas: [],
      },
      ui: {
        ...state.ui,
        selectedCellId: null,
        hoveredIslandId: null,
      },
    })),
  setSelectedCellId: (selectedCellId) =>
    set((state) => ({
      ui: {
        ...state.ui,
        selectedCellId,
      },
    })),
  setActiveFocusRegionId: (activeFocusRegionId) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeFocusRegionId,
      },
    })),
  setHoveredIslandId: (hoveredIslandId) =>
    set((state) => ({
      ui: {
        ...state.ui,
        hoveredIslandId,
      },
    })),
  setViewport: (viewport) =>
    set((state) => ({
      ui: {
        ...state.ui,
        viewport,
      },
    })),
  toggleUiFlag: (key) =>
    set((state) => ({
      ui: {
        ...state.ui,
        [key]: !state.ui[key],
      },
    })),
  setShapeEditorSelectedShape: (selectedShapeId) =>
    set((state) => ({
      shapeEditor: {
        ...state.shapeEditor,
        selectedShapeId,
        selectedPointIndex: null,
      },
    })),
  setShapeEditorSelectedPoint: (selectedPointIndex) =>
    set((state) => ({
      shapeEditor: {
        ...state.shapeEditor,
        selectedPointIndex,
      },
    })),
  updateShapeOverride: (profileId, shapeId, points) =>
    set((state) => {
      const nextOverridesByProfile = {
        ...state.shapeEditor.overridesByProfile,
        [profileId]: {
          ...(state.shapeEditor.overridesByProfile[profileId] ?? {}),
          [shapeId]: points,
        },
      }

      return {
        shapeEditor: pushShapeHistory(state, nextOverridesByProfile),
      }
    }),
  deleteShapePoint: (profileId, shapeId, pointIndex) =>
    set((state) => {
      const currentPoints = state.shapeEditor.overridesByProfile[profileId]?.[shapeId]

      if (!currentPoints || currentPoints.length <= 3 || pointIndex < 0 || pointIndex >= currentPoints.length) {
        return state
      }

      const nextPoints = currentPoints.filter((_, index) => index !== pointIndex)
      const nextOverridesByProfile = {
        ...state.shapeEditor.overridesByProfile,
        [profileId]: {
          ...(state.shapeEditor.overridesByProfile[profileId] ?? {}),
          [shapeId]: nextPoints,
        },
      }

      return {
        shapeEditor: {
          ...pushShapeHistory(state, nextOverridesByProfile),
          selectedPointIndex: pointIndex >= nextPoints.length ? nextPoints.length - 1 : pointIndex,
        },
      }
    }),
  resetShapeOverride: (profileId, shapeId) =>
    set((state) => {
      const nextProfileOverrides = { ...(state.shapeEditor.overridesByProfile[profileId] ?? {}) }
      delete nextProfileOverrides[shapeId]
      const nextOverridesByProfile = {
        ...state.shapeEditor.overridesByProfile,
        [profileId]: nextProfileOverrides,
      }

      return {
        shapeEditor: {
          ...pushShapeHistory(state, nextOverridesByProfile),
          selectedPointIndex: null,
        },
      }
    }),
  undoShapeEditor: () =>
    set((state) => {
      if (state.shapeEditor.past.length === 0) {
        return state
      }

      const previousOverridesByProfile = state.shapeEditor.past[state.shapeEditor.past.length - 1]

      return {
        shapeEditor: {
          ...state.shapeEditor,
          revision: state.shapeEditor.revision + 1,
          selectedPointIndex: null,
          overridesByProfile: previousOverridesByProfile,
          past: state.shapeEditor.past.slice(0, -1),
          future: [
            cloneOverrides(state.shapeEditor.overridesByProfile),
            ...state.shapeEditor.future,
          ],
        },
      }
    }),
  redoShapeEditor: () =>
    set((state) => {
      if (state.shapeEditor.future.length === 0) {
        return state
      }

      const [nextOverridesByProfile, ...remainingFuture] = state.shapeEditor.future

      return {
        shapeEditor: {
          ...state.shapeEditor,
          revision: state.shapeEditor.revision + 1,
          selectedPointIndex: null,
          overridesByProfile: nextOverridesByProfile,
          past: [
            ...state.shapeEditor.past,
            cloneOverrides(state.shapeEditor.overridesByProfile),
          ],
          future: remainingFuture,
        },
      }
    }),
  setMapLabelOverride: (profileId, label) =>
    set((state) => ({
      mapEditor: {
        ...state.mapEditor,
        labelsByProfile: {
          ...state.mapEditor.labelsByProfile,
          [profileId]: label,
        },
      },
    })),
  activateProfile: (profileId, camera) =>
    set((state) => ({
      camera: camera ? { ...state.camera, ...camera } : state.camera,
      world: {
        ...state.world,
        profileId,
        detailBandId: getWorldProfile(profileId).defaultBandId,
      },
      ui: {
        ...state.ui,
        selectedCellId: null,
        activeFocusRegionId: null,
      },
    })),
  setDetailBandId: (detailBandId) =>
    set((state) => ({
      world: {
        ...state.world,
        detailBandId,
      },
    })),
  setShapePreset: (shapePreset) =>
    set((state) => ({
      world: {
        ...state.world,
        profileId: shapePreset,
        detailBandId: getWorldProfile(shapePreset).defaultBandId,
      },
      ui: {
        ...state.ui,
        selectedCellId: null,
        activeFocusRegionId: null,
      },
    })),
}))

export default useMapStore
