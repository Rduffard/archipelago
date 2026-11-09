# Eight Callings: complete levels 1–20

All ability IDs resolve in abilities.md. Repeated grants use unique source-level grant keys. Numerical columns are full capacity at that level, not increments. TB=2+floor((level−1)/4). Spellcasting tables are in spells.md; recovery in resources.md. Leveling preserves spent resources.

## Corsair — `corsair`

Agile specialist and precision attacker; primary Agility; secondary Wit or Spirit. Foundation rogue, SRD p61. Starting Health 8+Resolve modifier (minimum 1); Hit Die d8, later fixed gain 5+Resolve modifier (minimum 1). Saves: agility, wit. Choose 4 distinct skills from acrobatics, athletics, deception, insight, intimidation, investigation, perception, persuasion, sleight-of-hand, stealth. Weapon Training simple, martial:finesse-or-light; armor light; tools thieves-tools. No other tools unless granted. Starting equipment in equipment.md. Casting none. No creation attribute minimum.

Paths: Reef Knife, Black Flag Envoy, Hollow Lantern, Saltglass Duelist. Feature levels 3, 9, 13, 17; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:corsair:expertise:1`, `calling:corsair:sneak-attack:1`, `calling:corsair:thieves-cant:1`, `calling:corsair:weapon-mastery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":1,"expertiseCount":2} |
| 2 | 2 | `calling:corsair:cunning-action:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":1,"expertiseCount":2} |
| 3 | 2 | `calling:corsair:steady-aim:3` | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":2,"expertiseCount":2} |
| 4 | 2 | `calling:corsair:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":2,"expertiseCount":2} |
| 5 | 3 | `calling:corsair:cunning-strike:5`, `calling:corsair:uncanny-dodge:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":3,"expertiseCount":2} |
| 6 | 3 | `calling:corsair:expertise:1` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":3,"expertiseCount":4} |
| 7 | 3 | `calling:corsair:evasion:7`, `calling:corsair:reliable-talent:7` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":4,"expertiseCount":4} |
| 8 | 3 | `calling:corsair:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":4,"expertiseCount":4} |
| 9 | 4 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":5,"expertiseCount":4} |
| 10 | 4 | `calling:corsair:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":5,"expertiseCount":4} |
| 11 | 4 | `calling:corsair:improved-cunning-strike:11` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":6,"expertiseCount":4} |
| 12 | 4 | `calling:corsair:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":6,"expertiseCount":4} |
| 13 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":7,"expertiseCount":4} |
| 14 | 5 | `calling:corsair:devious-strikes:14` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":7,"expertiseCount":4} |
| 15 | 5 | `calling:corsair:slippery-mind:15` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":8,"expertiseCount":4} |
| 16 | 5 | `calling:corsair:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":8,"expertiseCount":4} |
| 17 | 6 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":9,"expertiseCount":4} |
| 18 | 6 | `calling:corsair:elusive:18` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":9,"expertiseCount":4} |
| 19 | 6 | `calling:corsair:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":10,"expertiseCount":4} |
| 20 | 6 | `calling:corsair:stroke-of-luck:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"sneakAttackDice":10,"expertiseCount":4} |

## Gunslinger — `gunslinger`

Sustained weapon specialist and tactical front line; primary Might or Agility; secondary Resolve. Foundation fighter, SRD p47. Starting Health 10+Resolve modifier (minimum 1); Hit Die d10, later fixed gain 6+Resolve modifier (minimum 1). Saves: might, resolve. Choose 2 distinct skills from acrobatics, animal-handling, athletics, history, insight, intimidation, persuasion, perception, survival. Weapon Training simple, martial; armor light, medium, heavy, shield; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting none. No creation attribute minimum.

Paths: Deadeye, Iron Suppressor, Brass Outrider, Cinder Artillerist. Feature levels 3, 7, 10, 15, 18; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:gunslinger:fighting-style:1`, `calling:gunslinger:second-wind:1`, `calling:gunslinger:weapon-mastery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":3,"secondWindUses":2,"actionSurgeUses":0,"indomitableUses":0} |
| 2 | 2 | `calling:gunslinger:action-surge:2`, `calling:gunslinger:tactical-mind:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":3,"secondWindUses":2,"actionSurgeUses":1,"indomitableUses":0} |
| 3 | 2 | No new grant | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":3,"secondWindUses":2,"actionSurgeUses":1,"indomitableUses":0} |
| 4 | 2 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":0} |
| 5 | 3 | `calling:gunslinger:extra-attack:5`, `calling:gunslinger:tactical-shift:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":0} |
| 6 | 3 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":0} |
| 7 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":0} |
| 8 | 3 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":0} |
| 9 | 4 | `calling:gunslinger:indomitable:9`, `calling:gunslinger:tactical-master:9` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"secondWindUses":3,"actionSurgeUses":1,"indomitableUses":1} |
| 10 | 4 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":1} |
| 11 | 4 | `calling:gunslinger:two-extra-attacks:11` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":3,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":1} |
| 12 | 4 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":3,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":1} |
| 13 | 5 | `calling:gunslinger:indomitable:9`, `calling:gunslinger:studied-attacks:13` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":3,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":2} |
| 14 | 5 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":3,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":2} |
| 15 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":3,"masteryCount":5,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":2} |
| 16 | 5 | `calling:gunslinger:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":3,"masteryCount":6,"secondWindUses":4,"actionSurgeUses":1,"indomitableUses":2} |
| 17 | 6 | `calling:gunslinger:action-surge:2`, `calling:gunslinger:indomitable:9` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":3,"masteryCount":6,"secondWindUses":4,"actionSurgeUses":2,"indomitableUses":3} |
| 18 | 6 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":3,"masteryCount":6,"secondWindUses":4,"actionSurgeUses":2,"indomitableUses":3} |
| 19 | 6 | `calling:gunslinger:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":3,"masteryCount":6,"secondWindUses":4,"actionSurgeUses":2,"indomitableUses":3} |
| 20 | 6 | `calling:gunslinger:three-extra-attacks:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":4,"masteryCount":6,"secondWindUses":4,"actionSurgeUses":2,"indomitableUses":3} |

