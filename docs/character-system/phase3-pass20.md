# Sanguine Archipelago — Phase 3, Pass 20

## Vitality and healing ownership

Pass 19 established that Hit Dice already belong to the engine and that Long Rest calls the same Health transition as ordinary healing. Pass 20 adds the shared `/vitality` module in `@crossworld/sanguine-engine@0.15.0`.

| Path | Behavior and ownership |
| --- | --- |
| Ordinary healing | `health.apply` accepts a nonnegative integer `healthDelta`. There is no registered `health.heal` command. The standalone runtime's `health` operation also accepts negative adjustments and owns its separate concentration cleanup. Healing spells, healing abilities, equipment treatments, Blessed Healer and Heroic Rally reach the same ordinary healing transition. The engine caps Health, rejects dead targets and invalid amounts, and returns fresh death saves and cleared pending Relentless Rage whenever resulting Health is positive. The backend maps engine healing errors to the original HTTP 422 messages. |
| Hit Die healing | The existing engine Hit Die operation now reuses `capHealing`. It continues to change only Health and available dice, including when it heals from zero in direct runtime calls. It preserves death saves, pending Relentless Rage, temporary Health and concentration bookkeeping. A persistent rest still needs positive Health at start. |
| Long Rest | The runtime uses ordinary healing at maximum and applies the engine temporary Health clear and nourishment rule. The backend filters out concentration and expired effects, clears checks, and keeps session, clock, counters, and journal orchestration. Short Rest Tireless recovery continues at Navigator level ten. Nourishment still affects only Long Rest. Both exhaustion recoveries floor at zero. |
| Damage and temporary Health | The engine takes post-mitigation damage and returns Health, absorption, remaining temporary Health and death saves. It preserves the massive-damage threshold and damage-at-zero failures, including critical doubling. The backend still decides Resistance, Immunity, Evasion and equipment-dependent reductions, Unbroken Current, and source attribution. Explicit temporary Health choice replaces an existing pool even with a lower value. Source grants have separate eligibility and replacement rules and stay with their callers. Expiry and Long Rest share the same clear patch. |
| Death saves and stabilization | The engine evaluates a supplied roll and returns continuation, stabilization, or restoration. Defy Death's threshold still applies from Deadeye level 18. The backend supplies random or confirmed rolls, checks eligibility, records the 1d4-hour stabilization deadline and owns timed recovery. Explicit revival resets death saves using its own transition and leaves pending Rage to the caller. |
| Relentless Rage | The engine shares the DC formula and ordinary healing reset. The backend checks active Rage, generates or accepts the save, records the attempt and ends Rage on failure. Damage still sets pending Rage only for an eligible Reaver, and the clock still clears it if Rage expires. |
| Concentration and effects | The backend owns live-effect queries, random check IDs, mitigation and source selection, clock expiry, and turn/encounter journals. Long Rest and negative runtime adjustment retain their original cleanup paths. |

The persistent frontend `CharacterStateControls.jsx` sends `health.apply`, `health.damage`, `temp-health.choose`, `condition.record`, `death-save.roll`, `concentration.resolve`, and `relentless-rage.resolve`. It displays saved state and pending checks. `PersistentResources.jsx` and `RestPlanner.jsx` still send rest options and world time. There is no frontend gameplay change in this pass.

## Before-and-after evidence

From the workspace root, run `node crossworld_backend/tests/support/phase3-vitality-probe.mjs`. An optional first argument writes the observations to a JSON file. The probe uses Doctor, Navigator before and after Tireless, Bloodwake Reaver, Deadeye Gunslinger and Sanguine Conduit Tidecaller. It crosses zero, partial and full Health with plain, pending Rage, dead, stable and active-save states. Cases cover invalid and capped healing, Nourishment and Tireless, Hit Dice, temporary Health, active and timed effects, known death-save rolls, damage thresholds and Rage resolution. It normalizes generated IDs while preserving references within each observation. All 3,960 observations matched, including state, operation results, and error classes, statuses and messages. SHA-256 after normalization is `6f1284e59b3c941510503478bd3d5e51cf9cbd5f57128e9fd2916360e28f9826`.

The Pass 19 rest probe also matched all 2,640 observations and its retained SHA-256 `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b`. Before the extraction, the focused vitality, healing spell, rest and command suites passed. The new healing transaction test verifies one write, saved death-save reset, retained temporary Health, unauthorized replay, operation ID conflicts, stale revisions, and no writes or receipts for rejected requests. Its handler fixture reloads historical receipts and checks that authorization precedes replay and replay precedes fresh revision checks. Existing healing-spell tests retain spell and Path coverage, and existing vitality integration tests cover random stabilization deadlines and concentration.

## Files and API

- Engine: `package.json`, `README.md`, `src/vitality/index.js`, `src/hit-dice/index.js`, `tests/vitality.test.cjs`.
- Backend runtime: `src/modules/archipelago/system/rules2024/healthState.js`, `vitality.js`, `runtime.js`, `clock.js`, and `featureOperations.js` in that same directory.
- Backend verification: `tests/phase2.commands.test.mjs`, `tests/support/phase3-vitality-probe.mjs`.
- Both consumers: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.15.0.tgz`. Both installed package versions and lockfile integrity values were checked. The archives are byte-identical.
- Frontend checkpoint: `docs/character-system/phase3-pass20.md`.

The new `/vitality` export supplies `HealingError`, `freshDeathSaves`, `healVitality`, `capHealing`, `restoreVitality`, `resolveDeathSave`, `applyVitalityDamage`, `relentlessRageDC`, `clearTemporaryHealth`, and `recoverRestExhaustion`. Transition functions return fresh patches or outcomes. The host provides validated state, resolved damage or rolls, eligibility, effects and timestamps. The command contract, transaction code, revision and receipt handling stayed with the backend.

## Verification

| Check | Result |
| --- | --- |
| Engine tests | 56 passed, 0 failed, 0 skipped |
| Backend tests | 628 passed, 0 failed, 1 skipped |
| Frontend tests | 113 passed, 0 failed, 0 skipped |
| Backend and frontend lint | Passed |
| Frontend production build | Passed with the existing Vite bundle-size warning |
| Backend syntax | 185 source files passed |
| Dependency cycles | Zero in engine and backend Archipelago, including deferred imports. The existing frontend map cycle was outside scope. |
| Isolated MongoDB | Skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. The handler fixture verifies application sequencing. Database-backed transaction behavior was not verified in this run. |

## Pass 21

Audit post-mitigation versus pre-mitigation damage ownership and sourced temporary Health grants. The backend still computes Evasion, Resistance, Immunity, Reef Skin, and concentration DC. Those calculations are candidates for a pure transition once their required facts and ordering are characterized. Keep equipment lookup, feature authorization, effect timing, RNG, and cross-character journals in the host. Characterize direct temporary Health grants, explicit player choice and receipt-backed grants before consolidating any code, since their replacement and source metadata behavior differs.

Two unusual behaviors were preserved for separate review: direct Hit Dice can raise zero Health while leaving death saves intact, and damage at zero still accrues failures when temporary Health absorbs the whole positive hit. This pass makes no gameplay decision about either behavior.
