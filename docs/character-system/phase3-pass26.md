# Sanguine Archipelago — Phase 3, Pass 26

## Activation audit and removal

The Pass 25 checkpoint and current source establish two former production entry points for generic activation: direct runtime dispatch in `runtime.js` and the corresponding `featureOperations.js` branch. The authenticated dispatcher and frontend had already moved to typed commands. The only remaining callers in the repositories were backend tests, including roster coverage and Measured Sacrifice characterization. The shared engine had no caller or adapter.

The per-feature inventory is in `crossworld_backend/tests/fixtures/phase3-generic-activation-inventory.json`. Each of its 55 entries records Calling, Path, unlock level, feature description, old costs and typed options with handler, action and cost data. All 55 are classification A: 54 have `ability.activate` options and Unbroken Current uses `health.damage`. No entry needed a new executable command. The generic cost-and-note recorder is classification C. Persistent effects produced by typed handlers are classification D and continue through those handlers. The typed mappings were rechecked on actual level-20 Path summaries against the inventory, including option descriptions, handlers and costs. The roster test checks the mappings across all applicable Paths. Existing typed suites exercise targets, timed effects, costs, action restrictions and receipt replay.

The old path spent listed pools, appended a UUID-bearing note effect without enforcing typed targeting, timing, or action restrictions, and evicted the first effect past its own 100-record limit. It included special Blood Price and Measured Sacrifice arithmetic. Those clauses already execute in the typed Conduit handler. Fresh direct activation now rejects. Explicit `end-feature-effects`, temporary Health, restoration, Initiative recovery and Relentless Rage remain separate runtime operations. Canonical instance IDs and manually ending an exact instance retain the Pass 25 contract.

Removed the branch, its note field, duplicate Conduit imports and exports, generic action fields in the vendored catalog and historical Path assembler, `featureActions` summary projection, and generic metadata-dependent option guard and placeholder. Feature IDs, descriptions, progression grants and typed options remain. Fresh catalog and summary payloads omit the retired fields. Authorized historical receipts still replay original responses through the existing transaction handler.

## Characterization and regression

Run `node crossworld_backend/tests/support/phase3-generic-activation-probe.mjs` from the workspace root. The optional argument writes normalized full observations. The pre-edit results are retained in `crossworld_backend/tests/fixtures/phase3-generic-activation-legacy.json`. Across 495 cases, 257 formerly successful observations now reject, 128 former rejections now return the unknown-operation error, 55 malformed-note errors now fail at the field boundary, and 55 stale-revision errors are identical. The same matrix covers repeated attempts, exhausted pools, incapacitation, timed expiry and feature-wide removal after a formerly successful activation.

| Matrix | Rows | SHA-256 |
| --- | ---: | --- |
| Generic pre-edit | 495 | `0bd6ff1b68db07822f14ae0c5a0b70df0d6320c03aa1135906fb134be5e43c99` |
| Generic post-edit | 495 | `36c988c5a45fc54ef1875e49465d532c4bebf8d45563fd44663cdce16b5f80c8` |
| Pass 25 identity | 56 | `bd033514241f33a79cb49defdcff723291ede73e5817434377961385a2720810` |
| Pass 24 saves | 4,275 | `eef4ae8fadc43ba9b2c419d760135b578d6592bd2c38a230908411cd024c71c3` |
| Pass 23 concentration | 8,544 | `cbd55f5b4e6f5742a3165810957e901bf27c1ed73812edd50795023fd02ac383` |
| Pass 22 features | 2,410 | `fc1954b6454c498d2e278c625bd0493fb2649882d337f21fb71da65be8db3656` |
| Pass 21 damage | 8,910 | `cf44472be92880c609b87d34232bef37ef4eef8277417c62b832f550f4e585e6` |
| Pass 20 vitality | 3,960 | `cf1d952ad06d55319577f1ddff86dbacd27570ffba6784ad3cca88b470a28a91` |
| Pass 19 rest | 2,640 | `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b` |

The typed recovery test retains the 245 supported pre-edit observations, excluding retired generic executions and metadata. The 112 resource transaction observations match after removing the retired summary/catalog fields from the prior snapshot. Canonical command tests retain exactly-once spending and effect behavior, stale checks, rollback, authorization, historical replay and digest conflicts.

## Files

- Backend rules under `src/modules/archipelago/system/rules2024/`: `runtime.js`, `featureOperations.js`, `conduitOperations.js`, `abilityOptions.js`, `engine.js`, `canonicalRules.json`, and `newPaths.js`.
- Backend tests: `tests/phase2.commands.test.mjs`, `tests/rules2024.completion.test.mjs`, `tests/phase3.contract.test.mjs`, `tests/rules2024.http.test.mjs`, `tests/support/phase3-generic-activation-probe.mjs`, and `tests/fixtures/phase3-generic-activation-{inventory,legacy}.json`.
- Frontend checkpoint: `docs/character-system/phase3-pass26.md`. The sheet already routes activation and removal through typed commands and needed no source edits.
- Shared engine and both consumer pins stay at **0.19.0**. No new deterministic rule was required for this cleanup.

## Verification

- Engine 64 passed, frontend 113 passed. Backend 636 passed across the full run and targeted reruns, with one isolated MongoDB skip because `SA_PHASE2_TEST_MONGO_URI` was unset. The full run passed 634 and failed two catalog snapshot assertions. Removing generic action metadata changed the catalog hash and ETag. After updating those expectations, both affected files passed all seven tests. A second full run after the snapshot updates was not performed.
- Backend and frontend lint, frontend production build and all 185 backend syntax checks passed. Engine and backend Archipelago dependency checks found zero cycles. Existing frontend map cycle and Vite bundle-size warning remain.
- All 30,795 retained observations matched the Pass 25 baselines, including the 56-row identity matrix. No database writes or schema changes were made.

## Phase 3 completion assessment

- **Critical:** No uncovered activation was found in the 55-entry audit. Typed handlers remain authoritative. Avoid creating a second execution path when extracting their rules.
- **Important:** Calling and Path progression, feature definitions and option schedules still live in the backend. Move portable definitions and deterministic progression and ability rules into the single engine in bounded slices. Start with a representative Calling and its Paths and verify catalog and level-by-level parity. Keep ledger persistence, target authorization, RNG, effect clocks and transactions in the host. Audit the surviving `rules-2024` route and names and old catalog assemblers before deleting them, with attention to persisted ledger tags and SRD attribution. Review which direct runtime operations have a supported caller before retiring more.
- **Deferred:** Cross-character Aura proximity, a general Reaction budget, effect lifecycle portability for Loom, and map dependency cleanup require their own integration work. The frontend still duplicates Exhaustion arithmetic for some checks and display formulas for Vital Circuit and spell reroll limits. Prefer shared calculations or projected values during the relevant extraction. Database-backed receipt and transaction coverage still requires the isolated Mongo URI.

**Pass 27:** Inventory the live catalog, progression grants and typed ability handlers by ownership. Extract a bounded set of portable Calling and Path rules, establish an explicit engine-to-host contract for their effects and costs, and verify levels 1–20 before repeating the pattern. Generic activation retirement is complete. The wider Phase 3 portability goal still has work before Lineages.

