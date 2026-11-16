# Sanguine Archipelago — Phase 3 exit audit

**PHASE 3 COMPLETE — SANGUINE ENGINE REFACTOR VERIFIED**

## Final acceptance at 0.68.0

The `rules2024` backend runtime remains retired. The completed 0.68.0 ownership review places the identified portable mechanics in the engine. The backend applies those rules to authoritative state and owns host context, authorization, clocks, randomness, effect identity, receipts, transactions and persistence. The frontend uses engine calculations and authoritative projections.

The replacement is `crossworld_backend/tests/support/rest-regression.mjs`. From the backend repository, run `node tests/support/rest-regression.mjs`. The expected count is 3,707, with SHA-256 `dfa2694a60cf8732fd9fa36bb8eaecbb71c82150b7c782347d56a24df9b0582d`. The runner compares engine decisions and backend command application against independently calculated outcomes. It covers Short and Long Rest eligibility and duration, completed hours and recovery after interruptions, Health and Hit Dice reconciliation, feature pools, spell slots, temporary and lasting effects, rest replacements, the 24-hour interval, clock boundaries, duplicate completion and invalid options. It also checks unchanged state on rejection, authoritative receipt replay and rollback after an injected receipt-write failure. SA-CHAR-1 has no dedicated Stamina or Focus recovery pool.

Two fresh runs matched the committed count and digest. Backend commit `7b58c61` contains the runner, deterministic fixture definitions, expected result and reproduction notes.

**HISTORICAL — EXACT RERUN UNAVAILABLE.** The original 2,640-observation run retains SHA-256 `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b`. The original historical 2,640-row rest matrix could not be rerun because its executable and inputs are unavailable. A new reproducible rest regression baseline was created and verified in its place.

- 90 engine, 638 backend and 115 frontend tests passed. The isolated MongoDB integration test was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. The backend suite verified historical receipt replay, typed command validation and atomic rejection. The replacement rest matrix verified atomic rollback through a fault-injected transaction fixture.
- Both lint checks, the frontend production build and 380 Node syntax checks passed. The engine and backend dependency graphs reported zero cycles. The 98-module frontend graph has no Rules2024 cycle and retains the pre-existing map editor cycle. The build retains its existing bundle-size warning.
- All 13 retained backend probes and the frontend fixed-roll probe passed and matched all 22 retained digests. The roster probe verified all eight Callings and 32 Paths through level 20. The catalogs contain 248 equipment definitions and 316 spells. The catalog hash and HTTP ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. The authenticated route test verified a matching ETag returns HTTP 304.
- Both manifests and lockfiles resolve engine 0.68.0 with the same archive integrity. The vendor archives are byte-identical with SHA-256 `442ab9c71ead444d3541f1069c0365c5983fe2cba501f1ac652319719c64b78d`. All 488 installed package files in each consumer matched its archive, including the SRD notices.
- The hit-triggered Smite damage execution decision remains deferred under Pass 35. Final run logs are in `%TEMP%/sa-accept-*.log`.

## Extraction at 0.68.0

- The engine owns the remaining damage-rider attribute and damage-type selection, Potent Cantrip's avoided damage, and the printed outcomes identified for Sear Undead, Lay On Hands and Plaguewarden poison cures, Unseen Passage, Holy Nimbus, Dawn at Sea, Vigil condition release, Deckshaker, Chainbreaker, Mangrove and Unwritten Self. Backend handlers still confirm the trigger, find the condition or effect source, roll dice, and apply the outcome to host state or its receipt.
- Both consumers use byte-identical archives with SHA-256 `442ab9c71ead444d3541f1069c0365c5983fe2cba501f1ac652319719c64b78d` and lockfile integrity `sha512-Zb9l6ZO88sh9moJD0QmyX61UTW4J27uozRnyNr6aIZlQVktL/LTZ4CT2cGg9zCK7ypzKS/bhZjTB0fPOI1wSTA==`. Both manifests, both lockfiles and the installed packages were verified against those archives.
- Final verification passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, the production build, 379 syntax checks and engine/backend dependency checks passed. All 13 retained backend probes and the 494-observation frontend fixed-roll probe matched all 22 available digests. The focused rest suite passed all eight cases. The frontend graph has no Rules2024 cycle and retains the pre-existing map editor cycle. Logs are in `%TEMP%/sa-068-*.log`.

### Final ownership review

