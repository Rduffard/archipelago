# Sanguine Archipelago — Phase 3, Pass 19

## Rest and recovery ownership

The Pass 18 checkpoint and current source established the boundary. The engine already owned advancement and rebuild reconciliation for resource pools, Hit Dice, ordinary slots and preparations, earned Health and Hit Dice derivation, slot spending and conversion, and capped Sorcery Point recovery. Reconciliation preserves expended capacity when a build changes. Rest restores existing capacity under different rules.

| Rule | Owner after Pass 19 |
| --- | --- |
| Rest duration and frequency | The engine supplies the one-hour Short Rest, eight-hour Long Rest plus one hour per interruption, and 24-hour interval between Long Rest completions. Backend world-time checks and the frontend completion-time default share the engine duration. |
| Short Rest Hit Dice | The engine validates each available die and recorded roll, spends the dice in order, and heals by roll plus Resolve modifier, floored at zero and capped at maximum Health. The 20-entry limit remains. A die is still spent at full Health or with zero effective healing. The runtime maps rule errors to the original status and message. |
| Long Rest Health and Hit Dice | The backend runtime restores the engine-derived Hit Dice allocation. Health uses the existing vitality transition, including death-save and pending Relentless Rage bookkeeping. |
| Ordinary and created slots | The backend runtime refills ordinary slots to projected capacity and clears created slots on Long Rest. On Short Rest the engine resolves Shipwright Arcane Recovery, including the individual Calling-level budget, level-five cap, repeated levels, expended ordinary slots, and one use spent on success. |
| Spell preparation | The engine owns replacement limits. Shipwright Memorize Spell requires level five and allows at most one new spell on Short Rest. Long Rest disallows Tidecaller changes and caps Navigator and Warden at one new spell. Backend catalog projection validates count, distinctness, spell eligibility and folio access before the limit check. |
| Calling and Path pools | The engine refills pools from the projected maximums and Short Rest recovery definitions, including all-use refills and capped numeric refills. It preserves the Doctor Intervention exception while the post-rest cooldown is positive. The backend still decrements that cooldown before refilling. Signature Spells and Path pools use the same definitions they already had. Sorcerous Restoration still spends its own reserve and restores half Tidecaller level rounded down via the existing capped engine helper. |
| Other rest effects | Backend runtime owns selection projection and replacements (including Gray Net Short Rest, mastery and Spell Mastery), nourishment and Tireless exhaustion recovery, Relentless Rage and feat bookkeeping, concentration and timed effects, temporary Health, and journal cleanup. Attunement stays with equipment orchestration. There are no dedicated Stamina or Focus balances in this persistent rest path. |

## Authenticated command and frontend flow

| Command | Accepted fields and sequencing |
| --- | --- |
| `rest.start` | `restId`, `kind`, `startedAt`, optional `options`. The option allowlist is `hitDice`, `recoverSlots`, `restoreSorcery`, `preparations`, `selections`, `nourished`, `attunement`. The backend checks character eligibility, clock, and unused rest ID, previews recovery on a clone, then saves the choices without granting benefits. |
| `rest.complete` | `restId` and `completedAt`. Checks active rest, death, combat, duration, and Long Rest interval before applying saved choices. Records the epoch and history and clears the session. |
| `rest.interrupt` | `restId`, `at`, `reason`, `confirmed: true`, optional `resume` and `shortRestOptions`. Reasons are Initiative, non-cantrip spell, damage, and one hour of exertion. A completed hour in the current Long Rest segment can grant a Short Rest. Resume records the interruption and moves the segment start. Initiative, damage, and non-cantrip casting also call the same interruption handler. |
| `rest.cancel` | Matching `restId`. Records the ID and clears the session. |

The authenticated Archipelago router dispatches owner commands through the character command handler. The handler validates the envelope and canonical digest, resolves authorization, and checks for a matching receipt before fresh revision checks. A matching receipt returns its original response. A different digest for the same operation ID returns HTTP 409. Fresh requests pass through document-revision enforcement and apply to a clone. The owner and prior document revision guard the update, and the receipt is inserted in the same transaction. Invalid lifecycle and request fields generally return 422, while runtime rest options retain their existing 400 errors and messages. Rest start and interruption use distinct nested option paths, including the existing null handling. This pass preserved those input contracts.

`PersistentResources.jsx` displays saved balances and supplies Hit Dice, Arcane Recovery, Sorcerous Restoration, and basic rests. `PreparationChoices.jsx` and `RestSelections.jsx` supply spell and feature selections. `PersistentSheet.jsx` opens the planner with those options, and `RestPlanner.jsx` sends world time and rest commands. `MagicItemControls.jsx` starts an attunement Short Rest. The planner's default end-time calculation now uses the shared duration.

## Files and public API

- Engine: `package.json`, `src/hit-dice/index.js`, `src/preparations/index.js`, `src/resources/index.js`, `src/spell-slots/index.js`, `src/rest/index.js`, and `tests/rest.test.cjs`.
- Backend: `src/modules/archipelago/system/rules2024/runtime.js`, `src/modules/archipelago/system/rules2024/resting.js`, and `tests/phase2.commands.test.mjs`.
- Frontend: `src/pages/Rules2024/RestPlanner.jsx` and `docs/character-system/phase3-pass19.md`.
- Both consumers: `package.json`, `package-lock.json`, and `vendor/crossworld-sanguine-engine-0.14.0.tgz`. The two archives are byte-identical and match both lockfile integrity values.

The shared package advances from 0.13.0 to 0.14.0. Public additions are `recoverHealthWithHitDice` and `HitDiceRecoveryError` under `/hit-dice`, `restPreparationError` under `/preparations`, `recoverRestPools` under `/resources`, `recoverArcaneSlots` and `ArcaneRecoveryError` under `/spell-slots`, and `restDuration` and `longRestRecoveryInterval` under the new `/rest` export.

## Verification

- A pre-edit probe captured 2,640 observations across direct runtime and authenticated command-dispatch paths. It varied ten Calling/level/Path fixtures, three pool states, both rest kinds and 22 option sets. Full observed runtime states, results, and error classes/statuses/messages matched after extraction. SHA-256 for both runs was `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b`.
- A new handler transaction test covers preview without spending, exactly-once completion, atomic rejection, unauthorized replay, historical start and completion replay, conflicting digests, and stale revision. Existing suites retain recovery, slot expenditure and conversion, advancement, rebuild, Path and rest timing regression coverage.
- Engine: 52 passed, 0 failed, 0 skipped. Backend: 627 passed, 0 failed, 1 skipped. Frontend: 113 passed, 0 failed, 0 skipped.
- Backend and frontend lint, frontend production build, and 185 backend source syntax checks passed. Vite reported the existing bundle-size warning.
- Engine and backend Archipelago dependency checks found zero cycles, including deferred imports. The existing frontend map cycle was outside the scope of this pass.
- The isolated MongoDB test was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. The handler transaction fixture provides application-level evidence. Database-backed transaction behavior remains unverified in this run.

## Pass 20

The next coherent extraction is the deterministic vitality recovery transition. Audit ordinary healing and Long Rest together, including exhaustion from nourishment and Tireless, death saves, pending Relentless Rage, temporary Health, and concentration expiry. Separate pure state transitions from the backend's clock, effects and encounter journals. Compare recovery paths before moving them so direct Hit Die healing keeps its existing bookkeeping behavior. Also characterize nested interruption options as a distinct HTTP contract review if input hardening is in scope.
