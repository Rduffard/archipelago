# Phase 3, Pass 11 — Shared casting-turn budget

`@crossworld/sanguine-engine@0.9.0` owns casting-turn flag transitions and mechanical rejection order. The existing backend adapter still selects the turn, writes the journal, and translates mechanical errors to the existing HTTP 422 responses.

## Saved representation and callers

The backend keeps `rulesRuntime.turnCasting[turnId]` with four shared booleans: `slotSpent`, `leveled`, `quickened`, and `freeMetamagic`. Relay features may attach their own metadata to the same entry. The separate `castings` journal records outcomes and source identity. Action Surge uses `counters.actionSurgeTurns`.

| Source | Facts sent to the budget |
| --- | --- |
| Ordinary spells | Printed spell level, actual slot expenditure after Spell Recall, Quickened Spell, and free Metamagic use |
| Scrolls | Printed spell level on a successful cast, with no slot expenditure. A failed scroll ability check follows the existing consumption path and skips budget recording. |
| Charged items | Printed spell level with no slot expenditure, before charge deduction. Fast Hands eligibility and the item action label are handled separately. |
| Triggered free Metamagic rerolls | Level zero and free Metamagic use, after the backend validates Arcane Apotheosis eligibility |

The backend chooses the open owner turn or the recorded external turn in combat. Missing or mismatched active turn IDs reject when required. Ending a turn retains old journal entries. Starting a fresh turn ID starts with empty flags. Initiative recording leaves the journal intact. Rest retains the current active entry when applicable and prunes old entries.

## Pass 10 characterization

The targeted suites passed 43 tests before the production extraction. The fixtures exercised all nine first/second source pairings in a normal recorded turn. Two slot-spending spells reject. Either order of one slot-spending spell and a scroll or charged item succeeds, as do repeated slotless sources when individually eligible. A confirmed Shield reaction on a recorded external turn spends that turn's slot budget.

Quickened Spell requires an open owner turn and is reported as a Bonus Action. A prior leveled cast blocks Quickened Spell. A Quickened cast blocks a later leveled spell, scroll, or item. Repeated Quickened cantrips can pass the shared budget when the character has sufficient Sorcery Points and meets the host's other checks. The recorded casting path has no independent spent Action, Bonus Action, or Reaction counter. The extraction preserves that existing scope.

Action Surge records a non-Magic action and does not reset the budget. The integration fixture cast from a wand before and after a legal Surge. A proposed Magic action rejected, and the successful non-Magic action left the same casting flags in place. The current single-Calling system does not give a character both native Action Surge and Quickened Spell.

### Rejection order

| Layer | Order preserved |
| --- | --- |
| Ordinary spells | Spell and target checks, eligibility, Metamagic and Sorcery Points, and slot availability precede turn resolution and the budget. Quickened owner-turn eligibility precedes the budget. The later component and material checks still run afterward. |
| Scrolls | Confirmation, owned scroll, spell eligibility, targets, turn, armor, components, ability check and casting-history capacity precede budget recording for a successful scroll. |
| Charged items | Confirmation, action eligibility, held item, armor, available charges, targets, turn and casting-history capacity precede budget recording. |
| Shared budget | A slot or Quickened conflict returns the existing shared restriction first. Repeated free Metamagic returns the Arcane Apotheosis error next. The backend then checks the 200-entry journal capacity for a new turn. |

The transaction fixture saved a charged-item cast and a slot cast, then verified the flags and casting journal after JSON reload. A second slot cast and a Quickened attempt rejected without spending resources or appending journal entries or receipts. A stale revision preserved the committed state. Replaying both accepted receipts after closing the turn returned the original responses without changing the character or receipts.

## Engine API and integration