## Navigator — `navigator`

Scout, guide and weapon/spell hybrid; primary Agility and Instinct. Foundation ranger, SRD p57. Starting Health 10+Resolve modifier (minimum 1); Hit Die d10, later fixed gain 6+Resolve modifier (minimum 1). Saves: might, agility. Choose 3 distinct skills from animal-handling, athletics, insight, investigation, nature, perception, stealth, survival. Weapon Training simple, martial; armor light, medium, shield; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting half using instinct. No creation attribute minimum.

Paths: Gray Net, Storm Broker, Starwake Pilot, Mangrove Stalker. Feature levels 3, 7, 11, 15; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:navigator:spellcasting:1`, `calling:navigator:favored-enemy:1`, `calling:navigator:weapon-mastery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"favoredEnemyUses":2,"expertiseCount":0,"huntersMarkDie":6} |
| 2 | 2 | `calling:navigator:deft-explorer:2`, `calling:navigator:fighting-style:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"favoredEnemyUses":2,"expertiseCount":1,"huntersMarkDie":6} |
| 3 | 2 | No new grant | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":2,"favoredEnemyUses":2,"expertiseCount":1,"huntersMarkDie":6} |
| 4 | 2 | `calling:navigator:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"favoredEnemyUses":2,"expertiseCount":1,"huntersMarkDie":6} |
| 5 | 3 | `calling:navigator:extra-attack:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":3,"expertiseCount":1,"huntersMarkDie":6} |
| 6 | 3 | `calling:navigator:roving:6` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":3,"expertiseCount":1,"huntersMarkDie":6} |
| 7 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":3,"expertiseCount":1,"huntersMarkDie":6} |
| 8 | 3 | `calling:navigator:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":3,"expertiseCount":1,"huntersMarkDie":6} |
| 9 | 4 | `calling:navigator:expertise:9` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":4,"expertiseCount":3,"huntersMarkDie":6} |
| 10 | 4 | `calling:navigator:tireless:10` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":4,"expertiseCount":3,"huntersMarkDie":6} |
| 11 | 4 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":4,"expertiseCount":3,"huntersMarkDie":6} |
| 12 | 4 | `calling:navigator:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":4,"expertiseCount":3,"huntersMarkDie":6} |
| 13 | 5 | `calling:navigator:relentless-hunter:13` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":5,"expertiseCount":3,"huntersMarkDie":6} |
| 14 | 5 | `calling:navigator:nature-s-veil:14` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":5,"expertiseCount":3,"huntersMarkDie":6} |
| 15 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":5,"expertiseCount":3,"huntersMarkDie":6} |
| 16 | 5 | `calling:navigator:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":5,"expertiseCount":3,"huntersMarkDie":6} |
| 17 | 6 | `calling:navigator:precise-hunter:17` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":6,"expertiseCount":3,"huntersMarkDie":6} |
| 18 | 6 | `calling:navigator:feral-senses:18` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":6,"expertiseCount":3,"huntersMarkDie":6} |
| 19 | 6 | `calling:navigator:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":6,"expertiseCount":3,"huntersMarkDie":6} |
| 20 | 6 | `calling:navigator:foe-slayer:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"favoredEnemyUses":6,"expertiseCount":3,"huntersMarkDie":10} |