- The advancement, projection, attack, damage, rest, equipment, spell and Calling entry points in the function table were checked against the engine counterparts through 0.68.0. The final parse-based arithmetic inventory covered 102 backend modules and 49 Rules2024 frontend files. The host operations cover world-time unit conversion, record diffs, revision and turn numbers, resolved instance keys, array indices, display formatting and die sampling. The engine supplies damage, Health, attribute, spell-slot, carrying and combat-preview formulas.
- `commands.validateEnvelope`, `commands.handler`, authority and the persistence handlers own the operation envelope, authorization, transactions, revision conflicts, historical ledgers and command receipt replay. `clock.advance` and `expire` apply engine effect terms to host clocks and saved effects. Data model and receipt schemas remain in the backend. The engine package has no direct RNG, clock, database or HTTP dependency.
- The suite, route checks and retained matrices exercise these boundaries through the actual repository entry points. Catalog counts and content hash were also checked directly against `8 Callings, 32 Paths, level 20, 248 equipment items and 316 spells`, with hash `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. At the end of extraction, closure was pending rest regression evidence. The final acceptance section records the replacement.

## Extraction at 0.67.0

- Tool check tasks, Training, Expertise, Advantages, Disadvantages and Ghost Patch qualification now use engine rules. The backend verifies the carried item, retrieves the armor fact if it applies, rolls the dice and journals the action.
- The engine owns the remaining equipment bundle quantities, starting item aliases, carried-weight totals, saved ordinary and created slot limits, and Overchannel use and roll totals. The backend still identifies equipped instances, creates inventory records and records resources and effects. The old quarterstaff fallback was unreachable because the existing alias always wins. The alias still resolves to the same Arcane Focus.
- Both consumers used byte-identical archives with SHA-256 `9848dc9ca5aa6c786c0fb315575421030b678c0288473d17e6b9a773e63c19c5` and lockfile integrity `sha512-1Kui6rsrUo+YL8YrpYqeIeNk2+KwFlW6SJoo1/3khD0qyKHhPEIO7t4dm7mDhbUvh/h+3QnqB4lhvKpbHu7q1g==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 379 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-067-*.log`.

## Extraction at 0.66.0

- The arithmetic review found and moved Seeking Spell and Relentless Rage totals, Uncanny Dodge reduction, tool and Training modifiers, Preserve Life allocation totals, and the independent immediate-use Healing Potion formula. The browser uses shared rules for the minimum-total flag and the extra Reef Knife Initiative. The host supplies modifiers and dice, records the result and spends inventory.
- Both consumers used byte-identical archives with SHA-256 `60e1d213aade26c737742fb5363a22b4e670c48e1c5e49ce9c59fc6959497823` and lockfile integrity `sha512-ukrDwkTh3UASGFkXul0UwMWVPwsu78cJyG4uS2R/9M1gVujNE3/rOP0MA9Pgu6IG6YMGg5fniMZq57HBrwulrA==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 379 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-066-*.log`.

## Extraction at 0.65.0

- The creator uses the engine's exact point-buy cost, score bounds, and background score allocation. Invalid scores block preview and now display a validation message. Ledger replay uses the engine's single-Calling and fixed-Health advancement policy.
- Validation of saved Wish cooldowns and rest-replacement admission use engine rules. The backend supplies the saved cooldown values, replacement records, rest identity and source context.
- Both consumers used byte-identical archives with SHA-256 `4fcebb72bcb24dda52147027480e182b4312d092e7501ccaf42e7a082e909ffb` and lockfile integrity `sha512-nU9Sym9HikNGMGnOI5D60TvAWllTcF6c4fXBGNIFYCAfAYVLNHf68hxJ8W/wXa69LINwtMvSt0qfCH+s5iEmFg==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-065-*.log`.

### Ownership and verification scope

The function review below and subsequent extraction entries cover advancement, runtime projections, every named Calling operation group, equipment, spell operations, attack and vitality processing, resource transitions, and the character sheet. A search for numeric thresholds found only host validation and presentation. A separate search of symbolic expressions found remaining combat totals in Seeking Spell, Relentless Rage and Uncanny Dodge, the duplicate immediate-use Healing Potion formula, and the sheet roll's minimum-total flag. These are the next ownership changes. The engine source has no direct RNG, system clock, HTTP or database access.

The backend resolves who may act, whose turn is open, which item, target, casting or effect a command refers to, and whether the named trigger has already been recorded. It owns generated IDs, timestamps, journals, mutation, transaction boundaries, authorization and receipt replay. The engine supplies the rules those adapters apply. In particular, Relay replacement selects a live host object under the engine's capacity limit, and preserved spell-grant records contain the available folio at the engine-defined advancement level. Historical receipts keep their original effect IDs and saved payloads.

The available suites exercise the active rest handlers and cover clocks, interruption recovery, prior Long Rest interval, and saved resource effects. At this stage the historical 2,640-row matrix had a separate acceptance requirement. Its previous digest survives in the report and the Windows output log. The checked repositories, Git history, temporary files and referenced sessions did not contain its executable or inputs. The historical digest is recorded as prior evidence.

## Extraction at 0.64.0

- The engine now resolves acquired Calling and Path features, Path prepared spells, Shipwright grant timing and eligible spell levels, and Magic Initiate and cantrip-style replacement limits. Ledger replay and persistence still own the moment and contents of the saved folio snapshot. The same discovery rule validates the saved folio journal and new discovery commands.
- Both consumers used byte-identical archives with SHA-256 `faa8afdec605a00d666aee23370a122cd505ffe65b52e464a16e7a9a2247e401` and lockfile integrity `sha512-Q5hugl7HU2e4zJZ5VCaeSfizw0XjHP+7PU12vo1mdO/MTT3BbyUenC/LuTe+zztLcApvZ94/eH/BUW4XVK/Itg==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-064-*.log`.

## Extraction at 0.63.0

- The engine supplies Memory Echo save attributes and conditions, Shared Recollection capacity, Tempest Heart damage types and Conductive Soul eligibility. The frontend uses those choices. The server owns the trigger and casting evidence, event journals and RNG.
- Spell menus, Calling cantrip selections, Shipwright discovery, Wish cooldown eligibility, Steady Aim, Disengage, Fast Hands, Light the Watch, Savage Attacker, Overwhelming Strike and Field Responder use engine rules. Previous command and receipt structures are retained.
- Both consumers used byte-identical archives with SHA-256 `b7c8aee65d98a74579d4dbd02ff975b930375ccb8f21c710f03fe904c1f13fbd` and lockfile integrity `sha512-76FwNMb1OkGjrXSJZ2RRc1srzcm1bba7peDKRXsJDpQbjGtybCjMrLQdXM2WmDqNpWuFDC16q5ove+jWpHPngw==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-063-*.log`.
- The next pass addresses the remaining duplicated grants in `ledger.replay` and `persistence.folioAtSpellGrant`, plus the Shipwright qualification in `runtimeJournals.validateFolioJournal`. Portable decisions include acquiring Calling and Path features, Path preparedness, Spell Mastery and Signature Spell schedules, and the Magic Initiate and cantrip-style replacement gates.

## Extraction at 0.62.0

- Sacred Weapon, Bloodwake retaliation, Reaver Path hits and the Warden sheet share melee-weapon eligibility. The engine owns Walking Storm and Chainbreaker terms, Keeper treatments, Hollow Lantern effects, Suppressing Fire, Hold the Corridor, Mangrove Snare and Holy Water target eligibility.
- Gunslinger movement uses the encounter movement calculation. The backend resolves identities, clocks, journals and accumulated movement. The frontend uses shared Reaver and object action choices.
- Both consumers used byte-identical archives with SHA-256 `3d0506d8f30f91a422de173b4481ab61fc317e227e1e28fc67767389b12163fb` and lockfile integrity `sha512-qd2RYYnUp4kkd3R8GRq9LUtNRCXasB8Y6pGiQi0cLu0sl/7/l+BegP66fJcNOmpwnm+10eUgBIENujY+W/Huqw==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-062-*.log`.

### Function-level review through 0.62.0

| Backend entry points | Engine decisions reviewed | Host responsibilities exercised |
| --- | --- | --- |
| `creation.validate`, `creation.equipment`, `ledger.replay`, `creationEquipment.build` | Point buy, score and language grants, background rules, Calling progression, feat choices, granted spells, equipment values | Registration, origin record lookup, ledger order, old choices, inventory instances and purchase application |
| `selections.project`, `selectionOperations.replace`, `runtime.update`, `resourceCommands.apply`, `featureOperations.apply` | Passive effects, mastery and training eligibility, spells and casting limits, recovery and resource arithmetic | Saved selection overlays, current effects and turns, pool mutation, revision and error translation |
| `resting.apply`, `resting.interrupt`, `resting.recover`, `vitality.apply`, `healthState.heal` and `revive` | Rest time and interruption qualification, recovery rules, damage mitigation, Death Saves, Concentration, treatment outcomes | Clocks, rest and effect IDs, inventory access, supplied dice, rest receipts and transaction boundaries |
| `combat/state.transition`, `attack.resolveAttack`, `attackRecords.apply`, `strikeOperations.apply` | Attack options, damage dice, attack outcomes, strike eligibility and modifiers, turn budget and movement | Encounter actor and target IDs, equipment and hit evidence, supplied dice, action and turn journals |
| `spellOperations.cast`, `castingTurn.record`, `spellMaterials.spend`, `spellComponents.validate`, `contingency.prepare` and `trigger` | Sources, spell and slot terms, material and component rules, Metamagic, casting limit, triggered target gates | Cast order and identity, confirmation and turn context, inventory and slot updates, effect timers and receipts |
| `folioOperations.apply`, `scrolls.cast`, `chargedItems.cast` and `dawn`, `spellRerolls.apply`, `healingSpells.apply` | Folio candidates and costs, item and scroll eligibility, reroll rules, healing profiles and budgets, charge outcomes | Identified items and saved spell sources, transcription time, grant and target facts, supplied dice, inventory and effect writes |
| `inventory.validateLoadout`, `loadout.deriveLoadout`, `equipment/commands.apply`, `magicProjection.project`, `utilization.apply`, `toolChecks.apply` | Equipment and grip constraints, weapon and armor calculations, ammunition, commerce, item effects, tool checks and magic bonuses | Owned items, active loadout, presets, equipment identity, transactional writes and world context |
| `abilityOperations.activate`, `damageRiders.apply` and named Calling handlers | Action, resource and weapon qualifications, printed tactical outcomes, ranges, dice, effects and passive flags moved in the entries above | Trigger evidence and target identity, resource spending, RNG, effect creation, stable IDs, host roll journals and receipts |

The frontend review followed the creator, sheet rolls, combat actions, spell casting and rerolls, items, resource actions, rest planner and all eight Calling control groups. Rules cards render catalog values and projected outcomes. The controls use shared eligibility when a rule requires calculation before a command is sent. Overchannel uses the selected slot for its preview. Scroll, folio and healing controls suppress commands the corresponding handlers would reject. Form inputs, confirmations, labels, display formatting and clock defaults are frontend responsibilities. Known residual cases after this review include Memory Echo saving throw choices, Tempest Heart conversion and cast predicates, the saved-casting choice list, and printed Steady Aim, Light the Watch and feat effects.

## Extraction at 0.61.0

- Encounter turn budget, recorded movement totals, Heroic Warrior and Boon of Fate recovery now use engine rules. Turn and movement records, event IDs, revision checks and combat state remain with the host.
- The engine supplies item and scroll casting eligibility, charge preservation and destruction dice, and Black Flag Envoy commands and Parley effects. The sheet uses authoritative eligible cast and transcription choices. The host still owns confirmations, inventory mutation, source evidence, clocks, RNG and effect identity.
- Both consumers used byte-identical archives with SHA-256 `b766a7bbc7df1c1ded4ca1df5babe5376e61756d8cd7deff80c9ea4a6b75952c` and lockfile integrity `sha512-AOw+3j84D15dL2z7EzJX+ylYZSKHHcRzxDRITZHi32tgIlTcD9SXQNaJVevCX//DXxV/20m6YgZYzBpB9+Pa7g==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-061-*.log`.
- Current residual findings include Walking Storm effect terms, Chainbreaker D20 count and outcomes, melee-weapon prerequisites, Keeper treatment effects, and additional printed Path effect terms. Audit details below record exercised adapters and the limits of the regression baseline.

## Extraction at 0.60.0

- Background templates, core creation attributes and background tools now come from the engine with the existing catalog shape. The engine owns creation sizes, Origin feat eligibility, background gold and equipment choices, language counts, and currency conversion. Historical origin records and item issuance stay on the backend.
- Browser checks, Initiative, Agility checks, Death Saves and Concentration use the engine's d20 count rule and supply their own RNG. Folio loss, discovery and rebuilding use shared spell-list rules. The backend owns the original discovery, folio identity, inventory, clock and transcription receipt.
- Both consumers used byte-identical archives with SHA-256 `ef01962923e6ce3f80084b776af64342625d7f8c316ccf9ac469a2686276f107` and lockfile integrity `sha512-c/NvN3dBY/Z+bUGljEdIN7Yrw5ZPGhBg+PquHhNoB8fJi0/CdZh3XqMT6qxDaxXGWQcVRQFYV7W35DIoic3fOQ==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 378 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-060-*.log`.
- The frontend arithmetic sweep covered all 49 Rules2024 source files. It found die sampling, display formatting, time-field defaults and layout sizing after the shared checks were wired. Choice predicates still need review separately from arithmetic. A parse of 98 frontend modules found only the pre-existing map editor cycle, with no Rules2024 cycle.
- The next function review targets are `combat/state.transition` turn resets, `commands.apply` movement and Initiative triggers, `chargedItems.cast` and `scrolls.cast` availability, and the remaining printed effect terms in Calling operations.

## Extraction at 0.59.0

- The engine owns equipment slot and grip legality, with inventory identity and lookup retained on the backend. The sheet uses the shared equipment candidates.
- Rage and Reckless Attack defenses, Concentration advantage, Aether Relay resistance, Unseen Passage, spell healing recipients, and the maximum spell slot level now use engine rules. Action Surge, Tactical Mind, Divine Spark, Clean Bill and relay discharge use shared outcomes or terms.
- Both consumers used byte-identical archives with SHA-256 `41999bc201f0cb87dcd9dad98e40f01711e423c880f056c26f8b411cf7397908` and lockfile integrity `sha512-+CcFa05Ma7I6MWhgNKss+ULMi7OgeGDSW7CsUi+w40CPu4/t2bcoGiwrs9PrrWJBKDPik9DOxCy84HKO+U+N8w==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 376 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-059-*.log`.

## Extraction at 0.58.0

- The engine owns casting-source admission, ritual and cantrip slot restrictions, spell trigger target counts, Divine Intervention availability and Wish cooldown dice. Careful, Heightened and Transmuted Metamagic controls use the engine's spell requirements.
- The engine now resolves Incapacitated and Unconscious status, death-save admission, stabilization duration, Covenant shield Guard, Free Port conditions and benefits, and Bloodwake Frenzy eligibility and die size. Host adapters supply recorded conditions, source and target facts, time, RNG, and journal records.
- Both consumers used byte-identical archives with SHA-256 `5a331f2d6a2f1ae258a43f4569e51bcb25de1e6ea3c6d5a5de80d92dbe0c1454` and lockfile integrity `sha512-iG/roJyJY04xX0KFIeFL4O/TVsQh/+5gEFIVn7P8lsvRmEYVxkAT8BrJsvZ5tbMjaZVqF+CDPDs0chlXxE13Yg==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 375 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-058-*.log`.

## Extraction at 0.57.0

