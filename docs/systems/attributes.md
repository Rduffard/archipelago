> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Attributes

Attributes describe raw identity and natural capability. They are the roots beneath Core Checks, not the main campaign progression track.

## Canonical Attributes

- `Might`: force, bodily power, impact, and physical insistence.
- `Agility`: quickness, coordination, fine motion, and mobile control.
- `Wit`: analysis, craft intelligence, pattern reading, and tactical thought.
- `Spirit`: presence, resonance, soul-force, ritual sensitivity, and social warmth.
- `Resolve`: endurance of will, discipline, pain tolerance, and refusal to break.
- `Instinct`: danger sense, intuition, animal timing, and trust in the unseen edge of perception.

## Design Role

Attributes answer:

> What kind of person is this character at the root?

They should influence many checks, but they should not be the main place a player expresses long-term tactical identity. That job belongs to Core Checks and Specialties.

## Attribute Pairing Principle

Most Core Checks are built from two Attributes because Archipelago actions are rarely one-dimensional.

Example:

- `Guard` uses `Agility + Resolve`: defense is movement plus refusal to yield.
- `Precision` uses `Agility + Wit`: exact action requires control and understanding.
- `Pressure` uses `Might + Resolve`: coercive force is presence plus commitment.
- `Omen` uses `Spirit + Instinct`: signs are read through resonance and gut recognition.

The pairing matrix is a design language, not a requirement that every pair become a visible stat.

## Advancement Guidance

Attribute advancement should be rarer and more identity-defining than Core Check training.

Good Attribute advancement moments:

- origin creation
- major campaign milestones
- transformative injuries or vows
- faction indoctrination with lasting personal cost
- relic exposure that changes who the character is

Avoid frequent Attribute bumps. They blur character identity and create runaway inflation.

## Implementation Guidance

Store Attributes as stable character state:

```js
{
  might: 2,
  agility: 1,
  wit: 3,
  spirit: 0,
  resolve: 2,
  instinct: 1
}
```

Core Checks derive from these values plus Core Check investment. Specialties must not derive directly from Attributes.
