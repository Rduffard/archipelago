> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Training Page UX

The Training page is the player's main progression surface. It must clearly separate vertical growth from horizontal mastery.

## Page Structure

The page has two distinct sections:

1. Core Training
2. Specialty Training

Core Training is numerical and direct. Specialty Training is ranked, expressive, and technique-based.

## Core Training Presentation

Core Check rows should show:

- name
- linked Attributes
- numeric value
- investment controls
- formula or roll modifier in tooltip

This is the only Training section where Attribute formulas belong.

## Specialty Training Presentation

Specialty rows should show only:

- Specialty name
- compact related Core Checks
- one-line flavor summary
- current rank
- rank controls
- compact rank pips

Do not render the full rank tree inline.

## Rank Visualization

Specialty rank pips communicate mastery state:

- locked ranks are muted
- unlocked ranks are bright
- current rank is the strongest visual emphasis

This lets players understand progression quickly without reading every effect.

## Tooltip Philosophy

Tooltips are for contextual depth, not permanent page content.

Specialty tooltip content should include:

- description
- current rank
- unlocked effects
- next unlock
- next prerequisite
- related Core Checks

Tooltips should not show every future rank at once.

## Stacking Communication

Specialty effects stack. The tooltip should explicitly show unlocked effects as an accumulated list:

```text
Unlocked Effects Stack
[active] Set Stance
[active] Absorb Impact

Next Unlock
Hold the Line
```

This tells the player that old mastery remains active.

## Performance Guidance

The Training page can contain many Specialties. Avoid mounting large tooltip trees and long rank text for every row.

Preferred patterns:

- memoized Specialty rows
- primitive rank props instead of whole state objects
- lazy tooltip rendering
- compact inline rank markers
- derived row data memoized per row

Do not optimize by deleting information. Move detail to lower-cost disclosure patterns.
