# Sanguine Archipelago — Phase 3, Pass 22

## Damage-triggered feature timing

The Pass 21 checkpoint and current implementation established the order. The authenticated command handler validates and authorizes the request, returns matching historical receipts before fresh revision checks, and applies a fresh request to a clone. Its guarded update and receipt write share the transaction. Damage validates the declaration and target first, applies Agility and Evasion, immunity or Resistance, and Reef Skin, then absorbs temporary Health and resolves Health loss and death saves. Unbroken Current runs after that transition and before Relentless Rage. The backend then performs incapacitation cleanup or creates an eligible concentration check. The handler records any Blood Price loss and interrupts rest on positive damage.

| Feature | Engine rule | Backend orchestration |
| --- | --- | --- |
| Unbroken Current | A declaration requires Sanguine Conduit at Tidecaller 18+. A declared, nonfatal drop from above zero to zero requires a usable Reaction and positive reserve. Success restores one Health, consumes one use and offers Tidecaller level in temporary Health. Already-zero, non-triggering and fatal damage do not consume the use. Eligibility is independent of damage type. | Rejects invalid declarations before mitigation. Determines pre-hit incapacitation and saves the resulting Health, fresh death saves, reserve and sourced temporary Health. The existing Reaction check is based on pre-hit incapacitation. It does not consult a separate Reaction budget. The normal strict temporary Health replacement still applies. Recovery occurs before concentration cleanup, so surviving effects can require a damage check. |
| Relentless Rage pending | Active projected Rage and Reaver 11+ qualify on a nonfatal drop from positive Health to zero. The initial DC is 10 plus five per recorded attempt. Temporary Health can prevent the drop, and Unbroken Current can prevent a pending save by restoring Health first. | Projects Rage via active effects and writes the pending record. Damage at zero and massive death do not create a new pending record. Pending Rage preserves its effect during damage cleanup and blocks death saves and turn progression. |
| Relentless Rage resolution | Requires a pending save, zero Health, a living Reaver at the threshold and an active Rage effect. Every valid resolution counts an attempt. A total meeting the DC restores up to twice Reaver level. Failure leaves Health at zero. | Direct runtime accepts a validated recorded total. The authenticated command accepts a confirmed total or rolls a server d20 and adds projected Resolve save modifier. It retains the saved DC for the response and uses the count-derived DC for the transition, as before. Keeps Rage on success, ends it on failure, clears pending status, and owns expiration. Ordinary healing at positive resulting Health clears pending Rage. Short Rest resets attempts. Long Rest also resets counters. |
| Hunter’s Mark | Navigator 13+ excludes only Hunter’s Mark from a damage-triggered concentration check. | Resolves spell identity from the exact `spell:hunter-s-mark` feature ID. Casting stores `spell:<spell id>` separately from cast ID and source metadata. Checks collect all active eligible effects by ID with feature-ID fallback. Damage must be positive after mitigation and the target must remain able to concentrate. A shared check can include other concurrent effects. The backend generates IDs and rolls, applies Resolve, removes the resolved check, and ends listed effects on failure. Incapacitation still ends Hunter’s Mark with other concentration. |

Direct damage callers run the same vitality sequence with their own supplied summary. Burden and Overchannel still bypass mitigation and do not declare Unbroken Current. Authenticated commands add document revision enforcement, operation IDs, receipts and rest interruption orchestration. Direct runtime updates still enforce their own runtime revision.

## Verification

Run `node crossworld_backend/tests/support/phase3-damage-features-probe.mjs` from the workspace root. An optional argument writes the normalized results as JSON. Ten Calling, Path and level fixtures cross unlocked, locked and wrong-Path declarations, full to zero Health, absorption, fatal and nonfatal hits, exhausted uses, expired and active effects, confirmed resolution totals and malformed requests, direct Rage runtime calls and stale revisions. Complete JSON outcomes preserve generated ID relationships.

| Matrix | Observations matched | SHA-256 |
| --- | ---: | --- |
| Pass 22 damage-triggered features | 2,410 | `fffabe75da72b679a1cd1680f715e9df2bbb43c1e8dd717db9cb05a5344881b6` |
| Pass 21 damage and temporary Health | 8,910 | `dd5831919a705cbb9e55a59c7b6bf5ef9577835e84e9394a2644c3d2c6fb94b9` |
| Pass 20 vitality | 3,960 | `6f1284e59b3c941510503478bd3d5e51cf9cbd5f57128e9fd2916360e28f9826` |
| Pass 19 rest | 2,640 | `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b` |

Targeted tests cover generated Rage rolls, mixed Hunter’s Mark checks and incapacitation cleanup, and Unbroken Current receipt replay, outsider rejection, digest conflict, and atomic rejection when the use is exhausted. Existing Pass 19–21 coverage preserves Hit Die healing from zero with bookkeeping intact, positive absorbed damage at zero counting failures, metadata retention at zero, lower explicit temporary Health choices and strictly larger sourced grants.

| Check | Result |
| --- | --- |
| Engine | 61 passed, 0 failed, 0 skipped |
| Backend | 632 passed, 0 failed, 0 cancelled, 1 skipped |
| Frontend | 113 passed, 0 failed, 0 skipped |
| Lint and frontend production build | Passed. Existing Vite bundle-size warning remains. |
| Backend syntax | 185 files passed |
| Engine and backend Archipelago dependency cycles | Zero. Existing frontend map cycle was outside scope. |
| Isolated MongoDB | Skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. Handler fixtures exercise application-level transactions and receipts. |

The initial concurrent suite hit a combat HTTP timeout. The full rerun passed with all three new backend tests included.

## Files and public API

- Engine: `package.json`, `README.md`, `src/vitality/index.js`, `tests/vitality.test.cjs`.
- Backend: `src/modules/archipelago/system/rules2024/vitality.js`, `src/modules/archipelago/system/rules2024/featureOperations.js`, `tests/phase2.commands.test.mjs`, `tests/phase2.vitality.test.mjs`, and `tests/support/phase3-damage-features-probe.mjs`.
- Both consumers: `package.json`, `package-lock.json` and `vendor/crossworld-sanguine-engine-0.17.0.tgz`. Installed version 0.17.0, byte-identical archives and matching lockfile integrity were verified.
- Frontend checkpoint: `docs/character-system/phase3-pass22.md`.

The existing `/vitality` export adds `unbrokenCurrentUnlocked`, `evaluateUnbrokenCurrent`, `pendingRelentlessRage`, `canResolveRelentlessRage`, `resolveRelentlessRage` and `isDamageConcentrationExempt`. These take resolved mechanical facts and do not read clocks, generate rolls or mutate effect collections.

## Pass 23

Audit concentration save arithmetic and effect references across spells, scrolls, charged items and readiness effects. The save still combines the supplied rolls, advantage and Resolve in the backend. Characterize overlapping checks, expired sources and ID fallback before extracting a pure save outcome. Keep check generation, timestamps, effect mutations and encounter journals in the backend. Review Reaction budget and saved versus derived Rage DC separately if either requires a gameplay decision.

