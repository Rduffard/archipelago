# Sanguine Archipelago — Phase 4, Pass 1

## Lineage design and mechanical contracts

Status: Lineage roster and Beastshifter engine foundation implemented in Sanguine Engine 0.69.1. Ledger v4 and the integration contracts remain implementation targets.

| Status | Decision |
| --- | --- |
| Confirmed | Exactly six playable Lineages. Lineage is independent of Roots, Calling, and Path. Attribute increases stay with the current creation rules. The creator keeps its isometric direction and future eight-facing sprite requirement. |
| Verified | Engine 0.68.0 has Training, feats, spell sources, progression, vitality, rest, and equipment movement exports. Backend uses schema 1, SA-CHAR-1 and ledger 3. The live creator has ten steps and a neutral size choice. |
| Proposed | Keep SA-CHAR-1 as the protocol version, introduce a new ledger version for Lineage characters, and keep old ledgers replayable. Use the existing source-keyed feat, spell, pool, and effect patterns. |


## Sources and rules shared by all six

The Human, Dwarf, and Elf profiles below use the 2024 rules as published in the repository-cited [System Reference Document 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf), species entries and rules glossary. This work adapts the System Reference Document 5.2.1 by Wizards of the Coast LLC under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Sanguine adapts terminology and presentation. Preserve source IDs, attribution, and modification notices with any catalog shipped to consumers.

Fishmen and Changelings use original Sanguine rules inspired by 5e aquatic and shapechanging lineages. Their published mechanical contracts are the profiles below.

All six retain the existing Common, cultural Roots language, and one additional standard-language model. A trait that enables communication confers exactly the stated capability. Point buy remains six base values 8–15 on a 27-point budget, Origin contributes +1 and Background contributes +2 or +1/+1, with the current creation cap of 17. Lineage adds no permanent attribute increases, Calling prerequisites, or Paths. There are no lifespan mechanics in this pass. Ordinary swimming and climbing remain possible under the table's movement rules without a dedicated speed. A projected speed of zero for a mode means no dedicated speed. Movement, senses, and resistances outside the entries below use ordinary character rules. Dedicated Lineage flight and climbing are available only in eligible Beastshifter animal forms.

**Training bonus** is the existing character-level bonus (+2 at 1–4, +3 at 5–8, +4 at 9–12, +5 at 13–16, +6 at 17–20). Innate spell DC is 8 + Training bonus + the chosen attribute modifier. The spell attack modifier is Training bonus + that attribute modifier. Spell definitions supply casting time, range, targets, components and concentration.

## Roster and starting choices

| Lineage | Source profile | Type and base size | Base speed | Choices at creation |
| --- | --- | --- | --- | --- |
| Human | 2024 Human | Humanoid, Small or Medium | Walk 30 ft | Size, one skill, one eligible Origin feat and its required options |
| Fishmen | Original Sanguine, 5e-inspired | Humanoid, Medium | Walk 30 ft, swim 30 ft | Wit, Instinct, or Spirit for innate spells |
| Stoneborn | 2024 Dwarf | Humanoid, Medium | Walk 30 ft | None |
| Fey-Touched | 2024 Elf | Humanoid, Medium | Walk 30 ft, or 35 ft for Greenwake | Heritage, one eligible skill, Wit/Instinct/Spirit, with the Glasslight cantrip initially fixed |
| Beastshifters | Original Sanguine animal transformation | Humanoid, Small or Medium | Walk 30 ft | Size, one instinct skill, one eligible animal form |
| Changelings | Original Sanguine, 5e-inspired | Fey, Small or Medium | Walk 30 ft | Base size and two eligible skills |

The following player-facing descriptions and trait names are proposals. Thult and Rukka are established Fishmen settings. The Yuma doctrine and Lilin mastery documents describe institutional approaches to training and magic. Individual origins may draw from those traditions. Suggestions about inherited magic and personal expression establish no new historical event, faction, or exclusive homeland.

### Human

Human communities run from Yuma workshops to island harbors where a single crew might carry the habits of several ports. A Human character's ways of solving a problem come from the life they have led and the people who taught them.

- **Make Tomorrow Count.** Completing a Long Rest grants one Heroic Inspiration. Use the existing Inspiration state and immediate reroll path. The new die replaces the original. Awarding a second instance leaves the first held and permits the source's optional transfer to an eligible party member. Use an explicit recipient and the established authenticated multi-character transaction pattern if transfer is automated. Ordinary advancement and Short Rests grant nothing. Fresh-character initial Inspiration follows the existing creation policy until the first completed Long Rest.
- **Quick Study.** Add one skill Training selection from the character-rules skill catalog.
- **Many Trades.** Add one Origin feat. Reuse the existing feat catalog and prerequisites, grant eligibility, repeatability, and options. A repeatable feat with list restrictions still follows those restrictions. Give this grant its own key so its choices, resources, and rest or level replacements are independent of the Background feat.

### Fishmen

The Thul'tari tend submerged caverns and floating gardens where underwater and surface routes meet. A Fishman raised on Rukka or in another port can share the same ease in the water and have an entirely different relationship to the shore.