- Feature restoration admission now shares prerequisites, alternate costs, and slot eligibility with the frontend. The host spends resources and resolves action context. Saved spell rerolls share supported dice, option and reroll-selection rules with the engine, with host-owned RNG, journals and casting identity.
- Sculpt Spells validates chosen targets in the engine. Overchannel's sheet control uses actual slot and damage eligibility and previews the total backlash dice for the selected slot. The frontend uses the engine's prepared-spell calculation after a Spell Mastery change, and Gray Net short-rest replacement classification is shared.
- Both consumers used byte-identical archives with SHA-256 `d39bfb88b82d4c86b97b4f2465e19b3696260dbc0837fb073517485e59a71cf5` and lockfile integrity `sha512-02nJE4vc98aFn57euPWz2KaI/nm8o0pM8H8S9+cgojLOL+Oipb7Krwffc3/jQp6cZlW0jS6uZNZULHS/xXGARw==`. The full suites passed with 90 engine, 638 backend and 115 frontend tests and one isolated MongoDB skip. Both lints, build, 375 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-057-*.log`.

## Extraction at 0.56.0

- The engine owns damage-rider dice, casting qualification and Inoculated effect terms, plus the shared damage-type and mode choices shown on the sheet. Backend handlers supply recorded cast and target evidence, consume resources and roll the supplied dice.
- Strike eligibility now shares target sizes, weapon requirements and the Last Tell die. The engine owns Rage extension reasons, Hide modes and the Stealth Attack cover threshold, Hold the Corridor's save DC bonus, and the remaining Conduit Health cost and Surge outcome. The backend retains condition identities, effects, journals and turn IDs.
- Both consumers used byte-identical archives with SHA-256 `f9f7ca78d6cd146aa15d9e5e4f5ef7bbce059bbe293418434ca7ebb753970408` and lockfile integrity `sha512-xY9cLoTEqX2X9uwgKJp0Aizr8pbw057WQ9pY4fGLC7H/C1/lwfymFq6vY58xBHSu9DVaq10gZfTla4gFTCQ2xQ==`. The full suites passed with 90 engine, 638 backend and 114 frontend tests and one isolated MongoDB skip. Both lints, build, 375 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched. Logs are in `%TEMP%/sa-056-*.log`.
- The remaining function review includes resource restoration admission, more spell trigger and metamagic eligibility, and host presentation gates. The historical rest probe executable is still unavailable.

## Extraction at 0.55.0

- Rest interruption kinds, completed-hour recovery, start Health and completion timing are engine-owned. World-clock mutation, transactional recovery, interruption journals and rest identity remain on the backend. Contingency admission shares the prepared-or-granted rule with the sheet.
- Gray Net uses engine damage dice and shared ammunition checks. Oil and Basic Poison share eligible devices and damage types between the host and sheet. The engine supplies object-use save DC, Peerless Aim, Improve Fate dice, Merge with Shadows, and the sheet's Preserve Life limit.
- Both consumers use byte-identical archives with SHA-256 `258e0f2a43209e1224263654b25c09366323aeccd9109993df3ad1888d280731` and lockfile integrity `sha512-27pwyQS4lMpdnMq8uBuOKzYe5m5w6ScAhawPHVlBBdGEmcXWq2hcvRbglcd4m7kPnwnV4qW7nOFOyQsIyhCx2g==`. The first verification exposed an omitted import for the backend Contingency compatibility export. The import is restored and a direct module-load assertion passes. Disregard the initial `%TEMP%/sa-055-*.log` attempts. Clean verification uses `%TEMP%/sa-055fix-*.log`.
- The original rest matrix was also sought in local rollout records and archived session files. Earlier records contain the same historical digest. No source for a fresh exact run was located.

The corrected 0.55.0 full suites passed with 90 engine, 638 backend and 114 frontend tests and one isolated MongoDB skip. Both lints, build, 374 syntax checks, dependency checks, all 13 retained backend probes and the frontend fixed-roll probe passed. All 22 available digests matched.

### Ownership review at 0.55.0

| Functions and controls | Engine ownership verified in this pass | Open branch |
| --- | --- | --- |
| `ledger.replay` and `AdvancementReplacements` | Magic Initiate grant, replacement and casting values, Metamagic replacement gate, cantrip-style list and Thaumaturge capacity | Remaining rest-time and level-time change allowances need comparison against the engine's selection APIs |
| `selections.project` and `abilityOperations.activate` | Entrenched Drill and Reef Colossus, action costs, target predicates, Restoring Touch and Silent Keel, most timed ability properties | Hold the Corridor bonus, reaction context and remaining reason or mode lists |
| `spellOperations.cast`, `contingency.prepare` and `SpellActions` | Omen Diver Dragon Companion, shared spell source eligibility, slot economics, relay qualification, Overchannel, Contingency admission | Remaining active spell and rider gates, especially when the relevant facts come from a recorded cast |
| `resting.apply`, `resting.interrupt`, `runtime.update` and `RestPlanner` | Duration, recovery interval, Health gate, interruption causes and recovery, resource recovery math | Exact historical comparison is blocked by the missing probe executable |
| `featOperations.apply`, `grayNetOperations.apply`, `equipment/utilization.apply` and their sheet controls | Feat dice and outcomes, Gray Net ammunition and dice, object-use DC and poison and fuel predicates | Remaining feat use and recovery eligibility paired with backend records |
| `damageRiders.apply`, `conduitOperations.apply`, `consumeSurge`, `commands.apply` and corresponding controls | Existing mitigation, health and attack-roll helpers | Remaining rider dice, conditions and profiles, Conduit costs and outcomes, Hide cover and Rage extension reasons |

## Extraction at 0.54.0

- Dimensional Travel actions and distance limits, relay spell origin and cantrip eligibility, charged spell limits, equipment training profiles, cantrip-style spell eligibility, and Thaumaturge cantrip capacity now have engine implementations. The legacy attack adapter uses the same critical damage dice count as the strike command. Adapters supply live relay identity, clocks, action confirmation and inventory state.
- Both consumers used byte-identical archives with SHA-256 `a39e7d29ac611c4d8151b441baf1233f0f3926c0737be6b7a121b805e34b9887` and lockfile integrity `sha512-veMKOxxZ7iDHYJOsMlXKe+Kxw0OnLKhGZHNAE7jEffDDhmVga+V7A4BROmoOsB3x6OJNYWZPzbWxEPMOuF9oqw==`. The full suites passed with 90 engine, 638 backend and 114 frontend tests and one isolated MongoDB skip. Both lints, build, 374 syntax checks, dependency checks, 13 backend probes and the frontend fixed-roll probe passed. All 22 hashes matched. Logs are in `%TEMP%/sa-054-*.log`.
- The current function audit found additional portable cases in `resting.interrupt` (event kinds and completed-hour recovery) and `resting.apply` (rest health and timing gates), alongside remaining spell and feature predicates. The backend still owns world time, rest identity and transactional recovery. The historical probe source remains missing.

## Extraction at 0.53.0

- The engine supplies Restoring Touch conditions and cost, Silent Keel creature and vehicle limits, Overchannel cast eligibility, Storm Pulse source eligibility, Recalled Pattern cast eligibility, the Metamagic replacement gate, and the lethal Exhaustion threshold. Backend adapters still identify the selected casting, resolve targets, record effects, spend resources, and supply dice.
- Both consumers used byte-identical archives with SHA-256 `bfd95408253a852aa074734365d1ce1a00b657311037941224b925e146732e52` and lockfile integrity `sha512-oB/iBJkbMHTUMcnU/VQsaKoX9ID7RAJAsCPXmMN0KuROOPaghWJu7nzH6PZP1KZPr9RjjzsQn/ch9RzOgED06g==`. The full suites passed with 90 engine, 638 backend and 114 frontend tests and one isolated MongoDB skip. Both lints, build, 374 syntax checks, dependency checks, 13 backend probes and the frontend fixed-roll probe passed. All 22 hashes matched. Logs are in `%TEMP%/sa-053-*.log`.
- Remaining concrete audit candidates include Dimensional Travel range and trigger rules in `featOperations.apply`, relay spell-origin rules in `spellOperations.cast` and `SpellActions.jsx`, and frontend cantrip replacement candidates. The search for the historical rest probe included reachable Git history and the unreachable backend commit tree in addition to the earlier local and conversation searches.

## Extraction at 0.52.0

- Backend ability projection and execution share the engine's action eligibility and resource checks with the sheet's ability controls. The engine also owns Exhaustion bounds, ammunition loading hand requirements, object damage type membership, and the remaining Cinder and Drydock equipment qualifications extracted in this round.
- Both consumers used byte-identical archives with SHA-256 `8a4bba32eccaf17301cf00d664cfec883649b51f2cbe6e71bd6f685afebd7f3e` and lockfile integrity `sha512-UDgZK/DdIMpucIL+4iQYtSmb/ju6R9UhMEWJNftoe3ZieIqZW753xqAwhs8u+u2ZSKMDS05B2FicKrMz4dxuMA==`. The full suites passed with 90 engine, 638 backend and 114 frontend tests and one isolated MongoDB skip. Both lints, build, 374 syntax checks, dependency checks, 13 backend probes and the frontend fixed-roll probe passed. All 22 hashes matched. Logs are in `%TEMP%/sa-052-*.log`.
- Next portable branches identified during the audit include Restoring Touch conditions and cost, Silent Keel targeting, Overchannel cast eligibility and Storm Pulse cast eligibility. The original historical rest probe is still missing. The current rest tests and the retained digest are recorded separately below.

## Extraction at 0.51.0

- The engine owns magic-item attunement, distinct-profile and wear limits, and active item qualification. Backend adapters supply inventory and loadout facts.
- Veil, Sacred Weapon, Intimidating Presence, turning, Quarantine, Light the Watch and Memory Echo use engine effect terms. The backend owns source checks, effect instance fields, clocks and records. The remaining direct combat amount clamps and strike preview dice use engine helpers.
- Both consumers use byte-identical archives with SHA-256 `919300b6feded9371da335e61a42a6f7a41af64bce7f22e3dfefee4ab506ce07` and lockfile integrity `sha512-dWXfysV2ik9mmRnCEmcDH7+tDK5RA2C+U9L5bzHkm5Fs6TPY2IdcnyHgiY265kqqHx+1b18JjHGz+Mgy4dR42Q==`. Latest logs use `%TEMP%/sa-051-*.log`.

Engine, backend and frontend suites, both lints, production build, syntax and dependency checks, and all available retained probes exited successfully. The isolated MongoDB test was skipped.

Remaining audit candidates include action-denial and cost predicates duplicated between `abilityOperations.activate` and `selections.project`, and residual save, targeting and item qualification in the active command modules. The exact historical rest matrix remains unreproducible from the recovered artifacts.

## Extraction at 0.50.0

- Printed activation durations across the generic, caster, Corsair, Covenant, Navigator and Warden handlers now come from the engine. The backend still supplies creation and expiry timestamps and owns effect identity and records.
- The engine supplies the activated flight speed, Keeper healing amount and Dragon Companion casting projection, including the existing non-Concentration duration and Material waiver.
- Both apps resolve identical archives with SHA-256 `0dbc6ff0b677785ef7b80523f36f622baeb43a6b241a8df45cb7f3b31dee98f3` and lockfile integrity `sha512-US+2w8InqaSGH9LoHtZB2FlZh56BDNHqSsjfTtrEVQxCm895o9hHPnUkbIs6fKxeYcQOEysqJUqKsBkgqCGRpg==`. Current verification logs use `%TEMP%/sa-050-*.log`.

The 0.50.0 full suites passed with 90 engine, 638 backend and 114 frontend tests, plus the isolated MongoDB skip. Both lints, production build, 374 syntax checks and dependency cycle checks passed. All available retained probes passed with 22 matching hashes.

The current audit still distinguishes printed effect properties from host-created effect instances and records. Remaining concrete predicates include magic-item attunement eligibility and wear limits, the static outputs of selected Calling effects, and the final portable-rule review across the remaining host functions. Historical rest probe source is still missing.

## Extraction at 0.49.1

- Calling Training, language, Expertise, Scholar, Protector, fighting-style, Path, Omen Diver and Blessed Strikes choices now come from the engine. Ledger replay keeps ordering and saved decisions. The sheet and ledger share the cantrip-style spell source.
- Tactical Shift, Multiattack Defense and shared dice totals now use engine rules. The resolved number of attacks per action is derived by the engine.
- The first 0.49.0 package failed to load due to the dice-helper import order. The corrected 0.49.1 package passes the module-load smoke check. Both apps resolve identical archives with SHA-256 `4a81f8fe0b35d8a6740655b7aa20d4bd3fa0921d8253b91ffa24761ab5390b97` and lockfile integrity `sha512-rPiLmx83O/jll1xaiadZWLea18C+1mLPlUJyBHHUZpoSfMRhCc+Iq5Au1Lm/4V+ahzIsriyjCmD8wP/K3Y9URg==`. Current verification logs use `%TEMP%/sa-0491-*.log`.

Engine 90, backend 638 and frontend 113 tests passed, plus the isolated MongoDB skip. A targeted regression also passed for source-restricted Warden and Navigator cantrip fighting style replacements after correcting the sheet's replacement filter. Both lints, production build, 373 syntax checks and dependency cycle checks passed. All available retained probes returned 22 matching hashes.

Remaining audit findings include printed activation durations still embedded alongside host timestamps in the Calling handlers, and qualitative spell and inventory eligibility branches. The host clock application stays on the backend. No executable source for the historical rest matrix has been located.

## Extraction at 0.48.0

- Actual healing resolution now shares Sanctuary Hand's healing bonuses, maximum dice and self-healing eligibility with casting projection. Mass Heal allocation and Regenerate tick arithmetic are engine-owned.
- Attunement, scroll casting and charge preservation share Reef Knife eligibility. Charge range, area count, Safe Handling and smoke duration/size come from engine rules. The backend resolves target evidence, RNG and effect lifetime.
- The engine owns the remaining copied-folio, Spell Mastery, Primal Knowledge, Precise Hunter, Studied Attacks and Deadeye thresholds identified in the preceding audit. Advancement now uses the same Calling spell grants before and after the final ledger projection. Milestone and Wish validation reference the shared cap and cooldown formula.
- Both apps resolve identical archives with SHA-256 `45f7343211360b6edae2d1f89109c89cfff3ccd951d848ff866234ff973b8097` and lockfile integrity `sha512-NafQsYZZ6Xxz6Ohp3yHmB6iQYe3m54UeuiMXApKcNfi7HJ6+MuPBSW8sevn1rwke5kZjcEy9tSsotRRkMQQRbw==`. Latest logs use `%TEMP%/sa-048-*.log`.

The 0.48.0 full suites passed with 90 engine, 638 backend and 113 frontend tests plus the isolated MongoDB skip. Both lints, production build and 372 syntax checks passed. Engine and backend dependency graphs were acyclic. All available retained probes returned 22 matching hashes.

No exact rerun of the historical 2,640-row rest matrix is available. The retained digest and prior output remain documented. The current rest tests and the final audit of remaining source gates, receipts and adapters should be recorded independently.

## Extraction at 0.47.0

- Purchase arithmetic, ammunition matching, Loading and Extra Attack expenditure, and Contingency slot availability use shared rules. The sheet uses the same quote, ammunition and slot predicates.
- Generic activation now uses the engine's target and Rage eligibility rules, fixed-dice outcomes and roll totals. The backend still resolves identity, verifies evidence, supplies dice, and writes effects, inventory and receipts.
- Both apps resolve byte-identical archives with SHA-256 `8dbe45e4fe70ba46f581bf7d9769664a9875276ac1fabfb0f5f479edb5af09ab` and lockfile integrity `sha512-OQfhjS8kWeLhRCkXd1GC0jW10CB2JYReVQnK5/EYKMcBUQDD6JdFErXmrb8DDpDQMGkK2L5NwQuzG63LL6y6ww==`. Latest logs use `%TEMP%/sa-047-*.log`.

The 0.47.0 full suites passed with 90 engine, 638 backend and 113 frontend tests plus the isolated MongoDB skip. Both lints, production build and 372 syntax checks passed. Engine and backend dependency graphs reported zero cycles. All available retained probes passed with 22 matching hashes.

The subsequent threshold audit found duplicate Sanctuary Hand rules in `healingSpells.apply` and Reef Knife capacity in `equipment/magic.attune`. Other remaining examples are Cinder smoke size and expiry, Death Save feature gates, and copied folio and Path thresholds in `selections.project`. Exact playback of the historical rest matrix still lacks the original executable.

## Extraction at 0.46.0

- Engine APIs own Steady Aim, Fast Hands skill selection, Storm Broker damage eligibility, Thunderhide leaps, Reaver Path hit damage, Deckshaker landing, and Chainbreaker target limits.
- Sheet and backend code share the character level cap, Persistent Rage, Arcane Apotheosis and tool-task unlocks. Relay and salvage controls take availability from projected abilities.
- Constructed-object damage, Sacred Weapon and Holy Nimbus arithmetic, Health reconciliation on advancement/rebuild, and death-save roll selection use shared rules. Backend adapters retain live evidence and write the resulting state.
- Both consumers use identical archives with SHA-256 `e6cc7e968a4e2429c8173e41b7f7514e9c7bae496c24c8b147ec2199f98660fa` and lockfile integrity `sha512-OCtenLWKqFRJpzpqTNnJi53DQ9wB7Xc12BdzgRX4lymWwDBCbjnP5stdpZcBW2zCjQ6birE3OmRIm2zmFlVOYA==`. Verification logs use `%TEMP%/sa-046-*.log`.

The 0.46.0 full suites passed with 90 engine, 638 backend and 113 frontend tests plus the isolated MongoDB skip. Both lints, production build and 369 syntax checks passed. Zero engine or backend dependency cycles were found. All available retained probes passed with 22 matching hashes.

Remaining concrete gaps include purchase cost arithmetic and a few frontend choice predicates, plus the rest of the function-by-function audit across command dispatch and named Calling handlers. The historical rest matrix remains unreproducible from the available logs without its probe source.

## Extraction at 0.45.0

- Feature restoration uses a shared engine table for alternate costs, level-five slot eligibility and the action type. The sheet consumes that table. The backend still checks live resources and applies expenditure.
- Oil fuel and ground-burn outcomes, Basic Poison consumption and damage, and combined ordinary/created spell-slot reconciliation now use engine rules. The backend retains clocks, RNG, effect and inventory identity, saved-state validation and error mapping.
- Both consumers use identical archives with SHA-256 `6ef51844e00a2fb698e1387c4007af0b6219070f8039a106174269ed33d56756` and lockfile integrity `sha512-9u5qgqhtWxajyxJpMXaxP1QhhpjyoTxaOPMjbl8JOfpz4fbk+UMbbUrHzBDDcbD7w0ebel8rxXMHGUB2YtsiFw==`. Latest logs use `%TEMP%/sa-045-*.log`.

The 0.45.0 full suites passed with 90 engine, 638 backend and 113 frontend tests plus the isolated MongoDB skip. Both lints, production build and 368 syntax checks passed. Engine and backend dependency graphs reported zero cycles. All 13 backend probes and the frontend fixed-roll probe matched 22 retained hashes.

The final function-level audit remains open. Current candidate branches include Steady Aim and Fast Hands outcomes in `utilityOperations.apply`, the Leap and Reaver Path hit/landing results in `reaverOperations.apply`, and selected Calling tool-advantage thresholds in the sheet and tool checks. The historical rest run cannot be reproduced from the recovered artifacts because its executable is missing.

## Extraction at 0.44.0

- The backend and sheet share alternate spell-source eligibility. The engine resolves free-cast pool identities, recorded prepared/known spell eligibility and ritual access. Pool expenditure, typed commands and receipt execution remain on the backend. Smite eligibility stays within its existing casting contract.
- Creation score increases, caps and background-equipment terms now come from engine progression. The backend still validates input shape, resolves catalog items and issues inventory identities.
- Iron Covenant now shares Sentinel's outcome and Standard's temporary Health arithmetic. Mangrove Stalker movement outcomes come from the engine. The host keeps target facts and records.
- Both applications resolve identical archives with SHA-256 `e6128facace045c0aa877637c272ac40dc420f378fd57fb4ea3ea7caeceed4fe` and lockfile integrity `sha512-m5jdgRcM/x4JVlDz7HEr0qW4FE+xkxpPfW/SzvZrlvhrT/6xWVjraLP0AFLuYJZluNmpm5HqJfE8z2tUBRtMAg==`. Current verification logs use `%TEMP%/sa-044-*.log`.

The 0.44.0 full suites passed with 90 engine, 638 backend and 113 frontend tests plus the isolated MongoDB skip. Both lints, production build, 367 backend and engine syntax checks, and dependency cycle checks passed. All 13 retained backend probes and the frontend fixed-roll probe returned 22 matching hashes.

Remaining concrete gaps include `featureOperations.apply` alternate restoration costs and the corresponding `FeatureActions.jsx` rules, `equipment/utilization.poisonHit` and `flame` rule outcomes, and residual Calling-specific tactics in utility and command handlers. The historical rest matrix source search included the previous Work thread and Phase 3 ChatGPT references, plus the worktrees, related local project folders and Windows temporary directory. Historical outputs exist, but the original source has not been located.

## Extraction at 0.43.0

- Practice combat uses engine turn sequencing and attack budgets. Runtime uses shared direct Health reduction, Sorcerous Restoration and Wish cooldown rules. The host still authorizes turns and writes events, effects and receipts.
- The engine owns Warden Path aura and resistance projections, Reef Knife attunement capacity, and maximum granted movement. Spell Mastery and Gray Net replacement rules are shared with relevant frontend controls.
- Both consumers use byte-identical archives with SHA-256 `9c8cf9b49c96f0c6615d8df645e080a778f4698d9c8ec878a33fb72b434a522c` and lockfile integrity `sha512-76axeqMMWyzEjFG/dzTgTx79b8UY5E2+iR5k54qvoXHLnrV5MtC0bRXPpITpsV+ubS7PNGOct4bwj5LO9GS7qQ==`. Current verification logs use `%TEMP%/sa-043-*.log`.

The 0.43.0 full suites passed with 90 engine, 638 backend and 113 frontend tests, plus the isolated MongoDB skip. Both lints, production build and 364 syntax checks passed, and both engine and backend dependency graphs had zero cycles. The 13 backend probes and the frontend fixed-roll probe returned 22 matching hashes.

An open shared seam is the alternate spell source table in `spellOperations.cast` and `SpellActions.jsx`. Additional portable effect decisions remain in the named Calling operation handlers. Exact replay of the retained historical rest digest remains unavailable without the original probe source.

## Extraction at 0.42.0

- The engine resolves spell components, including casting hand requirements, compatible focus selection and priced material allocation. Backend adapters provide held and owned inventory, loadout, active speech blocks and catalog lookups, then apply the returned inventory and copper changes.
- The engine supplies charged-item balance and dawn recharge outcomes, charged casting level, Fast Hands eligibility, Oil profiles and Basic Poison coating sizes. The backend still rolls dice, advances time, manages effects and applies mutations.
- The frontend uses the shared spell-slot list, relay capacity and Fast Hands and Last Tell eligibility. The Drydock Ghost turn input follows the backend ability projection.
- Both apps pin identical engine archives with SHA-256 `a483cd30905820b6e51b5914b74f6d5a3c79637b040dd65dfa014fc5cd31c42a` and lockfile integrity `sha512-VU39Nyx8iBzr/pPtSIhJV+pufdLreEQDis0GH8pETxbz3JGJSH80HSpl2OoQwxgCBJE8uRgBReCzE0hvZYhFZg==`. Verification logs use `%TEMP%/sa-042-*.log`.

The 0.42.0 full suites passed with 90 engine, 638 backend and 113 frontend tests, plus the isolated MongoDB skip. Both lints, production build and 363 syntax checks passed. Engine and backend dependency checks found zero cycles. All 13 backend probes and the frontend fixed-roll probe passed with 22 matching hashes. Both archives independently match their lockfiles and include the engine NOTICE and LICENSE.

Remaining examples include practice encounter turn budget in `combat/state.transition`, recovery and source gates in `characters/runtime/runtime.update`, passive aura and saved replacement branches in `selections.project`, and feature rules in the named Calling operation handlers. The separately retained historical rest test executable is still unavailable.

## Extraction at 0.41.0

- Engine APIs now provide Borrowed Squall profiles, Captain's Credit temporary Health, Rage activation benefits, the Memory Echo save adjustment, Storm Pulse movement and passenger access, and Twin Circuit spell eligibility. The backend uses the authoritative Navigator Hunter's Mark die and shared Divine Strike die counts for its recorded damage riders.
- Tool checks use the shared Exhaustion penalty, Ghost Patch trade bonus and Storm Broker task rule. The frontend uses the same Twin Circuit gate as spell execution.
- Both consumers use byte-identical archives with SHA-256 `dd08534151af1d580fe21a0af2988e790ed7b52966f6621ff93a048d1535e71f` and lockfile integrity `sha512-s52mjPGCyydIm6FHRJeN3deBzcab1RvLvoMa4NKx9ju7bEEGe8NciTr9mqPov67zM7pl1ZDfzGLrL7XXDLpxoA==`. Current verification logs use `%TEMP%/sa-041-*.log`.

The 0.41.0 full suites passed with 90 engine, 638 backend and 113 frontend tests, plus the isolated MongoDB skip. Both lints, production build and 361 syntax checks passed. Both engine and backend dependency graphs reported zero cycles. All 13 backend probes and the frontend fixed-roll probe passed with 22 matching hashes.

Next concrete ownership seams are `spells/spellMaterials.spend` for pure material allocation and `spells/spellComponents.validate` for focus and free-hand rules. Related frontend spell slot and material option gates remain open. Additional host operation branches still require the final audit. The historical rest probe's executable remains unavailable.

## Extraction at 0.40.0

- Strike definitions, option eligibility, and preview filtering use the same engine rules. The catalog retains the original order and field names. The backend owns target facts, dice, effect instances and records.
- The engine owns Weapon Mastery eligibility and replacement count, Spell Mastery spell eligibility, and Agility skill and Hide calculation. Advancement and rest preserve their historical difference for the finesse-or-light grant. The rest UI now excludes the two focus-staff variants its backend already rejected.
- Remaining half-damage arithmetic in generic abilities and Potent Spellcasting routes through the engine. Uncanny Dodge uses the same rounding rule through an unconditional half-damage API.
- Both apps resolve byte-identical archives (SHA-256 `e131e5607f6b3417e9958256cf11ac206738eb97d04f362faf133b4f0002f3d2`). Both lockfiles record `sha512-sa/2xcPmP3BijEqO6hUvcuqcrDbR86KZ/pM9S7ZsGcVy26BlsUAqDXKmhaiWDs8Iz3XvyWg1G01/WElY+KinXA==`. Current verification logs are under `%TEMP%/sa-040-*.log`.

The 0.40.0 full suites passed with 90 engine, 638 backend and 113 frontend tests. Isolated MongoDB was skipped. Both lints, production build and 358 syntax checks passed. Both engine and backend dependency graphs had zero cycles. A separate 98-file frontend dependency audit found one pre-existing cycle between Map Canvas, Authored Shape Layer and Shape Editor Layer and found no Rules2024 cycles. All 13 backend probes and the frontend fixed-roll probe passed with 22 matching hashes.

Still open in the audit are the named Calling execution modules, remaining equipment and spell operations, frontend source and target gates, and reconciliation of all exit criteria. Latest concrete gaps include `equipment/toolChecks.apply` task feature bonuses, `characters/abilities/abilityOperations.activate` Rage turn benefits and Navigator charge amounts, `casterPathOperations.apply` save-adjustment and Storm Pulse math, and `SpellActions.jsx` slot availability and relay targeting gates. The historical rest regression executable is still missing.

## Extraction at 0.39.0

- The engine now validates feat availability, prerequisites, attribute increase shape and score caps. It supplies Calling spell grants, Omen Diver bonus Health and base or trained casting numbers for ordinary and feat casting. Ledger replay retains choice order and historical error mapping.
- The sheet and runtime validation share spell-preparation eligibility, including folio and memorized spell access, and Shipwright Short Rest access. The casting controls share Sculpt Spells and Cinder gates with backend execution. Conduit controls use projected options and the shared Blood Price and Unbroken Current rules.
- Identical archives are installed across both consumers. SHA-256 is `b861e77c3baf8468748dbe47250fcff12df574afc32796f7ca42883ed9c783ab`. Both lockfiles record `sha512-Ejusbg/0yiP1lonju/viW2j6G/YFcQNI/77GQqG2FOgX4fPBBglB4zR3ozlqt44MYnvVZzC1JcolCVXohumQcg==`. Logs for current verification are under `%TEMP%/sa-039-*.log`.

The 0.39.0 full suites passed with 90 engine, 638 backend and 113 frontend tests. The isolated MongoDB test was skipped. Both lints, frontend production build and 357 syntax checks passed, and both audited dependency graphs had zero cycles. All 13 retained backend probes and the frontend fixed-roll probe passed with 22 matching hashes.

### Remaining audit findings

`ledger.replay`, `selections.project` and `selectionOperations.replace` still carry Weapon Mastery candidate and replacement rules. Strike option definitions and filtering still reside in backend and frontend code. Check level and path grants for active spell and ability operations, then review the remaining branches in the function-level table below. The Contingency whitelist and Sculpt Spells limits are already shared in the current package.

## Extraction at 0.38.0

- The engine owns Contingency spell eligibility and eligible slot levels. The backend catalog preserves the same ordered IDs. The backend retains inventory, spell slot spending, casting records and effect identity.
- Runtime feat and Calling projections use engine APIs for passive feat benefits, poison-save Advantage, terrain traversal, Chainbreaker Rage, Living Tempest, Innate Sorcery, Corsair and Reaver defenses, and sense ranges. The backend resolves active effects and applies the projected values.
- Attack Records shares Reckless Attack and Brass Outrider gates with the backend. Contingency slots, Unbroken Current, and the Grand Battery input use the shared rule or the projected ability list.
- Both apps resolve byte-identical engine archives (SHA-256 `95865234dea1baf95d6690a6b8e0363035ac3d4e14f5b7ac8cf945bccf825e30`). Lockfile integrity is `sha512-SkglyB20WfKt6UbNexgqxJyvXHJrlstfKV3K+QeyUtGajgM/G48LRkeUjlgO0rMvbyksDC5t53Xvp6QkviWG5Q==`. Verification logs use `%TEMP%/sa-038-*.log`.

The 0.38.0 full suites passed with 90 engine, 638 backend and 113 frontend tests. Isolated MongoDB was skipped. Both lints, production build and 354 syntax checks passed, and both dependency graphs reported zero cycles. All 13 retained backend probes and the frontend fixed-roll probe passed with 22 matching hashes, including the catalog. The separate historical rest matrix remains unavailable for an exact fresh run.

### Function-level audit inventory at 0.38.0

| Function | Portable mechanics still identified | Host boundary |
| --- | --- | --- |
| `characters/advancement/ledger.replay` | Feat prerequisites and score caps, Calling preparedness grants and derived casting, Omen Diver bonus Health, mastery candidates | Ledger shape, ordering, persisted choices and historical validation messages |
| `characters/runtime/selections.project` | Weapon Mastery eligibility, Spell Mastery and Gray Net saved-choice rules, Warden aura resistances, remaining movement or ability projections | Active-effect selection, inventory, encounter evidence and counters |
| `spells/spellOperations.cast` | Sculpt Spells target cap and qualification, relay and free casting eligibility, Wish cooldown dice | Turn context, resource mutation, dice, receipts and effect identity |
| `spells/contingency.prepare` | Prepared-versus-granted availability remains in the host alongside source lookup | Inventory, component evidence, slot spending and stored spell metadata |
| `characters/runtime/resting.apply` and `interrupt` | Rest durations and minimum interval already call engine APIs | Clocks, journal identity, rest session workflow and inventory access |
| `spells/metamagic.validate` | Core Metamagic legality and projection already use engine APIs | Host active-effect test and HTTP error mapping |
| Frontend controls | Conduit and Charge feature gates, remaining spell and advancement eligibility, and further local-formula audit | Form state, command envelope and projected receipt display |

## Extraction at 0.37.0

- The feat package resolves Initiative totals and Reef Knife's first-round turn offset, Savage Attacker's weapon-dice totals, Improve Fate's adjustment, Harbor Defender's reduction and Grappler's save. The backend supplies rolls and contextual evidence and writes the same receipts.
- Doctor and Shipwright engine rules supply Sear Undead's unlock, Divine Intervention spell eligibility and Overchannel's unlock and backlash dice. The frontend uses those rules, the shared Dragon Companion predicate and the existing Breakwater barrier projection.
- Both consumers use byte-identical archives with SHA-256 `e33726c091381c1c5b3198c411249578b8d4fef60cfe78be76787b5e62eb6382` and lockfile integrity `sha512-5Nl1wgjlUo8Qk+YYKi6eJB+SIB/BUq9elPkrn36kY+j7ldrwGAlPgAzbSgEOhaiXOxO2kShDqd/xaspHO1b98g==`.
- Full backend verification uses `%TEMP%/sa-037-backend.log`. The 0.36.0 full run ended with 637 passing, one authenticated combat HTTP timeout and one isolated MongoDB skip. The timed-out test passed in the focused retry.

The 0.37.0 full suites passed with 90 engine, 638 backend and 113 frontend tests. The isolated MongoDB test was skipped. Both lints, production build and 352 syntax checks passed, and dependency checks found zero cycles. All 13 backend probe scripts and the fixed-roll probe passed, with 22 matching hashes. The separately retained historical rest probe executable remained unavailable.

Remaining function-level audit priorities include `spellOperations.cast` gates for active spells, Sculpt Spells, relay travel and material outcomes, `selections.project` temporary feature and action eligibility, and `ledger` grant and progression branches. The frontend audit still includes Attack Records, Charge, Conduit, Contingency, and Reaver state controls. Record portable result calculations and their host inputs with each migration.

## Extraction at 0.36.0

- Shipwright folio-copy eligibility, transcription prices and durations, scroll checks, scroll casting modifiers and Reef Knife scroll access now come from the engine. The backend still resolves ownership, supplies dice, advances the clock, consumes inventory and records receipts.
- The frontend uses the shared folio-copy terms and scroll check DC, and filters Magic Initiate replacement choices through the same predicate as ledger replay.
- Both consumers use byte-identical 0.36.0 archives. SHA-256 is `da6565df011b18c182440b24c1e20a65fcd435d486e47d5ef68b77dd9a1cf0f5`. Both lockfiles record `sha512-ApwQYz3odEgusaQaP4ALE08naWZAdItDYO8PatV0x7qXpyDfPAiCKAH8CKhCCV48WzNy6Lxw+B/GgY06TqAfJw==`. Removed the 0.34.0 and 0.35.0 archives from both vendors after checking the four current manifests and lockfiles.
- The superseded backend run and probe sweep crossed source edits and a package replacement. Their mixed-version results are invalid as full verification. Fresh 0.36.0 runs use `%TEMP%/sa-036-*.log`, including a separate line and exit status for each retained backend probe.

The remaining audit includes feat execution in `characters/abilities/featOperations.js` and Calling feature gates in `AbilityActions.jsx`, `AttackRecords.jsx`, `ChargeControls.jsx` and `CharacterStateControls.jsx`. A full function-by-function inventory remains open. The deferred Smite outcome remains covered by Pass 35.

### Verification at 0.36.0

- Engine 90 and frontend 113 tests passed. Both lints, frontend production build and 350 backend and engine syntax checks passed. Both dependency graphs have zero cycles. The build retains its chunk-size warning.
- All 13 retained backend probe scripts returned zero, and the frontend fixed-roll probe passed. All 22 emitted hashes, including the full roster and catalog, matched the retained digests. The separately recorded 2,640-row historical rest probe has a retained digest and Windows output log. Its executable source was not found in the three worktrees or Windows temporary directory, so no fresh run of that exact probe is recorded here.
- The full backend run encountered an authenticated combat HTTP timeout at the 12-second file-runner limit. The retry of combat, feats, folio, magic items and catalog boundary passed 54 tests. The full-run log and retry log are `sa-036-backend.log` and `sa-036-retry.log` under the Windows temporary directory.

## Extraction at 0.35.0

- `feats/magicInitiate` supplies the spell lists, attribute choices, cantrip count, replacement results, free-cast pool and casting projections. `characters/advancement/ledger.js` keeps the recorded selection order, grant keys and error messages.
- Calling APIs now supply the Entrenched Drill and Reef Colossus passive values and the Omen Diver Dragon Companion eligibility predicate. The backend continues to resolve turn, Rage, effect and cast context.
- Backend strike execution and the frontend Strike controls share the unlock level, maximum selected options and damage dice profile. The frontend still takes option definitions from the backend catalog.
- Both consumers resolve the same archive. SHA-256 is `5ee4b6580bc9331d6217c2bb0359c38cf16e58a4420420b27efc0fc9c72d05f2`. Both lockfiles record `sha512-P2M7oM3U4xYhjFQImv+OlUKV1RU3bM1WRJL//uo3ZulGmpBUs/cv09NAZV6Wqp7AepFrok7t+duL6rHm6cF5vw==`.

