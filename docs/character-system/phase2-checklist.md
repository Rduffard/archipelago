# Phase 2 execution checklist

Status: **IN PROGRESS — not accepted for tabletop testing**.

**MongoDB integration validation: PASSED.** Run `67aeab9f0f2d458491a2ddfad87eb68f` completed 538 tests with zero failures and zero skips. The transcript confirms cleanup of the container and both volumes. This result supersedes the database-related pending and blocked notes in earlier checkpoints.

All fourteen Phase 1 documents and the original phase-one prompt are the contract. Work is directly in the two actual repositories. A verified pre-edit snapshot (including untracked source, deletions, both Git diffs and HEADs) is stored in `Crossworld Creative/character-phase2-recovery-20261107/`. No database deletion, commit, push or deployment is authorized.

- [x] Both repository roots, dirty status, read/write/remove probes and applicable instruction discovery.
- [x] Load all fourteen complete design documents and original scope; inspect existing engine, persistence, equipment and UI.
- [x] Snapshot pre-existing work and verify copied hashes.
- [ ] README: one SA-CHAR-1 authority; single Calling, no competing progression engines.
- [ ] Callings: all eight traits, choices, upgrades and level 1–20 behavior.
- [x] Paths: canonical 32 roster, four each, every origin, level-three selection and all later grants.
- [ ] Abilities: all 246 complete rules, distinct clauses, persistent costs/effects/target restrictions and frontend controls.
- [ ] Creation: ten-step creator, strict point buy, source bonuses, complete choices, review and save.
- [ ] Origins/backgrounds: 18 fixed bonuses, seven background choices, custom choices, languages and packages.
- [ ] Training: skills/saves/Expertise/tools and reactive derived statistics.
- [ ] Feats: full closed catalog, prerequisites/subchoices, repeated sources and every permitted replacement.
- [ ] Equipment: packs/gold, firearm pack, gear tables, charges/ammunition, loadouts/presets, purchase and instance operations.
- [ ] Spells: 316 references, list membership, folio/preparation/replacement/materials, free sources and all ten Metamagic options.
- [ ] Resources: every canonical pool, spent preservation, rests/time, temporary effects/concentration, conversions/cooldowns.
- [ ] Architecture: command envelope/idempotency, ownership/revisions, atomic persistence, replay/reload and typed effect handlers.
- [ ] Frontend: creator, advancement, complete sheet/ability/spell/inventory/choice workflows using preserved visual language.
- [ ] Migration: remove only superseded active systems after replacements work; preserve unrelated applications/data.
- [x] Acceptance: independent all-origin/Calling/Path level matrices and representative invalid-operation, ownership and concurrency tests. Per-clause behavior is tracked separately.
- [x] Run backend/frontend tests and lint, frontend production build; repair caused failures.
- [x] Representative martial/caster/complex-Path level-one-to-twenty workflows and real MongoDB persistence gates, including campaign permissions and fresh-process reload.
- [ ] Visual checks at 320/768/1440 pixels in both themes and unrelated-function regression checks.

Update this checklist with concrete results. Registry counts or readable descriptions alone do not complete feature-operation acceptance.


## Resume verification — 2026-11-07

Implementation remains **partial**. See `phase2-checkpoint.md` for the per-document status, precise changed behavior, outstanding requirements and next executable steps.

- [x] Inspect both existing dirty working trees without resetting/restoring files.
- [x] Preserve all fourteen normative Phase 1 document hashes and all initial deleted states (95 frontend, 37 backend).
- [x] Eight Callings / 32 Paths: test creation and every level through 20 for grants; this is progression coverage, not full ability-operation acceptance.
- [x] Added focused behavior tests for relay objects/casting/destruction, replacements, target validation, inventory/ammunition, Ghost/Breakwater management, priced materials and preparation exclusions.
- [x] Final backend suite: **207 passed, 0 failed, 1 skipped** (208 tests). Skipped test is the explicitly gated real-Mongo integration test.
- [x] Final frontend suite: **71 passed, 0 failed**. Includes server rendering of new controls; does not claim browser interactions.
- [x] Full backend ESLint: passed. Full frontend ESLint: passed, excluding generated dependency bundles in .test-cache.
- [x] Production frontend build: passed, 113 modules; JS 392.96 kB (119.71 kB gzip), CSS 22.79 kB (5.03 kB gzip).
- [x] No commit, push, deployment or MongoDB write/reset/deletion in this resumed session.
- [ ] Finish all 246 typed ability clauses, conditional interactions and per-clause behavioral tests.
- [ ] Finish remaining spell/Metamagic, feat, equipment/catalog, campaign authorization, creation-idempotency, rest/time/status and audit requirements.
- [ ] Run authorized current real-Mongo persistence/cross-character/concurrency tests.
- [ ] Verify current complete browser flow, responsive themes, keyboard behavior and unrelated-site regressions.
- [ ] Pass replacement acceptance, then perform final obsolete engine/route/compatibility cleanup.

**Full character flow verified: no. Phase 1 behavioral acceptance met: no. Ready for GM-adjudicated tabletop testing: no.**

## Latest connection-recovery verification — 2026-11-07

