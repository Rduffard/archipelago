# Specialty Registry

The Specialty registry is the canonical source for ranked mastery definitions.

Backend source:

```text
crossworld_backend/src/modules/archipelago/system/blueprints/skills.js
```

Frontend consumers receive it through the system blueprint as:

```js
blueprint.specialties
```

`expandedSkillList` currently exists as a compatibility alias, but new code should use `specialties`.

## Registry Goals

The registry must support:

- ranked progression
- prerequisite checks
- tooltip rendering
- related Core Check context
- future faction training
- future specialization trees
- future unlock chains

## Shape

```js
{
  id: "suppress",
  name: "Suppress",
  category: "combat",
  relatedChecks: ["precision", "tactics"],
  description: "...",
  maxRank: 4,
  ranks: [
    { rank: 1, title: "Pin the Lane", effect: "..." }
  ],
  prerequisites: {
    2: [{ coreCheck: "precision", min: 15 }]
  },
  tags: ["combat", "control", "ranged", "area-denial"],
  context: "..."
}
```

## Rules

- `relatedChecks` are contextual references, not formulas.
- `ranks` must be cumulative in play.
- `prerequisites` are keyed by rank being purchased.
- `tags` should support future integrations without requiring text parsing.
- `description` should be short enough for card display.
- `context` should explain when the Specialty matters.

## Frontend Resolution

Frontend helper:

```text
src/data/archipelagoSkills.js
```

Responsibilities:

- normalize saved Specialty ranks
- resolve catalog entries with character state
- format rank labels
- determine prerequisite status
- expose tooltip-ready display data

## Rendering Contract

Main Training page rows should not render full rank trees. They should render compact Specialty identity and rank state.

Detailed rank effects are lazy-rendered through tooltips to keep the page fast.

## Scaling Notes

The registry can support future systems by adding fields rather than changing the rank contract:

- `sourceFaction`
- `requiresSpecialty`
- `unlocksActions`
- `branch`
- `mutuallyExclusiveWith`
- `milestoneId`

Do not add these until a system actually consumes them.
