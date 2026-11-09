# Resources, rests and recovery

Rechargeable resources store spent uses separately from maximum capacity. Available=max(0, maximum−spent), plus explicitly eligible temporary capacity. Health and consumable item charges store current values. Creation begins full. Advancement preserves expenditures rather than refilling or preserving a percentage. On a maximum decrease clamp available and spent to the new maximum. Health follows creation.md, preserving missing Health; temporary Health never increases ordinary current or maximum Health.

## Calling resources

| Canonical pool | Maximum and unlock | Short Rest | Long Rest |
| --- | --- | --- | --- |
| gunslinger:second-wind | 2 at 1; 3 at 4; 4 at 10 | Recover 1 | All |
| gunslinger:action-surge | 1 at 2; 2 at 17; at most once per turn | All | All |
| gunslinger:indomitable | 1 at 9; 2 at 13; 3 at 17 | None | All |
| navigator:favored-enemy | 2 at 1; 3 at 5; 4 at 9; 5 at 13; 6 at 17 | None | All |
| navigator:tireless | max(1, Instinct modifier), at 10 | None; rest removes one Exhaustion level | All |
| navigator:natures-veil | max(1, Instinct modifier), at 14 | None | All |
| tidecaller:innate-sorcery | 2 at 1 | None | All |
| tidecaller:sorcery-points | 0 at 1; Calling level at 2+ | At 5+, restore floor(level/2) once per Long Rest | All |
| tidecaller:restoration | 1 at 5; spend only on completed Short Rest | None | All |
| warden:lay-on-hands | 5×Calling level points | None | All |
| warden:channel-divinity | 2 at 3; 3 at 11 | Recover 1 | All |
| warden:smite-free | 1 at 2; base-level Divine Smite cast | None | All |
| warden:steed-free | 1 at 5; base-level Find Steed cast | None | All |
| reaver:rage | 2 at 1; 3 at 3; 4 at 6; 5 at 12; 6 at 17 | Recover 1 | All |
| reaver:persistent-reserve | 1 at 15; genuine initiative restores all Rage uses | None | All |
| doctor:channel-divinity | 2 at 2; 3 at 6; 4 at 18 | Recover 1 | All |
| doctor:intervention | 1 at 10; eligible Doctor spell of level ≤5, not Reaction casting | None | All; Wish at 20 instead incurs 2d4 Long Rests cooldown |
| shipwright:arcane-recovery | 1 at 1; recover missing ordinary slots, summed levels ≤ceil(level/2), individual slot ≤5 | Spend this counter to recover slots | Counter restored |
| corsair:stroke-of-luck | 1 at 20 | All | All |

Favored Enemy spends its counter instead of a slot to cast Hunter's Mark; it still requires the spell's action, components and Concentration. Tireless spends its counter as an Action for 1d8+Instinct modifier temporary Health, minimum zero. Nature's Veil spends its counter as a Bonus Action, Invisible until the end of the next turn. Full ability text in abilities.md remains binding.

Ordinary spell slots use spells.md capacities. Arcane Recovery cannot recover more than is missing. Font conversion: no action, spend one slot of level n to regain n Sorcery Points. Reject conversion if the full amount would exceed capacity; do not waste a slot silently. Bonus Action slot creation uses these level/cost/minimum-Tidecaller-level triples: 1/2/2, 2/3/3, 3/5/5, 4/6/7, 5/7/9. Created slots are distinct temporary slots, expire on Long Rest and never unlock higher-level spells. They may be converted back subject to the same maximum.

Omen Diver wings restore a spent counter for 3 Sorcery Points, no action, without activating it. Bloodwake presence restores a spent counter for one Rage use, no action. Leviathan Anchor Nimbus restores for one level-five slot, no action. The three original Warden Path capstones restore their counters with one level-five slot as a Bonus Action. No restoration is permitted while its counter is already full.

Relentless Rage's save DC starts at 10, increases by 5 after each attempt and resets on Short/Long Rest; success restores Health to twice Reaver level. Persistent Rage at 15 removes round-extension requirements but retains the printed ten-minute maximum and termination on Unconscious or Heavy armor. Its initiative reserve has a separate once-per-Long-Rest counter. The client cannot fabricate repeated initiative IDs to restore resources.

## Path resources

All following pools recover fully on a Long Rest. Short recovery 1 means restore one spent use, all means full, none means zero. A pool is granted only with its owning Path and feature level. References to Channel Divinity, Sorcery Points and Lay On Hands always bind to the parent pool, not a new Path copy. Table shorthand '2at3' means maximum 2 at Calling level 3.

