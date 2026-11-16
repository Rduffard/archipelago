# Sanguine Archipelago — Phase 3, Pass 36

## Baseline and behavior

Before editing, engine 0.28.0 passed 82 tests, frontend passed 113, and backend passed 638 with one isolated MongoDB skip and zero timeouts. Both pre-edit vendors had the Pass 35 archive hash. The baseline catalog identity test passed. The existing dirty working trees were preserved.

Run `node crossworld_backend/tests/support/phase3-final-ownership-probe.mjs` from the workspace root. All 38 observations matched before and after extraction at SHA-256 `d831fbc13f396c0043df97e739b1be0b8a435cc960b02eb315e0686fd3cf5209`.

- Recipient gate matrix uses the actual state application function at zero, below half, at rounded-down half, above half and full Health. It crosses below-cap, exact-cap and above-cap requests and captures condition removal and rejection states. The existing doctor-targets suite exercises authorized other-character state changes, failed-save revival and rollback.
- Tactical matrix records successful typed Saltglass Parry commands across three levels with natural 1, ordinary and natural 20 results. It fixes the game clock and compares the changed character state including the parry journal.
- Advancement matrix records complete replay results or exact error outcomes for valid, missing, invalid, duplicate, early and reordered specialty choices and attempted second Callings. SA-CHAR-1 rejects multiclassing. Ledger ordering and validation precedence stay in the backend.

## Ownership and remaining scope

| Function | Owner and result |
| --- | --- |
| healingEffects.targetEffects Bloodied gate and healing amount | Engine vitality now owns both calculations from resolved Health and amount. Backend keeps recipient state application, source conditions, live eligibility, revival and Prayer of Healing epoch handling. |
| corsairOperations.apply duelist-parry | Engine Saltglass Duelist rules own the Guard window and natural roll exceptions. Backend validates incoming attack evidence, derives equipped Guard and records the parry and Action economy. |
| engine.replay Storm Broker and Field Surgeon specialty choices | Engine Path grants own level eligibility and allowed values. Backend still validates requested values in order and applies Training promotion. |
| engine.replay remaining Calling branches | Ordered validation, pending decisions and ledger replay remain backend responsibilities. The portable schedule for Tidecaller Metamagic choice grants and replacement inside replay still needs characterization and extraction. |
| reaverOperations.apply retaliation and area save outcomes | Retaliation floors and half-damage calculation remain backend formulas. Finish with fixed-roll success and rejection matrices. RNG, resistance context and journal checks belong in the host. |
| navigatorOperations.apply and gunslingerOperations.apply | Existing engine previews and Calling helpers own many numeric outcomes. Remaining conditional movement and eligibility branches need review against resolved turn and equipment facts before an exit claim. |
| casterPathOperations and spellOperations.cast | Backend owns cast evidence, effect consumption, timing and mutation. Existing conversion and slot calculations are engine-owned. |
| frontend rolls, creator and persistent sheet | The frontend consumes engine check rules, engine point buy, typed commands and backend projections. Local input and presentation stay in the frontend. |
| hit-triggered smites | Gameplay design decision. Current casting spends a slot or free use and records the cast and applicable protection, without resolving initial damage. Pass 35 proposal remains the decision record. This decision can be deferred independently of extraction closure. |

## Legacy and architecture cleanup

Removed the backend point-buy and check-modifier re-export adapters. The backend snapshot and tests now use the public engine API directly. Restored the frontend adapter after the first frontend run exposed its package-contract test, which explicitly compares that adapter to the public package. No persisted data or command contract referenced the adapters. The historical sourceRules.json has a documentation provenance reference and no runtime import. Kept it as archival source material. Generic activation remains absent from supported frontend commands. No effect identity fallback or receipt behavior was added.

Callings and Paths retain their dedicated locations, equipment and spells retain individual engine-owned records, and Training remains separate. The new exports sit in existing domains and use no host dependencies.

## Changed files

- Engine: package.json, README.md, src/vitality/index.js, src/callings/{path-grants,rules}.js, src/callings/corsair/paths/saltglass-duelist.js, tests/execution.test.cjs.
- Backend under src/modules/archipelago: combat/snapshot.js, system/rules2024/{healingEffects,corsairOperations,engine}.js. Removed system/{checkModifier,pointBuy}.js. Updated tests/{checkModifier,pointBuy}.test.mjs and added tests/support/phase3-final-ownership-probe.mjs.
- Frontend: added docs/character-system/phase3-pass36.md.
- Both consumers: package.json, package-lock.json and vendor/crossworld-sanguine-engine-0.29.0.tgz.

Both applications resolve 0.29.0. Archive SHA-256 is `576ef5780fdf64a240f190179628100d110590a8487043de427a3289bc9e5151` and both lockfiles match `sha512-abamAiAq+z4fwukeH5N7Fu7Qqz4kJ5HKunZqyEufY6X4f2mVBcOk10WiIQ0gELmNSZ2gh5w/rd/w2LlYOtyBMw==`.

Phase 3 remains open. The remaining targeted work is the Calling advancement schedules and tactical outcome branches above. The audit in this pass verified the listed boundaries and adapters. It did not establish exhaustive ownership of every gameplay function.

## Final verification

| Suite | Passed | Failed | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 84 | 0 | 0 | 0 |
| Backend | 638 | 0 | 0 | 1 |
| Frontend | 113 | 0 | 0 | 0 |

Both lint checks, the frontend production build and 263 backend syntax checks passed. The existing frontend build warning remains. Engine and backend Archipelago dependency graphs both have zero cycles. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset.

All 41 Pass 35, 12 attack, 91 execution, 494 fixed-roll, 1,210 roster and 31,690 retained regression observations matched. The HTTP catalog identity test passed. Catalog hash and ETag remain e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144. The full backend suite includes authenticated command, historical replay, stale revision and rollback cases.
