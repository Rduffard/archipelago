# Sanguine Archipelago — Phase 3, Pass 27

## Ownership inventory

All eight Callings and 32 Paths were enumerated from the live blueprint. The probe's second optional output writes the full inventory with starting grants, Path unlock levels, level-20 features, resource definitions and typed option IDs, actions, handlers and costs for each Path.

| Calling | Paths | Starting save Training | Path feature levels |
| --- | --- | --- | --- |
| Corsair | Reef Knife, Black Flag Envoy, Hollow Lantern, Saltglass Duelist | Agility, Wit | 3, 9, 13, 17 |
| Gunslinger | Deadeye, Iron Suppressor, Brass Outrider, Cinder Artillerist | Might, Resolve | 3, 7, 10, 15, 18 |
| Navigator | Gray Net, Storm Broker, Starwake Pilot, Mangrove Stalker | Might, Agility | 3, 7, 11, 15 |
| Tidecaller | Omen Diver, Memory Echo, Tempest Heart, Sanguine Conduit | Resolve, Spirit | 3, 6, 14, 18 |
| Warden | Leviathan Anchor, Oath of the Free Port, Iron Covenant, Lantern Vigil | Instinct, Spirit | 3, 7, 15, 20 |
| Reaver | Bloodwake, Thunderhide, Chainbreaker, Reef Colossus | Might, Resolve | 3, 6, 10, 14 |
| Doctor | Sanctuary Hand, Field Surgeon, Plaguewarden, Keeper of Last Breaths | Instinct, Spirit | 3, 6, 17 |
| Shipwright | Powder Saint, Drydock Ghost, Breakwater, Sparkwrite Aetherist | Wit, Instinct | 3, 6, 10, 14 |

Gunslinger exercises martial Training, spend and recovery schedules, rerolls, timed effects, weapon and trigger checks, tactical movement and area save calculations. It provides a representative first migration before adding spell preparation and item fabrication.

Before this pass, `catalog.js` held Calling grants and timelines, `canonicalRules.json` held the Path and feature definitions, `progression.js` and `engine.js` supplied level mechanics, and `abilityOptions.js` mapped features to typed option records. Typed execution is hosted by `abilityOperations.js` and feature-specific operation modules. The seven other Callings retain these definition sources. Backend progression and Path suites, the 55-feature map and command suites cover that shared structure. The frontend remains a consumer of the blueprint and projected summaries, with presentation and interaction in the creator and persistent sheet.

## Gunslinger package contract

Engine 0.20.0 exposes `/callings`. It owns the immutable Gunslinger definition and timeline, all four complete Path entries, 35 Calling and Path feature records, and the selected Calling's typed option definitions. These records preserve IDs, prerequisites, Training, feature schedules, choices, costs, actions, printed descriptions and source attribution. Gunslinger has no native spellcasting schedule.

- `gunslingerProgression(level)` gives attacks, mastery and resource use capacities. `gunslingerResources(level, pathId)` adds the Path pool schedule and recovery.
- `gunslingerLevelGrants(level, pathId, discipline)` supplies Fighting Style, Brass Outrider skill and Cinder Artillerist tool grants. The backend still applies choice validation and Training-to-Expertise promotion.
- `gunslingerAbilityPreview` provides Second Wind's roll and level bonus, Suppressing Fire's die and DC, Passing Shot's die, and Measured Charge and Grand Battery's dice and DC.
- `indomitableTotal`, `halfWalkingSpeed`, `gunslingerCriticalThreshold` and `heroicRallyHealing` own their corresponding deterministic rules.

Catalog assembly reinserts the exported engine objects at their existing order anchors. Catalog content hash and ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. Local duplicate Calling, Path, feature and option declarations were removed, including historical Gunslinger Path assembler entries. The engine remains independent of database, HTTP and frontend state. The backend still owns shared ledger and choice validation, equipment lookup, targeting, event journals, RNG, action execution, effect expiry and IDs, revision checks, persistence, and receipts. No frontend source change was needed. The package export is available to future hosts.

## Verification

The clean Pass 26 baseline was 64 engine, 636 backend, 113 frontend passed, with one isolated MongoDB skip. Run `node crossworld_backend/tests/support/phase3-gunslinger-probe.mjs` for the 400-case migration comparison. It captures complete summary data for each of four Paths at levels 1–20, and Second Wind success, exhausted pool, invalid target and stale revision at each level. Generated effect IDs are checked against the saved instance and normalized. Random rolls are checked by range, healing and resulting Health invariants. Pre-edit and post-edit SHA-256 after normalization is `31b4cbbda34da8c80d32ffd72529896edae37c49bb39c8c20298dd070931ca7d`. The probe also hashes the complete blueprint as an independent parity check.

The engine tests exercise all Path resource schedules through level 20, and typed costs and cases at numerical thresholds. A backend test asserts that the live catalog uses the engine's objects and replay uses its resource grants. The Second Wind transaction test verifies one cost, canonical instance ID, historical replay, stale revision, exhausted-pool rejection and rollback. Existing typed tests cover the four Path execution branches.

The 495 generic activation observations and 30,795 retained identity and gameplay observations matched Pass 26. The engine and backend Archipelago dependency analyses found zero cycles. Final tests and checks: 66 engine, 638 backend and 113 frontend passed with zero failures. Backend and frontend lint, the frontend production build, and all 185 backend syntax checks passed. The existing frontend map cycle is outside this pass. Vite retains its existing bundle-size warning. Isolated MongoDB remains skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. The database was not modified.

Both applications resolve 0.20.0. The archives are byte-identical at SHA-256 `611e8e98176f57cc857144a426c8ea1cafda0888e5ebf4cc11e75048d4de0172` and both locks match their archive integrity.

## Files

- Engine: `src/callings/index.js`, `src/callings/gunslinger.json`, `tests/gunslinger.test.cjs`, `package.json`, `README.md`, `NOTICE.md`.
- Backend rules under `src/modules/archipelago/system/rules2024/`: `canonicalRules.json`, `catalog.js`, `rules.js`, `newPaths.js`, `progression.js`, `engine.js`, `abilityOptions.js`, `abilityOperations.js`, `gunslingerOperations.js`, `selections.js`.
- Backend commands and verification: `src/modules/archipelago/characters/commands.js`, `tests/phase2.commands.test.mjs`, `tests/phase3-gunslinger.test.mjs`, `tests/support/phase3-gunslinger-probe.mjs`.
- Both consumers: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.20.0.tgz`.
- Frontend checkpoint: `docs/character-system/phase3-pass27.md`.

## Next migration

Suggested sequence is Reaver, Corsair, Navigator, Warden, Tidecaller, Doctor, Shipwright. This progresses from martial and action-trigger features through half casting, slot conversions, ally treatment and equipment-dependent magic. Pass 28 should move Reaver and its four Paths using the same catalog and level parity probes. Keep shared ledger validation in one place as more Callings use the engine. Remaining Gunslinger host-side candidates include Entrenched Drill, Outrider terrain and heavy armor adjustments, and conditional charge geometry and control payloads. The current slice preserves those mechanics in their existing host handlers.

