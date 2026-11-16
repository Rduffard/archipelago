# Sanguine Archipelago — Phase 3, Pass 21

## Damage pipeline and ownership

The Pass 20 checkpoint and current code were inspected before production edits. The authenticated character handler validates the envelope, authorizes the actor, checks the digest and receipts, enforces the fresh document revision, and applies the command to a clone. Its guarded write and receipt insert share the transaction. No command fields, statuses, or revision and receipt sequencing changed.

1. The backend validates confirmed damage, an integer amount from 0 through 1,000,000, a supported damage type, and optional attack, critical, Unbroken Current, and Agility save flags. It rejects dead targets and ineligible Unbroken Current declarations before resolving damage.
2. The engine now applies Agility first. Evasion turns success into zero and failure into half. Without Evasion, success halves and failure retains damage. Each halving rounds down.
3. Immunity then sets the result to zero. Otherwise Resistance halves the already adjusted amount. This character-vitality path currently has no damage Vulnerability modifier.
4. Reef Skin subtracts Training Bonus after the above reductions and floors the result at zero. The backend resolves eligibility from physical attack type, active Rage, Reef Colossus level six, suppression, and equipped armor. Heavy armor blocks the reduction. Burden transfer and Overchannel bypass all mitigation as before.
5. The existing engine damage transition absorbs post-mitigation damage with the current temporary Health pool, reduces Health, then resolves massive damage or failures at zero. Massive damage uses damage remaining after absorption and prior Health. Critical damage at zero adds two failures. Positive, fully absorbed damage at zero still adds failures, including for a stable creature.
6. The backend resolves Unbroken Current before incapacitation and concentration. It restores one Health and spends the use only on an eligible nonfatal drop to zero. It then records pending Relentless Rage for eligible raging Reavers. Remaining incapacitation ends concentration and filters Rage effects under the original rules.
7. For eligible surviving concentrations, the engine supplies the DC from damage after mitigation and before absorption. It floors half damage and clamps the DC from 10 to 30. The backend selects active effects, excludes Hunter’s Mark for Navigator 13+, generates check IDs, and manages cleanup. A positively absorbed Blood Price pool produces loss evidence, and the command handler labels it with the operation ID and interrupts rest on positive damage.

## Temporary Health sources

| Path | Replacement and ownership |
| --- | --- |
| `temp-health.choose` | Explicit choice can lower or replace the pool. Zero clears amount and metadata. The backend validates source, confirmation, and optional future expiry against the world clock. |
| Direct runtime `temporary-health` | Tracks the larger numeric amount and explicitly clears the number at zero. It leaves metadata untouched. The engine owns the arithmetic and the runtime retains input validation. |
| Sourced grants | Unbroken Current, Blood Price and Vital Circuit self grants, Potent Spellcasting vitality, Reaver grants and Warden grants use the engine's strict greater-than replacement patch. Equal or smaller amounts preserve the existing pool and metadata. The backend owns eligibility, roll results, and source metadata. |
| Recipient grants | Feature results from abilities, feats, equipment and spells can carry a grant into the command handler. Recipient authorization, metadata fallback to the option ID, revision checks, saved Blood Price evidence and repeat-event journals remain backend responsibilities. Successful results use the same strict replacement patch. |
| Local ability grants | Tireless and an existing self-grant helper remain local. The helper compares the raw amount and clamps an accepted grant to zero, unlike the strict sourced patch. |
| Clearing and absorption | Long Rest and time expiry already use the engine clear patch. Absorption lowers only the balance, including when it reaches zero. It retains metadata for the backend to attribute the loss. Advancement copies the retained balance and source metadata. |

## Behavior and verification

Run `node crossworld_backend/tests/support/phase3-damage-probe.mjs` from the workspace root. Its optional first argument writes normalized observations as JSON. The probe records 8,910 before-and-after outcomes across five character contexts, three damage types, overlapping mitigation, armor and suppression, critical and massive hits, zero to full Health, three temporary Health balances, concentration, Unbroken Current, Relentless Rage and invalid command inputs. It captures results and runtime or command changes, including metadata, checks and errors. Generated IDs are normalized per observation so references remain distinct. Baseline and final SHA-256 match at `dd5831919a705cbb9e55a59c7b6bf5ef9577835e84e9394a2644c3d2c6fb94b9`.

The retained Pass 20 vitality probe matched all 3,960 observations. The retained Pass 19 rest probe matched all 2,640. The new receipt test covers preserving a chosen pool when a smaller Blood Price grant arrives, exactly-once damage, historical replay before revision checks, digest conflict, and stale rejection. Existing Conduit integration fixtures cover native and external grant receipts, authorization and rollback. Direct Hit Die healing from zero still preserves death saves, pending Rage and concentration bookkeeping. The damage probe and existing engine tests cover failure accrual at zero after complete absorption.

| Check | Result |
| --- | --- |
| Engine tests | 58 passed, 0 failed, 0 skipped |
| Backend tests | 629 passed, 0 failed, 0 cancelled, 1 skipped |
| Frontend tests | 113 passed, 0 failed, 0 skipped |
| Backend and frontend lint | Passed |
| Frontend production build | Passed with the existing Vite bundle-size warning |
| Backend syntax | 185 source files passed |
| Dependency cycles | Zero in the engine and backend Archipelago. The existing frontend map cycle was outside scope. |
| Isolated MongoDB | Skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. Transaction coverage uses the application handler fixture. |

The initial parallel test run timed out in the combat HTTP test. The isolated combat file passed all 14 tests. The full rerun passed with the new receipt test included.

## Files and API

- Engine: `package.json`, `README.md`, `src/vitality/index.js`, `tests/vitality.test.cjs`.
- Backend: `src/modules/archipelago/characters/commands.js`, plus `vitality.js`, `featureOperations.js`, `conduitOperations.js`, `damageRiders.js`, `reaverOperations.js`, and `wardenOperations.js` under `src/modules/archipelago/system/rules2024/`.
- Backend verification: `tests/phase2.conduit.test.mjs`, `tests/support/phase3-damage-probe.mjs`.
- Both consumers: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.16.0.tgz`. Both resolve 0.16.0. Archive hashes match each other and both lockfile integrity values match their archive.
- Frontend checkpoint: `docs/character-system/phase3-pass21.md`.

The existing `/vitality` export adds `mitigateDamage`, `concentrationDamageDC`, `grantTemporaryHealth`, and `trackTemporaryHealth`. The backend supplies resolved flags and preserves grant identity, target routing, timestamps, action validation, equipment projection and journals.

## Pass 22

Audit feature eligibility and timing around damage-triggered reactions and concentration. Characterize Unbroken Current, Relentless Rage and Hunter’s Mark source selection before separating mechanical eligibility from the host's effect and encounter lifecycle. Keep temporary Health metadata retained at zero, direct tracker zero clearing, and the two documented zero-Health behaviors visible for later gameplay review.

