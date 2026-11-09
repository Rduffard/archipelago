# Equipment, inventory and loadouts

SRD mundane gear is available without geographic restrictions. Use integer copper (100 cp=1 GP), positive integer quantities and nonnegative charges. The original Cutlass completes old null fields: scimitar equivalent, 1d6 Slashing, Finesse, Light, Nick mastery, 3 lb, 25 GP. Tool/custom-name grants do not imply weapon statistics.

## Starting equipment

Choose one Calling package OR its gold alternative, plus one background package OR 50 GP. Repeated item IDs mean quantity. All gear begins carried; equip through explicit legal loadout selections.

| Calling | Gold alternativeGP | PackA:items;GP | PackB |
| --- | --- | --- | --- |
| corsair | 100 | leather-armor, dagger, dagger, shortsword, shortbow, 20 Arrows, Quiver, Thieves' Tools, Burglar's Pack;8 | None |
| gunslinger | 155 | chain-mail, greatsword, flail, javelin, javelin, javelin, javelin, javelin, javelin, javelin, javelin, Dungeoneer's Pack;4 | studded-leather-armor, scimitar, shortsword, longbow, 20 Arrows, Quiver, Dungeoneer's Pack;11 |
| navigator | 150 | studded-leather-armor, scimitar, shortsword, longbow, 20 Arrows, Quiver, Druidic Focus, Explorer's Pack;7 | None |
| tidecaller | 50 | spear, dagger, dagger, Arcane Focus (crystal), Dungeoneer's Pack;28 | None |
| warden | 150 | chain-mail, shield, longsword, javelin, javelin, javelin, javelin, javelin, javelin, Holy Symbol, Priest's Pack;9 | None |
| reaver | 75 | greataxe, handaxe, handaxe, handaxe, handaxe, Explorer's Pack;15 | None |
| doctor | 110 | chain-shirt, shield, mace, Holy Symbol, Priest's Pack;7 | None |
| shipwright | 55 | dagger, dagger, Arcane Focus (quarterstaff), Robe, Spellbook, Scholar's Pack;5 | None |


Original Gunslinger package C: leather armor, pistol, 20 bullets, dagger, Explorer's Pack, 0 GP. This is an intentional setting grant above ordinary retail budgets. The starting firearm has resale value zero until the first level is gained; subsequent resale follows GM policy. Firearm Training does not bypass Loading. Powder Drill permits repeated Loading shots per Action, still requiring ammunition/free loading hand.

## Exact weapon and armor catalog

These data records are normative. Legacy implementation/automation flags were omitted. An absent optional property grants no such property. Values and property parameters define damage, range, hands, weight, cost, Guard, armor restrictions, don/doff time and mastery.

### item:club

```json
{
  "id": "club",
  "name": "Club",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "light"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 2,
  "costCp": 10,
  "stackable": false
}
```

### item:dagger

```json
{
  "id": "dagger",
  "name": "Dagger",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "light"
    },
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "nick",
  "weightLb": 1,
  "costCp": 200,
  "stackable": false
}
```

### item:greatclub

```json
{
  "id": "greatclub",
  "name": "Greatclub",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "push",
  "weightLb": 10,
  "costCp": 20,
  "stackable": false
}
```

### item:handaxe

```json
{
  "id": "handaxe",
  "name": "Handaxe",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "light"
    },
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 2,
  "costCp": 500,
  "stackable": false
}
```

### item:javelin

```json
{
  "id": "javelin",
  "name": "Javelin",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 30,
        "long": 120
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 30,
    "long": 120
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 2,
  "costCp": 50,
  "stackable": false
}
```

### item:light-hammer

```json
{
  "id": "light-hammer",
  "name": "Light Hammer",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "light"
    },
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "nick",
  "weightLb": 2,
  "costCp": 200,
  "stackable": false
}
```

### item:mace

```json
{
  "id": "mace",
  "name": "Mace",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "bludgeoning"
  },
  "properties": [],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "sap",
  "weightLb": 4,
  "costCp": 500,
  "stackable": false
}
```

### item:quarterstaff

```json
{
  "id": "quarterstaff",
  "name": "Quarterstaff",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 8
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 8
  },
  "mastery": "topple",
  "weightLb": 4,
  "costCp": 20,
  "stackable": false
}
```

