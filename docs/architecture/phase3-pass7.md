# Phase 3, Pass 7 — Ordinary spell-slot reconciliation

`@crossworld/sanguine-engine@0.5.0` owns ordinary spell-slot reconciliation during character advancement and rebuild. The backend supplies allocations from Calling progression and ledger replay, selects the policy, and handles the combined saved balance, created slots, spellcasting, rest, authorization, revisions, receipts, and persistence.

## Saved representation

| Field | Meaning |
| --- | --- |
| `rulesSummary.spellSlots` | Earned ordinary maxima by spell level. Arrays start at level 1 and end at the highest unlocked level. A noncaster has an empty array. |
| `rulesRuntime.slots` | Available total by level, including available created slots. |
| `rulesRuntime.createdSlots` | Created-slot counts by level, tracked separately from the earned maxima. |
| `rulesRuntime.pools['tidecaller:sorcery-points']` | Saved balance used by conversion. Creation raises both slot arrays at the selected level. Conversion back and ordinary casting expenditure consume a created slot first when available. |
| `rulesRuntime.castings`, `turnCasting`, and `restHistory` | Casting outcomes and slot expenditure, shared turn spending, and completed rest history. Manual spending and conversion update balances through the existing commands and receipts. |

## Pre-extraction behavior

Four new backend fixtures passed against Pass 6 before extraction. The unchanged, increased, decreased, and removed allocation cases were pinned with synthetic next summaries. The command fixtures use actual Tidecaller progression, conversion, and rebuild.

| Allocation change | Advancement | Rebuild |
| --- | --- | --- |
| Same maximum | Full, partial, and depleted balances retain their counts. | Same. |
| Higher maximum | Grants the difference. A saved balance of 1 out of 3 becomes 2 out of 4. | Caps at the old available balance. The same example stays at 1. |
| Lower maximum | Preserves expenditure up to the new capacity and floors at zero. | Same reduction with the old-balance cap. |
| Newly unlocked level | Starts at its earned maximum. | Starts at zero. |
| Removed level | Omitted from the output. | Omitted from the output. |

Advancement retained the created-slot marker when ordinary levels unlocked or gained capacity. Conversion spent two Sorcery Points to create a level-one slot, conversion back spent that slot for one point, and manual spending consumed created slots first. Short Rest preserved created slots. Long Rest cleared them and restored ordinary maxima. Existing Short Rest recovery restrictions remain enforced by the runtime.

Pass 6 rebuild used the combined balance, then cleared the created markers. A total of 2 at level 1, including 1 created slot, could rebuild to a total of 2 with no created marker when the result fit the new ordinary maximum. A total of 5 at an unchanged maximum of 4 rejected with HTTP 400. Both outcomes are preserved in the backend adapter as existing compatibility behavior. Preview reports the created markers under `consequences.createdSlotsLost` and leaves saved balances intact. Commit applies the previewed values. The engine receives ordinary balances only.

## Engine API and backend integration

`reconcileSpellSlots(previousAllocation, previousAvailable, nextAllocation, policy)` is exported from `@crossworld/sanguine-engine/spell-slots`. It takes dense integer arrays for levels 1–9, with index zero representing level 1, and an explicit `advance` or `rebuild` policy. It returns fresh entries in next-allocation order, each with an `available` ordinary balance and the `remainingReduction` below zero that the ordinary balance could not absorb. The latter lets the host preserve its historical combined-total floor when a decrease also affects created availability.

The backend `spellSlotState.js` validates saved totals and markers, separates the ordinary balance, calls the engine, and reconstructs the combined total at the storage boundary. The two inline reconciliation calculations in the advancement and rebuild paths were removed. A bounded comparison against the previous formulas matched all 3,822 combined-balance cases across both policies. This included increases, decreases, zero allocations, and states with more markers than available total that the historical validator allowed.

Invalid engine inputs raise `SpellSlotReconciliationError` with code `INVALID_SPELL_SLOT_RECONCILIATION` and the affected level when available. The backend keeps HTTP 400 `Invalid saved spell slots`. The adapter rejects malformed arrays before arithmetic. Negative, fractional, text, null, missing, extra, and over-cap serialized balances were already invalid under saved-state validation. Sparse in-memory arrays are now rejected explicitly.

An in-memory transaction fixture spent two ordinary slots, created a slot, then advanced twice. The first command raised the level-one maximum and unlocked level-two slots. The second raised the level-two maximum. JSON reload retained the combined and created counts. Receipt replay returned the original response. Replay, a stale revision, and an invalid advancement left the committed character and receipts intact. Rebuild preview and commit matched, and recorded rest history survived the transitions.

## Files changed

| Repository | Pass 7 files |
| --- | --- |
| Engine | Added `src/spell-slots/index.js` and `tests/spellSlots.test.cjs`. Updated `package.json` and `README.md`. |
| Backend | Added `src/modules/archipelago/system/rules2024/spellSlotState.js` and `tests/phase3.spell-slots.test.mjs`. Updated `characters/rules2024.js`, `characters/rebuild.js`, and `system/rules2024/runtimeValidation.js` under `src/modules/archipelago`, plus `tests/phase2.commands.test.mjs`, both npm manifests, and the vendored package. |
| Frontend | Updated both npm manifests and the vendored package. Added a serialized character fixture to `tests/phase2.test.mjs` and added this report. |

## Package and verification

Version 0.5.0 exports `/attributes`, `/point-buy`, `/dice`, `/training`, `/resources`, `/hit-dice`, and `/spell-slots`. The packed artifact includes the license and provenance notices. Both consumers pin `file:vendor/crossworld-sanguine-engine-0.5.0.tgz` with matching lockfile integrity. The engine pack and both vendored copies have SHA-256 `c3ef58f9859fcf52821a205be6bb756f1f0f4ce2a0ee44ae6d1102be65977260`. Fresh offline `npm ci` passed for both apps. An isolated packed consumer exercised all seven exports through CommonJS, Node ESM, and a browser-targeted Vite bundle executed with a minimal DOM stub.

| Lane | Result |
| --- | --- |
| Engine | 23 passed, 0 failed. |
| Backend | 602 passed, 0 failed, 1 environment-gated MongoDB skip. Lint passed. |
| Frontend | 112 passed, 0 failed. Lint and production build passed. A serialized advancement response rendered the combined slot total and enabled the corresponding casting and resource controls. The existing WebSocket port and chunk-size warnings recurred. |
| Dependency graph | Zero cycles in the Archipelago backend, full backend source, and engine source. The JSX-aware scan reproduced the existing frontend cycle among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Isolated persistence | `SA_PHASE2_TEST_MONGO_URI` was unset. Authenticated HTTP and in-memory transaction fixtures ran. Live MongoDB persistence and transaction parity remain unverified. |

The backend suite covers spell and slot expenditure, the shared spell, scroll and charged-item turn budget, Quickened Spell, Metamagic, Concentration, duration and expiry, Extended Spell, Contingency, spell preparation, and rest. Contract coverage pins the catalog hash `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`, quoted ETag, conditional GET, `SA-CHAR-1`, ledger version 3, persisted `srd-5.2.1` discriminator, historical practice fields, and `tabletopReady: false`. The full progression suites cover eight Callings, 32 Paths, and levels 1–20 under the single-Calling rule.

## Recommended Pass 8

Characterize and extract advancement-only prepared-spell reconciliation. Pin the order of retained rest selections, newly earned preparations, duplicates, always-prepared exclusions, and the final count cap. Use explicit replay-derived inputs. Keep spell eligibility, cast and rest commands, folio handling, and persistence in the backend.
