# Registry Patterns

Registries define reusable game canon. Character state references registries by id.

## Good Registry Data

Registry entries should be:

- stable
- id-addressable
- explicit
- structured for UI and rules
- free of display-only string parsing requirements

## Good Character Data

Character records should store:

- chosen ids
- ranks
- unlocked nodes
- spent points
- current resource state

They should not duplicate registry descriptions, rank effects, or prerequisite definitions.

## Why This Matters

Duplicating registry data into saves creates migration pain and inconsistent rules. Referencing registries by id lets future balance and wording changes apply cleanly.
