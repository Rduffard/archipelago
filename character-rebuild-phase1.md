# SANGUINE ARCHIPELAGO

# CHARACTER SYSTEM REBUILD — PHASE 1

## Complete Game Design, Rules Specification, Ability Catalog & Replacement Architecture

# PRIMARY OBJECTIVE

Prepare Sanguine Archipelago for a complete, controlled rebuild of its character system.

**Preserve the existing website's visual identity, styling, layouts, navigation, authentication, worldbuilding, and unrelated functionality.**

The current character system has undergone multiple incomplete and conflicting implementation sessions. Rather than continuing to extend it, establish one complete, authoritative, implementation-ready specification before building the replacement.

**THIS IS PHASE 1: DESIGN AND ARCHITECTURE.**

Do not implement the replacement character engine yet.

Do not delete the existing character system.

Do not redesign the website.

Do not stop after an inventory, audit, or list of missing features.

The deliverable is a complete game-design specification containing:

- 8 fully defined Callings
- 32 fully defined Paths, exactly 4 per Calling
- Complete Calling and Path progression through level 20
- Every Calling and Path ability, with executable mechanical specifications
- Attributes, Training, Expertise, skills, and saving throws
- Origins, backgrounds, feats, and character customization
- Equipment, inventory, weapons, armor, and loadouts
- Spellcasting, spell lists, preparation, and progression
- Resources, rests, limited-use abilities, and recovery
- Action economy and future combat integration requirements
- Complete frontend character creation, advancement, and character-sheet requirements
- Backend-authoritative character data and persistence architecture
- A safe migration plan preserving the existing website

The objective is to eliminate ambiguity before implementation begins.

---

# 1. REPOSITORY ACCESS AND PRESERVATION

Actual frontend repository:

`C:\Users\Romain\projects\Crossworld Creative\archipelago`

Actual backend repository:

`C:\Users\Romain\projects\Crossworld Creative\crossworld_backend`

Before beginning:

1. Verify both directories exist and are accessible.
2. Confirm their Git roots.
3. Inspect Git status and all uncommitted changes.
4. Verify read/write access.
5. Inspect the current character implementation.
6. Inspect current frontend presentation components and styling.
7. Inspect existing game-design documentation and rule registries.
8. Identify unrelated systems that must remain untouched.
9. Document a recovery strategy for the existing implementation.

Do not work exclusively in temporary workspace copies.

Do not discard, reset, overwrite, or delete existing work.

Do not commit, push, deploy, or modify MongoDB without explicit authorization.

## Preserve

- Website visual identity
- Typography, colors, and styling
- Layouts and navigation
- Authentication and accounts
- Lore and worldbuilding
- Nations, regions, and cultures
- Maps
- Campaign/session functionality
- Reputation systems
- Existing assets and artwork
- Reusable character creator presentation components
- Reusable character sheet presentation components
- Unrelated applications and infrastructure

The character mechanics will be rebuilt in later phases. The website itself should remain intact.

---

# 2. AUTHORITATIVE MECHANICAL FOUNDATION

Use **2024 D&D 5E** as the primary mechanical reference.

Use **SRD 5.2.1** for openly licensed mechanics.

Reference:

https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf

For subclass concepts outside SRD 5.2.1, draw inspiration from broad playstyles and design original Sanguine Archipelago features rather than reproducing non-SRD protected expression.

Preserve the Archipelago's original setting, terminology, technology, magic, cultures, factions, and intended custom mechanics.

## Terminology

| D&D 5E       | Sanguine Archipelago |
| ------------ | -------------------- |
| Class        | Calling              |
| Subclass     | Path                 |
| Proficiency  | Training             |
| Strength     | Might                |
| Dexterity    | Agility              |
| Constitution | Resolve              |
| Intelligence | Wit                  |
| Wisdom       | Instinct             |
| Charisma     | Spirit               |

These mappings are authoritative.

## Core rules

- Maximum character level: 20
- Eight Callings
- Four Paths per Calling
- Thirty-two Paths total
- Path selection at level 3
- Complete level 1–20 Calling progression
- Complete level 1–20 Path integration
- Unified Calling and Path progression
- 2024 5E-inspired action economy
- Backend-authoritative mechanical calculations

Paths are subclasses, not independent classes.

---

# 3. THE EIGHT CALLINGS

Use the established mappings:

| Calling    | 2024 D&D foundation |
| ---------- | ------------------- |
| Corsair    | Rogue               |
| Gunslinger | Fighter             |
| Navigator  | Ranger              |
| Tidecaller | Sorcerer            |
| Warden     | Paladin             |
| Reaver     | Barbarian           |
| Doctor     | Cleric              |
| Shipwright | Wizard              |

