# Phase 3, Pass 3 · Runtime validation and execution boundaries

Pass 3 eliminated the 10-file backend dependency cycle left by [Pass 2](phase3-pass2.md). Saved-state validation and character equipment projection now run without loading command handlers. The existing runtime facade still exposes the same initialization, projection, validation, and update entry points.

## Dependency graph

Run `node scripts/archipelago-dependencies.cjs` from the backend. Pass `src` to scan the entire backend. The scan follows literal relative JavaScript imports and includes function-local requires. The module-scope column is lexical. The cold-load tests separately check which modules CommonJS actually loads.

| Scope | Before | After |
| --- | --- | --- |
| Archipelago including function-local imports | One component of 10 files | Zero cyclic components |
| Whole backend including function-local imports | One component of 10 files | Zero cyclic components |
| Module-scope imports only | Zero cyclic components | Zero cyclic components |
| Independent engine | Zero cyclic components | Zero cyclic components |

Here `R` denotes `system/rules2024` and `E` denotes `equipment`. These are the direct edges removed from the former component.

| Importer | Removed targets | Replacement |
| --- | --- | --- |
| `R/runtime.js` | `R/{featOperations,folioOperations,vitality,clock}.js` | Read-only runtime validation, feat journal recovery, Health primitives, and read-only effect timing. |
| `R/featOperations.js` | `R/{equipmentView,runtime}.js` | A narrow attack lookup supplied by the character command adapter and direct use of `runtimeValidation.js`. |
| `R/featureOperations.js` | `R/{featOperations,vitality}.js` | Shared action-expiry and Health primitives. |
| `R/selections.js` | `E/magic.js`, `R/{clock,vitality}.js` | Magic equipment projection, effect-time reads, Health predicates, and damage-type definitions. |
| `R/equipmentView.js` | `R/{clock,covenantOperations}.js` | Read-only effect timing and held-shield facts. |
| `R/clock.js` | `R/vitality.js` | Health state primitives. |
| `R/vitality.js` | `R/runtime.js` | Recipient effects now compose recovery above both Health and runtime. |
| `R/covenantOperations.js` | `R/clock.js` | Read-only effect timing. |
| `E/magic.js` | `R/vitality.js` | Read-only incapacitation predicate. |

Outside the former component, runtime validation no longer imports Conduit execution, folio commands no longer replay the ledger themselves, and ability, strike, tool-check, and spell-reroll handlers call validation directly. The catalog and inventory still load independently of replay and feature dispatch.

## Validation and projection

- `runtimeValidation.js` owns resource bounds, preparation checks, and persisted-state validation. `runtimeJournals.js` validates saved feat, folio, discovery, and Conduit records with the existing rules, errors, limits, and definition IDs. `validateProjected` accepts a current projected summary and validates the saved state directly. `validate` still projects before validating so lost folios, remembered spells, and saved replacements are interpreted as before.
- `selections.js` builds a projection from a cloned summary. Rest-driven replacement writes moved to `selectionOperations.js`. `magicProjection.js` applies held, worn, and attuned item facts to the projection-owned copy. `covenantState.js` supplies shield and Guard queries without loading Covenant commands.
- A summary can be reused while its ledger, effects, selections, preparation grants, and relevant gear facts still describe the same state. The Savage Attacker path takes its projection after command-level expiry and resolves only the requested attack after trigger and turn validation. The intervening feat journal write does not change any of the queried weapon facts. The adapter owns this lookup and the feat handler has no reverse import into equipment projection. Existing callers that mutate relevant state before a live lookup can still request fresh derivation.
- Folio commands receive the unprojected ledger-granted folio separately from the live casting projection. Copying and rebuilding still write only the eligible copied grants, with the same authorization, elapsed-time, and copper checks.

## Timing, vitality, and recovery

`effectTime.js` supplies the existing world-time read and active-effect predicate. `clock.js` retains the timing transition and its ordering. It filters timed effects and effects ended by incapacitation, clears pending Rage when applicable, performs stable recovery, clears expired temporary Health, and prunes concentration checks. Explicit world time remains in milliseconds. The existing host-clock fallback applies to unanchored characters.

`healthState.js` holds state predicates and elementary Health transitions. `vitality.js` retains damage, conditions, death saves, and concentration resolution. `healingEffects.js` applies recipient effects and composes Prayer of Healing with the same Short Rest transition, including its Long Rest epoch guard. The runtime still owns rest recovery and the shared active-turn casting journal. `featState.js` owns action-based effect expiry, grant keys, and feat journal recovery. Nimbus and the three other Warden restoration paths retain their existing action costs and fifth-level slot expenditure.

## Files changed

| Area | Files |
| --- | --- |
| New rules boundaries | `system/rules2024/{covenantState,effectTime,featState,healthState,healingEffects,runtimeJournals,runtimeValidation,selectionOperations}.js` |
| Updated rules consumers | `system/rules2024/{abilityOperations,attackRecords,clock,conduitOperations,covenantOperations,equipmentView,featOperations,featureOperations,folioOperations,healingSpells,runtime,selections,spellRerolls,strikeOperations,toolChecks,vitality}.js` |
| Equipment | Added `equipment/magicProjection.js`. Updated `equipment/{magic,utilization}.js`. |
| Character orchestration | `characters/{commands,rebuild}.js` |
| Regression coverage | Added `tests/phase3.runtime-boundary.test.mjs`. Extended `tests/phase3.catalog-boundary.test.mjs`. |
| Frontend and engine | This report is the only frontend file added in Pass 3. Engine sources, package version, tarballs, and consumer lockfiles retain their Pass 2 contents. |

## Verification

Five independent characterization tests passed before the edits. They pin saved journal acceptance and rejection, preparation after folio loss, read-only equipment projection, expiry at an exact in-world boundary, stable recovery ordering, temporary Health, active-turn retention on rest, and damage before healing. The pre-change targeted suites also passed for feat expenditure and eligibility, folio copying and rebuild, cast/scroll/item turn sharing and Quickened Spell, Nimbus and Warden restoration, time and duration, Prayer of Healing, and command receipt replay. The post-change cold-load test checks that validation and equipment projection do not load those command modules.

| Lane | Result |
| --- | --- |
| Backend | 586 passed, 0 failed, 1 skipped across 69 files. Lint passed. The full suite included authenticated catalog ETag, saved replay, shared HTTP, and practice combat coverage. |
| Frontend | 110 passed, 0 failed. Lint and production build passed. Vite reported two existing WebSocket port warnings during tests and the existing chunk-size warning at build. |
| Engine | 6 passed, 0 failed. A fresh pack matched both vendored copies byte for byte and passed CommonJS, ESM, and Vite bundle execution for all four exports. Version remains `0.1.0`. |
| Isolated persistence | Real MongoDB remained environment-gated. Tests used saved fixtures, in-memory persistence, and authenticated HTTP. |

Catalog SHA-256 remains `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. The quoted ETag and conditional GET behavior, `SA-CHAR-1`, ledger version 3, legacy `srd-5.2.1` discriminator, historical practice `proficiency`, and `tabletopReady: false` retain their existing contracts.

## Recommended Pass 4

Extract a bounded resource-transition slice behind the existing backend adapter. Start with a fixture-backed resource spend or recovery operation whose inputs and returned state can be expressed independently of replay, time, dice, and persistence. Keep revision handling and receipts in the backend and make trusted time and roll inputs explicit before moving time-driven or random transitions. Current verification covers literal imports and exercised runtime paths. An isolated MongoDB run remains the gate for live persistence parity.