`@crossworld/sanguine-engine/casting-turn` exports `transitionCastingTurnBudget(current, { level, spentSlot, quickened, freeMetamagic })` and `CastingTurnBudgetError`. The function accepts plain records, a printed spell level 0–9, and booleans. Omitted flags default to false. It returns the four new flags in a fresh object. It rejects malformed inputs with `INVALID_CASTING_TURN_INPUT`. Mechanical rejections use `CASTING_TURN_LIMIT` and `FREE_METAMAGIC_ALREADY_USED`, in that order. Existing valid saved flags and HTTP messages are preserved. Malformed flag types now fail at the engine boundary.

The backend calls the function at the existing recording point for all sources. It checks journal capacity after mechanical validation, merges the returned flags with retained relay metadata, and writes the same serialized entry. No action, slot, charge, target, random roll, turn ID, authorization, journal, or persistence logic moved into the engine.

The independent engine suite covers all 256 prior/request flag combinations, default flags, invalid inputs, immutability, and deterministic output. A separate comparison against the Pass 10 backend matched all 256 serialized adapter outcomes, including rejection messages, statuses, and relay metadata. A saved initiative and turn smoke check verified independent budgets on new turn IDs.

## Codebase impact

Counts use Git `--numstat` against Pass 10 working files and include blank lines. Dependency metadata, archives, and documentation are excluded.

| Measure | Result |
| --- | --- |
| Backend mechanical logic moved | One shared helper's two rejection checks and four flag updates. There were zero source-specific copies. |
| Backend production source | 4 removed, 17 added, net +13 in one file. Additions are package import, error translation, and adapter wiring. |
| Engine production source | 40 lines added |
| Test source | Backend 126 added and 1 removed, engine 76 added, frontend 0. Total 202 added and 1 removed. |
| Remaining backend authority | Turn resolution, action and casting eligibility, call order, journal capacity and metadata, and command execution and persistence. |

## Files changed

| Repository | Changes |
| --- | --- |
| Engine | Added `src/casting-turn/index.js` and `tests/castingTurn.test.cjs`. Updated `package.json` and `README.md`. |
| Backend | Updated `src/modules/archipelago/system/rules2024/castingTurn.js`, `tests/phase2.final-defects.test.mjs`, `tests/phase2.commands.test.mjs`, both npm manifests, and the vendored archive. |
| Frontend | Updated both npm manifests and the vendored archive. Added this report. |

## Verification

Version 0.9.0 adds `/casting-turn` and retains all nine existing subpaths, the license, and provenance notices. Both consumers pin `file:vendor/crossworld-sanguine-engine-0.9.0.tgz` with matching lockfile integrity. SHA-256 of the engine pack and both vendored copies is `ba30a2a71eda51ed4decc34f54fb2bfc57dcf8f04b9399c4c6e0245fa076ac28`. Fresh offline `npm ci` passed for both apps. A separate packed consumer exercised all ten exports through CommonJS, Node ESM, and a browser-targeted Vite bundle executed with a minimal DOM stub.

| Lane | Result |
| --- | --- |
| Engine | 39 passed, 0 failed. |
| Backend | 612 passed, 0 failed, 1 isolated MongoDB skip. Lint passed. |
| Frontend | 112 passed, 0 failed. Lint and production build passed. Existing WebSocket port and chunk-size warnings recurred. |
| Dependencies | Zero cycles in the Archipelago backend, full backend, and engine. The existing frontend cycle remains among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Persistence | The isolated MongoDB URI was unset. Authenticated HTTP and in-memory transaction fixtures passed. |

The full suites verify spellcasting, scrolls, charged items, Action Surge, Quickened Spell, Metamagic, Concentration, Extended Spell, Contingency, creation and spending of spell slots, preparations, and practice encounters. Contract tests pin `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, catalog hash and quoted ETag, command envelopes and receipts, historical practice fields, and `tabletopReady: false`. Progression coverage includes eight Callings and 32 Paths through level 20.

## Recommended Pass 12

Characterize spell-slot spending with and without Spell Recall and created-slot precedence. Extract the deterministic expenditure result using the backend's supplied roll. Keep source eligibility, generation and timing of the trusted roll, command ordering, and persistence in the backend.