### Verification at 0.35.0

The 90 engine tests, both lints and frontend production build passed. The build has the existing chunk-size warning. The 12 attack and 494 fixed-roll observations matched their retained hashes. Windows temporary logs use `sa-035-*.log`. The full backend and frontend suites and remaining probe results require final reconciliation against their exit results and retained hashes.

### Open ownership findings

The next frontend audit targets include scroll-copy cost, duration and DC in `MagicItemControls.jsx`, Magic Initiate replacement choices in `AdvancementReplacements.jsx`, and Calling feature thresholds in `AbilityActions.jsx`, `AttackRecords.jsx`, `ChargeControls.jsx` and `CharacterStateControls.jsx`. Backend examples still awaiting extraction include transcription eligibility and results in `spells/folioOperations.js`, scroll casting check outcomes in `equipment/scrolls.js`, and initiative, weapon dice and damage reduction in `characters/abilities/featOperations.js`. These examples are an open inventory. The function-level audit and remaining exit criteria still apply.

## Extraction at 0.34.0

- The engine now projects advancement skill modifiers, including Thaumaturge, advancement resistances and initiative. The backend still replays persisted decisions and supplies the resolved advancement facts.
- Rage skill modifiers and Sanctuary Hand healing features now use Calling APIs. Reaver area damage and the frontend's historical receipt fallback share the same successful-save damage rule. Explicit damage values on saved receipts retain priority.
- Both manifests and lockfiles resolve the same vendored 0.34.0 archive. SHA-256 is `5916cf188fb63f5c56e8a302a52b8381282c523bb3de57b053d9c689234ee1bf`. Computed integrity matches both lockfiles at `sha512-reHxU0kjv4j5kFx0NEd+SU9rcXZnsXdYq33X4d+zDiroMopil2oBq48Ip2FVCSNCnux8uJ9b4XvBlAXSfNewGg==`. Removed the unreferenced 0.32.0 and intermediate 0.33.0 archives from both consumers.

