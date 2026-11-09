# Character rebuild: authoritative Phase 1 design

Edition SA-CHAR-1, 2026-11-07 UTC. Design baseline for Phase 2; no replacement engine is implemented or claimed tabletop-ready. Only documentation is added. Existing code, styling and working-tree changes are preserved.

## Authority and provenance

character-rebuild-phase1.md is the scope authority. These fourteen documents define the replacement together. Explicit Phase 1 decisions/corrections override retained reference descriptions; those override old implementation/historical notes. Old automationStatus flags do not establish completeness.

Established setting: nations/cultures, Free Captains, Faith Orders, guilds, Sparkwrites, twelve specified Path identities. Twenty additional Path drafts were discovered in uncommitted newPaths.js: retained and completed here as original Archipelago designs, not needlessly invented again. Cultural associations describe history only. New backgrounds, feat options, completion rulings and neutral lineage baseline are Phase 1 rules designs, not established lore claims.

SRD-derived: eight parent progressions, eight licensed subclass foundations, equipment, feats and spells. Other Path mechanics are original; their four 2024 reference inspirations per parent identify broad playstyles, not protected feature conversions. No non-SRD subclass descriptions reproduced.

This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

Changes: terminology, custom origins/background budget, original Paths/feats, explicit persistence rules. Source https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf (printed page numbers).

## Documents

| File | Contract |
| --- | --- |
| [callings.md](callings.md) | 8 traits and 160 level rows |
| [paths.md](paths.md) | 32 identities, inspirations and 640 level rows |
| [abilities.md](abilities.md) | Full abilities, shared field contract, corrections and choices |
| [creation.md](creation.md) | Ten creation steps and advancement |
| [origins-backgrounds.md](origins-backgrounds.md) | 18 origins, backgrounds and languages |
| [training.md](training.md) | Attributes, skills, saves and derived formulas |
| [feats.md](feats.md) | Closed first-edition feat catalog |
| [equipment.md](equipment.md) | Packages, catalog and inventory |
| [spells.md](spells.md) | Full spell catalog and casting tables |
| [resources.md](resources.md) | Pools, rests and recovery |
| [architecture.md](architecture.md) | Registry, commands, persistence and presentation |
| [migration-plan.md](migration-plan.md) | Baseline, recovery and cutover |
| [acceptance-tests.md](acceptance-tests.md) | Behavioral implementation gates |


## Explicit edition decisions

Single Calling per character; no multiclassing in first edition. Exactly one Path at level 3, no Path tiers/independent leveling/currencies. Every grant persists through 20 unless upgraded/replaced explicitly. Closed feat/spell catalogs; unlisted non-SRD options unavailable. No geographic/faction restrictions. Wounds/corruption/reputation remain narrative/unrelated systems, not extra attribute or Focus/Stamina calculators.

Balance assumptions: four-character party,3–5 meaningful encounters and1–2 Short Rests per adventuring day, bounded accuracy, no assumed magic items. Maintain SRD base budgets. Original Paths are playable first-draft designs requiring later playtest balance, especially permanent flight, healing loops, extra attacks, reactions and short-rest recovery. No empirical balance claim.

## Design status and handoff

All eight Calling progressions and all 32 Path progressions cover levels 1–20. The ability catalog contains 246 base/Path feature definitions with inherited field defaults, explicit option rules and completion rulings; ten Metamagic options and all feat abilities are also specified. Spell references contain 316 entries, including five Druid-access supplements needed by existing feature alternatives. These are design documents, not proof of an implemented engine or playtest balance.

No unresolved Path slot or required mechanical choice is intentionally deferred. Phase 2 must encode the rules, vendor the exact referenced SRD mundane-gear/glossary/statblock tables, implement every persistent operation and satisfy acceptance-tests.md. Vendoring is implementation work, not permission to redesign missing mechanics. The edition's single-Calling rule, neutral lineage, +1 origin/+2 background budget, closed feat roster and original Path completion rulings are explicit new design decisions for review. They are not inferred historical requirements.

## Verification result

    {
      "requiredFiles": 14,
      "callings": 8,
      "paths": 32,
      "pathsPerCalling": {
        "corsair": 4,
        "gunslinger": 4,
        "navigator": 4,
        "tidecaller": 4,
        "warden": 4,
        "reaver": 4,
        "doctor": 4,
        "shipwright": 4
      },
      "callingLevelRows": 160,
      "pathLevelRows": 640,
      "abilityDefinitions": 246,
      "metamagicOptions": 10,
      "spellDefinitions": 316,
      "existingFileStatesVerified": 507,
      "unresolvedReferences": 0
    }

Verification covers documentation structure, resolved references and byte-for-byte preservation of the starting files/deletions. It is not a replacement-engine test run. See [the Path roster and all inspirations](paths.md), [the complete ability catalog](abilities.md), [architecture and reusable presentation](architecture.md), and [migration/recovery plan](migration-plan.md). Phase 1 design handoff is ready for Phase 2 implementation; balance and implementation acceptance remain future gates.
