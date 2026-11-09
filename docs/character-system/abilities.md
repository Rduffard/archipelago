# Complete ability catalog

## Mandatory field contract inherited by every entry

Each entry header defines canonical ID, parent and unlock level. Each named clause is a separately addressable option with ID <ability-id>#<kebab-clause-name>; a one-clause entry uses #main. Every applicable field is defined by the full rule text and the following explicit defaults, avoiding hundreds of repeated N/A fields. Phase 2 must encode these fields, not execute natural language.

Category: passive for continuous grants; active for declared acts; conditional for event triggers; choice-based for selections; upgrading for replacements. Add limited-use/resource-consuming/reaction/bonus-action/spellcasting tags where text specifies them. Requirements: correct owner, level, all selections, equipment and event conditions. Action: exactly as written; event rider without a stated action uses no action; passive automatic; rest changes part of rest. Never charge an active clause's cost for a passive clause in the same entry.

Targets/range/duration: exactly written. Absent target/range means self; absent duration instantaneous for events, continuous while eligible for passives. Touch or nonweapon reach=5ft. 'Until your next turn' without an endpoint means its start. Repeating save unspecified timing=end of target turn. Spell-derived option inherits full spell targeting/components/duration. Resource cost0 unless stated. No independent max-use counter unless stated; limits/capacities/recharge in resources.md. New character begins with all unlocked uses available. All named costs paid atomically; absent recovery means no refill except stated parent pool recovery.

Attack/save/DC/damage/healing: none unless stated. A weapon attack uses ordinary weapon formula; a spell its complete spell entry. Extra damage defaults to triggering damage type unless stated. Bare attribute names in formulas mean modifiers, never scores. Feature DC8+TB+explicit attribute modifier; spell DC uses parent casting attribute. Healing capped at maximum, cannot revive unless stated. Negative healing/temporary Health becomes0. Scaling only explicit levels/formulas; later versions replace named earlier values. Selections exactly stated count/options, none when absent. Equipment requires only named items and ordinary spell/weapon requirements. Training/Expertise grants only explicit ones. Spellcasting unaffected except explicit modifications. Only named conditions/statuses imposed; no implied extra condition.

Persistent state: selections, spent pools, kit charges, active effects/concentration/durations, temporary Health, once-per-turn/event counters, target rest locks and created objects. Permanent/derived changes replay from versioned rules and source choices; do not store editable totals as authority. GM adjudicates world truth, visibility, rolls, external target state and fiction; backend validates local eligibility, exact costs, choices, effects and persistence. Later encounter adapters add range/turn evidence without changing formulas. Per-Path completion rulings below override defaults/reference drafts.

## Action economy and stacking

Declare option/target → validate ownership/choices/equipment/action/event/resources → atomic cost → roll/GM resolution → apply effects/log. Invalid operation spends nothing; valid failed attack/save still spends declared costs. On-hit cost is paid only after a valid hit. One Action, one Bonus Action when granted, one Reaction until your next turn starts, movement up to Speed. Ordinary free interaction once/turn; extra object interaction needs Utilize. Extra Attack applies only to Attack Action, not reaction/bonus attacks. Action Surge cannot give Magic Action and at most once/turn. At most one spell slot expended to cast spells per turn; reaction cast on same turn counts. Font conversion is not casting.

Concentration one effect across all sources, new effect ends previous; damage Resolve save DC min(30,max(10,floor(damage/2))), Incapacitated ends it. Same named effects never stack; select one base Guard formula then add distinct bonuses and one eligible Shield. Resistance never stacks; damage reductions before Resistance unless explicitly overridden. Temporary Health choose one pool, never sum. Once-per-turn/event keys persist on reload. Abilities that grant movement do not grant extra attacks unless explicit.

<a id="calling-reaver-rage-1"></a>
### Rage — `calling:reaver:rage:1`

Owner calling `reaver`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can imbue yourself with a primal power called Rage, a force that grants you extraordinary might and resilience. You can enter it as a Bonus Action if you aren't wearing Heavy armor. You can enter your Rage the number of times shown for your Reaver level in the Rages column of the Reaver Features table. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. While active, your Rage follows the rules below. Damage Resistance. You have Resistance to Bludgeoning, Piercing, and Slashing damage. Rage Damage. When you make an attack using Might—with either a weapon or an Unarmed Strike—and deal damage to the target, you gain a bonus to the damage that increases as you gain levels as a Reaver, as shown in the Rage Damage column of the Reaver Features table. Might Advantage. You have Advantage on Might checks and Might saving throws. No Concentration or Spells. You can't maintain Concentration, and you can't cast spells. Duration. The Rage lasts until the end of your next turn, and it ends early if you don Heavy armor or have the Incapacitated condition. If your Rage is still active on your next turn, you can extend the Rage for another round by doing one of the following: • Make an attack roll against an enemy. • Force an enemy to make a saving throw. • Take a Bonus Action to extend your Rage. Each time the Rage is extended, it lasts until the end of your next turn. You can maintain a Rage for up to 10 minutes.

<a id="calling-reaver-unarmored-defense-1"></a>
### Unarmored Defense — `calling:reaver:unarmored-defense:1`

Owner calling `reaver`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

While you aren't wearing any armor, your base Guard equals 10 plus your Agility and Resolve modifiers. You can use a Shield and still gain this benefit.

<a id="calling-reaver-weapon-mastery-1"></a>
### Weapon Mastery — `calling:reaver:weapon-mastery:1`

Owner calling `reaver`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your training with weapons allows you to use the mastery properties of two kinds of Simple or Martial Melee weapons of your choice, such as Greataxes and Handaxes. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain Reaver levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Reaver Features table.

<a id="calling-reaver-danger-sense-2"></a>
### Danger Sense — `calling:reaver:danger-sense:2`

Owner calling `reaver`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an uncanny sense of when things aren't as they should be, giving you an edge when you dodge perils. You have Advantage on Agility saving throws unless you have the Incapacitated condition.

<a id="calling-reaver-reckless-attack-2"></a>
### Reckless Attack — `calling:reaver:reckless-attack:2`

Owner calling `reaver`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can throw aside all concern for defense to attack with increased ferocity. When you make your first attack roll on your turn, you can decide to attack recklessly. Doing so gives you Advantage on attack rolls using Might until the start of your next turn, but attack rolls against you have Advantage during that time.

<a id="calling-reaver-primal-knowledge-3"></a>
### Primal Knowledge — `calling:reaver:primal-knowledge:3`

Owner calling `reaver`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain Training in another skill of your choice from the skill list available to Barbarians at level 1. In addition, while your Rage is active, you can channel primal power when you attempt certain tasks; whenever you make an ability check using one of the following skills, you can make it as a Might check even if it normally uses a different ability: Acrobatics, Intimidation, Perception, Stealth, or Survival. When you use this ability, your Might represents primal power coursing through you, honing your agility, bearing, and senses.

<a id="calling-reaver-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:reaver:ability-score-improvement:4`

Owner calling `reaver`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Reaver levels 8, 12, and 16.

<a id="calling-reaver-extra-attack-5"></a>
### Extra Attack — `calling:reaver:extra-attack:5`

Owner calling `reaver`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack twice instead of once whenever you take the Attack action on your turn.

<a id="calling-reaver-fast-movement-5"></a>
### Fast Movement — `calling:reaver:fast-movement:5`

Owner calling `reaver`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your speed increases by 10 feet while you aren't wearing Heavy armor.

<a id="calling-reaver-feral-instinct-7"></a>
### Feral Instinct — `calling:reaver:feral-instinct:7`

Owner calling `reaver`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your instincts are so honed that you have Advantage on Initiative rolls.

<a id="calling-reaver-instinctive-pounce-7"></a>
### Instinctive Pounce — `calling:reaver:instinctive-pounce:7`

Owner calling `reaver`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed.

<a id="calling-reaver-brutal-strike-9"></a>
### Brutal Strike — `calling:reaver:brutal-strike:9`

Owner calling `reaver`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

If you use Reckless Attack, you can forgo any Advantage on one Might-based attack roll of your choice on your turn. The chosen attack roll mustn't have Disadvantage. If the chosen attack roll hits, the target takes an extra 1d10 damage of the same type dealt by the weapon or Unarmed Strike, and you can cause one Brutal Strike effect of your choice. You have the following effect options. Forceful Blow. The target is pushed 15 feet straight away from you. You can then move up to half your Speed straight toward the target without provoking Opportunity Attacks. Hamstring Blow. The target's Speed is reduced by 15 feet until the start of your next turn. A target can be affected by only one Hamstring Blow at a time— the most recent one.

<a id="calling-reaver-relentless-rage-11"></a>
### Relentless Rage — `calling:reaver:relentless-rage:11`

Owner calling `reaver`; unlock 11; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your Rage can keep you fighting despite grievous wounds. If you drop to 0 Health while your Rage is active and don't die outright, you can make a DC 10 Resolve saving throw. If you succeed, your Health instead change to a number equal to twice your Reaver level. Each time you use this feature after the first, the DC increases by 5. When you finish a Short or Long Rest, the DC resets to 10.

<a id="calling-reaver-improved-brutal-strike-13"></a>
### Improved Brutal Strike — `calling:reaver:improved-brutal-strike:13`

Owner calling `reaver`; unlock 13; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have honed new ways to attack furiously. The following effects are now among your Brutal Strike options. Staggering Blow. The target has Disadvantage on the next saving throw it makes, and it can't make Opportunity Attacks until the start of your next turn. Sundering Blow. Before the start of your next turn, the next attack roll made by another creature against the target gains a +5 bonus to the roll. An attack roll can gain only one Sundering Blow bonus.

<a id="calling-reaver-persistent-rage-15"></a>
### Persistent Rage — `calling:reaver:persistent-rage:15`

Owner calling `reaver`; unlock 15; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you roll Initiative, you can regain all expended uses of Rage. After you regain uses of Rage in this way, you can't do so again until you finish a Long Rest. In addition, your Rage is so fierce that it now lasts for 10 minutes without you needing to do anything to extend it from round to round. Your Rage ends early if you have the Unconscious condition (not just the Incapacitated condition) or don Heavy armor.

<a id="calling-reaver-improved-brutal-strike-17"></a>
### Improved Brutal Strike — `calling:reaver:improved-brutal-strike:17`

Owner calling `reaver`; unlock 17; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The extra damage of your Brutal Strike increases to 2d10. In addition, you can use two different Brutal Strike effects whenever you use your Brutal Strike feature.

<a id="calling-reaver-indomitable-might-18"></a>
### Indomitable Might — `calling:reaver:indomitable-might:18`

Owner calling `reaver`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

If your total for a Might check or Might saving throw is less than your Might score, you can use that score in place of the total.

<a id="calling-reaver-epic-boon-19"></a>
### Epic Boon — `calling:reaver:epic-boon:19`

Owner calling `reaver`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.

<a id="calling-reaver-primal-champion-20"></a>
### Primal Champion — `calling:reaver:primal-champion:20`

Owner calling `reaver`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You embody primal power. Your Might and Resolve scores increase by 4, to a maximum of 25.

<a id="calling-doctor-spellcasting-1"></a>
### Spellcasting — `calling:doctor:spellcasting:1`

Owner calling `doctor`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have learned to cast spells through prayer and meditation. See “Spells” for the rules on spellcasting. The information below details how you use those rules with Doctor spells, which appear on the Doctor spell list later in the class's description. Cantrips. You know three cantrips of your choice from the Doctor spell list. Guidance, Sacred Flame, and Thaumaturgy are recommended. Whenever you gain a Doctor level, you can replace one of your cantrips with another cantrip of your choice from the Doctor spell list. When you reach Doctor levels 4 and 10, you learn another cantrip of your choice from the Doctor spell list, as shown in the Cantrips column of the Doctor Features table. Spell Slots. The Doctor Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Doctor spell list. Bless, Cure Wounds, Guiding Bolt, and Shield of Faith are recommended. The number of spells on your list increases as you gain Doctor levels, as shown in the Prepared Spells column of the Doctor Features table. Whenever that number increases, choose additional spells from the Doctor spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Doctor, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Doctor feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Doctor spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with other Doctor spells for which you have spell slots. Spellcasting Ability. Instinct is your spellcasting ability for your Doctor spells. Spellcasting Focus. You can use a Holy Symbol as a Spellcasting Focus for your Doctor spells.

<a id="calling-doctor-divine-order-1"></a>
### Divine Order — `calling:doctor:divine-order:1`

Owner calling `doctor`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have dedicated yourself to one of the following sacred roles of your choice. Protector. Trained for battle, you gain Training with Martial weapons and training with Heavy armor. Thaumaturge. You know one extra cantrip from the Doctor spell list. In addition, your mystical connection to the divine gives you a bonus to your Wit (Arcana or Religion) checks. The bonus equals your Instinct modifier (minimum of +1).

<a id="calling-doctor-channel-divinity-2"></a>
### Channel Divinity — `calling:doctor:channel-divinity:2`

Owner calling `doctor`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can channel divine energy directly from the Outer Planes to fuel magical effects. You start with two such effects: Divine Spark and Turn Undead, each of which is described below. Each time you use this class's Channel Divinity, choose which Channel Divinity effect from this class to create. You gain additional effect options at higher Doctor levels. You can use this class's Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain additional uses when you reach certain Doctor levels, as shown in the Channel Divinity column of the Doctor Features table. If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class's Spellcasting feature. Divine Spark. As a Magic action, you point your Holy Symbol at another creature you can see within 30 feet of yourself and focus divine energy at it. Roll 1d8 and add your Instinct modifier. You either restore Health to the creature equal to that total or force the creature to make a Resolve saving throw. On a failed save, the creature takes Necrotic or Radiant damage (your choice) equal to that total. On a successful save, the creature takes half as much damage (round down). You roll an additional d8 when you reach Doctor levels 7 (2d8), 13 (3d8), and 18 (4d8). Turn Undead. As a Magic action, you present your Holy Symbol and censure Undead creatures. Each Undead of your choice within 30 feet of you must make a Instinct saving throw. If the creature fails its save, it has the Frightened and Incapacitated conditions for 1 minute. For that duration, it tries to move as far from you as it can on its turns. This effect ends early on the creature if it takes any damage, if you have the Incapacitated condition, or if you die.

<a id="calling-doctor-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:doctor:ability-score-improvement:4`

Owner calling `doctor`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Doctor levels 8, 12, and 16.

<a id="calling-doctor-sear-undead-5"></a>
### Sear Undead — `calling:doctor:sear-undead:5`

Owner calling `doctor`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Whenever you use Turn Undead, you can roll a number of d8s equal to your Instinct modifier (minimum of 1d8) and add the rolls together. Each Undead that fails its saving throw against that use of Turn Undead takes Radiant damage equal to the roll's total. This damage doesn't end the turn effect.