Confirmed remaining ownership gaps include Magic Initiate spell grants and derived casting values in `characters/advancement/ledger.js`, Entrenched Drill and Reef Colossus projections in `characters/runtime/selections.js`, and Omen Diver dragon companion eligibility in `spells/spellOperations.js`. The frontend gameplay audit remains open. The deferred Smite contract remains recorded in Pass 35.

### Verification at 0.34.0

Engine (90 tests), frontend (113 tests), both lints, the production build and 259 backend syntax checks passed. Both dependency graphs reported zero cycles. The frontend build reported the existing chunk-size warning. The focused catalog-boundary and authenticated HTTP suites passed. The 494 fixed-roll, 38 ownership and 3,960 vitality observations matched the retained hashes below.

## Rules moved during this run

- Tidecaller replay now uses the engine spell catalog for the two-option grants at levels 2, 10 and 17 and for replacement validity and results. The host validates the persisted replacement shape and applies choices in ledger order.
- Reaver Stormhide retaliation and Walking Storm and Reef Colossus area save results use Calling helpers. The host still rolls dice, validates trigger context and writes the effect journals.
- Starwake Passage speed, terrain benefit and movement type come from the Navigator Path helper. Passing Shot's movement and recoil eligibility uses the Gunslinger engine rule after the host links the recorded weapon hit.
- Engine changes are in src/spells/metamagic.js, src/callings/reaver/tactics.js, src/callings/navigator/paths/starwake-pilot.js, src/callings/gunslinger/rules.js and src/callings/rules.js, with documentation and tests. Backend consumers are system/rules2024/{engine,reaverOperations,navigatorOperations,gunslingerOperations}.js. The two applications use the same vendored package and retain their lockfiles.