Do not change these mappings without explicit approval.

For each Calling, define:

- Gameplay identity and role
- Primary attributes
- Starting Health
- Hit Dice
- Saving throw Training
- Skill Training and selections
- Weapon Training
- Armor Training
- Tool Training
- Starting equipment
- Core abilities
- Resources
- Spellcasting, where applicable
- Feat and Attribute Improvement progression
- Four compatible Paths
- Complete level 1–20 progression
- Capstone abilities

Produce a complete level-by-level Calling progression table.

---

# 4. ORIGIN, CALLING, AND PATH MUST REMAIN DISTINCT

A character's birthplace must not determine their Calling or Path.

## Origin

Represents geographic and cultural background.

Origins may provide appropriate narrative and mechanical benefits.

## Calling

Represents the character's primary class, profession, or discipline.

Any character may select any Calling regardless of origin, subject only to approved universal character-creation rules.

## Path

Represents a specialization within the Calling.

Paths must not be tied exclusively to nationalities, ethnicities, geographic origins, or specific factions.

A Path may have historical associations with a nation or culture, but those associations must not restrict eligibility.

## Mandatory Path renames

| Previous           | Canonical     |
| ------------------ | ------------- |
| Yuma Deadeye       | Deadeye       |
| Yuma Field Surgeon | Field Surgeon |
| Klechi Breakwater  | Breakwater    |

Preserve the established mechanical identities of these Paths wherever practical.

Review all existing and new Path names for geographic or faction-specific restrictions.

Prefer specialization-based names.

Ensure all four Paths of a Calling are available to characters of any origin.

---

# 5. COMPLETE 32-PATH DESIGN

**Exactly four Paths must belong to each Calling.**

The existing roster provides twelve starting designs:

| Calling    | Existing Paths                          |
| ---------- | --------------------------------------- |
| Corsair    | Reef Knife                              |
| Gunslinger | Deadeye                                 |
| Navigator  | Gray Net, Storm Broker                  |
| Tidecaller | Omen Diver                              |
| Warden     | Leviathan Anchor                        |
| Reaver     | Bloodwake                               |
| Doctor     | Sanctuary Hand, Field Surgeon           |
| Shipwright | Powder Saint, Drydock Ghost, Breakwater |

These are starting identities, not evidence that the existing mechanics are complete.

## Design the missing twenty Paths

**You are explicitly authorized and required to design the missing 20 Paths.**

Do not leave undefined slots.

Use the four 2024 5E subclasses associated with each mapped class as inspiration for four distinct playstyles.

Preserve established Archipelago identities wherever practical.

Design original mechanics for non-SRD subclass concepts.

Use Archipelago lore, technology, magic, cultures, and history to create distinct thematic identities.

Do not simply rename non-SRD subclass descriptions.

## Every Path must define

1. Canonical name and stable ID
2. Parent Calling
3. 5E subclass inspiration
4. Lore and thematic identity
5. Gameplay role
6. Primary mechanical focus
7. Feature unlock levels
8. Complete feature and ability definitions
9. Passive effects
10. Active abilities
11. Resource costs
12. Usage limits
13. Recharge conditions
14. Prerequisites
15. Required player choices
16. Feature upgrades and replacements
17. Parent Calling interactions
18. Training interactions
19. Equipment interactions
20. Spellcasting interactions
21. Complete progression through level 20
22. Balance assumptions

All four Paths within a Calling must offer meaningfully distinct gameplay.

Do not create placeholder Paths or mechanically identical Paths with different names.

The first edition should be coherent and playable. Balance can be refined through playtesting.

---

# 6. COMPLETE LEVEL 1–20 PROGRESSION

Define the complete level progression for all eight Callings and all 32 Paths.

For every level, specify:

- Calling features
- Path features
- Automatic grants
- Required selections
- Attribute Improvements
- Feats
- Training progression
- Expertise
- Spellcasting progression
- Resource capacity changes
- Resource recovery improvements
- Feature upgrades
- Feature replacements
- Passive abilities
- Active abilities
- Limited-use abilities
- Capstone features

Path selection occurs at level 3.

Subsequent Path feature levels must follow the appropriate 2024 5E parent class progression.

Do not assume every Calling has identical subclass feature levels.

Every Path inherits its parent Calling's complete progression.

Produce level-by-level progression matrices with stable feature and ability IDs.

---

# 7. MANDATORY — COMPLETE ABILITY SYSTEM

**Abilities are a primary component of the character system, not an optional extension.**

Every Calling and Path must have its entire ability progression specified through level 20.

