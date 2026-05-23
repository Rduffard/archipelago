# Combat Flow

Combat in Sanguine Archipelago is not a class rotation. It is a pressure exchange built from position, intent, consequence, and tactical identity.

## Core Loop

```mermaid
flowchart LR
  A["Declare intent"] --> B["Establish position and risk"]
  B --> C["Choose Core Check"]
  C --> D["Apply Specialty permissions if relevant"]
  D --> E["Resolve outcome"]
  E --> F["Update position, harm, resources, or clocks"]
```

## Resolution Order

1. Name what the character is trying to accomplish.
2. Identify what can go wrong.
3. Select the Core Check that broadly resolves the pressure.
4. Apply relevant Specialty permissions or mastery effects.
5. Resolve consequences.
6. Change the scene state.

## Examples

### Holding A Gangway

Situation: enemies rush a narrow plank during a storm.

- Core Check: `Guard`
- Specialty: `Brace`
- Possible effect: use Guard instead of Reflex against forced movement.

Brace does not replace the roll. It changes defensive permission and consequence handling.

### Controlling A Lane

Situation: a gunslinger covers a hatch while allies retreat.

- Core Check: `Precision` or `Tactics`
- Specialty: `Suppress`
- Possible effect: successful ranged attacks hinder enemy movement.

Suppression creates tactical space. It does not become a separate attack stat.

### Breaking Rhythm

Situation: a duelist baits a captain into overextending.

- Core Check: `Reflex`
- Specialty: `Feint`
- Possible effect: create a brief opening after a successful Reflex check.

Feint gives the player a recognizable fighting identity.

## Combat Design Principles

- Core Checks carry broad competence.
- Specialties create signature moments.
- Consequences should alter position, morale, tempo, resources, or access.
- Good combat outcomes should produce new decisions, not just damage totals.

## Future Hooks

Combat Specialty tags such as `control`, `dueling`, `protector`, and `boarding` should eventually support:

- enemy AI priorities
- specialization tree prerequisites
- faction training schools
- relic or weapon synergies