- The second implementation round moved Primal Champion attributes, Corsair save Training, Leviathan Burden and Suppressing Fire target limits and control outcomes. It touched engine Calling progression and the Leviathan Anchor Path, plus the existing Reaver and Gunslinger modules. Backend consumers are engine.js, abilityOperations.js and gunslingerOperations.js.

## Ownership audit at 0.31.0

Engine 0.31.0 owns the eight Callings and 32 Paths, the 248 equipment and 316 spell definitions, and shared rules in the Calling, core, combat, equipment, spells, vitality, resources, progression and dedicated Training modules. It consumes resolved context so a future Loom host can supply its own state. The backend supplies authorization, clocks, recorded events, equipped instances, RNG, transactions, receipts and persistence. The frontend consumes projected game state and uses engine dice and point-buy functions. At 0.31.0, the frontend used engine dice and point-buy helpers.

| Backend function or branch | Remaining rule or host responsibility |
| --- | --- |
| rules2024/engine.replay | Portable choices and grants remain, including remaining grant schedules and prepared-spell replacement rules. Gray Net and Shipwright folio and signature eligibility use shared rules. Replay owns event ordering, pending choices, errors and persisted ledger contracts. Add successful and rejected replay cases per isolated rule and consume portable grants from the engine. |
| rules2024/gunslingerOperations.apply | Suppressing Fire target cap and control payload use the engine. Crossing Denied trigger validation, equipped weapons, hit IDs and ammunition are hosted. Recoil and related conditional outcomes still need complete ownership review. |
| rules2024/navigatorOperations.apply | Starwake and Mangrove branches still mix tactical payload rules with target verification, live concentration and recorded-hit evidence. Passage scaling and Mangrove Vanish arithmetic are shared. |
| rules2024/reaverOperations.apply | Remaining range/eligibility and feat-specific payload rules include Thunderous Landing and Chainbreaker Escape. Rage, live effects and event journals are host state. |
| rules2024/corsairOperations.apply | Envoy target caps and command range are shared. Portions of Lantern eligibility still live in the handler. The host needs resolved targets and the saved strike event. |
| rules2024/wardenOperations.apply and abilityOperations.activate | Free Port save arithmetic is shared. Abjure target cap remains. Leviathan Burden damage splitting uses the engine. Effect lifetime, action costs and journals are hosted. |
| rules2024/damageRiders.apply and cinderOperations.apply | Potent Spellcasting vitality and Cinder target/save outcomes are shared. Other rider outcomes and Cinder radius/handling rules remain portable candidates. Keep source casts, object contexts and resolved target sets in the host. |
| rules2024/selections.project and spell/feat operations | Some portable projection rules remain in runtime, including aura branches; Exhaustion movement is shared. Canonical source and suppression resolution require active state. A complete pass over those functions remains necessary. |
| characters/commands and receipt handler | Context resolution, revision validation and transactional persistence are host responsibilities. Relevant typed command tests exercise historical replay and atomic rollback. |
| spellOperations.cast smite contract | Current hit evidence, slot spending and protection continue as before. Future damage automation is an explicitly deferred design decision. See Pass 35. |