- [x] Continued the existing implementation after checking both dirty working trees and the checkpoint.
- [x] Added typed Cinder charge/Battery validation, costs, scaling, overlap, exemptions, Safe Handling, object and smoke records plus sheet controls.
- [x] Added Tactical Mind refund/check tracking, Action Surge once-per-turn/non-Magic validation and Tactical Shift results with armor Speed penalties.
- [x] Added saved-action tables and check outcomes using the existing visual styles.
- [x] Backend: **223 passed, 0 failed, 1 skipped** (224 tests). Real-Mongo test remains skipped under the current restriction.
- [x] Frontend: **74 passed, 0 failed**.
- [x] Full backend/frontend ESLint passed. Frontend production build passed (115 modules; JS 400.10 kB / 121.29 kB gzip).
- [x] Both tracked working-tree whitespace checks passed.
- [x] No MongoDB writes, commits, pushes or deployments.

Phase 2 remains incomplete. Current end-to-end browser/database acceptance has not been established. See the connection-recovery section of `phase2-checkpoint.md` for exact additions and the remaining backlog.

## Envoy/creation/identity/audit verification - 2026-11-07 (America/Chicago)

- [x] Explicit four Envoy operations, target/cost/event validation, dedicated controls and five new behavior tests.
- [x] Owner-scoped keyed creation retry/conflict/concurrency behavior with five model-double tests; actual Mongo unique-index behavior remains gated.
- [x] Full narrative fields, shared validation and receipted identity edits; three new behavioral tests.
- [x] Owner-only cursor-paginated command history, bounded result projection, index and sheet UI; three new audit tests.
- [x] Full backend: **342 passed, 0 failed, 1 skipped**. Final focused rerun: **25 passed, 0 failed**.
- [x] Full frontend after final UI fixes: **87 passed, 0 failed**.
- [x] Both full ESLint checks, frontend production build and tracked whitespace checks passed.
- [x] Final build: 124 modules; JS 446.91 kB (132.65 kB gzip), CSS 22.85 kB (5.05 kB gzip). All fourteen normative design documents still match the recovery hashes.
- [x] Actual in-memory browser: Envoy save/expenditure, narrative save, history refresh and reload persistence; 320/768/1440 width checks on this sheet. No full-flow or all-theme claim.
- [x] Fixed repeated-ASI keys, tool-check attribute IDs and narrow character-page overflow.
- [x] No MongoDB writes, commits, pushes or deployments.
- [ ] Remaining full-feature parity, campaign GM/milestone permissions, inventory/folio/copper completion, all-browser acceptance, actual Mongo transaction/restart gates and final legacy cleanup.

**Phase 2 remains incomplete and not accepted for tabletop testing.** See the latest checkpoint section for exact scope and limitations.

## Conduit/Covenant verification - 2026-11-07 (America/Chicago)

- [x] Sanguine Conduit: typed Health costs, chosen Shelter, single-casting Surge, Sorcery recovery, source-verified Vital Circuit and damage-bound Unbroken Current. Seventeen new backend tests.
- [x] Iron Covenant: held-Shield binding/release, derived Bulwark Guard, Sentinel, conscious Aura of Resolve, timed Standard Resistance and ally-turn grants. Ten new behavior tests and one native-recipient transaction test.
- [x] Full backend: **370 passed, 0 failed, 1 skipped** (371 total); the skip remains real Mongo.
- [x] Full frontend: **89 passed, 0 failed**; both full ESLint checks and production build passed.
- [x] Build: 126 modules; JS 455.31 kB (134.77 kB gzip), CSS 22.85 kB (5.05 kB gzip). Tracked whitespace checks passed.
- [x] Focused actual memory-only browser: Conduit costs/rolls, Unbroken Current and reload, Shield Guard/release, Standard ally grant, narrow Covenant layout. No MongoDB writes.
- [ ] Exhaustive remaining feature clauses, campaign GM authority, inventory/folio/copper, all-flow/all-theme browser acceptance, real Mongo transactions/restart and final legacy cleanup.

Full Phase 2 acceptance remains unmet. Exact tabletop boundaries and next work are in the latest phase2-checkpoint.md section.

## Latest rate-limit recovery verification - 2026-11-07 (America/Chicago)

- [x] Free Port and Lantern Vigil active handlers and conditional aura projections; source-specific condition removal.
- [x] Server campaign GM/milestone roles, GM review, owner-only commit, actor/role receipts, authorized item/coin awards, discoveries and sales. Actual campaign integration remains unverified.
- [x] Integer goldCp storage across creation, purchases, awards/sales, transcription and components; GP-only test records require recreation. No database migration was run.
- [x] Paid/elapsed-time approved-source copying; folio loss, prepared-memory preservation, partial reconstruction and missing-ritual restrictions; receipt retry coverage.
- [x] Structured character validation/conflict errors and client transport; unrelated errors retain prior behavior.
- [x] Thunderhide, Chainbreaker and Reef Colossus typed active operations, conditional size/carrying/Resistance and Reef Skin suppression. Ten new focused tests pass.
- [x] Full backend **406 passed, 0 failed, 1 skipped**; full frontend **93 passed, 0 failed**; both full lint and production build passed.
- [x] Build: 130 modules; JS 473.52 kB / 138.54 kB gzip, CSS 22.85 kB / 5.05 kB gzip; tracked whitespace checks passed.
- [x] Focused memory-only browser: GM discovery/award, exact-price copy, lost folio and prepared memories after reload. No browser reconstruction/real-Mongo claim.
- [ ] Finish six remaining original Path action groups plus all passive/base clauses, rebuild consent/commit, attunement/scrolls/utilization, all-flow/theme/keyboard/regression acceptance, real Mongo tests and final legacy cleanup.

