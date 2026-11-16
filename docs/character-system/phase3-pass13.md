# Phase 3, Pass 13 — Shared spell-slot accounting

`@crossworld/sanguine-engine@0.11.0` owns the balance change for manual slot spending, slot-to-Sorcery Point conversion, Warden feature restoration, ordinary casting and Contingency. All five paths deduct one from the available total when they spend a slot and consume one created marker if present. A positive marker count can exceed the total. At zero total, a marker cannot fund expenditure.

## Command audit

The authenticated character command endpoint dispatches through `characters/commands.js`. Manual spending and conversion require character ownership. The handler authorizes the actor before receipt lookup. A matching receipt returns the original response, a changed payload with the same operation ID conflicts, and a new request with a stale document revision fails before rule execution. New commands replay the character ledger and work on a cloned character.

| Path | Validation and rejection order | Additional effects |
| --- | --- | --- |
| `resource.adjust` / `spend-slot` | The command accepts registered manual expenditures. `runtime.update` validates saved state and the runtime revision, rejects mixed fields with `Mixed resource operation`, then requires an integer level in the saved allocation and a positive total. An invalid selection or empty balance returns HTTP 400 with `Unavailable spell slot`. | Deduction only. The slot command supports neither increases nor absolute assignment. |
| `resource.convert` / `slot-to-sorcery` | After command, saved-state and runtime revision validation, mixed fields return `Mixed conversion operation`. The requested level and Sorcery Point pool must exist or the command returns `Unavailable conversion`. An empty slot or an over-cap conversion returns `No slot or Sorcery Point capacity`. These runtime errors are HTTP 400. | Grants Sorcery Points equal to the slot level. This path has no separate action gate. |
| `resource.convert` / Warden `restore-feature` | After command, saved-state and runtime revision validation, `featureOperations.apply` checks allowed fields and requires an exhausted registered pool before checking the eligible Warden pool, level five and slot availability. Its HTTP 400 errors include `Feature must be exhausted` and `Level five slot required`. The three Bonus Action restorations then check Incapacitated. | Sets the chosen pool to one. The Bonus Action clears effects marked `endsAfterAction`. Leviathan Anchor's Nimbus restores without an action. Non-Warden restoration branches still pay their own pool costs. |
| `spell.cast` / ordinary slot expenditure | `spellOperations` validates the spell, source and Metamagic before the slot path. It checks the minimum spell level. `slotCasting` translates unavailable slot facts to HTTP 422 with `Choose an available spell slot` before any Recall roll or turn budget check. | Eligible Spell Recall can preserve both balances. The backend supplies the trusted d4. Casting records the actual expenditure in the turn budget and cast journal after the existing casting checks. Contingency retains its separate checks and both payments bypass Recall. |

The three resource commands increment the runtime revision and return the existing `operationResult.type`. They append no cast journal entry. The character command path validates the result, increments the document revision, and writes the revision-guarded character update and command receipt in the same transaction. Runtime validation requires a created-marker array parallel to the totals, including for manual spending, so the former optional access did not represent a supported missing-marker state.

## Engine and backend changes

`/spell-slots` exports `deductSpellSlot({ slotLevel, available, created })`. It validates the level and counts and returns fresh `{ available, created }` balances with stable `SpellSlotExpenditureError` codes. The existing casting API and the direct deduction API both use the same private validation and balance functions. Casting retains its separate Recall validation and result fields. The public package subpath map already exposes this module.

The backend adds one adapter in `spellSlotState.js` to read and apply the selected level. The two branches in `runtime.js` and the Warden branch in `featureOperations.js` now call it. This replaces six backend decrement lines with three adapter calls and removes three created-marker branches. The engine adds the direct entry point and replaces its casting-specific decrement expressions with the shared calculation. The tests add a command transition matrix, a transaction/replay fixture and two engine cases.

| Repository | Pass 13 files |
| --- | --- |
| Engine | `src/spell-slots/index.js`, `tests/spellSlotExpenditure.test.cjs`, `package.json`, `README.md` |
| Backend | `src/modules/archipelago/system/rules2024/runtime.js`, `featureOperations.js` and `spellSlotState.js` in the same directory, `tests/phase2.commands.test.mjs`, `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.11.0.tgz` |
| Frontend | `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.11.0.tgz`, and this report |

## Characterization and parity

- Before the production edit, three targeted tests passed on v0.10.0, including the existing four-Path Warden action regression. The same **326 serialized command outcomes** matched after extraction. The matrix exercises slot levels 1–9, invalid requests, balances of zero through two, markers exceeding totals, Sorcery Point capacity and pool eligibility, and Warden availability and exhaustion. It compares response data, stable character changes, and error status, code and message. Randomly identified fixture gear is checked for equality separately. Every case checks that the input character stays unchanged. The serialized baseline SHA-256 is `6d4f41df65b98bd85f3d42de388a046fcd765c1238339b721ae97f5638ad770a`.
- Transaction fixtures exercised manual spending followed by conversion on the same character, and Warden restoration on another character. Each success committed one revision and one receipt and applied the expected balance and pool change. Unauthorized, stale and ineligible operations left the full saved state and receipts intact. Receipt replay returned each original response and generated zero die rolls.
- The engine compared 81 valid direct deductions with cast expenditure that bypasses Recall and checked invalid inputs separately. The existing cast, Spell Recall, Contingency and turn-budget tests also ran in the backend suite.

## Package and verification

Both consumers pin the private `file:vendor/crossworld-sanguine-engine-0.11.0.tgz` archive. Independent packs and both consumer archives produced SHA-256 `45abfcd1e0e278cdef5627cc473b5e6ac3eb70c67451dc63d3e1dd3d0c23eccc`. The matching lockfile integrity is `sha512-+BHFvh7VsGDadA+t0zwDs+a1xdYh+Dmnog+08hd1R737JwZMlYdLPR8pTt6jbCO+rRzS3Ux3Vu6CaRNvmaVQfg==`.

| Lane | Result |
| --- | --- |
| Engine | 43 passed |
| Backend | 616 passed, zero failures, one isolated MongoDB test skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. Authenticated HTTP and in-memory transaction tests passed. |
| Frontend | 112 passed. The existing Vite WebSocket port warning recurred. |
| Lint | Backend and frontend passed. |
| Frontend production build | Passed. The existing chunk-size warning recurred. |
| Dependency scans | Zero cycles in the engine, Archipelago backend and full backend. The frontend still has the existing cycle among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx` and `ShapeEditorLayer.jsx`. |
| Package consumers | Fresh offline `npm ci` passed in both apps. All ten public subpaths loaded through CommonJS and Node ESM, and a browser-targeted Vite bundle executed the new deduction API. |

## Remaining ownership and Pass 14

The backend owns Sorcery Point conversion eligibility, rates and caps, slot creation, Warden eligibility and action effects, slot recovery, and the saved resource representation. Authorization, trusted dice, transactions, receipt replay and persistence remain application responsibilities.

For Pass 14, audit and characterize the two Sorcery Point conversion directions and consider extracting the deterministic conversion rates, eligibility facts and pool-capacity calculation into the engine. Include the slot-creation cost table and created-marker bounds in that audit, while keeping command dispatch, error translation, persistence and Warden restoration outside that extraction.
