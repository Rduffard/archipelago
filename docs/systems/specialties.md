> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Specialties

Specialties are ranked mastery techniques layered on top of Core Checks.

They are not rollable stats. They are not Attribute formulas. They are not flat bonus buckets.

## Canonical Role

Specialties answer:

> How does this character uniquely express mastery?

A Specialty should create a memorable play pattern: holding a line, baiting a mistake, controlling a lane, reading a relic's mood, or making impossible repairs under pressure.

## Data Model

The Specialty registry uses this shape:

```js
{
  id: "brace",
  name: "Brace",
  category: "combat",
  relatedChecks: ["guard", "endurance"],
  description: "Plant your stance, absorb impact, and protect ground when the world tries to move you.",
  maxRank: 4,
  ranks: [
    {
      rank: 1,
      title: "Set Stance",
      effect: "You may use Guard instead of Reflex against forced movement."
    }
  ],
  prerequisites: {
    2: [{ coreCheck: "guard", min: 15 }]
  },
  tags: ["combat", "defense", "stability", "protector"],
  context: "Forced movement, knockback, collisions, shield walls, and protecting allies in tight quarters."
}
```

## Rank Effects Stack

Specialty ranks are cumulative.

If a character has `Brace III`, they have:

- Rank I effect
- Rank II effect
- Rank III effect

The UI should therefore communicate unlocked effects as a stack, not as mutually exclusive tiers.

## Good Rank Design

Good Specialty ranks grant:

- permission to use a Core Check differently
- a once-per-scene mastery moment
- new tactical leverage
- action economy relief
- protection from a specific class of consequence
- access to new fictional positioning

Weak Specialty ranks only grant:

- generic `+1`
- passive math with no identity
- a mandatory tax to stay competitive

## Specialty Design Test

Before adding a Specialty, answer:

1. Which Core Checks does it contextualize?
2. What situation makes it shine?
3. What can the character attempt because of it?
4. What consequence does it help manage without erasing?
5. What does Rank II or III change behaviorally?
6. Which faction, culture, profession, or doctrine might teach it?

If the answers are vague, the Specialty is probably not ready for the registry.

## Example: Brace

Brace modifies defensive expression without replacing Guard.

- `I - Set Stance`: use Guard instead of Reflex against forced movement.
- `II - Absorb Impact`: reduce collision damage after succeeding against impact.
- `III - Hold the Line`: automatically resist knockback once per scene after a successful Guard check.
- `IV - Living Bulwark`: adjacent allies gain a small Guard edge against the same force while you Brace.

The player still cares about Guard. Brace changes what Guard can mean.

## Related Core Checks

`relatedChecks` has three jobs:

- guide player understanding
- support prerequisite logic
- prepare future synergy systems

It is not a formula field.

## Current Registry

The current restored registry covers:

- Combat: `Board`, `Shoot`, `Cut`, `Brace`, `Feint`, `Suppress`
- Social: `Bargain`, `Command`, `Deceive`, `Read`, `Perform`, `Threaten`
- Exploration: `Navigate`, `Scout`, `Track`, `Endure`, `Climb`, `Dive`
- Utility: `Jury-Rig`, `Stabilize`, `Calibrate`
- Arcane: `Attune`, `Sift`

Core Check duplicates such as `Patch`, `Signal`, `Secure`, `Fabricate`, `Broker`, `Invoke`, `Ward`, `Bind`, and `Unravel` are not Specialties.

## Anti-Patterns

Avoid:

- naming a Specialty after a Core Check
- using Attribute pairs in Specialty UI
- making rank progression only larger numbers
- requiring a Specialty for basic competence
- designing a Specialty that has no fictional trigger
- letting a Specialty remove all risk from its scene type
