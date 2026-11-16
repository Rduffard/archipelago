# Sanguine Archipelago — Phase 3, Pass 23

## Concentration workflow

1. The authenticated handler authorizes the actor and checks operation receipts before fresh document revision enforcement. Fresh commands expire the cloned runtime before dispatch. Direct vitality calls use the state supplied by the caller and can resolve a check that authenticated dispatch would prune.
2. Damage applies mitigation and temporary Health absorption, Health and death-save changes, Unbroken Current and pending Relentless Rage. Incapacitation ends concentration and clears checks. Otherwise, positive post-mitigation damage creates one check when any active concentration effect remains eligible. Full absorption does not reduce the DC, which is half post-mitigation damage rounded down and clamped to 10–30. Zero post-mitigation damage creates no check.
3. The backend excludes the exact feature ID `spell:hunter-s-mark` for Navigator 13+, regardless of source. It generates a check UUID and records the damage, DC, and ordered references from `effect.id ?? effect.featureId`. The exemption does not protect the effect on incapacitation.
4. Resolution accepts only `checkId`, `rolls` and `confirmed`. Missing checks return 422. Supplied rolls must be confirmed, contain exactly one d20 or two with advantage, and contain integer faces 1–20. Omit rolls to generate them server-side. Steady Channel, an active concentration effect with Extended Spell, and an eligible live nearby Sparkwrite relay grant advantage. This path has no disadvantage input. The engine selects the maximum roll, adds projected Resolve, and succeeds at or above DC. Natural 1 and 20 are ordinary totals, with no special floor or cap. Resolve projection uses the attribute modifier, Training and applicable Aura of Protection and Exhaustion adjustments.
5. Success removes the resolved check and preserves effects. Failure removes effects matching any recorded reference and invokes clock cleanup. Clock expiry drops checks with no remaining active concentration reference but preserves the original reference array when any reference survives. Authenticated rejection discards clone changes, including pruning done before lookup. Transaction commits the guarded character update and receipt together.

## Effect reference audit

| Source | Identity and timing |
| --- | --- |
| Ordinary spell | Cast UUID doubles as effect ID. Feature ID is `spell:<spellId>`. Calling or cast source and targets remain on the effect. The backend records creation time and turn, duration and expiry, and clears earlier concentration and checks for a new concentration spell. The cast journal also keeps the spell ID. |
| Scroll | Uses the cast UUID and same spell feature ID, with `scroll:<instanceId>` source. Expiry and replacement follow the scroll cast lifecycle. Consuming the item does not replace the cast identity. |
| Charged item | Uses the cast UUID and same spell feature ID, with `item:<instanceId>` source. The generic code handles concentration and replacement. Existing charged-item tests exercise the item cast path, and the matrix uses item-shaped concentration fixtures. |
| Contingency | The pending wrapper has its own effect identity. Triggering creates a fresh cast UUID and effect using the stored spell identity, source and timing. No separate Ready-action concentration creator was found in this character runtime. The probe includes a synthetic readiness-shaped effect to test source-independent reference handling. |
| Feature effects | The check uses the effect’s concentration flag and active state. Feature IDs remain backend-owned, including the fallback for effects with no instance ID. Rage clears previous concentration effects and checks. |

Two ID-less effects sharing a feature ID can both be removed by one failed check. An effect with its own different ID survives even if its feature ID matches. Manual removal may leave a reference until the next clock cleanup. If a mixed check still has one live reference, stale references remain in that check, and failure matches by stored identity against current effects. These are existing ambiguity boundaries. This pass leaves identity lookup, mutation, expiry, RNG, source selection, authorization, revision checks and receipts in the backend.

## Changes and verification

The shared engine advances to **0.18.0** and adds `resolveConcentrationSave({ rolls, resolveModifier, dc })` to `/vitality`. It returns `{ selected, total, success }`. The engine receives validated rolls and a resolved modifier. The backend’s authenticated result still reports the original rolls, total, DC and success.

- Engine files: `package.json`, `README.md`, `src/vitality/index.js`, `tests/vitality.test.cjs`.
- Backend files: `src/modules/archipelago/system/rules2024/vitality.js`, `tests/phase2.commands.test.mjs`, `tests/support/phase3-concentration-probe.mjs`.
- Both applications: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.18.0.tgz`.
- Frontend checkpoint: `docs/character-system/phase3-pass23.md`.

Run `node crossworld_backend/tests/support/phase3-concentration-probe.mjs` from the workspace root. An optional output argument writes normalized JSON. The matrix varies source-shaped fixtures, active, expired, duplicate and absent references, multiple effects, Hunter’s Mark thresholds, absorbed and zero damage, DC boundaries, confirmed and generated rolls, invalid commands and stale revisions. Generated rolls are compared by range and outcome invariants. The transaction test verifies expired-check rollback, exact-instance survival, overlapping-check pruning, outsider rejection, replay, and digest and revision conflicts.

| Regression matrix | Matched | SHA-256 |
| --- | ---: | --- |
| Pass 23 concentration | 8,544 | `506000dcbaa7a56588724be57e53c50bb8d86186d624483c3c019c50f7c46710` |
| Pass 22 damage-triggered features | 2,410 | `fffabe75da72b679a1cd1680f715e9df2bbb43c1e8dd717db9cb05a5344881b6` |
| Pass 21 damage and temporary Health | 8,910 | `dd5831919a705cbb9e55a59c7b6bf5ef9577835e84e9394a2644c3d2c6fb94b9` |
| Pass 20 vitality | 3,960 | `6f1284e59b3c941510503478bd3d5e51cf9cbd5f57128e9fd2916360e28f9826` |
| Pass 19 rest | 2,640 | `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b` |

Engine 62 passed, 0 failed and 0 skipped. Backend 633 passed, 0 failed, 0 cancelled and 1 skipped. Frontend 113 passed, 0 failed and 0 skipped. Both lint checks, the frontend production build, and 185 backend syntax checks passed. The existing Vite bundle-size warning remains. Engine and backend Archipelago dependency checks found zero cycles. The frontend map cycle was outside scope. Isolated MongoDB was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. Handler fixtures cover application-level transaction behavior. Both applications resolve 0.18.0 and their archives and lockfile integrity values agree.

The retained probes preserve the prior zero-Health, temporary Health, Hunter’s Mark, Unbroken Current ordering and Relentless Rage contracts. Reaction budgeting and the relationship between stored and derived Rage DC were outside this pass.

## Pass 24

Audit the projected saving throw modifier pipeline, including Training, equipment, active Aura of Protection and Exhaustion. Characterize branded feature bonuses and their ordering before deciding whether the common arithmetic belongs in the engine. Keep active effect and equipment lookup in the backend. Review ID-less concentration fallback separately before any behavior change.

