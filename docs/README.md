# Sanguine Archipelago Documentation

**Current implemented rules:** [Training and attribute checks](training.md). Documents marked historical describe retired mechanics or future design, not active rules.

This directory is the source of truth for Sanguine Archipelago gameplay systems, app architecture, progression design, and UI rationale. Code should align to these documents over time; when a major system changes, update the relevant docs in the same change set.

## Directory Map

- `systems/`: mechanical rules and how the game works at the table.
- `architecture/`: how the application, registries, state, and rendering are structured.
- `gameplay/`: how play should feel moment to moment.
- `ui-ux/`: visual language, interaction principles, and information hierarchy.
- `lore/`: faction and worldbuilding notes that connect to mechanics.
- `progression/`: vertical and horizontal character growth models.
- `technical/`: engineering implementation guidance and performance notes.
- `diagrams/`: reusable Mermaid diagrams and flow references.
- `decisions/`: dated architectural and design decision records.

## Naming Convention

Use lowercase kebab-case filenames:

```text
systems/core-checks.md
architecture/specialty-registry.md
decisions/2026-05-22-specialty-definition-system.md
```

Decision docs should be dated `YYYY-MM-DD-topic.md` and should explain the problem, change, alternatives, and consequences.

## Documentation Standard

Each substantial doc should answer:

- What is the intended design?
- Why does it exist?
- What terminology is canonical?
- How does it behave in play or code?
- What examples clarify the system?
- What constraints should future contributors preserve?

Avoid placeholder TODO sections. If a system is not ready to define, omit the doc until there is useful canon to capture.

## Design Pillars

Sanguine Archipelago is built around:

- fiction-first resolution
- faction pressure and institutional access
- broad competency with narrow specialization
- consequence over binary pass/fail
- permissions over stat inflation
- ideology as a mechanical force
- culturally grounded terminology

When a rule can be expressed as a permission, tradeoff, obligation, clock, access right, or new fictional position, prefer that over a universal numeric bonus.

## Canonical Layer Language

Use these terms consistently:

- `Attributes`: raw identity and natural capability.
- `Core Checks`: broad rollable competencies and the primary investable numbers.
- `Specialties`: ranked mastery techniques layered onto Core Checks.
- `Reputation`: faction-facing consequence and access.
- `Training`: the UI and campaign concept for investing Core Points and Specialty ranks.

Avoid describing Specialties as skills, stat formulas, or Attribute-derived rolls.
