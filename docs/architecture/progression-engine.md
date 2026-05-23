# Progression Engine

The progression engine is the boundary between character identity, campaign rewards, and rule resolution. Its job is not to make every progression source look the same. Its job is to preserve the layered model clearly enough that UI, validation, saves, and future campaign systems can all agree on what changed.

## Layer Responsibilities

Progression has three primary layers:

- Attributes define raw potential and feed derived calculations.
- Core Checks define broad capability and are the primary rollable, investable stats.
- Specialties define ranked mastery packages that modify how Core Checks are used.

The engine should never collapse these layers into a single stat bag. That was the root confusion in the old model.

## Currency Model

Progression currencies should be explicit:

- Attribute allocation changes raw character profile.
- Core Points invest directly into Core Checks.
- Specialty Training or Specialty Picks acquire or rank Specialties.
- Campaign rewards can grant targeted unlocks, discounts, or prerequisite exceptions when a faction or milestone calls for it.

Separate currency names matter because they teach the player what kind of growth they are making.

## Core Check Investment

Core Check investment changes numeric competency. A Core Check entry should know:

- its id and display name
- its category
- its linked Attributes
- its current value
- its investment cost or delta
- any caps or campaign constraints

Linked Attributes belong here because Core Checks are the rollable layer.

## Specialty Progression

Specialty progression changes tactical expression. A Specialty entry should know:

- its id and registry definition
- current rank
- maximum rank
- trained or unlocked state
- prerequisites for the next rank
- active effects from all unlocked ranks

Specialty rank effects stack. Rank III includes Rank I, Rank II, and Rank III behavior unless a specific rule says otherwise.

## Validation Order

Validation should happen in the smallest useful scope:

1. Confirm the requested layer and currency.
2. Validate the changed item.
3. Validate prerequisites for the requested rank or investment.
4. Recalculate only derived summaries affected by that change.
5. Persist the character snapshot through the normal save pathway.

Global validation is reserved for import, migration, campaign respec, or final character submission flows.

## Future Extension Points

The engine should leave room for:

- faction-granted Specialties
- branching mastery paths
- archetype-specific prerequisites
- milestone rewards
- temporary scene training
- corruption or reputation-gated unlocks

These systems should add rules around the layered model, not bypass it.