<a id="calling-doctor-blessed-strikes-7"></a>
### Blessed Strikes — `calling:doctor:blessed-strikes:7`

Owner calling `doctor`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Divine power infuses you in battle. You gain one of the following options of your choice (if you get either option from a Doctor Path in an older book, use only the option you choose for this feature). Divine Strike. Once on each of your turns when you hit a creature with an attack roll using a weapon, you can cause the target to take an extra 1d8 Necrotic or Radiant damage (your choice). Potent Spellcasting. Add your Instinct modifier to the damage you deal with any Doctor cantrip.

<a id="calling-doctor-divine-intervention-10"></a>
### Divine Intervention — `calling:doctor:divine-intervention:10`

Owner calling `doctor`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can call on your deity or pantheon to intervene on your behalf. As a Magic action, choose any Doctor spell of level 5 or lower that doesn't require a Reaction to cast. As part of the same action, you cast that spell without expending a spell slot or needing Material components. You can't use this feature again until you finish a Long Rest.

<a id="calling-doctor-improved-blessed-strikes-14"></a>
### Improved Blessed Strikes — `calling:doctor:improved-blessed-strikes:14`

Owner calling `doctor`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The option you chose for Blessed Strikes grows more powerful. Divine Strike. The extra damage of your Divine Strike increases to 2d8. Potent Spellcasting. When you cast a Doctor cantrip and deal damage to a creature with it, you can give vitality to yourself or another creature within 60 feet of yourself, granting a number of Temporary Health equal to twice your Instinct modifier.

<a id="calling-doctor-epic-boon-19"></a>
### Epic Boon — `calling:doctor:epic-boon:19`

Owner calling `doctor`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Fate is recommended.

<a id="calling-doctor-greater-divine-intervention-20"></a>
### Greater Divine Intervention — `calling:doctor:greater-divine-intervention:20`

Owner calling `doctor`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can call on even more powerful divine intervention. When you use your Divine Intervention feature, you can choose Wish when you select a spell. If you do so, you can't use Divine Intervention again until you finish 2d4 Long Rests.

<a id="calling-gunslinger-fighting-style-1"></a>
### Fighting Style — `calling:gunslinger:fighting-style:1`

Owner calling `gunslinger`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have honed your martial prowess and gain a Fighting Style feat of your choice (see “Feats”). Defense is recommended. Whenever you gain a Gunslinger level, you can replace the feat you chose with a different Fighting Style feat.

<a id="calling-gunslinger-second-wind-1"></a>
### Second Wind — `calling:gunslinger:second-wind:1`

Owner calling `gunslinger`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Health equal to 1d10 plus your Gunslinger level. You can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. When you reach certain Gunslinger levels, you gain more uses of this feature, as shown in the Second Wind column of the Gunslinger Features table.

<a id="calling-gunslinger-weapon-mastery-1"></a>
### Weapon Mastery — `calling:gunslinger:weapon-mastery:1`

Owner calling `gunslinger`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain Gunslinger levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Gunslinger Features table.

<a id="calling-gunslinger-action-surge-2"></a>
### Action Surge — `calling:gunslinger:action-surge:2`

Owner calling `gunslinger`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action. Once you use this feature, you can't do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn.

<a id="calling-gunslinger-tactical-mind-2"></a>
### Tactical Mind — `calling:gunslinger:tactical-mind:2`

Owner calling `gunslinger`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success. Rather than regaining Health, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success. If the check still fails, this use of Second Wind isn't expended.

<a id="calling-gunslinger-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:gunslinger:ability-score-improvement:4`

Owner calling `gunslinger`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Gunslinger levels 6, 8, 12, 14, and 16.

<a id="calling-gunslinger-extra-attack-5"></a>
### Extra Attack — `calling:gunslinger:extra-attack:5`

Owner calling `gunslinger`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack twice instead of once whenever you take the Attack action on your turn.

<a id="calling-gunslinger-tactical-shift-5"></a>
### Tactical Shift — `calling:gunslinger:tactical-shift:5`

Owner calling `gunslinger`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.

<a id="calling-gunslinger-indomitable-9"></a>
### Indomitable — `calling:gunslinger:indomitable:9`

Owner calling `gunslinger`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

If you fail a saving throw, you can reroll it with a bonus equal to your Gunslinger level. You must use the new roll, and you can't use this feature again until you finish a Long Rest. You can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.

<a id="calling-gunslinger-tactical-master-9"></a>
### Tactical Master — `calling:gunslinger:tactical-master:9`

Owner calling `gunslinger`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you attack with a weapon whose mastery property you can use, you can replace that property with the Push, Sap, or Slow property for that attack.

<a id="calling-gunslinger-two-extra-attacks-11"></a>
### Two Extra Attacks — `calling:gunslinger:two-extra-attacks:11`

Owner calling `gunslinger`; unlock 11; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack three times instead of once whenever you take the Attack action on your turn.

<a id="calling-gunslinger-studied-attacks-13"></a>
### Studied Attacks — `calling:gunslinger:studied-attacks:13`

Owner calling `gunslinger`; unlock 13; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You study your opponents and learn from each attack you make. If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn.

<a id="calling-gunslinger-epic-boon-19"></a>
### Epic Boon — `calling:gunslinger:epic-boon:19`

Owner calling `gunslinger`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Combat Prowess is recommended.

<a id="calling-gunslinger-three-extra-attacks-20"></a>
### Three Extra Attacks — `calling:gunslinger:three-extra-attacks:20`

Owner calling `gunslinger`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack four times instead of once whenever you take the Attack action on your turn.

<a id="calling-warden-lay-on-hands-1"></a>
### Lay On Hands — `calling:warden:lay-on-hands:1`

Owner calling `warden`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Health equal to five times your Warden level. As a Bonus Action, you can touch a creature (which could be yourself) and draw power from the pool of healing to restore a number of Health to that creature, up to the maximum amount remaining in the pool. You can also expend 5 Health from the pool of healing power to remove the Poisoned condition from the creature; those points don't also restore Health to the creature.

<a id="calling-warden-spellcasting-1"></a>
### Spellcasting — `calling:warden:spellcasting:1`

Owner calling `warden`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have learned to cast spells through prayer and meditation. See “Spells” for the rules on spellcasting. The information below details how you use those rules with Warden spells, which appear in the Warden spell list later in the class's description. Spell Slots. The Warden Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Warden spells. Heroism and Searing Smite are recommended. The number of spells on your list increases as you gain Warden levels, as shown in the Prepared Spells column of the Warden Features table. Whenever that number increases, choose additional Warden spells until the number of spells on your list matches the number in the Warden Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 5 Warden, your list of prepared spells can include six Warden spells of level 1 or 2 in any combination. If another Warden feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Warden spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Warden spell for which you have spell slots. Spellcasting Ability. Spirit is your spellcasting ability for your Warden spells. Spellcasting Focus. You can use a Holy Symbol as a Spellcasting Focus for your Warden spells.

<a id="calling-warden-weapon-mastery-1"></a>
### Weapon Mastery — `calling:warden:weapon-mastery:1`

Owner calling `warden`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have Training, such as Longswords and Javelins. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Halberds and Flails.

<a id="calling-warden-fighting-style-2"></a>
### Fighting Style — `calling:warden:fighting-style:2`