Do not confuse an ability name, description, or registry entry with a complete mechanical definition.

## 7.1 Complete ability definitions

For every Calling and Path ability, define:

- Unique canonical ability ID
- Ability name
- Parent Calling or Path
- Level unlocked
- Ability category
- Complete mechanical description
- Activation requirements
- Action economy
- Targeting
- Range
- Duration
- Resource cost
- Maximum uses
- Recharge conditions
- Saving throws
- Attack rolls
- Difficulty classes
- Damage calculations
- Healing calculations
- Scaling at higher levels
- Prerequisites
- Required player selections
- Equipment interactions
- Spellcasting interactions
- Conditions and status effects
- Persistent character-state effects
- Derived-stat effects
- GM-adjudicated effects

Every applicable property must be explicitly defined.

Do not substitute vague descriptions such as "improves accuracy" or "grants additional power" for actual mechanics.

Specify numerical bonuses, dice, formulas, durations, limits, and conditions where applicable.

## 7.2 Ability categories

The system must support:

### Passive abilities

Always-active features, resistances, bonuses, Training grants, and other automatic effects.

### Active abilities

Deliberately activated features such as special attacks, techniques, healing, and utility abilities.

### Limited-use abilities

Abilities with usage counters, charges, or other restrictions.

### Resource-consuming abilities

Abilities that expend spell slots, Calling resources, or other tracked resources.

### Reaction abilities

Abilities activated in response to specific events.

### Bonus-action abilities

Abilities using the 2024 5E bonus-action economy.

### Spellcasting abilities

Features that grant, modify, prepare, replace, or enhance spells.

### Conditional abilities

Features that activate when defined requirements are satisfied.

### Choice-based abilities

Features requiring selections of techniques, enhancements, resistances, spells, or other options.

### Upgrading abilities

Features that improve automatically or through additional player choices at higher levels.

## 7.3 Action economy

Use the 2024 5E action economy as the foundation.

For every applicable ability, define whether it uses:

- Action
- Bonus Action
- Reaction
- Free interaction, where applicable
- No action
- Rest-based activation
- Passive or automatic activation

Define interactions with movement, attacks, spellcasting, and other actions.

Full combat automation is not required for Phase 1.

However, ability definitions must be precise enough to support future battle-map integration.

## 7.4 Ability progression

For all eight Callings and 32 Paths, define:

- Every ability unlocked through level 20
- Every ability improvement
- Every additional use or charge
- Every resource increase
- Every required choice
- Every feature replacement
- Every prerequisite
- Every capstone

A Path inherits all applicable Calling abilities and adds its own abilities at the appropriate levels.

Do not create separate Path leveling.

## 7.5 Ability resource management

For every limited-use ability, define:

- Maximum uses
- Starting uses
- Resource cost
- Resource recovery
- Short Rest recovery
- Long Rest recovery
- Level-dependent scaling
- Temporary resources
- Resource conversions
- Insufficient-resource behavior

Abilities sharing a resource pool must reference the same canonical resource.

## 7.6 Ability interactions

Define how abilities interact with:

- Attributes
- Training
- Expertise
- Equipment
- Weapons
- Armor
- Spells
- Conditions
- Movement
- Other Calling abilities
- Path abilities
- Resource pools
- Rests
- Derived statistics

Identify mutually exclusive effects, stacking rules, and prerequisites.

## 7.7 Character-sheet ability management

The future frontend must allow players to:

- View all unlocked abilities
- Read complete ability descriptions
- See activation requirements
- See action type
- View targeting, range, and duration
- View available uses
- Track resource costs
- Spend resources
- Recover resources
- View upgrades
- Make required selections
- View prerequisites
- View attack and saving throw modifiers
- View damage and healing formulas
- Distinguish available and unavailable abilities

Any ability requiring persistent character-state changes must have a corresponding backend operation.

Players must not need to edit database records manually to use abilities.

## 7.8 Ability validation and testing

Define tests for:

- Correct unlock levels
- Correct Calling ownership
- Correct Path ownership
- Correct automatic grants
- Correct required selections
- Correct resource costs
- Correct recharge behavior
- Correct scaling
- Correct derived-stat effects
- Correct persistence
- Invalid ability activation
- Insufficient resources
- Invalid selections
- Unauthorized operations
- Incorrect Calling/Path combinations

Every Calling and Path must have ability coverage through level 20.

## 7.9 Mandatory ability documentation

Create:

`docs/character-system/abilities.md`

This must be a complete, implementation-ready catalog of all Calling and Path abilities.

Cross-reference every ability from the Calling and Path progression documents using stable IDs.