- **Two-Water Breath.** Breathe both air and water.
- **Deepwater Eyes and Coldwater Hide.** Darkvision 60 ft and cold damage resistance.
- **Current Speech.** Convey simple ideas to swimming Beasts, Elementals and Monstrosities with a swim speed. Their understanding does not make their replies intelligible. Eligibility and interpretation are GM-facing unless the encounter already supplies the needed creature facts.
- **Pressure Song.** Grants Fog Cloud at level 1, Gust of Wind at 3 and Water Walk at 5. Each unlock has one free casting per Long Rest, tracked separately, and can also be cast with an appropriate spell slot. Choose one casting attribute at creation. There is no slot creation or ordinary Calling preparation cost. The spell catalog identifies Gust of Wind as level 2 and Water Walk as level 3. Free access at a character-level milestone is independent of available ordinary slot levels.

### Stoneborn

A Stoneborn standing on a worked quay can listen through the same material that carries the impact of a dropped tool. This affinity can matter equally to a deckhand, craftsperson, or scout. Craft training belongs to the character's Roots and choices.

- **Deep Sight.** Darkvision 120 ft.
- **Hard to Poison.** Poison damage resistance and Advantage on saves to avoid or end Poisoned. Damage resistance and save Advantage are separate. Qualify the save by what it prevents or ends, regardless of the attribute used.
- **Built to Endure.** Add total character level to maximum Health after deriving the existing Calling contributions. At level 1 this is +1. Apply the ordinary maximum-Health reconciliation on advancement and rebuild. Hit Dice and Temporary Health use their existing formulas.
- **Stone Listening.** Bonus Action, Training bonus uses per Long Rest. For ten minutes, grant 60-ft tremorsense usable while touching a natural or worked stone surface. Apply the glossary's shared-surface and movement constraints to detection. Tremorsense does not count as sight. Losing contact suspends detection while its timer continues. Visibility and material geometry stay with the GM or encounter host. Repeated use refreshes the same timed sense without stacking range.

### Fey-Touched

Some people grow up with small phenomena close at hand: lights that answer attention, a familiar cadence that carries into meditation, or a path through growth that always seems to open at the right moment. A Lilin teacher might give those experiences ritual language. That instruction is part of Roots, alongside the inherited traits below.

- **Waking Reverie.** No sleep requirement, immunity to magical sleep, and Long Rest completion after four hours of conscious meditation. Use the existing rest clock, interruption and recovery rules with an explicit mode. Under the proposed integration, interruptions add the current per-interruption time to the four-hour baseline. Preserve the 24-hour recovery interval, health eligibility, interrupted Short Rest handling and host time validation. Ordinary Long Rests remain an option. Other sleep effects follow their own rules.
- **Old Accord.** Advantage on saves to avoid or end Charmed.
- **Keen Ear.** Choose Training in Read (`insight`), Perception, or Track (`survival`).
- **Inherited Current.** Choose one heritage and one casting attribute. Base darkvision is 60 ft. Each spell gained at character level 3 or 5 stays available from its Lineage grant, carries its own one-use Long Rest pool, and is castable with an appropriate ordinary slot. Cantrips use their ordinary spell terms and consume no pool. For Glasslight, Prestidigitation is the initial grant. A different eligible Wizard-list cantrip can first be selected after finishing a Long Rest. In the creator, show Prestidigitation read-only and ask only for heritage, skill, and attribute. Use the catalog's verified Wizard-list membership mapping, with a parity check against the SRD before relying on Shipwright tags for that purpose.

| Proposed heritage | SRD branch | Level 1 | Level 3 | Level 5 |
| --- | --- | --- | --- | --- |
| Gloam | Drow | Darkvision 120 ft and Dancing Lights | Faerie Fire | Darkness |
| Glasslight | High Elf | Prestidigitation, swappable for a Wizard cantrip at Long Rest | Detect Magic | Misty Step |
| Greenwake | Wood Elf | Walk 35 ft and Druidcraft | Longstrider | Pass without Trace |

### Beastshifters

Beastshifters assume the bodies of actual animals. A wolf runs, tracks and bites as a wolf. The character retains their identity, memories, judgment and allegiances. Changelings separately alter humanoid appearance and voice while retaining their own capabilities. Beastshifter animal transformation is an original Sanguine rule inspired by Wild Shape.

**Instinct Training.** Choose one from Agility (`acrobatics`), Athletics, Threaten (`intimidation`), or Track. This Training persists in either body. Humanoid form uses standard vision.

#### Progression and choices

| Total level | Forms known | New eligibility | Uses per Long Rest |
| --- | ---: | --- | ---: |
| 1–2 | 1 | Small land animals | 2 |
| 3–4 | 2 | Medium terrestrial pursuit and tracking | 2 |
| 5–8 | 3 | Swimming and limited diving | 2 |
| 9–12 | 4 | Small flight | 3 |
| 13–16 | 5 | Large terrestrial forms with higher physical ceilings | 3 |
| 17–20 | 6 | Medium flight and longer dives | 3 |

Choose one eligible form at creation and one distinct eligible form at each subsequent milestone. At each milestone after creation, the player may also swap one previously learned form for another eligible form in the same advancement transaction. The final set must be unique and contain the required number. No swap during a rest or ordinary non-milestone advancement. A new tier opens choices, and forms from earlier tiers remain eligible. Every known form draws on the same pool. A newly created character starts full. Increasing the maximum or reconstructing an existing character preserves spent uses, capped at the new maximum. A form's printed stats stay fixed. Existing Training bonus progression applies to its strike and relevant trained checks or saves.