Owner calling `warden`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain a Fighting Style feat of your choice (see “Feats” for feats). Instead of choosing one of those feats, you can choose the option below. Blessed Warrior. You learn two Doctor cantrips of your choice (see the Doctor class's section for a list of Doctor spells). Guidance and Sacred Flame are recommended. The chosen cantrips count as Warden spells for you, and Spirit is your spellcasting ability for them. Whenever you gain a Warden level, you can replace one of these cantrips with another Doctor cantrip.

<a id="calling-warden-paladin-s-smite-2"></a>
### Warden's Smite — `calling:warden:paladin-s-smite:2`

Owner calling `warden`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You always have the Divine Smite spell prepared. In addition, you can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again.

<a id="calling-warden-channel-divinity-3"></a>
### Channel Divinity — `calling:warden:channel-divinity:3`

Owner calling `warden`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can channel divine energy directly from the Outer Planes, using it to fuel magical effects. You start with one such effect: Divine Sense, which is described below. Other Warden features give additional Channel Divinity effect options. Each time you use this class's Channel Divinity, you choose which effect from this class to create. You can use this class's Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain an additional use when you reach Warden level 11. If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class's Spellcasting feature. Divine Sense. As a Bonus Action, you can open your awareness to detect Celestials, Fiends, and Undead. For the next 10 minutes or until you have the Incapacitated condition, you know the location of any creature of those types within 60 feet of yourself, and you know its creature type. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the Hallow spell.

<a id="calling-warden-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:warden:ability-score-improvement:4`

Owner calling `warden`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Warden levels 8, 12, and 16.

<a id="calling-warden-extra-attack-5"></a>
### Extra Attack — `calling:warden:extra-attack:5`

Owner calling `warden`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack twice instead of once whenever you take the Attack action on your turn.

<a id="calling-warden-faithful-steed-5"></a>
### Faithful Steed — `calling:warden:faithful-steed:5`

Owner calling `warden`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can call on the aid of an otherworldly steed. You always have the Find Steed spell prepared. You can also cast the spell once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest.

<a id="calling-warden-aura-of-protection-6"></a>
### Aura of Protection — `calling:warden:aura-of-protection:6`

Owner calling `warden`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You radiate a protective, unseeable aura in a 10-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition. You and your allies in the aura gain a bonus to saving throws equal to your Spirit modifier (minimum bonus of +1). If another Warden is present, a creature can benefit from only one Aura of Protection at a time; the creature chooses which aura while in them.

<a id="calling-warden-abjure-foes-9"></a>
### Abjure Foes — `calling:warden:abjure-foes:9`

Owner calling `warden`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Magic action, you can expend one use of this class's Channel Divinity to overwhelm foes with awe. As you present your Holy Symbol or weapon, you can target a number of creatures equal to your Spirit modifier (minimum of one creature) that you can see within 60 feet of yourself. Each target must succeed on a Instinct saving throw or have the Frightened condition for 1 minute or until it takes any damage. While Frightened in this way, a target can do only one of the following on its turns: move, take an action, or take a Bonus Action.

<a id="calling-warden-aura-of-courage-10"></a>
### Aura of Courage — `calling:warden:aura-of-courage:10`

Owner calling `warden`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You and your allies have Immunity to the Frightened condition while in your Aura of Protection. If a Frightened ally enters the aura, that condition has no effect on that ally while there.

<a id="calling-warden-radiant-strikes-11"></a>
### Radiant Strikes — `calling:warden:radiant-strikes:11`

Owner calling `warden`; unlock 11; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your strikes now carry supernatural power. When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage.

<a id="calling-warden-restoring-touch-14"></a>
### Restoring Touch — `calling:warden:restoring-touch:14`

Owner calling `warden`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you use Lay On Hands on a creature, you can also remove one or more of the following conditions from the creature: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned. You must expend 5 Health from the healing pool of Lay On Hands for each of these conditions you remove; those points don't also restore Health to the creature.

<a id="calling-warden-aura-expansion-18"></a>
### Aura Expansion — `calling:warden:aura-expansion:18`

Owner calling `warden`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your Aura of Protection is now a 30-foot Emanation.

<a id="calling-warden-epic-boon-19"></a>
### Epic Boon — `calling:warden:epic-boon:19`

Owner calling `warden`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Truesight is recommended.

<a id="calling-navigator-spellcasting-1"></a>
### Spellcasting — `calling:navigator:spellcasting:1`

Owner calling `navigator`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have learned to channel the magical essence of nature to cast spells. See “Spells” for the rules on spellcasting. The information below details how you use those rules with Navigator spells, which appear in the Navigator spell list later in the class's description. Spell Slots. The Navigator Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Navigator spells. Cure Wounds and Ensnaring Strike are recommended. The number of spells on your list increases as you gain Navigator levels, as shown in the Prepared Spells column of the Navigator Features table. Whenever that number increases, choose additional Navigator spells until the number of spells on your list matches the number in the Navigator Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 5 Navigator, your list of prepared spells can include six Navigator spells of level 1 or 2 in any combination. If another Navigator feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Navigator spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Navigator spell for which you have spell slots. Spellcasting Ability. Instinct is your spellcasting ability for your Navigator spells. Spellcasting Focus. You can use a Druidic Focus as a Spellcasting Focus for your Navigator spells.

<a id="calling-navigator-favored-enemy-1"></a>
### Favored Enemy — `calling:navigator:favored-enemy:1`

Owner calling `navigator`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You always have the Hunter's Mark spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses of this ability when you finish a Long Rest. The number of times you can cast the spell without a spell slot increases when you reach certain Navigator levels, as shown in the Favored Enemy column of the Navigator Features table.

<a id="calling-navigator-weapon-mastery-1"></a>
### Weapon Mastery — `calling:navigator:weapon-mastery:1`

Owner calling `navigator`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have Training, such as Longbows and Shortswords. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Longswords.

<a id="calling-navigator-deft-explorer-2"></a>
### Deft Explorer — `calling:navigator:deft-explorer:2`

Owner calling `navigator`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Thanks to your travels, you gain the following benefits. Expertise. Choose one of your skill Training with which you lack Expertise. You gain Expertise in that skill. Languages. You know two languages of your choice from the language tables in “Character Creation.”

<a id="calling-navigator-fighting-style-2"></a>
### Fighting Style — `calling:navigator:fighting-style:2`

Owner calling `navigator`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain a Fighting Style feat of your choice (see “Feats”). Instead of choosing one of those feats, you can choose the option below. Druidic Warrior. You learn two Druid cantrips of your choice (see the Druid class's section for a list of Druid spells). Guidance and Starry Wisp are recommended. The chosen cantrips count as Navigator spells for you, and Instinct is your spellcasting ability for them. Whenever you gain a Navigator level, you can replace one of these cantrips with another Druid cantrip.

<a id="calling-navigator-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:navigator:ability-score-improvement:4`

Owner calling `navigator`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Navigator levels 8, 12, and 16.

<a id="calling-navigator-extra-attack-5"></a>
### Extra Attack — `calling:navigator:extra-attack:5`

Owner calling `navigator`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can attack twice instead of once whenever you take the Attack action on your turn.

<a id="calling-navigator-roving-6"></a>
### Roving — `calling:navigator:roving:6`

Owner calling `navigator`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your Speed increases by 10 feet while you aren't wearing Heavy armor. You also have a Climb Speed and a Swim Speed equal to your Speed.

<a id="calling-navigator-expertise-9"></a>
### Expertise — `calling:navigator:expertise:9`

Owner calling `navigator`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Choose two of your skill Training with which you lack Expertise. You gain Expertise in those skills.

<a id="calling-navigator-tireless-10"></a>
### Tireless — `calling:navigator:tireless:10`

Owner calling `navigator`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Primal forces now help fuel you on your journeys, granting you the following benefits. Temporary Health. As a Magic action, you can give yourself a number of Temporary Health equal to 1d8 plus your Instinct modifier (minimum of 1). You can use this action a number of times equal to your Instinct modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Decrease Exhaustion. Whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1.

<a id="calling-navigator-relentless-hunter-13"></a>
### Relentless Hunter — `calling:navigator:relentless-hunter:13`

Owner calling `navigator`; unlock 13; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Taking damage can't break your Concentration on Hunter's Mark.

<a id="calling-navigator-nature-s-veil-14"></a>
### Nature's Veil — `calling:navigator:nature-s-veil:14`

Owner calling `navigator`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You invoke spirits of nature to magically hide yourself. As a Bonus Action, you can give yourself the Invisible condition until the end of your next turn. You can use this feature a number of times equal to your Instinct modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.

<a id="calling-navigator-precise-hunter-17"></a>
### Precise Hunter — `calling:navigator:precise-hunter:17`

Owner calling `navigator`; unlock 17; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have Advantage on attack rolls against the creature currently marked by your Hunter's Mark.

<a id="calling-navigator-feral-senses-18"></a>
### Feral Senses — `calling:navigator:feral-senses:18`

Owner calling `navigator`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your connection to the forces of nature grants you Blindsight with a range of 30 feet.

<a id="calling-navigator-epic-boon-19"></a>
### Epic Boon — `calling:navigator:epic-boon:19`

Owner calling `navigator`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.

<a id="calling-navigator-foe-slayer-20"></a>
### Foe Slayer — `calling:navigator:foe-slayer:20`

Owner calling `navigator`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The damage die of your Hunter's Mark is a d10 rather than a d6.

<a id="calling-corsair-expertise-1"></a>
### Expertise — `calling:corsair:expertise:1`

Owner calling `corsair`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain Expertise in two of your skill Training of your choice. Sleight of Hand and Stealth are recommended if you have Training in them. At Corsair level 6, you gain Expertise in two more of your skill Training of your choice.

<a id="calling-corsair-sneak-attack-1"></a>
### Sneak Attack — `calling:corsair:sneak-attack:1`

Owner calling `corsair`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. The extra damage's type is the same as the weapon's type. You don't need Advantage on the attack roll if at least one of your allies is within 5 feet of the target, the ally doesn't have the Incapacitated condition, and you don't have Disadvantage on the attack roll. The extra damage increases as you gain Corsair levels, as shown in the Sneak Attack column of the Corsair Features table.

<a id="calling-corsair-thieves-cant-1"></a>
### Thieves' Cant — `calling:corsair:thieves-cant:1`

Owner calling `corsair`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You picked up various languages in the communities where you plied your roguish talents. You know Thieves' Cant and one other language of your choice, which you choose from the language tables in “Character Creation.”

<a id="calling-corsair-weapon-mastery-1"></a>
### Weapon Mastery — `calling:corsair:weapon-mastery:1`

Owner calling `corsair`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have Training, such as Daggers and Shortbows. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Shortswords.

<a id="calling-corsair-cunning-action-2"></a>
### Cunning Action — `calling:corsair:cunning-action:2`

Owner calling `corsair`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your quick thinking and agility allow you to move and act quickly. On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.

<a id="calling-corsair-steady-aim-3"></a>
### Steady Aim — `calling:corsair:steady-aim:3`

Owner calling `corsair`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn. You can use this feature only if you haven't moved during this turn, and after you use it, your Speed is 0 until the end of the current turn.

<a id="calling-corsair-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:corsair:ability-score-improvement:4`

Owner calling `corsair`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Corsair levels 8, 10, 12, and 16.

<a id="calling-corsair-cunning-strike-5"></a>
### Cunning Strike — `calling:corsair:cunning-strike:5`

Owner calling `corsair`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You've developed cunning ways to use your Sneak Attack. When you deal Sneak Attack damage, you can add one of the following Cunning Strike effects. Each effect has a die cost, which is the number of Sneak Attack damage dice you must forgo to add the effect. You remove the die before rolling, and the effect occurs immediately after the attack's damage is dealt. For example, if you add the Poison effect, remove 1d6 from the Sneak Attack's damage before rolling. If a Cunning Strike effect requires a saving throw, the DC equals 8 plus your Agility modifier and Training Bonus. Poison (Cost: 1d6). You add a toxin to your strike, forcing the target to make a Resolve saving throw. On a failed save, the target has the Poisoned condition for 1 minute. At the end of each of its turns, the Poisoned target repeats the save, ending the effect on itself on a success. To use this effect, you must have a Poisoner's Kit on your person. Trip (Cost: 1d6). If the target is Large or smaller, it must succeed on a Agility saving throw or have the Prone condition. Withdraw (Cost: 1d6). Immediately after the attack, you move up to half your Speed without provoking Opportunity Attacks.

<a id="calling-corsair-uncanny-dodge-5"></a>
### Uncanny Dodge — `calling:corsair:uncanny-dodge:5`

Owner calling `corsair`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When an attacker that you can see hits you with an attack roll, you can take a Reaction to halve the attack's damage against you (round down).

<a id="calling-corsair-evasion-7"></a>
### Evasion — `calling:corsair:evasion:7`

Owner calling `corsair`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can nimbly dodge out of the way of certain dangers. When you're subjected to an effect that allows you to make a Agility saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can't use this feature if you have the Incapacitated condition.

<a id="calling-corsair-reliable-talent-7"></a>
### Reliable Talent — `calling:corsair:reliable-talent:7`

Owner calling `corsair`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Whenever you make an ability check that uses one of your skill or tool Training, you can treat a d20 roll of 9 or lower as a 10.

<a id="calling-corsair-improved-cunning-strike-11"></a>
### Improved Cunning Strike — `calling:corsair:improved-cunning-strike:11`

Owner calling `corsair`; unlock 11; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect.

<a id="calling-corsair-devious-strikes-14"></a>
### Devious Strikes — `calling:corsair:devious-strikes:14`

Owner calling `corsair`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You've practiced new ways to use your Sneak Attack deviously. The following effects are now among your Cunning Strike options. Daze (Cost: 2d6). The target must succeed on a Resolve saving throw, or on its next turn, it can do only one of the following: move or take an action or a Bonus Action. Knock Out (Cost: 6d6). The target must succeed on a Resolve saving throw, or it has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of each of its turns, ending the effect on itself on a success. Obscure (Cost: 3d6). The target must succeed on a Agility saving throw, or it has the Blinded condition until the end of its next turn.

<a id="calling-corsair-slippery-mind-15"></a>
### Slippery Mind — `calling:corsair:slippery-mind:15`

Owner calling `corsair`; unlock 15; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your cunning mind is exceptionally difficult to control. You gain Training in Instinct and Spirit saving throws.

<a id="calling-corsair-elusive-18"></a>
### Elusive — `calling:corsair:elusive:18`

Owner calling `corsair`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You're so evasive that attackers rarely gain the upper hand against you. No attack roll can have Advantage against you unless you have the Incapacitated condition.

<a id="calling-corsair-epic-boon-19"></a>
### Epic Boon — `calling:corsair:epic-boon:19`

Owner calling `corsair`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of the Night Spirit is recommended.

<a id="calling-corsair-stroke-of-luck-20"></a>
### Stroke of Luck — `calling:corsair:stroke-of-luck:20`

Owner calling `corsair`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have a marvelous knack for succeeding when you need to. If you fail a D20 Test, you can turn the roll into a 20. Once you use this feature, you can't use it again until you finish a Short or Long Rest.

<a id="calling-tidecaller-spellcasting-1"></a>
### Spellcasting — `calling:tidecaller:spellcasting:1`

Owner calling `tidecaller`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Drawing from your innate magic, you can cast spells. See “Spells” for the rules on spellcasting. The information below details how you use those rules with Tidecaller spells, which appear in the Tidecaller spell list later in the class's description. Cantrips. You know four Tidecaller cantrips of your choice. Light, Prestidigitation, Shocking Grasp, and Sorcerous Burst are recommended. Whenever you gain a Tidecaller level, you can replace one of your cantrips from this feature with another Tidecaller cantrip of your choice. When you reach Tidecaller levels 4 and 10, you learn another Tidecaller cantrip of your choice, as shown in the Cantrips column of the Tidecaller Features table. Spell Slots. The Tidecaller Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Tidecaller spells. Burning Hands and Detect Magic are recommended. The number of spells on your list increases as you gain Tidecaller levels, as shown in the Prepared Spells column of the Tidecaller Features table. Whenever that number increases, choose additional Tidecaller spells until the number of spells on your list matches the number in the Tidecaller Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Tidecaller, your list of prepared spells can include six Tidecaller spells of level 1 or 2 in any combination. If another Tidecaller feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Tidecaller spells for you. Changing Your Prepared Spells. Whenever you gain a Tidecaller level, you can replace one spell on your list with another Tidecaller spell for which you have spell slots. Spellcasting Ability. Spirit is your spellcasting ability for your Tidecaller spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for your Tidecaller spells.

<a id="calling-tidecaller-innate-sorcery-1"></a>
### Innate Sorcery — `calling:tidecaller:innate-sorcery:1`

Owner calling `tidecaller`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

An event in your past left an indelible mark on you, infusing you with simmering magic. As a Bonus Action, you can unleash that magic for 1 minute, during which you gain the following benefits: • The spell save DC of your Tidecaller spells increases by 1. • You have Advantage on the attack rolls of Tidecaller spells you cast. You can use this feature twice, and you regain all expended uses of it when you finish a Long Rest.

<a id="calling-tidecaller-font-of-magic-2"></a>
### Font of Magic — `calling:tidecaller:font-of-magic:2`

Owner calling `tidecaller`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can tap into the wellspring of magic within yourself. This wellspring is represented by Sorcery Points, which allow you to create a variety of magical effects. You have 2 Sorcery Points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Tidecaller Features table. You can't have more Sorcery Points than the number shown in the table for your level. You regain all expended Sorcery Points when you finish a Long Rest. You can use your Sorcery Points to fuel the options below, along with other features, such as Metamagic, that use those points. Converting Spell Slots to Sorcery Points. You can expend a spell slot to gain a number of Sorcery Points equal to the slot's level (no action required). Creating Spell Slots. As a Bonus Action, you can transform unexpended Sorcery Points into one spell slot. The Creating Spell Slots table shows the cost of creating a spell slot of a given level, and it lists the minimum Tidecaller level you must be to create a slot. You can create a spell slot no higher than level 5. Any spell slot you create with this feature vanishes when you finish a Long Rest. Creating Spell Slots Spell Slot Level Sorcery Point Cost Min. Tidecaller Level 1 2 2 2 3 3 3 5 5 4 6 7 5 7 9

<a id="calling-tidecaller-metamagic-2"></a>
### Metamagic — `calling:tidecaller:metamagic:2`

Owner calling `tidecaller`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Because your magic flows from within, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from “Metamagic Options” later in this class's description. You use the chosen options to temporarily modify spells you cast. To use an option, you must spend the number of Sorcery Points that it costs. You can use only one Metamagic option on a spell when you cast it unless otherwise noted in one of those options. Whenever you gain a Tidecaller level, you can replace one of your Metamagic options with one you don't know. You gain two more options at Tidecaller level 10 and two more at Tidecaller level 17.

<a id="calling-tidecaller-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:tidecaller:ability-score-improvement:4`

Owner calling `tidecaller`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Tidecaller levels 8, 12, and 16.

<a id="calling-tidecaller-sorcerous-restoration-5"></a>
### Sorcerous Restoration — `calling:tidecaller:sorcerous-restoration:5`

Owner calling `tidecaller`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you finish a Short Rest, you can regain expended Sorcery Points, but no more than a number equal to half your Tidecaller level (round down). Once you use this feature, you can't do so again until you finish a Long Rest.

<a id="calling-tidecaller-sorcery-incarnate-7"></a>
### Sorcery Incarnate — `calling:tidecaller:sorcery-incarnate:7`

Owner calling `tidecaller`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

If you have no uses of Innate Sorcery left, you can use it if you spend 2 Sorcery Points when you take the Bonus Action to activate it. In addition, while your Innate Sorcery feature is active, you can use up to two of your Metamagic options on each spell you cast.

<a id="calling-tidecaller-epic-boon-19"></a>
### Epic Boon — `calling:tidecaller:epic-boon:19`

Owner calling `tidecaller`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.

<a id="calling-tidecaller-arcane-apotheosis-20"></a>
### Arcane Apotheosis — `calling:tidecaller:arcane-apotheosis:20`

Owner calling `tidecaller`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it.

<a id="calling-shipwright-spellcasting-1"></a>
### Spellcasting — `calling:shipwright:spellcasting:1`

Owner calling `shipwright`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a student of arcane magic, you have learned to cast spells. See “Spells” for the rules on spellcasting. The information below details how you use those rules with Shipwright spells, which appear in the Shipwright spell list later in the class's description. Cantrips. You know three Shipwright cantrips of your choice. Light, Mage Hand, and Ray of Frost are recommended. Whenever you finish a Long Rest, you can replace one of your cantrips from this feature with another Shipwright cantrip of your choice. Expanding and Replacing a Engineering Folio The spells you add to your engineering folio as you gain levels reflect your ongoing magical research, but you might find other spells during your adventures that you can add to the book. You could discover a Shipwright spell on a Spell Scroll, for example, and then copy it into your engineering folio. Copying a Spell into the Book. When you find a level 1+ Shipwright spell, you can copy it into your engineering folio if it's of a level you can prepare and if you have time to copy it. For each level of the spell, the transcription takes 2 hours and costs 50 GP. Afterward you can prepare the spell like the other spells in your engineering folio. Copying the Book. You can copy a spell from your engineering folio into another book. This is like copying a new spell into your engineering folio but faster, since you already know how to cast the spell. You need spend only 1 hour and 10 GP for each level of the copied spell. If you lose your engineering folio, you can use the same procedure to transcribe the Shipwright spells that you have prepared into a new engineering folio. Filling out the remainder of the new book requires you to find new spells to do so. For this reason, many wizards keep a backup engineering folio. When you reach Shipwright levels 4 and 10, you learn another Shipwright cantrip of your choice, as shown in the Cantrips column of the Shipwright Features table. Engineering Folio. Your wizardly apprenticeship culminated in the creation of a unique book: your engineering folio. It is a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting Identify. You determine the book's appearance and materials, such as a gilt-edged tome or a collection of vellum bound with twine. The book contains the level 1+ spells you know. It starts with six level 1 Shipwright spells of your choice. Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended. Whenever you gain a Shipwright level after 1, add two Shipwright spells of your choice to your engineering folio. Each of these spells must be of a level for which you have spell slots, as shown in the Shipwright Features table. The spells are the culmination of arcane research you do regularly. Spell Slots. The Shipwright Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To do so, choose four spells from your engineering folio. The chosen spells must be of a level for which you have spell slots. The number of spells on your list increases as you gain Shipwright levels, as shown in the Prepared Spells column of the Shipwright Features table. Whenever that number increases, choose additional Shipwright spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Shipwright, your list of prepared spells can include six spells of levels 1 and 2 in any combination, chosen from your engineering folio. If another Shipwright feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Shipwright spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with spells from your engineering folio. Spellcasting Ability. Wit is your spellcasting ability for your Shipwright spells. Spellcasting Focus. You can use an Arcane Focus or your engineering folio as a Spellcasting Focus for your Shipwright spells.

<a id="calling-shipwright-ritual-adept-1"></a>
### Ritual Adept — `calling:shipwright:ritual-adept:1`

Owner calling `shipwright`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your engineering folio. You needn't have the spell prepared, but you must read from the book to cast a spell in this way.

<a id="calling-shipwright-arcane-recovery-1"></a>
### Arcane Recovery — `calling:shipwright:arcane-recovery:1`

Owner calling `shipwright`; unlock 1; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can regain some of your magical energy by studying your engineering folio. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Shipwright level (round up), and none of the slots can be level 6 or higher. For example, if you're a level 4 Shipwright, you can recover up to two levels' worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots. Once you use this feature, you can't do so again until you finish a Long Rest.

<a id="calling-shipwright-scholar-2"></a>
### Scholar — `calling:shipwright:scholar:2`

Owner calling `shipwright`; unlock 2; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

While studying magic, you also specialized in another field of study. Choose one of the following skills in which you have Training: Arcana, History, Investigation, Medicine, Nature, or Religion. You have Expertise in the chosen skill.

<a id="calling-shipwright-ability-score-improvement-4"></a>
### Ability Score Improvement — `calling:shipwright:ability-score-improvement:4`

Owner calling `shipwright`; unlock 4; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the Ability Score Improvement feat (see “Feats”) or another feat of your choice for which you qualify. You gain this feature again at Shipwright levels 8, 12, and 16.

<a id="calling-shipwright-memorize-spell-5"></a>
### Memorize Spell — `calling:shipwright:memorize-spell:5`

Owner calling `shipwright`; unlock 5; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Whenever you finish a Short Rest, you can study your engineering folio and replace one of the level 1+ Shipwright spells you have prepared for your Spellcasting feature with another level 1+ spell from the book.

<a id="calling-shipwright-spell-mastery-18"></a>
### Spell Mastery — `calling:shipwright:spell-mastery:18`

Owner calling `shipwright`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have achieved such mastery over certain spells that you can cast them at will. Choose a level 1 and a level 2 spell in your engineering folio that have a casting time of an action. You always have those spells prepared, and you can cast them at their lowest level without expending a spell slot. To cast either spell at a higher level, you must expend a spell slot. Whenever you finish a Long Rest, you can study your engineering folio and replace one of those spells with an eligible spell of the same level from the book.

<a id="calling-shipwright-epic-boon-19"></a>
### Epic Boon — `calling:shipwright:epic-boon:19`

Owner calling `shipwright`; unlock 19; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain an Epic Boon feat (see “Feats”) or another feat of your choice for which you qualify. Boon of Spell Recall is recommended.

<a id="calling-shipwright-signature-spells-20"></a>
### Signature Spells — `calling:shipwright:signature-spells:20`

Owner calling `shipwright`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Choose two level 3 spells in your engineering folio as your signature spells. You always have these spells prepared, and you can cast each of them once at level 3 without expending a spell slot. When you do so, you can't cast them in this way again until you finish a Short or Long Rest. To cast either spell at a higher level, you must expend a spell slot.

<a id="path-reef-knife-fast-hands-3"></a>
### Fast Hands — `path:reef-knife:fast-hands:3`

Owner path `reef-knife`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Bonus Action, you can do one of the following. Sleight of Hand. Make a Agility (Sleight of Hand) check to pick a lock or disarm a trap with Thieves' Tools or to pick a pocket. Use an Object. Take the Utilize action, or take the Magic action to use a magic item that requires that action.

<a id="path-reef-knife-second-story-work-3"></a>
### Second-Story Work — `path:reef-knife:second-story-work:3`

Owner path `reef-knife`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You've trained to get into especially hard-to-reach places, granting you these benefits. Climber. You gain a Climb Speed equal to your Speed. Jumper. You can determine your jump distance using your Agility rather than your Might.

<a id="path-reef-knife-supreme-sneak-9"></a>
### Supreme Sneak — `path:reef-knife:supreme-sneak:9`

Owner path `reef-knife`; unlock 9; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain the following Cunning Strike option. Stealth Attack (Cost: 1d6). If you have the Hide action's Invisible condition, this attack doesn't end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.

<a id="path-reef-knife-use-magic-device-13"></a>
### Use Magic Device — `path:reef-knife:use-magic-device:13`

Owner path `reef-knife`; unlock 13; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You've learned how to maximize use of magic items, granting you the following benefits. Attunement. You can attune to up to four magic items at once. Charges. Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls. You can use any Spell Scroll, using Wit as your spellcasting ability for the spell. If the spell is a cantrip or a level 1 spell, you can cast it reliably. If the scroll contains a higher-level spell, you must first succeed on an Wit (Arcana) check (DC 10 plus the spell's level). On a successful check, you cast the spell from the scroll. On a failed check, the scroll disintegrates.

<a id="path-reef-knife-thief-s-reflexes-17"></a>
### Reef Knife's Reflexes — `path:reef-knife:thief-s-reflexes:17`

Owner path `reef-knife`; unlock 17; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You are adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.

<a id="path-deadeye-improved-critical-3"></a>
### Improved Critical — `path:deadeye:improved-critical:3`

Owner path `deadeye`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your attack rolls with weapons and Unarmed Strikes can score a Critical Hit on a roll of 19 or 20 on the d20.

<a id="path-deadeye-remarkable-athlete-3"></a>
### Remarkable Athlete — `path:deadeye:remarkable-athlete:3`

Owner path `deadeye`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Thanks to your athleticism, you have Advantage on Initiative rolls and Might (Athletics) checks. In addition, immediately after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attacks.

<a id="path-deadeye-additional-fighting-style-7"></a>
### Additional Fighting Style — `path:deadeye:additional-fighting-style:7`

Owner path `deadeye`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain another Fighting Style feat of your choice.

<a id="path-deadeye-heroic-warrior-10"></a>
### Heroic Warrior — `path:deadeye:heroic-warrior:10`

Owner path `deadeye`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The thrill of battle drives you toward victory. During combat, you can give yourself Heroic Inspiration whenever you start your turn without it.

<a id="path-deadeye-superior-critical-15"></a>
### Superior Critical — `path:deadeye:superior-critical:15`

Owner path `deadeye`; unlock 15; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your attack rolls with weapons and Unarmed Strikes can now score a Critical Hit on a roll of 18–20 on the d20.

<a id="path-deadeye-survivor-18"></a>
### Survivor — `path:deadeye:survivor:18`

Owner path `deadeye`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You attain the pinnacle of resilience in battle, giving you these benefits. Defy Death. You have Advantage on Death Saving Throws. Moreover, when you roll 18–20 on a Death Saving Throw, you gain the benefit of rolling a 20 on it. Heroic Rally. At the start of each of your turns, you regain Health equal to 5 plus your Resolve modifier if you are Bloodied and have at least 1 Health.

<a id="path-gray-net-hunter-s-lore-3"></a>
### Gray Net's Lore — `path:gray-net:hunter-s-lore:3`

Owner path `gray-net`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can call on the forces of nature to reveal certain strengths and weaknesses of your prey. While a creature is marked by your Hunter's Mark, you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are.

<a id="path-gray-net-hunter-s-prey-3"></a>
### Gray Net's Prey — `path:gray-net:hunter-s-prey:3`

Owner path `gray-net`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Colossus Slayer. Your tenacity can wear down even the most resilient foes. When you hit a creature with a weapon, the weapon deals an extra 1d8 damage to the target if it's missing any of its Health. You can deal this extra damage only once per turn. Horde Breaker. Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target, that is within the weapon's range, and that you haven't attacked this turn.

<a id="path-gray-net-defensive-tactics-7"></a>
### Defensive Tactics — `path:gray-net:defensive-tactics:7`

Owner path `gray-net`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Escape the Horde. Opportunity Attacks have Disadvantage against you. Multiattack Defense. When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn.

<a id="path-gray-net-superior-hunter-s-prey-11"></a>
### Superior Gray Net's Prey — `path:gray-net:superior-hunter-s-prey:11`

Owner path `gray-net`; unlock 11; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Once per turn when you deal damage to a creature marked by your Hunter's Mark, you can also deal that spell's extra damage to a different creature that you can see within 30 feet of the first creature.

<a id="path-gray-net-superior-hunter-s-defense-15"></a>
### Superior Gray Net's Defense — `path:gray-net:superior-hunter-s-defense:15`

Owner path `gray-net`; unlock 15; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.

<a id="path-omen-diver-draconic-resilience-3"></a>
### Draconic Resilience — `path:omen-diver:draconic-resilience:3`

Owner path `omen-diver`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The magic in your body manifests physical traits of your draconic gift. Your Health maximum increases by 3, and it increases by 1 whenever you gain another Tidecaller level. Parts of you are also covered by dragon-like scales. While you aren't wearing armor, your base Guard equals 10 plus your Agility and Spirit modifiers.

<a id="path-omen-diver-draconic-spells-3"></a>
### Draconic Spells — `path:omen-diver:draconic-spells:3`

Owner path `omen-diver`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you reach a Tidecaller level specified in the Draconic Spells table, you thereafter always have the listed spells prepared. Draconic Spells Tidecaller Level Spells 3 Alter Self, Chromatic Orb, Command, Dragon's Breath 5 Fear, Fly 7 Arcane Eye, Charm Monster 9 Legend Lore, Summon Dragon

<a id="path-omen-diver-elemental-affinity-6"></a>
### Elemental Affinity — `path:omen-diver:elemental-affinity:6`

Owner path `omen-diver`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your draconic magic has an affinity with a damage type associated with dragons. Choose one of those types: Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Spirit modifier to one damage roll of that spell.

<a id="path-omen-diver-dragon-wings-14"></a>
### Dragon Wings — `path:omen-diver:dragon-wings:14`

Owner path `omen-diver`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Bonus Action, you can cause draconic wings to appear on your back. The wings last for 1 hour or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 feet. Once you use this feature, you can't use it again until you finish a Long Rest unless you spend 3 Sorcery Points (no action required) to restore your use of it.

<a id="path-omen-diver-dragon-companion-18"></a>
### Dragon Companion — `path:omen-diver:dragon-companion:18`

Owner path `omen-diver`; unlock 18; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can cast Summon Dragon without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for that casting.

<a id="path-leviathan-anchor-oath-of-devotion-spells-3"></a>
### Leviathan Anchor Spells — `path:leviathan-anchor:oath-of-devotion-spells:3`

Owner path `leviathan-anchor`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The magic of your oath ensures you always have certain spells ready; when you reach a Warden level specified in the Leviathan Anchor Spells table, you thereafter always have the listed spells prepared. Leviathan Anchor Spells Warden Level Spells 3 Protection from Evil and Good, Shield of Faith 5 Aid, Zone of Truth 9 Beacon of Hope, Dispel Magic 13 Freedom of Movement, Guardian of Faith 17 Commune, Flame Strike

<a id="path-leviathan-anchor-sacred-weapon-3"></a>
### Sacred Weapon — `path:leviathan-anchor:sacred-weapon:3`

Owner path `leviathan-anchor`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you take the Attack action, you can expend one use of your Channel Divinity to imbue one Melee weapon that you are holding with positive energy. For 10 minutes or until you use this feature again, you add your Spirit modifier to attack rolls you make with that weapon (minimum bonus of +1), and each time you hit with it, you cause it to deal its normal damage type or Radiant damage. The weapon also emits Bright Light in a 20-foot radius and Dim Light 20 feet beyond that. You can end this effect early (no action required). This effect also ends if you aren't carrying the weapon.

<a id="path-leviathan-anchor-aura-of-devotion-7"></a>
### Aura of Devotion — `path:leviathan-anchor:aura-of-devotion:7`

Owner path `leviathan-anchor`; unlock 7; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You and your allies have Immunity to the Charmed condition while in your Aura of Protection. If a Charmed ally enters the aura, that condition has no effect on that ally while there.

<a id="path-leviathan-anchor-smite-of-protection-15"></a>
### Smite of Protection — `path:leviathan-anchor:smite-of-protection:15`

Owner path `leviathan-anchor`; unlock 15; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your magical smite now radiates protective energy. Whenever you cast Divine Smite, you and your allies have Half Cover while in your Aura of Protection. The aura has this benefit until the start of your next turn.

<a id="path-leviathan-anchor-holy-nimbus-20"></a>
### Holy Nimbus — `path:leviathan-anchor:holy-nimbus:20`

Owner path `leviathan-anchor`; unlock 20; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Bonus Action, you can imbue your Aura of Protection with holy power, granting the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Holy Ward. You have Advantage on any saving throw you are forced to make by a Fiend or an Undead. Radiant Damage. Whenever an enemy starts its turn in the aura, that creature takes Radiant damage equal to your Spirit modifier plus your Training Bonus. Sunlight. The aura is filled with Bright Light that is sunlight.

<a id="path-bloodwake-frenzy-3"></a>
### Frenzy — `path:bloodwake:frenzy:3`

Owner path `bloodwake`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Might-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.

<a id="path-bloodwake-mindless-rage-6"></a>
### Mindless Rage — `path:bloodwake:mindless-rage:6`

Owner path `bloodwake`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you're Charmed or Frightened when you enter your Rage, the condition ends on you.

<a id="path-bloodwake-retaliation-10"></a>
### Retaliation — `path:bloodwake:retaliation:10`

Owner path `bloodwake`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.

<a id="path-bloodwake-intimidating-presence-14"></a>
### Intimidating Presence — `path:bloodwake:intimidating-presence:14`

Owner path `bloodwake`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Instinct saving throw (DC 8 plus your Might modifier and Training Bonus). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature's turns, the creature repeats the save, ending the effect on itself on a success. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.

<a id="path-sanctuary-hand-disciple-of-life-3"></a>
### Disciple of Life — `path:sanctuary-hand:disciple-of-life:3`

Owner path `sanctuary-hand`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When a spell you cast with a spell slot restores Health to a creature, that creature regains additional Health on the turn you cast the spell. The additional Health equal 2 plus the spell slot's level.

<a id="path-sanctuary-hand-life-domain-spells-3"></a>
### Sanctuary Hand Spells — `path:sanctuary-hand:life-domain-spells:3`

Owner path `sanctuary-hand`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your connection to this divine domain ensures you always have certain spells ready. When you reach a Doctor level specified in the Sanctuary Hand Spells table, you thereafter always have the listed spells prepared. Sanctuary Hand Spells Doctor Level Prepared Spells 3 Aid, Bless, Cure Wounds, Lesser Restoration 5 Mass Healing Word, Revivify 7 Aura of Life, Death Ward 9 Greater Restoration, Mass Cure Wounds

<a id="path-sanctuary-hand-preserve-life-3"></a>
### Preserve Life — `path:sanctuary-hand:preserve-life:3`

Owner path `sanctuary-hand`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy that can restore a number of Health equal to five times your Doctor level. Choose Bloodied creatures within 30 feet of yourself (which can include you), and divide those Health among them. This feature can restore a creature to no more than half its Health maximum.

<a id="path-sanctuary-hand-blessed-healer-6"></a>
### Blessed Healer — `path:sanctuary-hand:blessed-healer:6`

Owner path `sanctuary-hand`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

The healing spells you cast on others heal you as well. Immediately after you cast a spell with a spell slot that restores Health to one or more creatures other than yourself, you regain Health equal to 2 plus the spell slot's level.

<a id="path-sanctuary-hand-supreme-healing-17"></a>
### Supreme Healing — `path:sanctuary-hand:supreme-healing:17`

Owner path `sanctuary-hand`; unlock 17; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

When you would normally roll one or more dice to restore Health to a creature with a spell or Channel Divinity, don't roll those dice for the healing; instead use the highest number possible for each die. For example, instead of restoring 2d6 Health to a creature with a spell, you restore 12.

<a id="path-powder-saint-evocation-savant-3"></a>
### Evocation Savant — `path:powder-saint:evocation-savant:3`

Owner path `powder-saint`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Choose two Shipwright spells from the Evocation school, each of which must be no higher than level 2, and add them to your engineering folio for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Shipwright spell from the Evocation school to your engineering folio for free. The chosen spell must be of a level for which you have spell slots.

<a id="path-powder-saint-potent-cantrip-3"></a>
### Potent Cantrip — `path:powder-saint:potent-cantrip:3`

Owner path `powder-saint`; unlock 3; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Your damaging cantrips affect even creatures that avoid the brunt of the effect. When you cast a cantrip at a creature and you miss with the attack roll or the target succeeds on a saving throw against the cantrip, the target takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.

<a id="path-powder-saint-sculpt-spells-6"></a>
### Sculpt Spells — `path:powder-saint:sculpt-spells:6`

Owner path `powder-saint`; unlock 6; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can create pockets of relative safety within the effects of your evocations. When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 plus the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.

<a id="path-powder-saint-empowered-evocation-10"></a>
### Empowered Evocation — `path:powder-saint:empowered-evocation:10`

Owner path `powder-saint`; unlock 10; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

Whenever you cast a Shipwright spell from the Evocation school, you can add your Wit modifier to one damage roll of that spell.

<a id="path-powder-saint-overchannel-14"></a>
### Overchannel — `path:powder-saint:overchannel:14`

Owner path `powder-saint`; unlock 14; provenance SRD5.2.1 with terminology changes. All mandatory field defaults above apply.

You can increase the power of your spells. When you cast a Shipwright spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a Long Rest, you take 2d12 Necrotic damage for each level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity. Each time you use this feature again before finishing a Long Rest, the Necrotic damage per spell level increases by 1d12.

<a id="path-drydock-ghost-ghost-patch-3"></a>
### Ghost Patch — `path:drydock-ghost:ghost-patch:3`

Owner path `drydock-ghost`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Training with thieves' tools and carpenter's tools. Choose covert repair or sabotage. Once per turn when making a tool check for that trade, add your Wit modifier (minimum +1). Spend one Ghost Work use as an Action while touching a nonmagical object to repair 2d8 + your Shipwright level damage, or conceal your tampering. Discovering concealed tampering requires an Investigate check against your spell save DC. This does not repair creatures or magic items. Path uses start at two, increase by one at Calling levels 7, 11, 15, and 19, and recover one on a Short Rest or all on a Long Rest. Separately listed once-per-Long-Rest features recover on a Long Rest.

<a id="path-drydock-ghost-paid-in-scrap-6"></a>
### Paid in Scrap — `path:drydock-ghost:paid-in-scrap:6`

Owner path `drydock-ghost`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

After ten minutes salvaging a wreck, recover mundane parts worth up to 10 GP times your Shipwright level, once per Long Rest. Parts can only fund repairs or crafting and cannot be sold. Ghost Patch repairs 3d8 + your Shipwright level. Gain Expertise with the tools granted by this Path.

<a id="path-drydock-ghost-silent-keel-10"></a>
### Silent Keel — `path:drydock-ghost:silent-keel:10`

Owner path `drydock-ghost`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Spend one Ghost Work use as an Action to shroud a vehicle or up to six willing creatures within 30 feet for ten minutes, requiring Concentration. Affected creatures gain advantage on Stealth checks and leave no mundane tracks. The effect ends for a creature when it attacks or casts a spell. Ghost Patch repairs 4d8 + your Shipwright level.

<a id="path-drydock-ghost-unseen-passage-14"></a>
### Unseen Passage — `path:drydock-ghost:unseen-passage:14`

Owner path `drydock-ghost`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Bonus Action, spend two Ghost Work uses to gain a climbing and swimming speed equal to your speed and pass through nonmagical structures for one minute. Treat structures as Difficult Terrain; ending your turn inside one deals 1d10 Force damage and moves you to the nearest empty space. You cannot carry other creatures through structures. Ghost Patch repairs 5d8 + your Shipwright level.

<a id="path-storm-broker-barometer-instinct-3"></a>
### Barometer Instinct — `path:storm-broker:barometer-instinct:3`

Owner path `storm-broker`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose weather or signals. Gain Training with navigator's tools. You have advantage on Instinct checks to predict natural weather or Wit checks to interpret signals, according to your choice. As a Bonus Action spend one Squall use to create a 10-foot-radius zone within 60 feet until the start of your next turn. Choose fog (heavily obscured), crosswind (ranged weapon attacks through it have disadvantage), or surge (Difficult Terrain). This is magical and does not stack with another Squall. Path uses start at two, increase by one at Calling levels 7, 11, 15, and 19, and recover one on a Short Rest or all on a Long Rest. Separately listed once-per-Long-Rest features recover on a Long Rest.

<a id="path-storm-broker-borrowed-squall-7"></a>
### Borrowed Squall — `path:storm-broker:borrowed-squall:7`

Owner path `storm-broker`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Squall radius becomes 15 feet. When creating one, choose up to your Instinct modifier (minimum one) creatures you can see; those creatures ignore its effects. Gain Resistance to Lightning or Thunder damage, selected when you gain this feature.

<a id="path-storm-broker-captain-s-credit-11"></a>
### Captain's Credit — `path:storm-broker:captain-s-credit:11`

Owner path `storm-broker`; unlock 11; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once on each of your turns when an ally you can see within 60 feet succeeds on an attack or saving throw while in your Squall, grant that ally temporary Health equal to your Training Bonus + your Instinct modifier (minimum one). Squalls last until the end of your next turn. No retired Focus or specialty currency is restored.

<a id="path-storm-broker-eye-of-the-bargain-15"></a>
### Eye of the Bargain — `path:storm-broker:eye-of-the-bargain:15`

Owner path `storm-broker`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Squall radius becomes 20 feet. As a Reaction when a creature you can see within 60 feet takes Lightning or Thunder damage, spend one Squall use to grant it Resistance to that instance of damage. Once per Long Rest, when initiative is rolled and you have no Squall uses, recover one use.

<a id="path-field-surgeon-clinical-doctrine-3"></a>
### Clinical Doctrine — `path:field-surgeon:clinical-doctrine:3`

Owner path `field-surgeon`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose trauma or toxicology. Gain Training with healer's kits and herbalism kits, and Expertise in Stabilize if already Trained, otherwise Training in Stabilize. Your Doctor spells and features can use Wit instead of Instinct; this choice is fixed when this Path is gained. This changes the casting attribute, not the magical rules or components of spells. As an Action spend one Triage use and one healer's kit use to restore 2d8 + your Doctor level Health to a creature within reach. A creature can receive this healing once per Short or Long Rest. Path uses start at two, increase by one at Calling levels 7, 11, 15, and 19, and recover one on a Short Rest or all on a Long Rest. Separately listed once-per-Long-Rest features recover on a Long Rest.

<a id="path-field-surgeon-battlefield-procedure-6"></a>
### Battlefield Procedure — `path:field-surgeon:battlefield-procedure:6`

Owner path `field-surgeon`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Triage healing becomes 3d8 + your Doctor level. Trauma: when applying Triage, also end the target's Prone condition without spending movement. Toxicology: instead of healing, a Triage use can end the Poisoned condition and grant advantage against poison for one minute. Neither option removes Exhaustion or restores missing limbs. Record each target's Triage rest restriction at the table.

<a id="path-field-surgeon-impossible-operation-17"></a>
### Impossible Operation — `path:field-surgeon:impossible-operation:17`

Owner path `field-surgeon`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Triage healing becomes 6d8 + your Doctor level. Once per Long Rest, as an Action expend one Channel Divinity use and five healer's kit uses to restore a creature that died within the last minute to 1 Health. Its body must be present and substantially intact; death by old age and removed vital organs cannot be reversed. You must remain within reach for the Action. This is an original magical intervention, not ordinary surgery.

<a id="path-breakwater-breakwater-doctrine-3"></a>
### Breakwater Doctrine — `path:breakwater:breakwater-doctrine:3`

Owner path `breakwater`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose bulwark or shelter. Gain Training with mason's tools and carpenter's tools. As an Action spend one Bastion use to place a magical barrier in unoccupied space within 30 feet: up to 10 feet wide, 5 feet high, and 1 foot thick. It lasts one minute, has Guard 15 and Health equal to five times your Shipwright level, is immune to Poison and Psychic damage, and provides half cover. You may have only one such barrier; creating another dismisses the first. Bulwark adds your Wit modifier (minimum one) to its Guard; shelter grants creatures of your choice within 5 feet temporary Health equal to your Training Bonus when it appears. Path uses start at two, increase by one at Calling levels 7, 11, 15, and 19, and recover one on a Short Rest or all on a Long Rest. Separately listed once-per-Long-Rest features recover on a Long Rest.

<a id="path-breakwater-reinforced-anchorage-6"></a>
### Reinforced Anchorage — `path:breakwater:reinforced-anchorage:6`

Owner path `breakwater`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Barrier Health becomes seven times your Shipwright level. You have advantage on tool checks to reinforce structures. As a Reaction when a creature within 5 feet of your barrier takes damage, spend one Bastion use to reduce that damage by 2d8 + your Wit modifier (minimum one total reduction).

<a id="path-breakwater-harbor-geometry-10"></a>
### Harbor Geometry — `path:breakwater:harbor-geometry:10`

Owner path `breakwater`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your barrier can be up to 20 feet wide and 10 feet high, with one right-angle bend. It provides three-quarters cover. When you create it, choose up to your Training Bonus creatures; those creatures can pass through it as Difficult Terrain. It cannot appear through creatures or objects and does not trap a creature in an occupied space.

<a id="path-breakwater-hold-against-the-sea-14"></a>
### Hold Against the Sea — `path:breakwater:hold-against-the-sea:14`

Owner path `breakwater`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Barrier Health becomes ten times your Shipwright level. Once per Long Rest, create a barrier without spending a Bastion use; that barrier lasts one hour. Damage reduction from Reinforced Anchorage becomes 4d8 + your Wit modifier. Your barrier is resistant to all damage except Force and damage from siege weapons.

<a id="path-black-flag-envoy-terms-of-surrender-3"></a>
### Terms of Surrender — `path:black-flag-envoy:terms-of-surrender:3`

Owner path `black-flag-envoy`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose parley or intimidation. Gain Training in Persuade (parley) or Threaten (intimidation), or Expertise if already Trained. As a Bonus Action spend one Envoy use: an ally within 30 feet who hears you may use its Reaction to move half its Speed without provoking Opportunity Attacks. You cannot target yourself.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"black-flag-envoy:envoy","amount":1}].

