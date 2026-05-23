# State Management

Character creation state is local React state owned by the creator controller.

Current controller:

```text
src/pages/CharacterCreator/logic/controller/useCreatorController.js
```

## State Domains

The creator keeps separate state for:

- identity
- attributes
- details
- loadout
- specialties
- resources
- wounds
- progression

This separation matters. Progression changes should not require rewriting unrelated loadout or identity state.

## Progression State

Progression stores campaign-facing growth:

```js
{
  rank,
  corePoints,
  specialtyPicks,
  coreCheckInvestments,
  advancementPoints,
  specializationPath,
  unlockedNodes
}
```

## Specialty State

Saved Specialty state should remain small:

```js
{
  combat: [{ id: "brace", rank: 2 }]
}
```

Do not copy full registry definitions into character state. Registry definitions come from the system blueprint.

## Save Boundary

Rank and point changes should update local state only. Backend persistence should happen through explicit save actions, not per click.

## Render Guidance

Avoid passing whole state objects into deeply repeated components when only one primitive value is needed.

For Specialty rows:

- pass `rank`
- pass stable `skill`
- pass stable callbacks
- avoid passing the full `skills` object