Level 3 shares a milestone with Path selection, so the new choice adds tracking or mobility and a single modest strike. Level 5 gives aquatic access alongside major Calling gains such as Gunslinger Extra Attack. The level 9 and 17 flight options exchange equipment and spell access for mobility. Level 13 gives a larger body and modest Guard and strike improvements. Level 20 retains level 17 form eligibility and the existing Calling capstone progression.

#### Canonical animal forms

All distances are feet. Physical columns give scores for Might, Agility, and Resolve, followed by base Guard. A dash means no dedicated speed. With no dedicated swim or climb speed, a form uses ordinary movement rules only where its anatomy permits. Every form uses Beast type and its listed size, cannot speak any language, merges carried and equipped gear, and follows the shared restrictions below. Sight, hearing and scent use ordinary perception rules within the specified exceptions. Scent and hearing Advantage apply to one relevant check and grant neither automatic location nor sight through barriers.

| Stable ID | Form | Level | Size | Walk / swim / fly | Might / Agility / Resolve | Guard | Senses, capabilities and limitations |
| --- | --- | ---: | --- | --- | --- | ---: | --- |
| `dock-rat` | Dock Rat | 1 | Small | 25 / — / — | 6 / 14 / 10 | 12 | Darkvision 30. Advantage on scent-based Track. Ordinary climbing on climbable surfaces, plus normal Small squeezing. No special access through sealed openings. |
| `dune-hare` | Dune Hare | 1 | Small | 40 / — / — | 6 / 16 / 10 | 13 | Standard vision. Advantage on hearing-based Perception. Ordinary jumping with form statistics. |
| `reef-fox` | Reef Fox | 1 | Small | 30 / — / — | 8 / 14 / 12 | 12 | Darkvision 30. Advantage on hiding checks in natural cover when hiding is legal. Can carry one light item in its mouth. |
| `gray-wolf` | Gray Wolf | 3 | Medium | 40 / — / — | 14 / 14 / 12 | 13 | Standard vision. Advantage on scent-based Track and hearing-based Perception. Can drag within normal limits. No pack-based attack bonus. |
| `salt-antelope` | Salt Antelope | 3 | Medium | 50 / — / — | 14 / 16 / 12 | 12 | Standard vision. Can jump using ordinary rules. Cannot carry a rider. |
| `river-otter` | River Otter | 5 | Small | 20 / 35 / — | 8 / 16 / 12 | 12 | Standard vision. Air breathing and 5-minute breath hold. Can retrieve a small loose object in its mouth. |
| `harbor-seal` | Harbor Seal | 5 | Medium | 10 / 40 / — | 14 / 12 / 14 | 12 | Standard vision. Air breathing and 10-minute breath hold. Can tow one willing creature within ordinary drag limits. |
| `gull` | Gull | 9 | Small | 15 / — / 40 | 6 / 16 / 10 | 12 | Standard vision. Winged flight. Can land on calm water using ordinary surface swimming. |
| `night-owl` | Night Owl | 9 | Small | 10 / — / 35 | 6 / 16 / 12 | 13 | Darkvision 60. Winged flight. Advantage on hearing-based Perception. |
| `ironback-boar` | Ironback Boar | 13 | Large | 35 / — / — | 16 / 10 / 16 | 15 | Standard vision. Advantage on scent-based Track. Can shove through the ordinary action if eligible. Gore never grants a free shove. |
| `black-bear` | Black Bear | 13 | Large | 35 / — / — | 16 / 12 / 16 | 14 | Standard vision. Dedicated climb 25 on traversable surfaces. Can drag within normal limits. |
| `sea-eagle` | Sea Eagle | 17 | Medium | 10 / — / 50 | 12 / 16 / 12 | 14 | Standard vision. Winged flight. Advantage on sight-based Perception in daylight. Cannot airlift creatures. |
| `deepwater-dolphin` | Deepwater Dolphin | 17 | Large | 0 / 50 / — | 16 / 14 / 14 | 13 | Air breathing and 15-minute breath hold. Blindsight 30 underwater via sound, blocked by barriers that block the sound path and disabled while Deafened or unable to emit sound. Zero walk means cannot move over land under its own power. Requires water deep and wide enough to hold its body. |

| Form ID | Natural attack | Attack modifier before situational effects | Damage on hit |
| --- | --- | --- | --- |
| `dock-rat` | Bite | Training + 2 (Agility) | 1d4 + 2 piercing |
| `dune-hare` | Kick | Training + 3 (Agility) | 1d4 + 3 bludgeoning |
| `reef-fox` | Bite | Training + 2 (Agility) | 1d4 + 2 piercing |
| `gray-wolf` | Bite | Training + 2 (Might) | 1d6 + 2 piercing |
| `salt-antelope` | Kick | Training + 2 (Might) | 1d6 + 2 bludgeoning |
| `river-otter` | Bite | Training + 3 (Agility) | 1d4 + 3 piercing |
| `harbor-seal` | Bite | Training + 2 (Might) | 1d6 + 2 piercing |
| `gull` | Peck | Training + 3 (Agility) | 1d4 + 3 piercing |
| `night-owl` | Talons | Training + 3 (Agility) | 1d4 + 3 slashing |
| `ironback-boar` | Gore | Training + 3 (Might) | 1d8 + 3 piercing |
| `black-bear` | Claw | Training + 3 (Might) | 1d8 + 3 slashing |
| `sea-eagle` | Talons | Training + 3 (Agility) | 1d6 + 3 slashing |
| `deepwater-dolphin` | Ram | Training + 3 (Might) | 1d8 + 3 bludgeoning |