### item:sickle

```json
{
  "id": "sickle",
  "name": "Sickle",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "light"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "nick",
  "weightLb": 2,
  "costCp": 100,
  "stackable": false
}
```

### item:spear

```json
{
  "id": "spear",
  "name": "Spear",
  "kind": "weapon",
  "category": "simple",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    },
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 8
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 8
  },
  "mastery": "sap",
  "weightLb": 3,
  "costCp": 100,
  "stackable": false
}
```

### item:dart

```json
{
  "id": "dart",
  "name": "Dart",
  "kind": "weapon",
  "category": "simple",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 0.25,
  "costCp": 5,
  "stackable": false
}
```

### item:light-crossbow

```json
{
  "id": "light-crossbow",
  "name": "Light Crossbow",
  "kind": "weapon",
  "category": "simple",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 80,
        "long": 320
      },
      "ammunitionType": "bolt"
    },
    {
      "id": "loading"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 80,
    "long": 320
  },
  "ammunitionType": "bolt",
  "loading": true,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 5,
  "costCp": 2500,
  "stackable": false
}
```

### item:shortbow

```json
{
  "id": "shortbow",
  "name": "Shortbow",
  "kind": "weapon",
  "category": "simple",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 80,
        "long": 320
      },
      "ammunitionType": "arrow"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 80,
    "long": 320
  },
  "ammunitionType": "arrow",
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 2,
  "costCp": 2500,
  "stackable": false
}
```

### item:sling

```json
{
  "id": "sling",
  "name": "Sling",
  "kind": "weapon",
  "category": "simple",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 30,
        "long": 120
      },
      "ammunitionType": "bullet"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 30,
    "long": 120
  },
  "ammunitionType": "bullet",
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": null,
  "costCp": 10,
  "stackable": false
}
```

### item:battleaxe

```json
{
  "id": "battleaxe",
  "name": "Battleaxe",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 10
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 10
  },
  "mastery": "topple",
  "weightLb": 4,
  "costCp": 1000,
  "stackable": false
}
```

### item:flail

```json
{
  "id": "flail",
  "name": "Flail",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "bludgeoning"
  },
  "properties": [],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "sap",
  "weightLb": 2,
  "costCp": 1000,
  "stackable": false
}
```

### item:glaive

```json
{
  "id": "glaive",
  "name": "Glaive",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "reach",
      "additionalFeet": 5
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 10,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "graze",
  "weightLb": 6,
  "costCp": 2000,
  "stackable": false
}
```

### item:greataxe

```json
{
  "id": "greataxe",
  "name": "Greataxe",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 12,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "cleave",
  "weightLb": 7,
  "costCp": 3000,
  "stackable": false
}
```

### item:greatsword

```json
{
  "id": "greatsword",
  "name": "Greatsword",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 2,
    "sides": 6,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "graze",
  "weightLb": 6,
  "costCp": 5000,
  "stackable": false
}
```

### item:halberd

```json
{
  "id": "halberd",
  "name": "Halberd",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "reach",
      "additionalFeet": 5
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 10,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "cleave",
  "weightLb": 6,
  "costCp": 2000,
  "stackable": false
}
```

### item:lance

```json
{
  "id": "lance",
  "name": "Lance",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "reach",
      "additionalFeet": 5
    },
    {
      "id": "two-handed",
      "exception": "unless-mounted"
    }
  ],
  "reachFeet": 10,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "topple",
  "weightLb": 6,
  "costCp": 1000,
  "stackable": false
}
```

### item:longsword

```json
{
  "id": "longsword",
  "name": "Longsword",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 10
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 10
  },
  "mastery": "sap",
  "weightLb": 3,
  "costCp": 1500,
  "stackable": false
}
```

### item:maul

```json
{
  "id": "maul",
  "name": "Maul",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 2,
    "sides": 6,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "topple",
  "weightLb": 10,
  "costCp": 1000,
  "stackable": false
}
```

### item:morningstar

```json
{
  "id": "morningstar",
  "name": "Morningstar",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "sap",
  "weightLb": 4,
  "costCp": 1500,
  "stackable": false
}
```

### item:pike

