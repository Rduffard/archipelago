# 2026-05-22 Specialty Refactor

## Change

The old "Trained Skills" layer was replaced with ranked Specialties. Core Checks became the primary rollable and investable stats.

## Problem

The previous model made Core Checks and Trained Skills look like competing primary stats. Players could invest only in skills, while Core Checks were the real resolution engine. This made progression confusing.

## Decision

Use a layered model:

- Attributes: raw potential
- Core Checks: primary rolls and vertical progression
- Specialties: ranked mastery techniques and horizontal progression

## Alternatives Considered

- Keep skills as numeric bonuses: rejected because it preserved redundancy.
- Hide Core Checks behind skills: rejected because it obscured the resolution engine.
- Merge everything into Attributes: rejected because it flattened tactical identity.

## Implications

Specialties must not display Attribute formulas. They may reference related Core Checks for context, prerequisites, and future synergy.
