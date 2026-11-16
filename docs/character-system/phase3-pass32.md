# Sanguine Archipelago — Phase 3, Pass 32

## Ownership inventory before editing

| Domain | Candidate and current consumers | Portable input and output | Host boundary and baseline |
| --- | --- | --- | --- |
| Tactical combat | strikeOperations and Calling handlers resolve attack outcomes; equipment/loadout also computes armor-based tactical speed penalties | Resolved weapon, conditions, flags and rolls to modifiers and outcomes | Keep attack evidence, geometry, effect state and RNG. Strike and damage suites cover resolution. |
| Spell execution | rules2024/metamagic validates and projects cast rules for spellOperations; Warden handlers and spell profiles govern smite | Known choices, active feature, spell profile and selected options to eligibility, cost and management fields | Keep HTTP shape, live effect lookup and casting state. Metamagic and Warden suites exercise typed casts. |
| Equipment | equipment/loadout deriveLoadout feeds sheet and runtime equipmentView | Resolved armor and shield Training, projected Calling facts and Might to penalties and restrictions | Keep owned slot lookup, attunement, validation and identity. Equipment tests and roster projection cover outputs. |
| Shipwright | abilityOperations relay-place consumes live relays and creates a device | Calling level and discipline to capacity and device stats | Keep position validation, replacement, effect identity and clock. Caster Path suite exercises successful placement and discharge. |
| Doctor | abilityOperations preserve-life validates and applies allocations | Doctor level to healing budget and cap | Keep recipient validation, Holy Symbol lookup and state updates. Caster Path suite exercises treatment. |
| Advancement | rules2024/engine applies Calling choices; Training engine already owns contribution and training profiles | Resolved grants and selections to Training and Expertise | Keep ledger order, validated choices and saved character contracts. Roster probe covers progression. |

## Completed extraction

- The engine owns Metamagic option data, availability, costs and spell projection through `/spells/metamagic`. Backend validation retains selection shape, HTTP error translation and active-effect lookup. Spell timing, Sorcery Point debits and receipts remain backend responsibilities. The blueprint and advancement validation use the same option records.
- `/equipment/restrictions` owns resolved armor restrictions, including the Might requirement, Reef Colossus and Brass Outrider speed penalties and untrained armor penalties. Backend loadout projection still resolves owned slots, Training, attunement and effect state.
- Aether Relay now uses shared deployment capacity, Guard, Health, immunities, mobility and movement limit. The backend owns live relay lookup, placement, replacement and expiration.
- Preserve Life uses engine-owned allocation and recipient healing caps. The backend validates allocations and the Holy Symbol and applies healing.
- Existing frontend consumers continue reading projected restrictions, roll modifiers and typed options. No frontend gameplay source changed.

## Changed files

- Engine: `package.json`, `README.md`, `src/spells/metamagic.js`, `src/spells/metamagic-options.js`, `src/equipment/restrictions.js`, `src/callings/rules.js`, `src/callings/doctor/paths/sanctuary-hand.js`, `src/callings/shipwright/paths/aether-relay.js`, `tests/execution.test.cjs`.
- Backend under `src/modules/archipelago/`: `equipment/loadout.js`, `system/rules2024/{abilityOperations,blueprint,engine,metamagic}.js`. Removed `system/rules2024/definitions/metamagicOptions.js` after migrating its records.
- Both applications: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.25.0.tgz`.
- Frontend documentation: `docs/character-system/phase3-pass32.md`.

## Baselines and remaining work

Before editing, 34 Metamagic, caster Path and Warden Path cases passed and 21 equipment integration and strike cases passed. These include successful typed execution. Added engine boundary tests cover relay capacity, Preserve Life limits and stacked armor penalties. No new successful command snapshot matrix was added.

Phase 3 stays open. Smite execution, attack and damage outcomes beyond the armor movement rules, Guard and weapon projection, remaining device and treatment mechanics, and deterministic Calling-specific advancement decisions still need extraction. The advancement change here only points existing validation at the shared Metamagic options. The final architecture audit should trace those functions from their typed command entry points, characterize successful state changes, and separate mechanical outputs from journals, identity and persisted state. The existing frontend map cycle is nonblocking. Encounter geometry and placement remain host responsibilities.

## Verification

| Suite | Passed | Failed assertions | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 75 | 0 | 0 | 0 |
| Backend full run | 637 | 0 | 1 | 1 |
| Backend characterCombat retry | 5 | 0 | 0 | 0 |
| Frontend | 113 | 0 | 0 | 0 |

The full backend run exited nonzero after a 12-second timeout in the from-character ownership endpoint test. All five tests in that file passed on retry. Isolated MongoDB testing was skipped because SA_PHASE2_TEST_MONGO_URI was unset. Both lint checks, the frontend build and 262 backend syntax checks passed. Engine and backend Archipelago dependency graphs have zero cycles.

All 494 fixed-roll, 1,210 roster and 31,690 retained observations matched Pass 31. The fixed-roll hash is `c7013244d3313491f31dc4ca05e9a520577576728cf73225e66a5fa0453404c8`. The catalog hash and tested HTTP ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. Retained and backend tests cover exact-instance identity, receipt replay, revision checks and rollback.

Both applications resolved 0.25.0 and both archives have SHA-256 `d8d43a013945e399dfe13e2bb614df4609d9a76d761d8da0f04256ad4daae135`. Both lockfiles match archive integrity `sha512-GNWXJbO0tzEZmATgn24CvkmOAxzFvuds03UdvHP+SYKRwxKeiyxqqRxpwPEquZfKxRrW1JeaU0HTWPDAYMSPyg==`.