All natural strikes use 5-ft melee reach and ordinary attack and Reaction rules, including target, Advantage, critical and damage resolution. Add one Training bonus to the attack. Use the ordinary action economy and check the actual prerequisites of each Calling feature. A natural strike is neither an equipped weapon nor an unarmed strike. It does not unlock extra attacks, offhand strikes, or weapon-specific riders. Effects keyed to a generic melee attack or hit can apply when their prerequisites are satisfied.

#### Transformation contract

| Area | Rule |
| --- | --- |
| Activation | Spend a Bonus Action and one available use. Require a living, conscious Beastshifter able to take that Bonus Action and in humanoid form. Select a known, eligible form with positive animal Health. Require legal space and any form-specific terrain. Direct swapping and refreshing an active form are unavailable. |
| Reversion | Voluntary reversion costs a Bonus Action. Zero animal Health, death and explicit authoritative termination force reversion without an action. Ordinary Incapacitation or Unconsciousness prevents actions without ending the transformation. |
| Duration and recovery | Form lasts indefinitely and persists through rests, session boundaries and reconstruction. Completing a Long Rest recovers transformation uses under the ordinary pool rules. Resting does not automatically heal any animal form. |
| Attributes and Guard | Replace Might, Agility and Resolve for current physical rolls and saves. Retain Wit, Instinct, Spirit, Training, Expertise, save Training, level, Calling, Path, grants and advancement. Use printed Guard as base. Apply ordinary compatible modifiers once. Suppress armor, shield, gear and alternative base-Guard formulas. The physical override cannot recalculate maximum Health, Hit Dice, permanent eligibility or resource maxima. |
| Health | Every known form has its own current and maximum Health. Entry and reversion preserve the recorded current value. Resolve mitigation and character Temporary Health once, then apply damage to animal Health and pass only excess to existing humanoid damage rules. Zero animal Health forces reversion. Ordinary compatible healing affects only the current body and cannot overflow. |
| Conditions and effects | Keep conditions, including Exhaustion and explicit movement restraints. Keep compatible active effects and their original timers. Suspend only terms whose anatomy, creature type or equipment requirements no longer hold, except where an effect's own rules explicitly end it. Check new targets using effective Beast type. Reversion restores only unexpired and eligible suspended benefits. |
| Senses and movement | Replace base movement and senses with catalog values. Use ordinary terrain costs, Dash, Exhaustion, movement effects and fall rules, with effect anatomy considered by the host. Suspend humanoid equipment speeds and permanent humanoid walk-linked movement grants. Carry movement spent across body changes under the existing movement budget. No free displacement from resizing. |
| Flight and dives | Winged flight requires clearance, has no hover, and cannot carry creatures or use merged gear. A form losing flight in the air follows normal falling rules. Dive timers use the continuous underwater interval and actual form limits. They do not refill on body change. Continuous underwater time starts on submersion, clears when the character reaches breathable air, and is evaluated against the current form or base profile on any body change. Underwater reversion tests the humanoid's breathing capability against that interval and uses existing suffocation rules. |
| Space and terrain | Require legal occupancy on entry, including normal squeezing where available. Forced reversion always removes the active form. If humanoid size cannot legally occupy the current space even while squeezing, mark placement pending since the body has reverted. Host chooses the nearest legal space reachable within the same unobstructed local space, with ties host-selected. If none exists, keep the character in place under existing restraint and hazard adjudication until a legal placement opens. No passage through a barrier, teleport, damage immunity, or continued form benefits. |
| Equipment and anatomy | Worn and carried inventory merges unchanged and is inaccessible. Suspend armor, shields, ammunition, attuned item benefits, gear-granted movement and item-use commands. Keep ownership, attunement, contents and quantities. Resume eligible benefits on reversion. No ordinary weapons, shields, tools, speech, or complex manipulation. Forms can vocalize naturally and interact with loose objects only as anatomy permits. Objects acquired outside merged inventory remain world objects, subject to ordinary carrying, dropping and capacity rules. An external object can never become part of merged inventory. On reversion it remains carried only if the humanoid can hold it under those same rules. |
| Spells and concentration | No spell casting in any mode, including innate spells, slots, scrolls, items, rituals and component-free casting. No new costs on rejected attempts. Existing concentration continues if otherwise legal. Continuing an existing effect can use normal action economy if no new casting, speech, item or incompatible action is required. Apply usual concentration saves using the active Resolve modifier and retained Training. |
| Advancement and rebuild | Evaluate permanent eligibility from the permanent sheet. Preserve a still-eligible active form and its Health. An authoritative change that makes it illegal ends it atomically. Replay reconstructs known forms separately from saved runtime Health and action costs. |