## Tidecaller — `tidecaller`

Innate full caster and spell modifier; primary Spirit; secondary Resolve. Foundation sorcerer, SRD p64. Starting Health 6+Resolve modifier (minimum 1); Hit Die d6, later fixed gain 4+Resolve modifier (minimum 1). Saves: resolve, spirit. Choose 2 distinct skills from arcana, deception, insight, intimidation, persuasion, religion. Weapon Training simple; armor none; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting full using spirit. No creation attribute minimum.

Paths: Omen Diver, Memory Echo, Tempest Heart, Sanguine Conduit. Feature levels 3, 6, 14, 18; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:tidecaller:spellcasting:1`, `calling:tidecaller:innate-sorcery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":0,"innateSorceryUses":2,"metamagicCount":0} |
| 2 | 2 | `calling:tidecaller:font-of-magic:2`, `calling:tidecaller:metamagic:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":2,"innateSorceryUses":2,"metamagicCount":2} |
| 3 | 2 | No new grant | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":3,"innateSorceryUses":2,"metamagicCount":2} |
| 4 | 2 | `calling:tidecaller:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":4,"innateSorceryUses":2,"metamagicCount":2} |
| 5 | 3 | `calling:tidecaller:sorcerous-restoration:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":5,"innateSorceryUses":2,"metamagicCount":2} |
| 6 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":6,"innateSorceryUses":2,"metamagicCount":2} |
| 7 | 3 | `calling:tidecaller:sorcery-incarnate:7` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":7,"innateSorceryUses":2,"metamagicCount":2} |
| 8 | 3 | `calling:tidecaller:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":8,"innateSorceryUses":2,"metamagicCount":2} |
| 9 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":9,"innateSorceryUses":2,"metamagicCount":2} |
| 10 | 4 | `calling:tidecaller:metamagic:2` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":10,"innateSorceryUses":2,"metamagicCount":4} |
| 11 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":11,"innateSorceryUses":2,"metamagicCount":4} |
| 12 | 4 | `calling:tidecaller:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":12,"innateSorceryUses":2,"metamagicCount":4} |
| 13 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":13,"innateSorceryUses":2,"metamagicCount":4} |
| 14 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":14,"innateSorceryUses":2,"metamagicCount":4} |
| 15 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":15,"innateSorceryUses":2,"metamagicCount":4} |
| 16 | 5 | `calling:tidecaller:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":16,"innateSorceryUses":2,"metamagicCount":4} |
| 17 | 6 | `calling:tidecaller:metamagic:2` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":17,"innateSorceryUses":2,"metamagicCount":6} |
| 18 | 6 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":18,"innateSorceryUses":2,"metamagicCount":6} |
| 19 | 6 | `calling:tidecaller:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":19,"innateSorceryUses":2,"metamagicCount":6} |
| 20 | 6 | `calling:tidecaller:arcane-apotheosis:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"sorceryPoints":20,"innateSorceryUses":2,"metamagicCount":6} |

## Warden — `warden`

Armored protector and burst spell/weapon hybrid; primary Might and Spirit. Foundation paladin, SRD p53. Starting Health 10+Resolve modifier (minimum 1); Hit Die d10, later fixed gain 6+Resolve modifier (minimum 1). Saves: instinct, spirit. Choose 2 distinct skills from athletics, insight, intimidation, medicine, persuasion, religion. Weapon Training simple, martial; armor light, medium, heavy, shield; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting half using spirit. No creation attribute minimum.

