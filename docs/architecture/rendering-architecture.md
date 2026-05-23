# Rendering Architecture

Rendering architecture should protect the creator from data-rich systems becoming visually or computationally heavy.

## Training Page Pattern

The Training page contains many repeated controls. Repeated rows must remain cheap.

Specialty row requirements:

- memoized row component
- compact mounted content
- lazy tooltip body
- primitive rank props
- stable callbacks

## Tooltip Rendering

Tooltips can contain rich information, but they should not mount heavy trees for every row at rest.

`HoverInfo` supports lazy content through:

```jsx
<HoverInfo renderContent={() => <SpecialtyTooltip />} />
```

This delays tooltip tree construction until hover or focus.

## Avoid

- full rank trees inline on every Specialty row
- mapping long effect arrays in every render path
- passing entire character state to repeated rows
- rebuilding registry data inside each row
- broad state changes for targeted interactions

## Profiling

Temporary profiling flag:

```js
globalThis.__ARCHIPELAGO_PROFILE_SPECIALTIES__ = true
```

Use it to confirm only expected Specialty rows re-render on rank clicks.
