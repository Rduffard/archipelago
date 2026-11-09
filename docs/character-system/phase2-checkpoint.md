# Phase 2 implementation checkpoint — 2026-11-07

**Incomplete. Not accepted for GM-adjudicated tabletop testing. Do not restart or replace the existing implementation.**

## Actual repositories and preservation

- Frontend: C:\Users\Romain\projects\Crossworld Creative\archipelago
- Backend: C:\Users\Romain\projects\Crossworld Creative\crossworld_backend
- Both are independent Git roots. Initial access/write probes were completed before the interrupted work; resumed work inspected both dirty working trees and continued directly in them.
- Recovery baseline: C:\Users\Romain\projects\Crossworld Creative\character-phase2-recovery-20261107, with per-repository manifests, source copies and staged/unstaged patches.
- All fourteen normative Phase 1 documents still match their recovery hashes. All 95 frontend and 37 backend pre-existing deleted entries remain deleted. Do not restore these files wholesale.
- No commits, pushes or deployments. This resumed session did not run MongoDB writes, migrations, resets or deletions. The real-Mongo test remains gated and skipped without its explicit isolated URI.
- The user's current instruction is **do not modify MongoDB without authorization**. Do not start the DB-backed UI harness merely to review changes.

## What was already present at resume

The single replay engine and canonical registry contained eight Callings, 32 Paths, 246 readable feature definitions, ten Metamagic choices and 316 spell references. Creation, ledger advancement, saved sheets, resources and transaction receipts were substantially integrated. All 32 Paths had level-1–20 grant-boundary tests. A previous session recorded isolated-Mongo and martial browser evidence, but that evidence predates the changes below and does not establish current full-flow acceptance.

The system still labels itself phase2-in-progress-not-accepted and tabletopReady false. Keep that truthful state.

## Implemented during this resumed session

### Canonical rules and advancement

- Fixed stale Cutlass expectations to the normative Nick/3 lb/25 GP definition.
- Added optional source-bound Magic Initiate spell replacements, one same-level spell per prior grant per level; list, ownership, duplicates and source limits validated.
- Added Navigator/Warden cantrip-style replacement at subsequent Calling levels.
- Added advancement UI for those replacements, Metamagic replacement, Doctor/Tidecaller cantrips and Tidecaller preparations.
- Fixed ordinary preparation counts to exclude always-prepared class/Path spells, Mastery and Signature grants. Mastery/Signature selection now precedes ordinary preparations.
- Long Rest Mastery replacement and its ordinary preparation changes validate together; the interface exposes both.
- Added public versioned character-rules endpoint and content hash; creator/sheet request it. Old aliases still expose the same registry pending final cleanup.

### Spells and target validation

- Second Wind cannot heal another character. Single-creature healing cannot duplicate its healing over multiple targets. Divine Spark requires another creature. Stable target IDs must be distinct.
- Casting rejects unknown sources, malformed target lists, invalid ritual sources, cantrip slot spending and invalid turn labels.
- Quickened cantrips enforce the prohibition against a levelled spell before/after them on that turn.
- Expired Rage/Innate Sorcery do not block casting or qualify for Metamagic combinations.
- Metamagic rule validation returns a 422 failure instead of an unclassified exception; combination exceptions distinguish Empowered/Seeking.
- Magic Initiate UI supports both its independent free cast and ordinary spell slots.
- Added typed material profiles for all 54 priced spell entries, with server-owned component definitions, minimum values, quantities, consumed flags and per-target requirements. Wrong/narrative/duplicate component instances fail atomically.
- Compound material sets, per-target Astral Projection, retained Bless symbols and two-copper Gentle Repose have behavioral tests.
- Priced component purchases and selection use the ordinary inventory UI. Specialized context-dependent material rules remain below.

### Sparkwrite Aetherist

- Explicit placement, mobile movement, proximity recording and Discharge operations replace the former generic paid action.
- Relays persist Guard 15, Health 2×level, Poison/Psychic immunity, one-minute lifetime, mobility and proximity.
- One relay before 14; two at 14, with an explicit chosen replacement when placing a third.
- Grounding Circuit projects Lightning resistance and Concentration-save advantage only while near a live relay; destruction removes the benefit.
- Discharge consumes one Relay use, rolls 4d8 or 6d8 at 14, records save DC/half damage and destroys only its chosen relay.
- Casting can originate one Shipwright cantrip per turn at a live relay; Twin Circuit validates two relays and a once-per-turn teleport in the same casting command.
- UI exposes relay controls, object damage and casting/teleport choices. Geometry/sight remain explicit GM-confirmed tabletop facts.

### Breakwater and Drydock Ghost

- Barrier placement confirmation, exact dimensions, bend eligibility, passers and Training Bonus limit are validated. Objects carry immunities and high-level resistance.
- Barrier damage distinguishes Force and siege damage. Reaction reduction requires a live barrier and one confirmed nearby creature.
- Shelter records temporary Health grants; native multi-character updates use the existing transaction path. This expanded native transaction behavior has not been rerun against MongoDB.
- Ghost Patch requires a stable nonmagical object and records scaled server rolls/repair or tampering DC.
- Silent Keel validates one vehicle or up to six willing creatures and shares Concentration.
- Salvage records a wreck ID and grants only the scaled repair/crafting credit. A typed spend command debits credits for an identified project, without converting them into gold.
- Unseen Passage projects climbing/swimming movement and has a bounded, once-per-labelled-turn inside-structure consequence.

### Inventory and sheet

- Added the twenty mandatory supplies explicitly listed in Phase 1 equipment.md; the complete incorporated SRD gear/tool/pack tables are still outstanding.
- Canonicalized starting ammunition, several focuses/tools and Spellbook; stacks support ammunition quantities.
- Typed catalog-price purchases, consumption, healer-kit charges, healing potions, split/merge and preset save/apply commands persist through the normal transaction/CAS path.
- Purchases calculate in integer copper. Existing storage still uses the GP field; a complete canonical integer-copper storage cutover is not finished.
- Ammunition operations validate an equipped weapon, matching rounds, free loading hand, Extra Attack/Loading and consistent action IDs.
- Powder Drill bypasses Loading only for pistol/musket, not crossbows.
- Presets validate all owned instances and hand conflicts before applying.
- Removed unchecked item/gold award controls from the sheet. The old equipment endpoint now accepts only loadout changes; unchecked additions/quantity edits/currency awards return 403.
- Preserved existing classes, layout components, fonts and theme tokens. No website redesign.
- Full ESLint now ignores generated .test-cache dependency bundles, rather than linting bundled React source.

## Requirement status against the fourteen documents

| Contract | Status | Exact remaining boundary |
| --- | --- | --- |
| README / one authority | Partial | Canonical registry/replay in use; old aliases, supplemental mechanical endpoints and unused draft modules remain. |
| Callings | Partial | All eight timelines and acquisition tests through 20; not every active/conditional clause has a complete typed operation. |
| Paths | Partial | All 32 integrated, canonical names and correct owner/schedules; several still have generic paid-action recording and incomplete local interactions. |
| Abilities | Partial | All 246 readable definitions; exhaustive executable clause parity and per-clause behavioral fixtures are not complete. |
| Creation | Partial | Ten steps, point buy, origins/background choices, review/save integration; creation idempotency, full identity fields, final equipment purchases and browser acceptance remain. |
| Origins/backgrounds | Mostly implemented | 144 origin×Calling fixtures; package expansion now has exact-content tests; exhaustive duplicate-tool/instrument combinations and browser acceptance remain. |
| Training | Partial | Skills/saves/Expertise and main formulas work; tool identifier normalization and all conditional senses/Guard/speed interactions remain. |
| Feats | Partial | Closed catalog, prerequisites, ASI and replacements; Spell Recall now preserves matching slots automatically; other active feat clauses, source counters and some tool subchoices remain. |
| Equipment | Partial | Weapons/armor, mandatory supplies/materials, purchases, consumption, ammo, stacks/presets work; SRD price/weight/tool/pack tables are vendored and packs expand into inventory; sales, GM awards, attunement, copper storage and remaining gear interactions still need completion. |
| Spells | Partial | 316 references, source/slot/free-cast basics, replacements and priced materials work; ten Metamagic management operations and hands/focus checks now exist; exhaustive spell/profile edge cases, specialized material context, folio/rebuild workflows and remaining feature-casting clauses need completion. |
| Resources | Partial | Main pools, costs, reconciliation and timed rests; world time, interruptions, conditions, death saves, Concentration and Rage decisions now have typed operations; remaining cooldowns, Inspiration, action/event budgets and exhaustive effect expiry remain. |
| Architecture | Partial | Commands, receipts, ownership, CAS and transactions exist; creation idempotency, campaign milestone/GM authorization, typed operation parity, error fieldPath/code and audit pagination remain. |
| Migration | Incomplete | Preserved earlier deletions; replacement acceptance has not passed, so final engine/route/compatibility cleanup must wait. |
| Acceptance | Incomplete | Exhaustive grants plus focused behavior/SSR tests pass; full per-ability behavior, current Mongo transaction/reload and browser/unrelated-site gates remain. |

## Remaining implementation priorities