## Cleanup

Removed only obsolete vendored engine archives absent from both current manifests and lockfiles and verified temporary Phase 2 test-output files. The engine repository had no matching disposable files. Preserved current archives, package locks, prior checkpoints, source provenance, all regression probes and user working-tree changes. The list below contains every removed repository file.

```text
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.10.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.11.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.12.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.13.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.14.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.15.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.16.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.17.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.18.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.19.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.20.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.21.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.22.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.23.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.24.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.25.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.26.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.27.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.28.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.29.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.3.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.4.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.5.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.6.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.7.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.8.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\vendor\crossworld-sanguine-engine-0.9.0.tgz
C:\Users\Romain\projects\Crossworld Creative\archipelago\phase2-final-tests.tmp
C:\Users\Romain\projects\Crossworld Creative\archipelago\phase2-push-tests.tmp
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.10.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.11.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.12.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.13.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.14.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.15.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.16.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.17.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.18.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.19.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.20.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.21.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.22.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.23.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.24.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.25.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.26.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.27.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.28.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.29.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.3.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.4.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.5.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.6.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.7.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.8.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\vendor\crossworld-sanguine-engine-0.9.0.tgz
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\phase2-campaign-focused.tmp
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\phase2-final-tests.tmp
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\phase2-focus-output.tmp
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\phase2-magic-output.tmp
C:\Users\Romain\projects\Crossworld Creative\crossworld_backend\phase2-push-tests.tmp
```

## Previous verification at 0.30.0

Engine 0.30.0 resolves in both applications. The only remaining vendored archive in each consumer has SHA-256 `c5c5c2216cb0400b0b992f5d4bb0ca559bcf3a4af5eb9b8d54ded85bd6326e04`. Both lockfiles match computed SHA-512 `sha512-JmTHk3TVGZJfiXpdlDPbu5ogh9sCSu4+Fa891UDAi8Ot21Hj8gzWUIVzdrp/8DW4hj5NRxRKLgs9ujrn8OlKXg==`.

| Suite | Passed | Failed | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 87 | 0 | 0 | 0 |
| Backend | 638 | 0 | 0 | 1 |
| Frontend | 113 | 0 | 0 | 0 |