**Animal Health scaling.** Maximum Health is `baseHealth + floor((total character level - 1) / 2)`. Each form keeps its original base Health of 3–9. The bonus reaches 9 at level 20. A dash indicates a locked form.

| Form | Base | Level 1 | Level 5 | Level 9 | Level 13 | Level 17 | Level 20 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Dock Rat, Dune Hare | 3 | 3 | 5 | 7 | 9 | 11 | 12 |
| Reef Fox | 4 | 4 | 6 | 8 | 10 | 12 | 13 |
| Gray Wolf, Salt Antelope | 6 | — | 8 | 10 | 12 | 14 | 15 |
| River Otter | 5 | — | 7 | 9 | 11 | 13 | 14 |
| Harbor Seal | 7 | — | 9 | 11 | 13 | 15 | 16 |
| Gull | 4 | — | — | 8 | 10 | 12 | 13 |
| Night Owl | 5 | — | — | 9 | 11 | 13 | 14 |
| Ironback Boar, Black Bear | 9 | — | — | — | 15 | 17 | 18 |
| Sea Eagle | 7 | — | — | — | — | 15 | 16 |
| Deepwater Dolphin | 9 | — | — | — | — | 17 | 18 |

The character records current Health by canonical form ID. First learning initializes the record at the current maximum. Unlearning removes access and leaves the record dormant. Relearning restores access to the same record. On advancement, retain recorded values up to their new maxima. An increase in maximum adds no current Health. Replacing the active form ends the transformation and preserves its Health. Ordinary healing affects the current body. Rests and transformation-use recovery preserve animal Health.

**Primal Recovery.** Spend a Bonus Action and one available Calling Hit Die. While transformed, heal the active form. While humanoid, name a currently known form at exactly zero Health. In either case, heal by the die result plus the form's Resolve modifier, with a minimum of 1 and a cap at its scaled maximum. Recovery in humanoid form leaves the character humanoid. Subsequent entry costs a Bonus Action and a transformation use. The host commits the action, Hit Die and Health changes together.

#### Balance across the six Lineages

The checkpoints compare exploration, mobility, stealth and scouting against defenses, combat output, action cost and rest efficiency.

| Level | Beastshifters | Human | Fishmen | Stoneborn | Fey-Touched | Changelings |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | One scouting style or fast escape. Two uses with Bonus Action entry and gear loss. Modest d4 strike and 3-4 animal Health. | Always-on skill and Origin feat, plus Long Rest Inspiration. | Unmetered swim and breathing, cold resistance, one free Fog Cloud. | +1 maximum Health, poison defenses and two stone-detection uses. | Skill, Charmed defense, trance and a reusable cantrip. | At-will social infiltration and two useful skills, with functional gear. |
| 3 | A second choice can add fast travel or tracking, with up to d6 natural strike damage. | Generalist feat and skill work across fights and social scenes. | A separate Gust of Wind charge. | +3 Health and repeatable detection without giving up gear. | Gains a heritage spell. | Sustained impersonation for investigation and access. |
| 5 | Third choice can add short dives. Swim 35–40 and air limits trade speed for endurance. | Origin feat and Inspiration still complement Calling progression. | Breathes indefinitely and adds Water Walk for party travel. | +5 Health and a third Stone Listening use. | Gains second heritage spell, including group stealth for Greenwake. | Sustained disguise works through the entire scene. |
| 9 | Fourth choice can add aerial scouting. Three uses total. Flight loses gear, carrying and casting. | Retains ordinary action access and build flexibility. | Keeps underwater operation with gear. | +9 Health and four detection uses. | Spell charges, cantrips and trance remain available. | Can pass as a humanoid witness, official or crew member. |
| 13 | Fifth choice can add Guard 15 or climbing, a d8+3 natural strike, and up to 15 animal Health. | Keeps Origin feat and combat equipment. | Cold resistance and sustained water access. | +13 Health and five detection uses. | Heritage utility and save defense stay available. | Social stealth stays at will. |
| 17 | Sixth choice can add better flight or underwater detection. Three uses with indefinite duration and continuing gear and spell restrictions. | Keeps the full Calling kit. | Sustained aquatic movement and Current Speech. | +17 Health, six uses and 120-ft darkvision. | Distinct spell pools and slots. | Appearance changes remain at will. |
| 20 | Same forms and use cap as 17, with up to 18 animal Health. Full Calling capstone evaluates its own prerequisites. | Human grants remain compatible with the capstone. | Full Calling kit operates during sustained aquatic travel. | +20 Health and durable passive benefits accompany the capstone. | Trance and spell utility retain their distinct roles. | Humanoid disguise and ordinary kit remain compatible with the capstone. |

Reject player-authored or monster-catalog forms. Use ordinary obscurement, detection and Stealth checks. A witness decides whether an animal belongs in a place. A form cannot mimic a humanoid identity. Land, flight and diving forms use the same limited pool. Clearance, occupancy and continuous breath tracking apply through the ordinary encounter and movement rules.

### Changelings

A Changeling may spend a lifetime with one face in public and several names among people they trust. They are extremely rare, and a player can choose one at character creation. A campaign's GM decides where stories about Changelings circulate and what a particular witness does with evidence of a changed face.