Phase 2 remains incomplete. All readiness flags remain false.

## Recovery verification - 2026-11-08 UTC

- [x] Recovered full backend 499 passed / 0 failed / 1 gated skip; frontend 101 passed.
- [x] Actual memory-only blank creator, paid starting purchase, save/reload; representative both-theme 320/768/1440 sheet width checks.
- [x] Two-tab revision conflict preserves unsaved identity through refresh/retry/reload.
- [x] Attack-record behavior (4), caster Paths (10), rebuild/purchases (11) focused verification after recovered full runs.
- [ ] Remaining per-clause, full-flow, campaign, database and cleanup acceptance described in latest checkpoint. Phase 2 remains incomplete.


## Approved-rule and route cleanup verification - 2026-11-08

- [x] User approved Captain's Credit off turn, once per round; live rule, controls, event/round limits and decision record updated.
- [x] Browser verified own-turn rejection, off-turn grant, same-round rejection, reload and exactly one accepted receipt.
- [x] Manual resources now use receipted commands; canonical advancement preview and cancellation verified in browser.
- [x] Removed obsolete persistent mutation aliases/direct PATCH and rules-preview persistent-save branch.
- [x] Preserved all 95/37 initial deleted states and 31 unrelated recovered frontend source hashes.
- [ ] Final suites after cleanup are running; actual isolated-Mongo acceptance still requires authorization. Phase 2 remains in progress.


## Final local verification after cleanup - 2026-11-08

- [x] Backend 530 passed / 0 failed / 1 gated real-Mongo skip (531 total), full lint and whitespace checks passed.
- [x] Frontend 102 passed / 0 failed, full lint, production build and whitespace checks passed.
- [x] Migrated old direct-handler fixtures to receipted persistence; all 32 Paths' saved level-one-to-twenty matrix passes.
- [x] 14 normative baseline hashes, 31 unrelated frontend and 19 unrelated backend source hashes, and initial 95/37 deletions preserved.
- [ ] Explicit authorization for isolated real-Mongo writes, real database/process/campaign acceptance and final independent review remain required. tabletopReady is false.


## Authorized database testing - 2026-11-08

- [x] Explicit user authorization received for isolated Docker/Mongo testing and scoped cleanup. Do not request again.
- [x] Prepared reproducible full-suite runner with unique labeled resources, loopback binding and guarded cleanup; syntax checked.
- [ ] Docker Desktop must be opened by the user: restricted launch cannot write Docker logs; engine pipe absent; Windows app-control helper unavailable.
- [ ] Execute actual database suite and continue remaining Phase 2 acceptance/implementation. No database tests passed yet.

## Continued clause review - 2026-11-08

- [x] Docker authorization already received; Desktop opened but execution-session engine pipe access denied. Further troubleshooting deferred; no database resources created or application data touched.
- [x] Connected Safe Handling, Reinforced Anchorage and Ghost Patch's selected-trade once-per-turn bonus to saved tool checks, including reload and no paid-resource spend.
- [x] Eight focused backend tool-check tests pass; whole frontend suite 105 passed, zero failed.
- [x] Corrected sheet-roll Exhaustion/Poisoned and Restrained save circumstances; explicit inspection/detect-false task selectors scope Path Advantage to checks.
- [x] Prepared fresh-process HTTP reload and disposable campaign authorization coverage in the gated real-Mongo suite.
- [ ] Execute real-Mongo/restart/campaign checks when an authorized usable test environment is available. Prepared coverage is not a passing result.
- [ ] Finish independent clause/source acceptance; Phase 2 remains incomplete and tabletopReady false.

### Latest verified results

- [x] Storm Broker weather/signals task Advantage respects discipline and attribute; nine focused tool tests pass.
- [x] Might finesse hits accepted for Thunderhide/Chainbreaker; ranged misuse rejected atomically.
- [x] Petrified preserves other immunities and suspends an existing poison source; 23 focused vitality/caster tests pass.
- [x] Final whole backend 535 passed / zero failed / one real-Mongo skip. Last Barometer tool test is additional focused coverage after that run began.
- [x] Final whole frontend 106 passed / zero failed; both lint checks, whitespace checks and production build pass. Existing bundle warning remains.
- [x] All fourteen normative document hashes preserved; no database changes, commits, pushes or deployments.
- [ ] Remaining conditional passive clauses need independent review. The Silent Keel lifecycle and real-Mongo checks are recorded below.

## Final acceptance audit - 2026-11-09