```json
{
  "id": "pike",
  "name": "Pike",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "heavy"
    },
    {
      "id": "reach",
      "additionalFeet": 5
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": 10,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "push",
  "weightLb": 18,
  "costCp": 500,
  "stackable": false
}
```

### item:rapier

```json
{
  "id": "rapier",
  "name": "Rapier",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "finesse"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 2,
  "costCp": 2500,
  "stackable": false
}
```

### item:scimitar

```json
{
  "id": "scimitar",
  "name": "Scimitar",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "light"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "nick",
  "weightLb": 3,
  "costCp": 2500,
  "stackable": false
}
```

### item:shortsword

```json
{
  "id": "shortsword",
  "name": "Shortsword",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "light"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 2,
  "costCp": 1000,
  "stackable": false
}
```

### item:trident

```json
{
  "id": "trident",
  "name": "Trident",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "thrown",
      "rangeFeet": {
        "normal": 20,
        "long": 60
      }
    },
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 10
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": {
    "normal": 20,
    "long": 60
  },
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 10
  },
  "mastery": "topple",
  "weightLb": 4,
  "costCp": 500,
  "stackable": false
}
```

### item:warhammer

```json
{
  "id": "warhammer",
  "name": "Warhammer",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "bludgeoning"
  },
  "properties": [
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 10
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 10
  },
  "mastery": "push",
  "weightLb": 5,
  "costCp": 1500,
  "stackable": false
}
```

### item:war-pick

```json
{
  "id": "war-pick",
  "name": "War Pick",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "versatile",
      "damage": {
        "count": 1,
        "sides": 10
      }
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": {
    "count": 1,
    "sides": 10
  },
  "mastery": "sap",
  "weightLb": 2,
  "costCp": 500,
  "stackable": false
}
```

### item:whip

```json
{
  "id": "whip",
  "name": "Whip",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 4,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "reach",
      "additionalFeet": 5
    }
  ],
  "reachFeet": 10,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 3,
  "costCp": 200,
  "stackable": false
}
```

### item:blowgun

```json
{
  "id": "blowgun",
  "name": "Blowgun",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "fixed": 1,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 25,
        "long": 100
      },
      "ammunitionType": "needle"
    },
    {
      "id": "loading"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 25,
    "long": 100
  },
  "ammunitionType": "needle",
  "loading": true,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 1,
  "costCp": 1000,
  "stackable": false
}
```

### item:hand-crossbow

```json
{
  "id": "hand-crossbow",
  "name": "Hand Crossbow",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 30,
        "long": 120
      },
      "ammunitionType": "bolt"
    },
    {
      "id": "light"
    },
    {
      "id": "loading"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 30,
    "long": 120
  },
  "ammunitionType": "bolt",
  "loading": true,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 3,
  "costCp": 7500,
  "stackable": false
}
```

### item:heavy-crossbow

```json
{
  "id": "heavy-crossbow",
  "name": "Heavy Crossbow",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 100,
        "long": 400
      },
      "ammunitionType": "bolt"
    },
    {
      "id": "heavy"
    },
    {
      "id": "loading"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 100,
    "long": 400
  },
  "ammunitionType": "bolt",
  "loading": true,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "push",
  "weightLb": 18,
  "costCp": 5000,
  "stackable": false
}
```

### item:longbow

```json
{
  "id": "longbow",
  "name": "Longbow",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 8,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 150,
        "long": 600
      },
      "ammunitionType": "arrow"
    },
    {
      "id": "heavy"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 150,
    "long": 600
  },
  "ammunitionType": "arrow",
  "loading": false,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 2,
  "costCp": 5000,
  "stackable": false
}
```

### item:musket

```json
{
  "id": "musket",
  "name": "Musket",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 12,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 40,
        "long": 120
      },
      "ammunitionType": "bullet"
    },
    {
      "id": "loading"
    },
    {
      "id": "two-handed"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 40,
    "long": 120
  },
  "ammunitionType": "bullet",
  "loading": true,
  "hands": 2,
  "versatileDamage": null,
  "mastery": "slow",
  "weightLb": 10,
  "costCp": 50000,
  "stackable": false
}
```

### item:pistol