Choose two distinct skills from Deceive, Read, Threaten, Perform and Persuade. Standard vision. Use an Action at will to change appearance and voice or return to base form. A disguise may depict an observed individual or an original appearance. It uses Small or Medium effective size, the same basic arrangement of limbs and plausible physical traits. Size applies to ordinary size checks. Keep Fey type, base identity, speed, attributes, Calling, Path, Training and grants. Clothing and equipment keep their appearance and fit rules. Voice conveys no language, memory, credentials or knowledge. The GM calls for Deceive or another check when a witness has reason to doubt. The appearance persists until replaced, intentionally reverted or ended by death. Rules effects can detect or reveal a disguise according to their own terms.

## Engine and integration contracts

### Portable rules

Pass 2 adds one public package subpath, `@crossworld/sanguine-engine/lineages`. Keep dependencies directed from Lineage rules to existing leaf functions for Training, spell numbers, and vitality terms. The replay coordinator joins the results with Calling, Path and Background. Neither Lineage nor the Calling catalog imports the replay coordinator. Export:

| Engine API | Contract |
| --- | --- |
| `lineages` | Immutable definitions with source metadata, IDs, choice descriptors, spell IDs and stable trait IDs. Consumer serializes a documented public projection. |
| `validateLineageSelection(selection, context)` | Returns a validated selection, field issues and pending choices. Context supplies eligibility and existing grants. An incomplete or invalid selection returns null with issues. |
| `deriveLineage(selection, level, context)` | Returns immutable grants including base movement, type and size, Health delta, senses, Training, rest modes, defenses, spell source terms and pool definitions. Level controls eligibility and scaling. Learned animal forms come from validated player choices. |
| `lineageActivationTerms(traitId, facts)` | Uses explicit eligibility and roll facts. Returns action costs and state or effect terms. Mechanical rejection raises a coded LineageRuleError. The host supplies time, rolls and authorization. |

The subpath also exports immutable animal definitions as `beastshifterForms`. `beastshifterFormChoices(level, learnedForms)` returns eligibility, required counts and use limits. `validateBeastshifterFormChoices(previous, event)` validates a single level event. `deriveBeastshifterForm(formId, level)` returns the form overlay, scaled maximum Health and current attack numbers. `advanceBeastshifterForms(previousState, event)` applies a valid form choice to runtime Health. `transitionBeastshifterHealth({level, state, vitality, event})` resolves damage overflow, healing and forced reversion. Host code will apply the overlay, enforce encounter restrictions, and persist these results. The engine README specifies inputs and rejection contracts.

Grant keys should follow the established source-key pattern, for example `lineage:human:origin-feat` and `lineage:fey-touched:gloam:faerie-fire`. The supplied grant source resolves the attribute and pool. A spell can be present in multiple sources. List each legal casting mode and choose a source explicitly when ambiguity affects modifier, pool, or slot. Reject spoofed grant IDs, impossible slot levels, and undeclared spell substitutions. Normal component, concentration, casting-turn and rest-interruption rules still apply. Support the lineage cantrip and unlocked free cast for a character without a Calling casting record. Ordinary slots must actually exist. The Lineage grant alone does not confer ritual casting.

Resolve Lineage skill choices alongside existing Calling and Background choices and before dependent Expertise choices. Retain current Background replacement and explicit Expertise behavior. For Lineage skill selections, exclude already retained skills and require a distinct eligible choice to avoid accidentally converting a duplicate grant into Expertise through `trainingGrantDestination`. Resolve collisions that would exhaust a constrained list by reselecting overlapping Calling or Background Training in the draft, with an actionable error. Preserve existing outcomes for old ledgers. The feature calculation remains shared and the frontend renders returned choice descriptors.

Take the base walking speed from Lineage in the new replay path. Keep the existing `advancementMovement` contributions for feat, Calling and Path. Compose numeric dedicated swim speeds with the Navigator walk-linked speed and equipment swim grants using the maximum applicable mode speed. Resolve walk-linked speed against the adjusted walk value, applying existing armor, effects and Exhaustion just once per mode. Keep a fixed 30-ft Fishmen swim speed separate from walk penalties that affect only walk. Reuse the existing combat damage-resistance and save-modifier inputs for Poisoned, Charmed and cold. Keep unsupported world adjudication explicit on the sheet. A published catalog changes its ETag. Feature IDs, spell records, and prior catalog snapshots stay available as historical evidence.

### Character state, commands, and reconstruction

`advancement/creation.js` currently whitelists `originId`, `backgroundId`, `method`, `increases`, `equipment`, `custom`, and `size`. In the proposed new ledger, require a discriminated `creation.lineage` with `id`, optional `size` only for a size choice, and a definition-specific `choices` object. Move the top-level creation size into lineage ownership and derive fixed sizes from the definition. For Beastshifters, require `creation.lineage.choices.formId` and store `learnFormId` plus optional `replaceForm: { fromFormId, toFormId }` as explicit choices on the v4 advancement event that reaches each milestone. Validate both changes together against the known set entering the event. A multi-level advance must include each crossed milestone choice in replay order. Reject missing, extra, duplicated, unknown, ineligible or spoofed choices. Derive learned forms from the ledger. Store any replaceable cantrip as a source-keyed replacement in the existing authorized historical replay path. Base identity remains immutable after creation. A future explicit rebuild may authorize a complete replacement, then drop incompatible lineage effects, choices, and pools atomically while using existing Health and resource reconciliation.

