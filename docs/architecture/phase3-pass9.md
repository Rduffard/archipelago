# Phase 3, Pass 9 — Earned Health and Hit Dice

`@crossworld/sanguine-engine@0.7.0` derives earned Health and Hit Dice from fixed, single-Calling progression. The backend supplies the character's level, Calling Hit Die, final Resolve, and earned Path bonus. It retains ledger replay, grant selection, current Health and available Hit Dice reconciliation, rest, and saved commands.

## Selected boundary

Both calculations lived in backend `system/rules2024/engine.js::replay`. Creation and preview, saved advancement, rebuild, model validation, and character reload all reach that same replay path. The calculation depended on the Calling Hit Die, the final Resolve modifier, the single-Calling level count, and Omen Diver's earned bonus. These facts can be passed explicitly without moving a Calling, Path, feature, or progression table.

Training's level bonus already belongs to the dedicated engine Training module. Ability improvements depend on feat choices, prerequisites, and attribute caps. Broader Calling, Path, and pool entitlements depend on existing schedules and replay decisions. Those boundaries were deferred to keep this pass scoped to one calculation with existing callers.

## Characterized Pass 8 behavior

The new numeric fixture and the strengthened command and rebuild fixtures passed before changing the production calculation.

| Character | Final Resolve | Earned Health | Earned Hit Dice |
| --- | --- | --- | --- |
| Tidecaller level 1 | 15 | 8 | 1d6 |
| Tidecaller level 2 | 15 | 14 | 2d6 |
| Omen Diver level 3 | 15 | 23 | 3d6 |
| Memory Echo level 3 | 15 | 20 | 3d6 |
| Bloodwake level 19 | 15 | 176 | 19d12 |
| Bloodwake level 20 | 19 | 225 | 20d12 |

The first level starts from the full Hit Die. Later levels start from half the Hit Die plus one. The final Resolve modifier applies to every level, with a minimum contribution of one Health per level. A level-two Tidecaller with Resolve 3 gets two Health at level 1 and one at level 2. Omen Diver's earned bonus is added after those floors and includes all Calling levels when the Path unlocks. The level-20 Reaver capstone applies its Resolve change retroactively. The existing ledger guards reject rolled gains and multiple Callings.

The saved Gunslinger fixture advanced from level 2 to 3 and then 4 with five missing Health and two spent Hit Dice. Current Health remained five below the new maxima, at 23/28 and 31/36. Available Hit Dice grew to one and then two while earned dice grew to three and four. JSON reload retained the result. Receipt replay returned the original accepted response. Stale and invalid requests left saved state, revisions, and receipts intact. An existing rest and rebuild fixture verified that rebuild preview and commit kept 21/36 Health and two available Hit Dice.

## Engine API and integration

`@crossworld/sanguine-engine/progression` exports `deriveVitalityProgression({ level, hitDie, resolve, bonusHealth = 0 })` and `ProgressionInputError`. The function returns fresh `{ health: { max }, hitDice }` data and uses the existing engine attribute modifier. Inputs accept levels 1–20, numeric Hit Dice 6, 8, 10, or 12, Resolve 1–30, and a nonnegative safe-integer bonus. Invalid inputs and unsafe totals raise `INVALID_VITALITY_PROGRESSION` with the affected field. The backend's existing ledger guards still handle user-facing invalid requests before calling this function.

Replay now supplies the inputs once and returns the same `health` and `hitDice` summary fields. The engine calculates the first-level and later fixed gains, their per-level floors and sum, the bonus addition, and earned die counts. The backend still determines whether the Omen Diver bonus is earned. The old per-event gain accumulator, sum, Hit Dice aggregation, and unreachable rolled-gain branches were removed. The application retains current Health and spent-dice policy, with no second implementation of the earned values.

## Codebase impact

Counts compare the Pass 9 working tree against the actual pre-pass working files using Git `--numstat`. New files count all physical lines, including blank lines. Dependency metadata, archives, and documentation are excluded from the source and test measurements.

| Measure | Result |
| --- | --- |
| Backend production source files modified | 1 |
| Backend named production functions removed | 0. Inline calculations and unreachable branches removed from `replay`. |
| Backend production source lines | 20 removed, 8 added, net −12 |
| Engine production source lines | 29 added |
| Tests | Backend 29 added and 1 removed, engine 51 added, frontend 0. Total 80 added, 1 removed. |
| Mechanical authority | Earned Health and Hit Dice now have one owner in the engine. Calling data, Path eligibility, and saved balance policy remain in the backend. |

The engine test compares 4,800 combinations of level, Hit Die, Resolve, and bonus against per-level accumulation. A comparison with the pre-pass replay produced byte-identical JSON for ten representative summaries spanning all eight Callings and an incomplete level-three Path choice. The backend additions pin representative replay, command, and rebuild behavior. The full existing progression suite supplies roster coverage.

## Files changed

| Repository | Pass 9 changes |
| --- | --- |
| Engine | Added `src/progression/index.js` and `tests/progression.test.cjs`. Updated `package.json` and `README.md`. |
| Backend | Updated `src/modules/archipelago/system/rules2024/engine.js`, `tests/phase2.acceptance-numbers.test.mjs`, `tests/phase2.commands.test.mjs`, and `tests/phase3.hit-dice.test.mjs`. Updated both npm manifests and the vendored archive. |
| Frontend | Updated both npm manifests and the vendored archive. Added this report. |

## Package and verification

Version 0.7.0 adds `/progression` alongside `/attributes`, `/point-buy`, `/dice`, `/training`, `/resources`, `/hit-dice`, `/spell-slots`, and `/preparations`. The packed artifact includes the license and provenance notices. Both apps pin `file:vendor/crossworld-sanguine-engine-0.7.0.tgz` and identical lockfile integrity. SHA-256 of the engine pack and both vendored copies is `f9acd6703a9bfeed3f548263e54e430da4ad5887d8296b2af09c9226029a5ad6`. Fresh offline `npm ci` passed in both consumers. A separate packed consumer exercised all nine exports through CommonJS, Node ESM, and a browser-targeted Vite bundle with a minimal DOM stub.

| Lane | Result |
| --- | --- |
| Engine | 31 passed, 0 failed. |
| Backend | 607 passed, 0 failed, 1 isolated MongoDB skip. Lint passed. |
| Frontend | 112 passed, 0 failed. Lint and production build passed. Existing WebSocket port and chunk-size warnings recurred. |
| Dependency scans | Zero cycles in the Archipelago backend, full backend, and engine. The JSX-aware scan reproduced the existing frontend cycle among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Live persistence | The isolated MongoDB URI was unset. Authenticated HTTP and in-memory transaction fixtures passed. Live MongoDB transaction and persistence parity remain unverified. |

Contract coverage pins `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, catalog hash `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`, quoted ETag, historical practice fields, and `tabletopReady: false`. The full progression suite covers eight Callings, 32 Paths, and levels 1–20, including level-three Path selection, attribute choices, Training, equipment, spellcasting, and resources.

## Recommended Pass 10

Characterize the repeated Path resource capacity formula shared by Drydock Ghost, Storm Broker, Field Surgeon, and Breakwater. Pin the unlock, each four-level increase, and the level-20 capacity before extracting a shared calculation. Keep Path selection, pool IDs, recovery rules, and the named Path schedules in the backend.
