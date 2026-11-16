# Sanguine Archipelago — Phase 3, Pass 30

## Pre-edit ownership inventory

| Domain | Authoritative source and consumers | Migration boundary |
| --- | --- | --- |
| Callings, Paths, features and typed options | Engine roster, shared progression, resources and typed option previews. Backend replays the ledger and projects the catalog, which the creator and sheet consume. | Split declarative records by Calling and Path and put option definitions beside their owners. Maintain package and serialization contracts. |
| Weapons, firearms, armor, shields, supplies, ammunition, tools and packs | Backend equipment blueprint combines weapon, armor, shield, supplies, pack, SRD and component tables. Backend inventory, loadout, combat and equipment projection consume these definitions. Frontend consumes the catalog and loadout projection. | Move the blueprint, static records and weapon groups. Preserve grants, properties, damage profiles and metadata. |
| Magic items and object-use profiles | Backend static magic profiles and object-use tables inform inventory, item casting and equipment actions. | Move static records. Keep attunement state, ownership, charge spending, instance lookup, deployed objects and persistence in the host. Deterministic loadout and item calculations still require a separate audit. |
| Spells and casting | Backend catalog owns records with spell lists, levels, cast times and concentration flags. Static profiles supply range, duration, components, trigger and mechanical detail. Host equipment services handle scroll and charged-item casts. Engine owns slot accounting, preparation limits and casting-turn rules. | Move the catalog, typed profiles and priced component table. Preserve spell order. Keep cast instances, RNG, effects, target resolution and transactions in the backend. Runtime scaling and resolution remain for follow-up. |
| Combat, resource and effect mechanics | Engine vitality, resources, rest, saving throws and Calling helpers supply core arithmetic. Typed backend handlers still combine numerical rules with encounter and effect orchestration. | Keep host clocks, event journals, IDs and persistence. Extract additional resolved mechanical rules in verified slices. |
| Training, Expertise, creation and advancement | Engine owns Training primitives, attributes, point buy, progression and reconciliation. Backend resolves ordered ledger choices, inventory eligibility and character validity. Frontend handles inputs and projections. | Keep Training dedicated. Audit Calling-specific choice application and frontend roll eligibility separately. |
| Legacy and presentation | Backend equipment and spell entry points are shared across live consumers. Frontend retains roll eligibility and presentation. | Keep persisted names and live boundaries. Remove superseded local content when canonical package exports are installed. |

Pre-edit hashes captured from the live 0.22.0 sources.

| Data | SHA-256 |
| --- | --- |
| Equipment blueprint | ac35a648ab06d54257ceea17fc5b0ac0c51bd37119610ed217cfbff0c3449eda |
| Spell profiles | 6b38743afa2faf6a9d9b569eda5766a59043cec78f64880480c87b47757f141f |
| 316 spell records | 1ad51aff83b322e993e60c81edad8098293444eecd551468a2bd3c517d289db9 |

## Completed architecture

- `src/callings/<calling>/definition.json` contains the Calling, its timeline and its own feature records. `paths/<path>.json` contains one Path and its features. Each Calling index assembles the same public object. Gunslinger retains an explicit feature order because its original public order interleaves owners. Typed option declarations are grouped by Calling. Shared option previews and cross-Calling progression, resources and mechanics remain in their existing modules.
- `src/equipment/` contains the catalog assembler, weapon, armor, shield, supply, pack and magic item definitions, SRD gear, object-use profiles, weapon groups and the original equipment attribution. The engine now exports the 248-item blueprint. The backend blueprint module delegates to that export and still owns contextual equipment projection and inventory state.
- `src/spells/definitions/level-*/<id>.json` contains one file per spell. A single index preserves original serialized order. `src/spells/profiles/` contains the typed operational profiles and `src/spells/materials.js` contains priced components. Slot, preparation and turn-budget APIs remain available through their existing subpaths.
- New engine package exports are `/spells`, `/equipment`, `/equipment/weapons`, `/equipment/weapon-groups`, and `/equipment/object-use`. The former backend records were moved out of the backend. Feats remain in the backend catalog.