<a id="path-black-flag-envoy-crew-before-crown-9"></a>
### Crew Before Crown — `path:black-flag-envoy:crew-before-crown:9`

Owner path `black-flag-envoy`; unlock 9; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Envoy action may instead let the ally repeat a saving throw against Charmed or Frightened, with advantage. On success that condition ends. Range becomes 60 feet.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"black-flag-envoy:envoy","amount":1}].

<a id="path-black-flag-envoy-binding-parley-13"></a>
### Binding Parley — `path:black-flag-envoy:binding-parley:13`

Owner path `black-flag-envoy`; unlock 13; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest, as an Action address up to your Spirit modifier (minimum one) creatures within 60 feet that understand you. Each makes an Instinct save (DC 8 + Training Bonus + Spirit). On failure it cannot attack you for one minute unless you or your allies harm it. This is Charmed; repeat the save at the end of each turn.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"black-flag-envoy:parley","amount":1}].

<a id="path-black-flag-envoy-all-hands-17"></a>
### All Hands — `path:black-flag-envoy:all-hands:17`

Owner path `black-flag-envoy`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Bonus Action spend two Envoy uses to apply Terms of Surrender to up to three different allies. Each still spends its own Reaction; a creature cannot benefit twice from the same command.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"black-flag-envoy:envoy","amount":2}].