Keep runtime pool expenditure and active forms independent of replayed identity. Persist the active Beastshifter form ID and a character-scoped `healthByForm` map of current Health for all forms ever learned, including dormant forms. Derive `knownFormIds` from ledger v4 and combine it with the saved map. Reconcile current Health against maxima derived from the replayed total level. Validate that every map key was introduced by canonical form choices in the character ledger, every known form has a record, and any active form is known with positive Health. Preserve dormant records across save, reload and receipt replay. A humanoid Primal Recovery command supplies the depleted known form ID. Commit the action, Calling Hit Die spend and Health update with the receipt. A Beastshifter form has no deadline. Timed traits such as Stone Listening keep their own host-assigned start and deadline. Persist any pending placement only when needed for host adjudication. Persist a Changeling's bounded appearance delta separately from base identity. Owner and authorized GM views keep true identity. Public encounter views expose only the approved visible form. Free text never drives mechanical changes.

| Operation | Proposed normal entry point and checks |
| --- | --- |
| Create preview and commit | Existing preview and character creation. Validate choice completeness server-side, calculate initial Health, effects and pools, and return field paths under `creation.lineage`. Keep existing creation Idempotency-Key digest and initial-state replay. |
| Animal form, revert, recover or listen | Use typed `ability.activate` with stable Lineage trait IDs and closed payloads. The host validates action economy, eligibility, legal placement, and pool or Hit Die costs before applying effects. |
| Natural attack | Use the normal authenticated attack entry point with a typed form-strike selector. Verify the current form, strike ID, action or Reaction, target and range. Reject incompatible equipment commands while merged. |
| Changeling form | Typed `ability.activate` form choice with bounded appearance fields, effective size and explicit transform/revert branches. Host or GM validates facts the software cannot establish, such as observation. No generic runtime patch. |
| Innate spells | Existing spell casting command with source grant key and explicit free or slot mode. Host validates spell, choices, components, clock and targets before committing cost. |
| Rest, level, death | Existing operations drive pool recovery, maximum derivation, legal form learning and death cleanup. Ordinary rests preserve form Health and the active body. Timed traits such as Stone Listening expire independently. |

Maintain the existing command envelope (`operationId`, `expectedRevision`, `rulesVersion`, `type`, `payload`). Preserve authorization and matching receipt lookup before fresh revision enforcement, digest mismatch handling, and save plus receipt in one transaction. The backend decides owner/GM scope, turn validity, time, IDs, RNG and persistence. On failure, write neither state nor receipt. Reload and replay use saved timer deadlines and receipt results, with no extra use or reroll. Keep the pre-save replay checks that enforce model/ledger consistency. Existing field paths, 422 validation and 409 revision/idempotency conflicts continue through the same pipeline.

### Form transitions

| State and event | New state and result |
| --- | --- |
| Beastshifter humanoid, valid activation | Enter the chosen animal form. Spend a Bonus Action and one use. |
| Beastshifter animal, any activation | Reject refresh or direct swap without costs. |
| Beastshifter animal, valid voluntary revert | Humanoid. Spend a Bonus Action and resolve occupancy and terrain. |
| Beastshifter animal, zero animal Health, death or authoritative termination | Humanoid without action cost. Resolve occupancy and terrain. |
| Beastshifter animal, Incapacitated or Unconscious with positive animal Health | Remain in form. Apply ordinary condition and concentration rules. |
| Changeling base or disguised, valid transform | Disguised, normalized appearance replaces the previous active form. Size changes only through the effective-size projection. |
| Changeling disguised, valid revert or death | Base form. Intentional revert costs an Action. Death reverts without action cost. |
| Either, malformed transition or stale request | Atomic rejection with a fresh-operation error. Matching authorized receipts still return the historical response. |

### Compatibility

The Mongoose character model uses strict schema 1 and stores `rulesLedger` and `rulesRuntime` as Mixed fields with pre-validation. The engine entry point and backend ledger parser expect ledger v3 today. Propose ledger v4 for new Lineage creation and a versioned replay switch. Keep schema 1 and SA-CHAR-1 if additive response consumers and strict validators can be extended coherently. A dedicated protocol bump is warranted only if the API cannot unambiguously support both shapes. Store the version in the ledger and keep `lineage` derived from it rather than adding another authoritative field to Mongoose. Runtime validation reads the versioned summary and rejects effects belonging to a Lineage the character lacks. Audit saved summaries, hardcoded browser and campaign version checks, creation receipts and source keys as part of implementation.

No database migration is required for the proposed versioned path. Keep v3 characters on their existing neutral profile with their saved size and no retroactive Human grants. Character recreation or an explicitly authorized conversion are options if an existing character needs a Lineage. Conversion would require player choices and an audited preview. Do not rewrite history, receipts, test fixtures or production records in this pass.

## Creator and sheet

The live flow in `src/pages/Rules2024/CharacterCreation.jsx` is Identity → Origin → Background → Calling → Attributes → Training → Abilities and feats → Equipment → Spells → Review. Insert Lineage as the first gameplay choice, immediately after Identity. Display the four short definitions beside selection: Lineage is what you are, Roots are where you come from and what shaped you, Calling is your primary adventuring discipline, and Path is your specialization. Origin and Background remain the two existing Roots inputs. Path is previewable in Calling and becomes a choice at level 3. Keep the existing identity/details and loadout steps. Use stable step keys for validation navigation when inserting Lineage.