- [x] Real MongoDB HTTP integration, rollback, campaign permissions and fresh-process reload. All 538 tests passed and the dedicated resources were removed.
- [x] Character origin/Calling matrix and saved level 1–20 progression for all 32 Paths. This establishes progression coverage.
- [x] Silent Keel records each creature's departure, grants the caster Stealth Advantage while covered, and ends the caster's share on a recorded attack or spell. Browser verified keyboard activation, one-target removal, caster termination and reload with another ally still covered.
- [x] Drydock Ghost verifies carried tools and caps Ghost Patch at the GM-recorded missing Health. Silent Keel enforces the vehicle length limit. Field Surgeon Trauma and Toxicology apply their separate recipient effects.
- [x] Map navigation and sign-out to the login screen work in the local browser fixture. All 14 normative documents and 56 selected unrelated files match their recovery hashes.
- [x] Triage and Toxicology require GM-confirmed sight and touch within 5 feet. Paid in Scrap records at least ten completed minutes. Invalid requests preserve the character and costs.
- [x] Treatment spends charges from an eligible catalog kit. Triage and Ghost Patch display the same level-scaled dice the server rolls, and ability cards display provenance.
- [x] Latest local verification passed with 541 backend tests, one environment-gated MongoDB skip, and 109 frontend tests. Both lint checks and the Archipelago production build passed. The separate real MongoDB gate remains passed.
- [ ] Finish the per-clause behavior matrix for all 246 features. Review passive, resource, unlock and rest combinations independently.
- [ ] Finish ability-card previews for computed dice and DCs and conditional unavailable reasons across specialized controls. Complete keyboard, live-error and responsive review for the remaining flows.
- [ ] Complete live sign-in and regression checks for campaign/session relationships, reputation, lore/assets and sibling applications. Campaign create/open pages were placeholders before Phase 2 and still are. Campaign authority passed at the API and database boundary. A browser campaign/session workflow cannot be signed off through those pages.
- [ ] Sibling frontend builds stopped at Vite config loading with `spawn EPERM` in this session. Runtime regression coverage remains open.

## Ability and roster acceptance continuation - 2026-11-09

- [x] All 144 origin/Calling fixtures verify starting Health and saving-throw Training. Every origin sees all four owned Path choices at level three.
- [x] Core actions and reviewed Artillerist, Sparkwrite, Reaver and Navigator actions use the same computed dice and save DCs for previews and resolution. The reviewed controls display relevant tool, hand, live object, Rage and Hunter's Mark restrictions.
- [x] Browser verified keyboard relay placement and Discharge, including allied and enemy targets, half damage on a successful save, relay removal and remaining uses after reload. The Sparkwrite sheet fit 320, 768 and 1440 pixels in both themes.
- [x] Ability-triggered Hide applies Stealth roll circumstances and saves the Hide condition. Fast Hands includes applicable tool Training without adding Training twice. Focused Reaver, Navigator and Corsair tests passed.
- [x] All 55 documented paid feature bindings map to execution. Fifty-four are in registered ability options. Unbroken Current is bound to its damage reaction.
- [x] Final local verification passed with 542 backend tests, one environment-gated MongoDB skip, and 109 frontend tests. Both lint checks, tracked whitespace checks, and the Archipelago production build passed. The real MongoDB gate remains passed.
- [x] All 14 normative document hashes and 56 unrelated source hashes matched the recovery snapshot. The original deletion lists of 95 frontend and 37 backend files matched exactly.
- [ ] Remaining review includes the complete per-clause behavior matrix, previews for further specialized actions such as Suppressing Fire with Hold the Corridor active, and the live browser regression workflows above.


## Final verification after Warden corrections

| Acceptance area | Status | Evidence or remaining work |
| --- | --- | --- |
| Calling and Path progression | Verified | All eight Callings and all 32 Paths have level 1–20 progression coverage. All 144 origin/Calling fixtures were checked. |
| Character lifecycle | Verified in browser fixture | All eight Callings were created from blank and reloaded. Five advanced from the blank creator to level 20, and Gunslinger, Tidecaller, and Shipwright advanced from level-one fixtures to level 20 in separate browser runs. |
| Campaign registration and advancement | Verified for the tested workflows | Campaign create/open, character registration, blocked advancement before GM approval, and approved advancement after reload passed in the browser fixture. The isolated run passed the campaign registration rollback check and real MongoDB HTTP workflow. |
| Local suites, lint, and build | Verified | Recovered backend result 545 passed, 0 failed, one environment-gated MongoDB skip. Both corrected Warden cases passed. Frontend 109 passed, 0 failed, 0 skipped. Both lint checks and the Archipelago production build passed in the prior Windows session. |
| Isolated MongoDB | Integration passed | Earlier complete run passed 538/538. The later run passed the MongoDB HTTP test and campaign rollback check, with 544 passes and two Warden failures across the complete suite. Those two cases passed on the corrected tree in the local rerun. A single clean isolated run on the corrected tree has yet to be recorded. |
| Per-clause rules and sheet controls | Open | All 55 paid feature bindings have execution coverage. The independent per-clause review and remaining specialized previews, availability reasons, and interaction checks are open. |
| Live sign-in and cross-app regression | Open | Live sign-in, remaining campaign/session and sibling-app workflows still require verification. Sibling Vite builds previously stopped at config startup with spawn EPERM. |

The earlier campaign create/open placeholder note is superseded by the implemented registration and milestone workflow above. Phase 2 acceptance remains open. The current Windows session can read both repositories, but its command runner fails before launching Git or Node because managed networking requires the elevated Windows sandbox backend.

## Acceptance closure audit