<a id="path-hollow-lantern-read-the-wake-3"></a>
### Read the Wake — `path:hollow-lantern:read-the-wake:3`

Owner path `hollow-lantern`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose Investigate or Perception; gain Training, or Expertise if already Trained. As a Bonus Action spend one Lantern use to study one creature within 30 feet. Until the end of your next turn, you may Sneak Attack it without advantage if no other creature is within 5 feet of you, and you do not have disadvantage.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"hollow-lantern:lantern","amount":1}].

<a id="path-hollow-lantern-unmask-the-false-9"></a>
### Unmask the False — `path:hollow-lantern:unmask-the-false:9`

Owner path `hollow-lantern`; unlock 9; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action spend one Lantern use to gain advantage for ten minutes on checks to detect disguises, shapechanging and illusions. This does not reveal an illusion automatically. You can Search as a Bonus Action without spending a use.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"hollow-lantern:lantern","amount":1}].

<a id="path-hollow-lantern-lantern-in-the-fog-13"></a>
### Lantern in the Fog — `path:hollow-lantern:lantern-in-the-fog:13`

Owner path `hollow-lantern`; unlock 13; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Blindsight 10 feet. When a creature you can perceive within 30 feet becomes Invisible, you may use your Reaction and one Lantern use to mark its last location. Until your next turn it gains no advantage against you from being unseen; this does not reveal its later location.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"hollow-lantern:lantern","amount":1}].