**Do not mark Phase 1 complete until the complete ability catalog is defined.**

---

# 8. CHARACTER CREATION RULES

Define the complete character creation sequence:

1. Character identity
2. Origin
3. Background
4. Calling
5. Attribute assignment
6. Training and skills
7. Feats and required selections
8. Starting equipment
9. Spells, where applicable
10. Review and confirmation

Specify:

- Point buy
- Attribute score limits
- Attribute modifiers
- Origin/background grants
- Training selections
- Expertise
- Saving throws
- Languages
- Feats
- Starting Health
- Hit Dice
- Guard
- Initiative
- Movement
- Starting equipment
- Derived statistics

Define all prerequisites, limits, and validation rules.

---

# 9. TRAINING AND DERIVED STATISTICS

Define:

- Might
- Agility
- Wit
- Spirit
- Resolve
- Instinct
- Attribute modifiers
- Training bonus
- Skill Training
- Saving throw Training
- Weapon Training
- Armor Training
- Tool Training
- Expertise
- Health
- Hit Dice
- Guard
- Initiative
- Movement
- Attack modifiers
- Damage modifiers
- Spell attack modifiers
- Spell save DCs
- Other derived statistics

Specify how derived statistics respond to attribute improvements, level increases, equipment changes, and feature grants.

The future backend must remain authoritative for mechanical calculations.

---

# 10. EQUIPMENT AND INVENTORY

Define:

- Starting equipment packages for all eight Callings
- Starting-gold alternatives
- Weapons
- Armor
- Shields
- Tools
- Ammunition
- Consumables
- Inventory quantities
- Equipping and unequipping
- Loadouts
- Weapon properties
- Weapon mastery
- Training requirements
- Equipment-derived Guard
- Attack and damage modifiers
- Equipment granted by abilities
- Equipment persistence

Specify valid and invalid equipment operations.

Define how equipment interacts with abilities, Training, and derived statistics.

---

# 11. SPELLCASTING

Define:

- Spell lists
- Spell eligibility
- Spell slots
- Spell preparation
- Spell learning
- Spell replacement
- Spellcasting attributes
- Spell attack modifiers
- Spell save DCs
- Spell components
- Concentration
- Ritual casting
- Class-specific spell mechanics
- Feature-granted spells
- Spell resource costs
- Spell recovery
- Spellcasting interactions with abilities

Define all required character-management operations.

Combat targeting and effect resolution may remain GM-adjudicated for the first playable edition.

---

# 12. RESOURCES AND RESTS

Define:

- Calling-specific resource pools
- Path-specific resources
- Ability usage counters
- Resource capacities
- Resource expenditures
- Resource recovery
- Short Rests
- Long Rests
- Temporary resources
- Resource conversions
- Resource maximum changes
- Recovery restrictions
- Level-dependent resource scaling

Ensure shared resources use consistent canonical definitions.

Define invalid resource operations and expected behavior.

---

# 13. ORIGINS, BACKGROUNDS, AND FEATS

Define:

- All established Archipelago origins
- Origin benefits
- Background selection
- Background benefits
- Origin feats
- General feats
- Epic Boons
- Feat prerequisites
- Feat subchoices
- Attribute Improvement
- Language selections
- Starting Training
- Character customization

Keep Origin, Background, Calling, and Path mechanically distinct.

No origin-based Calling or Path restrictions.

---

# 14. DESIGN THE REPLACEMENT ARCHITECTURE

Inspect the existing frontend and backend.

Design a replacement architecture with:

- One canonical rules registry
- Eight Calling definitions
- Thirty-two Path definitions
- One unified advancement engine
- One feature-grant engine
- One ability definition and operation system
- Character creation validation
- Derived-stat calculations
- Equipment operations
- Spellcasting operations
- Resource and rest operations
- Persistent character records
- Backend-authoritative validation
- Frontend creation flow
- Frontend advancement flow
- Frontend character sheet
- Frontend ability management
- Frontend equipment management

Avoid separate progression engines for individual Callings or Paths.

Prefer reusable, data-driven mechanics.

Specify stable IDs, data contracts, dependencies, and validation boundaries.

Do not implement the replacement during Phase 1.

---

# 15. PRESERVE THE EXISTING WEBSITE

Inspect the current React frontend.

Document reusable:

- Layouts
- Navigation
- Character creator styling
- Character sheet styling
- Shared UI components
- Typography
- Colors
- Responsive behavior
- Assets

The replacement system may require new React state management, forms, hooks, and API integration.

Preserve the existing visual design wherever practical.

A minimal test interface may be used during later implementation phases, but the final system must integrate with the existing website.