**Verdict: FAIL.** Source inspection identified executable discrepancies with mandatory acceptance clauses. Implementing and testing the corrections and finishing the remaining audit are blocked in this session by the Windows command runner. The actual frontend and backend repositories both passed a read/write/delete probe. The single process attempt was rejected before launch: managed networking requires the elevated Windows sandbox backend.

Recovered results above retain their original provenance. No suites or builds were rerun for this audit. No implementation files changed.

| Clause | Classification | Evidence and proposed correction |
| --- | --- | --- |
| Hold the Corridor and Suppressing Fire | PASS | The earlier open checklist item is superseded. The saved backend run passes the corridor restoration, +2 DC and expiry regression. The sheet uses the same projected save as the handler. |
| Passing Shot, Recalled Pattern, Light the Watch and Dawn | PASS | The saved final backend run passes the first-hit, source spell, once-per-turn and expiry regressions described in the preceding checkpoints. |
| Spell targeting geometry, visibility and table combat triggers | GM-ADJUDICATED | The tabletop contract assigns range, line of sight, movement, target facts and trigger evidence to the GM or encounter adapter. Keep these separate from executable source, cost, cooldown, and character-state validation. |
| Spell slot and Quickened turn restrictions | FAIL | Backend spellOperations.js lines 61–68 only checks these restrictions when turnId exists. Frontend SpellActions.jsx lines 29 and 51 lets the player omit it. Use the saved owner-turn ID when one is open. Require a consistent GM-confirmed turn label for turn-sensitive combat casting without a saved owner turn, including off-turn Reactions. Require turn context for Quickened and check both cast orders. Keep out-of-combat casts supported. Regress omitted and mismatched labels, second slot use, and preservation of slots, points and revision on rejection. |
| Extended Hunter's Mark duration | FAIL | Backend metamagic.js line 37 clamps the duration to 86400 seconds. spellOperations.js line 89 overwrites it after slot scaling and can save 172800 seconds at level five. Compute the slot-scaled base duration before applying the Extended cap. Assert the projected duration and persisted expiry at slot levels one, three and five. |
| Contingency's second slot and exclusive effect | FAIL | spells.md Contingency requires a second eligible spell and two slot expenditures, with only one active contingency. The casting payload and sheet have no contingent spell/slot selection. The backend has only a component definition and generic timed effect. Add a typed choice of known, self-targetable Action spell of level five or lower, its slot and the GM-confirmed trigger. Validate both slots and spell components, debit atomically, save a single replacing pending effect, and consume it once on a confirmed trigger. Test invalid choice, missing second slot, replacement, replay and reload. The GM adjudicates the fictional trigger. |
| Leviathan Anchor Nimbus recovery | FAIL | resources.md line 33 and abilities.md line 1981 specify no action. Backend featureOperations.js lines 48–53 places Nimbus under the Bonus Action guard and clears action-ending effects. Isolate that guard and action hook to the three original Warden Path recoveries. Preserve the exhausted-pool and exact fifth-level-slot checks for all four. Test Nimbus recovery without an action, preservation of action-ending effects, and continued Bonus Action enforcement for the other three. |
| Binding Parley sheet DC and specialized availability | FAIL | Backend corsairOperations.js line 17 computes the Instinct save DC. EnvoyControls.jsx shows the printed rule and cost but omits the computed DC. CasterPathControls.jsx and several specialized controls also omit projected unavailability reasons. Add a shared Parley save preview used by resolution, render AbilityPreview in EnvoyControls, and honor the server-projected availability and reason in the specialized controls. Verify rendered DC parity, disabled unavailable actions and understandable live errors. |
| Unmapped Calling, Path, spell and feat clauses | BLOCKED | The existing checklist and TAP results do not provide a complete clause-to-test matrix. Preserve prior passing results and leave unmapped interactions unsigned until they can be traced and tested. |
| Live sign-in, remaining campaign/session and sibling-app regression | BLOCKED | Existing fixture and integration results stand. Live and sibling-app acceptance remains unverified. |

## Confirmed defect corrections and additional verification

