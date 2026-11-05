> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# 2026-05-22 Training Page Overhaul

## Change

The old Skills page became Training, with separate Core Training and Specialty Training sections.

## Problem

The page implied trained skills were the main progression stats. It also displayed Specialty detail too densely after rank definitions expanded.

## Decision

Core Training displays numeric Core Check investment. Specialty Training displays compact mastery state with lazy tooltip detail.

## UX Rationale

The main page should be scannable:

- Core Checks: numbers and formulas.
- Specialties: rank, identity, related Core Checks, and current mastery.

Full Specialty rank trees should not render inline.

## Implications

Future detail views may show full mastery trees, but the primary Training page should remain fast and readable.