Do not redesign the website during Phase 1.

---

# 16. PERMANENT AUTHORITATIVE DOCUMENTATION

Create:

`docs/character-system/`

Required files:

- `README.md`
- `callings.md`
- `paths.md`
- `abilities.md`
- `creation.md`
- `origins-backgrounds.md`
- `training.md`
- `feats.md`
- `equipment.md`
- `spells.md`
- `resources.md`
- `architecture.md`
- `migration-plan.md`
- `acceptance-tests.md`

These documents must contain actual implementation-ready mechanics.

Do not produce empty headings, placeholders, or undefined Path slots.

Clearly distinguish:

- Established Archipelago lore
- Existing Path identities
- SRD-derived mechanics
- Newly designed mechanics
- Balance assumptions
- Future implementation requirements

These documents become the authoritative specification for the replacement character system.

---

# 17. DEFINE COMPLETE ACCEPTANCE TESTS

Prepare test requirements covering:

- All eight Callings
- All 32 Paths
- Exactly four Paths per Calling
- Origin-independent Calling and Path selection
- Correct Path ownership
- Level-three Path selection
- Level 1–20 advancement
- Calling and Path feature integration
- All abilities and upgrades
- Action economy metadata
- Resource expenditure and recovery
- Training and Expertise
- Equipment
- Feats
- Spellcasting
- Derived statistics
- Character creation
- Character persistence
- Frontend ability interactions
- Frontend equipment interactions
- Authorization
- Invalid operations
- Save/reload consistency

Tests must verify mechanical behavior, not merely the existence of definitions.

---

# 18. PHASE 1 COMPLETION CRITERIA

Phase 1 is complete only when:

- [ ] Both repositories have been inspected.
- [ ] Existing code and visual components are preserved.
- [ ] All eight Callings are fully specified.
- [ ] All 32 Paths are fully named and designed.
- [ ] Every Calling has exactly four Paths.
- [ ] All Paths are origin-independent.
- [ ] Geographic Path names have been corrected.
- [ ] All Calling progressions are specified through level 20.
- [ ] All Path progressions are specified through level 20.
- [ ] Every Calling and Path ability has a complete mechanical definition.
- [ ] Ability activation and action economy are defined.
- [ ] Ability costs, uses, recovery, and scaling are defined.
- [ ] Character-sheet ability management is specified.
- [ ] Character creation rules are complete.
- [ ] Training and derived statistics are complete.
- [ ] Equipment and inventory rules are complete.
- [ ] Spellcasting rules are complete.
- [ ] Resource and rest rules are complete.
- [ ] Origins, backgrounds, and feats are complete.
- [ ] Replacement architecture is documented.
- [ ] Safe migration plan is documented.
- [ ] Acceptance tests are defined.
- [ ] Existing character code remains untouched.
- [ ] Existing website styling remains intact.

Do not mark Phase 1 complete if any mandatory ability, Path, or Calling definition is missing.

---

# 19. REQUIRED FINAL REPORT

Provide:

1. Repository preservation status.
2. Complete eight-Calling roster.
3. Complete 32-Path roster.
4. The 20 newly designed Paths.
5. Existing Path renames.
6. 5E inspirations for all Paths.
7. Complete level 1–20 progression coverage.
8. Complete ability catalog status.
9. Action economy and resource specifications.
10. Training, equipment, spellcasting, feat, and origin specifications.
11. Replacement architecture.
12. Reusable frontend components.
13. Migration plan.
14. Documentation file locations.
15. Remaining design decisions or blockers.
16. Readiness for Phase 2.

Do not claim the character system itself is implemented or tabletop-ready.

---

# FINAL DIRECTIVE

**Preserve the website. Finalize the rules. Then rebuild the character system correctly.**

Use 2024 D&D 5E as the mechanical foundation.

Preserve Sanguine Archipelago's lore and terminology.

Define eight Callings and exactly 32 Paths.

Paths are subclasses of Callings, not independent progression systems.

Paths represent specializations, not geographic origins.

Design all 20 missing Paths using 5E-inspired playstyles and original Archipelago mechanics.

Define complete Calling and Path progression through level 20.

**Define every ability in full, including activation, action economy, resource costs, effects, scaling, and character-sheet interactions.**

Define Training, equipment, feats, spellcasting, resources, rests, and character creation.

Produce implementation-ready documentation and a safe replacement architecture.

Do not implement new character code during this phase.

Do not stop after an audit.

Do not leave undefined Paths, incomplete ability descriptions, or placeholder mechanics.

**The next phase must be able to build the complete character system directly from these documents without rediscovering or reinventing its requirements.**