| ID | Unlock | Maximum | Short recovery |
| --- | --- | --- | --- |
| black-flag-envoy:envoy | 3 | 3 | 1 |
| black-flag-envoy:parley | 13 | 1 | none |
| hollow-lantern:lantern | 3 | 3 | 1 |
| hollow-lantern:last-tell | 17 | 1 | all |
| saltglass-duelist:duel | 3 | 3 | 1 |
| saltglass-duelist:perfect-measure | 17 | 1 | none |
| iron-suppressor:suppression | 3 | 4 | all |
| iron-suppressor:hold-corridor | 18 | 1 | none |
| brass-outrider:outrider | 3 | 3 | all |
| brass-outrider:horizon | 18 | 1 | all |
| cinder-artillerist:charge | 3 | 3 | all |
| cinder-artillerist:battery | 18 | 1 | none |
| starwake-pilot:passage | 3 | 3 | 1 |
| starwake-pilot:homeward | 15 | 1 | none |
| mangrove-stalker:thicket | 3 | 3 | 1 |
| memory-echo:echo | 3 | 3 | 1 |
| memory-echo:unwritten | 18 | 1 | none |
| tempest-heart:pulse | 3 | 3 | 1 |
| tempest-heart:tempest | 18 | 1 | none |
| sanguine-conduit:conduit | 3 | 3 | 1 |
| sanguine-conduit:transfusion | 6 | 1 | none |
| sanguine-conduit:unbroken-current | 18 | 1 | none |
| oath-of-the-free-port:open-harbor | 20 | 1 | none |
| iron-covenant:covenant | 15 | 3 | 1 |
| iron-covenant:standard | 20 | 1 | none |
| lantern-vigil:dawn | 20 | 1 | none |
| thunderhide:stormhide | 3 | 3 | 1 |
| chainbreaker:freedom | 3 | 3 | 1 |
| chainbreaker:none-kneel | 14 | 1 | none |
| reef-colossus:colossus | 3 | 3 | 1 |
| reef-colossus:colossus-reserve | 14 | 1 | none |
| plaguewarden:clean-bill | 17 | 1 | none |
| keeper-of-last-breaths:vigil | 3 | 3 | 1 |
| keeper-of-last-breaths:one-dawn | 17 | 1 | none |
| sparkwrite-aetherist:relay | 3 | 3 | 1 |
| drydock-ghost:ghost-work | 3 | 2at3,3at7,4at11,5at15,6at19 | 1 |
| storm-broker:squall | 3 | 2at3,3at7,4at11,5at15,6at19 | 1 |
| field-surgeon:triage | 3 | 2at3,3at7,4at11,5at15,6at19 | 1 |
| breakwater:bastion | 3 | 2at3,3at7,4at11,5at15,6at19 | 1 |
| omen-diver:wings | 14 | 1 | none |
| omen-diver:companion | 18 | 1 | none |
| bloodwake:presence | 14 | 1 | none |
| leviathan-anchor:nimbus | 20 | 1 | none |
| drydock-ghost:salvage | 6 | 1 | none |
| storm-broker:eye-reserve | 15 | 1 | none |
| field-surgeon:operation | 17 | 1 | none |
| breakwater:hold-sea | 14 | 1 | none |


Spell Mastery is unlimited and has no expenditure counter. Each Signature Spell has its own one-use Short/Long Rest counter; each Magic Initiate grant has its own one-use Long Rest counter. Feat counters use feat:<grantKey>:<clause>. Any other explicitly limited feature has a counter keyed by its source ability/option, never an unrestricted generic refill.

Powder Saint Overchannel stores an escalating use count, reset on Long Rest. First use causes no backlash; second causes 2d12 Necrotic damage per spell-slot level, then each further use adds another 1d12 per slot level. Backlash ignores Resistance and Immunity. Save/reload and advancement preserve the count.

Triage allows one treatment per target per Short/Long Rest across all surgeons in this edition. Store targetRestEpoch and treatment lock. External tabletop targets require a GM-confirmed opaque ID and rest epoch; changing the target's name cannot bypass the lock. Cross-character healing uses one transaction or idempotent outbox, preventing duplicate costs/results on retry.

## Rests, time and temporary effects

A Short Rest lasts one hour with no more than light activity. Spend available Hit Dice one at a time; each heals its roll+Resolve modifier, minimum zero, capped at maximum Health. Store the accepted roll once so retries cannot reroll it. Apply listed recovery only once per completed rest ID.

A Long Rest lasts eight hours, including six hours' sleep and no more than two hours' light activity. Benefit at most once per 24 hours and require at least 1 Health at its start. Restore all Health, all Hit Dice (2024 rule), ordinary slots and the named counters; reduce Exhaustion by one with appropriate food/water. A dead creature cannot rest. Track start/completion world time and GM-recorded interruptions. Use SRD Long Rest interruption timing; an uncompleted rest is not a free recovery command.

On Long Rest, expire temporary spell slots before refilling ordinary slots. Effects expire by world time, not just on reload. A Short Rest does not erase unexpired effects solely because a rest occurred. Temporary Health lasts until depleted, replaced or Long Rest unless its source ends it earlier. Rage, Concentration, objects, cooldowns and Inspiration retain source IDs and expiration/event state.

Reject unknown pools, negative/fractional expenditures, integer overflow, insufficient resources, unowned features and invalid repeated rest events atomically. A privileged GM adjustment must log its reason; owners cannot directly edit maxima or bypass recovery restrictions.