Present each Lineage's primary traits and exact creation choices. For a changed Lineage, clear obsolete lineage-scoped choices, invalidate the preview, and revalidate affected Training, feat and spell choices. Show required future unlocks as such. Review displays base and effective size, movement, senses, type, language sources, Training, permanent traits, spell source and charge status, source-specific save DC, and unlocked or future benefits. The persistent sheet shows active timers, explicit transform/revert controls, pools and applicable action cost. The public encounter card shows the active visible presentation subject to authorization. Maintain isometric preview and eight-facing asset compatibility with appearance data independent of mechanics. For Beastshifters, explain actual animal transformation before commitment. Require the initial form choice and show later unlock levels, required advancement choices and optional swaps. Display current and maximum uses, legal known forms, printed and effective statistics, animal Health, restrictions and explicit reversion. Disable unavailable actions with a reason, while the backend validates again at commit. Loom can map a stable form ID to a future eight-direction isometric asset and use the shared form projection for footprint and movement. No artwork or Loom implementation is included.

## Focused verification and implementation sequence

| Owner | Coverage |
| --- | --- |
| Engine | All six definitions checked against independent source expectations. Validate fixed and selectable sizes, required and forbidden choices, write-free derivation, skill eligibility, base and effective movement composition, Health and defenses, tier 1/3/5 unlocks and Training thresholds. Cover source-specific DC, slot/free parity, per-spell recovery, trance timing, animal-form selection, milestone boundaries, immutable catalog, effective overlays, indefinite transformation, damage overflow, healing and Primal Recovery. Assert independent values such as wolf at level 3 (walk 40, Guard 13, +4 attack, 1d6+2) and sea eagle at level 17 (fly 50, Guard 14, +9 attack, 1d6+3). |
| Backend | Test creation preview, idempotency and rejection, both ledger versions, reconstruction at levels 1/3/5/20, and save/reload. Verify forged source/choice rejection, authorization, stale revisions, receipt replay after restart, failed transaction rollback, death and timer boundaries, action economy, rest eligibility, duplicate grants, and active-size visibility. Use real Mongo only for behaviors that need transaction and restart fidelity. |
| Frontend | Test catalog choice routing, early explanation, dependent choice invalidation, validation focus, review parity, normal CharacterCreation entry point, sheet spell, transform and revert controls, animal Health and visibility. Use the browser harness for an end-to-end creation and form-change walkthrough. |

1. Freeze approved catalog IDs, independent expected values and the proposed ledger change.
2. Add engine definitions, derivation and leaf rule tests. Wire the movement base input, granted Training, feat choice and spell sources through existing domain contracts.
3. Implement versioned creation, projection and replay. Integrate passive defenses, Health, Inspiration and trance recovery. Verify old characters and the independent lifecycle fixture.
4. Add typed trait and form commands and projection. Verify movement and equipment suppression, ordinary strike economy, rests, damage, death and reload.
5. Integrate creator, sheet and viewing permissions. Run affected tests and the documented fast tier for implementation iterations. Reserve the full tier, retained regression probes and rest matrix for Phase 4 completion.

### Beastshifter acceptance cases

- Engine verifies exact starts at 1/3/5/9/13/17 and no new entitlement at 20. Test duplicate, missing and foreign choices, eligibility immediately below boundaries, distinct simultaneous additions and swaps, crossed milestones, physical versus permanent calculations, and ordinary movement penalties exactly once.
- Backend verifies Bonus Action and use consumption, voluntary reversion, no charge on failure, stale revision and receipt replay, single damage application with Temporary Health, and forced reversion at zero animal Health, death or explicit termination. Cover concentration using form Resolve, rejected casting and equipment commands, ordinary attack and Reaction prerequisites, and form preservation on rests and reconstruction.
- Encounter and frontend verify legal space, cramped forced reversion, flight loss, underwater breath carryover, form choice and replacement, authorization, current and maximum animal Health, and effective versus permanent display. Compare v3 replay against retained fixtures and verify v4 without migration.

### Inspection references

- [Phase 3 exit audit](phase3-completion.md), [creation](creation.md), [Roots inputs](origins-backgrounds.md), [Training](training.md), [feats](feats.md), [spell rules](spells.md), [Thult](../factions/nations-states/thult.md), [Rukka](../factions/nations-states/rukka.md), [Yuma doctrine](../lore/yuma-training-doctrine.md) and [Lilin mastery](../lore/lilin-mastery-philosophy.md).
- Backend: `docs/testing.md`, `docs/srd-provenance/NOTICE.md`, `src/modules/archipelago/characters/{model,commands,commandEnvelope,commandTransaction,creationRequest}.js`, `characters/advancement/{creation,ledger,ledgerProjection}.js`, and `system/{catalog,characterSystem}.js`.
- Engine: `package.json`, `NOTICE.md`, `src/progression/{creation,movement}.js`, `src/equipment/movement.js`, `src/feats/advancement.js`, `src/spells/{casting-sources,casting-numbers}.js`, `src/training/index.js` and `src/rest/index.js`.
