> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Specialty Ranks

Specialty ranks are cumulative mastery levels.

## Rank Stack

Rank III includes:

- Rank I effect
- Rank II effect
- Rank III effect

Rank IV includes all prior effects.

## Rank Language

Each rank should have a title and an effect.

Example:

```text
I - Set Stance
II - Absorb Impact
III - Hold the Line
IV - Living Bulwark
```

Titles should be flavorful enough to communicate identity at a glance.

## Prerequisites

Prerequisites are keyed by the rank being purchased:

```js
prerequisites: {
  2: [{ coreCheck: "guard", min: 15 }],
  3: [{ coreCheck: "endurance", min: 16 }]
}
```

Prerequisites should reference Core Checks, other Specialties, faction standing, milestone rewards, or future specialization nodes. Attribute prerequisites should be rare and strongly justified.