Both lint checks, the frontend production build and 263 backend syntax checks passed. The existing chunk-size warning remains. Engine and backend Archipelago dependency graphs each have zero cycles. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset. The HTTP catalog identity check passed and both catalog hash and ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`. The backend suite exercised historical receipt replay, typed command authorization, stale revisions and atomic rollback.

## Exit criteria

| Criterion | Status |
| --- | --- |
| Engine owns the roster, equipment and spells | Verified through package catalog tests and roster comparison |
| Package, lockfiles and vendor archives agree | Verified |
| Repository temp output and obsolete vendor archives removed | Verified for the cleanup paths recorded here. Archives are removed after both manifests and both lockfiles stop referencing them |
| Canonical effect identity, typed commands, historical replay and transaction guarantees | Existing tests passed |
| Frontend consumes shared rules and backend projections | Completed the Rules2024 review across 49 files. Creator, roll, combat, equipment, spell and rest controls use the engine and backend projections |
| Engine and backend dependency direction | Zero internal cycles in the audited graphs |
| Deferred gameplay contracts | Smite damage contract remains documented separately |
| Available regression probes match baseline | All 22 available digests matched at final acceptance, including the catalog |
| Reproducible rest regression evidence | 3,707 observations matched across repeated runs. The original 2,640-row digest is retained as HISTORICAL — EXACT RERUN UNAVAILABLE |
| All portable mechanics have exactly one engine owner | The 0.68.0 review records the engine owner for the identified portable rules and the scope of the evidence |
| Every remaining backend gameplay function justified as host orchestration | Function-level review recorded through 0.68.0. Host boundaries include context, auth, RNG, clocks, effect identity, transaction records and persistence |

The named Magic Initiate, Entrenched Drill, Reef Colossus and Omen Diver extraction paths are implemented. The final acceptance section closes Phase 3 on the verified replacement rest baseline and the documented historical limitation. The Lineage starting point for Phase 4 is the shared character creation and progression contracts.

## Regression hashes at 0.30.0

All 38 Pass 36, 41 treatment, 12 attack, 91 execution, 494 fixed-roll, 1,210 roster and 31,690 retained observations matched. The SHA-256 results below are from the final package.

~~~~text
final-ownership
38 d831fbc13f396c0043df97e739b1be0b8a435cc960b02eb315e0686fd3cf5209
treatment
41 9e0de002dec398bb983abb9ae263359d61416b5d6620cf861f1c6f633273b8c9
attack
12 e61a217d713d0a549f0c75e2a8b9fffb257ce52118cbc0a1b2e8fa85341f1c4f
execution
91 1f9982a16e973410555b777ebce11eac49a5bd23399501e5aa60a4f1a992b4cc
roster
reaver 160 eb901d702a0659b8276e799faddec1d048b59d9a684c2c4f5d516d18b49bd9c5
corsair 135 c246f3975ad4ce1e18a0dbb037033d738c5d7db2ee6b35d6d1fdf161641c4993
navigator 145 8394fb3ba27a8479b7165e5110c40836dc288cc970c54e09b1b728bbfad22a62
warden 160 ed9f141f89f154cc732b26d609c6d821078f50e72cd60424e782dd91fb006f18
tidecaller 160 3f1cfe16716dc493630239e79a55f76303d93367e64c7426ee160c496edf119e
doctor 156 d8c5ca674ab1f3cedca5095929c81639a76d6dca441c86374b2e620ad1496613
shipwright 134 fac3ac5cdd56c0e1e18a2b2e2171a970e10e1b0124cbba94b3aa3270e3444940
gunslinger 160 afa0c4cc48342029c6fd16a8c8df46051a54be5c53c1bd589c315d3e0903aeef
catalog e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144
generic-activation
55 495 36c988c5a45fc54ef1875e49465d532c4bebf8d45563fd44663cdce16b5f80c8
[]
effect-identity
56 bd033514241f33a79cb49defdcff723291ede73e5817434377961385a2720810
saving-throws
4275 eef4ae8fadc43ba9b2c419d760135b578d6592bd2c38a230908411cd024c71c3
concentration
8544 cbd55f5b4e6f5742a3165810957e901bf27c1ed73812edd50795023fd02ac383
damage-features
2410 fc1954b6454c498d2e278c625bd0493fb2649882d337f21fb71da65be8db3656
damage
8910 cf44472be92880c609b87d34232bef37ef4eef8277417c62b832f550f4e585e6
vitality
3960 cf1d952ad06d55319577f1ddff86dbacd27570ffba6784ad3cca88b470a28a91
gunslinger
400 31b4cbbda34da8c80d32ffd72529896edae37c49bb39c8c20298dd070931ca7d valid activation captured
rest
2640 7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b
fixed roll 494 c7013244d3313491f31dc4ca05e9a520577576728cf73225e66a5fa0453404c8
~~~~

## Further extraction at 0.31.0

- Shared rules now own Gray Net's Hunter Prey and Defensive Tactics choices, Shipwright folio counts, Powder Saint Savant counts, and Shipwright Spell Mastery and Signature Spell eligibility. Ledger replay still determines the recorded choice order and applies the same errors.
- The engine owns Envoy target limits and command range, Free Port save and reroll arithmetic, Exhaustion movement penalties, Potent Spellcasting vitality amount, and Cinder Artillerist exemptions and target outcomes. Hosts retain target and area evidence, RNG, resource mutation and journals.
- Engine files: package.json, README.md, tests/execution.test.cjs, src/callings/rules.js, src/callings/shipwright/folio.js, src/callings/navigator/paths/gray-net.js, src/callings/corsair/paths/black-flag-envoy.js, src/callings/warden/paths/oath-of-the-free-port.js, src/callings/gunslinger/paths/cinder-artillerist.js, src/callings/doctor/tactics.js and src/equipment/movement.js.
- Backend under src/modules/archipelago/system/rules2024: engine.js, corsairOperations.js, wardenOperations.js, selections.js, damageRiders.js and cinderOperations.js. Both consumers updated package.json, package-lock.json and the vendor archive. No frontend gameplay implementation changed.
- Removed crossworld_backend/vendor/crossworld-sanguine-engine-0.30.0.tgz and archipelago/vendor/crossworld-sanguine-engine-0.30.0.tgz after verifying neither lock nor manifest still referenced them. Paths are relative to the workspace root.

### Fresh audit findings

The backend still independently owns numerical branches. Examples include Abjure Foes' target cap in abilityOperations.activate, Chainbreaker Escape's check in reaverOperations.apply, Cinder radius eligibility in cinderOperations.activate, and aura projections in selections.project. These are existing portable rules and still prevent Phase 3 closure. Smite remains a separately deferred gameplay contract.

### Verification at 0.31.0

| Suite | Passed | Failed | Timed out | Skipped |
| --- | ---: | ---: | ---: | ---: |
| Engine | 88 | 0 | 0 | 0 |
| Backend | 638 | 0 | 0 | 1 |
| Frontend | 113 | 0 | 0 | 0 |

Both lint checks, production build and 263 backend syntax checks passed. The frontend retains its existing bundle-size warning. Engine and backend Archipelago dependency graphs each have zero cycles. Isolated MongoDB was skipped because SA_PHASE2_TEST_MONGO_URI was unset.

The retained hashes above all matched on 0.31.0, including 38 ownership, 41 treatment, 12 attack, 91 execution, 494 fixed-roll, 1,210 roster and 31,690 retained observations. Catalog hash and HTTP ETag remain e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144. The backend suite exercised historical receipts, stale revisions and rollback.

Both applications resolve 0.31.0. Archives are byte-identical at SHA-256 `08489bbba240a5c69a156f705a83d3319dfd193fb04e5afa218da69ae20b8988`. Both lockfiles match `sha512-H3Y6jt89Yq/ny6SusawVJDV2hMHiWKgjOai4jkmVqVjZROgYMdWMohZEkRiGYBB06rkKeNCaEacQgmKjqGCCmw==`.

## Structural migration at 0.32.0

The active backend directory `system/rules2024` and the separate `characters/rules2024.js` persistence module have been retired. Production imports use the destinations below. The `SA-CHAR-1` wire contract, ledger version, historical ruleset metadata and public routes retain their existing identifiers. The SRD source snapshot and attribution are under `crossworld_backend/docs/srd-provenance/`. The engine retains its own SRD attribution.

| Destination under backend Archipelago | Relocated responsibility and modules |
| --- | --- |
| `system/` | `characterSystem` composes the public host boundary. `blueprint`, `catalog` and `rules` assemble and serialize catalog projections. `definitions/strikeOptions` supplies the current strike choices. |
| `characters/advancement/` | `ledger` (formerly `engine`) replays persisted decisions in order. `creation` and `definitions/creation` resolve the creation payload, Roots catalog and starting choices. |
| `characters/persistence.js` | Loads, saves and decorates character documents, including legacy persisted fields and rebuild state. |
| `characters/runtime/` | `runtime`, `runtimeValidation`, `runtimeJournals`, `selections`, `selectionOperations`, `resourceTransitions`, `resting` and `featState` handle live character state, journals, replacement records and projected options. |
| `characters/abilities/` | `abilityOperations`, `abilityOptions`, `casterPathOperations`, `cinderOperations`, `conduitOperations`, `corsairOperations`, `covenantOperations`, `covenantState`, `featOperations`, `featureOperations`, `grayNetOperations`, `gunslingerOperations`, `navigatorOperations`, `reaverOperations`, `utilityOperations` and `wardenOperations` dispatch abilities, resolve host evidence and apply state changes. |
| `combat/` | `agilityChecks`, `attackRecords`, `damageRiders` and `strikeOperations` handle adjudication inputs, RNG and combat action records. |
| `combat/effects/` | `clock`, `effectTime` and `healingEffects` manage effect timing and apply resolutions to targets. |
| `combat/vitality/` | `healthState` and `vitality` manage live Health, damage, healing and condition instances. |
| `equipment/` | `startingEquipment` (formerly `equipment`), `equipmentView` and `toolChecks` issue inventory, resolve loadout facts and record checks. |
| `spells/` | `castingTurn`, `contingency`, `folioOperations`, `healingSpells`, `metamagic`, `slotCasting`, `spellComponents`, `spellMaterials`, `spellOperations`, `spellRerolls`, `spellSlotState` and `definitions/contingencySpells` handle casting evidence, resources, material inventory and spell records. |

Engine 0.32.0 now owns the canonical feat catalog and operation option definitions, the Calling equipment packages and selection rules, and the condition and damage type definitions. It also owns the following rules moved out of the backend.

- Warden Abjure Foes caps and aura values for Holy Nimbus, Iron Covenant, Free Port and Lantern Vigil.
- Reaver Chainbreaker Escape check results and Thunderous Landing eligibility and outcomes.
- Cinder charge radii, Brass Outrider Recoil and walking range, Starwake Guide and Homeward targeting, and Hollow Lantern range and Last Tell eligibility.
- Advancement movement and replacement limits for cantrips and prepared Tidecaller spells.
- Condition suppression, petrification modifiers and the conditions that immobilize a character.

The frontend Charge and Strike controls now use engine helpers for radius, exemption limits and strike dice previews. Persistence and accepted command envelopes remain on the backend. Engine functions use supplied facts and dice results.

Removed the superseded `crossworld_backend/vendor/crossworld-sanguine-engine-0.31.0.tgz` and `archipelago/vendor/crossworld-sanguine-engine-0.31.0.tgz` after verifying both manifests and lockfiles reference 0.32.0. The 0.32.0 archives are byte-identical, with SHA-256 `e4b9ea39037b8d4d5ea86dbdbd44e8e2c29ccf029937469007cef5ece39a1a3c` and lockfile integrity `sha512-FezZJANBoV7DbOdH7DhNezXJIHPAHghFJaTSXUcHp5C4dOdT6dclijNJsNrSairIWKgG9KXPDe9Er/Vk1x3BCw==`.

### Remaining ownership gaps

The directory-retirement criterion passes. Phase 3 still requires engine ownership of portable mechanics found in the relocated code. Examples include Calling and feat grant branches, skill modifiers and resistance progression in `characters/advancement/ledger.js`, Rage skill progression and several Path projections and ability gates in `characters/runtime/selections.js`, and spell and feat calculations inside operation handlers. Frontend strike thresholds and a save-damage fallback also require review for shared ownership. The older ownership table above records the pre-migration audit under the former paths.

Hit-triggered Smite damage stays deferred as documented in Pass 35. Existing casting and resource expenditure were preserved.

### Verification at 0.32.0

| Suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Engine | 90 | 0 | 0 |
| Backend | 638 | 0 | 1 |
| Frontend | 113 | 0 | 0 |

Both lints, the frontend production build and 259 backend source, script and test syntax checks passed. Both dependency graphs have zero cycles. The frontend build retains the bundle-size warning. The isolated MongoDB run was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. The backend suite exercised authenticated commands, receipt replay, stale revisions, effect identity and atomic rollback.

All retained hashes above match at 0.32.0. This covers 38 ownership, 41 treatment, 12 attack, 91 execution, 494 fixed-roll, 1,210 roster and 31,690 retained observations. Catalog hash and HTTP ETag remain `e94b607429ad6b3c76e547255fe07f87fccc3d4f80e18d5284c23e714e7a0144`.

| Exit criterion | Status |
| --- | --- |
| Active backend `rules2024` directory and production imports | Retired |
| Fully engine-owned portable mechanics, including remaining SRD-derived rules | Open |
| Backend restricted to host responsibilities | Open |
| Frontend uses engine or authoritative projections for every gameplay calculation | Open |
| 8 Callings and 32 Paths through level 20 | Verified |
| 248 equipment and 316 spell definitions | Verified |
| Persisted contracts, historical receipts, typed commands and atomic state | Verified in the backend suite, with isolated MongoDB environment skip |
| Retained regression matrices | Matched |
| Full suites and dependency cycles | Passed, with isolated MongoDB environment skip and zero engine or backend Archipelago dependency cycles |
| Consumer archives and lockfiles | Verified |
| Verified obsolete archives and retired runtime files | Removed |
| Deferred Smite decision | Documented in Pass 35 |
