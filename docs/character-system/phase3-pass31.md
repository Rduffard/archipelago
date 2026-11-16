# Sanguine Archipelago — Phase 3, Pass 31

## Ownership inventory before extraction

| Boundary | Existing consumer and rule | Portable owner | Host responsibility |
| --- | --- | --- | --- |
| Checks | Frontend rolls.js computes situational modifiers, advantage and floors from projected facts. Roll tests cover paths, conditions and Exhaustion. | Engine dice | Roll input, random draw and presentation |
| Healing spells | Backend healingSpells.apply chooses upcast dice, spell modifier and Sanctuary bonuses. Healing-spell tests exercise successful cast resolution and saved state. | Engine spells | Recorded cast, targets, event journals, RNG, applying Health and conditions |
| Breakwater | Backend abilityOperations builds barrier dimensions, Guard, Health and protection from level, Training, discipline and Wit. Caster Path and management tests exercise deployed effects. | Engine Shipwright Path rules | Placement, input validation, identity, replacement and clock |
| Combat and equipment | strikeOperations, equipment/loadout and typed handlers still mix roll bonuses, equipment restrictions, action eligibility and contextual state. | Engine combat and equipment | Instance resolution, actions, targets and persistence |
| Advancement | Backend engine replay applies ledger choices and Training grants. | Engine progression and Training | Ledger order, authorization and contracts |
| Other spell and treatment rules | Metamagic, smites, charged items and non-spell Doctor treatment still include mixed deterministic and host code. | Engine spells and Callings | Instances, target conditions, RNG and storage |

## Verified extraction

- `/dice` now exports `sheetCheckRules`. It resolves situational modifiers, advantage, disadvantage and roll floors from the same summary and equipment facts. The frontend still owns random draws and result presentation. The fixed-roll probe includes attack/spell-attack modifier inputs through the shared roll primitive and attribute, skill and save scenarios through the sheet adapter.
- `/spells/healing` now exports the existing healing profiles and the dice count and resolved amount formulas. The backend continues to resolve targets, RNG, Sanctuary feature timing, event journals and state updates. The blueprint consumes the same profiles from the engine.
- `/callings` adds `breakwaterBarrier` for maximum dimensions, passers, bend eligibility, Guard, Health, resistance and cover. The backend still validates placement and custom dimensions and owns replacement, clocks and effect identity.
- Removed the superseded backend `definitions/healingProfiles.js` file. No legacy operation or receipt code was removed.

## Exact files

- Engine: `package.json`, `README.md`, `src/core/dice/index.js`, `src/core/dice/sheet-check.js`, `src/spells/healing.js`, `src/callings/rules.js`, `src/callings/shipwright/paths/breakwater.js`, `tests/execution.test.cjs`.
- Backend under `src/modules/archipelago/system/rules2024/`: `abilityOperations.js`, `blueprint.js`, `healingSpells.js`, removed `definitions/healingProfiles.js`.
- Frontend: `src/pages/Rules2024/rolls.js`, `tests/support/phase3-roll-probe.mjs`, `docs/character-system/phase3-pass31.md`.
- Both applications: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.24.0.tgz`.

## Behavior baselines

Before editing, seven healing-spell cases and 17 caster Path and Path management cases passed. They exercise successful resolution and host effect behavior. The fixed-roll matrix matched all 494 outcomes, pre-edit and post-edit SHA-256 `c7013244d3313491f31dc4ca05e9a520577576728cf73225e66a5fa0453404c8`. Engine tests cover barrier scaling and rolled and flat healing thresholds.

## Phase 3 exit assessment

Phase 3 remains open. Blocking ownership work includes portable tactical attack outcomes, smite and Metamagic mechanics, deterministic equipment loadout modifiers, other deployed-device rules, non-spell Doctor treatment and Calling-specific advancement decisions. Separate the mechanical outputs from equipped instances, encounter evidence and ledger ordering, with successful typed-command matrices before extraction. This pass did not complete an exhaustive duplicate or legacy-code audit. The frontend map cycle and existing build warning are nonblocking. Cross-character proximity, encounter geometry and full deployed-object placement remain deferred by design.

## Final verification

| Suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Engine | 73 | 0 | 0 |
| Backend | 638 | 0 | 1 |
| Frontend | 113 | 0 | 0 |

Backend and frontend lint, frontend build and all 263 backend syntax checks passed. The existing build chunk-size warning remains. Engine and backend Archipelago dependency graphs have zero cycles. The frontend map cycle remains. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset.

All 1,210 roster observations and 31,690 retained observations matched Pass 30. The roster probe covers eight Callings and 32 Paths through level 20. The catalog hash and HTTP ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. Full backend tests exercised authenticated commands, historical replay and rollback.

Both applications resolved engine 0.24.0. Vendored archive SHA-256 is `ff67fc14c55ff16ca481a9e5d0ebebdb11a70b59b6e24d87447f3aa1e047c6ca`. Both lockfiles match `sha512-WVkeGCBbv2f3xxFUWAa84mxu6Itig2BBDas4zDJnD1btGuMtgZIBL+ALKLR/f1onZqzjYQVXshSDGx3c3LFojg==`.
