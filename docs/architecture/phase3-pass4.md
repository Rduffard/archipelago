# Phase 3, Pass 4 · Engine-owned resource transitions

The backend delegates manual pool spending and reserve-backed Initiative recovery to `@crossworld/sanguine-engine@0.2.0`. Both operations are already active under `resource.adjust`. They need only saved balances, earned pool maxima, and a recovery grant supplied by the backend. The transitions can run independently of replay, random dice, clocks, and persistence.

## Selected mechanics and characterization

| Operation | Behavior pinned before extraction |
| --- | --- |
| `spend-pool` | A positive safe integer can spend an earned pool exactly to zero. Unknown pool IDs, noninteger amounts, and insufficient balance retain their existing 400 errors. Saved pools above their maxima reject during runtime validation. Mixed operation fields still reject before spending. Existing JSON pool-key coercion is retained at the adapter. |
| `initiative-recovery` | Persistent Rage restores to its maximum and spends one reserve even at full balance. Storm Broker and Reef Colossus restore one use to an empty pool. Missing grants, nonempty single-use targets, and exhausted reserves retain their existing errors and rejection order. The backend still requires recorded Initiative and journals one use per pool per combat. |
| Reconciliation and rest | A Gunslinger who spent both Second Wind uses at level 3 reloads at zero. Advancement to level 4 increases the maximum from two to three and preserves the two spent uses. A Short Rest restores one use. |
| Command replay | The transaction fixture returns the original accepted response after a later revision. A rejected command changes neither the saved character nor its receipts. Replaying recovery spends no extra reserve and appends no journal entry. |

The three new characterization tests ran against the Pass 3 backend before any extraction. The focused run also included the existing resource and runtime boundary suites and passed all 24 tests. Expected balances, error text, journal keys and response shapes are fixed independently of the new engine.

## Resource API and integration

The new public subpath is `@crossworld/sanguine-engine/resources`.

| API | Inputs and result |
| --- | --- |
| `spendPool(pools, definitions, { poolId, amount })` | Accepts integer balances and granted definitions with a `max`. Returns a new pool map and an outcome with operation type, pool ID, amount, and remaining balance. |
| `recoverInitiativePool(pools, definitions, { poolId, reservePoolId, mode })` | Applies either `all` or `one-if-empty` recovery while spending one reserve. Returns the new pool map and an outcome with both IDs, reserve spent, uses restored, and target balance. |
| `ResourceTransitionError` | Reports stable mechanical codes for unavailable spending, unavailable recovery, a nonempty target, or an insufficient reserve. The engine error carries no HTTP status. |

`resourceTransitions.js` supplies the earned definitions and existing recovery pairings, translates mechanical errors to their existing backend messages, and writes back only the returned pool map. The engine outcomes remain internal and the public `operationResult` still contains the existing `resource.adjust` result. The arithmetic removed from `runtime.js` and `featureOperations.js` now has one owner. Feature costs for other operations, slot mechanics, rest orchestration, and advancement reconciliation retain their existing paths.

The character command handler retains authorization, envelope validation, receipt lookup, revision checks, state validation, transaction, compare-and-set save, receipt creation, and audit history. Receipt replay returns the saved response before executing another transition. The Initiative journal is appended after the transition succeeds. A rejected operation leaves the persisted balance, journal, revision and receipt set intact.

## Files changed

| Repository | Files |
| --- | --- |
| `sanguine-engine` | Added `src/resources/index.js` and `tests/resources.test.cjs`. Updated `package.json`, `README.md`, and `NOTICE.md`. |
| `crossworld_backend` | Added `src/modules/archipelago/system/rules2024/resourceTransitions.js`. Updated `runtime.js` and `featureOperations.js` in the same directory, `tests/phase2.commands.test.mjs`, `package.json`, and `package-lock.json`. Replaced the vendored archive. |
| `archipelago` | Updated `package.json` and `package-lock.json`, replaced the vendored archive, added a resource display test in `tests/phase2.test.mjs`, and added this report. Resource displays retain their existing API inputs. |

Both applications pin `file:vendor/crossworld-sanguine-engine-0.2.0.tgz`. SHA-256 of the engine pack and both vendored copies is `c3de888c9d6077982fa1f3dae7d53d7381b738928efb7b27ef084dee0cf37e88`. Both lockfiles passed `npm ci` in separate fresh directories using the established offline cache. The four earlier package exports and their notices remain available.

## Verification and compatibility

| Lane | Result |
| --- | --- |
| Engine | 10 passed, 0 failed. Tests cover immutable inputs, deterministic output, bounds including the maximum safe integer, and typed failures. An isolated packed install passed CommonJS, Node ESM, and Vite bundle execution for all five subpaths. |
| Backend | 589 passed, 0 failed, 1 environment-gated skip. Lint passed. |
| Frontend | 111 passed, 0 failed. A new render check confirmed that a serialized backend response displays the depleted pool at 0 / 3 and disables spending. Lint and production build passed. The test runner emitted the two existing WebSocket port warnings. Vite reported the existing chunk-size warning and an advisory for the temporary build directory. |
| Dependencies | Archipelago, the full backend and the engine each had zero cyclic components in the literal import scan, including function-local imports. |
| Isolated persistence | The established MongoDB URI was unset. Command replay, atomic rejection, and compatibility were exercised with fixtures, in-memory transactions, and HTTP. Live persistence parity remains open. |

The public catalog hash remains `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. The existing quoted ETag and conditional GET, `SA-CHAR-1`, ledger version 3, saved `srd-5.2.1` discriminator, one-Calling restriction, historical practice event fields, and `tabletopReady: false` are pinned by regression coverage.

## Recommended Pass 5

Extract pool reconciliation during advancement as the next deterministic slice. Pin equal, raised and lowered maxima, newly earned or removed grants, and depleted saved balances. Keep Health, spell slots, preparation and journal reconciliation with their current owners while isolating the pool calculation. Preserve advancement authorization, revisions and receipts in the backend and keep the isolated MongoDB lane as the persistence parity gate.