```json
{
  "id": "pistol",
  "name": "Pistol",
  "kind": "weapon",
  "category": "martial",
  "type": "ranged",
  "damage": {
    "count": 1,
    "sides": 10,
    "type": "piercing"
  },
  "properties": [
    {
      "id": "ammunition",
      "rangeFeet": {
        "normal": 30,
        "long": 90
      },
      "ammunitionType": "bullet"
    },
    {
      "id": "loading"
    }
  ],
  "reachFeet": null,
  "rangeFeet": {
    "normal": 30,
    "long": 90
  },
  "ammunitionType": "bullet",
  "loading": true,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "vex",
  "weightLb": 3,
  "costCp": 25000,
  "stackable": false
}
```

### item:cutlass

```json
{
  "id": "cutlass",
  "name": "Cutlass",
  "kind": "weapon",
  "category": "martial",
  "type": "melee",
  "damage": {
    "count": 1,
    "sides": 6,
    "type": "slashing"
  },
  "properties": [
    {
      "id": "finesse"
    },
    {
      "id": "light"
    }
  ],
  "reachFeet": 5,
  "rangeFeet": null,
  "ammunitionType": null,
  "loading": false,
  "hands": 1,
  "versatileDamage": null,
  "mastery": "nick",
  "weightLb": 3,
  "costCp": 2500,
  "stackable": false
}
```

### item:padded-armor

```json
{
  "id": "padded-armor",
  "name": "Padded Armor",
  "kind": "armor",
  "category": "light",
  "base": 11,
  "agility": true,
  "agilityCap": null,
  "mightRequirement": null,
  "stealthDisadvantage": true,
  "weightLb": 8,
  "costCp": 500,
  "don": {
    "unit": "minute",
    "amount": 1
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "light",
  "stackable": false
}
```

### item:leather-armor

```json
{
  "id": "leather-armor",
  "name": "Leather Armor",
  "kind": "armor",
  "category": "light",
  "base": 11,
  "agility": true,
  "agilityCap": null,
  "mightRequirement": null,
  "stealthDisadvantage": false,
  "weightLb": 10,
  "costCp": 1000,
  "don": {
    "unit": "minute",
    "amount": 1
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "light",
  "stackable": false
}
```

### item:studded-leather-armor

```json
{
  "id": "studded-leather-armor",
  "name": "Studded Leather Armor",
  "kind": "armor",
  "category": "light",
  "base": 12,
  "agility": true,
  "agilityCap": null,
  "mightRequirement": null,
  "stealthDisadvantage": false,
  "weightLb": 13,
  "costCp": 4500,
  "don": {
    "unit": "minute",
    "amount": 1
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "light",
  "stackable": false
}
```

### item:hide-armor

```json
{
  "id": "hide-armor",
  "name": "Hide Armor",
  "kind": "armor",
  "category": "medium",
  "base": 12,
  "agility": true,
  "agilityCap": 2,
  "mightRequirement": null,
  "stealthDisadvantage": false,
  "weightLb": 12,
  "costCp": 1000,
  "don": {
    "unit": "minute",
    "amount": 5
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "medium",
  "stackable": false
}
```

### item:chain-shirt

```json
{
  "id": "chain-shirt",
  "name": "Chain Shirt",
  "kind": "armor",
  "category": "medium",
  "base": 13,
  "agility": true,
  "agilityCap": 2,
  "mightRequirement": null,
  "stealthDisadvantage": false,
  "weightLb": 20,
  "costCp": 5000,
  "don": {
    "unit": "minute",
    "amount": 5
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "medium",
  "stackable": false
}
```

### item:scale-mail

```json
{
  "id": "scale-mail",
  "name": "Scale Mail",
  "kind": "armor",
  "category": "medium",
  "base": 14,
  "agility": true,
  "agilityCap": 2,
  "mightRequirement": null,
  "stealthDisadvantage": true,
  "weightLb": 45,
  "costCp": 5000,
  "don": {
    "unit": "minute",
    "amount": 5
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "medium",
  "stackable": false
}
```

### item:breastplate

```json
{
  "id": "breastplate",
  "name": "Breastplate",
  "kind": "armor",
  "category": "medium",
  "base": 14,
  "agility": true,
  "agilityCap": 2,
  "mightRequirement": null,
  "stealthDisadvantage": false,
  "weightLb": 20,
  "costCp": 40000,
  "don": {
    "unit": "minute",
    "amount": 5
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "medium",
  "stackable": false
}
```

