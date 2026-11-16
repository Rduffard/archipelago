# Phase 3, Pass 6 — Hit Dice reconciliation

`@crossworld/sanguine-engine@0.4.0` owns deterministic Hit Dice reconciliation for character advancement and rebuild. The backend computes earned Hit Dice through Calling progression and ledger replay, selects the reconciliation policy, validates the saved state, and owns rest commands, authorization, revisions, receipts, and persistence.

## Characterized behavior

The earned allocation lives in `summary.hitDice`. The available balance lives in `rulesRuntime.hitDice`. Both serialize as die-keyed integer maps such as `{ "d10": 3 }`. Rebuild previews continue to expose the reconciled map under `consequences.hitDice`.

| Allocation change | Advancement | Rebuild |
| --- | --- | --- |
| Same maximum | Retain the available balance. | Retain the available balance. |
| Higher maximum | Preserve spent dice by type. A balance of 3 out of 5 becomes 4 out of 6. | Preserve spent dice and cap availability at the old balance. The same case becomes 3 out of 6. |
| Lower maximum | Subtract the previously spent dice from the new maximum, with a floor of zero. A balance of 3 out of 5 becomes 2 out of 4 or 0 out of 2. | Use the same calculation and retain the old-balance cap. |
| New die type | Start at the earned maximum. | Start at zero. |
| Removed die type | Omit it from the returned map. | Omit it from the returned map. |

The pre-extraction run passed the new deterministic fixtures, including fully available and fully spent balances, reductions to zero, malformed saves, and rest interactions. The real single-Calling rebuild fixture replaces the old die type with a new type at zero. A synthetic multi-die fixture pins ordering and simultaneous grant changes inside the reconciler.

A command fixture spends two dice on a Short Rest, raising Health from 1 to 13 and reducing availability from 3 to 1. Advancement raises the allocation to 4 and availability to 2. A JSON reload and rebuild preserve both the balance and Short Rest history. A request to spend three dice is rejected. The following Long Rest restores all four dice and appends its journal entry. Rest duration, the 24-hour Long Rest restriction, the existing Short Rest spend and roll limits, and the recovery amount remain under the backend runtime.

## Engine and backend integration

`reconcileHitDice(previousAllocation, previousState, nextAllocation, policy)` is available from `@crossworld/sanguine-engine/hit-dice`. It accepts plain maps and the explicit `advance` or `rebuild` policy, returns a new balance map in next-allocation order, and leaves input maps intact. It depends on standard JavaScript and has no clock or roll input.

Malformed transition inputs raise `HitDiceReconciliationError` with code `INVALID_HIT_DICE_RECONCILIATION` and the affected die when available. The backend adapter translates the error to the existing HTTP 400 `Invalid saved hitDice` response. The engine rejects numeric strings and other noninteger counts for participating die types. Its historical nullish-balance fallback and zero floor for negative integer balances remain for internal reconciliation. Public saved-state validation still rejects missing, unknown, negative, fractional, text, and over-allocation balances.

The advancement reconciler and rebuild planner both call the backend adapter. Their former inline Hit Dice calculations were removed. Replay still derives the earned allocation. The rest runtime and saved command execution path retain their existing responsibilities.

An in-memory transaction fixture advances a Gunslinger with depleted Hit Dice twice, from 0 out of 2 to 1 out of 3 and then to 2 out of 4. Replaying the first receipt after the second advancement returns the original response. A distinct stale command returns 409, and both replay and rejection leave the committed character and receipt set intact. JSON reload preserves the current count. The fixture also rejects an invalid level request before advancement and verifies that the character and receipt set remain as they were.

## Files changed

| Repository | Pass 6 files |
| --- | --- |
| Engine | Added `src/hit-dice/index.js` and `tests/hitDice.test.cjs`. Updated `package.json` and `README.md`. |
| Backend | Updated `characters/rules2024.js`, `characters/rebuild.js`, and `system/rules2024/resourceTransitions.js` under `src/modules/archipelago`. Added `tests/phase3.hit-dice.test.mjs` and extended `tests/phase2.commands.test.mjs` and `tests/phase2.rebuild.test.mjs`. Updated the manifest, lockfile, and vendored package. |
| Frontend | Updated the manifest, lockfile, and vendored package. Extended `tests/rules2024.test.mjs` to render serialized depleted and recovered balances and assert the corresponding rest controls. Added this report. |

## Package verification

Version 0.4.0 exports `/attributes`, `/point-buy`, `/dice`, `/training`, `/resources`, and `/hit-dice`. The packed artifact includes the license and notice files. Both apps pin `file:vendor/crossworld-sanguine-engine-0.4.0.tgz`. A fresh pack and both vendored archives produced SHA-256 `aa59c23fd6958a8a6f4fdf6bb520df40fa11ffcf1d581fe0a33bfc03dbc1fa83`. Both lockfiles record the same integrity, and fresh offline `npm ci` installs succeeded in separate directories.

A separate consumer installed the tarball and exercised all six subpaths through CommonJS and Node ESM. Its Vite build and browser-targeted bundle execution also passed.

## Verification

| Lane | Result |
| --- | --- |
| Engine | 18 passed, 0 failed. |
| Backend | 598 passed, 0 failed, 1 isolated MongoDB skip across 71 test files. Lint passed. A focused rerun after strengthening receipt assertions passed all 33 tests. |
| Frontend | 111 passed, 0 failed. Lint and production build passed. Vite reported the existing chunk-size warning. |
| Dependency graph | Zero cycles in the Archipelago backend, full backend, and engine. The JSX-aware scan reproduced the existing frontend cycle involving `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Isolated persistence | The isolated MongoDB test URI was unset. Fixture, authenticated HTTP, and in-memory transaction tests passed. Live MongoDB parity remains unverified. |

Regression coverage preserved the catalog hash `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`, the quoted ETag and conditional response, `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, and `tabletopReady: false`. It also covers command envelopes, practice behavior, and the eight Callings, 32 Paths, and levels 1–20 under the existing single-Calling rule.

## Recommended Pass 7

Characterize ordinary spell-slot reconciliation as the next deterministic slice. Pin advancement and rebuild balances for increased, decreased, and newly unlocked slot levels. Use fixtures to distinguish ordinary slots from created slots, then extract only the arithmetic supported by those fixtures. Keep spell-slot conversion, rest execution, and receipt handling in the backend.
