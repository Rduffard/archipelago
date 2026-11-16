# Phase 3, Pass 12 — Spell-slot expenditure

`@crossworld/sanguine-engine@0.10.0` calculates slot expenditure for ordinary spells and both slots spent when preparing Contingency. The backend supplies the selected balance, establishes Spell Recall eligibility, generates the trusted d4 when requested, and applies the returned balances to the cast's working state.

## Previous implementation and ownership

`characters/commands.js` authorizes the authenticated actor, looks up the receipt and checks the document revision before command execution. A matching receipt returns the saved response. The spell command replays the character ledger and dispatches to `spellOperations.cast`, which projects spell eligibility and operates on cloned runtime and inventory. Before extraction, `spellOperations.js` checked the requested slot and `slotCasting.js` repeated availability validation, generated the d4, determined expenditure and updated both saved arrays.

| Case | Characterized behavior |
| --- | --- |
| Normal expenditure | Subtract one from `slots[level - 1]`, which includes both ordinary and created slots. If a created marker exists at that level, subtract one from `createdSlots[level - 1]` first in resource terms. Counts at other levels stay intact. |
| Spell Recall | An eligible cast rolls once for slot levels 1–4. A matching d4 preserves both counts. A nonmatching roll spends a slot with the same created-slot precedence. The response includes `spellRecall` with `roll`, `slotLevel` and `preserved`. |
| Ineligible sources | A cast without the feat, a slot of level 5–9, and Contingency's slot payments skip Recall. Cantrips, rituals, slotless feature castings, scrolls and charged items use their existing source paths. |
| Contingency | The primary cast must expend a slot. The contingent spell pays its slot after its own component and material checks. The stored trigger later resolves with no additional expenditure. |
| Unavailable or malformed slot request | A fractional, missing, nonnumeric, out-of-range or below-spell-level selection, or a zero balance, returns HTTP 422 with `Choose an available spell slot` in the ordinary slot path, before Recall or turn-budget evaluation. Contingency retains its separate contingent spell level error. |
| Created markers versus total | Saved validation allows the marker count to exceed the available total. A positive total can still spend one created marker. A marker with zero total cannot fund a cast. |
| Turn budget | The turn receives `spentSlot`, while the casting journal also records `usedSlot`. Recall can produce `usedSlot: true` and `spentSlot: false`, so a recalled leveled cast can follow a slot-spending cast when other turn restrictions permit it. |

The Recall catalog prose does not name the existing Contingency exception. Both payments already bypassed Recall and this pass preserves that rule. Zero-balance Recall cannot reach the d4. A level-five-or-higher slot cannot produce a Recall record.

## Engine API and backend integration

The existing `/spell-slots` subpath now exports `requiresSpellRecallRoll(input)`, `calculateSpellSlotExpenditure(input, roll)` and `SpellSlotExpenditureError`. The input carries `slotLevel`, total `available`, `created` markers and `recallEligible`. The calculation returns fresh `available`, `created`, `spentSlot` and optional `spellRecall` fields. An eligible request needs an explicit integer d4. The function rejects malformed facts and unexpected or invalid rolls. It uses no random source and mutates no input.

The backend adapter validates availability through the engine before requesting `crypto.randomInt(1, 5)`, then passes the roll to the calculation and writes its two balances into the working state. It maps `SPELL_SLOT_UNAVAILABLE` to the original HTTP 422 error. The spell caller still enforces the minimum slot level for the selected spell. The Contingency caller still performs its separate eligibility and component checks. The command boundary and saved fields retain their existing contracts.

The cast still checks the relevant source, Metamagic and Sorcery Points before slot handling. Expenditure on the clone and any Recall roll precede turn resolution and budget recording. Component and material checks then run before the cast journal is appended. Runtime validation precedes assigning the working state back to the character. The command handler writes the revision-guarded character update and the receipt in the same transaction. Rejected casts discard the working balances and journals. Stale commands reject before a new cast can be applied, and a matching receipt bypasses command execution and dice generation.

## Parity and code impact

- Before the production edit, 35 targeted backend tests passed. The added characterization pinned the Recall response, created and ordinary balances, invalid request status, rejection before rolling and unchanged serialized state on rejection. The transaction fixture spent a created slot, then verified budget rejection, stale revision and receipt replay against the committed snapshot.
- A comparison of the Pass 11 helper with the new adapter matched 1,080 serialized combinations across requested levels, available counts, created markers, eligibility and d4 results. The comparison included roll invocation counts, returned records, status codes, messages and resulting balances.
- A level-19 command fixture used deterministic d4 outcomes to spend a created slot, preserve the remaining created slot after the turn budget was spent, and reject a later nonmatching Recall. The rejected command left the state and receipts intact. Replaying the successful Recall returned its original result without another roll.
- Removed the backend's d4 outcome comparison and conditional slot decrements, plus its redundant ordinary-cast availability check. Added a pure balance calculation and typed input errors to the engine. The backend keeps the adapter for trusted dice, state application and HTTP translation.

| Repository | Files changed |
| --- | --- |
| Engine | `src/spell-slots/index.js`, `tests/spellSlotExpenditure.test.cjs`, `package.json`, `README.md` |
| Backend | `src/modules/archipelago/system/rules2024/slotCasting.js`, `src/modules/archipelago/system/rules2024/spellOperations.js`, `tests/phase2.casting-components.test.mjs`, `tests/phase2.commands.test.mjs`, both npm manifests, and the v0.10.0 archive |
| Frontend | Both npm manifests, the v0.10.0 archive, and this report |

## Verification

Both consumers pin `file:vendor/crossworld-sanguine-engine-0.10.0.tgz`. Two independent packs and both consumer archives matched SHA-256 `29d03736e3352394ee1abec3369911dd60250527d3af23695ad0d63da5a743f4`. Both lockfiles pin `sha512-4LEeMAO1+aeJvMmd2LYbDu5yPEJcfjpzDh1xIVEr3Cj4kKqPJeRRfMvvRIYsz1YaKMMhuXfiGo3fZ05NU73xeg==`. The package remains private.

| Lane | Result |
| --- | --- |
| Engine | 41 passed |
| Backend | 614 passed, 0 failed, 1 isolated MongoDB skip. `SA_PHASE2_TEST_MONGO_URI` was unset. Authenticated HTTP and in-memory transaction fixtures passed. |
| Frontend | 112 passed |
| Lint | Backend and frontend passed |
| Production build | Passed. The existing chunk-size warning recurred. Frontend tests also printed the existing Vite WebSocket port warning. |
| Dependency scans | Zero cycles in the engine, Archipelago backend and full backend. The existing frontend cycle involves `MapCanvas.jsx`, `AuthoredShapeLayer.jsx` and `ShapeEditorLayer.jsx`. |
| Package consumers | Fresh offline `npm ci` passed in both apps. A separate offline install exercised all ten subpaths, including the new exports, through CommonJS, Node ESM and an executed browser-targeted Vite bundle. |

## Remaining work and recommended Pass 13

Manual slot adjustment, slot-to-Sorcery Point conversion and Warden feature restoration still decrement slots in their own resource operations. These commands have distinct eligibility, error precedence and side effects. Pass 13 can characterize their created-slot accounting and route their common balance update through `/spell-slots` while retaining the command-specific checks and messages. Slot creation, rest and the saved representation can stay outside that change.
