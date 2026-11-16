# Sanguine Archipelago — Phase 3, Pass 28

Engine **0.21.0** owns the authoritative roster, progression and typed ability options for all eight Callings and 32 Paths. The seven additions use the same `/callings` export as Gunslinger. The pass migrated representative execution calculations for all seven. Additional deterministic rules embedded in host handlers remain for a follow-up.

## Roster and parity

Each Calling was characterized before production changes using four Paths at levels 1–20. Each row counts complete replayed summaries and runtime projections plus representative costed command attempts. The command probe uses unconfirmed payloads to exercise validation and error precedence. Successful execution, effect timing and persistence have separate retained and transaction tests.

| Calling | Paths | Matched observations |
| --- | --- | ---: |
| Reaver | Bloodwake, Thunderhide, Chainbreaker, Reef Colossus | 160 |
| Corsair | Reef Knife, Black Flag Envoy, Hollow Lantern, Saltglass Duelist | 135 |
| Navigator | Gray Net, Storm Broker, Starwake Pilot, Mangrove Stalker | 145 |
| Warden | Leviathan Anchor, Oath of the Free Port, Iron Covenant, Lantern Vigil | 160 |
| Tidecaller | Omen Diver, Memory Echo, Tempest Heart, Sanguine Conduit | 160 |
| Doctor | Sanctuary Hand, Field Surgeon, Plaguewarden, Keeper of Last Breaths | 156 |
| Shipwright | Powder Saint, Drydock Ghost, Breakwater, Sparkwrite Aetherist | 134 |
| Gunslinger | Deadeye, Iron Suppressor, Brass Outrider, Cinder Artillerist | 160 |

Run `node crossworld_backend/tests/support/phase3-roster-probe.mjs` from the workspace root. The table includes 640 Path-level projections and 570 typed command observations. Shared catalog assembly was changed in one integration step after capturing the whole roster. Catalog content hash and ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`.

## Ownership

| Owner | Rules and responsibilities |
| --- | --- |
| Engine roster | Immutable Calling and Path definitions, feature IDs and source attribution, grants, choices, level schedules and ordered catalog entries |
| Engine progression and pools | Combat scaling, spellcasting modifier and DC, slot and preparation limits, pool capacities and recovery grants |
| Engine typed options | Option IDs, action and cost declarations, deterministic selection filters, and roll, save and damage previews |
| Engine execution formulas | Colossus Stance temporary Health amount, Stroke of Luck total, Mangrove Vanish damage, Aura of Protection bonus, Blood Price Health cost, Comfort temporary Health, and Breakwater barrier reduction |
| Backend | Authentication, authorization, payload contracts, ledger replay and choice validation, target and equipment lookup, encounter context, dice generation, timing, effect identity, event journals, revisions, transactions and receipts |
| Frontend | Creator and sheet presentation, including server-projected options, resources and recovery values |

The backend combines engine entries with locally owned feats and spells. Catalog order preserves existing serialized identity. The old Path assemblers and local Calling progression module were removed after checking references. Existing Training, vitality, spell-slot, preparation, rest and resource modules remain in use.

## Files

- Engine Calling sources under `src/callings/` are `ability-options.js`, `catalog-order.json`, `index.js`, `gunslinger.js`, `mechanics.js`, `progression.js`, `resources.js`, `roster.js`, `rules.js`, and the seven added JSON definitions `reaver.json`, `corsair.json`, `navigator.json`, `warden.json`, `tidecaller.json`, `doctor.json`, and `shipwright.json`.
- Engine package and checks are `package.json`, `README.md`, `NOTICE.md`, and `tests/roster.test.cjs`.
- Backend rules under `src/modules/archipelago/system/rules2024/` are `abilityOptions.js`, `abilityOperations.js`, `blueprint.js`, `canonicalRules.json`, `catalog.js`, `conduitOperations.js`, `engine.js`, `navigatorOperations.js`, `reaverOperations.js`, and `rules.js`. Removed `newPaths.js`, `originalPaths.js`, and `progression.js`.
- Backend verification is `tests/phase3-gunslinger.test.mjs` and `tests/support/phase3-roster-probe.mjs`.
- Both consumers updated `package.json` and `package-lock.json` and added `vendor/crossworld-sanguine-engine-0.21.0.tgz`. Frontend documentation added this checkpoint.

## Remaining Phase 3 work

Extract the remaining portable calculations from typed execution after characterizing successful cases with resolved rolls and context. Prioritize Rage and Path resistance decisions, Corsair and Navigator tactical outcomes, Warden protection and smite branches, Tidecaller and Conduit conditional outcomes, Doctor treatment results, and Shipwright object and deployed device statistics. Shared choice application and Training-to-Expertise promotion in ledger replay also merit an ownership review. Keep target resolution, inventory instances, clocks, RNG, effects and transaction state in the host. Existing frontend map dependency cycle remains outside this migration.

## Roster SHA-256

~~~~text
reaver 160 eb901d702a0659b8276e799faddec1d048b59d9a684c2c4f5d516d18b49bd9c5
corsair 135 c246f3975ad4ce1e18a0dbb037033d738c5d7db2ee6b35d6d1fdf161641c4993
navigator 145 8394fb3ba27a8479b7165e5110c40836dc288cc970c54e09b1b728bbfad22a62
warden 160 ed9f141f89f154cc732b26d609c6d821078f50e72cd60424e782dd91fb006f18
tidecaller 160 3f1cfe16716dc493630239e79a55f76303d93367e64c7426ee160c496edf119e
doctor 156 d8c5ca674ab1f3cedca5095929c81639a76d6dca441c86374b2e620ad1496613
shipwright 134 fac3ac5cdd56c0e1e18a2b2e2171a970e10e1b0124cbba94b3aa3270e3444940
gunslinger 160 afa0c4cc48342029c6fd16a8c8df46051a54be5c53c1bd589c315d3e0903aeef
catalog e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144
~~~~

## Verification

The engine suite passed 68 tests and the frontend suite passed 113, with zero failures or skips in either. Backend and frontend lint passed. The frontend production build passed with the existing chunk-size warning. The engine and backend Archipelago import graphs have zero cycles. The frontend graph still has the existing MapCanvas, AuthoredShapeLayer and ShapeEditorLayer cycle.

Both applications resolve 0.21.0. Their archives are byte-identical at SHA-256 `bca49c18ac5548eb246578728a22abba63ef7e113e45ef141ef8764d1a6ce3dd`. Both lockfile integrity values match the archive SHA-512 `sha512-Vi3HTO/HvjZsOjr2jU+BDG8iqYOee1B/oft/Z4pM/78AMoMahc8eQqN6r/g1KCeJh+/NZNVD7mpDWc2EKK4NGw==`.

The legacy temporary Pass 20 fixture differs from its original snapshot in 100 of 3,960 normalized observations, with differences around Rage effect and counter cleanup. The maintained vitality probe is the current regression fixture and matches the Pass 27 baseline. The legacy snapshot is excluded from the retained parity count.

The retained matrices matched 31,290 observations from Pass 27, plus 400 Gunslinger observations. The values below are the matching SHA-256 hashes.

| Probe | Count | SHA-256 |
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

The full backend suite passed 638 tests with zero failures and one isolated MongoDB skip. `SA_PHASE2_TEST_MONGO_URI` was unset. All 274 backend syntax checks passed. HTTP tests verified the exact catalog ETag and conditional response. The command suite verified revision and authorization ordering, matching historical receipt replay, effect identity, one-time spending and rollback on rejected commands. No database changes were made.
