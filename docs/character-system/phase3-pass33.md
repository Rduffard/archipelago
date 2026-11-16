# Sanguine Archipelago — Phase 3, Pass 33

## Pre-edit baseline and characterization

Engine 0.25.0 passed 75 tests. Frontend passed 113. The full backend run passed 638 with zero failures and timeouts and one isolated MongoDB skip. The Pass 32 HTTP ownership timeout did not recur. The previous archive SHA-256 matched in both vendors at d8d43a013945e399dfe13e2bb614df4609d9a76d761d8da0f04256ad4daae135.

Run `node crossworld_backend/tests/support/phase3-execution-probe.mjs` from the workspace root. The pre-edit and post-edit 91 observations share SHA-256 `1f9982a16e973410555b777ebce11eac49a5bd23399501e5aa60a4f1a992b4cc`. They cover slot and free Divine Smite casts near protection thresholds, fixed-roll Cunning Strike and critical hits, equipment projections, Aether Relay placement, Drydock Ghost salvage, Triage antidote and ledger replay. The probe records successful command requests, initial snapshots, results and changed state. It fixes the game clock and dice, preserving relationships between generated IDs while normalizing their values. HTTP transaction semantics are exercised by the backend suite.

## Function-level checklist

| Status | Backend caller | Mechanical boundary |
| --- | --- | --- |
| Migrated | spellOperations.cast and selections.project | Smite of Protection spell, Path and level eligibility and level-based cover radius. Host generates and replaces the effect and resolves expiration. |
| Migrated | strikeOperations.apply | Cunning Strike dice budget, critical and miss roll counts, and strike save DC. Host resolves the weapon, target, RNG, effect state and event history. |
| Migrated | equipment/loadout.deriveLoadout and combat attack, snapshot and state | Guard inputs and arithmetic, weapon attribute choice, grip and versatile damage, Training and attack modifiers, loading, mastery and heavy disadvantage. Host supplies equipped definitions, Sacred Weapon status and resolved covenant bonus. |
| Migrated | abilityOperations.activate, salvage | Drydock Ghost credit scales with Calling level. Host owns wreck validation and credit accounting. |
| Migrated | abilityOperations.activate, Triage | Field Surgeon condition outcome depends on option, level and discipline. Host owns kit and rest-epoch accounting, RNG, conditions and timing. |
| Migrated | rules2024/engine.replay | Automatic skill grants select Training or Expertise using the shared Training module. Ledger ordering and choice application remain in replay. |
| Host-owned | spellOperations.cast, abilityOperations.activate, strikeOperations.apply | Authorization, command validation, selected effects and targets, effect identity, journal writes, RNG, timing, receipts and persistence. |
| Blocked | spellOperations.cast, non-protection smite families | Existing casts record spell facts and spend a slot or free use. There is no resolved smite damage command in this path to extract. Trace hit and damage integration before introducing any new resolution contract. |
| Blocked | combat/attack.resolveAttack and Calling tactical operations | Additional attack and defense outcomes still require pre-edit characterization across owned weapon, turn and encounter constraints. This pass only moves the strike calculations above. |
| Blocked | equipment/magicProjection and equipment/loadout.deriveLoadout carrying fields | Attuned effect aggregation and carrying remain outside this slice. Characterize stacking and saved projections before moving their arithmetic. |
| Blocked | abilityOperations.activate ghost-repair, ghost-sabotage and other device branches; casterPathOperations.apply | Remaining fabrication and treatment branches need successful matrices for live object identity, effects and target conditions. |
| Blocked | rules2024/engine.replay Calling-specific choice branches | Further grant and choice extraction needs explicit pending, invalid and multiclass replay comparisons to preserve choice order and error precedence. |

## Changed files

- Engine: package.json, README.md, src/equipment/guard.js, src/equipment/weapon-projection.js, src/combat/strike.js, src/callings/rules.js, src/callings/warden/paths/leviathan-anchor.js, src/callings/shipwright/paths/drydock-ghost.js, src/callings/doctor/paths/field-surgeon.js, src/training/index.js and tests/execution.test.cjs.
- Backend under src/modules/archipelago: combat/attack.js, combat/snapshot.js, combat/state.js, equipment/loadout.js, system/rules2024/{abilityOperations,engine,selections,spellOperations,strikeOperations}.js. Removed combat/guard.js and updated tests/combat.test.mjs to use the package implementation. Added tests/support/phase3-execution-probe.mjs.
- Both applications: package.json, package-lock.json and vendor/crossworld-sanguine-engine-0.26.0.tgz. Frontend gameplay source continues consuming the existing projections and typed commands. Added docs/character-system/phase3-pass33.md.

Phase 3 remains open. The next audit should verify the blocked functions above through their successful command entry points before deciding whether a pure calculation can be moved or an execution contract needs an explicit design decision.

## Final verification

| Suite | Passed | Failed | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 77 | 0 | 0 | 0 |
| Backend | 638 | 0 | 0 | 1 |
| Frontend | 113 | 0 | 0 | 0 |

Both lint checks, the frontend production build and 262 backend syntax checks passed. The existing bundle-size warning remains. Engine and backend Archipelago dependency graphs have zero cycles. The isolated MongoDB suite was skipped because SA_PHASE2_TEST_MONGO_URI was unset.

All 494 fixed-roll cases, 1,210 roster observations, and 31,690 retained regression observations matched Pass 32. The catalog hash and HTTP ETag remain e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144. The backend suite passed receipt replay, stale revision and rollback coverage.

Both applications resolve engine 0.26.0. The vendored archives are byte-identical at SHA-256 `2058aa7004cead43c79fe463979ce7732abca26db8bfd5a03acec017b0a1830a`. Both lockfiles match archive integrity `sha512-msz9Iiu5q9pmkLuOEa9K4gF6dL/4wdcBTSyKnxKUY7ev8ZW93CwZLBR7b5v1pNjRJbmMFcOj8kkd+zmg5JhMXA==`.