| Acceptance clause | Implementation and evidence |
| --- | --- |
| One slot per turn and Quickened Spell | Ordinary spells, scrolls and charged items share the saved owner or GM-recorded external turn. Repeating an ordinary slot cast after a browser reload produced a server error and retained the spent slot count. Backend regressions cover both cast orders with scrolls and charged items, forged labels and campaign GM authority. Quickened requires the caster's open turn. |
| Extended Hunter's Mark | The spell projects the slot-scaled duration before applying Extended Spell. Regressions verify the two-, sixteen- and twenty-four-hour results at slot levels one, three and five. Extended Hold Person verifies persisted expiry and Concentration Advantage. |
| Contingency | Both slots and priced materials are validated against the same staged cast. The saved effect expires after ten days, is replaced on a successful recast, and ends if cancelled or the statuette is lost. The confirmed trigger consumes the pending effect and applies the contingent spell to the caster without another slot. Tests cover invalid targets, unavailable slots, reload, expiration and duplicate triggers. The GM confirms the fictional trigger and resolves table spell effects outside the character engine. |
| Leviathan Anchor Nimbus | Restoring an exhausted use costs a fifth-level slot and no action. The other three Warden capstone restorations still use their Bonus Action. |
| Specialized sheet feedback | The browser displayed Binding Parley's computed Instinct DC and the unavailable reason after its pool was spent. The rules summary now reports saved prerequisites for Storm Pulse, Echo Link, storm conversion and actions that require kit charges. |
| Additional spell and folio clauses | Tree Stride and Phantasmal Killer now require Concentration. Prepared hit- and Reaction-triggered casts record the GM-confirmed event and reject repeat resolution of the same spell event. Command validation distinguishes base rules from the projected rules summary, so casting and other character actions continue to work after transcription. |
| Authentication and sessions | Local HTTP exercised signup, duplicate signup, rejected credentials, sign-in and access to the protected Archipelago rules endpoint with in-memory user persistence. An authenticated local HTTP smoke test also covered campaign creation and join, GM session hosting, member join and reload, and outsider rejection. Session handler tests cover private room codes and idempotent joining. Earlier real MongoDB and browser campaign results retain their original scope. |
| Sibling applications | Crossworld Community, Squash and The Southern Implication built. Crossworld Creative, Pale Shelter and WTWR builds were blocked by Windows child-process `spawn EPERM`. Sibling runtime flows remain unverified. |

The full local backend checkpoint passed 552 tests with zero failures and one environment-gated MongoDB skip. After the final projection-validation changes, all 98 focused backend tests passed. The frontend passed all 109 tests. Both lint checks and the Archipelago production build passed. Vite still reports a bundle-size warning.

The complete independent per-clause audit and the live campaign/session and cross-app workflows remain open. Phase 2 has not met full acceptance. Keep `tabletopReady` false.

## Continued mechanics and browser acceptance

| Clause | Implementation and verification |
| --- | --- |
| Savage Attacker and Punch and Grab | The feat journal uses the recorded encounter turn. Savage Attacker rejects fabricated turn labels, rejects another hit in the same recorded turn, and supports a valid off-turn hit. Punch and Grab still requires the owner's open turn. Weapon hit facts remain GM-adjudicated. |
| Ghost Patch trade check | The chosen trade bonus uses the saved owner or external encounter turn and rejects mismatched labels. The check still records its ordinary roll when the bonus has already applied. The test preserves Ghost Work and covers reload. |
| Action Surge at seventeen | In combat, a use requires the recorded owner turn. Relabeling the turn or using the feature from an external turn fails. The second use stays available for a different turn. The sheet shows the saved turn and the server reason after the feature is used. |
| Spell Mastery and Signature Spells | A ritual-capable spell whose ordinary casting time is an Action qualifies for Spell Mastery at unlock and on replacement. Saved folio copies are eligible for both grants. The server derives the folio snapshot from saved character state, and tests verify preview, advancement, serialization and rejection of a forged snapshot in a rebuild. A rebuild can preserve the historical snapshot and its grant choices. |
| Campaign and session browser workflow | The existing memory-only browser fixture ran the production React forms and backend handlers with separate GM and player identities. Campaign creation and join, character registration, session hosting and join, and GM milestone authorization passed. Reload retained player membership and the GM milestone. The player view hid host controls and private codes. Authentication was supplied by the local fixture. |

Final local results were 557 backend tests passed, zero failed, one environment-gated MongoDB skip, and 109 frontend tests passed with zero failures or skips. Both lint checks and the Archipelago production build passed. Vite still reports the bundle-size warning.

**Phase 2 acceptance remains BLOCKED.** The complete independent per-clause mapping remains open. The current tree has no new real-MongoDB acceptance run. The earlier sibling builds retain their original scope, and sibling runtime workflows remain unverified. Keep `tabletopReady` false.

## Acceptance requirement trace — 2026-11-09

This trace follows `acceptance-tests.md`. PASS applies to the evidence in the row. UNVERIFIED identifies the part still missing. The current MongoDB result and historical result are tracked separately.

### Roster, grants, and execution

| Requirement | Status | Implementation and evidence |
| --- | --- | --- |
| Eighteen origins × eight legal level-one Callings | PASS | `creation.js`, `engine.js`, and `characters/rules2024.js`. The 144-case test in `phase2.test.mjs` covers legal builds, bonuses, languages, Health, saves, and available Paths. `equipmentIntegration.test.mjs` covers every Calling's starting packages. |
| Eight Callings, four owned Paths each, levels 1–20, and correct unlock and inherited grants | PASS | `engine.js`, `progression.js`, and `canonicalRules.json`. `phase2.test.mjs` checks the hardcoded roster against every level and reads feature IDs and unlock levels from the normative ability specification. `rules2024.persistence.test.mjs` verifies persisted progression and Path validation. |
| Unique IDs, resolvable references, and independent schedules | PASS | `rules2024/index.js` registry validation, `phase2.test.mjs` and `rules2024.resources.test.mjs`. These verify catalog structure and progression separately from mechanical effects. |
| Every ability and selectable clause, including timing, upgrades, costs, invalid inputs, and recovery | UNVERIFIED | `abilityOperations.js`, the Calling and Path operation modules, `featureOperations.js`, and `resting.js`. The paid-binding audit and the feature-specific tests verify the covered cases. A binding or unlock test leaves the individual effect, timing, and resource interactions unsigned where no behavioral case exists. |
| GM-adjudicated geometry, target facts and world events | PASS for the contract boundary | Saved commands check sources, costs and typed confirmations, and expose results for table resolution. Examples include `phase2.path-management.test.mjs`, `phase2.strikes.test.mjs`, and `phase2.caster-paths.test.mjs`. The previous row records the outstanding exhaustive case coverage. |

