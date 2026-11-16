# Phase 3, Pass 10 — Shared Path resource capacity

`@crossworld/sanguine-engine@0.8.0` now owns the capacity calculation for four Path pools. The backend supplies the Calling level and unlock, identifies the earned Path and pool, and retains ability costs, spending, recovery, advancement, rebuild, and persistence.

## Pass 9 behavior

All four definitions used `2 + Math.floor((n - 3) / 4)` inline in `system/rules2024/engine.js::resourcePools`, where `n` is Calling level. The branch ran for the selected Path. Ledger replay allows that Path selection at level 3.

| Calling | Path | Pool | Feature consumers |
| --- | --- | --- | --- |
| Shipwright | Drydock Ghost | `drydock-ghost:ghost-work` | Ghost Patch, Silent Keel, Unseen Passage |
| Navigator | Storm Broker | `storm-broker:squall` | Squall variants, Eye of the Bargain reaction and Initiative recovery |
| Doctor | Field Surgeon | `field-surgeon:triage` | Triage, Battlefield Procedure antidote |
| Shipwright | Breakwater | `breakwater:bastion` | Barrier placement, Reinforced Anchorage |

| Calling levels | Capacity |
| --- | --- |
| 1–2 | Pool absent |
| 3–6 | 2 |
| 7–10 | 3 |
| 11–14 | 4 |
| 15–18 | 5 |
| 19–20 | 6 |

Each pool recovers one use on a Short Rest and all uses on a Long Rest. Storm Broker's additional Initiative recovery uses its separate reserve and the existing saved combat checks. Replay publishes maxima for the sheet, abilities, runtime validation, advancement, and rebuild. The command and rest paths apply costs and recovery to saved balances.

The two new backend fixtures ran against Pass 9 before production edits. The targeted files passed all 29 tests. For each Path, fixtures cover levels 1, 2, 3, 4, 6, 7, 10, 11, 14, 15, 18, 19, and 20. An incomplete Path choice, a different Path, and a non-granting Calling leave the pool absent. Ledger levels 0 and 21 and duplicate Path choices reject. A direct synthetic call to the old internal pool builder could produce one use when a caller supplied an already-selected Path at level 2. The new helper returns zero there, matching the reachable replay behavior. No production caller supplies that combination.

## Engine API and integration

`derivePathResourceCapacity({ level, unlockLevel })` extends `@crossworld/sanguine-engine/progression`. It accepts integer levels 1–20, returns zero before the supplied unlock, starts at two, and adds one for each completed four-level interval. The API has no configurable cap or increment. Invalid inputs raise `ProgressionInputError` with code `INVALID_PATH_RESOURCE_CAPACITY` and the affected field. The existing vitality export and its error contract remain available.

The backend's four Path-to-pool mappings now use one engine call. The backend still supplies level 3 and the recovery values. The separate Salvage, Eye Reserve, Operation, and Hold the Sea grants retain their existing thresholds. A comparison against Pass 9 matched all 80 serialized replay summaries byte for byte for the four affected Paths at levels 1–20.

For each Path, an in-memory transaction fixture spent one of two uses at level 6. Advancement to level 7 raised capacity to three and preserved the one spent use, leaving two available. JSON reload retained both values. Receipt replay returned the original response, and stale and invalid advancement left the character, balances, revision, and receipts intact. Rebuild preview left saved balances in place. Commit removed the pool when rebuilding away, and rebuilding back granted a maximum of three with zero available. The next Short Rest restored one and recorded the rest journal.

## Codebase impact

Counts use Git `--numstat` against pre-pass working files and include blank lines. The source and test counts exclude manifests, lockfiles, archives, and docs.

| Measure | Result |
| --- | --- |
| Duplicated backend formula instances removed | 4 |
| Backend production source | 17 removed, 15 added, net −2 across one file |
| Engine production source | 21 added, 3 removed, net +18 across one file |
| Tests | Backend 97 added, engine 28 added and 1 removed, frontend 0. Total 125 added and 1 removed. |
| Obsolete helpers removed | None. The duplicates were inline. |
| Remaining copies | Zero copies of the four-level capacity formula in backend Archipelago production code. |

## Files changed

| Repository | Changes |
| --- | --- |
| Engine | `src/progression/index.js`, `tests/progression.test.cjs`, `package.json`, and `README.md`. |
| Backend | `src/modules/archipelago/system/rules2024/engine.js`, `tests/phase2.acceptance-numbers.test.mjs`, `tests/phase2.commands.test.mjs`, both npm manifests, and the vendored archive. |
| Frontend | Both npm manifests, the vendored archive, and this report. |

## Verification

Version 0.8.0 adds a named function to the existing `/progression` export. The packed artifact retains all nine public subpaths and the license and provenance notices. Both apps pin `file:vendor/crossworld-sanguine-engine-0.8.0.tgz` with the same lockfile integrity. The engine pack and both vendored copies share SHA-256 `081f0bbd8dfbaab509c66394d80ae2fbdb3fc3e06ddc099f79df570a446be36c`. Fresh offline `npm ci` passed in both consumers. A separate packed consumer exercised CommonJS, Node ESM, and a browser-targeted Vite bundle with a minimal DOM stub.

| Lane | Result |
| --- | --- |
| Engine | 34 passed, 0 failed. |
| Backend | 609 passed, 0 failed, 1 isolated MongoDB skip. Lint passed. |
| Frontend | 112 passed, 0 failed. Lint and production build passed. Existing WebSocket port and chunk-size warnings recurred. |
| Dependency graphs | Zero cycles in Archipelago backend, full backend, and engine. The JSX-aware frontend scan reproduced the existing cycle among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Live persistence | The isolated MongoDB URI was unset. Authenticated HTTP and in-memory transaction fixtures passed. |

The full backend suite covers eight Callings, 32 Paths, levels 1–20, single-Calling validation, rest and recovery, and practice compatibility. Contract tests preserve `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, the catalog hash and quoted ETag, command envelopes and receipts, historical practice fields, and `tabletopReady: false`.

## Recommended Pass 11

Characterize the shared saved casting-turn budget used by spells, scrolls, and charged items. Extract only the deterministic per-turn flag transition and rejection order. Keep turn identity, casting eligibility, command execution, and journal storage in the backend.