<a id="path-hollow-lantern-the-last-tell-17"></a>
### The Last Tell — `path:hollow-lantern:the-last-tell:17`

Owner path `hollow-lantern`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Short or Long Rest when your Sneak Attack hits a creature studied by Read the Wake, reroll up to three Sneak Attack dice and use the new results. You decide after seeing the damage dice.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"hollow-lantern:last-tell","amount":1}].

<a id="path-saltglass-duelist-open-challenge-3"></a>
### Open Challenge — `path:saltglass-duelist:open-challenge:3`

Owner path `saltglass-duelist`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose rapier or cutlass as your signature weapon. When holding that weapon and no other weapon or Shield, you may Sneak Attack a target within 5 feet without advantage if no other creature is within 5 feet of you and you lack disadvantage. As a Reaction spend one Duel use to add your Training Bonus to Guard against one melee attack you can see, potentially causing it to miss.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"saltglass-duelist:duel","amount":1}].

<a id="path-saltglass-duelist-saltglass-footwork-9"></a>
### Saltglass Footwork — `path:saltglass-duelist:saltglass-footwork:9`

Owner path `saltglass-duelist`; unlock 9; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Speed increases by 5 feet. After making a melee attack against a creature, that creature cannot make Opportunity Attacks against you for the rest of the turn, whether you hit or miss. You must be holding your signature weapon.

<a id="path-saltglass-duelist-answer-in-steel-13"></a>
### Answer in Steel — `path:saltglass-duelist:answer-in-steel:13`

Owner path `saltglass-duelist`; unlock 13; provenance original Archipelago mechanics. All mandatory field defaults above apply.

When an attack misses you because of Open Challenge, you may make one melee attack against the attacker as part of the same Reaction. This attack cannot deal Sneak Attack damage.

<a id="path-saltglass-duelist-perfect-measure-17"></a>
### Perfect Measure — `path:saltglass-duelist:perfect-measure:17`

Owner path `saltglass-duelist`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest when you miss with your signature weapon, turn that miss into a hit. It is not a Critical Hit. You must choose before damage is rolled.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"saltglass-duelist:perfect-measure","amount":1}].

<a id="path-iron-suppressor-suppressing-fire-3"></a>
### Suppressing Fire — `path:iron-suppressor:suppressing-fire:3`

Owner path `iron-suppressor`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose push or slow. Once per turn when a Ranged weapon attack hits, spend one Suppression use to deal 1d6 extra damage and force a Resolve save (DC 8 + Training Bonus + Agility). On failure push moves the target 10 feet directly away; slow reduces its Speed by 10 feet until your next turn. Does not stack with the same mastery effect.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"iron-suppressor:suppression","amount":1}].

<a id="path-iron-suppressor-entrenched-drill-7"></a>
### Entrenched Drill — `path:iron-suppressor:entrenched-drill:7`

Owner path `iron-suppressor`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

If you have moved no more than 5 feet on your turn, you have Half Cover against ranged attacks until your next turn. Moving farther ends this benefit. Suppression extra damage becomes 1d8.

<a id="path-iron-suppressor-crossing-denied-10"></a>
### Crossing Denied — `path:iron-suppressor:crossing-denied:10`

Owner path `iron-suppressor`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Reaction when a creature you can see moves into a space within 30 feet, spend one Suppression use to make one Ranged weapon attack against it. The attack does not also apply Suppressing Fire.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"iron-suppressor:suppression","amount":1}].

<a id="path-iron-suppressor-overlapping-fields-15"></a>
### Overlapping Fields — `path:iron-suppressor:overlapping-fields:15`

Owner path `iron-suppressor`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Suppressing Fire can affect a second creature within 10 feet of the original target. It makes the same save and suffers the chosen control effect on failure, but takes no damage. Suppression extra damage becomes 1d10.

<a id="path-iron-suppressor-hold-the-corridor-18"></a>
### Hold the Corridor — `path:iron-suppressor:hold-the-corridor:18`

Owner path `iron-suppressor`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest, as a Bonus Action recover all expended Suppression uses. Until your next turn your Suppressing Fire save DC increases by 2.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"iron-suppressor:hold-corridor","amount":1}].

<a id="path-brass-outrider-ride-the-recoil-3"></a>
### Ride the Recoil — `path:brass-outrider:ride-the-recoil:3`

Owner path `brass-outrider`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose runner or rider. Runner gains Athletics Training; rider gains Animal Handling Training (Expertise if already Trained). Once per turn after a Ranged weapon attack, spend one Outrider use to move up to 15 feet without provoking Opportunity Attacks. A willing mount can move instead, using its movement.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"brass-outrider:outrider","amount":1}].

<a id="path-brass-outrider-dust-and-distance-7"></a>
### Dust and Distance — `path:brass-outrider:dust-and-distance:7`

Owner path `brass-outrider`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Your Speed increases by 10 feet when not wearing Heavy armor. Mounting or dismounting costs only 5 feet of movement. Difficult Terrain caused by rubble or sand costs you no extra movement.

<a id="path-brass-outrider-passing-shot-10"></a>
### Passing Shot — `path:brass-outrider:passing-shot:10`

Owner path `brass-outrider`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

After moving at least 20 feet on your turn, your first weapon hit that turn deals 1d8 extra damage. This applies only once per turn and cannot be combined with Ride the Recoil movement before the hit.

<a id="path-brass-outrider-break-pursuit-15"></a>
### Break Pursuit — `path:brass-outrider:break-pursuit:15`

Owner path `brass-outrider`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

When a creature ends its turn within 5 feet of you, you may use your Reaction and one Outrider use to move half your Speed without provoking Opportunity Attacks.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"brass-outrider:outrider","amount":1}].

<a id="path-brass-outrider-over-the-horizon-18"></a>
### Over the Horizon — `path:brass-outrider:over-the-horizon:18`

Owner path `brass-outrider`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Short or Long Rest as a Bonus Action, move up to your Speed and make one weapon attack. Passing Shot applies normally; this action does not grant an additional Action.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"brass-outrider:horizon","amount":1}].

<a id="path-cinder-artillerist-measured-charge-3"></a>
### Measured Charge — `path:cinder-artillerist:measured-charge:3`

Owner path `cinder-artillerist`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose smoke or breach. As an Action spend one Charge use to place a charge within 30 feet. It detonates immediately: creatures in a 5-foot radius make an Agility save (DC 8 + Training Bonus + Wit), taking 2d6 Fire damage on failure or half on success. Smoke leaves a heavily obscured 5-foot radius until your next turn; breach deals double damage to unattended objects. This is not a weapon attack.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"cinder-artillerist:charge","amount":1}].

<a id="path-cinder-artillerist-safe-handling-7"></a>
### Safe Handling — `path:cinder-artillerist:safe-handling:7`

Owner path `cinder-artillerist`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Training with smith tools and advantage on checks to inspect explosives. You and allies you choose have advantage on saves against your charges. Charge damage becomes 3d6.

<a id="path-cinder-artillerist-shaped-detonation-10"></a>
### Shaped Detonation — `path:cinder-artillerist:shaped-detonation:10`

Owner path `cinder-artillerist`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Charge radius can be 10 feet. Choose up to your Wit modifier (minimum one) creatures in the area; they take no damage and suffer no charge effect. Charges do not bypass total cover.

<a id="path-cinder-artillerist-controlled-demolition-15"></a>
### Controlled Demolition — `path:cinder-artillerist:controlled-demolition:15`

Owner path `cinder-artillerist`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Charge damage becomes 5d6. Breach charges ignore object Resistance to Fire. Smoke radius becomes 10 feet and lasts one minute unless a strong wind disperses it.

<a id="path-cinder-artillerist-grand-battery-18"></a>
### Grand Battery — `path:cinder-artillerist:grand-battery:18`

Owner path `cinder-artillerist`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as an Action spend two Charge uses to detonate two charges at different points within 60 feet. A creature in both areas is affected only once. Each charge deals 6d6 Fire damage.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"cinder-artillerist:charge","amount":2},{"poolId":"cinder-artillerist:battery","amount":1}].

<a id="path-starwake-pilot-chart-the-passage-3"></a>
### Chart the Passage — `path:starwake-pilot:chart-the-passage:3`

Owner path `starwake-pilot`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose cliff or current. Gain Training with navigator tools. As a Bonus Action spend one Passage use to guide up to two allies within 30 feet for one minute. Cliff gives a Climb Speed of 20 feet; current gives a Swim Speed of 20 feet. This requires Concentration as a spell and grants no extra movement.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"starwake-pilot:passage","amount":1}].

<a id="path-starwake-pilot-safe-bearing-7"></a>
### Safe Bearing — `path:starwake-pilot:safe-bearing:7`

Owner path `starwake-pilot`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

You have advantage on saves against becoming lost or being teleported unwillingly. Guided allies ignore nonmagical Difficult Terrain and their granted speed becomes 30 feet.

<a id="path-starwake-pilot-converging-routes-11"></a>
### Converging Routes — `path:starwake-pilot:converging-routes:11`

Owner path `starwake-pilot`; unlock 11; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once on each of your turns when a guided ally is within 5 feet of your target, your first weapon hit against that target deals 1d8 extra damage. You cannot guide yourself.

<a id="path-starwake-pilot-homeward-star-15"></a>
### Homeward Star — `path:starwake-pilot:homeward-star:15`

Owner path `starwake-pilot`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as an Action teleport yourself and up to two willing creatures within 5 feet to a visible unoccupied location within 60 feet. Each destination must support the creature. This ends Chart the Passage.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"starwake-pilot:homeward","amount":1}].

<a id="path-mangrove-stalker-rooted-ambush-3"></a>
### Rooted Ambush — `path:mangrove-stalker:rooted-ambush:3`

Owner path `mangrove-stalker`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose snare or camouflage. Once per turn when you hit a creature marked by your Hunter's Mark, spend one Thicket use to deal 1d6 extra Piercing damage. Snare forces a Might save against your spell DC or reduces its Speed to 0 until your next turn; camouflage lets you Hide immediately as part of the attack if you have cover or heavy obscurement.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"mangrove-stalker:thicket","amount":1}].

<a id="path-mangrove-stalker-marshborn-7"></a>
### Marshborn — `path:mangrove-stalker:marshborn:7`

Owner path `mangrove-stalker`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Resistance to Poison damage and advantage on saves against Poisoned. Nonmagical plants do not cost you extra movement or deal damage when you pass through them.

<a id="path-mangrove-stalker-patient-predator-11"></a>
### Patient Predator — `path:mangrove-stalker:patient-predator:11`

Owner path `mangrove-stalker`; unlock 11; provenance original Archipelago mechanics. All mandatory field defaults above apply.

The extra damage of Rooted Ambush becomes 2d6. Once on each of your turns, if you started the turn Hidden from your marked target, you can move 10 feet without ending Hidden until you leave cover.

<a id="path-mangrove-stalker-vanish-into-green-15"></a>
### Vanish into Green — `path:mangrove-stalker:vanish-into-green:15`

Owner path `mangrove-stalker`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Reaction when a creature you see hits you with an attack, spend one Thicket use to halve the damage and move 10 feet. This movement provokes Opportunity Attacks normally. You may Hide if you end in cover.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"mangrove-stalker:thicket","amount":1}].

<a id="path-memory-echo-borrowed-voice-3"></a>
### Borrowed Voice — `path:memory-echo:borrowed-voice:3`

Owner path `memory-echo`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose memory or voice. Gain Training in Read (memory) or Deceive (voice), or Expertise if already Trained. You can communicate telepathically with one willing creature within 30 feet that understands a language. As a Reaction spend one Echo use to add 1d6 to your failed Spirit or Instinct save; decide after the roll.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"memory-echo:echo","amount":1}].

<a id="path-memory-echo-recalled-pattern-6"></a>
### Recalled Pattern — `path:memory-echo:recalled-pattern:6`

Owner path `memory-echo`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

When a creature succeeds on a save against your Enchantment spell, you may spend two Sorcery Points to learn whether it is immune to Charmed. You can then move 10 feet without provoking Opportunity Attacks. This does not change the save result.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"tidecaller:sorcery-points","amount":2}].

<a id="path-memory-echo-shared-recollection-14"></a>
### Shared Recollection — `path:memory-echo:shared-recollection:14`

Owner path `memory-echo`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action spend one Echo use to link up to Training Bonus willing creatures within 30 feet for one hour. Each can communicate telepathically with the others within one mile. You must Concentrate as if on a spell.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"memory-echo:echo","amount":1}].

<a id="path-memory-echo-unwritten-self-18"></a>
### Unwritten Self — `path:memory-echo:unwritten-self:18`

Owner path `memory-echo`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest, as a Reaction when you fail an Wit, Instinct or Spirit save, succeed instead. End one Charmed or Frightened condition on yourself. This cannot reverse damage already resolved.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"memory-echo:unwritten","amount":1}].

<a id="path-tempest-heart-storm-pulse-3"></a>
### Storm Pulse — `path:tempest-heart:storm-pulse:3`

Owner path `tempest-heart`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose Lightning or Thunder. Gain Resistance to the chosen damage type. Once per turn when you cast a level 1+ spell, spend one Pulse use to move 10 feet without provoking Opportunity Attacks and deal chosen-type damage equal to your Spirit modifier (minimum one) to one creature within 10 feet.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"tempest-heart:pulse","amount":1}].

<a id="path-tempest-heart-conductive-soul-6"></a>
### Conductive Soul — `path:tempest-heart:conductive-soul:6`

Owner path `tempest-heart`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per turn when your spell deals the chosen damage type, add your Spirit modifier to one damage roll. As a Bonus Action spend two Sorcery Points to change one spells Lightning damage to Thunder or Thunder to Lightning for that casting.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"tidecaller:sorcery-points","amount":2}].

<a id="path-tempest-heart-eye-of-the-storm-14"></a>
### Eye of the Storm — `path:tempest-heart:eye-of-the-storm:14`

Owner path `tempest-heart`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain a Fly Speed of 30 feet while not wearing Heavy armor. When you use Storm Pulse, you may carry one willing adjacent creature of your size or smaller through the movement; it must end in an unoccupied space.

<a id="path-tempest-heart-living-tempest-18"></a>
### Living Tempest — `path:tempest-heart:living-tempest:18`

Owner path `tempest-heart`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Bonus Action become a storm for one minute. Your Fly Speed becomes 60 feet; you have Immunity to your chosen damage type and Resistance to the other. You may move through creatures as Difficult Terrain, but cannot end there.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"tempest-heart:tempest","amount":1}].

