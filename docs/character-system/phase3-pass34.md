# Sanguine Archipelago — Phase 3, Pass 34

## Baseline

Started at engine 0.26.0 and read the Pass 33 checkpoint. The pre-edit combat, equipment integration and caster Path suites passed 14, 9 and 11 tests respectively. The 91-case Pass 33 execution probe reproduced its stored hash. A new fixed-dice command probe captured 12 attack outcomes across misses, ordinary and critical hits, two target Health values, Action spending and revision changes. Pre-edit SHA-256 was e61a217d713d0a549f0c75e2a8b9fffb257ce52118cbc0a1b2e8fa85341f1c4f. Reproduce it with `node crossworld_backend/tests/support/phase3-attack-probe.mjs`.

## Ownership decisions

| Status | Caller and function | Mechanical inputs and output | Host boundary and tests |
| --- | --- | --- | --- |
| Migrated | combat/state.applyCommand through combat/attack.resolveAttack | Resolved actor and weapon to attribute, Training and disadvantage. Selected d20 and Guard to hit and critical. Resolved damage dice to adjusted damage and Health floor. | Backend owns turn, Action, target, RNG and journal. Combat tests and fixed-dice command probe. |
| Migrated | rules2024/selections through equipment/magicProjection.project | Active item profiles to additive Guard, save and spell attack bonuses, boolean capabilities and maximum swim speed. | Backend resolves owned, worn, held and attuned instances and applies projected results. Equipment integration and saving throw probes. |
| Migrated | equipmentView through equipment/loadout.deriveLoadout | Might and size multiplier to carrying limits. Definition weight, bundle units and quantity to known weight. | Backend resolves instance inventory and reports unknown weight entries. No encumbrance policy was introduced. Equipment integration and execution probes. |
| Migrated | rules2024/engine.replay | Level-three designed Path and discipline to automatic skill and tool grants. Existing shared Training helper resolves promotion. | Backend validates choices, appends grants in ledger order and translates errors. Roster and execution probes. |
| Host-owned | combat/state.applyCommand, equipment/magicProjection.eligible and equipment/loadout.deriveLoadout | Action and encounter state, instance eligibility and persisted slot validation. | The host maintains instance lookup and state transitions. Pure spellcaster attunement eligibility can be reviewed independently. |
| Blocked | abilityOperations.activate ghost-repair and ghost-sabotage | Repair cap and discovery DC still mixed with live inventory, object identity and tool validation. | Capture successful Ghost Patch and sabotage responses, including sampled repair and rejection without mutation. Breakwater, relay and salvage arithmetic already lives in the engine. |
| Blocked | abilityOperations.activate triage and impossible-operation, and healingEffects.targetEffects | Non-spell treatment beyond the migrated limits and conditions still combines rolled outcomes, kit charges, self/other targeting and live conditions. | Trace the local and recipient paths and characterize capped healing, revive eligibility and journals. |
| Host-owned | casterPathOperations.apply | The module handles Tidecaller record and effect orchestration. Storm Pulse and Conductive Soul use shared previews for damage. | Clock, owner turn, source casting and event uniqueness remain host responsibilities. |
| Blocked | casterPathOperations.convert, equipment/magicProjection.project movement branch, and Calling tactical handlers | Typed spell damage conversion, armor movement and additional tactical outcome rules still mix projected facts with host decisions. | Characterize live conversion consumption, suppression and effect order before moving the remaining pure branches. |
| Blocked | rules2024/engine.replay remaining choice branches | Pending choice order, invalid choices, multiclass gates and other grants need replay parity before further migration. | The roster matrix captures ordinary progression. Add targeted error and incomplete choice comparisons. |
| Design decision required | spellOperations.cast hit-trigger branch and character damage command | Smite damage application has no existing linked hit-resolution contract. | See proposal below. |

## Smite contract investigation and proposal

Static profiles identify Divine, Searing and Shining Smite as hit-triggered. The persistent sheet collects a confirmed trigger label and target. The cast handler validates the label, allows one hit target, requires the owner's open turn while in combat, and rejects repeated trigger evidence under its current casting rules. It spends the selected slot or the appropriate free-use pool. Cast management and effect tracking record timing and concentration. Divine Smite can create the existing Leviathan Anchor protection effect. The hit trigger label is caller-supplied evidence. The cast result does not roll or apply smite damage. The standalone combat attack and character health.damage paths have no smite-specific link to the cast record.

Proposed contract for approval:

1. Use the existing native hit journal where a recorded hit exists. Decide separately whether GM-confirmed external hits can create an authoritative equivalent. Bind the evidence to actor, target, turn and critical status.
2. Use the cast's actual slot level or explicit free-use level and engine spell data to resolve the initial payload. Confirm how critical dice, eligible rider bonuses, repeat saves, ongoing damage and separate damage types apply for each smite.
3. Preserve existing casting-turn checks and charge exactly one slot or free use. If a native target can be updated in the same authorized transaction, commit the cast, hit consumption, target damage and receipt atomically. If a separate resolution is required, link it by cast ID and enforce exactly-once application without a second resource debit.
4. Route damage through the existing target vitality transition so resistance, temporary Health and concentration checks follow its established order. Keep protection, concentration, initial effects and periodic resolution keyed to canonical IDs and actual timing.
5. Return original responses for matching historical receipts. Existing cast records require an explicit policy before becoming valid resolution sources. Test eligibility, slot/free use, upcast and critical cases, actor/target mismatch, duplicate evidence, stale revision, rollback, receipt replay, defenses and concentration.

The pass implements no new smite damage contract.

## Changed files

- Engine: package.json, README.md, src/combat/attack.js, src/equipment/magic-modifiers.js, src/equipment/carrying.js, src/callings/path-grants.js, src/callings/rules.js and tests/execution.test.cjs.
- Backend under src/modules/archipelago: combat/attack.js, equipment/magicProjection.js, equipment/loadout.js and system/rules2024/engine.js. Added tests/support/phase3-attack-probe.mjs. The previous backend formulas were replaced at their call sites.
- Both applications: package.json, package-lock.json and vendor/crossworld-sanguine-engine-0.27.0.tgz. Frontend gameplay source did not need changes. Added docs/character-system/phase3-pass34.md.

Phase 3 remains open. Prioritize the specific device, treatment and incomplete advancement fixtures above, and settle the smite contract separately before automating damage.

## Final verification

| Suite | Passed | Failed assertions | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 79 | 0 | 0 | 0 |
| Backend full run | 637 | 0 | 1 | 1 |
| Backend combat serial retry | 14 | 0 | 0 | 0 |
| Frontend | 113 | 0 | 0 | 0 |

The authenticated combat HTTP workflow timed out during the concurrent full run and an overlapping targeted retry. Its isolated retry passed the complete file at the existing timeout. No test settings changed. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset. Both lint checks, the frontend production build and all 263 backend syntax checks passed. Engine and backend Archipelago import graphs have zero cycles.

The 12 new attack cases and all 91 Pass 33 execution cases matched their pre-edit hashes. All 494 fixed-roll cases, 1,210 roster observations and 31,690 retained regression observations matched. The catalog hash and HTTP ETag remain e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144. Existing tests exercised historical receipt replay, stale revisions and rollback.

Both applications resolve 0.27.0 and their vendored archives share SHA-256 `7d595ca26391dcfad819ef1cea33690e2dabdf3f287570f05de90cd3ab65a8ae`. Both lockfiles match `sha512-W+DpOjZM1mueRIaX3MYw3jdtbWvyHcVBsbT/5C6QAAi6ib/QMDT52sBemylByI0O8dcR0tsKxj1AvZh2vK1SUg==`.
