# Sanguine Archipelago UI rebuild · Pass 1

| Area | Ownership |
| --- | --- |
| Routes and login | AppRoutes, ProtectedRoute and AuthProvider still own protected routes and the shared Crossworld login. /dashboard now opens the Captain’s Quarters. Existing roster, sheet, edit, campaign, session, lore map and rules paths keep their route contracts. |
| Navigation | AppNavbar provides direct destinations and a menu. The scene’s mirror opens /characters and its chart table opens /campaigns/new. The quarters links also reach these routes without WebGL. |
| HUD | src/game/ui owns panels, actions, cards, menus, dialogs, status, tooltips, tabs and resource bars. CharacterHud accepts display-ready vitals and rows for a future sheet adapter. src/game/game.css owns the Sanguine palette, typography, spacing, layering and interaction states. |
| 3D | SceneCanvas owns renderer loading, pointer raycasting, motion preferences, resize and disposal. quarters.js builds the cabin and hotspot groups. Three.js is pinned to 0.180.0 in the npm lockfile. Navigation works if the module or WebGL is unavailable. |
| Creator | /characters/create holds the local visual draft and reads SA-CHAR-1 through the shared getCharacterRules API. Identity and Lineage are interactive. Changing Lineage clears its dependent choices. Origin through Review remain in development. The existing creator at /characters/new continues to submit the established creation contract. |
| Appearance | A local descriptor identifies body, Lineage, hair, clothing, equipment and their colors, with optional animalFormId and disguise overrides. The renderer resolves display layers separately from mechanics, rotates through eight facings and uses placeholder models. Habits such as hair variants and body shape will be mapped when authored assets arrive. No appearance fields are sent by the new creator. |

The dashboard page and its command-deck component were retired after tracing their only active callers. Shared dashboard CSS still serves the roster and placeholders. The new navbar replaces the previous presentation and keeps combat practice in the menu. The existing MapCanvas cycles through AuthoredShapeLayer and ShapeEditorLayer are outside the new scene and HUD modules.

## Backend boundaries

Lineage definitions and starting options come from the backend catalog. Nested Human feat options and later creation choices remain future work. The draft has no save action. The current sheet remains accessible and the new HUD does not call gameplay commands.

Spell and item casting have per-feature journals and limits, while active Lineage commands and other actions use tracked owner-turn fields. The current command paths do not establish one shared action budget across those systems. Leave the new action controls deferred until that budget is verified. Practice encounters are owner-only. Shared Changeling presentation needs a backend-authorized, redacted projection. Stone Listening and form placement rely on host adjudication.

Next, wire the remaining creator steps through backend preview, expose nested choices and authoritative review data, connect the read-only HUD to sheet projections, and map Blender-authored layers to the appearance descriptor.

## Deployment stabilization

The build now uses the npm-pinned Three.js 0.180.0 package. Route chunks load on navigation, and the shared Three.js renderer chunk loads when a 3D scene mounts. Scene failures still leave the 2D links available.

Frontend deployment runs CI against a pinned backend fixture revision before publishing. It uploads hashed assets before updating the HTML and retains earlier assets for browsers still using an older page. The legacy creator and saved-sheet routes remain available.

The Lineage Creator is available in development. Production builds enable it only with `VITE_ENABLE_LINEAGE_CREATOR=true`. Keep it disabled until the deployed backend serves the Lineage catalog.

## Verification

All 108 frontend tests passed. Lint and the production build passed. Vite reported a chunk-size warning. No dependency cycles involve the new game modules.

The browser rendered the cabin using the pinned Three.js module and followed both 3D hotspots to the character roster and campaign creation. With the in-memory backend harness, the draft displayed all six Lineages from the current catalog, advanced from Stoneborn to Origin, and rotated the preview from south to southwest. The existing creator and a seeded Doctor sheet both opened. These checks used test fixtures.