<a id="path-sanguine-conduit-blood-price-3"></a>
### Blood Price — `path:sanguine-conduit:blood-price:3`

Owner path `sanguine-conduit`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose shelter or surge. As a Bonus Action spend one Conduit use and lose Health equal to twice your Training Bonus (this cannot be reduced and cannot reduce you below 1). Shelter grants one creature within 30 feet temporary Health equal to 1d8 + Spirit; surge adds 1d8 Necrotic damage to one damage roll of the next spell you cast before your next turn.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"sanguine-conduit:conduit","amount":1}].

<a id="path-sanguine-conduit-measured-sacrifice-6"></a>
### Measured Sacrifice — `path:sanguine-conduit:measured-sacrifice:6`

Owner path `sanguine-conduit`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Resistance to Necrotic damage. Blood Price uses 2d8 instead of 1d8. Once per Long Rest, as a Bonus Action lose 6 Health without reducing yourself below 1 to recover two Sorcery Points, never above your maximum.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"sanguine-conduit:transfusion","amount":1}].

<a id="path-sanguine-conduit-vital-circuit-14"></a>
### Vital Circuit — `path:sanguine-conduit:vital-circuit:14`

Owner path `sanguine-conduit`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

When a creature within 30 feet loses temporary Health granted by Blood Price, you may use your Reaction to grant another creature within 30 feet temporary Health equal to your Spirit modifier (minimum one). This grants no healing and cannot trigger itself.

<a id="path-sanguine-conduit-unbroken-current-18"></a>
### Unbroken Current — `path:sanguine-conduit:unbroken-current:18`

Owner path `sanguine-conduit`; unlock 18; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest when reduced to 0 Health but not killed outright, as a Reaction remain at 1 Health and gain temporary Health equal to your Tidecaller level. Blood Price now uses 3d8.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"sanguine-conduit:unbroken-current","amount":1}].

<a id="path-oath-of-the-free-port-break-the-chain-3"></a>
### Break the Chain — `path:oath-of-the-free-port:break-the-chain:3`

Owner path `oath-of-the-free-port`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose liberty or refuge. As an Action expend one Channel Divinity use to end Grappled or Restrained on a creature within 30 feet; magical restraints require a Spirit check against the effect save DC. Liberty also moves it 10 feet without Opportunity Attacks; refuge grants temporary Health equal to your Warden level.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"warden:channel-divinity","amount":1}].

<a id="path-oath-of-the-free-port-aura-of-passage-7"></a>
### Aura of Passage — `path:oath-of-the-free-port:aura-of-passage:7`

Owner path `oath-of-the-free-port`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While your Aura of Protection is active, allies in it ignore nonmagical Difficult Terrain and have advantage on checks to escape Grappled. This does not grant immunity to movement-reducing spells.

<a id="path-oath-of-the-free-port-no-captive-left-15"></a>
### No Captive Left — `path:oath-of-the-free-port:no-captive-left:15`

Owner path `oath-of-the-free-port`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Reaction when an ally within your aura fails a save against Restrained or Paralyzed, spend 5 Lay On Hands points to let it reroll the save. It must use the new result. This does not restore Health.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"warden:lay-on-hands","amount":5}].

<a id="path-oath-of-the-free-port-open-harbor-20"></a>
### Open Harbor — `path:oath-of-the-free-port:open-harbor:20`

Owner path `oath-of-the-free-port`; unlock 20; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Bonus Action empower your aura for ten minutes. Allies within it have advantage on saves against Paralyzed and Restrained, and can Disengage as a Bonus Action. Restore this use by expending a level 5 spell slot.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"oath-of-the-free-port:open-harbor","amount":1}].

<a id="path-iron-covenant-covenant-of-steel-3"></a>
### Covenant of Steel — `path:iron-covenant:covenant-of-steel:3`

Owner path `iron-covenant`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose bulwark or sentinel. As a Bonus Action spend one Channel Divinity use to empower one Shield you hold for one minute. Bulwark adds +1 Guard while holding it; sentinel allows you to use a Reaction to impose disadvantage on one attack against an ally within 5 feet. The effect ends if you release the Shield.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"warden:channel-divinity","amount":1}].

<a id="path-iron-covenant-aura-of-resolve-7"></a>
### Aura of Resolve — `path:iron-covenant:aura-of-resolve:7`

Owner path `iron-covenant`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While your Aura of Protection is active, allies in it have advantage on saves against forced movement and against being knocked Prone. You must be conscious.

<a id="path-iron-covenant-take-the-burden-15"></a>
### Take the Burden — `path:iron-covenant:take-the-burden:15`

Owner path `iron-covenant`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As a Reaction when an ally in your aura takes damage, spend one Covenant use to take half that damage instead. This transferred damage cannot be reduced; the ally takes the remainder.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"iron-covenant:covenant","amount":1}].

<a id="path-iron-covenant-unyielding-standard-20"></a>
### Unyielding Standard — `path:iron-covenant:unyielding-standard:20`

Owner path `iron-covenant`; unlock 20; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Bonus Action for one minute, gain Resistance to Bludgeoning, Piercing and Slashing and prevent enemies from moving you against your will. Allies in your aura gain temporary Health equal to your Spirit modifier at the start of each of their turns. Restore the use with a level 5 spell slot.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"iron-covenant:standard","amount":1}].

<a id="path-lantern-vigil-light-the-watch-3"></a>
### Light the Watch — `path:lantern-vigil:light-the-watch:3`

Owner path `lantern-vigil`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose Radiant or Fire. As a Bonus Action spend one Channel Divinity use to create a 20-foot Bright Light aura for one minute. Once on each of your turns your first weapon hit deals 1d6 extra chosen-type damage. Undead hit by it cannot regain Health until your next turn.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"warden:channel-divinity","amount":1}].

<a id="path-lantern-vigil-aura-of-clear-sight-7"></a>
### Aura of Clear Sight — `path:lantern-vigil:aura-of-clear-sight:7`

Owner path `lantern-vigil`; unlock 7; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While your Aura of Protection is active, you and allies in it can see through nonmagical fog and have advantage on saves against Frightened caused by Undead. This does not pierce magical darkness.

<a id="path-lantern-vigil-watchfire-15"></a>
### Watchfire — `path:lantern-vigil:watchfire:15`

Owner path `lantern-vigil`; unlock 15; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Resistance to Necrotic damage. Your Light the Watch extra damage becomes 2d6. As an Action you can spend 5 Lay On Hands points to end one Charmed effect caused by an Undead on a creature you touch.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"warden:lay-on-hands","amount":5}].

<a id="path-lantern-vigil-dawn-at-sea-20"></a>
### Dawn at Sea — `path:lantern-vigil:dawn-at-sea:20`

Owner path `lantern-vigil`; unlock 20; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Bonus Action empower your aura for one minute. It becomes sunlight; Undead starting a turn in it take Radiant damage equal to your Training Bonus + Spirit modifier. You and allies in it have Resistance to Necrotic damage. Restore this use with a level 5 spell slot.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"lantern-vigil:dawn","amount":1}].

<a id="path-thunderhide-stormhide-3"></a>
### Stormhide — `path:thunderhide:stormhide:3`

Owner path `thunderhide`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose Thunder or Lightning. While Raging gain Resistance to the chosen type. Once on each of your turns when a Might-based melee attack hits during Rage, deal chosen-type damage equal to your Rage Damage bonus. As a Bonus Action spend one Stormhide use to leap 15 feet; movement provokes normally.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"thunderhide:stormhide","amount":1}].

<a id="path-thunderhide-weather-the-blow-6"></a>
### Weather the Blow — `path:thunderhide:weather-the-blow:6`

Owner path `thunderhide`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain permanent Resistance to your chosen type. When a creature hits you with a melee attack while you Rage, you may use your Reaction to deal chosen-type damage equal to your Resolve modifier (minimum one) to it.

<a id="path-thunderhide-thunderous-landing-10"></a>
### Thunderous Landing — `path:thunderhide:thunderous-landing:10`

Owner path `thunderhide`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

When you use the Stormhide leap, each creature of your choice within 5 feet of your landing space makes a Might save (DC 8 + Training Bonus + Might) or falls Prone. You must land on a supporting surface.

<a id="path-thunderhide-walking-storm-14"></a>
### Walking Storm — `path:thunderhide:walking-storm:14`

Owner path `thunderhide`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Rage as a Bonus Action spend one Stormhide use to emit a 10-foot Emanation until your next turn. Enemies that start a turn there make a Resolve save against your Stormhide DC, taking 3d6 chosen-type damage on failure or half on success.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"thunderhide:stormhide","amount":1}].

<a id="path-chainbreaker-break-their-hold-3"></a>
### Break Their Hold — `path:chainbreaker:break-their-hold:3`

Owner path `chainbreaker`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose rescuer or breaker. While Raging, once per turn when you hit with a Might-based melee attack, deal extra damage equal to your Rage Damage bonus if the target is Grappling an ally or carrying restraints. As a Bonus Action spend one Freedom use to let an adjacent ally immediately attempt to escape a grapple, using your Might (Athletics) modifier.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"chainbreaker:freedom","amount":1}].

<a id="path-chainbreaker-refuse-the-yoke-6"></a>
### Refuse the Yoke — `path:chainbreaker:refuse-the-yoke:6`

Owner path `chainbreaker`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While Raging, you have advantage on saves against Paralyzed and Restrained. Rescuer lets an ally within 5 feet use the same advantage; breaker doubles your weapon damage against nonmagical restraints and unattended doors.

<a id="path-chainbreaker-rally-the-bound-10"></a>
### Rally the Bound — `path:chainbreaker:rally-the-bound:10`

Owner path `chainbreaker`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action spend one Freedom use: up to three allies within 30 feet who hear you gain temporary Health equal to 1d8 + Resolve modifier. They can stand from Prone without spending movement.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"chainbreaker:freedom","amount":1}].

<a id="path-chainbreaker-none-shall-kneel-14"></a>
### None Shall Kneel — `path:chainbreaker:none-shall-kneel:14`

Owner path `chainbreaker`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Reaction when an ally within 30 feet fails a save against Charmed, Frightened or Restrained, let it succeed instead. You must be Raging and able to see the ally.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"chainbreaker:none-kneel","amount":1}].

<a id="path-reef-colossus-colossus-stance-3"></a>
### Colossus Stance — `path:reef-colossus:colossus-stance:3`

Owner path `reef-colossus`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose anchor or breaker. While Raging, you count as one size larger for carrying and grappling, to a maximum effective size of Large. Anchor grants advantage on saves against being moved; breaker adds your Rage Damage bonus to damage against objects. As a Bonus Action spend one Colossus use to gain temporary Health equal to your Reaver level + Resolve modifier.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"reef-colossus:colossus","amount":1}].

<a id="path-reef-colossus-reef-skin-6"></a>
### Reef Skin — `path:reef-colossus:reef-skin:6`

Owner path `reef-colossus`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While Raging and not wearing Heavy armor, reduce Bludgeoning, Piercing or Slashing damage from each attack by your Training Bonus after applying Resistance, to a minimum of 0. Your Speed is reduced by 5 feet while this benefit applies; you can suppress it until your next turn.

<a id="path-reef-colossus-deckshaker-10"></a>
### Deckshaker — `path:reef-colossus:deckshaker:10`

Owner path `reef-colossus`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action during Rage spend one Colossus use: creatures of your choice within 10 feet make a Might save (DC 8 + Training Bonus + Might), taking 3d8 Bludgeoning damage and falling Prone on failure, or half damage on success. This is not the Attack action.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"reef-colossus:colossus","amount":1}].

<a id="path-reef-colossus-mountain-in-the-strait-14"></a>
### Mountain in the Strait — `path:reef-colossus:mountain-in-the-strait:14`

Owner path `reef-colossus`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While Raging your reach for melee weapon attacks increases by 5 feet on your turn. Deckshaker damage becomes 5d8. Once per Long Rest when initiative is rolled with no Colossus uses, regain one.

<a id="path-plaguewarden-contain-the-fever-3"></a>
### Contain the Fever — `path:plaguewarden:contain-the-fever:3`

Owner path `plaguewarden`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose antidote or quarantine. Gain herbalism kit Training. As an Action expend one Channel Divinity use: antidote ends Poisoned on up to two creatures within 30 feet; quarantine forces one creature within 30 feet to make a Resolve save against your spell DC or have its Speed halved and lose Reactions for one minute (repeat save each turn).

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"doctor:channel-divinity","amount":1}].

<a id="path-plaguewarden-inoculated-6"></a>
### Inoculated — `path:plaguewarden:inoculated:6`

Owner path `plaguewarden`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Gain Resistance to Poison damage and advantage on saves against Poisoned. When you restore Health with a level 1+ spell, one healed creature has advantage on its next save against Poisoned within one hour.

<a id="path-plaguewarden-clean-bill-of-health-17"></a>
### Clean Bill of Health — `path:plaguewarden:clean-bill-of-health:17`

Owner path `plaguewarden`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as an Action restore 6d8 + Doctor level Health to one creature within reach and end Poisoned, Blinded and Deafened on it. You must expend one healer kit use. This cannot cure magical curses or restore missing body parts.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"plaguewarden:clean-bill","amount":1}].

<a id="path-keeper-of-last-breaths-stay-the-crossing-3"></a>
### Stay the Crossing — `path:keeper-of-last-breaths:stay-the-crossing:3`

Owner path `keeper-of-last-breaths`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose comfort or witness. As a Reaction when a creature within 30 feet falls to 0 Health but is not killed outright, spend one Vigil use to stabilize it. Comfort also grants temporary Health equal to your Instinct modifier (minimum one), which does not awaken it; witness lets it speak one sentence even while Unconscious.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"keeper-of-last-breaths:vigil","amount":1}].

<a id="path-keeper-of-last-breaths-witness-against-oblivion-6"></a>
### Witness Against Oblivion — `path:keeper-of-last-breaths:witness-against-oblivion:6`

Owner path `keeper-of-last-breaths`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action expend one Channel Divinity use to restore Health equal to twice your Doctor level to a creature at 0 Health within 30 feet. It can then stand without spending movement. This does not return a dead creature to life.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"doctor:channel-divinity","amount":1}].

<a id="path-keeper-of-last-breaths-one-more-dawn-17"></a>
### One More Dawn — `path:keeper-of-last-breaths:one-more-dawn:17`

Owner path `keeper-of-last-breaths`; unlock 17; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Once per Long Rest as a Reaction when a creature within 30 feet would die from failed death saves, restore it to 1 Health instead and reset its death saves. This cannot prevent instant death from massive damage or disintegration.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"keeper-of-last-breaths:one-dawn","amount":1}].