### item:half-plate-armor

```json
{
  "id": "half-plate-armor",
  "name": "Half Plate Armor",
  "kind": "armor",
  "category": "medium",
  "base": 15,
  "agility": true,
  "agilityCap": 2,
  "mightRequirement": null,
  "stealthDisadvantage": true,
  "weightLb": 40,
  "costCp": 75000,
  "don": {
    "unit": "minute",
    "amount": 5
  },
  "doff": {
    "unit": "minute",
    "amount": 1
  },
  "trainingCategory": "medium",
  "stackable": false
}
```

### item:ring-mail

```json
{
  "id": "ring-mail",
  "name": "Ring Mail",
  "kind": "armor",
  "category": "heavy",
  "base": 14,
  "agility": false,
  "agilityCap": null,
  "mightRequirement": null,
  "stealthDisadvantage": true,
  "weightLb": 40,
  "costCp": 3000,
  "don": {
    "unit": "minute",
    "amount": 10
  },
  "doff": {
    "unit": "minute",
    "amount": 5
  },
  "trainingCategory": "heavy",
  "stackable": false
}
```

### item:chain-mail

```json
{
  "id": "chain-mail",
  "name": "Chain Mail",
  "kind": "armor",
  "category": "heavy",
  "base": 16,
  "agility": false,
  "agilityCap": null,
  "mightRequirement": 13,
  "stealthDisadvantage": true,
  "weightLb": 55,
  "costCp": 7500,
  "don": {
    "unit": "minute",
    "amount": 10
  },
  "doff": {
    "unit": "minute",
    "amount": 5
  },
  "trainingCategory": "heavy",
  "stackable": false
}
```

### item:splint-armor

```json
{
  "id": "splint-armor",
  "name": "Splint Armor",
  "kind": "armor",
  "category": "heavy",
  "base": 17,
  "agility": false,
  "agilityCap": null,
  "mightRequirement": 15,
  "stealthDisadvantage": true,
  "weightLb": 60,
  "costCp": 20000,
  "don": {
    "unit": "minute",
    "amount": 10
  },
  "doff": {
    "unit": "minute",
    "amount": 5
  },
  "trainingCategory": "heavy",
  "stackable": false
}
```

### item:plate-armor

```json
{
  "id": "plate-armor",
  "name": "Plate Armor",
  "kind": "armor",
  "category": "heavy",
  "base": 18,
  "agility": false,
  "agilityCap": null,
  "mightRequirement": 15,
  "stealthDisadvantage": true,
  "weightLb": 65,
  "costCp": 150000,
  "don": {
    "unit": "minute",
    "amount": 10
  },
  "doff": {
    "unit": "minute",
    "amount": 5
  },
  "trainingCategory": "heavy",
  "stackable": false
}
```

### item:shield

```json
{
  "id": "shield",
  "name": "Shield",
  "kind": "shield",
  "guardBonus": 2,
  "trainingCategory": "shield",
  "hands": 1,
  "weightLb": 6,
  "costCp": 1000,
  "don": {
    "unit": "utilize-action",
    "amount": 1
  },
  "doff": {
    "unit": "utilize-action",
    "amount": 1
  },
  "stackable": false
}
```


## Weapon properties and mastery

Ammunition: spend one compatible round per attack; a one-handed weapon needs a free loading hand. Loading: at most one shot from that weapon per Action, Bonus Action or Reaction regardless of Extra Attack. Finesse: select Might or Agility for both attack/damage. Light: after attacking with a Light weapon in the Attack Action, one Bonus Action attack with a different Light weapon, omitting a positive damage attribute unless a feature allows it. Nick moves that extra attack into the Attack Action, still once per turn. Thrown uses the melee weapon attribute and removes/repositions its instance. Versatile uses alternate dice with two hands. Heavy imposes disadvantage if Might is below 13 for melee or Agility below 13 for ranged. Reach adds five feet to attack/opportunity reach. Two-Handed requires two hands to attack, not merely carry.