## Change inventory

- Engine Calling data for Corsair, Gunslinger, Navigator, Tidecaller, Warden, Reaver, Doctor and Shipwright moved from eight top-level JSON files to per-Calling `definition.json`, `index.js`, `paths/*.json` and Calling option files where applicable. Gunslinger execution moved from `src/callings/gunslinger.js` to `src/callings/gunslinger/rules.js`. Existing entry points and internal imports updated in `index.js`, `roster.js`, `progression.js`, `resources.js` and `ability-options.js`.
- Engine added `src/spells/index.js`, `src/spells/definitions/index.js` and all 316 per-spell files, `src/spells/profiles/index.js`, `src/spells/profiles/data.json` and `src/spells/materials.js`.
- Engine added `src/equipment/` files `index.js`, `armor.js`, `shields.js`, `supplies.js`, `srdGear.json`, `packs.js`, `weapons.js`, `objectUseProfiles.js`, `weaponGroups.js`, `magic-items.js` and `NOTICE.md`. The corresponding backend originals were moved from `system/blueprints/equipment/` and `equipment/magicProfiles.js`. The old blueprint entry now delegates to the package.
- Engine updated `package.json`, `README.md`, `NOTICE.md` and added `tests/catalogs.test.cjs`.
- Backend gameplay imports updated under `src/modules/archipelago/` in `combat/weapons.js`, `equipment/utilization.js` and `system/rules2024/{blueprint,casterPathOperations,equipmentView,metamagic,rules,spellMaterials,spellOperations}.js`. Removed backend `spellProfiles.js`, `spellProfiles.json` and `definitions/spellMaterials.js` after migrating their content. Removed the spells array from `canonicalRules.json`.
- Backend test imports updated in `tests/equipment.test.mjs`, `tests/phase2.commands.test.mjs`, `tests/phase3.contract.test.mjs` and `tests/helpers/phase3-equipment.mjs`.
- Both applications updated package and lock files and added `vendor/crossworld-sanguine-engine-0.23.0.tgz`. Frontend gameplay source required no edits for the catalog migration.

## Exit assessment

Phase 3 remains open. Blocking work includes separating portable execution and equipment rules from backend state handling, especially typed attack and defense outcomes, smite, treatment, deployed devices, deterministic loadout modifiers and Calling-specific advancement choices. The frontend roll resolver still assembles situational advantage, disadvantage and floor rules and needs its own parity matrix before moving that logic. Static spell profiles and equipment records now have a single owner. Continue by auditing typed spell scaling, Metamagic and loadout calculation call sites against successful persisted command fixtures, then remove any wrappers proven obsolete. The map import cycle and build warning are nonblocking. Encounter geometry, clocks, target authorization, owned instances and transactions remain host responsibilities by design.

## Verification

- All 1,210 roster observations matched the prior baseline across the eight Callings and 32 Paths through level 20. All 31,690 retained observations matched the hashes in Pass 29. The catalog hash remains `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. The HTTP catalog test verified its exact ETag and conditional response.
- The equipment blueprint, spell records and spell profiles retained the exact pre-edit SHA-256 values above. Focused engine tests enforce this parity.
- Engine tests passed 71 of 71 and frontend tests passed 113 of 113. Frontend lint and production build passed with the existing chunk-size warning.
- All 264 backend source, script and test syntax checks passed. Dependency analysis found zero engine and backend Archipelago cycles. The frontend map cycle remains.
- Engine 0.23.0 resolves in both consumers. Both archive files have SHA-256 `2e377b3da56afba2c587857c69445a19ac0bd265605357277df80c56490bc902` and both lockfiles match integrity `sha512-ay3PUrQH0tSz0XY0vaGcDQMu0jqsinXQdvXfVJTVA8i7SC1Cj0VA219q2bJ5gIe6O2nMojzyV1fafkkAuabhuQ==`.
- The complete backend suite passed 638 tests with zero failures and one isolated MongoDB skip because SA_PHASE2_TEST_MONGO_URI was unset. Backend lint passed. Command tests retained receipt replay, revision enforcement and rollback coverage.
