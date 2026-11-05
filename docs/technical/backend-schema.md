> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Backend Schema

The backend stores character state and exposes the system blueprint.

## Core Files

```text
crossworld_backend/src/modules/archipelago/system/blueprints
crossworld_backend/src/modules/archipelago/characters/model.js
crossworld_backend/src/modules/archipelago/characters/validators.js
crossworld_backend/src/modules/archipelago/characters/controller.js
```

## Blueprint Responsibility

Blueprint files define canonical system data:

- Core Checks
- Specialties
- catalogs
- reputation tracks
- schema documentation
- sample characters

The frontend should consume this data rather than maintaining independent gameplay definitions.

## Character Responsibility

Character records should store character-specific state only.

For Specialties, save:

```js
{
  id: "brace",
  rank: 2
}
```

Do not save the full Specialty definition into the character. That belongs to the registry.

## Derived Checks

The backend recalculates Core Checks from:

- Attributes
- `progression.coreCheckInvestments`

This keeps saved values consistent with the progression model.