Mastery requires Training and a selected eligible weapon type. Cleave: once per turn after a melee hit, one attack against a different creature within five feet of the original and within reach, omitting a positive damage modifier. Graze: miss deals attribute-modifier damage, minimum zero, without riders. Nick as above. Push: hit moves a Large-or-smaller target ten feet away. Sap: hit imposes disadvantage on its next attack before your next turn starts. Slow: hit reduces Speed ten feet until your next turn starts, not repeatedly from the same effect. Topple: hit forces Resolve save DC 8+TB+attack attribute modifier or Prone. Vex: hit grants advantage on your next attack against that target before your next turn ends. Only the listed mastery applies unless an ability replaces it.

## Other gear and referenced tables

The complete SRD adventuring-gear, tool-price/weight and pack-content tables on printed pages 93–100 are incorporated as exact normative definitions. Phase 2 must vendor them once under item:<kebab-name> IDs; this is not permission to accept arbitrary player-defined statistics. Mandatory items used by this design:

| Item | Price / weight | Mechanics |
| --- | --- | --- |
| Healer's kit | 5 GP / 3 lb | Ten charges; Action, one charge stabilizes a living creature at 0 Health within five feet without a check |
| Healing potion | 50 GP / 0.5 lb | Bonus Action to drink/administer to adjacent willing or incapacitated creature, heals 2d4+2 |
| Rope, 50 feet | 1 GP / 5 lb | Ordinary gear |
| Arrows, 20 | 1 GP / 1 lb | Arrow ammunition |
| Bolts, 20 | 1 GP / 1.5 lb | Bolt ammunition |
| Bullets, 10 | 3 GP / 2 lb | Firearm ammunition |
| Thieves' tools | 25 GP / 1 lb | Not consumed by checks |
| Herbalism kit | 5 GP / 3 lb | Not consumed by checks |
| Navigator's tools | 25 GP / 2 lb | Not consumed by checks |
| Carpenter's tools | 8 GP / 6 lb | Not consumed by checks |
| Mason's tools | 10 GP / 8 lb | Not consumed by checks |
| Smith's tools | 20 GP / 8 lb | Not consumed by checks |
| Tinker's tools | 50 GP / 10 lb | Not consumed by checks |
| Poisoner's kit | 50 GP / 2 lb | Cunning Strike prerequisite; no implied poison consumables |
| Calligrapher's supplies | 10 GP / 5 lb | Technical ID calligrapher-tools |
| Spellbook | 50 GP / 3 lb | Folio container |
| Component pouch | 25 GP / 2 lb | Unpriced nonconsumed materials only |
| Crystal arcane focus | 10 GP / 1 lb | Tidecaller/Shipwright focus |
| Wooden druidic focus | 5 GP / 1 lb | Navigator focus |
| Holy symbol | 5 GP / 1 lb | Doctor/Warden focus |

Healer-kit charges never refill on rest; acquire more through purchase/award. Magic items require GM award and an exact SRD reference/profile. Ordinary attunement limit is three, except explicit feature overrides such as Reef Knife's four. Attune/unattune one item during a Short Rest, enforcing item prerequisites.

## Inventory operations

An instance stores instanceId, definitionId, quantity, chargesCurrent, customName, notes and attuned. Loadout stores armor, mainHand, offHand and grip. Own all equipped instances; one armor and two hands maximum. Untrained items may be held/worn with training.md penalties. Split/merge only identical stackable, nonequipped instances with matching charge state. Selling/deleting equipped gear atomically unequips it or rejects pending explicit choice; never leave dangling references. Applying a preset validates every instance and hand conflict before one write. A sold/missing item makes preset application fail completely.

Reject negative/fractional quantities, overspending, absent ammunition/charges, forged stats and duplicate instance IDs. Unequipping never deletes. Non-purchase inventory awards require GM permission unless granted by creation/feature rules. Drawing/stowing one weapon may accompany each attack in the Attack Action; ordinary object interaction once per turn, extra interactions require Utilize. Shield don/doff uses Utilize; light armor don/doff one minute, medium don five/doff one, heavy don ten/doff five. Combat adapters enforce these costs; outside combat record time. Carrying capacity is 15×Might lb, push/drag/lift 30×Might; no variant encumbrance. Undefined custom gear is narrative only and cannot supply attack/armor/focus permissions.