### Numerical fixtures

| Requirement | Status | Implementation and evidence |
| --- | --- | --- |
| Attribute modifiers for scores 9, 10, 11, 12 | PASS | `system/checkModifier.js` and `checkModifier.test.mjs`. |
| 27-point allocation and single background/origin application | PASS | `system/pointBuy.js`, `creation.js`, `pointBuy.test.mjs` and the 144-case test. |
| Invalid creation and forged derived values | PASS | Creation validation and the command field allowlist, exercised by `phase2.test.mjs`, `phase2.creation-idempotency.test.mjs` and `rules2024.http.test.mjs`. |
| Doctor Health 10 → 17 and damage preservation | PASS | `engine.js` and `characters/rules2024.js` reconciliation, exact case in `phase2.acceptance-numbers.test.mjs`. |
| Doctor Resolve 14 → 16 increases level-two max and current by two | PASS | Same reconciliation and exact case in `phase2.acceptance-numbers.test.mjs`. |
| Level-five Stealth Training/Expertise +6/+9 | PASS | `engine.js` and `progression.js`, exact case in `phase2.acceptance-numbers.test.mjs`. `phase2.tool-checks.test.mjs` verifies the single doubled Training term in actual rolls. |
| Gunslinger longbow +8, 1d8+3 and studded-leather Guard 15 | PASS | `equipment/index.js`, exact case in `phase2.acceptance-numbers.test.mjs`. |
| Shield conflicts with a two-handed weapon | PASS | `equipment/index.js`, same independent fixture and `equipment.test.mjs`. |
| Pistol loading, Powder Drill, and ammunition costs | PASS | `equipment/index.js` and equipment commands, `phase2.inventory.test.mjs`. |
| Second Wind preserves two spent uses when capacity rises to three | PASS | `characters/rules2024.js` reconciliation and `rules2024.persistence.test.mjs`. |
| One Sorcery Point cannot create a level-one slot | PASS | `runtime.js` and `featureOperations.js`. `phase2.acceptance-numbers.test.mjs` verifies atomic one-point rejection. `rules2024.resources.test.mjs` covers conversion cost, level bounds, and restoration. |
| Rage Short Rest and Long Rest recovery, plus Hit Dice restoration | PASS | `runtime.js` and pool configuration, `rules2024.test.mjs` and `phase2.rest-time.test.mjs`. |
| Rest replay and 24-hour Long Rest limit | PASS | `resting.js` and receipted commands. `phase2.rest-time.test.mjs` covers cancellation/reuse, automatic Initiative interruption and both sides of the 24-hour boundary. `phase2.commands.test.mjs` covers receipt retry. |
| Full caster at three and Warden at one | PASS | `progression.js` and `engine.js`, exact slot and preparation cases in `phase2.acceptance-numbers.test.mjs`. |
| Temporary slots expire before ordinary refill | PASS | `runtime.js`, `rules2024.resources.test.mjs`. |
| Deadeye critical thresholds at three and fifteen | PASS | `selections.js` and combat dice, `characterCombat.test.mjs` and `combat.test.mjs`. |
| Omen Diver Health and unarmored Guard | PASS | `engine.js` and `equipment/index.js`, exact cases at three and four in `phase2.acceptance-numbers.test.mjs`. |
| Field Surgeon Triage dice, kit, use and lock | PASS | `abilityOperations.js` and character transaction handling, `phase2.commands.test.mjs` and `phase2.doctor-targets.test.mjs`. |
| Breakwater barrier at ten | PASS | `abilityOperations.js`, `phase2.path-management.test.mjs` verifies dimensions, exact passers, 70 Health and three-quarters cover. |
| Reef Skin reduces a ten-damage physical attack to two after Resistance | PASS | `vitality.js`, exact fixture in `phase2.vitality.test.mjs`. |
| Grand Battery costs and overlap | PASS | `cinderOperations.js` and `abilityOperations.js`, `phase2.cinder.test.mjs`. |
| Take the Burden split and nonrecursive resolution | PASS | `covenantOperations.js` and `vitality.js`, `phase2.covenant.test.mjs` and `phase2.core-actions.test.mjs`. |
| Blood Price cannot pay with the last Health or temporary Health | PASS | `conduitOperations.js`, `phase2.conduit.test.mjs`. |
| Captain's Credit off-turn once per round, exact grant and no currency | PASS | `abilityOperations.js`, `phase2.remaining-path-clauses.test.mjs`, and approved-rule browser evidence above. |
| ASI split, +2 and cap; Epic Boon unlock and cap | PASS | `engine.js` feat selection and `rules2024.test.mjs`. |
| One active Concentration and replacement with Chart the Passage | PASS for replacement behavior | `spellOperations.js`, `navigatorOperations.js`, `phase2.navigator-paths.test.mjs` and `phase2.caster-paths.test.mjs`. |
| Foreign access, compare-and-set, and idempotency | PASS locally | `characters/rules2024.js` and `commands.js`, authenticated HTTP and model-backed fixture tests in `rules2024.http.test.mjs`, `rules2024.persistence.test.mjs`, `phase2.commands.test.mjs`, and `phase2.creation-idempotency.test.mjs`. Current real persistence is a separate row below. |

