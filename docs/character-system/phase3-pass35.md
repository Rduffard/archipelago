# Sanguine Archipelago — Phase 3, Pass 35

## Function ownership

| Status | Backend function or branch | Mechanics and boundary |
| --- | --- | --- |
| Migrated | abilityOperations.activate ghost-repair and ghost-sabotage | Engine Drydock Ghost rules choose the required tool, cap resolved repair at missing Health and project the existing spell save DC onto sabotage. Backend validates evidence and inventory, rolls healing and records the object and effect. |
| Migrated | abilityOperations.activate impossible-operation | Engine Field Surgeon rules resolve the intact, consenting, non-self and zero-to-sixty-second eligibility gate and restored Health. Backend spends the kit and ability resources and issues the recipient effect. |
| Host-owned | abilityOperations.activate triage | Existing engine option preview supplies dice and kit charges, and the Field Surgeon helper supplies condition outcomes. Backend owns the rest-epoch lock, RNG, kit instance and recipient application. |
| Host-owned with remaining pure candidates | healingEffects.targetEffects | Prayer of Healing epoch, condition source and live revival/death state are recipient orchestration. Bloodied and half-Health cap arithmetic still sit here. Cover recipient state and rollback before moving those shared gates. |
| Migrated | casterPathOperations.convert | Engine spells calculate the opposite-type substitution, deduplication and forfeiture facts. The backend consumes the pending effect and preserves the order and exact turn gate. |
| Migrated | equipment/magicProjection.project movement branch | Engine equipment calculates walking penalties, Tempest Heart heavy armor fly suppression and swim projection. Host resolves active armor, effects and magic item instances. |
| Migrated | rules2024/engine.replay | The engine supplies level-three specialty tool grants for Drydock Ghost, Storm Broker, Breakwater and Field Surgeon. Backend preserves ledger order and tracks incomplete or invalid choices. |
| Blocked | rules2024/engine.replay remaining choice branches | Broader choice extraction requires explicit multiclass and precedence coverage. |
| Blocked | tactical operation handlers beyond casterPathOperations.convert | Pass 34 attack and Pass 33 strike mechanics remain shared. Additional Path tactical outcomes lack domain-specific successful matrices in this pass. |
| Design decision required | spellOperations.cast hit-trigger branch | Existing hit confirmation and cast evidence are separate from target damage resolution. See proposal below. |

## Smite contract for approval

The live sheet emits spell.cast with a confirmed hit-event label and one target. The backend checks the target and combat turn, prevents trigger reuse under its current casting rules, spends a spell slot or explicit free use, and records the cast and effects. The combat encounter attack journal and character health.damage command have separate identities and state boundaries. Neither currently resolves initial damage from the smite cast. The Pass 33 execution probe confirms successful slot and free Divine Smite casts and preserves the existing Smite of Protection effect.

The catalogs describe the following spell behavior. Divine Smite starts at 2d8 Radiant, adds 1d8 against Fiends or Undead, and adds 1d8 per slot above first. Searing Smite starts at 1d6 Fire on hit, repeats at target turn start before a Resolve save, and increases all damage by 1d6 per slot above first. Shining Smite starts at 2d6 Radiant and adds 1d6 per slot above second. Its concentration effect provides light, grants Advantage against the target and prevents it benefiting from Invisible. These are catalog descriptions. Today the cast runtime records management and effect timing without resolving those damage or target outcomes.

Proposed implementation boundary:

1. Within a connected encounter, require a saved successful hit attached to the same caster, target and applicable turn. Include weapon/unarmed eligibility, critical status and damage event identity. For external play, require a separately authorized GM attestation carrying the same stable evidence. The product decision is whether external attestation may authorize automatic damage to a persisted target.
2. Resolve initial smite through existing spell.cast and its current Bonus Action and trigger checks. Read effective slot level from the committed expenditure. Decide the effective level of free uses, critical handling per spell, eligible rider facts and how unknown target types are represented before wiring them into the engine.
3. For targets whose state can participate in the same authorized database transaction, write cast state, hit consumption, vitality changes and receipt together. Otherwise use a typed follow-up keyed by cast and target with a unique consumption record and zero additional debit. Decide whether that follow-up is supported before exposing UI.
4. Use the existing vitality pipeline for each resolved damage packet. Keep Searing turn ticks and saves keyed to the canonical effect and target turn. Tie Shining target markers and removal to the concentration owner and canonical effect. Preserve Smite of Protection and existing concentration replacement semantics.
5. Return the original response for any matching historical receipt. Historical casts become resolution sources only under an explicit backfill policy. Test trigger mismatch, cross-owner permission, repeated hit and tick resolution, slot/free scaling, criticals, resistances, temporary Health, concentration, resource exhaustion, stale revisions and full rollback.

No smite execution code changed.

## Files

- Engine: package.json, README.md, src/callings/path-grants.js, src/callings/doctor/paths/field-surgeon.js, src/callings/shipwright/paths/drydock-ghost.js, src/spells/conductive-conversion.js, src/equipment/movement.js and tests/execution.test.cjs.
- Backend: src/modules/archipelago/equipment/magicProjection.js and src/modules/archipelago/system/rules2024/{abilityOperations,casterPathOperations,engine}.js. Added tests/support/phase3-treatment-probe.mjs.
- Both applications: package and lock files, vendor/crossworld-sanguine-engine-0.28.0.tgz. No frontend gameplay files changed.

## Baseline and focused parity

Pre-edit engine passed 79, frontend passed 113 and backend passed 638 with one isolated MongoDB skip. The prior combat HTTP timeout did not recur in the serial baseline. The Pass 34 archive SHA-256 matched across both pre-edit vendors. The pre-edit full backend catalog identity test passed.

The new matrix is reproducible with `node crossworld_backend/tests/support/phase3-treatment-probe.mjs`. It covers successful Ghost Patch and sabotage with actual carried tools, Triage on self, Impossible Operation at time boundaries, current and mismatched conversion turns, conversion forfeiture, heavy and unarmored movement projections, and complete advancement summaries or failures for valid, missing, invalid and duplicate choices. All 41 observations matched pre-edit SHA-256 `9e0de002dec398bb983abb9ae263359d61416b5d6620cf861f1c6f633273b8c9`. The matrix fixes dice and world time and preserves identity relationships when normalizing generated IDs. It calls the command dispatcher for treatment and device rows. Authenticated receipts are tested separately by the backend suite.

Both applications resolve engine 0.28.0. Archives share SHA-256 `8e9f74504f280cbbda2a792927aae9817e71d03f0bb016e3548e170ac1a634d2` and both lockfiles match `sha512-mCgrBx4n4QQitDTqN9kO/qrYSvcly3SeMO1+HHHN0K/TOKNbc8gLcK1BaObKbyDlQh5qGGQOkWM++QakeS/8Ug==`.

Phase 3 stays open. The next architecture audit should focus on remaining recipient treatment gates, incomplete and multiclass choice precedence, and specific tactical handlers. Smite hit authority and damage timing remain gameplay decisions.

## Final verification

| Suite | Passed | Failed | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 82 | 0 | 0 | 0 |
| Backend | 638 | 0 | 0 | 1 |
| Frontend | 113 | 0 | 0 | 0 |

Both lint checks, frontend production build and all 264 backend syntax checks passed. The existing bundle-size warning remains. The engine and backend Archipelago dependency graphs each have zero cycles. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset.

All 12 attack, 91 execution, 494 fixed-roll, 1,210 roster and 31,690 retained observations matched. The HTTP catalog identity test passed and its ETag remains e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144. The full backend suite exercised authenticated commands, historical receipt replay, stale revisions and rollback.
