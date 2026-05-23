# Frontend Performance

Performance work should preserve the design. Do not delete progression data to make the page fast.

## Training Page Hotspots

Known expensive patterns:

- every Specialty row receiving the full `skills` object
- full rank progression text rendered inline
- tooltip trees mounted for every Specialty
- unstable callbacks forcing memoized rows to re-render
- prerequisite checks running for all rows without need

## Current Mitigations

- `SpecialtyRow` is memoized.
- Rows receive primitive `rank` values.
- Tooltip detail is lazy-rendered by `HoverInfo`.
- Full rank trees are not mounted inline.
- Rank update callbacks are stable.

## Profiling Flag

Enable in the browser console:

```js
globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__ = true
```

Expected behavior:

- clicking a Specialty rank should log the updated row prominently
- unrelated rows should not repeatedly render without a prop change
- handler timing should remain tiny

Disable:

```js
delete globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__
```