### Feature management and workflows

| Requirement | Status | Implementation and evidence |
| --- | --- | --- |
| Triage cross-surgeon lock, rename, retry and reload; Impossible Operation eligibility and three costs | PASS locally | `abilityOperations.js`, `treatmentLock.js`, and `commands.js`. `phase2.doctor-targets.test.mjs` covers native transactions and rollback, with the real-store gate tracked separately. |
| Ghost salvage wreck evidence, recovery and single consumption | PASS | `abilityOperations.js` and `commands.js`, `phase2.path-management.test.mjs`. |
| Relay destruction, two-relay cap, origin, destination and Discharge; barrier placement, mitigation and independent free uses | PASS | `abilityOperations.js`, `spellOperations.js` and `commands.js`. `phase2.relay.test.mjs` and `phase2.path-management.test.mjs`, plus keyboard Discharge browser evidence. |
| Ten Metamagic options, prices, combination and typed effects | PASS for tested casting and triggered rerolls | `metamagic.js`, `spellRerolls.js` and `spellOperations.js`. `phase2.metamagic.test.mjs`, `phase2.replacements.test.mjs` and `phase2.final-defects.test.mjs`. |
| Spell Mastery, Signature counters, folio recovery, Sorcerous Restoration and Wish cooldown | PASS | `engine.js`, `selections.js`, `folioOperations.js`, `runtime.js` and `spellOperations.js`. `phase2.preparations.test.mjs`, `phase2.folio.test.mjs`, `rules2024.resources.test.mjs` and `phase2.intervention.test.mjs`. |
| Gray Net prey/defense choices and rest replacements | PASS | `grayNetOperations.js` and `selections.js`, `phase2.gray-net.test.mjs`. |
| Cunning and Brutal Strike limits and triggers | PASS for recorded strike resolution | `strikeOperations.js` and `StrikeControls.jsx`. `phase2.strikes.test.mjs` verifies costs, distinct options, owner and reaction turns, hit/miss and Advantage handling. The audit fixed duplicate Sneak Attack through a forged turn label and removed the mandatory Brutal Strike effect. |
| Evocation Savant at every newly opened slot tier | PASS | `engine.js` compares current and prior slot tiers. The independent schedule in `phase2.acceptance-numbers.test.mjs` verifies required picks and eligible Evocation choices at every tier. |
| Ten-step creator, exact choice/stat reload, canceled preview and draft/error behavior | PASS for tested browser and API paths | `CharacterCreation.jsx`, `PersistentSheet.jsx` and `characters/rules2024.js`. The earlier browser creator and cancellation checkpoints and `rules2024.http.test.mjs` support this row. |
| Every unlocked ability card, computed DC/dice, source, upgrade and unavailable reason; passive cards | UNVERIFIED exhaustive UI coverage | `AbilityPreview.jsx`, `AbilityActions.jsx` and the specialized controls. `archipelago/tests/phase2.test.mjs` and browser tests cover representative states. Full parity for every card remains open. |
| Click/reload/rest totals, spell and equipment workflows | PASS for tested paths | Persistent sheet controls, `spellOperations.js` and equipment commands. See prior browser evidence and `phase2.inventory.test.mjs`, `phase2.casting-components.test.mjs`, `phase2.materials.test.mjs` and `phase2.final-defects.test.mjs`. The rest planner now also blocks start/completion during a saved encounter. |
| Real Mongo owner isolation, indexes, CAS, cross-target rollback, restart, strict schema and version mismatch | UNVERIFIED on current tree | `phase2.mongo.test.mjs` was invoked. Its gate skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. No `mongod` executable was available on PATH. Historical isolated database results above apply to earlier code. |
| 320/768/1440, both themes, keyboard and accessible feedback, long content and historical comparison | PASS for documented representative views; UNVERIFIED exhaustive comparison | `CharacterCreation.css` and `Rules2024.css`. Earlier browser evidence covers both themes at all three widths, representative keyboard controls and live errors. Long content and the historical comparison have partial coverage. |
| Authentication, navigation, maps, campaign/session, reputation/lore/assets | PASS for fixture auth, map navigation and campaign/session; UNVERIFIED remaining presentation | Prior HTTP authentication and browser sign-out and campaign/session checks. A complete live sign-in and reputation/lore/assets comparison remains unverified. |
| Shared application contracts and unrelated application workflows | PASS for shared HTTP smoke; UNVERIFIED sibling UI | `src/routes/index.js` plus the actual user, WTWR, Squash, Community and Pale Shelter handlers in `phase2.shared-contracts.test.mjs`. The smoke used local model fixtures. Earlier build results stand, including the three Vite `spawn EPERM` limitations. |
| Phase 1 documents and preservation | PASS for recorded baseline comparison | The 14 normative documents and selected unrelated source hashes were checked in the earlier audit. The current change set is scoped to acceptance evidence, Archipelago handlers and sheet controls, and tests. |
