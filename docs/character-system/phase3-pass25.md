# Sanguine Archipelago — Phase 3, Pass 25

## Canonical contract

Every active effect in a validated character runtime has a nonblank string instance ID unique within that runtime. Cast UUIDs remain the instance IDs of spell effects. Mechanical feature IDs can repeat, and source metadata remains independent. The backend owns identity generation and lifecycle. The engine stays at 0.19.0.

## Creator and consumer inventory

| Path | Identity, source and lifecycle |
| --- | --- |
| Ordinary spells, scrolls and charged items | Each cast generates a UUID and uses it as the active effect ID and cast reference. Feature identity is the spell key. Source remains the Calling or cast source, scroll instance or item instance. Concentration replacement clears prior concentration and associated checks, and printed duration still determines expiration. |
| Contingency | The prepared wrapper and the triggered cast retain separate IDs. Triggering uses a new cast UUID and the stored spell, source, targets and duration. |
| Calling and Path activation | The activation handler seeds each effect with a UUID before applying feature-specific fields. Rage, Silence and other persistent effects retain their flags, timestamps, targets and feature-specific replacement policies. Smite of Protection retains its cast-derived suffix to distinguish it from the cast effect. |
| Attack, strikes, feats and Gray Net | Reckless Attack, Studied Attacks, strike riders, Merge with Shadows and defensive tactics already generate UUIDs. Their turn and action expiration and replacement policies are preserved. |
| Equipment and recipient grants | Utilization and deployment generate effect IDs and retain item association and expiry. Healing and save-advantage grants copy the identified effect to the recipient. IDs are checked per character runtime. Conditions and temporary Health remain separate state and do not acquire effect instance IDs. |
| Direct runtime feature records | The remaining ID-less creator now uses the same Node UUID generator as other backend creators. Notes, costs and feature fields stay intact. Explicit feature-wide direct runtime removal is named `end-feature-effects`. |

The authenticated `effect.end` command accepts only `effectId`, resolves exactly one owned effect, and retains printed-duration protection. Explicit feature-wide gameplay cleanup still occurs for replacements and mechanics that intentionally operate on a group. Concentration creation, pruning and failed-save cleanup use exact effect IDs. Expiry still evaluates record timestamps and turn flags. Rebuild consequences list actual ended instance IDs. Rage, incapacitation, rest and concentration replacement retain their existing bulk cleanup rules. Relay, object, spell healing and Contingency operations keep their existing instance selectors. The sheet keys records by ID and sends only exact IDs for manual removal.

## Data and legacy observations

The Mongoose schema stores runtime as Mixed and delegates validation to the rules runtime. Fresh authenticated commands check the pre-expiry effect list, so expired invalid records cannot disappear before identity validation. Saved runtime validation checks again before persistence. Repository fixtures that represented valid effects were updated with exact IDs. A read-only inspection of the configured Archipelago character collection found one document and zero missing or duplicate instance IDs. No database records were changed.

Run `node crossworld_backend/tests/support/phase3-effect-identity-probe.mjs`. The optional argument writes complete outcomes. The 56-row legacy baseline is preserved in `crossworld_backend/tests/fixtures/phase3-effect-identity-legacy.json`.

| Observations | Result |
| --- | --- |
| Legacy SHA-256 | `3775e4f6bf67cdabe35f97597297da8480d31d37408334cdba51ecfa3133bf23` |
| Canonical SHA-256 | `bd033514241f33a79cb49defdcff723291ede73e5817434377961385a2720810` |
| 30 unchanged | Exact selection, missing or expired checks, replacement isolation and stale revision precedence remain as before where applicable. |
| 18 identity validation changes | Fresh requests against missing or duplicate instance IDs now return 400. |
| 8 selector changes | Fresh feature-ID manual removal now returns 422. |

Historical receipts still return the stored response after authorization and before fresh revision or runtime validation, including ID-less response data. Tests verify outsider rejection, digest conflicts, stale revisions, atomic rollback, unique creation, duplicate feature IDs, and explicit feature-wide cleanup. Spell, scroll, charged-item, Contingency, Calling/Path, expiration, replacement and incapacitation coverage runs through the existing suites.

## Verification

| Retained probe | Rows | Compared outcome |
| --- | ---: | --- |
| Pass 24 saves | 4,275 | 140 rows differ only by fixture IDs. |
| Pass 23 concentration | 8,544 | 272 rows differ only by fixture IDs and exact concentration references. |
| Pass 22 features | 2,410 | 80 rows differ only by fixture IDs. |
| Pass 21 damage | 8,910 | 3,234 rows differ only by fixture IDs. |
| Pass 20 vitality | 3,960 | Matches after fixture ID and generated inventory ID normalization. |
| Pass 19 rest | 2,640 | Exact retained hash match. |

Final test results are 64 engine passed, 636 backend passed, and 113 frontend passed, with zero failures and one backend skip. Both lint checks, 185 backend syntax checks and the frontend build passed. Vite’s existing bundle-size warning remains. Engine and backend Archipelago cycle analysis found zero cycles. The existing frontend map cycle was outside scope. The isolated MongoDB transaction test was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset.

## Files changed

- Backend character commands and rebuild: `src/modules/archipelago/characters/commands.js` and `rebuild.js`.
- Backend rules: `src/modules/archipelago/system/rules2024/clock.js`, `featureOperations.js`, `runtime.js`, `runtimeValidation.js` and `vitality.js`.
- Backend tests: `tests/phase2.commands.test.mjs`, `phase2.final-defects.test.mjs`, `phase2.metamagic.test.mjs`, `phase2.path-management.test.mjs`, `phase2.vitality.test.mjs`, `tests/fixtures/phase3-effect-identity-legacy.json`, and six scripts under `tests/support/` named `phase3-effect-identity-probe.mjs`, `phase3-saving-throws-probe.mjs`, `phase3-concentration-probe.mjs`, `phase3-damage-features-probe.mjs`, `phase3-damage-probe.mjs` and `phase3-vitality-probe.mjs`.
- Frontend: `src/pages/Rules2024/AbilityActions.jsx`, `tests/phase2.test.mjs` and this checkpoint.

## Pass 26

Audit the remaining generic direct-runtime feature activation route. It now creates canonical instances but still represents some abilities as generic cost-and-note records. Determine which direct callers need an executable rule, which can call typed operations, and which obsolete runtime entry points can be removed. Keep exact IDs and immutable receipt replay intact.