Paths: Leviathan Anchor, Oath of the Free Port, Iron Covenant, Lantern Vigil. Feature levels 3, 7, 15, 20; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:warden:lay-on-hands:1`, `calling:warden:spellcasting:1`, `calling:warden:weapon-mastery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"layOnHands":5,"channelDivinityUses":0,"auraRadius":0} |
| 2 | 2 | `calling:warden:fighting-style:2`, `calling:warden:paladin-s-smite:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"layOnHands":10,"channelDivinityUses":0,"auraRadius":0} |
| 3 | 2 | `calling:warden:channel-divinity:3` | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":2,"layOnHands":15,"channelDivinityUses":2,"auraRadius":0} |
| 4 | 2 | `calling:warden:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":2,"layOnHands":20,"channelDivinityUses":2,"auraRadius":0} |
| 5 | 3 | `calling:warden:extra-attack:5`, `calling:warden:faithful-steed:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":25,"channelDivinityUses":2,"auraRadius":0} |
| 6 | 3 | `calling:warden:aura-of-protection:6` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":30,"channelDivinityUses":2,"auraRadius":10} |
| 7 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":35,"channelDivinityUses":2,"auraRadius":10} |
| 8 | 3 | `calling:warden:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"layOnHands":40,"channelDivinityUses":2,"auraRadius":10} |
| 9 | 4 | `calling:warden:abjure-foes:9` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":45,"channelDivinityUses":2,"auraRadius":10} |
| 10 | 4 | `calling:warden:aura-of-courage:10` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":50,"channelDivinityUses":2,"auraRadius":10} |
| 11 | 4 | `calling:warden:radiant-strikes:11` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":55,"channelDivinityUses":3,"auraRadius":10} |
| 12 | 4 | `calling:warden:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"layOnHands":60,"channelDivinityUses":3,"auraRadius":10} |
| 13 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":65,"channelDivinityUses":3,"auraRadius":10} |
| 14 | 5 | `calling:warden:restoring-touch:14` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":70,"channelDivinityUses":3,"auraRadius":10} |
| 15 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":75,"channelDivinityUses":3,"auraRadius":10} |
| 16 | 5 | `calling:warden:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":2,"layOnHands":80,"channelDivinityUses":3,"auraRadius":10} |
| 17 | 6 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":85,"channelDivinityUses":3,"auraRadius":10} |
| 18 | 6 | `calling:warden:aura-expansion:18` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":90,"channelDivinityUses":3,"auraRadius":30} |
| 19 | 6 | `calling:warden:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":2,"masteryCount":2,"layOnHands":95,"channelDivinityUses":3,"auraRadius":30} |
| 20 | 6 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":2,"layOnHands":100,"channelDivinityUses":3,"auraRadius":30} |

## Reaver — `reaver`

Durable boarding attacker; primary Might; secondary Resolve and Agility. Foundation barbarian, SRD p28. Starting Health 12+Resolve modifier (minimum 1); Hit Die d12, later fixed gain 7+Resolve modifier (minimum 1). Saves: might, resolve. Choose 2 distinct skills from animal-handling, athletics, intimidation, nature, perception, survival. Weapon Training simple, martial; armor light, medium, shield; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting none. No creation attribute minimum.

Paths: Bloodwake, Thunderhide, Chainbreaker, Reef Colossus. Feature levels 3, 6, 10, 14; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:reaver:rage:1`, `calling:reaver:unarmored-defense:1`, `calling:reaver:weapon-mastery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"rageUses":2,"rageDamage":2} |
| 2 | 2 | `calling:reaver:danger-sense:2`, `calling:reaver:reckless-attack:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":2,"rageUses":2,"rageDamage":2} |
| 3 | 2 | `calling:reaver:primal-knowledge:3` | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":2,"rageUses":3,"rageDamage":2} |
| 4 | 2 | `calling:reaver:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":3,"rageUses":3,"rageDamage":2} |
| 5 | 3 | `calling:reaver:extra-attack:5`, `calling:reaver:fast-movement:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":3,"rageUses":3,"rageDamage":2} |
| 6 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":3,"rageUses":4,"rageDamage":2} |
| 7 | 3 | `calling:reaver:feral-instinct:7`, `calling:reaver:instinctive-pounce:7` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":3,"rageUses":4,"rageDamage":2} |
| 8 | 3 | `calling:reaver:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":3,"rageUses":4,"rageDamage":2} |
| 9 | 4 | `calling:reaver:brutal-strike:9` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":3,"rageUses":4,"rageDamage":3} |
| 10 | 4 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":4,"rageDamage":3} |
| 11 | 4 | `calling:reaver:relentless-rage:11` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":4,"rageDamage":3} |
| 12 | 4 | `calling:reaver:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":4,"rageUses":5,"rageDamage":3} |
| 13 | 5 | `calling:reaver:improved-brutal-strike:13` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":5,"rageDamage":3} |
| 14 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":5,"rageDamage":3} |
| 15 | 5 | `calling:reaver:persistent-rage:15` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":5,"rageDamage":3} |
| 16 | 5 | `calling:reaver:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":2,"masteryCount":4,"rageUses":5,"rageDamage":4} |
| 17 | 6 | `calling:reaver:improved-brutal-strike:13` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":6,"rageDamage":4} |
| 18 | 6 | `calling:reaver:indomitable-might:18` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":6,"rageDamage":4} |
| 19 | 6 | `calling:reaver:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":2,"masteryCount":4,"rageUses":6,"rageDamage":4} |
| 20 | 6 | `calling:reaver:primal-champion:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":2,"masteryCount":4,"rageUses":6,"rageDamage":4} |

## Doctor — `doctor`

Full caster and spiritual/clinical support; primary Instinct (Field Surgeon may select Wit). Foundation cleric, SRD p36. Starting Health 8+Resolve modifier (minimum 1); Hit Die d8, later fixed gain 5+Resolve modifier (minimum 1). Saves: instinct, spirit. Choose 2 distinct skills from history, insight, medicine, persuasion, religion. Weapon Training simple; armor light, medium, shield; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting full using instinct. No creation attribute minimum.

Paths: Sanctuary Hand, Field Surgeon, Plaguewarden, Keeper of Last Breaths. Feature levels 3, 6, 17; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:doctor:spellcasting:1`, `calling:doctor:divine-order:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":0,"divineSparkDice":0} |
| 2 | 2 | `calling:doctor:channel-divinity:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":2,"divineSparkDice":1} |
| 3 | 2 | No new grant | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":2,"divineSparkDice":1} |
| 4 | 2 | `calling:doctor:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":2,"divineSparkDice":1} |
| 5 | 3 | `calling:doctor:sear-undead:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":2,"divineSparkDice":1} |
| 6 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":1} |
| 7 | 3 | `calling:doctor:blessed-strikes:7` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 8 | 3 | `calling:doctor:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 9 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 10 | 4 | `calling:doctor:divine-intervention:10` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 11 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 12 | 4 | `calling:doctor:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":2} |
| 13 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":3} |
| 14 | 5 | `calling:doctor:improved-blessed-strikes:14` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":3} |
| 15 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":3} |
| 16 | 5 | `calling:doctor:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":3} |
| 17 | 6 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":3,"divineSparkDice":3} |
| 18 | 6 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":4,"divineSparkDice":4} |
| 19 | 6 | `calling:doctor:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":4,"divineSparkDice":4} |
| 20 | 6 | `calling:doctor:greater-divine-intervention:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"channelDivinityUses":4,"divineSparkDice":4} |

## Shipwright — `shipwright`

Prepared full caster, magical engineering and utility; primary Wit; secondary Resolve. Foundation wizard, SRD p77. Starting Health 6+Resolve modifier (minimum 1); Hit Die d6, later fixed gain 4+Resolve modifier (minimum 1). Saves: wit, instinct. Choose 2 distinct skills from arcana, history, insight, investigation, medicine, nature, religion. Weapon Training simple; armor none; tools none. No other tools unless granted. Starting equipment in equipment.md. Casting full using wit. No creation attribute minimum.

Paths: Powder Saint, Drydock Ghost, Breakwater, Sparkwrite Aetherist. Feature levels 3, 6, 10, 14; additional Path spell grants apply at listed spell thresholds.

| Level | TB | Calling ability grants / upgrades | Path integration | Required choice | Full numerical capacity |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | `calling:shipwright:spellcasting:1`, `calling:shipwright:ritual-adept:1`, `calling:shipwright:arcane-recovery:1` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":1} |
| 2 | 2 | `calling:shipwright:scholar:2` | No Path before level 3 | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":1} |
| 3 | 2 | No new grant | Selected Path grants | Choose owned Path | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":2} |
| 4 | 2 | `calling:shipwright:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":2} |
| 5 | 3 | `calling:shipwright:memorize-spell:5` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":3} |
| 6 | 3 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":3} |
| 7 | 3 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":4} |
| 8 | 3 | `calling:shipwright:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":4} |
| 9 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":5} |
| 10 | 4 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":5} |
| 11 | 4 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":6} |
| 12 | 4 | `calling:shipwright:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":6} |
| 13 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":7} |
| 14 | 5 | No new grant | Selected Path grants | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":7} |
| 15 | 5 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":8} |
| 16 | 5 | `calling:shipwright:ability-score-improvement:4` | Inherited Path effects; additional spell grants if specified | Eligible feat or ASI | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":8} |
| 17 | 6 | No new grant | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":9} |
| 18 | 6 | `calling:shipwright:spell-mastery:18` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":9} |
| 19 | 6 | `calling:shipwright:epic-boon:19` | Inherited Path effects; additional spell grants if specified | Eligible feat including Epic Boon | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":10} |
| 20 | 6 | `calling:shipwright:signature-spells:20` | Inherited Path effects; additional spell grants if specified | Any new feature subchoices; otherwise none | {"attacksPerAction":1,"masteryCount":0,"arcaneRecoveryLevels":10} |