<a id="path-sparkwrite-aetherist-aether-relay-3"></a>
### Aether Relay — `path:sparkwrite-aetherist:aether-relay:3`

Owner path `sparkwrite-aetherist`; unlock 3; provenance original Archipelago mechanics. All mandatory field defaults above apply.

Choose grounded or mobile. Gain tinker tools Training. As a Bonus Action spend one Relay use to place a relay in an unoccupied space within 30 feet for one minute. You may originate one Shipwright cantrip per turn from that relay, measuring range from it while still requiring your own sight. Grounded grants the relay Guard 15 and Health equal to twice Shipwright level; mobile lets you move it 15 feet as a Bonus Action. One relay at a time.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"sparkwrite-aetherist:relay","amount":1}].

<a id="path-sparkwrite-aetherist-grounding-circuit-6"></a>
### Grounding Circuit — `path:sparkwrite-aetherist:grounding-circuit:6`

Owner path `sparkwrite-aetherist`; unlock 6; provenance original Archipelago mechanics. All mandatory field defaults above apply.

While within 10 feet of your relay, gain Resistance to Lightning damage and advantage on Resolve saves to maintain Concentration. If the relay is destroyed, the benefits end.

<a id="path-sparkwrite-aetherist-capacitor-discharge-10"></a>
### Capacitor Discharge — `path:sparkwrite-aetherist:capacitor-discharge:10`

Owner path `sparkwrite-aetherist`; unlock 10; provenance original Archipelago mechanics. All mandatory field defaults above apply.

As an Action spend one Relay use to detonate your relay. Creatures within 10 feet make an Agility save against your spell DC, taking 4d8 Lightning damage on failure or half on success. The relay is destroyed; you cannot exempt allies.

Paid active clause cost bindings (not costs for its passive/upgrading clauses): [{"poolId":"sparkwrite-aetherist:relay","amount":1}].

<a id="path-sparkwrite-aetherist-twin-circuit-14"></a>
### Twin Circuit — `path:sparkwrite-aetherist:twin-circuit:14`

Owner path `sparkwrite-aetherist`; unlock 14; provenance original Archipelago mechanics. All mandatory field defaults above apply.

You may maintain two relays. Each time you cast a Shipwright spell of level 1 or higher, you can teleport between two of your relays within 60 feet of each other, once per turn. Capacitor Discharge damage becomes 6d8.

## Normative Phase 1 completion rulings

### black-flag-envoy

Binding Parley imposes Charmed plus the stated attack prohibition. Both end for an individual if you or an ally damages it or imposes a harmful condition. Repeat the save at the end of its turns. Charmed immunity prevents both effects. Crew commands require sight of the ally, hearing, a conscious ally and an available Reaction.

### hollow-lantern

At level 3, investigator selects Investigate and watcher selects Perception; grant one skill only. Studying requires sight. The Last Tell uses no action and its own last-tell counter, not a Lantern use. Blindsight functions while conscious.

### saltglass-duelist

Cutlass uses equipment.md. Declare Open Challenge after the attack total is known and before damage. Answer in Steel requires the attacker within weapon reach and uses the same Reaction. Perfect Measure uses no action after your miss. Neither ability grants another Sneak Attack on one turn.

### iron-suppressor

Crossing Denied requires sight, an equipped ranged weapon, valid range and ammunition. Spend ammo and the Reaction; teleportation does not trigger it. The level-15 second creature requires sight and weapon range but takes no damage and consumes no extra attack/ammo. Push affects only Large or smaller creatures and cannot pass through solids.

### brass-outrider

Ride the Recoil uses no action after the attack, once on your turn. Its special 15-foot movement does not spend your ordinary Speed; a mount instead spends its remaining movement. Passing Shot counts voluntary Speed movement before the hit and excludes Recoil movement. Runner upgrades its selected skill to Expertise if already trained, as rider does.

### cinder-artillerist

Charge uses represent prepared kit components, not stockpilable or sellable bombs. Require carried smith's tools and a free hand, with no extra ammunition cost. Charges affect allies unless exempted. Smoke is obscurement, not Poisoned or recurring damage. Strong wind means at least 20 mph. Grand Battery uses one Action, two Charge uses and one battery counter; its 6d6 replaces ordinary dice, and overlap affects a creature once.

### starwake-pilot

Guide visible willing allies, excluding yourself. Homeward Star destinations must be distinct unoccupied supporting spaces within 60 feet of your activation point. Guidance ends with Concentration and removes granted speeds. Safe Bearing modifies an actual saving throw, not a navigation check without a save.

### mangrove-stalker

Hunter's Mark always means spell:hunter-s-mark. Rooted Ambush requires a weapon hit against your own marked target. Hide uses the normal Agility/Stealth DC 15 and required obscurement/cover; failure does not refund costs. Vanish permits Hide without an additional action as part of its Reaction.

### memory-echo

Opening/sending a short telepathic message on your turn uses no action. One willing link at a time, no shared language required, ends beyond 30 feet. Echo's Reaction occurs after a failed save before consequences. Recalled Pattern uses no action on the enemy's successful save, once per turn; pay two Sorcery Points to learn immunity and optionally move, without changing the save or refunding the spell.

### tempest-heart

Storm Pulse uses no action immediately after your level-one-or-higher spell resolves, once on your turn. Choose a visible damage target after moving. Conductive conversion uses a Bonus Action before the next Tidecaller spell on that same turn, costs two Sorcery Points and expires at turn end if unused. Its passive modifier applies once per turn, not per target.

### sanguine-conduit

Health loss bypasses temporary Health and Resistance and cannot leave less than 1; otherwise reject the entire operation. Bare Spirit means its modifier. Surge expires at the start of your next turn or after its first damage roll. Vital Circuit triggers once per turn when damage reduces Blood Price's temporary Health, not on expiry/replacement or from its own secondary pool. Unbroken Current resolves its Reaction before Unconscious applies.

### oath-of-the-free-port

The removal target must be willing and visible. A magical restraint without a printed DC uses DC 15 for this feature. Open Harbor restoration uses a Bonus Action and exactly one level-five slot, only while its counter is spent; it restores a use without activating the ability.

### iron-covenant

Sentinel requires seeing the attacker and declaration before the attack roll. Take the Burden splits post-mitigation damage: owner takes floor(damage/2), ally takes the remainder. Owner's portion cannot be reduced or transferred recursively. Standard temporary Health is max(1, Spirit modifier). Restore its spent counter as a Bonus Action with exactly one level-five slot.

### lantern-vigil

Light the Watch is not sunlight before level 20. Healing prevention lasts until the start of your next turn. Dawn damage is max(1, TB+Spirit modifier), without a save, at each Undead's turn start. Restore Dawn as a Bonus Action with exactly one level-five slot.

### thunderhide

Leap is special movement to a visible unoccupied supporting space and cannot cross solid barriers. Leaping need not occur during Rage, but damage/landing riders require Rage. Weather the Blow resolves after damage while conscious and seeing the attacker. Walking Storm is once per Rage instance, costs one Stormhide use and uses DC 8+TB+Might modifier.

### chainbreaker

The ally's escape check uses the source grapple DC and your full Might/Athletics modifier; no ally action is spent. Rescuer at level 6 benefits all willing allies within 5 feet while you Rage. Rally grants max(0,1d8+Resolve modifier) temporary Health to each selected target.

### reef-colossus

Effective size changes carrying and grapple limits, not token size, reach or damage dice. Suppress Reef Skin without an action on your turn until your next turn starts. A successful Deckshaker save prevents Prone. Initiative recovery spends a distinct colossus-reserve counter, one per Long Rest; repeat initiative cannot farm recovery.

### plaguewarden

Quarantine repeats its Resolve save at the end of each target turn; success ends both restrictions. This is not Poisoned and poison immunity does not prevent it. Clean Bill requires touch within 5 feet, one counter and one healer's kit charge.

### keeper-of-last-breaths

Stay the Crossing requires sight, resolves after reaching 0 but before later death saves, and temporary Health does not awaken its target. One More Dawn resolves before death from the third failed death save is finalized; it cannot reverse an already recorded death.

### sparkwrite-aetherist

All relays are magical one-foot objects, Guard 15, Health twice Shipwright level, immune to Poison/Psychic, no turns, no movement blocking. They expire after one minute or at 0 Health. Grounded is immobile; mobile moves 15 feet per Bonus Action within 60 feet of you. At level 14 a third relay dismisses one chosen relay. Cantrip casting changes range origin only; your sight, components and cover remain relevant. Twin Circuit uses no action after a spell: begin within 5 feet of one relay and end in a visible unoccupied space within 5 feet of the other; relays at most 60 feet apart. Discharge destroys only the chosen relay.

### drydock-ghost

Repair needs carpenter's tools and caps at object maximum Health. Sabotage needs thieves' tools and physically feasible tampering; it does not grant unlimited destruction. Salvage needs a wreck and its once-per-Long-Rest counter; earmarked copper credits are consumed once and cannot become gold. Silent Keel affects at most six creatures OR one vehicle at most 100 feet long, without granting each passenger a personal Stealth benefit.

### storm-broker

The zone is fixed, its center must be visible, and only one may exist; creating another replaces it. No Concentration required. Crosswind applies when the attack line crosses any zone space; surge is ordinary Difficult Terrain. Captain's Credit triggers once per round on any ally's turn or your turn, correcting contradictory draft timing, and grants max(1, TB+Instinct modifier) temporary Health. Eye reserve has a separate one-per-Long-Rest counter.

### field-surgeon

Choose clinicalAttribute instinct or wit at level 3, fixed for the build. Replace Instinct in every Doctor/Path spell, DC and feature, including Channel and existing preparations, but not unrelated skills/saves. Triage requires sight, touch within 5 feet, one Triage use and one kit charge. Healer-kit Training is narrative permission without extra dice. Toxicology uses the same costs and target restriction; poison advantage means saves against Poisoned. Impossible Operation requires consent, touch, one operation counter per Long Rest, one Channel use, five kit charges and its printed body/death conditions.

### breakwater

Placement requires sight, support and no overlap with solids. Its printed half/three-quarters cover controls; ordinary movement is blocked except for selected level-ten passers. Shelter selects at most TB creatures within 5 feet of the barrier, once on creation. The level-fourteen free barrier uses its own hold-sea counter per Long Rest. Barrier Resistance excludes Force and siege damage; reaction reduction applies before the target's Resistance.

## Complete Metamagic option catalog

Stable IDs metamagic:<slug>;2 choices at2,2more at10/17, at most1 replacement per Tidecaller level. Normal one option/spell, two during Sorcery Incarnate; Empowered/Seeking explicitly combine with another. Costs paid at event.

| ID suffix | Cost/timing | Exact effect |
| --- | --- | --- |
| careful | 1SP;cast | Choose≤max(1,Spirit modifier) saving creatures; automatically succeed and no damage if save normally halves. |
| distant | 1SP;cast | Range≥5ft doubles;Touch→30ft;no area growth. |
| empowered | 1SP;damage | Reroll≤max(1,Spirit modifier)damage dice once,use new;can combine another option. |
| extended | 1SP;cast | Duration≥1min doubles,max24hours;advantage on Concentration saves for casting. |
| heightened | 2SP;cast | One target disadvantage on all saves against this spell for duration. |
| quickened | 2SP;cast | Action→Bonus Action;cannot after another level1+ spell this turn or cast another level1+ spell afterward that turn. |
| seeking | 1SP;spell attack miss | Reroll d20,use new;can combine another option. |
| subtle | 1SP;cast | RemoveV/S/M except priced or consumed M. |
| transmuted | 1SP;cast | One Acid/Cold/Fire/Lightning/Poison/Thunder damage type→another from list for casting. |
| twinned | 1SP;cast | Spell whose higher-level text adds targets gains effective+1level for target count only;ordinary slot spent,no damage/duration upcast. |


## Base feature suboperations

Doctor Channel: Divine Spark Action, one visible creature30ft,1Channel;heal1d8+casting modifier OR Resolve save spellDC,Radiant/Necrotic damage half success;dice2/3/4d8 at7/13/18. Turn Undead Action,1Channel,chosen visible Undead30ft,Instinct save or Frightened+Incapacitated1min;ends on damage,your Incapacitated/death. Sear Undead adds max(1,casting modifier)d8Radiant on failed Turn save without ending turn effect. Warden Divine Sense Bonus Action1Channel,detect type/location Celestial/Fiend/Undead60ft for10min,ends Incapacitated,total cover blocks.

Corsair Cunning Strike options per eligible Sneak hit: Poison1die,Resolve saveDC8+TB+Agility or Poisoned1min,end-turn repeat,poisoner-kit carried;Trip1die,Large-or-smaller Agility save or Prone;Withdraw1die,halfSpeed movement no Opportunity. Level11 up to2distinct effects,sum dice. Devious14: Daze2dice,Resolve save,next turn only one of move/Action/Bonus Action;Knock Out6dice,Resolve or Unconscious1min,ends damage/end-turn success;Obscure3dice,Agility or Blinded until end next turn. Cannot spend more dice than Sneak capacity.

Reaver Brutal Strike forgo Reckless advantage on one Might attack on your turn, no disadvantage permitted;hit+1d10 at9,+2d10 at17. Choose Forceful15ft push,follow halfSpeed without target's Opportunity;or Hamstring−15ftSpeed until start next turn. At13 add Staggering(disadvantage next save/no Opportunity until start next turn),Sundering(+5next other creature attack before start next turn). At17 choose2distinct. No resource cost.

Mastery capacities callings.md;eligible trained types,Reaver melee only. Fighting styles feats.md. Heroic Inspiration Boolean,no stacking;spend no action after die roll to reroll one die,use new. Features generating each turn never bank multiple. SRD glossary is normative for conditions,Hide,death saves,cover and ordinary actions; future encounter adapters must preserve it.

## Inherited SRD exceptions and operation bindings

A Magic action is an Action with the Magic tag, not an ordinary untagged action. Doctor Divine Spark/Turn Undead require presenting a Holy Symbol and use Magic actions; Turn Undead does not require seeing each target, only the stated 30-foot area. The shorter completion summary does not add a sight requirement to its full SRD rule. Warden level-twenty Leviathan Anchor Nimbus restoration remains no action, as its entry says; the Bonus Action restoration ruling applies only to the three original Warden Paths. Reef Knife level-thirteen attunement raises the ordinary limit from three to four. Reef Knife level-seventeen grants its printed second first-round turn, an explicit exception to the ordinary turn economy.

Every Magic Initiate, Signature Spell, wing restoration, Bloodwake presence restoration, Nimbus restoration, Overchannel escalation and once-per-rest feature must have a source-bound backend option. Free spell casts are spells with their printed action/component requirements unless the granting feature overrides them. The operation must select its source counter or slot and cannot consume both accidentally.