1. Complete the typed clause registry and handlers for all 246 features. In abilityOperations.js, identify every remaining path-action and record handler; replace only after exact costs, required equipment/trigger, targets, scaling, per-turn/rest counters and effects have behavioral fixtures. Do not mark a registry entry or descriptive effect as executable completion.
2. Finish base Calling clauses: Inspiration, Cunning/Brutal Strike choices and dice budgets, Divine Intervention including level-20 Wish cooldown, remaining capstones and all derived conditions. Tactical Mind, Indomitable, Stroke of Luck and cast-bound Overchannel now have explicit handlers; retain their missing edge-case acceptance rather than rebuilding them.
3. Complete remaining original Path options: Envoy turn/round limits, Sanguine conditional pools, Iron Covenant Shield state, remaining Doctor clauses and all aura/passive interactions. Cinder core mechanics and the local Iron Covenant transfer damage pipeline are implemented; current full native transaction/browser acceptance remains outstanding.
4. Finish spell management: exact ordinary components, all ten Metamagic effects/targets/rolls, feat and feature free sources, prepared/always-prepared rest reconciliation, discovery/copy IDs and lost-folio rebuild.
5. Material profiles currently validate their baseline numeric components. Add context-dependent Forbiddance consumption after the repeated-site ritual, Plane Shift rod attunement, item-specific wearing/placement requirements, aggregate diamond-value substitutions for True Resurrection and full component weight/reference profiles. These are not claimed complete.
6. Finish gear consumable/scroll/tool interactions, authorized awards/sales/attunement and canonical copper storage. SRD gear/tool tables, seven packs, starting-package expansion and known carrying totals are now implemented and tested. No arbitrary owner-supplied item statistics or gold adjustments.
7. Finish authoritative campaign milestone authorization and operation parity, including create idempotency, rebuild consent/audit, conditions/death saves, cooldowns, rest interruption/world-clock consistency and effect journaling separate from active effects.
8. Recheck native cross-target Triage/temporary-Health/healing transactions and global locks against an explicitly authorized isolated MongoDB, with rollback/concurrent/restart tests. Do not use configured production or development data silently.
9. Exercise the actual browser creator→save→sheet→advance→reload→rest/equipment/spell flows for martial, caster, relay and complex-target characters. Check 320/768/1440, both themes, keyboard/live errors and unrelated navigation/auth/maps/campaigns.
10. Only once replacement acceptance passes, remove superseded drafts, generic mechanical routes and compatibility code. Preserve unrelated accounts, lore, campaigns, artwork and combat-test functionality.

## Reproduce checks without MongoDB writes

