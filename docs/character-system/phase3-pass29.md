# Sanguine Archipelago — Phase 3, Pass 29

## Pre-edit ownership inventory

| Boundary | Current ownership | Pass 29 target |
| --- | --- | --- |
| Rage damage and vitality | Engine owns Rage scaling, damage arithmetic, death saves and Relentless Rage mechanics. Backend resolves effective resistance, equipped armor, effect timing and Reef Skin eligibility. | Move Reef Skin eligibility and mitigation amount. Keep inventory lookup and effect resolution in the host. |
| Tidecaller | Engine owns Sorcery Point conversions, capped recovery and concentration math. Vital Circuit, Blood Price dice and Empowered Spell reroll limit still have backend formulas. The sheet repeats the Vital Circuit and reroll limits. | Share deterministic limits and Blood Price calculation. Keep RNG and evidence journals in the backend. |
| Warden, Doctor, Shipwright | Authoritative progression, options and selected outcomes are engine-owned. Host handlers still mix target/equipment resolution with smite, treatment and device calculations. | Review further in a separate verified slice. |
| Corsair and Navigator | Engine owns progression, options and selected outcomes. Host handlers still combine encounter context with tactical and terrain rules. | Characterize resolved attacks and movement before further extraction. |
| Ledger | Engine owns progression data, Training primitives and reconciliation. Backend applies ordered decisions and still holds some Calling-specific choice rules. | Keep persisted contracts. Audit choice and Expertise transitions independently. |
| Sheet and creator | Server projects most rules. Sheet repeats Exhaustion arithmetic and combines conditional roll flags and floors. | Reuse existing Exhaustion helper and shared limits. Preserve local interaction and RNG. |
| Runtime architecture | Backend owns authorization, clocks, RNG, identity, persistence and receipts. | Keep typed commands, stable IDs and historical replay. Validate legacy call sites before removing helpers. |

## Completed extraction

Engine 0.22.0 exposes `/calling-mechanics` for small execution formulas without loading the roster. Reef Skin eligibility now takes a resolved attack flag, damage type, Path, level, active Rage and suppression. The backend resolves the armor instance only after the gate passes and applies the original Training-based reduction through the existing damage pipeline. Blood Price dice thresholds and Shelter temporary Health use engine functions. Vital Circuit and Empowered Spell use separate engine functions for their distinct limits. The sheet uses these same functions and the existing `exhaustionD20Penalty` helper. No backend adapter was removed in this slice because its reachability was not established.

### Changed files

- Engine: `package.json`, `README.md`, `src/callings/mechanics.js`, `tests/roster.test.cjs`.
- Backend under `src/modules/archipelago/system/rules2024/`: `vitality.js`, `conduitOperations.js`, `spellRerolls.js`.
- Frontend under `src/pages/Rules2024/`: `rolls.js`, `ConduitControls.jsx`, `SpellRerolls.jsx`.
- Both applications: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.22.0.tgz`.
- Frontend documentation: `docs/character-system/phase3-pass29.md`.

## Pre-edit evidence and the Pass 20 discrepancy

The pre-edit Conduit and Metamagic suites passed 32 tests, including successful typed spending, dice resolution, effects, grant replacement, and rejection without mutation. The pre-edit 8,910-case damage probe produced SHA-256 `cf44472be92880c609b87d34232bef37ef4eef8277417c62b832f550f4e585e6`. The focused engine matrix covers every Reef Skin gate, the Blood Price level boundaries, lower-bound clamping and positive Spirit scaling.

The temporary Pass 20 script produced the same 100 differences against its archived snapshot before any Pass 29 production edit. Its scripted effects include Geas, Guidance and Light but omit the live Rage effect and prior attempt counter present in the archived data. The maintained fixture explicitly supplies those values. The divergence begins with the fixture state, then propagates through expiry cleanup and Relentless Rage eligibility. Current eligibility requires active Rage, and the clock clears pending Rage when there is no Rage effect. An effect ID rewrite would not restore the missing effect or counter. The archived fixture and maintained probe were preserved.

## Phase 3 exit assessment

- Blocking for closing the extraction: characterize and move remaining pure rules embedded in Corsair and Navigator tactical handlers, Warden smite and protection, Doctor treatment, Shipwright deployable statistics and Calling-specific ledger choice application. A broader backend dead-code and frontend roll-rule audit also remains.
- Nonblocking: the existing frontend map cycle and build chunk warning. Neither changes the rules or transaction boundary in this pass.
- Deferred by design: encounter geometry, cross-character Aura proximity and deployed-object placement remain host responsibilities.

## Package and verification

Both applications resolve 0.22.0. The vendored archives are byte-identical at SHA-256 `1129ac04ca1a93f7e034b2eee1e2c08c49d0f50448385142d3cdb9d13f2792f4`. Both lockfiles match archive integrity `sha512-odxCa48W4RkydiihLyPtqjhLlCMsyn2AyZTDMTHVRD0ZBTq2bQDDiQouyv8SaNaaW4+cm5K21/+GIn5ZSnnIjg==`.

The full engine and frontend suites passed 69 and 113 tests respectively, with zero failures and skips. Backend and frontend lint passed. The frontend production build passed with the existing chunk-size warning. All 274 backend syntax checks passed. The engine and backend Archipelago graphs report zero cycles. The frontend has one pre-existing map cycle.

The full backend suite passed 638 tests with zero failures and one environment-gated isolated MongoDB skip. `SA_PHASE2_TEST_MONGO_URI` was unset. The full suite included authenticated receipt replay, stale revisions, atomic rollback and exact HTTP ETag checks. All 1,210 roster observations across eight Callings and 32 Paths at levels 1–20 matched the Pass 28 baseline. The catalog hash and ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`.

All 31,690 retained observations matched the Pass 28 hashes. The legacy fixture matched all 3,960 observations against its own Pass 29 pre-edit execution at normalized SHA-256 `ae77e2589a372a5655ff84166749613de4b814549e4c257977c42f5eea30e347`.

| Retained probe | Count | SHA-256 |
| --- | ---: | --- |
| Generic activation | 495 | `36c988c5a45fc54ef1875e49465d532c4bebf8d45563fd44663cdce16b5f80c8` |
| Effect identity | 56 | `bd033514241f33a79cb49defdcff723291ede73e5817434377961385a2720810` |
| Saving throws | 4,275 | `eef4ae8fadc43ba9b2c419d760135b578d6592bd2c38a230908411cd024c71c3` |
| Concentration | 8,544 | `cbd55f5b4e6f5742a3165810957e901bf27c1ed73812edd50795023fd02ac383` |
| Damage features | 2,410 | `fc1954b6454c498d2e278c625bd0493fb2649882d337f21fb71ba65be8db3656` |
| Damage | 8,910 | `cf44472be92880c609b87d34232bef37ef4eef8277417c62b832f550f4e585e6` |
| Vitality | 3,960 | `cf1d952ad06d55319577f1ddff86dbacd27570ffba6784ad3cca88b470a28a91` |
| Rest | 2,640 | `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b` |
| Gunslinger | 400 | `31b4cbbda34da8c80d32ffd72529896edae37c49bb39c8c20298dd070931ca7d` |