From the backend root:

    node --test --experimental-test-isolation=none tests/*.test.mjs
    node node_modules/eslint/bin/eslint.js .

From the frontend root:

    node --test --experimental-test-isolation=none tests/*.test.mjs
    node node_modules/eslint/bin/eslint.js .
    node --input-type=module -e "import {build} from 'vite'; import react from '@vitejs/plugin-react'; await build({configFile:false,plugins:[react()],resolve:{preserveSymlinks:true}});"

Do not set SA_PHASE2_TEST_MONGO_URI unless a fresh isolated database is explicitly authorized. The gated real-Mongo test is tests/phase2.mongo.test.mjs. The existing tests/support/phase2-ui-harness.mjs also writes an isolated Mongo database; do not run it under the current restriction.

Focused new behavioral suites: phase2.relay, phase2.replacements, phase2.inventory, phase2.path-management, phase2.materials and phase2.preparations tests. Frontend tests/phase2.test.mjs covers rendered controls, not browser interaction or actual database persistence.

Final verification results are recorded in phase2-checklist.md. A passing suite does not waive the outstanding implementation and real end-to-end gates.



## Connection-recovery continuation — 2026-11-07

Continued from this checkpoint after inspecting both working trees; no reset, replacement checkout, database operation, commit or deployment.

Implemented:

- Cinder Artillerist now has explicit Measured Charge and Grand Battery handlers rather than generic paid-action recording. Server validates carried smith tools, a free hand, one/two distinct area centers, declared target membership, Shaped Detonation limits, Safe Handling selections and radius unlocks. A two-handed weapon may be carried in one hand while preparing a charge; actively using a two-hand grip occupies both.
- Server rolls exact 2d6/3d6/5d6 progression and two 6d6 Battery areas; records Agility DC, half-on-success damage and save advantage. Owner Safe Handling advantage is automatic at seven; selected allies gain it independently.
- Grand Battery spends two Charge uses and one battery use atomically. Overlapping targets are resolved once, using the first declared area's roll; the UI states this convention.
- Breach distinguishes unattended objects, doubles their damage and records Fire-resistance bypass at fifteen. Smoke records heavy obscurement, proper radius/duration, exempt creatures and the 20-mph wind threshold; it does not impose Poisoned or recurring damage.
- Added artillery sheet controls for areas, overlap, exemptions, allied advantage, objects and costs. Added readable saved-action resolution tables.
- Tactical Mind now rolls a server d10, spends Second Wind on success, refunds on continued failure and prevents rerolling a resolved check ID. It never heals.
- Action Surge requires a confirmed owner turn and an explicit non-Magic action, at most once per turn even when two uses are available at seventeen.
- Second Wind reports Tactical Shift beginning at five, including applicable heavy-armor Speed penalties.
- Added sheet inputs and saved-action results for these Gunslinger clauses.

New behavioral coverage: tests/phase2.cinder.test.mjs (12 cases) and tests/phase2.gunslinger-actions.test.mjs (4 cases). Frontend tests/phase2.test.mjs adds artillery controls, saved check refunds and target-resolution table assertions. These are automated unit/render tests, not browser playtesting.

Current limitations remain: no authoritative encounter adapter for geometry/turn provenance, no automatic external-target combat resolution, no automatic wind/turn expiry of smoke, and the broader unfinished items above. Remove Tactical Mind, Action Surge and Cinder's core charge cost/scaling logic from the implementation backlog; retain comprehensive browser, event-expiry and native persistence verification.

Latest verification results are appended to phase2-checklist.md. Full Phase 2 acceptance is still not met.


## Windows-disconnect recovery and continued implementation — 2026-11-07

This section supersedes historical backlog claims above where a named operation is now implemented. The workspace briefly disconnected (exec-server executor key changed); Windows access returned and work continued in the same dirty repositories. No reset, MongoDB operation, commit, push or deployment occurred.

### Shared character state completed in this continuation

- Added clock.js, vitality.js and resting.js as shared helpers under the existing canonical engine. Saved world time rebases prior expiry timers; expiry clears linked Concentration checks and expired temporary Health.
- Typed damage applies Resistance/Immunity, Reef Colossus reduction in the correct order, temporary Health, massive damage, zero-Health failures and pending Concentration saves. Healing cannot revive dead characters.
- Death saves include natural one/twenty, stable/failed-save death and saved 1d4-hour stable recovery. Conditions are source-specific; Exhaustion adjusts D20 modifiers/Speed and six is fatal. Rest nourishment and Tireless reduction are implemented.
- Owner-turn start/end, Rage extension, Persistent Rage and pending Relentless Rage decisions have server operations and sheet controls. Equipping heavy armor ends Rage.
- Long/Short Rests validate clock duration, interruption causes, immediate-resume penalties, partial-hour Short Rest credit and Long Rest frequency. Stable rest IDs cannot be replayed for duplicate benefits.
- Keeper stabilization, Witness healing at zero, One More Dawn failed-save revival, Plaguewarden antidote/quarantine/condition cures and Impossible Operation use typed target constraints. Native cross-character updates reuse existing transactions/receipts; transaction-double tests pass, real Mongo remains skipped.

### Spellcasting completed in this continuation

- Repaired five affected spell descriptions using the official SRD page layout, without editing the fourteen authoritative Phase 1 design documents. Added immutable static profiles for all 316 spell headers; runtime no longer parses prose for Metamagic eligibility.
- Casting persists effective range, components, duration/expiry, target scaling, damage conversion and precise Careful/Heightened targets. Distant/Extended reject ineligible spells; Twinned changes target scaling only. Subtle retains priced/consumed Material requirements.
- Saved cast IDs support triggered Empowered damage-die rerolls and Seeking missed-attack rerolls, with Spirit limits, server replacements, exact SP costs and duplicate event rejection. Apotheosis shares one free option per labelled turn across casting and rerolls.
- Added hand/focus/pouch checks. Somatic-only spells cannot use an occupied focus hand to bypass their requirement. Carried two-hand weapons can be held with one hand; active two-hand grip occupies both. Specific spell speech/material/equipment exceptions still need exhaustive clause review.
- Spell Recall automatically rolls its d4 for eligible slot levels, preserving the slot and created-slot accounting on a match. Deterministic helper tests cover all sixteen slot/d4 combinations.
- Overchannel is cast-bound, validates damaging Shipwright level-1–5 slot casting and turn ID, saves the maximum-damage turn and rolls escalating Necrotic backlash. Backlash uses shared Health/Concentration/death handling and ignores Resistance/Immunity. Removed the obsolete counter-only UI and internal handler; its public route rejects manual use.
- Added SpellRerolls controls and saved casting/outcome presentation with the existing site styles.

### Gear and Calling operations completed in this continuation

- Vendored SRD adventuring gear/tool price/weight/Utilize/crafting descriptions, instrument/game variants and focus forms. Seven packs have exact typed contents; purchases pay the pack price once and unpack actual items. Every Calling starting package is canonical inventory; background tools/paper/instruments resolve to catalog instances where defined. Original Common Clothes remain narrative.
- Focus staffs reuse Quarterstaff statistics and mastery identity rather than introducing duplicate mastery selections. Carrying totals account for per-round ammunition weights, flag unknown item weights and expose 15x/30x Might limits. The sheet shows gear rules and Heavy/two-hand restrictions.
- Added explicit Indomitable rerolls, Stroke of Luck natural-twenty conversion, Uncanny Dodge halves, Divine Spark damage scaling/element/save, optional Sear Undead and Abjure Foes target/condition rules. GM resolves target saves/world movement; server rolls damage and saves declared effect conditions/costs.
- Unseen Passage damage and Take the Burden now use shared vitality handling instead of subtracting Health directly. Take the Burden splits damage without applying owner mitigation, with temporary Health and Concentration handling.

### Exact next work (implementation remains incomplete)

1. Continue remaining generic path-action/record handlers in abilityOperations.js and all passive/conditional clauses in the 246-feature contract; source names alone are not completion. Do not rebuild the explicit handlers listed above.
2. Finish remaining original Path choice/resource/aura clauses and action/reaction/turn provenance. Inspiration, typed active feat/boon controls, Cunning/Brutal Strike budgets/upgrades and Divine Intervention/Wish cooldown now exist; retain their remaining spell/condition and acceptance edges below. Exhaustive condition advantage/disadvantage and automatic-save interactions remain.
3. Verify static spell profiles against every normative clause; add spell-specific material contexts, sustained/turn-triggered effects, speech restrictions from actual source effects, source-specific focus exceptions, lost-folio rebuild and remaining feature free casts. Casting/reroll cache is bounded; rests retain only castings with active linked effects. Complete permanent/special and turn-relative duration semantics.
4. Finish mundane consumable/tool utilization, spell-scroll identity/casting, GM-authorized awards/sales, attunement/prerequisites and integer-copper storage. Price/weight/catalog presence is not proof all gear mechanics are implemented. Tool-check normalization now matches plural grant IDs to canonical inventory IDs; audit all other consumers and exotic tool subchoices.
5. Finish creation idempotency/full identity, campaign milestone/GM authority, rebuild consent, structured validation codes/field paths and audit pagination.
6. Complete browser workflows for martial/caster/complex-Path builds through twenty and save/reload, responsive themes/keyboard behavior and unrelated-site regressions. No browser verification was performed in this continuation.
7. Real Mongo transactions/concurrency/restart/reload remain unverified for these changes. Do not run the gated test or DB-writing UI harness under the current restriction. After replacement acceptance passes, finish legacy route/alias/draft cleanup.

Added focused suites: phase2.vitality (12), phase2.rest-time (6), phase2.doctor-targets (5), phase2.metamagic (12), phase2.gear-catalog (6), phase2.casting-components (6), phase2.core-actions (7), phase2.overchannel (4). Frontend adds four state/rest/reroll/result render tests. These are not browser or tabletop playtesting.

Latest complete pre-Overchannel validation: 277 backend passed, one gated Mongo test skipped; 78 frontend passed; both full ESLint and production build passed. Final post-Overchannel results are recorded in phase2-checklist.md after completion. Phase 2 remains not accepted/tabletopReady false.

## Rate-limit continuation: feats, strikes, Intervention and tools

Continued directly in both repositories after verifying that the interrupted final run had completed: 281 backend passed, one gated Mongo skip; 78 frontend passed, full lint/build passed. No reset, commit, push, deploy or database write.

Implemented further:

- Added featOperations.js and FeatControls.jsx, exposing the server's active-clause registry. Counters are source/level-or-background/clause scoped. Server records Heroic Inspiration awards and one-die spends, original/replacement rolls, saved Initiative and GM scene light/combat provenance. Deadeye's Heroic Warrior grants one Boolean Inspiration at each combat owner-turn start without stacking; save/reload and advancement preserve its source.
- Savage Attacker rolls the actual wielded weapon dice twice, excludes rider dice, handles critical dice and eligible Great Weapon Fighting, and enforces a labelled once-per-turn use. Alert validates willing/conscious allies and swaps both native Initiative totals in the existing transaction, checking the saved ally total/combat and CAS revision. External tabletop allies receive a readable GM result.
- Added Peerless Aim's owner-turn reset, Blink Steps eligibility/distance and event deduplication, Fate's signed 2d4 and Initiative/Short/Long Rest recovery, Irresistible Offense's original chosen attribute and physical Resistance bypass projection, and Night Spirit light-based Resistance/Invisible with action expiry.
- Added Harbor Defender reduction, Field Responder real kit expenditure and native stabilization, and Grappler's own-turn Punch/Grab plus derived grapple benefits. Native Field Responder failures roll back kit/counter/recipient changes. These transaction tests use doubles, not MongoDB.
- Added strikeOperations.js and StrikeControls.jsx for Sneak Attack/Cunning Strike and Brutal Strike through twenty. Server validates actual weapons/grips, acquired options, die budget, Poisoner kit, target size, turn/event limits and prerequisites. It rolls remaining damage dice, doubles only remaining dice on critical hits, saves exact save DCs, target conditions, durations and movement/attack/save clauses. World target saves/positioning remain GM-adjudicated.
- Cunning supports two choices at eleven and Daze/Knock Out/Obscure at fourteen. Reef Knife Stealth Attack uses the specific Hide source of Invisible and checks cover at turn end. Brutal adds Staggering/Sundering at thirteen and two effects/2d10 at seventeen, records forfeiture of all Advantage, extends active Rage from the confirmed attack and expires owner-turn effects.
- Divine Intervention is an explicit spell source at ten, permits eligible unprepared Doctor spells, uses a Magic action, spends its own counter and waives Material components. At twenty Wish saves a server 2d4 cooldown; only completed Long Rests decrement it. Ordinary Intervention at twenty still recovers after one Long Rest. Removed the manual cooldown override control and accepted recovery flag.
- Added server tool checks and ToolCheckControls.jsx: real owned catalog tool, GM-selected attribute/applicable skill, canonical grant-ID normalization, Training once, Expertise twice, skill/tool Advantage, poison/armor Disadvantage, Rage Might Advantage and Exhaustion once. Roll outcomes/event IDs persist without consuming the tool; duplicate events fail atomically. This does not claim automatic crafting/world utilization.

New tests: phase2.feats (13), phase2.strikes (9), phase2.intervention (5), phase2.tool-checks (5); phase2.doctor-targets adds three native feat transaction tests. Frontend render tests cover feat, strike, Intervention and tool controls. No actual browser/tabletop playtest was run.

Most recent completed full run before the final tool-check additions: 311 backend passed, one Mongo skip (312 total); 81 frontend passed; full lint and build passed. The current final run is recorded in phase2-checklist.md when complete.

### Do not lose these remaining boundaries

- All eight Callings and all 32 Paths retain their tested level-one-to-twenty grant schedules. This is not proof that all 246 feature clauses have complete mechanics. Several original Path actions/passives remain generic or incomplete; inspect the existing handlers before replacing anything.
- Wish spell duplication, nonduplicate Wish stress/permanent loss and other spell-specific character-state interactions remain. Greater Intervention's use/cooldown is implemented; do not claim the entire Wish spell contract is complete.
- Remaining Path/aura/Shield/choice/free-cast clauses, Hollow Lantern Last Tell rerolls, all conditional attack/save/condition interactions and authoritative encounter/turn/reaction provenance need completion or explicit tabletop boundary confirmation.
- Tabletop commands record GM-confirmed facts. Campaign GM-only authorization, milestone progression authorization, actual GM-award permission/provenance and creation idempotency remain architecture work; a confirmation checkbox is not an authorization role.
- Inventory sales/GM awards/attunement/scroll identities and consuming/using all gear, integer-copper storage, lost-folio rebuild and remaining identity/audit/error-contract workflows remain.
- Full browser flow, responsive/theme/keyboard/unrelated-site regression checks and current real-Mongo persistence/concurrency/rollback/restart acceptance remain unverified. The MongoDB restriction is still in force. Final obsolete route/alias/draft cleanup waits on replacement acceptance.

Next executable steps: finish any current test failure, inspect remaining original Path character-state handlers (especially Hollow Lantern/Saltglass/Envoy/Sanguine/aura state), then campaign GM/milestone/create-idempotency and the remaining inventory/folio workflows. Preserve all new suites and source-scoped state during further reconciliation changes. Phase 2 remains incomplete and tabletopReady false.

## Envoy, creation retries, identity and audit continuation - 2026-11-07 (America/Chicago)

Continued in the actual dirty repositories. Inspected the existing Hollow Lantern/Saltglass handlers and their nine tests; these were already present and were preserved. No MongoDB connection/write/reset, commit, push or deployment occurred. The browser adapter used in-memory records only, discarded on shutdown.

Implemented:

- Black Flag Envoy has explicit Terms of Surrender, Crew Before Crown, Binding Parley and All Hands handlers and dedicated sheet controls. Commands validate other/distinct targets, limits, confirmation, stable event/turn labels and exact costs; repeated event IDs fail atomically. Crew results record half-Speed/no-Opportunity-Attack movement or the original Charmed/Frightened save with Advantage. All Hands spends two uses and permits up to three distinct allies, each requiring its own Reaction. Range upgrades at nine. Parley stores its exact DC, one-minute duration, failed-save Charmed/attack restriction, immunity, repeat-save and harm-ending clauses. World positioning, ally Reaction availability, original condition saves and per-target Parley outcomes remain GM adjudication; this is not an encounter adapter or GM-role authorization.
- Creator sends an Idempotency-Key retained for retries of the same draft during the mounted creation session. One owner-scoped unique creation key/digest and original response snapshot are saved in the character document atomically. Identical retries return the original response even after later edits or at the character limit; changed payloads conflict. Duplicate-key races resolve to the winner. The model initializes its unique index before keyed creates. Old callers without a key remain accepted until route/client cleanup. Actual Mongo index/concurrency behavior remains unverified; tests use model doubles. The overall 20-character cap across different concurrent requests is still not transactionally enforced.
- Pronouns (1000), appearance (1000) and optional HTTPS portrait URL (2000) persist from creation and can be edited alongside name/notes. A shared identity validator provides code/fieldPath on these validation errors. Sheet edits now use receipted identity.patch. Narrative commands no longer run mechanical expiry; identity tests assert mechanical state preservation. Existing error middleware does not yet guarantee code/fieldPath transport for all error classes.
- Owner-only GET /characters/:characterId/commands exposes cursor pagination (1-100, default 20), newest first, projected to command identity/time/result without whole character snapshots or receipt digests. Added supporting index and explicit-refresh/older-page sheet UI. It lists receipted commands; old noncommand routes and character creation are not yet a unified audit feed.
- Browser review exposed and fixed duplicate React keys for repeated ASIs and tool-check attribute options that incorrectly offered SRD keys rejected by the server. Options now submit Might/Agility/Resolve/Wit/Instinct/Spirit IDs. A scoped body minimum-width correction removes the 15-pixel overflow at a 320-pixel viewport without changing unrelated pages.

Validation:

- Full backend run: 342 passed, 0 failed, one gated Mongo test skipped (343 total). After the final creation-ID/index-init adjustment, all 25 Envoy/creation/identity/audit focused tests passed again.
- Full frontend run after final UI fixes: 87 passed, 0 failed. Both full ESLint checks passed; production build passed. Latest build details are in phase2-checklist.md.
- Actual browser, in-memory server: level-17 Envoy All Hands saved, reduced Envoy uses 3 to 1 and displayed both ally grants; identity command saved; paginated-history UI showed identity.patch and ability.activate newest first; page reload retained uses, pronouns and appearance. These checks exercise real UI/handlers against memory, not Mongo durability.
- Sheet width checks: at 768/1440 there was no horizontal page overflow. At 320, the initial 15-pixel overflow was corrected and rechecked (page width 305 = available client width 305). A screenshot was visually inspected at 320. Both-theme coverage, keyboard/error flows, full blank creator, caster/relay workflows, all Paths through twenty and unrelated navigation regression acceptance remain outstanding.

Next: continue Sanguine Conduit and other generic original-Path/passive/aura clauses; implement campaign GM/milestone authority and remaining inventory/folio/copper workflows. Complete creation retry behavior across all clients and its real database acceptance. Retain the Mongo restriction. Do not claim Phase 2 complete or remove final legacy aliases before replacement acceptance passes.

## Sanguine Conduit and Iron Covenant continuation - 2026-11-07 (America/Chicago)

Continued in the same repositories. No MongoDB connection/write/reset, commit, push or deployment. Memory-only browser fixtures were used and the fixture server stopped afterward. All previous implementation and normative documents were preserved.

### Sanguine Conduit

- Replaced the generic paid-action branches with explicit Blood Price, Measured Sacrifice and Vital Circuit handlers. Unbroken Current is now an opt-in Reaction within health.damage, not an out-of-context ability that sets Health to one.
- Blood Price loses exactly twice Training Bonus in real Health, bypasses temporary Health/Resistance and rejects the whole command if it would leave less than one. Shelter grants exactly one chosen recipient 1d8/2d8/3d8 plus Spirit modifier with native cross-character transaction support, nonstacking and source/caster/grant metadata. The caster no longer receives another creature's Shelter pool.
- Surge is consumed by the next saved spell casting, records extra Necrotic damage for one damage roll only, is forfeited by a nondamaging spell, and expires at the next owner turn. Failed casts preserve Surge and their other costs. This records a one-roll rider for GM damage resolution; it does not automatically damage world targets.
- Measured Sacrifice loses six real Health, restores at most two Sorcery Points, spends its own Long Rest use and never heals or bypasses the one-Health floor.
- Vital Circuit requires another recipient, a damage event, a turn label and confirmed range/Reaction facts. Native triggers must reference an authorized character's saved health.damage receipt proving damage reduced this caster's Blood Price pool. Secondary Circuit temporary Health, expiry and replacements cannot provide that receipt. External tabletop targets require a real prior Blood Price grant and GM confirmation of the damage trigger.
- Duplicate damage events and per-turn reuse are checked against saved command receipts as well as a recent 200-entry runtime cache. Old external grants can be recovered from receipts after the recent-grant cache rotates. Cache state survives Long Rest and advancement; transaction/CAS rollback covers recipient updates and cache state. Full Mongo behavior is still gated; native tests use transaction doubles.
- Unbroken Current resolves before Unconscious, spends once, remains at one Health and grants Tidecaller-level temporary Health. Massive-damage death cannot be prevented. Existing Incapacitation prevents the Reaction. Concentration survives only pending its normal damage save. The normal global encounter Reaction budget and precise turn/trigger provenance still require the future encounter adapter or GM adjudication.
- Added dedicated Conduit controls, source damage/grant IDs, saved outcomes and the damage-bound Reaction checkbox. Added 17 backend behavior/transaction tests and a frontend render test.

### Iron Covenant

- Covenant of Steel binds a currently held owned Shield for exactly one minute. Bulwark adds one actual derived Guard. Release ends the effect permanently, including commands, preset application and the existing equipment-update route; reholding the Shield does not restore the benefit.
- Sentinel has a distinct Reaction handler for one other ally within five feet, requires live Steel on the held Shield and a unique attack event, and records Disadvantage declared before the roll. Sight, distance and available Reaction remain confirmed table facts.
- Aura of Resolve projects its forced-movement/Prone save Advantage with a ten-foot radius, thirty at eighteen, and turns off with Aura of Protection on Incapacitation. Geometry and applying the projected aura to other creatures' saves remain GM-adjudicated.
- Unyielding Standard has its own one-minute activation. Its physical Resistance feeds the shared damage pipeline, and enemy forced-movement prevention is projected. An explicit ally-start-turn grant operation validates the active conscious aura, target/event/turn uniqueness, minimum-one Spirit temporary Health and native atomic recipient updates. The effect is not automatically propagated to all characters on a virtual map.
- The existing fifth-level-slot restoration restores only a spent use without activation. Wardens cannot perform that Bonus Action restoration while Incapacitated; it also ends action-sensitive effects through the common action helper.
- Added held-Shield/Sentinel/Standard controls, aura availability and saved Reaction results. Added ten Covenant behavior tests, one native-recipient transaction test and one frontend render test.

### Latest verification

- Backend full suite: **370 passed, 0 failed, 1 explicitly gated Mongo skip** (371 total).
- Frontend full suite: **89 passed, 0 failed**. Both full ESLint checks and tracked whitespace checks passed. Production build passed: 126 modules; JS 455.31 kB / 134.77 kB gzip; CSS 22.85 kB / 5.05 kB gzip.
- Actual memory-only browser: level-18 Blood Price lost 12 Health and rolled three dice; chosen self Shelter saved its metadata; damage-bound Unbroken Current saved one Health and eighteen temporary Health, retained after page reload. Level-20 Covenant held-Shield Guard changed 14 to 15; release ended Steel and returned Guard to 12. Standard activated and saved a one-point ally temporary-Health grant. Covenant sheet at 320 pixels had page width equal to client width (305 pixels after the vertical scrollbar).
- These focused browser flows do not establish full creator-to-level-twenty, all-theme, keyboard, unrelated-site or native Mongo acceptance. Phase 2 remains incomplete, tabletopReady false.

Next implementation targets: remaining original Warden/other Path clauses and conditional interactions; campaign GM/milestone authority; inventory/folio/copper workflows. The source-event receipt queries are owner/character-scoped; broader audit indexing/performance, complete encounter provenance and final old-route cleanup remain acceptance work. Preserve all new source metadata when extending target or rest handling.

## Rate-limit recovery: Warden, authority, copper, folios and Reavers - 2026-11-07 (America/Chicago)

Continued in the existing repositories; no reset, MongoDB write/connection, commit, push or deployment. This section supersedes earlier backlog entries only for the operations described below. Phase 2 remains incomplete and tabletopReady false.

Implemented since the prior checkpoint:

- Oath of the Free Port: Break the Chain validates willing/visible targets, specific Grappled/Restrained source, magical Spirit check with default DC 15, and Liberty movement or Refuge temporary Health. No Captive Left records a source-bound failed-save reroll at exactly five Lay On Hands, never healing. Open Harbor has a ten-minute effect and conditional aura projection. Lantern Vigil has explicit light activation, once-per-owner-turn equipped-weapon hit scaling, declared Undead healing-prevention result, source-specific Watchfire cure, one-minute Dawn and per-Undead-turn Radiant outcomes. New activation cannot reset Watch's same-turn rider. World geometry, enemy damage and healing prevention are GM-adjudicated; no VTT target automation is claimed. Nine new behavior tests.
- Added source-specific condition removal to shared vitality handling. Other sources of the same condition remain active when only one is removed. WardenPathControls exposes source/failed-save/time/weapon inputs and aura limits.
- Campaign authority now reads the actual campaign owner/player/character registration. Linked characters require a recorded GM milestone to advance. Only the character owner commits advancement; the GM can authorize its next level and review the linked character. GM-only Inspiration, scene changes, catalog/copper awards, sales and spell discoveries enforce roles on the server. Solo owners retain GM/advancement control. Receipts store actor and role separately from character owner. The old advancement route rejects campaign commits; read/audit routes allow the registered campaign GM. Added seven role/transaction/retry tests. Campaign CRUD/join/character-association routes do not currently exist in this repository; this integrates with the existing campaign model without inventing or overwriting campaign data. Actual campaign/browser integration remains unverified.
- Cut persisted currency over to safe nonnegative integer goldCp throughout creation, purchases, awards, transcription, Gentle Repose, model validation and sheet display. Static source package prices remain GP inputs, converted once when issued. No compatibility conversion or database migration was performed: older experimental GP-only records require recreation. Removed unchecked goldDelta from the old equipment helper.
- During that cutover, a PowerShell nested-array mistake damaged commands.js and PersistentEquipment.jsx. It was detected immediately. Commands were recovered from the exact damaged input by restoring the quote delimiters and validating syntax/lint; the frontend source was recovered using the last verified compiled component's token dictionary, with no ambiguous replacements. The complete regression suite subsequently passed. No pre-existing source was reset from HEAD. Two temporary recovery scripts in the project parent can be removed after final verification; damaged-input copies are in TEMP for forensic recovery only.
- Folio operations: GM-recorded discoveries, exact 50 GP/two-hours-per-level copy, world-clock advancement, atomic cost/time rejection, lost-book availability, prepared-memory preservation, 10 GP/one-hour-per-level recovery of currently prepared lost spells, and Mastery/Signature retention. Lost unprepared rituals cannot be read. Rebuild does not restore forgotten spells. The old free-form copyFolio route is disabled in favor of receipted spells.copy. Source IDs are GM-approved table/document references; spell-scroll inventory identity/consumption is still outstanding. Five folio tests and one cross-role copy/retry test pass. FolioControls and source-discovery GM controls are integrated with the normal sheet; JSON/database editing is not required. Audit/rest/advancement edge cases after loss still need broader acceptance.
- GM-authorized sales validate owned quantity, exact integer proceeds, explicit unequip, overflow and schema. Equipment/preset references cannot dangle; missing sold preset instances reject application. Three sale tests pass. Catalog magic-item/scroll profiles and attunement remain unfinished.
- Character API error middleware now preserves code/fieldPath and currentRevision, uses 422 for character validation, and keeps unrelated endpoint behavior unchanged. Client request errors carry these fields. Three error-contract tests pass; complete per-field focus/browser recovery still needs acceptance.
- Reaver handlers added for Thunderhide leap/landing, per-Rage Walking Storm and enemy-turn pulses, melee retaliation, Rage hit riders; Chainbreaker ally Athletics escape, Rally and None Shall Kneel; Colossus self temporary Health, scaled Deckshaker and Reef Skin suppression. Native Rally/escape/condition operations use shared recipient transactions. Derived conditional Resistance, rescuer benefits, effective size/carrying, reach and speed/reduction suppression are projected. Rage reactivation replaces the prior Rage instance rather than stacking it. World movement/target geometry and enemy damage remain table-confirmed. Nine focused Reaver tests are being verified; two initial test failures came from fixtures starting Rage before the owner turn and have been corrected to start the turn before spending the Bonus Action.

Last completed full run before the latest Reaver/error additions: **394 backend passed, 0 failed, 1 gated Mongo skip; 92 frontend passed**. Full runs after the copper recovery passed (385 backend before the additional folio/sale suites), so the recovery is verified. New focused folio/authority tests: twelve passed; sales/error tests: six passed. Latest Reaver and frontend reruns are in the current session output and will be appended to phase2-checklist.md after completion. No actual browser verification was done for this rate-limit continuation yet.

Remaining priorities: finish the Reaver verification; explicit Iron Suppressor/Brass Outrider, Starwake/Mangrove, Memory Echo/Tempest and remaining passive/base Calling clauses; character rebuild proposal/GM consent/commit; attunement and scroll identities/gear utilization; complete field-error UX and all-origin/Path/browser/real-Mongo acceptance; final obsolete route/module cleanup only after replacement acceptance. Do not treat removing a generic handler as proof every passive clause is executable. Preserve the MongoDB restriction.

### Latest verified continuation results - 2026-11-07 (America/Chicago)

- Full backend: **406 passed, 0 failed, 1 gated Mongo skip** (407 total). Full frontend: **93 passed, 0 failed**. Both full lint and tracked whitespace checks passed. Build: 130 modules, JS 473.52 kB / 138.54 kB gzip; CSS 22.85 kB / 5.05 kB gzip.
- All ten Reaver behavior tests pass. The start-turn/Rage test ordering is corrected, not the Rage expiry rule relaxed. The full run includes the added once-per-turn weapon-rider case. Reaver UI has an additional render test.
- Actual memory-only browser: solo GM award and recorded Magic Missile discovery; spells.copy deducted exactly 5000 cp and recorded sufficient elapsed time; folio.lose retained six prepared memories, removed all available book contents and left the unprepared copied spell out of the reconstruction choices; reload retained this state. This browser run did not execute a rebuild. Native datetime-local changes needed keyboard change/blur events during automation; the saved fields/results were inspected. No database connection was used.
- Folio/authority tests pass twelve cases, including role-separated discovery/copy and identical receipt retry without a second payment. New frontend render tests cover GM/player controls, Warden source/reroll controls and folio time/source inputs.
- GM-approved sales are now implemented in authority.js and the sheet GM panel: owned stack quantities, total integer-copper proceeds, explicit unequip and preset invalidation, with three passing tests. General character error code/fieldPath/currentRevision transport has three passing tests. These additions supersede the earlier outstanding-sales/error-transport entries; complete field-focus UX and all browser scenarios remain pending.
- Temporary recovery/cutover scripts in the project parent were removed after successful verification. The original recovery snapshot and normative documents were preserved.

Do not rebuild these completed stages after another interruption. Next code targets remain the six Path groups named above, remaining clause parity, character rebuild consent/commit, magic-item attunement/scroll identities and consumable rules. Current role rules depend on existing campaign model associations; actual campaign management UI/server integration is still not accepted. The percentage reported to the user before resuming was approximately 78%, an estimate of total work including acceptance/cleanup, not a measured feature-clause fraction. Keep stage/ready flags truthful.

## Continuation: remaining six Path groups, rebuild and magic inventory - 2026-11-08 UTC

Continued in the actual repositories. No MongoDB connection, write, reset, commit, push or deployment. This supersedes the six generic paid-action backlog entries above; it does not establish full passive/base-clause parity or final acceptance.

- Navigator typed operations now implement Passage (other allies, one-minute Concentration, upgraded movement speeds), source-bound Converging Routes, distinct supporting Homeward destinations and Passage ending; Mangrove own-Mark hit/level-scaled Piercing, Snare save/end timing or real cover Hide check, Patient Predator trigger and Vanish half damage/provoking movement/Hide. Dedicated controls and saved outcomes added. Six focused behavior tests passed.
- Memory Echo has free own-turn one-creature telepathy separate from its paid save Reaction, recorded Enchantment-cast/target Recalled Pattern, capped one-hour Concentration Shared Recollection, and unresolved-save Unwritten Self with one source-specific condition removal. Tempest has latest same-turn casting-bound Pulse, Eye passenger validation, next-spell same-turn conversion with forfeiture/expiry, single-roll once-per-turn damage and live one-minute immunity/Resistance/flight. Saved castings now include turn and target IDs. Dedicated controls added; nine focused tests passed.
- Iron Suppressor has scaled Suppression dice, secondary control without secondary damage, Resolve DC, no mastery stacking, real-ammunition Crossing Denied and its prohibited Suppression attack IDs, Corridor restoration/DC expiry, conditional ranged cover based on recorded movement. Brass Outrider has own-turn Recoil without voluntary Speed credit, mount mode, voluntary movement-gated Passing Shot excluding prior Recoil, half-Speed Break Pursuit, Horizon single attack/ammunition and movement rather than extra Action. Added movement.record, dedicated controls and seven tests. These recorded world/trigger facts remain GM-adjudicated.
- Full regression after those Path groups: **429 backend passed, 0 failed, 1 gated Mongo skip; 96 frontend passed**. Both full lints passed at that point. Later changes below have focused verification; repeat full tests/build after integrating them.
- Rebuild backend: partial draft previews; same-level complete proposed ledger; reason and fingerprint; exact registered-GM approval for campaign characters; owner commit; stale mechanical changes invalidate approval. Resource consequence preview ends temporary effects/Health/created slots, preserves expenditure, never heals, starts new pools empty and never issues new equipment/copper. Six focused tests and eight authority transaction-double tests pass. RebuildControls uses ordinary point-buy/origin/background/custom/Calling/level choices with RequiredChoice rather than JSON editing; all consequences and proposed RulesSummary are shown. GM review gets the same proposal. Actual browser acceptance is pending; also audit altered feat source keys, lost-folio transitions, reduced attunement eligibility and all cross-Calling consequences before marking complete.
- Magic inventory: exact SRD 5.2.1 profiles for Cloak/Ring of Protection, Manta Ray cloak, three War Mage wand variants and identified Spell Scrolls. Profiles carry official PDF/page attribution and cannot be freely purchased or forged through award payloads. Attunement uses a full Short Rest, ordinary three/Reef Knife four limit, distinct profiles and spellcaster prerequisites; worn/held gating feeds real Guard, saves, spell attacks, Half Cover and swimming/breathing projection. This is a limited explicit profile catalog, not every SRD magic item.
- Scrolls bind an owned instance to a registered spell; normal casting-time completion, spell-list/higher-level checks and Reef Knife Arcana exception; no slots or Material components, normal other components/armor/Rage checks, fixed scroll DC/attack and saved casting/Concentration. Copying an owned scroll uses exact identity, ordinary time/copper, real Wit (Arcana) check, destroys the instance on either outcome and copies only on success. MagicItemControls, GM scroll award identity and held-wand loadout support are integrated. Nine focused magic tests pass. Latest focused frontend suite: **34 passed** (whole frontend includes other files); full lint/build/new all-suite run still needed.

Outstanding immediate checks: magic profile variant duplicate attunement, worn-item sale explicit unequip, automatic prerequisite loss/rebuild consequences, conditional heavy-armor flight/speed, item charges/dawn and broader Utilize workflows. Remaining full acceptance includes every passive/base clause, source replacement edges, field-focus/conflict draft recovery, all origins/Paths and representative browser creator-to-20 flows at both themes/widths, unrelated-site regression, real Mongo gate (requires user authorization) and final obsolete alias cleanup. Keep tabletopReady false. No new browser session has yet run in this continuation.

## Rate-limit recovery and verified acceptance progress - 2026-11-08 UTC

Recovered the interrupted full runs: backend **499 passed, zero failed, one gated Mongo skip (500 total)**; frontend **101 passed, zero failed**. These counts precede the additional attack/scroll/rebuild tests below. No database connections, writes, reset, commit, push or deployment were made.

Completed since the previous checkpoint (do not reconstruct these stages):
- Charged Magic Missile/Fireball wands: actual charge spending, Reef Knife preservation, last-charge destruction, GM-only monotonic dawn recovery; ordinary rests do not refill. Magic tests cover limits, ownership, source casting and equipment-aware movement. Heavy armor and Exhaustion now adjust granted Speeds once; all projected movement modes are finite.
- Source-bound damage riders for Radiant Strikes, Doctor Divine Strike/Potent Spellcasting/vitality, Omen affinity, Powder Saint Potent Cantrip and Empowered Evocation. Sculpt Spells records capped eligible other targets. Castings retain usedSlot separately from spentSlot so slot preservation cannot erase slot-based triggers.
- Source-bound spell.heal supports nine explicit healing profiles, actual dice/maximum dice, native-recipient atomic healing, Sanctuary bonuses, Prayer recipient Long Rest lockout, Mass Heal allocations and Regenerate turn ticks. Preserve Life has real allocations and Bloodied/half-maximum caps. Dead/invalid recipients roll back native transactions.
- Cunning Action, Hide, Steady Aim, Fast Hands, Gray Net Superior Defense and Storm Broker damage-instance Resistance now have typed controls. Base passives include Reliable Talent, Evasion, Danger Sense, Indomitable Might, Deadeye death saves/rally, Mindless Rage and conscious Warden condition immunity. This does not establish every passive clause.
- Mundane object controls handle thrown Acid/Fire/Holy Water/Net, bearings/caltrops/trap deployment and timed retrieval, Antitoxin, healing potion, healer-kit charges, torches/candles, Oil throwing/spilling/fueling, extinguishing and remaining-fuel relighting. Native potion/stabilization transactions are tested. Other ordinary gear still uses its printed description; Basic Poison remains a concrete persistent-effect backlog item.
- Starting purchases use canonical prices, both starting balances, issued instances and idempotent creator request bodies. Invalid basket rows retain structured field paths. No preview spends saved money.
- Command errors focus their relevant fields or alert and open enclosing details. Revision-conflict refresh preserves identity/rebuild/preparation/folio drafts. Browser two-tab test verified actual 409, refresh retaining unsaved name, retry, and reload persistence. Stable React keys replace colliding numeric sibling keys.
- Actual memory-only browser verified rebuild Path change with no free new pool, cloak wear/attunement Short Rest and persistent save bonus, then blank ten-step Corsair creation with a paid Dagger. Review and saved sheet retained **10800 copper**, purchased Dagger and background possessions after reload. On this saved sheet horizontal document width equaled viewport width at 320/768/1440 in both configured themes. These are representative checks, not all-Path/all-theme visual acceptance.

Additional recovery fixes after the full runs:
- Tempest conversion now records forfeiture from whether an eligible opposite damage type existed before conversion; ten focused caster-Path tests pass.
- New attack.record and sheet controls track first-attack Reckless decision, incoming/outgoing Advantage through next turn start, target-specific Studied Attacks consumption/renewal/next-turn expiry, Steady Aim consumption, Hide ending, Rage extension and duplicate attack rejection. Four behavior tests pass. Shared damage-rider integration and off-turn attack records still need audit.
- Priced cantrip/level-one scroll entries are purchase options only. Purchase requires exact registered spell of the specified level and issues individual canonical identified spell-scroll instances at the printed price. Direct issue/storage of unidentified placeholder entries is rejected; GM awards use the identified scroll entry. Both creator and sheet have spell selectors. Four creation-purchase tests pass. Magic-item suite passed its nineteen cases in the combined run; that run initially failed the new purchase fixture because it used package copper, corrected to select starting gold before buying two scrolls.
- Rebuild previews automatic attunement loss when its spellcaster prerequisite disappears, ends it only on commit and retains the item. Reduced four-to-three limit still requires ending an attunement before rebuilding rather than silently discarding one. Seven rebuild tests pass; combined rebuild/purchase run eleven passed.

Remaining acceptance: complete per-clause audit (246 features), conditional hit/mastery/source replacement and lost-folio edges, Basic Poison/remaining persistent consumables, full responsive/keyboard/browser level-one-to-twenty martial/caster/complex-Path flows, actual campaign association integration, gated real-Mongo transaction/restart acceptance, then final obsolete active alias cleanup. Keep tabletopReady false. Last percentage was approximately 85%, an estimate rather than measured clause coverage.

### Further rule and browser acceptance - 2026-11-08 UTC

- Broad backend run after attack/scroll/attunement/Gray Net additions: **513 passed, zero failed, one gated Mongo skip (514 total)**. The prior broad run exposed a real one-millisecond strike-duration discrepancy; strikeOperations now uses one captured createdAt for both timestamps. Subsequent focused run covers newer Reaver/rebuild changes: **44 passed**, and later changed strike logic still needs the final regression rerun. Frontend **102 passed**, full lint passed, build passed (142 modules, JS 536.54 kB / 152.71 gzip; CSS 22.85 kB / 5.05 gzip). Bundle warning exceeds 500 kB and remains visible; no readiness claim from the build.
- Basic Poison now consumes one vial, coats an owned weapon or up to three ammunition pieces, expires in one minute, rolls d4 Poison on an eligible Piercing/Slashing hit and expends a coating once. Ammo misses consume their coated piece without damage; a weapon miss preserves its coating. UI exposes source object/coating and hit outcome. Latest ammo-miss addition needs its focused verification. Ordinary ammo expenditure is separate and explained.
- Gray Net Colossus Slayer validates selected option/missing Health, once-per-turn damage and critical dice. Horde Breaker checks owner turn/different not-yet-attacked target and spends real matching ammunition for a same-weapon extra attack; Multiattack Defense records incoming attacker and triggering-turn expiry. Escape the Horde is projected. Three behavior tests pass. A discovered ammunition classification bug is fixed: weapons sharing ammunitionType cannot themselves serve as ammunition. Native fire and sheet ammunition options reject such entries; regression test passes.
- attack.record now supports confirmed external-turn attacks, globally bounded duplicate IDs, and target-specific Studied Attacks renewal/consumption. Bloodwake Frenzy rolls scaled critical dice for the first eligible Might hit while Raging/Reckless, once per owner turn; six attack-record tests pass. Brutal Strike now records the required Reckless effect if chosen on the first attack rather than leaving the incoming-Advantage consequence absent. Bloodwake Retaliation has a source-bound melee/Unarmed Reaction with unique trigger; Presence has exact Might-based Instinct DC, chosen targets, thirty-foot area and repeat-save Frightened result. Twelve Reaver-Path tests pass. Alternate Presence restoration already exists in FeatureActions; it was not duplicated.
- Rebuild lost-folio acceptance: eight rebuild tests now include an unchanged Shipwright rebuild preserving unavailable contents and refusing to restore forgotten unprepared spells. This is not every cross-Calling folio permutation.
- Creator server errors now navigate back to the relevant identity/origin/background/attribute/purchase step, preserving the draft. Test-only browser adapter uses the actual structured error middleware. Browser verified an invalid portrait URL produces fieldPath portraitUrl and focuses the exact offending input with its draft value retained; correction saves successfully.
- Browser level-20 Sparkwrite Aetherist: expanded spell list and Twin Circuit rules retain no horizontal document overflow at 320/768/1440 in both themes; light-theme DOM attribute verified. Default dark mode intentionally omits the override attribute.
- Browser martial progression: seeded legal **level one**, then used actual preview/choice/commit UI for **every level through twenty** (Gunslinger/Deadeye), including mastery increases, level-three Path, all ASIs and level-seven style. Reload confirms level 20, Training Bonus +6, maximum Health 164, Deadeye, and disabled further advancement. This is not a direct level-twenty seed assertion.
- Browser caster progression: seeded legal **Tidecaller one**, then actual preview/choice/commit UI through **twenty**, Memory Echo/Memory discipline, exact cantrip/preparation/Metamagic counts and feats. Reload confirms level twenty, Training Bonus +6, maximum Health 122, Memory Echo and cap. A test choice replacing too many preparations was correctly rejected without a commit; retained preparations plus new choices then succeeded. UI improvement now preselects existing eligible preparations/cantrips during advancement and explains Tidecaller's one-replacement rule; this final improvement still needs frontend verification.
- All fourteen normative documents still match recovery SHA256 hashes. No Mongo connection, write, reset, commit, push or deployment.

Current immediate work: verify the last poison/strike/UI improvements, complex Shipwright advancement acceptance, remaining clause/source/rebuild permutations and unrelated-site checks; finish actual isolated-Mongo gate only after explicit authorization; final obsolete alias cleanup follows replacement acceptance. Phase 2 remains incomplete and tabletopReady remains false.

### Clause audit continuation and complete representative UI progression - 2026-11-08 UTC

- Completed the actual **Shipwright/Sparkwrite Aetherist level-one-to-twenty browser workflow**, including Scholar, all folio additions/preparations, Mobile relay discipline, all ASIs, Spell Mastery (one first-level and one second-level Action spell), Signature Spells and the cap. Reload retained level twenty, maximum Health 122, Training Bonus +6 and Path. The first longer automation call timed out; resumed the existing tab and its saved records, with smaller batches and explicit pending-request checks. Do not restart this test from zero.
- Latest broad backend before subsequent clause fixes: **516 passed, zero failed, one gated real-Mongo skip (517 total)**; full lint/whitespace checks passed. Frontend latest broad: **102 passed**, full lint passed and build passed (142 modules, JS 538.12 kB / 153.17 gzip, CSS 22.85 kB / 5.05 gzip). The build warning above 500 kB remains. Latest changes below have focused suites in progress and need one final broad check.
- Relentless Hunter at Navigator thirteen now excludes Hunter's Mark from damage Concentration saves, retaining normal Incapacitated ending. Hunter Mark source-bound per-hit Force damage, critical dice, Foe Slayer d10 and source-preserving target transfer after zero Health are implemented. Three new rider tests pass (nine rider tests total then). Mark transfer retains duration/Concentration and spends no new slot/use. Mark higher-slot durations are now explicitly one/eight/twenty-four hours. Superior Gray Net prey requires the same actual recorded primary Mark damage event and another visible target, once per turn; target/source metadata is saved in the rider journal. Gray Net Lore identifies its marked target for GM immunity/resistance/vulnerability information.
- Dragon Companion was a resource without a cast source. Added its one-use free Summon Dragon source, level-eighteen prerequisites, waived Material components on free AND slot casts, optional non-Concentration one-minute form (existing Concentration retained), normal versus extended duration and sheet controls. Summon Dragon was already an automatic Omen spell at nine; no duplicate grant. Two focused tests pass.
- Leviathan Smite of Protection now records Half Cover within the conscious aura through next owner-turn start. Sacred Weapon validates a held Melee instance/Attack action, replaces the previous instance, adds the actual Spirit attack bonus (minimum one), permits normal/Radiant damage per hit, records its light/duration and ends when the weapon is no longer carried. Holy Nimbus has sunlight/aura/save-Advantage projection and source-bound per-enemy-turn Radiant pulses. Alternate fifth-level-slot restoration already existed. Two focused Sacred/Nimbus tests pass after fixing an initial NaN caused by reading Spirit from a weapon-only modifier map; current derived bonus uses the full Calling attribute modifier.
- Storm Broker zones now have typed fog/crosswind/surge metadata, capped visible Borrowed Squall exemptions, exact range/radius/expiry and replacement. Captain's Credit is source-bound to an active Squall, one visible other ally's successful attack/save and once per own turn, with native temporary Health grants. Dedicated sheet controls replace inert generic Squall buttons. Focused test passes.
- Contract discrepancy recorded for final review: abilities.md Captain's Credit explicitly says **once on each of your turns**; acceptance-tests.md's example says **off your turn / one per round**. Implementation follows the specific ability text without altering either normative file. This discrepancy must be disclosed/resolved before full contractual acceptance.
- Initiative now actually rolls two dice for Advantage rather than merely displaying the flag. Reef Knife seventeen stores the second first-round turn's -10 offset, displayed against the saved current Initiative (compatible with later Alert swaps). One focused test passes.
- Fast Hands Bonus Action charged-item activation is now selectable in MagicItemControls, matching the already-tested server rule.
- Plaguewarden Inoculated: added innate Poisoned-save Advantage projection and a source-bound post-spell-healing grant to one recorded recipient, one hour/next save only, with native-recipient transaction handling and a clear instruction to end the saved effect after that save. The source requires an actual recorded spell healing event, not just an invented casting ID. New native transaction/retry test is running. This table-adjudicated save-consumption workflow must not be described as automatic target save resolution.

Current running focused suites: backend native Doctor + remaining Path clauses + riders, frontend phase2 render suite and lint. No Mongo connection, write, reset, commit, push or deployment. Docker executable exists; mongod executable was not found on PATH. Do not start/connect to Mongo without explicit authorization. Keep tabletopReady false until remaining independent clause/source acceptance, contract discrepancy, isolated database gate and final cleanup are resolved.

## Approved timing, persistence cutover and route cleanup - 2026-11-08 (America/Chicago)

User decision is now explicit: **Captain's Credit triggers off turn, once per combat round**. The user requested the mechanical comparison, reviewed it, then chose the off-turn recommendation. phase2-decisions.md records this override without modifying the fourteen historical baseline files. canonicalRules.json's live feature text and handler now follow the approved rule. Credit requires saved Initiative/combat identity, a confirmed external turn and integer round, an active Squall, one other eligible ally and a stable success event. Duplicate round, reused success and backward round submissions reject atomically. This supersedes the unresolved timing discrepancy and own-turn implementation notes above.

Latest completed broad backend before the route cleanup: **528 passed, zero failed, one gated real-Mongo skip (529 total)**. New clause/native-recipient/rider focused run: **33 passed**. Frontend: **102 passed**, full lint and build passed (143 modules; JS 543.92 kB / 154.57 gzip, CSS 22.85 kB / 5.05 gzip). Current final full suites after route/resource cleanup are running. One newly added resource test initially reused its already-receipted operation ID for a different invalid payload and correctly received 409; the fixture now uses a distinct ID to test the intended 422 validation. Do not weaken idempotency to satisfy that old fixture.

Completed persistence cleanup:
- Manual pool/slot expenditure and Initiative recovery now use receipted resource.adjust; conversions and alternate-cost restoration use resource.convert. Initiative recovery requires an actual saved combat Initiative and cannot repeat for the pool in that combat. UI restoration/spending no longer writes via the old unreceipted resource endpoint. Rest preparations still enter the validated rest planner.
- Removed old persistent character /rules-2024 create/read/advance/resources/folio/equipment aliases and direct narrative PATCH route; removed their obsolete handler bodies and unreceipted write helper. Canonical reads/creation and receipted commands remain. Advancement preview is the owner-scoped read-only POST /:characterId/preview.
- The rules preview page no longer has its obsolete persistent-save branch; it links to the ten-step creator. It remains a temporary canonical-rules exploration page. Updated the memory-only adapter and HTTP ownership/removed-route tests to match.
- Initial deleted states remain preserved: frontend 95 and backend 37, with zero unexpectedly restored files. Thirty-one recovered frontend map/campaign/session/lore/reputation/asset/achievement files match their original hashes exactly.

Actual memory-only browser acceptance after the cleanup:
- Captain's Credit on own turn rejects; ending owner turn permits one four-temporary-Health grant to a table ally; a different success on the same round rejects. Reload and saved history show exactly one accepted credit command; rejected commands add no revision/receipt.
- Manual Favored Enemy spending changed four to three using resource.adjust and appeared in saved command history. Reload retained three. Canonical next-level preview showed level twelve, cancellation left saved level eleven and no extra revision. No obsolete mutation URL was used.
- Stopped the memory-only harness after verification. No Mongo connection/write/reset, commit, push or deployment occurred.

Acceptance gate: original phase-one scope line 71 says do not modify MongoDB without explicit authorization. The real-Mongo test has not been authorized and remains skipped; configured databases have not been touched. Docker is installed but its daemon is not running (Linux-engine pipe absent); mongod is not on PATH. A fresh isolated local replica-set database is the intended test target, never the configured application database. Full independent acceptance and remaining campaign/server-restart/database review are still required; do not declare Phase 2 complete or tabletopReady true based on passing model doubles/browser fixtures alone.

### Removed-handler fixture migration - 2026-11-08 (America/Chicago)

The first final cleanup run passed 493 backend tests but failed 37 older tests because their model doubles still called removed handlers dynamically. Those failures were not accepted or hidden. Updated the complete 32-Path persistent advancement fixture to use the actual receipted command handler with sessions, compare-and-set and receipt storage; reload comparisons exclude the response-only operationResult. Identity no-op edits now correctly create an auditable revision, and forged typed payloads expect 422. Updated equipment ownership/race fixtures to use equipment.equip commands. The focused matrix/equipment run now passes **54 tests**, covering every Path through twenty and every Calling's model validation. The final whole backend suite is running again after these test migrations. Final frontend remains **102 passed**, lint/build passed (143 modules; JS 543.14 kB / 154.35 gzip).

The gated real-Mongo acceptance test is prepared with actual multi-document native Triage success and dead-target rollback assertions: Health, source runtime/kit, document revisions, treatment-lock insert and command receipt. It has not been run or connected. This supplements existing owner isolation, idempotency/conflict, all-level HTTP and reconnect checks. A full Node-process restart and campaign association acceptance remain separate review items; do not call disconnect/reconnect a completed process-restart test.

No Mongo writes/connections, commits, pushes or deployments. The Docker daemon remains stopped; real database writes still require explicit authorization under character-rebuild-phase1.md line 71. Memory-only harness is stopped. The approved Captain Credit decision and latest source/route changes are saved in the actual repositories.

### Final local verification after persistence cleanup - 2026-11-08 (America/Chicago)

- Whole backend suite: **530 passed, zero failed, one gated real-Mongo skip (531 total)**, 134 seconds. Both modified legacy fixtures now exercise receipted commands and the full roster matrix succeeds. Backend full ESLint and tracked whitespace checks passed.
- Whole frontend suite: **102 passed, zero failed**. Full ESLint, tracked whitespace check and production build passed: 143 modules, JS 543.14 kB / 154.35 kB gzip, CSS 22.85 kB / 5.05 kB gzip. Bundle-size warning remains; no build failure was hidden.
- Fourteen historical normative documents still match recovery SHA256; Captain Credit's approved override is in phase2-decisions.md and live canonicalRules.json. Nineteen unrelated backend campaign/session/lore/reputation/asset/project/bug/auth/user source files match recovery hashes, in addition to the 31 frontend files previously checked. All initial 95/37 deletions remain deleted.
- The final source is saved directly in both actual repositories. Memory-only browser harness is stopped. No configured or other MongoDB connection/write/reset, commit, push or deployment.

NEXT REQUIRED AUTHORIZATION: ask the user whether Docker may be started and a fresh isolated local MongoDB replica-set test instance created for the prepared acceptance suite. The original scope explicitly prohibits modifying MongoDB without authorization. Do not treat another generic continue as explicit database authorization. Intended endpoint is loopback-only 127.0.0.1:37027, fresh sa_phase2_ database, not configured application data. Docker executable exists but its engine is stopped; mongod is not on PATH. No database acceptance has passed yet. After authorization, carry out real native-recipient transaction rollback, idempotency/ownership/concurrency, process restart/reload, strict schema/rules-version and campaign association acceptance, repair issues, and complete final independent clause/source review before readiness. tabletopReady remains false and Phase 2 remains incomplete.

## Docker authorization and environment startup block - 2026-11-08 (America/Chicago)

The user explicitly authorized Docker Desktop, a dedicated disposable MongoDB container/database, the full integration suite, repair of failures, reproducible setup and scoped container/volume cleanup. Existing Atlas/application data remain forbidden. Do NOT ask for this authorization again after interruption. Continue Phase 2 after database validation.

Attempted normal launch of the existing Docker Desktop executable with Start-Process and WindowStyle Hidden. No Docker process remained running; the Linux-engine named pipe is absent. docker desktop status reported access denied creating its application logs under C:\Users\Romain\AppData\Local\Docker\log\host. The permitted execution environment cannot write that application directory. Native Windows app-control initialization also failed: failed to launch codex app-server: program not found. Do not change filesystem/security permissions or attempt an elevation bypass. User must open Docker Desktop normally outside the restricted execution process and wait for its Linux engine to run. This is an environment startup block, not missing database authorization.

Prepared reproducible runner crossworld_backend/tests/support/run-phase2-mongo.ps1 and PHASE2_MONGO.md. Syntax parser passes. Runner uses official mongo:8.0 (accepts printed digest for exact reruns), a unique replica set/database/container and two unique labeled data/config volumes, loopback-only port 37027, guarded test URI, the whole backend suite, environment restoration and finally cleanup restricted to exact matching names/ownership labels. No global prune or unrelated Docker actions. This runner has not executed against Docker yet; do not claim database tests or cleanup ran. No test container/volume/database was created during this failed startup attempt. Next: once the user starts Desktop, run the prepared runner, diagnose/fix any real integration failures, complete process-restart/campaign acceptance and remaining full Phase 2 scope. Keep readiness false.

## Continued implementation and database deferral - 2026-11-08

Supersedes the startup instructions above: the user opened Docker Desktop; its Linux-engine named pipe now exists but this execution session receives permission denied accessing it. Authorization was already granted and must not be requested again. Do not bypass pipe/security restrictions. Per the user's subsequent preference, defer Docker troubleshooting and continue character implementation. No actual test container, volume or database was created; no Atlas/application data were touched. The runner's offline mock verified its scoped resource cleanup and guarded test URI, not actual MongoDB behavior.

Independent clause review found three passive tool benefits missing from saved checks. Added GM-confirmed task context: Cinder Artillerist Safe Handling grants inspection Advantage from seven; Breakwater Reinforced Anchorage grants reinforcement Advantage from six; Drydock Ghost Ghost Patch adds minimum-one Wit once per confirmed turn for its selected trade, with saved/reloaded turn journal and no Ghost Work expenditure. Tool UI and result messages now expose these benefits. Eight focused backend tool-check tests pass, including unlock boundaries, cancellation, repeat-turn/reload and rejected-operation immutability.

Sheet-roll review found bare attribute checks omitted Exhaustion and Poisoned did not impose check Disadvantage. Centralized sheet roll circumstances, preserving already-penalized skills/saves and Primal Knowledge's single penalty. Restrained Agility-save Disadvantage cancels Danger Sense correctly. Safe Handling and active Unmask the False have explicit GM-confirmed check-task selectors; they never grant save Advantage. Frontend full suite now passes 105 tests. Backend full suite and final build/checks are being completed.

Expanded the gated real-Mongo acceptance test with disposable campaign GM/owner/outsider milestone checks, rules-version and strict-schema rejection, plus a fresh Node-process authenticated HTTP reload probe after stopping the original server and disconnecting its client. These additions are prepared, not executed against a database. Real-Mongo validation and independent clause review remain incomplete; tabletopReady stays false. Do not treat roster counts or current passing local tests as full acceptance.

### Additional clause fixes and final verification

- Thunderhide/Chainbreaker Path hits now accept a GM-confirmed Might attack with a finesse melee weapon even when Agility is its higher default. Eligibility checks allowed attributes rather than the suggested best attribute. Both Paths are tested; ranged rejection preserves state.
- Petrified now unions its Poison immunity with existing damage immunities, grants Poisoned immunity and suppresses an existing poison source without deleting it. That source resumes on removal of Petrified. Actual Living Tempest plus petrification, attempted new poison and source preservation are tested; focused vitality/caster suite 23 passed.
- Barometer Instinct now applies to tool and sheet checks through explicit weather/signals task context, only for the chosen discipline and the required Instinct/Wit attribute. Saves never receive the task benefit. Latest nine-test tool suite passes; the additional Barometer test was added after the final whole-backend run began, so it is covered by that focused run rather than included in its count.
- Whole backend: **535 passed, zero failed, one gated real-Mongo skip (536 total)**. Latest focused tools: **9 passed, zero failed**. Whole frontend: **106 passed, zero failed**. Both full lint checks plus latest backend tool-file lint pass; tracked whitespace checks pass.
- Latest production build: 143 modules, JS 546.00 kB / 155.17 kB gzip, CSS 22.85 kB / 5.05 kB gzip. Existing >500 kB chunk warning remains. Fourteen normative source hashes still match recovery baseline.
- No Docker troubleshooting retried, no database resources created, no Atlas/application data touched, no commit/push/deploy. All changes are in actual repositories. Final independent clause/source review remains unfinished, in addition to the real-database gate; do not claim 100 percent completion or readiness. Next review should include Silent Keel's per-recipient attack/cast termination and the remaining conditional passive clauses against saved operations.

## Explicit Docker troubleshooting resumed - 2026-11-08

The user explicitly requested "Figure out the docker issue", superseding the prior Docker deferral. Read-only diagnosis: Desktop and backend are running; normal engine named pipes exist; this Windows identity is already in docker-users. Both desktop-linux and default contexts reject this process with permission denied. Windows IsTokenRestricted confirms the execution token is restricted. This supports an execution-session access-boundary diagnosis; it does not prove an ordinary user terminal will succeed until that comparison runs. Docker's official permissions documentation confirms a stopped helper service can be normal with WSL 2, so no speculative service/group/config changes were made. The managed session forbids sandbox elevation requests; do not bypass it.

Updated the existing runner with transcript logs in the backend root, actionable access-denied preflight, and native-stderr capture compatible with Windows PowerShell 5.1. Real preflight reproduced access denied and created no resources. Offline mock verified full-suite arguments, dedicated URI, exactly one matching labeled container and two matching labeled volumes cleaned, and environment restoration. Syntax passed. Two mock-only transcripts removed to avoid mistaking them for real acceptance; the actual blocked preflight transcript remains phase2-mongo-0a48f7cd87504c53b05afc9ed770b8be.log.

Required external action: run the existing script in an ordinary Windows PowerShell window outside ChatGPT using `& 'C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\tests\support\run-phase2-mongo.ps1'`. LocalMachine execution policy was checked read-only and is RemoteSigned; no bypass flag is needed. The runner writes its real result to phase2-mongo-<run ID>.log for direct subsequent inspection. No database acceptance has passed, no actual container/volume/database was created here, and no Atlas/application data was accessed. Do not claim the Docker connection is repaired until the normal-terminal run succeeds.

## First real MongoDB acceptance result - 2026-11-09

The ordinary PowerShell run `a48fd8a8da784a41a4056f8f27f97ac6` completed all 537 backend tests with 536 passes, one failure and zero skips. The transcript confirms removal of its test container and both volumes. The managed session's Docker access is settled and the user will run any required rerun from their terminal.

The integration fixture selected its first prepared spell, Detect Magic, and applied its first Metamagic option, Careful Spell. Detect Magic requires no saving throw, so the API correctly rejected the cast. The fixture now names Burning Hands and Careful Spell explicitly, protects one included target, and asserts both resource costs and reload parity. Server validation is unchanged. A focused regression exercises both casts with the integration character's actual level-20 ledger. The frontend also disables Careful and Heightened for spells without a saving throw and explains why.

Focused verification passed with 13 Metamagic tests, 43 related backend acceptance tests, and 38 frontend acceptance tests. The local Metamagic invocation skipped the real MongoDB test. The corrected real MongoDB run is pending, including the transaction rollback, campaign and restart checks after the failed cast. Phase 2 remains open.

## MongoDB integration validation passed - 2026-11-09

Run `67aeab9f0f2d458491a2ddfad87eb68f` passed all 538 backend tests with zero failures and zero skips. The saved transcript confirms the real MongoDB HTTP workflow passed, including the corrected Careful Spell cast, transaction rollback, campaign permissions, and fresh-process reload. It records cleanup of the isolated container and both volumes. This supersedes the earlier MongoDB pending or blocked status. Phase 2 remains open for the remaining behavior and browser audit.

## Resumed final acceptance - 2026-11-09

Recovered the interrupted full rerun with 540 local backend passes, one environment-gated MongoDB skip and zero failures. The frontend had 108 passes, and both lint checks and the production build passed. That batch covered Silent Keel per-recipient termination, Ghost Patch tools and repair caps, the vehicle length limit, Field Surgeon discipline effects, and the Unmask the False expiry fix. Browser checks verified the Silent Keel lifecycle, lore map navigation and sign-out to the login screen in the local fixture. The audit compared all 14 normative documents and 56 unrelated files with the recovery baseline and found no hash differences.

The next batch requires GM-confirmed sight and touch within 5 feet for both forms of Triage and stores the completed salvage minutes with the wreck. It rejects salvage below ten minutes. Treatment selects a genuine catalog kit with sufficient charges, regardless of its custom name. It skips depleted kits and ignores other charged items named like kits. Toxicology now uses the explicit completion rule for saves against Poisoned. The sheet shows current Triage and Ghost Patch dice using the same calculation as resolution, along with kit costs and feature provenance.

Final local verification for this batch passed with 541 backend tests, one environment-gated MongoDB skip, 109 frontend tests, and zero failures. Both lint checks, tracked whitespace checks, and the Archipelago production build passed. The existing bundle-size warning remains. MongoDB integration validation remains **PASSED** based on the 538-test real run above. The new Triage payload and kit changes have local coverage.

Remaining acceptance includes the independent clause matrix, computed dice/DCs and conditional availability across the remaining ability cards, and live browser regression. The six sibling frontend builds attempted in this session stopped in Vite config loading with child-process `spawn EPERM`. They provide no runtime regression evidence. Campaign authority passed on the real API, while the pre-existing campaign create/open placeholders prevent a full campaign/session browser workflow. `tabletopReady` remains false.

## Ability and roster acceptance continuation - 2026-11-09

Preview and resolution now share the computed numbers for reviewed core actions, artillery charges, Capacitor Discharge, Deckshaker, Thunderous Landing, Walking Storm, Chainbreaker Rally, Starwake's guided hit and Rooted Ambush. The reviewed specialized controls display the relevant restrictions. The Discharge form records both allies and enemies, and the result displays its actual half damage on a successful save. Browser verification exercised relay placement and Discharge by keyboard, checked the saved targets, and confirmed relay destruction and spent uses after reload. The Sparkwrite sheet fit 320, 768 and 1440 pixels in both themes.

The 144-case origin/Calling matrix now independently asserts starting Health and save Training and verifies every origin receives all four owned Path choices at level three. All 55 printed paid-feature bindings have matching execution costs. Fifty-four are registered ability commands and Unbroken Current spends in its damage reaction. This audit confirms resource binding coverage, with per-clause targeting, timing and effect verification still open.

Ability-triggered Hide now applies Poisoned, applicable armor penalties and Advantage cancellation. Trained Corsair checks apply Reliable Talent after the die is selected. Successful Mangrove Hide attempts save the same Hidden condition as Cunning Action. Fast Hands lock and trap checks apply tool Training and combine skill and tool Training correctly.

Final local validation passed with 542 backend tests, one environment-gated MongoDB skip, 109 frontend tests and zero failures. Both lint checks, tracked whitespace checks, and the 144-module production build passed. The existing bundle-size warning remains. All 14 normative documents, 56 unrelated files, and the exact original deletion lists matched the recovery snapshot. The recorded real MongoDB gate remains **PASSED** with 538 tests and zero failures or skips.

Phase 2 remains open. Remaining acceptance includes complete per-clause checks, further specialized previews such as Suppressing Fire with Hold the Corridor active, and live browser regression. Campaign create/open placeholders and the managed-session sibling build limitation remain as documented above. `tabletopReady` stays false.
