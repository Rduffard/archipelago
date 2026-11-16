# Phase 3 source evidence

Generated from tracked repository files at the commits named below. Line numbers are at the audited revision. Counts refer to matching lines and include comments. Minified JSON is indexed by file and line with matched terms, since a single line can contain many entries.

## archipelago

Commit e44ecea31b716c066edd87668a5b1b3334702048. Tracked files 301, runtime JS/JSX 98, test entry files 11, generated cache files 66, temporary transcripts 2. Search scanned 228 tracked text files. Dependency lockfiles were inspected for direct versions and engines separately.

### Dependencies and static reachability

| Direct package | Locked | Node engines | Source importers |
|---|---|---|---|
| d3-delaunay | 6.0.4 | >=12 | 1 |
| react | 19.2.5 | >=0.10.0 | 57 |
| react-dom | 19.2.5 | — | 1 |
| react-router-dom | 7.14.0 | >=20.0.0 | 16 |
| zustand | 5.0.12 | >=12.20.0 | 1 |
| @eslint/js | 9.39.4 | ^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0 | 0 |
| @types/react | 19.2.14 | — | 0 |
| @types/react-dom | 19.2.3 | — | 0 |
| @vitejs/plugin-react | 6.0.1 | ^20.19.0 \|\| >=22.12.0 | 0 |
| eslint | 9.39.4 | ^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0 | 0 |
| eslint-plugin-react-hooks | 7.0.1 | >=18 | 0 |
| eslint-plugin-react-refresh | 0.5.2 | — | 0 |
| globals | 17.4.0 | >=18 | 0 |
| vite | 8.0.7 | ^20.19.0 \|\| >=22.12.0 | 0 |

Literal relative imports from src/main.jsx reach 92 runtime JS/JSX files. Scanner covers static imports, string-literal require and dynamic import. It can miss computed imports and asset references in CSS or HTML, and can mistake comments for imports. Absence here is a candidate signal.

Strongly connected groups (1):

- src/features/map/components/MapCanvas.jsx, src/features/map/layers/AuthoredShapeLayer.jsx, src/features/map/layers/ShapeEditorLayer.jsx

Outside entry-point reach (6):

- src/components/ui/DetailPill.jsx
- src/components/ui/HoverInfo/HoverInfo.jsx
- src/data/reputationData.js
- src/features/map/engine/derive/generateRivers.js
- src/lib/checkModifier.js
- src/lib/pointBuy.js

Unresolved literal paths (0):


Largest source files (physical lines):

- 410 src/features/map/components/MapViewport.jsx
- 400 src/pages/Map/MapPage.jsx
- 342 src/pages/CombatTest/CombatTestPage.jsx
- 341 src/features/map/components/MapCanvas.jsx
- 327 src/features/map/engine/generate/worldShapePolygons.js
- 313 src/pages/Rules2024/Rules2024Views.jsx
- 292 src/features/map/store/useMapStore.js
- 276 src/features/map/engine/derive/deriveCellFeatures.js
- 258 src/data/reputationData.js
- 247 src/features/map/engine/generate/worldProfiles.js
- 239 src/contexts/ThemeContext.jsx
- 219 src/features/map/layers/ShapeEditorLayer.jsx
- 188 src/features/map/engine/generate/generateElevation.js
- 186 src/pages/Rules2024/PersistentSheet.jsx
- 184 src/pages/Rules2024/Rules2024Page.jsx
- 170 src/pages/Map/components/MapToolbar.jsx

Test entry files:

- tests/characterCombat.test.mjs
- tests/characterRoster.test.mjs
- tests/checkModifier.parity.test.mjs
- tests/checkModifier.test.mjs
- tests/combat.test.mjs
- tests/equipment.test.mjs
- tests/phase2.test.mjs
- tests/pointBuy.parity.test.mjs
- tests/pointBuy.test.mjs
- tests/rules2024.rolls.test.mjs
- tests/rules2024.test.mjs

Tracked temporary files:

- phase2-final-tests.tmp
- phase2-push-tests.tmp

### Ruleset and provenance

271 matching lines in 29 files. See the audit for classification and disposition.

- character-rebuild-phase1.md — 95 [D&D, 5E]; 97 [SRD 5.2.1]; 101 [srd, SRD_CC_v5.2.1]; 103 [SRD 5.2.1, SRD protected]; 109 [D&D, 5E]; 133 [5E]; 144 [D&D]; 248 [5E]; 252 [SRD subclass]; 256 [SRD subclass]; 262 [5E]; 317 [5E]; 400 [5E]; 420 [5E]; 823 [SRD-derived]; 906 [5E]; 926 [D&D, 5E]; 936 [5E]
- docs/character-system/README.md — 11 [SRD-derived, SRD subclass]; 13 [SRD 5.2.1, Wizards of the Coast, srd. The SRD, creativecommons.org]; 15 [srd, SRD_CC_v5.2.1]; 38 [SRD options]; 40 [SRD base]; 46 [SRD mundane-]
- docs/character-system/abilities.md — 24 [SRD5.2.1 with]; 31 [SRD5.2.1 with]; 38 [SRD5.2.1 with]; 45 [SRD5.2.1 with]; 52 [SRD5.2.1 with]; 59 [SRD5.2.1 with]; 66 [SRD5.2.1 with]; 73 [SRD5.2.1 with]; 80 [SRD5.2.1 with]; 87 [SRD5.2.1 with]; 94 [SRD5.2.1 with]; 101 [SRD5.2.1 with]; 108 [SRD5.2.1 with]; 115 [SRD5.2.1 with]; 122 [SRD5.2.1 with]; 129 [SRD5.2.1 with]; 136 [SRD5.2.1 with]; 143 [SRD5.2.1 with]; 150 [SRD5.2.1 with]; 157 [SRD5.2.1 with]; 164 [SRD5.2.1 with]; 171 [SRD5.2.1 with]; 178 [SRD5.2.1 with]; 185 [SRD5.2.1 with]; 192 [SRD5.2.1 with]; 199 [SRD5.2.1 with]; 206 [SRD5.2.1 with]; 213 [SRD5.2.1 with]; 220 [SRD5.2.1 with]; 227 [SRD5.2.1 with]; 234 [SRD5.2.1 with]; 241 [SRD5.2.1 with]; 248 [SRD5.2.1 with]; 255 [SRD5.2.1 with]; 262 [SRD5.2.1 with]; 269 [SRD5.2.1 with]; 276 [SRD5.2.1 with]; 283 [SRD5.2.1 with]; 290 [SRD5.2.1 with]; 297 [SRD5.2.1 with]; 304 [SRD5.2.1 with]; 311 [SRD5.2.1 with]; 318 [SRD5.2.1 with]; 325 [SRD5.2.1 with]; 332 [SRD5.2.1 with]; 339 [SRD5.2.1 with]; 346 [SRD5.2.1 with]; 353 [SRD5.2.1 with]; 360 [SRD5.2.1 with]; 367 [SRD5.2.1 with]; 374 [SRD5.2.1 with]; 381 [SRD5.2.1 with]; 388 [SRD5.2.1 with]; 395 [SRD5.2.1 with]; 402 [SRD5.2.1 with]; 409 [SRD5.2.1 with]; 416 [SRD5.2.1 with]; 423 [SRD5.2.1 with]; 430 [SRD5.2.1 with]; 437 [SRD5.2.1 with]; 444 [SRD5.2.1 with]; 451 [SRD5.2.1 with]; 458 [SRD5.2.1 with]; 465 [SRD5.2.1 with]; 472 [SRD5.2.1 with]; 479 [SRD5.2.1 with]; 486 [SRD5.2.1 with]; 493 [SRD5.2.1 with]; 500 [SRD5.2.1 with]; 507 [SRD5.2.1 with]; 514 [SRD5.2.1 with]; 521 [SRD5.2.1 with]; 528 [SRD5.2.1 with]; 535 [SRD5.2.1 with]; 542 [SRD5.2.1 with]; 549 [SRD5.2.1 with]; 556 [SRD5.2.1 with]; 563 [SRD5.2.1 with]; 570 [SRD5.2.1 with]; 577 [SRD5.2.1 with]; 584 [SRD5.2.1 with]; 591 [SRD5.2.1 with]; 598 [SRD5.2.1 with]; 605 [SRD5.2.1 with]; 612 [SRD5.2.1 with]; 619 [SRD5.2.1 with]; 626 [SRD5.2.1 with]; 633 [SRD5.2.1 with]; 640 [SRD5.2.1 with]; 647 [SRD5.2.1 with]; 654 [SRD5.2.1 with]; 661 [SRD5.2.1 with]; 668 [SRD5.2.1 with]; 675 [SRD5.2.1 with]; 682 [SRD5.2.1 with]; 689 [SRD5.2.1 with]; 696 [SRD5.2.1 with]; 703 [SRD5.2.1 with]; 710 [SRD5.2.1 with]; 717 [SRD5.2.1 with]; 724 [SRD5.2.1 with]; 731 [SRD5.2.1 with]; 738 [SRD5.2.1 with]; 745 [SRD5.2.1 with]; 752 [SRD5.2.1 with]; 759 [SRD5.2.1 with]; 766 [SRD5.2.1 with]; 773 [SRD5.2.1 with]; 780 [SRD5.2.1 with]; 787 [SRD5.2.1 with]; 794 [SRD5.2.1 with]; 801 [SRD5.2.1 with]; 808 [SRD5.2.1 with]; 815 [SRD5.2.1 with]; 822 [SRD5.2.1 with]; 829 [SRD5.2.1 with]; 836 [SRD5.2.1 with]; 843 [SRD5.2.1 with]; 850 [SRD5.2.1 with]; 857 [SRD5.2.1 with]; 864 [SRD5.2.1 with]; 871 [SRD5.2.1 with]; 878 [SRD5.2.1 with]; 885 [SRD5.2.1 with]; 892 [SRD5.2.1 with]; 899 [SRD5.2.1 with]; 906 [SRD5.2.1 with]; 913 [SRD5.2.1 with]; 920 [SRD5.2.1 with]; 927 [SRD5.2.1 with]; 934 [SRD5.2.1 with]; 941 [SRD5.2.1 with]; 948 [SRD5.2.1 with]; 955 [SRD5.2.1 with]; 962 [SRD5.2.1 with]; 969 [SRD5.2.1 with]; 976 [SRD5.2.1 with]; 983 [SRD5.2.1 with]; 990 [SRD5.2.1 with]; 997 [SRD5.2.1 with]; 1004 [SRD5.2.1 with]; 1011 [SRD5.2.1 with]; 1018 [SRD5.2.1 with]; 1025 [SRD5.2.1 with]; 1032 [SRD5.2.1 with]; 1039 [SRD5.2.1 with]; 1046 [SRD5.2.1 with]; 1053 [SRD5.2.1 with]; 1060 [SRD5.2.1 with]; 1067 [SRD5.2.1 with]; 1977 [SRD glossary]; 1979 [SRD]; 1981 [SRD rule.]
- docs/character-system/architecture.md — 5 [rules2024, rules-2024]; 63 [Rules2024]
- docs/character-system/callings.md — 7 [SRD p61.]; 36 [SRD p47.]; 65 [SRD p57.]; 94 [SRD p64.]; 123 [SRD p53.]; 152 [SRD p28.]; 181 [SRD p36.]; 210 [SRD p77.]
- docs/character-system/creation.md — 20 [SRD species]
- docs/character-system/equipment.md — 3 [SRD mundane]; 1915 [SRD]; 1940 [SRD reference]
- docs/character-system/feats.md — 127 [SRD feats are]
- docs/character-system/migration-plan.md — 5 [Rules2024]; 115 [Rules2024]; 116 [rules2024]; 117 [rules2024]; 173 [rules2024]; 174 [rules2024]; 175 [rules2024]; 177 [rules2024]; 178 [rules2024]; 179 [rules2024]; 180 [rules2024]; 181 [rules2024]; 187 [Rules2024]; 193 [SRD tables]
- docs/character-system/origins-backgrounds.md — 32 [5E]
- docs/character-system/phase2-checklist.md — 267 [rules2024]; 268 [rules2024]; 269 [rules2024]; 279 [rules2024]; 280 [rules2024]; 286 [rules2024]; 287 [rules2024]; 288 [rules2024]; 291 [rules2024]; 301 [rules2024]; 303 [rules2024]; 313 [rules2024]; 317 [rules2024]; 321 [Rules2024]
- docs/character-system/phase2-checkpoint.md — 67 [SRD gear]; 90 [SRD price]; 104 [SRD gear]; 169 [SRD page]; 179 [SRD]; 238 [SRD keys]; 322 [SRD 5.2.1, SRD magic]; 387 [rules-2024]
- docs/character-system/resources.md — 102 [SRD Long Rest]
- docs/character-system/spells.md — 3 [SRD 5.2.1, SRD remain]
- docs/character-system/training.md — 28 [SRD tool]
- docs/origin-bonuses.md — 32 [5e]
- src/components/characters/CharacterRoster.jsx — 36 [SRD 5.2.1]
- src/components/layout/AppNavbar.jsx — 9 [rules-2024]
- src/pages/Campaigns/CampaignPage.jsx — 7 [Rules2024]
- src/pages/Rules2024/MagicItemControls.jsx — 10 [SRD]
- src/pages/Rules2024/PersistentSheet.jsx — 43 [Rules2024]; 112 [rules-2024]; 113 [rules-2024]
- src/pages/Rules2024/Rules2024.css — 1 [rules-2024]; 5 [rules-2024]; 12 [rules-2024]; 17 [rules-2024]; 20 [rules-2024]; 24 [rules-2024]; 30 [rules-2024]; 36 [rules-2024]; 40 [rules-2024]; 41 [rules-2024]
- src/pages/Rules2024/Rules2024Page.jsx — 5 [Rules2024]; 49 [rules-2024]; 64 [rules-2024]; 67 [SRD 5.2.1.]; 119 [srd-5.2.1]
- src/routes/AppRoutes.jsx — 1 [Rules2024]; 2 [Rules2024]; 3 [Rules2024]; 25 [rules-2024]
- tests/equipment.test.mjs — 11 [rules2024]; 15 [Rules2024]
- tests/phase2.test.mjs — 14 [Rules2024]; 53 [SRD 5.2.1]
- tests/rules2024.rolls.test.mjs — 3 [Rules2024]
- tests/rules2024.test.mjs — 9 [rules2024]; 11 [rules2024]; 14 [rules2024]; 16 [Rules2024]; 96 [rules2024]; 98 [Rules2024]
- tests/support/phase2-memory-ui-harness.mjs — 12 [rules2024]

### Training and legacy terminology

111 matching lines in 24 files. See the audit for classification and disposition.

- character-rebuild-phase1.md — 31 [Expertise]; 103 [subclass]; 112 [Subclass]; 113 [Proficiency]; 136 [subclasses]; 248 [subclasses]; 252 [subclass]; 256 [subclass]; 262 [subclass]; 304 [Expertise]; 317 [class progression]; 319 [subclass]; 478 [Expertise]; 575 [Expertise]; 608 [Expertise]; 847 [Expertise]; 932 [subclasses]
- docs/attribute-modifiers.md — 5 [proficiency]
- docs/character-system/README.md — 11 [subclass]
- docs/character-system/abilities.md — 11 [Expertise]; 460 [Expertise]; 490 [expertise]; 491 [Expertise, expertise]; 495 [Expertise]; 546 [expertise]; 547 [Expertise, expertise]; 551 [Expertise]; 754 [Expertise]; 1083 [Expertise]; 1132 [Expertise]; 1181 [Expertise]; 1217 [Expertise]; 1326 [Expertise]; 1470 [Expertise]; 1873 [Expertise]
- docs/character-system/acceptance-tests.md — 22 [Expertise]
- docs/character-system/callings.md — 13 [expertise]; 14 [expertise]; 15 [expertise]; 16 [expertise]; 17 [expertise]; 18 [expertise]; 19 [expertise]; 20 [expertise]; 21 [expertise]; 22 [expertise]; 23 [expertise]; 24 [expertise]; 25 [expertise]; 26 [expertise]; 27 [expertise]; 28 [expertise]; 29 [expertise]; 30 [expertise]; 31 [expertise]; 32 [expertise]; 71 [expertise]; 72 [expertise]; 73 [expertise]; 74 [expertise]; 75 [expertise]; 76 [expertise]; 77 [expertise]; 78 [expertise]; 79 [expertise]; 80 [expertise]; 81 [expertise]; 82 [expertise]; 83 [expertise]; 84 [expertise]; 85 [expertise]; 86 [expertise]; 87 [expertise]; 88 [expertise]; 89 [expertise]; 90 [expertise]
- docs/character-system/creation.md — 12 [Expertise]
- docs/character-system/migration-plan.md — 151 [Proficiencies]
- docs/character-system/paths.md — 24 [subclass]; 366 [Expertise]; 581 [subclass]; 585 [subclass]
- docs/character-system/phase2-checklist.md — 18 [Expertise]; 282 [Expertise]
- docs/character-system/phase2-checkpoint.md — 88 [Expertise]; 211 [Expertise]
- docs/character-system/training.md — 5 [Expertise]; 28 [Expertise]
- docs/gameplay/faction-tensions.md — 30 [expertise]
- docs/lore/institutional-power-structures.md — 83 [expertise]
- docs/progression-foundation.md — 3 [Proficiency]; 7 [proficiency]; 9 [proficiencies]; 19 [proficiency]; 21 [proficiency]; 23 [Proficiencies]
- docs/training.md — 9 [proficiencies, Expertise]; 15 [proficiency, Proficiency, Expertise]
- src/pages/CombatTest/CombatTestPage.jsx — 122 [proficiency]; 123 [proficiency]
- src/pages/Rules2024/CharacterCreation.jsx — 74 [expertise]; 115 [Expertise]
- src/pages/Rules2024/ConduitControls.jsx — 10 [trainingBonus]
- src/pages/Rules2024/OperationResult.jsx — 80 [expertise, Expertise, toolTrained]
- src/pages/Rules2024/Rules2024Views.jsx — 110 [expertise, Expertise]; 115 [trainingBonus]; 199 [Expertise]
- src/pages/Rules2024/ToolCheckControls.jsx — 23 [Expertise]
- tests/characterCombat.test.mjs — 34 [Proficiency]
- tests/phase2.test.mjs — 116 [trainingBonus]; 220 [trainingBonus]

### Retired systems and compatibility

365 matching lines in 59 files. See the audit for classification and disposition.

- docs/README.md — 24 [core-checks]; 25 [specialty]; 26 [specialty]; 63 [Core Checks]; 64 [Specialties, Core Checks]; 66 [Core Points, Specialty]; 68 [Specialties]
- docs/architecture/data-flow.md — 1 [Core Checks, Specialties]; 11 [Core Check]; 12 [Specialty, Core Checks]; 22 [Core Check]; 23 [Specialty]; 36 [Core Check, Specialty]; 48 [Specialty]
- docs/architecture/progression-engine.md — 1 [Core Checks, Specialties]; 12 [Core Checks]; 13 [Specialties, Core Checks]; 22 [Core Points, Core Checks]; 23 [Specialty, Specialties]; 28 [Core Check]; 30 [Core Check]; 39 [Core Checks]; 41 [Specialty]; 43 [Specialty]; 52 [Specialty]; 70 [Specialties]
- docs/architecture/rendering-architecture.md — 9 [Specialty]; 24 [Specialty]; 31 [Specialty]; 42 [SPECIALTIES]; 45 [Specialty]
- docs/architecture/specialty-registry.md — 1 [Core Checks, Specialties]; 3 [Specialty]; 5 [Specialty]; 16 [specialties]; 19 [compatibility, specialties]; 28 [Core Check]; 47 [coreCheck]; 61 [Specialty]; 73 [Specialty]; 81 [Specialty]; 90 [Specialty]
- docs/architecture/state-management.md — 19 [specialties]; 33 [corePoints]; 34 [specialty]; 35 [coreCheck]; 42 [Specialty]; 44 [Specialty]; 62 [Specialty]
- docs/architecture/training-page-flow.md — 1 [Core Checks, Specialties]; 5 [Core Point, Specialty]; 15 [Core Check]; 16 [Specialty]; 22 [Core Check]; 23 [coreCheck, Core Check]; 24 [Core Check]; 27 [Specialty]; 29 [Specialty]; 30 [Specialty]; 32 [Specialty]; 37 [Specialty]; 51 [specialty]; 53 [Specialty]; 59 [SPECIALTIES]; 62 [Specialty]
- docs/attribute-modifiers.md — 1 [Core Checks, Specialties]; 9 [Core Checks]
- docs/character-system/abilities.md — 1118 [specialty]
- docs/character-system/architecture.md — 65 [paired checks]
- docs/character-system/equipment.md — 25 [Legacy]
- docs/character-system/migration-plan.md — 84 [Legacy]; 134 [Legacy]; 145 [legacy]; 148 [Legacy]
- docs/character-system/phase2-checklist.md — 51 [compatibility]; 82 [legacy]; 94 [legacy]; 109 [legacy]
- docs/character-system/phase2-checkpoint.md — 94 [compatibility]; 108 [compatibility]; 192 [legacy]; 247 [legacy]; 291 [compatibility]; 408 [legacy]
- docs/character-system/training.md — 3 [paired-check]
- docs/decisions/2026-05-22-specialty-refactor.md — 1 [Core Checks, Specialties]; 3 [Specialty]; 7 [Specialties, Core Checks]; 11 [Core Checks]; 18 [Core Checks]; 19 [Specialties]; 24 [Core Checks]; 29 [Specialties, Core Checks]
- docs/decisions/2026-05-22-training-page-overhaul.md — 1 [Core Checks, Specialties]; 7 [Specialty]; 11 [Specialty]; 15 [Core Check, Specialty]; 21 [Core Checks]; 22 [Specialties, Core Checks]; 24 [Specialty]
- docs/diagrams/progression-layers.md — 1 [Core Checks, Specialties]; 7 [Core Checks, Core Point]; 8 [Specialties]; 14 [Core Checks, Specialties]
- docs/diagrams/training-page-flow.md — 1 [Core Checks, Specialties]; 7 [Core Check]; 8 [Specialty]; 10 [Specialty]; 13 [coreCheck]; 14 [specialty]; 17 [Specialty]
- docs/factions/nations-states/akshan.md — 24 [legacy]
- docs/factions/nations-states/khiz.md — 317 [legacy]
- docs/factions/nations-states/sha-ni.md — 401 [legacy]
- docs/factions/nations-states/tetlanco.md — 165 [legacy]
- docs/factions/nations-states/thult.md — 334 [legacy]
- docs/factions/nations-states/yayimi.md — 188 [legacy]; 258 [legacy]
- docs/gameplay/encounter-design.md — 12 [Specialty]; 25 [Specialty]; 30 [Specialty]; 32 [Specialties]; 41 [Specialty]; 83 [Specialty]
- docs/gameplay/example-characters.md — 1 [Core Checks, Specialties]; 5 [Core Checks, Specialties]; 14 [Core Checks]; 15 [Specialties]; 29 [Core Checks]; 30 [Specialties]; 44 [Core Checks]; 45 [Specialties]; 59 [Core Checks]; 60 [Specialties]
- docs/gameplay/example-resolutions.md — 1 [Core Checks, Specialties]; 5 [Core Checks, Specialties]; 13 [Core Check]; 15 [Specialty]; 38 [Specialties]; 64 [Specialties]
- docs/gameplay/faction-tensions.md — 61 [Specialty]
- docs/gameplay/gm-guidance.md — 1 [Core Checks, Specialties]; 30 [Core Check]; 42 [Specialties]; 44 [Specialty, Specialties]
- docs/gameplay/player-identity.md — 1 [Core Checks, Specialties]; 14 [Core Checks]; 15 [Specialties]; 20 [Core Checks, Specialties]; 22 [Core Checks]; 24 [Specialties]; 29 [Specialty]; 41 [Specialty]
- docs/lore/lilin-mastery-philosophy.md — 15 [Specialty]; 17 [Specialties]
- docs/lore/yuma-training-doctrine.md — 16 [Specialty]; 18 [Specialties]
- docs/progression-foundation.md — 9 [Legacy]; 17 [legacy]; 25 [Compatibility]; 27 [legacy, Legacy]; 29 [legacy]; 33 [legacy]; 37 [legacy]
- docs/progression/faction-unlocks.md — 1 [Core Checks, Specialties]; 11 [Specialty]; 12 [Specialty]; 30 [Core Check]; 31 [Specialty]; 62 [Specialties]
- docs/progression/milestone-progression.md — 1 [Core Checks, Specialties]; 23 [Core Points]; 24 [Specialty]; 29 [Specialty]; 39 [Core Point]
- docs/progression/specialty-ranks.md — 1 [Core Checks, Specialties]; 3 [Specialty]; 5 [Specialty]; 38 [coreCheck]; 39 [coreCheck]; 43 [Core Checks, Specialties]
- docs/progression/vertical-vs-horizontal.md — 1 [Core Checks, Specialties]; 13 [Core Check]; 27 [Specialty]; 38 [Specialties, Core Checks]; 68 [Specialties]
- docs/systems/attributes.md — 1 [Core Checks, Specialties]; 5 [Core Checks]; 22 [Core Checks, Specialties]; 26 [Core Checks]; 39 [Core Check]; 66 [Core Checks, Core Check, Specialties]
- docs/systems/combat-flow.md — 1 [Core Checks, Specialties]; 12 [Core Check]; 13 [Specialty]; 22 [Core Check]; 23 [Specialty]; 33 [Core Check]; 34 [Specialty]; 43 [Core Check]; 44 [Specialty]; 53 [Core Check]; 54 [Specialty]; 61 [Core Checks]; 62 [Specialties]; 68 [Specialty]
- docs/systems/core-checks.md — 1 [Core Checks, Specialties]; 3 [Core Checks]; 5 [Core Checks]; 11 [Core Checks]; 15 [Core Check]; 19 [Core Check]; 31 [Core Check]; 34 [Core Check]; 38 [Core Check]; 116 [Core Checks]; 133 [Specialty, Core Check]; 136 [Core Check]; 139 [Specialties]; 141 [Core Checks, Specialties]; 143 [Specialties]; 158 [Core Checks]
- docs/systems/corruption-system.md — 1 [Core Checks, Specialties]; 18 [Core Checks]; 20 [Core Check]; 22 [Specialties]; 24 [Specialties]; 26 [Specialties]; 56 [Core Check]; 87 [Specialty]
- docs/systems/design-pillars.md — 1 [Core Checks, Specialties]; 16 [Core Check]; 17 [Specialty]; 23 [Core Checks, Specialties]; 94 [Specialties]
- docs/systems/faction-training.md — 16 [Specialty]; 28 [Specialty]; 29 [Specialty]; 31 [Specialty]; 79 [specialty]; 81 [coreCheck]; 89 [Specialty]; 97 [Specialty]
- docs/systems/pairing-matrix.md — 1 [Core Checks, Specialties]; 5 [Core Check]; 7 [Core Checks]; 54 [Core Check, Core Checks]; 69 [Specialty]; 95 [Core Check]; 97 [Specialty, Core Check]; 102 [Core Checks]; 103 [Specialties]
- docs/systems/progression-philosophy.md — 1 [Core Checks, Specialties]; 11 [Core Checks]; 12 [Specialties]; 27 [Core Check]; 29 [Core Checks]; 31 [Core Checks]; 37 [Core Checks]; 41 [Core Point]; 42 [Specialty]; 51 [Specialties]; 53 [Specialties]; 59 [Specialties]; 67 [Specialties, Core Checks]; 77 [Core Check, Specialty]; 81 [Specialties, Specialty]
- docs/systems/reputation-model.md — 73 [Specialty]; 77 [Specialties]
- docs/systems/resolution-flow.md — 1 [Core Checks, Specialties]; 12 [Core Check]; 13 [Specialty]; 14 [Specialty]; 55 [Core Check]; 57 [Core Check]; 71 [Specialty]; 73 [Specialties]; 82 [Specialty]; 118 [Core Check]; 125 [Specialty]
- docs/systems/social-conflict.md — 1 [Core Checks, Specialties]; 24 [Core Checks]; 82 [Specialties]
- docs/systems/specialties.md — 1 [Core Checks, Specialties]; 3 [Specialties]; 5 [Specialties, Core Checks]; 11 [Specialties]; 15 [Specialty]; 19 [Specialty]; 37 [coreCheck]; 46 [Specialty]; 58 [Specialty]; 60 [Core Check]; 67 [Specialty]; 73 [Specialty]; 75 [Specialty]; 77 [Core Checks]; 84 [Specialty]; 97 [Core Checks]; 117 [Core Check, Specialties]; 123 [Specialty, Core Check]; 124 [Specialty]; 126 [Specialty]; 127 [Specialty]; 128 [Specialty]
- docs/systems/travel-and-survival.md — 1 [Core Checks, Specialties]; 17 [Core Checks]
- docs/technical/backend-schema.md — 1 [Core Checks, Specialties]; 20 [Core Checks]; 21 [Specialties]; 33 [Specialties]; 42 [Specialty]; 46 [Core Checks]; 49 [coreCheck]
- docs/technical/frontend-performance.md — 9 [Specialty]; 11 [Specialty]; 17 [Specialty]; 28 [SPECIALTIES]; 33 [Specialty]; 40 [SPECIALTIES]
- docs/training.md — 5 [Core Check, Specialty]; 9 [Core Points, Specialty]; 25 [Core Check]; 29 [Specialty]; 31 [specialty]
- docs/ui-ux/progression-ux.md — 1 [Core Checks, Specialties]; 11 [Core Checks]; 12 [Specialties]; 13 [Specialty]; 26 [Core Checks, Specialties]; 28 [Core Check]; 30 [Core Checks]; 38 [Specialty]; 40 [Specialties]; 48 [Specialties, Core Checks]
- docs/ui-ux/tooltip-guidelines.md — 1 [Core Checks, Specialties]; 15 [Specialty]; 17 [Specialty]; 24 [Core Checks]; 28 [Core Check]; 30 [Core Check]
- docs/ui-ux/training-page-ux.md — 1 [Core Checks, Specialties]; 12 [Specialty]; 14 [Specialty]; 18 [Core Check]; 28 [Specialty]; 30 [Specialty]; 32 [Specialty]; 33 [Core Checks]; 43 [Specialty]; 55 [Specialty]; 62 [Core Checks]; 68 [Specialty]; 83 [Specialties]; 87 [Specialty]
- src/contexts/AuthContext.jsx — 7 [LEGACY]; 13 [legacy, LEGACY]; 15 [legacy]; 20 [legacy]; 27 [LEGACY]; 31 [LEGACY]; 50 [LEGACY]; 55 [LEGACY]
- tests/characterRoster.test.mjs — 12 [legacy]; 13 [legacy]

## crossworld_backend

Commit 1208ebf288e3f84a97f00529eae13afa57a940fc. Tracked files 256, runtime JS/JSX 157, test entry files 65, generated cache files 0, temporary transcripts 5. Search scanned 253 tracked text files. Dependency lockfiles were inspected for direct versions and engines separately.

### Dependencies and static reachability

| Direct package | Locked | Node engines | Source importers |
|---|---|---|---|
| bcryptjs | 3.0.3 | — | 2 |
| celebrate | 15.0.3 | — | 12 |
| cloudinary | 2.9.0 | >=9 | 0 |
| cors | 2.8.6 | >= 0.10 | 1 |
| dotenv | 17.2.4 | >=12 | 1 |
| express | 5.2.1 | >= 18 | 20 |
| express-winston | 4.2.0 | >= 6 | 1 |
| jsonwebtoken | 9.0.3 | >=12 | 4 |
| mongoose | 8.22.1 | >=16.20.1 | 22 |
| multer | 2.0.2 | >= 10.16.0 | 0 |
| socket.io | 4.8.1 | >=10.2.0 | 1 |
| validator | 13.15.26 | >= 0.10 | 5 |
| winston | 3.19.0 | >= 12.0.0 | 1 |
| @eslint/js | 10.0.1 | ^20.19.0 \|\| ^22.13.0 \|\| >=24 | 0 |
| eslint | 10.0.0 | ^20.19.0 \|\| ^22.13.0 \|\| >=24 | 0 |
| eslint-config-prettier | 8.10.2 | — | 0 |
| globals | 17.3.0 | >=18 | 0 |
| nodemon | 3.1.14 | >=10 | 0 |
| prettier | 2.8.8 | >=10.13.0 | 0 |

Literal relative imports from src/app.js reach 152 runtime JS/JSX files. Scanner covers static imports, string-literal require and dynamic import. It can miss computed imports and asset references in CSS or HTML, and can mistake comments for imports. Absence here is a candidate signal.

Strongly connected groups (1):

- src/modules/archipelago/equipment/bundles.js, src/modules/archipelago/equipment/commands.js, src/modules/archipelago/equipment/index.js, src/modules/archipelago/equipment/magic.js, src/modules/archipelago/equipment/training.js, src/modules/archipelago/equipment/utilization.js, src/modules/archipelago/system/blueprints/equipment/index.js, src/modules/archipelago/system/rules2024/abilityOperations.js, src/modules/archipelago/system/rules2024/agilityChecks.js, src/modules/archipelago/system/rules2024/clock.js, src/modules/archipelago/system/rules2024/contingency.js, src/modules/archipelago/system/rules2024/corsairOperations.js, src/modules/archipelago/system/rules2024/covenantOperations.js, src/modules/archipelago/system/rules2024/creation.js, src/modules/archipelago/system/rules2024/damageRiders.js, src/modules/archipelago/system/rules2024/engine.js, src/modules/archipelago/system/rules2024/equipment.js, src/modules/archipelago/system/rules2024/featOperations.js, src/modules/archipelago/system/rules2024/featureOperations.js, src/modules/archipelago/system/rules2024/folioOperations.js, src/modules/archipelago/system/rules2024/gunslingerOperations.js, src/modules/archipelago/system/rules2024/healingSpells.js, src/modules/archipelago/system/rules2024/index.js, src/modules/archipelago/system/rules2024/metamagic.js, src/modules/archipelago/system/rules2024/navigatorOperations.js, src/modules/archipelago/system/rules2024/reaverOperations.js, src/modules/archipelago/system/rules2024/runtime.js, src/modules/archipelago/system/rules2024/selections.js, src/modules/archipelago/system/rules2024/spellComponents.js, src/modules/archipelago/system/rules2024/spellMaterials.js, src/modules/archipelago/system/rules2024/strikeOperations.js, src/modules/archipelago/system/rules2024/utilityOperations.js, src/modules/archipelago/system/rules2024/vitality.js, src/modules/archipelago/system/rules2024/wardenOperations.js

Outside entry-point reach (5):

- src/config/cors.js
- src/modules/archipelago/rolls/model.js
- src/modules/archipelago/system/pointBuy.js
- src/modules/archipelago/system/rules2024/newPaths.js
- src/modules/archipelago/system/rules2024/originalPaths.js

Unresolved literal paths (0):


Largest source files (physical lines):

- 1621 src/modules/archipelago/system/blueprints/equipment/weapons.js
- 1004 src/modules/community/controllers/communityController.js
- 846 src/modules/archipelago/system/rules2024/engine.js
- 512 src/modules/archipelago/system/rules2024/abilityOperations.js
- 484 src/modules/archipelago/system/rules2024/catalog.js
- 321 src/modules/archipelago/system/blueprints/characters/origins.js
- 303 src/modules/archipelago/characters/commands.js
- 303 src/modules/archipelago/system/blueprints/equipment/armor.js
- 291 src/modules/archipelago/equipment/index.js
- 289 src/modules/archipelago/system/rules2024/runtime.js
- 249 src/modules/achievements/service.js
- 216 src/modules/auth/controller.js
- 205 src/modules/archipelago/system/rules2024/progression.js
- 202 src/modules/archipelago/system/rules2024/selections.js
- 200 src/modules/archipelago/system/blueprints/world/reputation.js
- 189 src/modules/archipelago/combat/state.js

Test entry files:

- tests/characterCombat.test.mjs
- tests/checkModifier.test.mjs
- tests/combat.test.mjs
- tests/equipment.test.mjs
- tests/equipmentIntegration.test.mjs
- tests/equipmentProperties.test.mjs
- tests/phase2.acceptance-numbers.test.mjs
- tests/phase2.attack-records.test.mjs
- tests/phase2.audit.test.mjs
- tests/phase2.authority.test.mjs
- tests/phase2.base-passives.test.mjs
- tests/phase2.campaigns.test.mjs
- tests/phase2.caster-paths.test.mjs
- tests/phase2.casting-components.test.mjs
- tests/phase2.cinder.test.mjs
- tests/phase2.commands.test.mjs
- tests/phase2.conduit.test.mjs
- tests/phase2.core-actions.test.mjs
- tests/phase2.corsair-paths.test.mjs
- tests/phase2.covenant.test.mjs
- tests/phase2.creation-idempotency.test.mjs
- tests/phase2.creation-purchases.test.mjs
- tests/phase2.damage-riders.test.mjs
- tests/phase2.doctor-targets.test.mjs
- tests/phase2.error-contract.test.mjs
- tests/phase2.feats.test.mjs
- tests/phase2.final-defects.test.mjs
- tests/phase2.folio.test.mjs
- tests/phase2.gear-catalog.test.mjs
- tests/phase2.gray-net.test.mjs
- tests/phase2.gunslinger-actions.test.mjs
- tests/phase2.gunslinger-paths.test.mjs
- tests/phase2.healing-spells.test.mjs
- tests/phase2.identity.test.mjs
- tests/phase2.intervention.test.mjs
- tests/phase2.inventory.test.mjs
- tests/phase2.magic-items.test.mjs
- tests/phase2.materials.test.mjs
- tests/phase2.metamagic.test.mjs
- tests/phase2.mongo.test.mjs
- tests/phase2.navigator-paths.test.mjs
- tests/phase2.object-use.test.mjs
- tests/phase2.overchannel.test.mjs
- tests/phase2.path-management.test.mjs
- tests/phase2.preparations.test.mjs
- tests/phase2.reaver-paths.test.mjs
- tests/phase2.rebuild.test.mjs
- tests/phase2.relay.test.mjs
- tests/phase2.remaining-path-clauses.test.mjs
- tests/phase2.replacements.test.mjs
- tests/phase2.rest-time.test.mjs
- tests/phase2.sales.test.mjs
- tests/phase2.shared-contracts.test.mjs
- tests/phase2.strikes.test.mjs
- tests/phase2.test.mjs
- tests/phase2.tool-checks.test.mjs
- tests/phase2.utility.test.mjs
- tests/phase2.vitality.test.mjs
- tests/phase2.warden-paths.test.mjs
- tests/pointBuy.test.mjs
- tests/rules2024.completion.test.mjs
- tests/rules2024.http.test.mjs
- tests/rules2024.persistence.test.mjs
- tests/rules2024.resources.test.mjs
- tests/rules2024.test.mjs

Tracked temporary files:

- phase2-campaign-focused.tmp
- phase2-final-tests.tmp
- phase2-focus-output.tmp
- phase2-magic-output.tmp
- phase2-push-tests.tmp

### Ruleset and provenance

2443 matching lines in 75 files. See the audit for classification and disposition.

- docs/equipment-foundation.md — 3 [SRD 5.2, SRD Pistol]
- docs/origin-bonuses.md — 32 [5e]
- docs/progression-v2-implementation.md — 5 [SRD classes., SRD]; 9 [srd, SRD_CC_v5.2., CC BY 4.0]; 15 [SRD-inspired]
- docs/rules2024-stage.md — 7 [rules2024]; 20 [SRD]
- phase2-final-tests.tmp — 141 [SRD table]; 142 [SRD table]; 147 [SRD Guard]; 148 [SRD Guard]; 249 [SRD ranged]; 250 [SRD ranged]
- phase2-push-tests.tmp — 141 [SRD table]; 142 [SRD table]; 147 [SRD Guard]; 148 [SRD Guard]; 249 [SRD ranged]; 250 [SRD ranged]; 2731 [rules2024]; 2732 [rules2024]; 2733 [rules2024]; 2765 [rules2024]; 2766 [rules2024]
- src/modules/archipelago/characters/authority.js — 37 [rules2024]
- src/modules/archipelago/characters/commands.js — 2 [rules2024]; 9 [rules2024]; 31 [rules2024]; 34 [rules2024]; 36 [rules2024]; 46 [rules2024]; 62 [rules2024]; 64 [rules2024]; 66 [rules2024]; 68 [rules2024]; 69 [rules2024]; 71 [rules2024]; 73 [rules2024]; 79 [rules2024]; 83 [rules2024]; 91 [rules2024]; 95 [rules2024]; 103 [rules2024]; 104 [rules2024]; 114 [rules2024]; 118 [rules2024]; 128 [rules2024]; 136 [rules2024]; 138 [rules2024]; 140 [rules2024]; 141 [rules2024]; 142 [rules2024]; 144 [rules2024]; 145 [rules2024]; 146 [rules2024]; 162 [rules2024]; 183 [rules2024]; 195 [rules2024]; 207 [rules2024]; 274 [rules2024]; 286 [rules2024]; 296 [rules2024]
- src/modules/archipelago/characters/controller.js — 2 [rules2024]
- src/modules/archipelago/characters/creationEquipment.js — 6 [rules2024]
- src/modules/archipelago/characters/model.js — 26 [rules2024]
- src/modules/archipelago/characters/rebuild.js — 2 [rules2024]; 16 [rules2024]
- src/modules/archipelago/characters/routes.js — 5 [rules2024]
- src/modules/archipelago/characters/rules2024.js — 1 [SRD]; 3 [rules2024]; 74 [rules2024]
- src/modules/archipelago/combat/snapshot.js — 5 [rules2024]
- src/modules/archipelago/combat/state.js — 14 [rules2024]
- src/modules/archipelago/equipment/chargedItems.js — 9 [rules2024]; 13 [rules2024]; 15 [rules2024]; 21 [rules2024]; 22 [rules2024]; 25 [rules2024]; 32 [rules2024]
- src/modules/archipelago/equipment/commands.js — 14 [rules2024]; 27 [rules2024]; 47 [rules2024]; 48 [rules2024]
- src/modules/archipelago/equipment/index.js — 37 [rules2024]; 55 [rules2024]; 124 [rules2024]; 158 [rules2024]; 211 [rules2024]; 215 [rules2024]; 278 [rules2024]
- src/modules/archipelago/equipment/magic.js — 16 [rules2024]
- src/modules/archipelago/equipment/magicProfiles.js — 1 [SRD 5.2.1, CC-BY-4.0, rules2024]; 2 [srd, SRD_CC_v5.2.1]; 12 [SRD]
- src/modules/archipelago/equipment/scrolls.js — 2 [rules2024]; 9 [rules2024]; 15 [rules2024]; 17 [rules2024]; 18 [rules2024]; 27 [rules2024]; 31 [rules2024]
- src/modules/archipelago/equipment/training.js — 1 [rules2024]
- src/modules/archipelago/equipment/utilization.js — 22 [rules2024]; 40 [rules2024]; 47 [rules2024]; 48 [rules2024]; 59 [rules2024]; 61 [rules2024]; 67 [rules2024]; 68 [rules2024]; 76 [rules2024]
- src/modules/archipelago/system/blueprints/equipment/NOTICE.md — 1 [SRD 5.2, Wizards of the Coast, srd. The SRD, creativecommons.org]; 3 [srd, SRD_CC_v5.2.]
- src/modules/archipelago/system/blueprints/equipment/armor.js — 25 [srd-5.2]; 50 [srd-5.2]; 75 [srd-5.2]; 100 [srd-5.2]; 125 [srd-5.2]; 150 [srd-5.2]; 175 [srd-5.2]; 200 [srd-5.2]; 225 [srd-5.2]; 250 [srd-5.2]; 275 [srd-5.2]; 300 [srd-5.2]
- src/modules/archipelago/system/blueprints/equipment/index.js — 6 [rules2024]; 9 [srdGear.json]
- src/modules/archipelago/system/blueprints/equipment/packs.js — 1 [SRD 5.2.1 pp]
- src/modules/archipelago/system/blueprints/equipment/shields.js — 15 [srd-5.2]
- src/modules/archipelago/system/blueprints/equipment/srdGear.json — 14 [SRD]; 17 [srd, SRD_CC_v5.2.1]; 33 [SRD]; 36 [srd, SRD_CC_v5.2.1]; 52 [SRD]; 55 [srd, SRD_CC_v5.2.1]; 71 [SRD]; 74 [srd, SRD_CC_v5.2.1]; 90 [SRD]; 93 [srd, SRD_CC_v5.2.1]; 109 [SRD]; 112 [srd, SRD_CC_v5.2.1]; 128 [SRD]; 131 [srd, SRD_CC_v5.2.1]; 147 [SRD]; 150 [srd, SRD_CC_v5.2.1]; 166 [SRD]; 169 [srd, SRD_CC_v5.2.1]; 185 [SRD]; 188 [srd, SRD_CC_v5.2.1]; 204 [SRD]; 207 [srd, SRD_CC_v5.2.1]; 223 [SRD]; 226 [srd, SRD_CC_v5.2.1]; 242 [SRD]; 245 [srd, SRD_CC_v5.2.1]; 261 [SRD]; 264 [srd, SRD_CC_v5.2.1]; 280 [SRD]; 283 [srd, SRD_CC_v5.2.1]; 299 [SRD]; 302 [srd, SRD_CC_v5.2.1]; 318 [SRD]; 321 [srd, SRD_CC_v5.2.1]; 337 [SRD]; 340 [srd, SRD_CC_v5.2.1]; 356 [SRD]; 359 [srd, SRD_CC_v5.2.1]; 375 [SRD]; 378 [srd, SRD_CC_v5.2.1]; 394 [SRD]; 397 [srd, SRD_CC_v5.2.1]; 413 [SRD]; 416 [srd, SRD_CC_v5.2.1]; 432 [SRD]; 435 [srd, SRD_CC_v5.2.1]; 451 [SRD]; 454 [srd, SRD_CC_v5.2.1]; 470 [SRD]; 473 [srd, SRD_CC_v5.2.1]; 489 [SRD]; 492 [srd, SRD_CC_v5.2.1]; 508 [SRD]; 511 [srd, SRD_CC_v5.2.1]; 527 [SRD]; 530 [srd, SRD_CC_v5.2.1]; 546 [SRD]; 549 [srd, SRD_CC_v5.2.1]; 565 [SRD]; 568 [srd, SRD_CC_v5.2.1]; 584 [SRD]; 587 [srd, SRD_CC_v5.2.1]; 603 [SRD]; 606 [srd, SRD_CC_v5.2.1]; 622 [SRD]; 625 [srd, SRD_CC_v5.2.1]; 641 [SRD]; 644 [srd, SRD_CC_v5.2.1]; 660 [SRD]; 663 [srd, SRD_CC_v5.2.1]; 679 [SRD]; 682 [srd, SRD_CC_v5.2.1]; 698 [SRD]; 701 [srd, SRD_CC_v5.2.1]; 717 [SRD]; 720 [srd, SRD_CC_v5.2.1]; 736 [SRD]; 739 [srd, SRD_CC_v5.2.1]; 755 [SRD]; 758 [srd, SRD_CC_v5.2.1]; 774 [SRD]; 777 [srd, SRD_CC_v5.2.1]; 793 [SRD]; 796 [srd, SRD_CC_v5.2.1]; 812 [SRD]; 815 [srd, SRD_CC_v5.2.1]; 831 [SRD]; 834 [srd, SRD_CC_v5.2.1]; 850 [SRD]; 853 [srd, SRD_CC_v5.2.1]; 869 [SRD]; 872 [srd, SRD_CC_v5.2.1]; 888 [SRD]; 891 [srd, SRD_CC_v5.2.1]; 907 [SRD]; 910 [srd, SRD_CC_v5.2.1]; 926 [SRD]; 929 [srd, SRD_CC_v5.2.1]; 945 [SRD]; 948 [srd, SRD_CC_v5.2.1]; 964 [SRD]; 967 [srd, SRD_CC_v5.2.1]; 983 [SRD]; 986 [srd, SRD_CC_v5.2.1]; 1002 [SRD]; 1005 [srd, SRD_CC_v5.2.1]; 1021 [SRD]; 1024 [srd, SRD_CC_v5.2.1]; 1040 [SRD]; 1043 [srd, SRD_CC_v5.2.1]; 1059 [SRD]; 1062 [srd, SRD_CC_v5.2.1]; 1078 [SRD]; 1081 [srd, SRD_CC_v5.2.1]; 1097 [SRD]; 1100 [srd, SRD_CC_v5.2.1]; 1116 [SRD]; 1119 [srd, SRD_CC_v5.2.1]; 1135 [SRD]; 1138 [srd, SRD_CC_v5.2.1]; 1154 [SRD]; 1157 [srd, SRD_CC_v5.2.1]; 1173 [SRD]; 1176 [srd, SRD_CC_v5.2.1]; 1192 [SRD]; 1195 [srd, SRD_CC_v5.2.1]; 1211 [SRD]; 1214 [srd, SRD_CC_v5.2.1]; 1230 [SRD]; 1233 [srd, SRD_CC_v5.2.1]; 1249 [SRD]; 1252 [srd, SRD_CC_v5.2.1]; 1268 [SRD]; 1271 [srd, SRD_CC_v5.2.1]; 1287 [SRD]; 1290 [srd, SRD_CC_v5.2.1]; 1306 [SRD]; 1309 [srd, SRD_CC_v5.2.1]; 1324 [SRD]; 1327 [srd, SRD_CC_v5.2.1]; 1342 [SRD]; 1345 [srd, SRD_CC_v5.2.1]; 1361 [SRD]; 1364 [srd, SRD_CC_v5.2.1]; 1380 [SRD]; 1383 [srd, SRD_CC_v5.2.1]; 1399 [SRD]; 1402 [srd, SRD_CC_v5.2.1]; 1418 [SRD]; 1421 [srd, SRD_CC_v5.2.1]; 1437 [SRD]; 1440 [srd, SRD_CC_v5.2.1]; 1456 [SRD]; 1459 [srd, SRD_CC_v5.2.1]; 1475 [SRD]; 1478 [srd, SRD_CC_v5.2.1]; 1496 [SRD]; 1499 [srd, SRD_CC_v5.2.1]; 1516 [SRD]; 1519 [srd, SRD_CC_v5.2.1]; 1536 [SRD]; 1539 [srd, SRD_CC_v5.2.1]; 1556 [SRD]; 1559 [srd, SRD_CC_v5.2.1]; 1576 [SRD]; 1579 [srd, SRD_CC_v5.2.1]; 1596 [SRD]; 1599 [srd, SRD_CC_v5.2.1]; 1616 [SRD]; 1619 [srd, SRD_CC_v5.2.1]; 1636 [SRD]; 1639 [srd, SRD_CC_v5.2.1]; 1656 [SRD]; 1659 [srd, SRD_CC_v5.2.1]; 1676 [SRD]; 1679 [srd, SRD_CC_v5.2.1]; 1696 [SRD]; 1699 [srd, SRD_CC_v5.2.1]; 1716 [SRD]; 1719 [srd, SRD_CC_v5.2.1]; 1736 [SRD]; 1739 [srd, SRD_CC_v5.2.1]; 1756 [SRD]; 1759 [srd, SRD_CC_v5.2.1]; 1776 [SRD]; 1779 [srd, SRD_CC_v5.2.1]; 1796 [SRD]; 1799 [srd, SRD_CC_v5.2.1]; 1816 [SRD]; 1819 [srd, SRD_CC_v5.2.1]; 1836 [SRD]; 1839 [srd, SRD_CC_v5.2.1]; 1856 [SRD]; 1859 [srd, SRD_CC_v5.2.1]; 1876 [SRD]; 1879 [srd, SRD_CC_v5.2.1]; 1896 [SRD]; 1899 [srd, SRD_CC_v5.2.1]; 1916 [SRD]; 1919 [srd, SRD_CC_v5.2.1]; 1936 [SRD]; 1939 [srd, SRD_CC_v5.2.1]; 1956 [SRD]; 1959 [srd, SRD_CC_v5.2.1]; 1976 [SRD]; 1979 [srd, SRD_CC_v5.2.1]; 1996 [SRD]; 1999 [srd, SRD_CC_v5.2.1]; 2016 [SRD]; 2019 [srd, SRD_CC_v5.2.1]; 2036 [SRD]; 2039 [srd, SRD_CC_v5.2.1]; 2056 [SRD]; 2059 [srd, SRD_CC_v5.2.1]; 2076 [SRD]; 2079 [srd, SRD_CC_v5.2.1]; 2096 [SRD]; 2099 [srd, SRD_CC_v5.2.1]; 2116 [SRD]; 2119 [srd, SRD_CC_v5.2.1]; 2136 [SRD]; 2139 [srd, SRD_CC_v5.2.1]; 2156 [SRD]; 2159 [srd, SRD_CC_v5.2.1]; 2176 [SRD]; 2179 [srd, SRD_CC_v5.2.1]; 2196 [SRD]; 2199 [srd, SRD_CC_v5.2.1]; 2216 [SRD]; 2219 [srd, SRD_CC_v5.2.1]; 2235 [SRD]; 2238 [srd, SRD_CC_v5.2.1]; 2254 [SRD]; 2257 [srd, SRD_CC_v5.2.1]; 2273 [SRD]; 2276 [srd, SRD_CC_v5.2.1]; 2292 [SRD]; 2295 [srd, SRD_CC_v5.2.1]; 2311 [SRD]; 2314 [srd, SRD_CC_v5.2.1]; 2330 [SRD]; 2333 [srd, SRD_CC_v5.2.1]; 2349 [SRD]; 2352 [srd, SRD_CC_v5.2.1]; 2368 [SRD]; 2371 [srd, SRD_CC_v5.2.1]; 2389 [SRD]; 2392 [srd, SRD_CC_v5.2.1]; 2432 [SRD]; 2435 [srd, SRD_CC_v5.2.1]; 2482 [SRD]; 2485 [srd, SRD_CC_v5.2.1]
- src/modules/archipelago/system/blueprints/equipment/weapons.js — 1 [SRD 5.2]; 30 [srd-5.2]; 77 [srd-5.2]; 116 [srd-5.2]; 160 [srd-5.2]; 206 [srd-5.2]; 250 [srd-5.2]; 285 [srd-5.2]; 326 [srd-5.2]; 360 [srd-5.2]; 411 [srd-5.2]; 455 [srd-5.2]; 503 [srd-5.2]; 548 [srd-5.2]; 590 [srd-5.2]; 631 [srd-5.2]; 661 [srd-5.2]; 702 [srd-5.2]; 739 [srd-5.2]; 776 [srd-5.2]; 817 [srd-5.2]; 859 [srd-5.2]; 900 [srd-5.2]; 937 [srd-5.2]; 967 [srd-5.2]; 1008 [srd-5.2]; 1042 [srd-5.2]; 1079 [srd-5.2]; 1116 [srd-5.2]; 1167 [srd-5.2]; 1208 [srd-5.2]; 1249 [srd-5.2]; 1287 [srd-5.2]; 1331 [srd-5.2]; 1379 [srd-5.2]; 1435 [srd-5.2]; 1483 [srd-5.2]; 1531 [srd-5.2]; 1576 [srd-5.2]
- src/modules/archipelago/system/routes.js — 3 [rules2024]; 10 [rules2024]; 17 [rules-2024, rules2024]; 18 [rules-2024]; 24 [rules2024]
- src/modules/archipelago/system/rules2024/NOTICE.md — 1 [SRD 5.2.1, Wizards of the Coast, srd. The SRD, creativecommons.org]; 3 [SRD 5.2.1.]; 5 [SRD 5.2.1 PDF]
- src/modules/archipelago/system/rules2024/canonicalRules.json — 12 [SRD]; 14 [srd, SRD_CC_v5.2.1]; 31 [SRD]; 33 [srd, SRD_CC_v5.2.1]; 50 [SRD]; 52 [srd, SRD_CC_v5.2.1]; 69 [SRD]; 71 [srd, SRD_CC_v5.2.1]; 88 [SRD]; 90 [srd, SRD_CC_v5.2.1]; 107 [SRD]; 109 [srd, SRD_CC_v5.2.1]; 126 [SRD]; 128 [srd, SRD_CC_v5.2.1]; 145 [SRD]; 147 [srd, SRD_CC_v5.2.1]; 164 [SRD]; 166 [srd, SRD_CC_v5.2.1]; 183 [SRD]; 185 [srd, SRD_CC_v5.2.1]; 202 [SRD]; 204 [srd, SRD_CC_v5.2.1]; 221 [SRD]; 223 [srd, SRD_CC_v5.2.1]; 240 [SRD]; 242 [srd, SRD_CC_v5.2.1]; 259 [SRD]; 261 [srd, SRD_CC_v5.2.1]; 278 [SRD]; 280 [srd, SRD_CC_v5.2.1]; 297 [SRD]; 299 [srd, SRD_CC_v5.2.1]; 316 [SRD]; 318 [srd, SRD_CC_v5.2.1]; 335 [SRD]; 337 [srd, SRD_CC_v5.2.1]; 354 [SRD]; 356 [srd, SRD_CC_v5.2.1]; 373 [SRD]; 375 [srd, SRD_CC_v5.2.1]; 392 [SRD]; 394 [srd, SRD_CC_v5.2.1]; 411 [SRD]; 413 [srd, SRD_CC_v5.2.1]; 430 [SRD]; 432 [srd, SRD_CC_v5.2.1]; 449 [SRD]; 451 [srd, SRD_CC_v5.2.1]; 468 [SRD]; 470 [srd, SRD_CC_v5.2.1]; 487 [SRD]; 489 [srd, SRD_CC_v5.2.1]; 506 [SRD]; 508 [srd, SRD_CC_v5.2.1]; 525 [SRD]; 527 [srd, SRD_CC_v5.2.1]; 544 [SRD]; 546 [srd, SRD_CC_v5.2.1]; 563 [SRD]; 565 [srd, SRD_CC_v5.2.1]; 582 [SRD]; 584 [srd, SRD_CC_v5.2.1]; 601 [SRD]; 603 [srd, SRD_CC_v5.2.1]; 620 [SRD]; 622 [srd, SRD_CC_v5.2.1]; 639 [SRD]; 641 [srd, SRD_CC_v5.2.1]; 658 [SRD]; 660 [srd, SRD_CC_v5.2.1]; 677 [SRD]; 679 [srd, SRD_CC_v5.2.1]; 696 [SRD]; 698 [srd, SRD_CC_v5.2.1]; 715 [SRD]; 717 [srd, SRD_CC_v5.2.1]; 734 [SRD]; 736 [srd, SRD_CC_v5.2.1]; 753 [SRD]; 755 [srd, SRD_CC_v5.2.1]; 772 [SRD]; 774 [srd, SRD_CC_v5.2.1]; 791 [SRD]; 793 [srd, SRD_CC_v5.2.1]; 810 [SRD]; 812 [srd, SRD_CC_v5.2.1]; 829 [SRD]; 831 [srd, SRD_CC_v5.2.1]; 848 [SRD]; 850 [srd, SRD_CC_v5.2.1]; 867 [SRD]; 869 [srd, SRD_CC_v5.2.1]; 886 [SRD]; 888 [srd, SRD_CC_v5.2.1]; 905 [SRD]; 907 [srd, SRD_CC_v5.2.1]; 924 [SRD]; 926 [srd, SRD_CC_v5.2.1]; 943 [SRD]; 945 [srd, SRD_CC_v5.2.1]; 962 [SRD]; 964 [srd, SRD_CC_v5.2.1]; 981 [SRD]; 983 [srd, SRD_CC_v5.2.1]; 1000 [SRD]; 1002 [srd, SRD_CC_v5.2.1]; 1019 [SRD]; 1021 [srd, SRD_CC_v5.2.1]; 1038 [SRD]; 1040 [srd, SRD_CC_v5.2.1]; 1057 [SRD]; 1059 [srd, SRD_CC_v5.2.1]; 1076 [SRD]; 1078 [srd, SRD_CC_v5.2.1]; 1095 [SRD]; 1097 [srd, SRD_CC_v5.2.1]; 1114 [SRD]; 1116 [srd, SRD_CC_v5.2.1]; 1133 [SRD]; 1135 [srd, SRD_CC_v5.2.1]; 1152 [SRD]; 1154 [srd, SRD_CC_v5.2.1]; 1171 [SRD]; 1173 [srd, SRD_CC_v5.2.1]; 1190 [SRD]; 1192 [srd, SRD_CC_v5.2.1]; 1209 [SRD]; 1211 [srd, SRD_CC_v5.2.1]; 1228 [SRD]; 1230 [srd, SRD_CC_v5.2.1]; 1247 [SRD]; 1249 [srd, SRD_CC_v5.2.1]; 1266 [SRD]; 1268 [srd, SRD_CC_v5.2.1]; 1285 [SRD]; 1287 [srd, SRD_CC_v5.2.1]; 1304 [SRD]; 1306 [srd, SRD_CC_v5.2.1]; 1323 [SRD]; 1325 [srd, SRD_CC_v5.2.1]; 1342 [SRD]; 1344 [srd, SRD_CC_v5.2.1]; 1361 [SRD]; 1363 [srd, SRD_CC_v5.2.1]; 1380 [SRD]; 1382 [srd, SRD_CC_v5.2.1]; 1399 [SRD]; 1401 [srd, SRD_CC_v5.2.1]; 1418 [SRD]; 1420 [srd, SRD_CC_v5.2.1]; 1437 [SRD]; 1439 [srd, SRD_CC_v5.2.1]; 1456 [SRD]; 1458 [srd, SRD_CC_v5.2.1]; 1475 [SRD]; 1477 [srd, SRD_CC_v5.2.1]; 1494 [SRD]; 1496 [srd, SRD_CC_v5.2.1]; 1513 [SRD]; 1515 [srd, SRD_CC_v5.2.1]; 1532 [SRD]; 1534 [srd, SRD_CC_v5.2.1]; 1551 [SRD]; 1553 [srd, SRD_CC_v5.2.1]; 1570 [SRD]; 1572 [srd, SRD_CC_v5.2.1]; 1589 [SRD]; 1591 [srd, SRD_CC_v5.2.1]; 1608 [SRD]; 1610 [srd, SRD_CC_v5.2.1]; 1627 [SRD]; 1629 [srd, SRD_CC_v5.2.1]; 1646 [SRD]; 1648 [srd, SRD_CC_v5.2.1]; 1665 [SRD]; 1667 [srd, SRD_CC_v5.2.1]; 1684 [SRD]; 1686 [srd, SRD_CC_v5.2.1]; 1703 [SRD]; 1705 [srd, SRD_CC_v5.2.1]; 1722 [SRD]; 1724 [srd, SRD_CC_v5.2.1]; 1741 [SRD]; 1743 [srd, SRD_CC_v5.2.1]; 1760 [SRD]; 1762 [srd, SRD_CC_v5.2.1]; 1779 [SRD]; 1781 [srd, SRD_CC_v5.2.1]; 1798 [SRD]; 1800 [srd, SRD_CC_v5.2.1]; 1817 [SRD]; 1819 [srd, SRD_CC_v5.2.1]; 1836 [SRD]; 1838 [srd, SRD_CC_v5.2.1]; 1855 [SRD]; 1857 [srd, SRD_CC_v5.2.1]; 1874 [SRD]; 1876 [srd, SRD_CC_v5.2.1]; 1893 [SRD]; 1895 [srd, SRD_CC_v5.2.1]; 1912 [SRD]; 1914 [srd, SRD_CC_v5.2.1]; 1931 [SRD]; 1933 [srd, SRD_CC_v5.2.1]; 1950 [SRD]; 1952 [srd, SRD_CC_v5.2.1]; 1969 [SRD]; 1971 [srd, SRD_CC_v5.2.1]; 1988 [SRD]; 1990 [srd, SRD_CC_v5.2.1]; 2007 [SRD]; 2009 [srd, SRD_CC_v5.2.1]; 2026 [SRD]; 2028 [srd, SRD_CC_v5.2.1]; 2045 [SRD]; 2047 [srd, SRD_CC_v5.2.1]; 2064 [SRD]; 2066 [srd, SRD_CC_v5.2.1]; 2083 [SRD]; 2085 [srd, SRD_CC_v5.2.1]; 2102 [SRD]; 2104 [srd, SRD_CC_v5.2.1]; 2121 [SRD]; 2123 [srd, SRD_CC_v5.2.1]; 2140 [SRD]; 2142 [srd, SRD_CC_v5.2.1]; 2159 [SRD]; 2161 [srd, SRD_CC_v5.2.1]; 2178 [SRD]; 2180 [srd, SRD_CC_v5.2.1]; 2197 [SRD]; 2199 [srd, SRD_CC_v5.2.1]; 2216 [SRD]; 2218 [srd, SRD_CC_v5.2.1]; 2235 [SRD]; 2237 [srd, SRD_CC_v5.2.1]; 2254 [SRD]; 2256 [srd, SRD_CC_v5.2.1]; 2273 [SRD]; 2275 [srd, SRD_CC_v5.2.1]; 2292 [SRD]; 2294 [srd, SRD_CC_v5.2.1]; 2311 [SRD]; 2313 [srd, SRD_CC_v5.2.1]; 2330 [SRD]; 2332 [srd, SRD_CC_v5.2.1]; 2349 [SRD]; 2351 [srd, SRD_CC_v5.2.1]; 2368 [SRD]; 2370 [srd, SRD_CC_v5.2.1]; 2387 [SRD]; 2389 [srd, SRD_CC_v5.2.1]; 2406 [SRD]; 2408 [srd, SRD_CC_v5.2.1]; 2425 [SRD]; 2427 [srd, SRD_CC_v5.2.1]; 2444 [SRD]; 2446 [srd, SRD_CC_v5.2.1]; 2463 [SRD]; 2465 [srd, SRD_CC_v5.2.1]; 2482 [SRD]; 2484 [srd, SRD_CC_v5.2.1]; 2501 [SRD]; 2503 [srd, SRD_CC_v5.2.1]; 2520 [SRD]; 2522 [srd, SRD_CC_v5.2.1]; 2539 [SRD]; 2541 [srd, SRD_CC_v5.2.1]; 2558 [SRD]; 2560 [srd, SRD_CC_v5.2.1]; 2577 [SRD]; 2579 [srd, SRD_CC_v5.2.1]; 2596 [SRD]; 2598 [srd, SRD_CC_v5.2.1]; 2615 [SRD]; 2617 [srd, SRD_CC_v5.2.1]; 2634 [SRD]; 2636 [srd, SRD_CC_v5.2.1]; 2653 [SRD]; 2655 [srd, SRD_CC_v5.2.1]; 2672 [SRD]; 2674 [srd, SRD_CC_v5.2.1]; 2691 [SRD]; 2693 [srd, SRD_CC_v5.2.1]; 2710 [SRD]; 2712 [srd, SRD_CC_v5.2.1]; 2729 [SRD]; 2731 [srd, SRD_CC_v5.2.1]; 2748 [SRD]; 2750 [srd, SRD_CC_v5.2.1]; 2767 [SRD]; 2769 [srd, SRD_CC_v5.2.1]; 2786 [SRD]; 2788 [srd, SRD_CC_v5.2.1]; 2805 [SRD]; 2807 [srd, SRD_CC_v5.2.1]; 2824 [SRD]; 2826 [srd, SRD_CC_v5.2.1]; 2843 [SRD]; 2845 [srd, SRD_CC_v5.2.1]; 5034 [SRD]; 5038 [srd, SRD_CC_v5.2.1]; 5062 [SRD]; 5066 [srd, SRD_CC_v5.2.1]; 5092 [SRD]; 5096 [srd, SRD_CC_v5.2.1]; 5120 [SRD]; 5124 [srd, SRD_CC_v5.2.1]; 5167 [SRD]; 5171 [srd, SRD_CC_v5.2.1]; 5216 [SRD]; 5220 [srd, SRD_CC_v5.2.1]; 5243 [SRD]; 5247 [srd, SRD_CC_v5.2.1]; 5289 [SRD]; 5293 [srd, SRD_CC_v5.2.1]; 7331 [SRD]; 7333 [srd, SRD_CC_v5.2.1]; 7346 [SRD]; 7348 [srd, SRD_CC_v5.2.1]; 7361 [SRD]; 7363 [srd, SRD_CC_v5.2.1]; 7376 [SRD]; 7378 [srd, SRD_CC_v5.2.1]; 7391 [SRD]; 7393 [srd, SRD_CC_v5.2.1]; 7406 [SRD]; 7408 [srd, SRD_CC_v5.2.1]; 7421 [SRD]; 7423 [srd, SRD_CC_v5.2.1]; 7436 [SRD]; 7438 [srd, SRD_CC_v5.2.1]; 7451 [SRD]; 7453 [srd, SRD_CC_v5.2.1]; 7466 [SRD]; 7468 [srd, SRD_CC_v5.2.1]; 7481 [SRD]; 7483 [srd, SRD_CC_v5.2.1]; 7496 [SRD]; 7498 [srd, SRD_CC_v5.2.1]; 7511 [SRD]; 7513 [srd, SRD_CC_v5.2.1]; 7526 [SRD]; 7528 [srd, SRD_CC_v5.2.1]; 7541 [SRD]; 7543 [srd, SRD_CC_v5.2.1]; 7556 [SRD]; 7558 [srd, SRD_CC_v5.2.1]; 7571 [SRD]; 7573 [srd, SRD_CC_v5.2.1]; 7684 [SRD]; 7686 [srd, SRD_CC_v5.2.1]; 7707 [SRD]; 7709 [srd, SRD_CC_v5.2.1]; 7731 [SRD]; 7733 [srd, SRD_CC_v5.2.1]; 7753 [SRD]; 7755 [srd, SRD_CC_v5.2.1]; 7774 [SRD]; 7776 [srd, SRD_CC_v5.2.1]; 7796 [SRD]; 7798 [srd, SRD_CC_v5.2.1]; 7817 [SRD]; 7819 [srd, SRD_CC_v5.2.1]; 7838 [SRD]; 7840 [srd, SRD_CC_v5.2.1]; 7860 [SRD]; 7862 [srd, SRD_CC_v5.2.1]; 7882 [SRD]; 7884 [srd, SRD_CC_v5.2.1]; 7904 [SRD]; 7906 [srd, SRD_CC_v5.2.1]; 7928 [SRD]; 7930 [srd, SRD_CC_v5.2.1]; 7950 [SRD]; 7952 [srd, SRD_CC_v5.2.1]; 7976 [SRD]; 7978 [srd, SRD_CC_v5.2.1]; 8000 [SRD]; 8002 [srd, SRD_CC_v5.2.1]; 8021 [SRD]; 8023 [srd, SRD_CC_v5.2.1]; 8043 [SRD]; 8045 [srd, SRD_CC_v5.2.1]; 8064 [SRD]; 8066 [srd, SRD_CC_v5.2.1]; 8088 [SRD]; 8090 [srd, SRD_CC_v5.2.1]; 8111 [SRD]; 8113 [srd, SRD_CC_v5.2.1]; 8132 [SRD]; 8134 [srd, SRD_CC_v5.2.1]; 8154 [SRD]; 8156 [srd, SRD_CC_v5.2.1]; 8177 [SRD]; 8179 [srd, SRD_CC_v5.2.1]; 8199 [SRD]; 8201 [srd, SRD_CC_v5.2.1]; 8222 [SRD]; 8224 [srd, SRD_CC_v5.2.1]; 8243 [SRD]; 8245 [srd, SRD_CC_v5.2.1]; 8265 [SRD]; 8267 [srd, SRD_CC_v5.2.1]; 8289 [SRD]; 8291 [srd, SRD_CC_v5.2.1]; 8311 [SRD]; 8313 [srd, SRD_CC_v5.2.1]; 8334 [SRD]; 8336 [srd, SRD_CC_v5.2.1]; 8357 [SRD]; 8359 [srd, SRD_CC_v5.2.1]; 8380 [SRD]; 8382 [srd, SRD_CC_v5.2.1]; 8404 [SRD]; 8406 [srd, SRD_CC_v5.2.1]; 8426 [SRD]; 8428 [srd, SRD_CC_v5.2.1]; 8449 [SRD]; 8451 [srd, SRD_CC_v5.2.1]; 8471 [SRD]; 8473 [srd, SRD_CC_v5.2.1]; 8492 [SRD]; 8494 [srd, SRD_CC_v5.2.1]; 8514 [SRD]; 8516 [srd, SRD_CC_v5.2.1]; 8536 [SRD]; 8538 [srd, SRD_CC_v5.2.1]; 8558 [SRD]; 8560 [srd, SRD_CC_v5.2.1]; 8579 [SRD]; 8581 [srd, SRD_CC_v5.2.1]; 8601 [SRD]; 8603 [srd, SRD_CC_v5.2.1]; 8624 [SRD]; 8626 [srd, SRD_CC_v5.2.1]; 8646 [SRD]; 8648 [srd, SRD_CC_v5.2.1]; 8670 [SRD]; 8672 [srd, SRD_CC_v5.2.1]; 8695 [SRD]; 8697 [srd, SRD_CC_v5.2.1]; 8717 [SRD]; 8719 [srd, SRD_CC_v5.2.1]; 8740 [SRD]; 8742 [srd, SRD_CC_v5.2.1]; 8761 [SRD]; 8763 [srd, SRD_CC_v5.2.1]; 8783 [SRD]; 8785 [srd, SRD_CC_v5.2.1]; 8807 [SRD]; 8809 [srd, SRD_CC_v5.2.1]; 8830 [SRD]; 8832 [srd, SRD_CC_v5.2.1]; 8853 [SRD]; 8855 [srd, SRD_CC_v5.2.1]; 8875 [SRD]; 8877 [srd, SRD_CC_v5.2.1]; 8897 [SRD]; 8899 [srd, SRD_CC_v5.2.1]; 8918 [SRD]; 8920 [srd, SRD_CC_v5.2.1]; 8941 [SRD]; 8943 [srd, SRD_CC_v5.2.1]; 8964 [SRD]; 8966 [srd, SRD_CC_v5.2.1]; 8986 [SRD]; 8988 [srd, SRD_CC_v5.2.1]; 9010 [SRD]; 9012 [srd, SRD_CC_v5.2.1]; 9032 [SRD]; 9034 [srd, SRD_CC_v5.2.1]; 9054 [SRD]; 9056 [srd, SRD_CC_v5.2.1]; 9076 [SRD]; 9078 [srd, SRD_CC_v5.2.1]; 9098 [SRD]; 9100 [srd, SRD_CC_v5.2.1]; 9119 [SRD]; 9121 [srd, SRD_CC_v5.2.1]; 9143 [SRD]; 9145 [srd, SRD_CC_v5.2.1]; 9165 [SRD]; 9167 [srd, SRD_CC_v5.2.1]; 9186 [SRD]; 9188 [srd, SRD_CC_v5.2.1]; 9207 [SRD]; 9209 [srd, SRD_CC_v5.2.1]; 9229 [SRD]; 9231 [srd, SRD_CC_v5.2.1]; 9250 [SRD]; 9252 [srd, SRD_CC_v5.2.1]; 9273 [SRD]; 9275 [srd, SRD_CC_v5.2.1]; 9296 [SRD]; 9298 [srd, SRD_CC_v5.2.1]; 9317 [SRD]; 9319 [srd, SRD_CC_v5.2.1]; 9339 [SRD]; 9341 [srd, SRD_CC_v5.2.1]; 9361 [SRD]; 9363 [srd, SRD_CC_v5.2.1]; 9382 [SRD]; 9384 [srd, SRD_CC_v5.2.1]; 9404 [SRD]; 9406 [srd, SRD_CC_v5.2.1]; 9426 [SRD]; 9428 [srd, SRD_CC_v5.2.1]; 9448 [SRD]; 9450 [srd, SRD_CC_v5.2.1]; 9469 [SRD]; 9471 [srd, SRD_CC_v5.2.1]; 9491 [SRD]; 9493 [srd, SRD_CC_v5.2.1]; 9512 [SRD]; 9514 [srd, SRD_CC_v5.2.1]; 9533 [SRD]; 9535 [srd, SRD_CC_v5.2.1]; 9554 [SRD]; 9556 [srd, SRD_CC_v5.2.1]; 9575 [SRD]; 9577 [srd, SRD_CC_v5.2.1]; 9596 [SRD]; 9598 [srd, SRD_CC_v5.2.1]; 9617 [SRD]; 9619 [srd, SRD_CC_v5.2.1]; 9640 [SRD]; 9642 [srd, SRD_CC_v5.2.1]; 9663 [SRD]; 9665 [srd, SRD_CC_v5.2.1]; 9684 [SRD]; 9686 [srd, SRD_CC_v5.2.1]; 9705 [SRD]; 9707 [srd, SRD_CC_v5.2.1]; 9726 [SRD]; 9728 [srd, SRD_CC_v5.2.1]; 9749 [SRD]; 9751 [srd, SRD_CC_v5.2.1]; 9771 [SRD]; 9773 [srd, SRD_CC_v5.2.1]; 9794 [SRD]; 9796 [srd, SRD_CC_v5.2.1]; 9815 [SRD]; 9817 [srd, SRD_CC_v5.2.1]; 9836 [SRD]; 9838 [srd, SRD_CC_v5.2.1]; 9858 [SRD]; 9860 [srd, SRD_CC_v5.2.1]; 9880 [SRD]; 9882 [srd, SRD_CC_v5.2.1]; 9902 [SRD]; 9904 [srd, SRD_CC_v5.2.1]; 9924 [SRD]; 9926 [srd, SRD_CC_v5.2.1]; 9945 [SRD]; 9947 [srd, SRD_CC_v5.2.1]; 9968 [SRD]; 9970 [srd, SRD_CC_v5.2.1]; 9990 [SRD]; 9992 [srd, SRD_CC_v5.2.1]; 10013 [SRD]; 10015 [srd, SRD_CC_v5.2.1]; 10034 [SRD]; 10036 [srd, SRD_CC_v5.2.1]; 10055 [SRD]; 10057 [srd, SRD_CC_v5.2.1]; 10076 [SRD]; 10078 [srd, SRD_CC_v5.2.1]; 10097 [SRD]; 10099 [srd, SRD_CC_v5.2.1]; 10118 [SRD]; 10120 [srd, SRD_CC_v5.2.1]; 10139 [SRD]; 10141 [srd, SRD_CC_v5.2.1]; 10160 [SRD]; 10162 [srd, SRD_CC_v5.2.1]; 10181 [SRD]; 10183 [srd, SRD_CC_v5.2.1]; 10205 [SRD]; 10207 [srd, SRD_CC_v5.2.1]; 10226 [SRD]; 10228 [srd, SRD_CC_v5.2.1]; 10248 [SRD]; 10250 [srd, SRD_CC_v5.2.1]; 10270 [SRD]; 10272 [srd, SRD_CC_v5.2.1]; 10291 [SRD]; 10293 [srd, SRD_CC_v5.2.1]; 10313 [SRD]; 10315 [srd, SRD_CC_v5.2.1]; 10337 [SRD]; 10339 [srd, SRD_CC_v5.2.1]; 10359 [SRD]; 10361 [srd, SRD_CC_v5.2.1]; 10380 [SRD]; 10382 [srd, SRD_CC_v5.2.1]; 10404 [SRD]; 10406 [srd, SRD_CC_v5.2.1]; 10427 [SRD]; 10429 [srd, SRD_CC_v5.2.1]; 10449 [SRD]; 10451 [srd, SRD_CC_v5.2.1]; 10470 [SRD]; 10472 [srd, SRD_CC_v5.2.1]; 10491 [SRD]; 10493 [srd, SRD_CC_v5.2.1]; 10514 [SRD]; 10516 [srd, SRD_CC_v5.2.1]; 10537 [SRD]; 10539 [srd, SRD_CC_v5.2.1]; 10558 [SRD]; 10560 [srd, SRD_CC_v5.2.1]; 10579 [SRD]; 10581 [srd, SRD_CC_v5.2.1]; 10600 [SRD]; 10602 [srd, SRD_CC_v5.2.1]; 10621 [SRD]; 10623 [srd, SRD_CC_v5.2.1]; 10643 [SRD]; 10645 [srd, SRD_CC_v5.2.1]; 10664 [SRD]; 10666 [srd, SRD_CC_v5.2.1]; 10685 [SRD]; 10687 [srd, SRD_CC_v5.2.1]; 10708 [SRD]; 10710 [srd, SRD_CC_v5.2.1]; 10729 [SRD]; 10731 [srd, SRD_CC_v5.2.1]; 10750 [SRD]; 10752 [srd, SRD_CC_v5.2.1]; 10772 [SRD]; 10774 [srd, SRD_CC_v5.2.1]; 10795 [SRD]; 10797 [srd, SRD_CC_v5.2.1]; 10816 [SRD]; 10818 [srd, SRD_CC_v5.2.1]; 10837 [SRD]; 10839 [srd, SRD_CC_v5.2.1]; 10859 [SRD]; 10861 [srd, SRD_CC_v5.2.1]; 10881 [SRD]; 10883 [srd, SRD_CC_v5.2.1]; 10903 [SRD]; 10905 [srd, SRD_CC_v5.2.1]; 10926 [SRD]; 10928 [srd, SRD_CC_v5.2.1]; 10948 [SRD]; 10950 [srd, SRD_CC_v5.2.1]; 10970 [SRD]; 10972 [srd, SRD_CC_v5.2.1]; 10993 [SRD]; 10995 [srd, SRD_CC_v5.2.1]; 11015 [SRD]; 11017 [srd, SRD_CC_v5.2.1]; 11038 [SRD]; 11040 [srd, SRD_CC_v5.2.1]; 11060 [SRD]; 11062 [srd, SRD_CC_v5.2.1]; 11082 [SRD]; 11084 [srd, SRD_CC_v5.2.1]; 11104 [SRD]; 11106 [srd, SRD_CC_v5.2.1]; 11125 [SRD]; 11127 [srd, SRD_CC_v5.2.1]; 11147 [SRD]; 11149 [srd, SRD_CC_v5.2.1]; 11169 [SRD]; 11171 [srd, SRD_CC_v5.2.1]; 11192 [SRD]; 11194 [srd, SRD_CC_v5.2.1]; 11214 [SRD]; 11216 [srd, SRD_CC_v5.2.1]; 11236 [SRD]; 11238 [srd, SRD_CC_v5.2.1]; 11258 [SRD]; 11260 [srd, SRD_CC_v5.2.1]; 11280 [SRD]; 11282 [srd, SRD_CC_v5.2.1]; 11302 [SRD]; 11304 [srd, SRD_CC_v5.2.1]; 11324 [SRD]; 11326 [srd, SRD_CC_v5.2.1]; 11346 [SRD]; 11348 [srd, SRD_CC_v5.2.1]; 11368 [SRD]; 11370 [srd, SRD_CC_v5.2.1]; 11391 [SRD]; 11393 [srd, SRD_CC_v5.2.1]; 11413 [SRD]; 11415 [srd, SRD_CC_v5.2.1]; 11435 [SRD]; 11437 [srd, SRD_CC_v5.2.1]; 11457 [SRD]; 11459 [srd, SRD_CC_v5.2.1]; 11479 [SRD]; 11481 [srd, SRD_CC_v5.2.1]; 11501 [SRD]; 11503 [srd, SRD_CC_v5.2.1]; 11523 [SRD]; 11525 [srd, SRD_CC_v5.2.1]; 11546 [SRD]; 11548 [srd, SRD_CC_v5.2.1]; 11568 [SRD]; 11570 [srd, SRD_CC_v5.2.1]; 11590 [SRD]; 11592 [srd, SRD_CC_v5.2.1]; 11612 [SRD]; 11614 [srd, SRD_CC_v5.2.1]; 11634 [SRD]; 11636 [srd, SRD_CC_v5.2.1]; 11656 [SRD]; 11658 [srd, SRD_CC_v5.2.1]; 11678 [SRD]; 11680 [srd, SRD_CC_v5.2.1]; 11699 [SRD]; 11701 [srd, SRD_CC_v5.2.1]; 11721 [SRD]; 11723 [srd, SRD_CC_v5.2.1]; 11743 [SRD]; 11745 [srd, SRD_CC_v5.2.1]; 11765 [SRD]; 11767 [srd, SRD_CC_v5.2.1]; 11787 [SRD]; 11789 [srd, SRD_CC_v5.2.1]; 11809 [SRD]; 11811 [srd, SRD_CC_v5.2.1]; 11831 [SRD]; 11833 [srd, SRD_CC_v5.2.1]; 11853 [SRD]; 11855 [srd, SRD_CC_v5.2.1]; 11875 [SRD]; 11877 [srd, SRD_CC_v5.2.1]; 11897 [SRD]; 11899 [srd, SRD_CC_v5.2.1]; 11919 [SRD]; 11921 [srd, SRD_CC_v5.2.1]; 11941 [SRD]; 11943 [srd, SRD_CC_v5.2.1]; 11963 [SRD]; 11965 [srd, SRD_CC_v5.2.1]; 11985 [SRD]; 11987 [srd, SRD_CC_v5.2.1]; 12007 [SRD]; 12009 [srd, SRD_CC_v5.2.1]; 12029 [SRD]; 12031 [srd, SRD_CC_v5.2.1]; 12051 [SRD]; 12053 [srd, SRD_CC_v5.2.1]; 12073 [SRD]; 12075 [srd, SRD_CC_v5.2.1]; 12095 [SRD]; 12097 [srd, SRD_CC_v5.2.1]; 12117 [SRD]; 12119 [srd, SRD_CC_v5.2.1]; 12139 [SRD]; 12141 [srd, SRD_CC_v5.2.1]; 12161 [SRD]; 12163 [srd, SRD_CC_v5.2.1]; 12183 [SRD]; 12185 [srd, SRD_CC_v5.2.1]; 12205 [SRD]; 12207 [srd, SRD_CC_v5.2.1]; 12227 [SRD]; 12229 [srd, SRD_CC_v5.2.1]; 12249 [SRD]; 12251 [srd, SRD_CC_v5.2.1]; 12271 [SRD]; 12273 [srd, SRD_CC_v5.2.1]; 12293 [SRD]; 12295 [srd, SRD_CC_v5.2.1]; 12315 [SRD]; 12317 [srd, SRD_CC_v5.2.1]; 12337 [SRD]; 12339 [srd, SRD_CC_v5.2.1]; 12359 [SRD]; 12361 [srd, SRD_CC_v5.2.1]; 12381 [SRD]; 12383 [srd, SRD_CC_v5.2.1]; 12403 [SRD]; 12405 [srd, SRD_CC_v5.2.1]; 12425 [SRD]; 12427 [srd, SRD_CC_v5.2.1]; 12447 [SRD]; 12449 [srd, SRD_CC_v5.2.1]; 12469 [SRD]; 12471 [srd, SRD_CC_v5.2.1]; 12491 [SRD]; 12493 [srd, SRD_CC_v5.2.1]; 12513 [SRD]; 12515 [srd, SRD_CC_v5.2.1]; 12535 [SRD]; 12537 [srd, SRD_CC_v5.2.1]; 12557 [SRD]; 12559 [srd, SRD_CC_v5.2.1]; 12579 [SRD]; 12581 [srd, SRD_CC_v5.2.1]; 12601 [SRD]; 12603 [srd, SRD_CC_v5.2.1]; 12623 [SRD]; 12625 [srd, SRD_CC_v5.2.1]; 12645 [SRD]; 12647 [srd, SRD_CC_v5.2.1]; 12667 [SRD]; 12669 [srd, SRD_CC_v5.2.1]; 12689 [SRD]; 12691 [srd, SRD_CC_v5.2.1]; 12711 [SRD]; 12713 [srd, SRD_CC_v5.2.1]; 12733 [SRD]; 12735 [srd, SRD_CC_v5.2.1]; 12755 [SRD]; 12757 [srd, SRD_CC_v5.2.1]; 12777 [SRD]; 12779 [srd, SRD_CC_v5.2.1]; 12799 [SRD]; 12801 [srd, SRD_CC_v5.2.1]; 12821 [SRD]; 12823 [srd, SRD_CC_v5.2.1]; 12843 [SRD]; 12845 [srd, SRD_CC_v5.2.1]; 12865 [SRD]; 12867 [srd, SRD_CC_v5.2.1]; 12887 [SRD]; 12889 [srd, SRD_CC_v5.2.1]; 12909 [SRD]; 12911 [srd, SRD_CC_v5.2.1]; 12931 [SRD]; 12933 [srd, SRD_CC_v5.2.1]; 12953 [SRD]; 12955 [srd, SRD_CC_v5.2.1]; 12975 [SRD]; 12977 [srd, SRD_CC_v5.2.1]; 12997 [SRD]; 12999 [srd, SRD_CC_v5.2.1]; 13019 [SRD]; 13021 [srd, SRD_CC_v5.2.1]; 13041 [SRD]; 13043 [srd, SRD_CC_v5.2.1]; 13063 [SRD]; 13065 [srd, SRD_CC_v5.2.1]; 13085 [SRD]; 13087 [srd, SRD_CC_v5.2.1]; 13107 [SRD]; 13109 [srd, SRD_CC_v5.2.1]; 13129 [SRD]; 13131 [srd, SRD_CC_v5.2.1]; 13151 [SRD]; 13153 [srd, SRD_CC_v5.2.1]; 13173 [SRD]; 13175 [srd, SRD_CC_v5.2.1]; 13195 [SRD]; 13197 [srd, SRD_CC_v5.2.1]; 13217 [SRD]; 13219 [srd, SRD_CC_v5.2.1]; 13238 [SRD]; 13240 [srd, SRD_CC_v5.2.1]; 13259 [SRD]; 13261 [srd, SRD_CC_v5.2.1]; 13280 [SRD]; 13282 [srd, SRD_CC_v5.2.1]; 13301 [SRD]; 13303 [srd, SRD_CC_v5.2.1]; 13322 [SRD]; 13324 [srd, SRD_CC_v5.2.1]; 13343 [SRD]; 13345 [srd, SRD_CC_v5.2.1]; 13364 [SRD]; 13366 [srd, SRD_CC_v5.2.1]; 13385 [SRD]; 13387 [srd, SRD_CC_v5.2.1]; 13406 [SRD]; 13408 [srd, SRD_CC_v5.2.1]; 13427 [SRD]; 13429 [srd, SRD_CC_v5.2.1]; 13448 [SRD]; 13450 [srd, SRD_CC_v5.2.1]; 13469 [SRD]; 13471 [srd, SRD_CC_v5.2.1]; 13490 [SRD]; 13492 [srd, SRD_CC_v5.2.1]; 13511 [SRD]; 13513 [srd, SRD_CC_v5.2.1]; 13532 [SRD]; 13534 [srd, SRD_CC_v5.2.1]; 13553 [SRD]; 13555 [srd, SRD_CC_v5.2.1]; 13574 [SRD]; 13576 [srd, SRD_CC_v5.2.1]; 13595 [SRD]; 13597 [srd, SRD_CC_v5.2.1]; 13616 [SRD]; 13618 [srd, SRD_CC_v5.2.1]; 13637 [SRD]; 13639 [srd, SRD_CC_v5.2.1]; 13658 [SRD]; 13660 [srd, SRD_CC_v5.2.1]; 13679 [SRD]; 13681 [srd, SRD_CC_v5.2.1]; 13700 [SRD]; 13702 [srd, SRD_CC_v5.2.1]; 13721 [SRD]; 13723 [srd, SRD_CC_v5.2.1]; 13742 [SRD]; 13744 [srd, SRD_CC_v5.2.1]; 13763 [SRD]; 13765 [srd, SRD_CC_v5.2.1]; 13784 [SRD]; 13786 [srd, SRD_CC_v5.2.1]; 13805 [SRD]; 13807 [srd, SRD_CC_v5.2.1]; 13826 [SRD]; 13828 [srd, SRD_CC_v5.2.1]; 13847 [SRD]; 13849 [srd, SRD_CC_v5.2.1]; 13868 [SRD]; 13870 [srd, SRD_CC_v5.2.1]; 13889 [SRD]; 13891 [srd, SRD_CC_v5.2.1]; 13910 [SRD]; 13912 [srd, SRD_CC_v5.2.1]; 13931 [SRD]; 13933 [srd, SRD_CC_v5.2.1]; 13952 [SRD]; 13954 [srd, SRD_CC_v5.2.1]; 13973 [SRD]; 13975 [srd, SRD_CC_v5.2.1]; 13994 [SRD]; 13996 [srd, SRD_CC_v5.2.1]; 14015 [SRD]; 14017 [srd, SRD_CC_v5.2.1]; 14036 [SRD]; 14038 [srd, SRD_CC_v5.2.1]; 14057 [SRD]; 14059 [srd, SRD_CC_v5.2.1]; 14078 [SRD]; 14080 [srd, SRD_CC_v5.2.1]; 14099 [SRD]; 14101 [srd, SRD_CC_v5.2.1]; 14120 [SRD]; 14122 [srd, SRD_CC_v5.2.1]; 14141 [SRD]; 14143 [srd, SRD_CC_v5.2.1]; 14162 [SRD]; 14164 [srd, SRD_CC_v5.2.1]; 14183 [SRD]; 14185 [srd, SRD_CC_v5.2.1]; 14204 [SRD]; 14206 [srd, SRD_CC_v5.2.1]; 14225 [SRD]; 14227 [srd, SRD_CC_v5.2.1]; 14246 [SRD]; 14248 [srd, SRD_CC_v5.2.1]; 14267 [SRD]; 14269 [srd, SRD_CC_v5.2.1]; 14288 [SRD]; 14290 [srd, SRD_CC_v5.2.1]; 14309 [SRD]; 14311 [srd, SRD_CC_v5.2.1]; 14330 [SRD]; 14332 [srd, SRD_CC_v5.2.1]; 14351 [SRD]; 14353 [srd, SRD_CC_v5.2.1]; 14372 [SRD]; 14374 [srd, SRD_CC_v5.2.1]; 14393 [SRD]; 14395 [srd, SRD_CC_v5.2.1]; 14414 [SRD]; 14416 [srd, SRD_CC_v5.2.1]; 14435 [SRD]; 14437 [srd, SRD_CC_v5.2.1]; 14456 [SRD]; 14458 [srd, SRD_CC_v5.2.1]
- src/modules/archipelago/system/rules2024/catalog.js — 1 [SRD 5.2.1, CC BY 4.0]; 3 [srd, SRD_CC_v5.2.1]; 413 [SRD 5.2.1]
- src/modules/archipelago/system/rules2024/engine.js — 39 [srd-5.2.1]; 62 [srd-5.2.1]
- src/modules/archipelago/system/rules2024/equipment.js — 1 [SRD 5.2.1]
- src/modules/archipelago/system/rules2024/healingSpells.js — 2 [SRD 5.2.1]
- src/modules/archipelago/system/rules2024/index.js — 63 [srd-5.2.1]
- src/modules/archipelago/system/rules2024/newPaths.js — 1 [SRD]
- src/modules/archipelago/system/rules2024/originalPaths.js — 1 [SRD]
- src/modules/archipelago/system/rules2024/sourceRules.json — 12 [SRD]; 14 [srd, SRD_CC_v5.2.1]; 29 [SRD]; 31 [srd, SRD_CC_v5.2.1]; 46 [SRD]; 48 [srd, SRD_CC_v5.2.1]; 63 [SRD]; 65 [srd, SRD_CC_v5.2.1]; 80 [SRD]; 82 [srd, SRD_CC_v5.2.1]; 97 [SRD]; 99 [srd, SRD_CC_v5.2.1]; 114 [SRD]; 116 [srd, SRD_CC_v5.2.1]; 131 [SRD]; 133 [srd, SRD_CC_v5.2.1]; 148 [SRD]; 150 [srd, SRD_CC_v5.2.1]; 165 [SRD]; 167 [srd, SRD_CC_v5.2.1]; 182 [SRD]; 184 [srd, SRD_CC_v5.2.1]; 199 [SRD]; 201 [srd, SRD_CC_v5.2.1]; 216 [SRD]; 218 [srd, SRD_CC_v5.2.1]; 233 [SRD]; 235 [srd, SRD_CC_v5.2.1]; 250 [SRD]; 252 [srd, SRD_CC_v5.2.1]; 267 [SRD]; 269 [srd, SRD_CC_v5.2.1]; 284 [SRD]; 286 [srd, SRD_CC_v5.2.1]; 301 [SRD]; 303 [srd, SRD_CC_v5.2.1]; 318 [SRD]; 320 [srd, SRD_CC_v5.2.1]; 335 [SRD]; 337 [srd, SRD_CC_v5.2.1]; 352 [SRD]; 354 [srd, SRD_CC_v5.2.1]; 369 [SRD]; 371 [srd, SRD_CC_v5.2.1]; 386 [SRD]; 388 [srd, SRD_CC_v5.2.1]; 403 [SRD]; 405 [srd, SRD_CC_v5.2.1]; 420 [SRD]; 422 [srd, SRD_CC_v5.2.1]; 437 [SRD]; 439 [srd, SRD_CC_v5.2.1]; 454 [SRD]; 456 [srd, SRD_CC_v5.2.1]; 471 [SRD]; 473 [srd, SRD_CC_v5.2.1]; 488 [SRD]; 490 [srd, SRD_CC_v5.2.1]; 505 [SRD]; 507 [srd, SRD_CC_v5.2.1]; 522 [SRD]; 524 [srd, SRD_CC_v5.2.1]; 539 [SRD]; 541 [srd, SRD_CC_v5.2.1]; 556 [SRD]; 558 [srd, SRD_CC_v5.2.1]; 573 [SRD]; 575 [srd, SRD_CC_v5.2.1]; 590 [SRD]; 592 [srd, SRD_CC_v5.2.1]; 607 [SRD]; 609 [srd, SRD_CC_v5.2.1]; 624 [SRD]; 626 [srd, SRD_CC_v5.2.1]; 641 [SRD]; 643 [srd, SRD_CC_v5.2.1]; 658 [SRD]; 660 [srd, SRD_CC_v5.2.1]; 675 [SRD]; 677 [srd, SRD_CC_v5.2.1]; 692 [SRD]; 694 [srd, SRD_CC_v5.2.1]; 709 [SRD]; 711 [srd, SRD_CC_v5.2.1]; 726 [SRD]; 728 [srd, SRD_CC_v5.2.1]; 743 [SRD]; 745 [srd, SRD_CC_v5.2.1]; 760 [SRD]; 762 [srd, SRD_CC_v5.2.1]; 777 [SRD]; 779 [srd, SRD_CC_v5.2.1]; 794 [SRD]; 796 [srd, SRD_CC_v5.2.1]; 811 [SRD]; 813 [srd, SRD_CC_v5.2.1]; 828 [SRD]; 830 [srd, SRD_CC_v5.2.1]; 845 [SRD]; 847 [srd, SRD_CC_v5.2.1]; 862 [SRD]; 864 [srd, SRD_CC_v5.2.1]; 879 [SRD]; 881 [srd, SRD_CC_v5.2.1]; 896 [SRD]; 898 [srd, SRD_CC_v5.2.1]; 913 [SRD]; 915 [srd, SRD_CC_v5.2.1]; 930 [SRD]; 932 [srd, SRD_CC_v5.2.1]; 947 [SRD]; 949 [srd, SRD_CC_v5.2.1]; 964 [SRD]; 966 [srd, SRD_CC_v5.2.1]; 981 [SRD]; 983 [srd, SRD_CC_v5.2.1]; 998 [SRD]; 1000 [srd, SRD_CC_v5.2.1]; 1015 [SRD]; 1017 [srd, SRD_CC_v5.2.1]; 1032 [SRD]; 1034 [srd, SRD_CC_v5.2.1]; 1049 [SRD]; 1051 [srd, SRD_CC_v5.2.1]; 1066 [SRD]; 1068 [srd, SRD_CC_v5.2.1]; 1083 [SRD]; 1085 [srd, SRD_CC_v5.2.1]; 1100 [SRD]; 1102 [srd, SRD_CC_v5.2.1]; 1117 [SRD]; 1119 [srd, SRD_CC_v5.2.1]; 1134 [SRD]; 1136 [srd, SRD_CC_v5.2.1]; 1151 [SRD]; 1153 [srd, SRD_CC_v5.2.1]; 1168 [SRD]; 1170 [srd, SRD_CC_v5.2.1]; 1185 [SRD]; 1187 [srd, SRD_CC_v5.2.1]; 1202 [SRD]; 1204 [srd, SRD_CC_v5.2.1]; 1219 [SRD]; 1221 [srd, SRD_CC_v5.2.1]; 1236 [SRD]; 1238 [srd, SRD_CC_v5.2.1]; 1253 [SRD]; 1255 [srd, SRD_CC_v5.2.1]; 1270 [SRD]; 1272 [srd, SRD_CC_v5.2.1]; 1287 [SRD]; 1289 [srd, SRD_CC_v5.2.1]; 1304 [SRD]; 1306 [srd, SRD_CC_v5.2.1]; 1321 [SRD]; 1323 [srd, SRD_CC_v5.2.1]; 1338 [SRD]; 1340 [srd, SRD_CC_v5.2.1]; 1355 [SRD]; 1357 [srd, SRD_CC_v5.2.1]; 1372 [SRD]; 1374 [srd, SRD_CC_v5.2.1]; 1389 [SRD]; 1391 [srd, SRD_CC_v5.2.1]; 1406 [SRD]; 1408 [srd, SRD_CC_v5.2.1]; 1423 [SRD]; 1425 [srd, SRD_CC_v5.2.1]; 1440 [SRD]; 1442 [srd, SRD_CC_v5.2.1]; 1457 [SRD]; 1459 [srd, SRD_CC_v5.2.1]; 1474 [SRD]; 1476 [srd, SRD_CC_v5.2.1]; 1491 [SRD]; 1493 [srd, SRD_CC_v5.2.1]; 1508 [SRD]; 1510 [srd, SRD_CC_v5.2.1]; 1525 [SRD]; 1527 [srd, SRD_CC_v5.2.1]; 1542 [SRD]; 1544 [srd, SRD_CC_v5.2.1]; 1559 [SRD]; 1561 [srd, SRD_CC_v5.2.1]; 1576 [SRD]; 1578 [srd, SRD_CC_v5.2.1]; 1593 [SRD]; 1595 [srd, SRD_CC_v5.2.1]; 1610 [SRD]; 1612 [srd, SRD_CC_v5.2.1]; 1627 [SRD]; 1629 [srd, SRD_CC_v5.2.1]; 1644 [SRD]; 1646 [srd, SRD_CC_v5.2.1]; 1661 [SRD]; 1663 [srd, SRD_CC_v5.2.1]; 1678 [SRD]; 1680 [srd, SRD_CC_v5.2.1]; 1695 [SRD]; 1697 [srd, SRD_CC_v5.2.1]; 1712 [SRD]; 1714 [srd, SRD_CC_v5.2.1]; 1729 [SRD]; 1731 [srd, SRD_CC_v5.2.1]; 1746 [SRD]; 1748 [srd, SRD_CC_v5.2.1]; 1763 [SRD]; 1765 [srd, SRD_CC_v5.2.1]; 1780 [SRD]; 1782 [srd, SRD_CC_v5.2.1]; 1797 [SRD]; 1799 [srd, SRD_CC_v5.2.1]; 1814 [SRD]; 1816 [srd, SRD_CC_v5.2.1]; 1831 [SRD]; 1833 [srd, SRD_CC_v5.2.1]; 1848 [SRD]; 1850 [srd, SRD_CC_v5.2.1]; 1865 [SRD]; 1867 [srd, SRD_CC_v5.2.1]; 1882 [SRD]; 1884 [srd, SRD_CC_v5.2.1]; 1899 [SRD]; 1901 [srd, SRD_CC_v5.2.1]; 1916 [SRD]; 1918 [srd, SRD_CC_v5.2.1]; 1933 [SRD]; 1935 [srd, SRD_CC_v5.2.1]; 1950 [SRD]; 1952 [srd, SRD_CC_v5.2.1]; 1967 [SRD]; 1969 [srd, SRD_CC_v5.2.1]; 1984 [SRD]; 1986 [srd, SRD_CC_v5.2.1]; 2001 [SRD]; 2003 [srd, SRD_CC_v5.2.1]; 2018 [SRD]; 2020 [srd, SRD_CC_v5.2.1]; 2035 [SRD]; 2037 [srd, SRD_CC_v5.2.1]; 2052 [SRD]; 2054 [srd, SRD_CC_v5.2.1]; 2069 [SRD]; 2071 [srd, SRD_CC_v5.2.1]; 2086 [SRD]; 2088 [srd, SRD_CC_v5.2.1]; 2103 [SRD]; 2105 [srd, SRD_CC_v5.2.1]; 2120 [SRD]; 2122 [srd, SRD_CC_v5.2.1]; 2137 [SRD]; 2139 [srd, SRD_CC_v5.2.1]; 2154 [SRD]; 2156 [srd, SRD_CC_v5.2.1]; 2171 [SRD]; 2173 [srd, SRD_CC_v5.2.1]; 2188 [SRD]; 2190 [srd, SRD_CC_v5.2.1]; 2205 [SRD]; 2207 [srd, SRD_CC_v5.2.1]; 2222 [SRD]; 2224 [srd, SRD_CC_v5.2.1]; 2239 [SRD]; 2241 [srd, SRD_CC_v5.2.1]; 2256 [SRD]; 2258 [srd, SRD_CC_v5.2.1]; 2273 [SRD]; 2275 [srd, SRD_CC_v5.2.1]; 2290 [SRD]; 2292 [srd, SRD_CC_v5.2.1]; 2307 [SRD]; 2309 [srd, SRD_CC_v5.2.1]; 2324 [SRD]; 2326 [srd, SRD_CC_v5.2.1]; 2341 [SRD]; 2343 [srd, SRD_CC_v5.2.1]; 2358 [SRD]; 2360 [srd, SRD_CC_v5.2.1]; 2375 [SRD]; 2377 [srd, SRD_CC_v5.2.1]; 2392 [SRD]; 2394 [srd, SRD_CC_v5.2.1]; 2409 [SRD]; 2411 [srd, SRD_CC_v5.2.1]; 2426 [SRD]; 2428 [srd, SRD_CC_v5.2.1]; 2443 [SRD]; 2445 [srd, SRD_CC_v5.2.1]; 2460 [SRD]; 2462 [srd, SRD_CC_v5.2.1]; 2477 [SRD]; 2479 [srd, SRD_CC_v5.2.1]; 2494 [SRD]; 2496 [srd, SRD_CC_v5.2.1]; 2511 [SRD]; 2513 [srd, SRD_CC_v5.2.1]; 2528 [SRD]; 2530 [srd, SRD_CC_v5.2.1]; 2545 [SRD]; 2547 [srd, SRD_CC_v5.2.1]; 2562 [SRD]; 2566 [srd, SRD_CC_v5.2.1]; 2590 [SRD]; 2594 [srd, SRD_CC_v5.2.1]; 2620 [SRD]; 2624 [srd, SRD_CC_v5.2.1]; 2648 [SRD]; 2652 [srd, SRD_CC_v5.2.1]; 2695 [SRD]; 2699 [srd, SRD_CC_v5.2.1]; 2744 [SRD]; 2748 [srd, SRD_CC_v5.2.1]; 2771 [SRD]; 2775 [srd, SRD_CC_v5.2.1]; 2817 [SRD]; 2821 [srd, SRD_CC_v5.2.1]; 2853 [SRD]; 2864 [SRD 5.2.1]; 2875 [SRD 5.2.1]; 2894 [SRD]; 2896 [srd, SRD_CC_v5.2.1]; 2909 [SRD]; 2911 [srd, SRD_CC_v5.2.1]; 2924 [SRD]; 2926 [srd, SRD_CC_v5.2.1]; 2939 [SRD]; 2941 [srd, SRD_CC_v5.2.1]; 2954 [SRD]; 2956 [srd, SRD_CC_v5.2.1]; 2969 [SRD]; 2971 [srd, SRD_CC_v5.2.1]; 2984 [SRD]; 2986 [srd, SRD_CC_v5.2.1]; 2999 [SRD]; 3001 [srd, SRD_CC_v5.2.1]; 3014 [SRD]; 3016 [srd, SRD_CC_v5.2.1]; 3029 [SRD]; 3031 [srd, SRD_CC_v5.2.1]; 3044 [SRD]; 3046 [srd, SRD_CC_v5.2.1]; 3059 [SRD]; 3061 [srd, SRD_CC_v5.2.1]; 3074 [SRD]; 3076 [srd, SRD_CC_v5.2.1]; 3089 [SRD]; 3091 [srd, SRD_CC_v5.2.1]; 3104 [SRD]; 3106 [srd, SRD_CC_v5.2.1]; 3119 [SRD]; 3121 [srd, SRD_CC_v5.2.1]; 3134 [SRD]; 3136 [srd, SRD_CC_v5.2.1]; 3155 [SRD]; 3157 [srd, SRD_CC_v5.2.1]; 3178 [SRD]; 3180 [srd, SRD_CC_v5.2.1]; 3201 [SRD]; 3203 [srd, SRD_CC_v5.2.1]; 3222 [SRD]; 3224 [srd, SRD_CC_v5.2.1]; 3243 [SRD]; 3245 [srd, SRD_CC_v5.2.1]; 3264 [SRD]; 3266 [srd, SRD_CC_v5.2.1]; 3285 [SRD]; 3287 [srd, SRD_CC_v5.2.1]; 3306 [SRD]; 3308 [srd, SRD_CC_v5.2.1]; 3328 [SRD]; 3330 [srd, SRD_CC_v5.2.1]; 3350 [SRD]; 3352 [srd, SRD_CC_v5.2.1]; 3371 [SRD]; 3373 [srd, SRD_CC_v5.2.1]; 3394 [SRD]; 3396 [srd, SRD_CC_v5.2.1]; 3416 [SRD]; 3418 [srd, SRD_CC_v5.2.1]; 3441 [SRD]; 3443 [srd, SRD_CC_v5.2.1]; 3464 [SRD]; 3466 [srd, SRD_CC_v5.2.1]; 3485 [SRD]; 3487 [srd, SRD_CC_v5.2.1]; 3506 [SRD]; 3508 [srd, SRD_CC_v5.2.1]; 3527 [SRD]; 3529 [srd, SRD_CC_v5.2.1]; 3550 [SRD]; 3552 [srd, SRD_CC_v5.2.1]; 3572 [SRD]; 3574 [srd, SRD_CC_v5.2.1]; 3593 [SRD]; 3595 [srd, SRD_CC_v5.2.1]; 3615 [SRD]; 3617 [srd, SRD_CC_v5.2.1]; 3638 [SRD]; 3640 [srd, SRD_CC_v5.2.1]; 3660 [SRD]; 3662 [srd, SRD_CC_v5.2.1]; 3683 [SRD]; 3685 [srd, SRD_CC_v5.2.1]; 3704 [SRD]; 3706 [srd, SRD_CC_v5.2.1]; 3726 [SRD]; 3728 [srd, SRD_CC_v5.2.1]; 3750 [SRD]; 3752 [srd, SRD_CC_v5.2.1]; 3772 [SRD]; 3774 [srd, SRD_CC_v5.2.1]; 3795 [SRD]; 3797 [srd, SRD_CC_v5.2.1]; 3818 [SRD]; 3820 [srd, SRD_CC_v5.2.1]; 3841 [SRD]; 3843 [srd, SRD_CC_v5.2.1]; 3865 [SRD]; 3867 [srd, SRD_CC_v5.2.1]; 3887 [SRD]; 3889 [srd, SRD_CC_v5.2.1]; 3910 [SRD]; 3912 [srd, SRD_CC_v5.2.1]; 3932 [SRD]; 3934 [srd, SRD_CC_v5.2.1]; 3953 [SRD]; 3955 [srd, SRD_CC_v5.2.1]; 3975 [SRD]; 3977 [srd, SRD_CC_v5.2.1]; 3997 [SRD]; 3999 [srd, SRD_CC_v5.2.1]; 4019 [SRD]; 4021 [srd, SRD_CC_v5.2.1]; 4040 [SRD]; 4042 [srd, SRD_CC_v5.2.1]; 4062 [SRD]; 4064 [srd, SRD_CC_v5.2.1]; 4085 [SRD]; 4087 [srd, SRD_CC_v5.2.1]; 4107 [SRD]; 4109 [srd, SRD_CC_v5.2.1]; 4131 [SRD]; 4133 [srd, SRD_CC_v5.2.1]; 4156 [SRD]; 4158 [srd, SRD_CC_v5.2.1]; 4178 [SRD]; 4180 [srd, SRD_CC_v5.2.1]; 4201 [SRD]; 4203 [srd, SRD_CC_v5.2.1]; 4222 [SRD]; 4224 [srd, SRD_CC_v5.2.1]; 4244 [SRD]; 4246 [srd, SRD_CC_v5.2.1]; 4268 [SRD]; 4270 [srd, SRD_CC_v5.2.1]; 4291 [SRD]; 4293 [srd, SRD_CC_v5.2.1]; 4314 [SRD]; 4316 [srd, SRD_CC_v5.2.1]; 4336 [SRD]; 4338 [srd, SRD_CC_v5.2.1]; 4358 [SRD]; 4360 [srd, SRD_CC_v5.2.1]; 4379 [SRD]; 4381 [srd, SRD_CC_v5.2.1]; 4402 [SRD]; 4404 [srd, SRD_CC_v5.2.1]; 4425 [SRD]; 4427 [srd, SRD_CC_v5.2.1]; 4447 [SRD]; 4449 [srd, SRD_CC_v5.2.1]; 4471 [SRD]; 4473 [srd, SRD_CC_v5.2.1]; 4493 [SRD]; 4495 [srd, SRD_CC_v5.2.1]; 4515 [SRD]; 4517 [srd, SRD_CC_v5.2.1]; 4537 [SRD]; 4539 [srd, SRD_CC_v5.2.1]; 4559 [SRD]; 4561 [srd, SRD_CC_v5.2.1]; 4580 [SRD]; 4582 [srd, SRD_CC_v5.2.1]; 4604 [SRD]; 4606 [srd, SRD_CC_v5.2.1]; 4626 [SRD]; 4628 [srd, SRD_CC_v5.2.1]; 4647 [SRD]; 4649 [srd, SRD_CC_v5.2.1]; 4668 [SRD]; 4670 [srd, SRD_CC_v5.2.1]; 4690 [SRD]; 4692 [srd, SRD_CC_v5.2.1]; 4711 [SRD]; 4713 [srd, SRD_CC_v5.2.1]; 4734 [SRD]; 4736 [srd, SRD_CC_v5.2.1]; 4757 [SRD]; 4759 [srd, SRD_CC_v5.2.1]; 4778 [SRD]; 4780 [srd, SRD_CC_v5.2.1]; 4800 [SRD]; 4802 [srd, SRD_CC_v5.2.1]; 4822 [SRD]; 4824 [srd, SRD_CC_v5.2.1]; 4843 [SRD]; 4845 [srd, SRD_CC_v5.2.1]; 4865 [SRD]; 4867 [srd, SRD_CC_v5.2.1]; 4887 [SRD]; 4889 [srd, SRD_CC_v5.2.1]; 4909 [SRD]; 4911 [srd, SRD_CC_v5.2.1]; 4930 [SRD]; 4932 [srd, SRD_CC_v5.2.1]; 4952 [SRD]; 4954 [srd, SRD_CC_v5.2.1]; 4973 [SRD]; 4975 [srd, SRD_CC_v5.2.1]; 4994 [SRD]; 4996 [srd, SRD_CC_v5.2.1]; 5015 [SRD]; 5017 [srd, SRD_CC_v5.2.1]; 5036 [SRD]; 5038 [srd, SRD_CC_v5.2.1]; 5057 [SRD]; 5059 [srd, SRD_CC_v5.2.1]; 5078 [SRD]; 5080 [srd, SRD_CC_v5.2.1]; 5101 [SRD]; 5103 [srd, SRD_CC_v5.2.1]; 5124 [SRD]; 5126 [srd, SRD_CC_v5.2.1]; 5145 [SRD]; 5147 [srd, SRD_CC_v5.2.1]; 5166 [SRD]; 5168 [srd, SRD_CC_v5.2.1]; 5187 [SRD]; 5189 [srd, SRD_CC_v5.2.1]; 5210 [SRD]; 5212 [srd, SRD_CC_v5.2.1]; 5232 [SRD]; 5234 [srd, SRD_CC_v5.2.1]; 5255 [SRD]; 5257 [srd, SRD_CC_v5.2.1]; 5276 [SRD]; 5278 [srd, SRD_CC_v5.2.1]; 5297 [SRD]; 5299 [srd, SRD_CC_v5.2.1]; 5319 [SRD]; 5321 [srd, SRD_CC_v5.2.1]; 5341 [SRD]; 5343 [srd, SRD_CC_v5.2.1]; 5363 [SRD]; 5365 [srd, SRD_CC_v5.2.1]; 5385 [SRD]; 5387 [srd, SRD_CC_v5.2.1]; 5406 [SRD]; 5408 [srd, SRD_CC_v5.2.1]; 5429 [SRD]; 5431 [srd, SRD_CC_v5.2.1]; 5451 [SRD]; 5453 [srd, SRD_CC_v5.2.1]; 5474 [SRD]; 5476 [srd, SRD_CC_v5.2.1]; 5495 [SRD]; 5497 [srd, SRD_CC_v5.2.1]; 5516 [SRD]; 5518 [srd, SRD_CC_v5.2.1]; 5537 [SRD]; 5539 [srd, SRD_CC_v5.2.1]; 5558 [SRD]; 5560 [srd, SRD_CC_v5.2.1]; 5579 [SRD]; 5581 [srd, SRD_CC_v5.2.1]; 5600 [SRD]; 5602 [srd, SRD_CC_v5.2.1]; 5621 [SRD]; 5623 [srd, SRD_CC_v5.2.1]; 5642 [SRD]; 5644 [srd, SRD_CC_v5.2.1]; 5666 [SRD]; 5668 [srd, SRD_CC_v5.2.1]; 5687 [SRD]; 5689 [srd, SRD_CC_v5.2.1]; 5709 [SRD]; 5711 [srd, SRD_CC_v5.2.1]; 5730 [SRD]; 5732 [srd, SRD_CC_v5.2.1]; 5751 [SRD]; 5753 [srd, SRD_CC_v5.2.1]; 5772 [SRD]; 5774 [srd, SRD_CC_v5.2.1]; 5795 [SRD]; 5797 [srd, SRD_CC_v5.2.1]; 5816 [SRD]; 5818 [srd, SRD_CC_v5.2.1]; 5837 [SRD]; 5839 [srd, SRD_CC_v5.2.1]; 5860 [SRD]; 5862 [srd, SRD_CC_v5.2.1]; 5882 [SRD]; 5884 [srd, SRD_CC_v5.2.1]; 5903 [SRD]; 5905 [srd, SRD_CC_v5.2.1]; 5924 [SRD]; 5926 [srd, SRD_CC_v5.2.1]; 5945 [SRD]; 5947 [srd, SRD_CC_v5.2.1]; 5968 [SRD]; 5970 [srd, SRD_CC_v5.2.1]; 5991 [SRD]; 5993 [srd, SRD_CC_v5.2.1]; 6012 [SRD]; 6014 [srd, SRD_CC_v5.2.1]; 6033 [SRD]; 6035 [srd, SRD_CC_v5.2.1]; 6054 [SRD]; 6056 [srd, SRD_CC_v5.2.1]; 6075 [SRD]; 6077 [srd, SRD_CC_v5.2.1]; 6097 [SRD]; 6099 [srd, SRD_CC_v5.2.1]; 6118 [SRD]; 6120 [srd, SRD_CC_v5.2.1]; 6139 [SRD]; 6141 [srd, SRD_CC_v5.2.1]; 6162 [SRD]; 6164 [srd, SRD_CC_v5.2.1]; 6183 [SRD]; 6185 [srd, SRD_CC_v5.2.1]; 6204 [SRD]; 6206 [srd, SRD_CC_v5.2.1]; 6226 [SRD]; 6228 [srd, SRD_CC_v5.2.1]; 6249 [SRD]; 6251 [srd, SRD_CC_v5.2.1]; 6270 [SRD]; 6272 [srd, SRD_CC_v5.2.1]; 6291 [SRD]; 6293 [srd, SRD_CC_v5.2.1]; 6313 [SRD]; 6315 [srd, SRD_CC_v5.2.1]; 6335 [SRD]; 6337 [srd, SRD_CC_v5.2.1]; 6357 [SRD]; 6359 [srd, SRD_CC_v5.2.1]; 6379 [SRD]; 6381 [srd, SRD_CC_v5.2.1]; 6401 [SRD]; 6403 [srd, SRD_CC_v5.2.1]; 6423 [SRD]; 6425 [srd, SRD_CC_v5.2.1]; 6445 [SRD]; 6447 [srd, SRD_CC_v5.2.1]; 6467 [SRD]; 6469 [srd, SRD_CC_v5.2.1]; 6489 [SRD]; 6491 [srd, SRD_CC_v5.2.1]; 6511 [SRD]; 6513 [srd, SRD_CC_v5.2.1]; 6533 [SRD]; 6535 [srd, SRD_CC_v5.2.1]; 6555 [SRD]; 6557 [srd, SRD_CC_v5.2.1]; 6576 [SRD]; 6578 [srd, SRD_CC_v5.2.1]; 6598 [SRD]; 6600 [srd, SRD_CC_v5.2.1]; 6620 [SRD]; 6622 [srd, SRD_CC_v5.2.1]; 6642 [SRD]; 6644 [srd, SRD_CC_v5.2.1]; 6664 [SRD]; 6666 [srd, SRD_CC_v5.2.1]; 6686 [SRD]; 6688 [srd, SRD_CC_v5.2.1]; 6708 [SRD]; 6710 [srd, SRD_CC_v5.2.1]; 6730 [SRD]; 6732 [srd, SRD_CC_v5.2.1]; 6752 [SRD]; 6754 [srd, SRD_CC_v5.2.1]; 6774 [SRD]; 6776 [srd, SRD_CC_v5.2.1]; 6796 [SRD]; 6798 [srd, SRD_CC_v5.2.1]; 6818 [SRD]; 6820 [srd, SRD_CC_v5.2.1]; 6840 [SRD]; 6842 [srd, SRD_CC_v5.2.1]; 6862 [SRD]; 6864 [srd, SRD_CC_v5.2.1]; 6884 [SRD]; 6886 [srd, SRD_CC_v5.2.1]; 6906 [SRD]; 6908 [srd, SRD_CC_v5.2.1]; 6928 [SRD]; 6930 [srd, SRD_CC_v5.2.1]; 6950 [SRD]; 6952 [srd, SRD_CC_v5.2.1]; 6972 [SRD]; 6974 [srd, SRD_CC_v5.2.1]; 6994 [SRD]; 6996 [srd, SRD_CC_v5.2.1]; 7016 [SRD]; 7018 [srd, SRD_CC_v5.2.1]; 7038 [SRD]; 7040 [srd, SRD_CC_v5.2.1]; 7060 [SRD]; 7062 [srd, SRD_CC_v5.2.1]; 7082 [SRD]; 7084 [srd, SRD_CC_v5.2.1]; 7104 [SRD]; 7106 [srd, SRD_CC_v5.2.1]; 7126 [SRD]; 7128 [srd, SRD_CC_v5.2.1]; 7147 [SRD]; 7149 [srd, SRD_CC_v5.2.1]; 7169 [SRD]; 7171 [srd, SRD_CC_v5.2.1]; 7191 [SRD]; 7193 [srd, SRD_CC_v5.2.1]; 7213 [SRD]; 7215 [srd, SRD_CC_v5.2.1]; 7235 [SRD]; 7237 [srd, SRD_CC_v5.2.1]; 7257 [SRD]; 7259 [srd, SRD_CC_v5.2.1]; 7279 [SRD]; 7281 [srd, SRD_CC_v5.2.1]; 7301 [SRD]; 7303 [srd, SRD_CC_v5.2.1]; 7323 [SRD]; 7325 [srd, SRD_CC_v5.2.1]; 7345 [SRD]; 7347 [srd, SRD_CC_v5.2.1]; 7367 [SRD]; 7369 [srd, SRD_CC_v5.2.1]; 7389 [SRD]; 7391 [srd, SRD_CC_v5.2.1]; 7411 [SRD]; 7413 [srd, SRD_CC_v5.2.1]; 7433 [SRD]; 7435 [srd, SRD_CC_v5.2.1]; 7455 [SRD]; 7457 [srd, SRD_CC_v5.2.1]; 7477 [SRD]; 7479 [srd, SRD_CC_v5.2.1]; 7499 [SRD]; 7501 [srd, SRD_CC_v5.2.1]; 7521 [SRD]; 7523 [srd, SRD_CC_v5.2.1]; 7543 [SRD]; 7545 [srd, SRD_CC_v5.2.1]; 7565 [SRD]; 7567 [srd, SRD_CC_v5.2.1]; 7587 [SRD]; 7589 [srd, SRD_CC_v5.2.1]; 7609 [SRD]; 7611 [srd, SRD_CC_v5.2.1]; 7631 [SRD]; 7633 [srd, SRD_CC_v5.2.1]; 7653 [SRD]; 7655 [srd, SRD_CC_v5.2.1]; 7675 [SRD]; 7677 [srd, SRD_CC_v5.2.1]; 7697 [SRD]; 7699 [srd, SRD_CC_v5.2.1]; 7719 [SRD]; 7721 [srd, SRD_CC_v5.2.1]; 7741 [SRD]; 7743 [srd, SRD_CC_v5.2.1]; 7763 [SRD]; 7765 [srd, SRD_CC_v5.2.1]; 7785 [SRD]; 7787 [srd, SRD_CC_v5.2.1]; 7807 [SRD]; 7809 [srd, SRD_CC_v5.2.1]; 7829 [SRD]; 7831 [srd, SRD_CC_v5.2.1]; 7851 [SRD]; 7853 [srd, SRD_CC_v5.2.1]; 7873 [SRD]; 7875 [srd, SRD_CC_v5.2.1]; 7895 [SRD]; 7897 [srd, SRD_CC_v5.2.1]; 7917 [SRD]; 7919 [srd, SRD_CC_v5.2.1]; 7939 [SRD]; 7941 [srd, SRD_CC_v5.2.1]; 7961 [SRD]; 7963 [srd, SRD_CC_v5.2.1]; 7983 [SRD]; 7985 [srd, SRD_CC_v5.2.1]; 8005 [SRD]; 8007 [srd, SRD_CC_v5.2.1]; 8027 [SRD]; 8029 [srd, SRD_CC_v5.2.1]; 8049 [SRD]; 8051 [srd, SRD_CC_v5.2.1]; 8071 [SRD]; 8073 [srd, SRD_CC_v5.2.1]; 8093 [SRD]; 8095 [srd, SRD_CC_v5.2.1]; 8115 [SRD]; 8117 [srd, SRD_CC_v5.2.1]; 8137 [SRD]; 8139 [srd, SRD_CC_v5.2.1]; 8159 [SRD]; 8161 [srd, SRD_CC_v5.2.1]; 8181 [SRD]; 8183 [srd, SRD_CC_v5.2.1]; 8203 [SRD]; 8205 [srd, SRD_CC_v5.2.1]; 8225 [SRD]; 8227 [srd, SRD_CC_v5.2.1]; 8247 [SRD]; 8249 [srd, SRD_CC_v5.2.1]; 8269 [SRD]; 8271 [srd, SRD_CC_v5.2.1]; 8291 [SRD]; 8293 [srd, SRD_CC_v5.2.1]; 8313 [SRD]; 8315 [srd, SRD_CC_v5.2.1]; 8335 [SRD]; 8337 [srd, SRD_CC_v5.2.1]; 8357 [SRD]; 8359 [srd, SRD_CC_v5.2.1]; 8379 [SRD]; 8381 [srd, SRD_CC_v5.2.1]; 8401 [SRD]; 8403 [srd, SRD_CC_v5.2.1]; 8423 [SRD]; 8425 [srd, SRD_CC_v5.2.1]; 8445 [SRD]; 8447 [srd, SRD_CC_v5.2.1]; 8467 [SRD]; 8469 [srd, SRD_CC_v5.2.1]; 8489 [SRD]; 8491 [srd, SRD_CC_v5.2.1]; 8511 [SRD]; 8513 [srd, SRD_CC_v5.2.1]; 8533 [SRD]; 8535 [srd, SRD_CC_v5.2.1]; 8555 [SRD]; 8557 [srd, SRD_CC_v5.2.1]; 8577 [SRD]; 8579 [srd, SRD_CC_v5.2.1]; 8599 [SRD]; 8601 [srd, SRD_CC_v5.2.1]; 8621 [SRD]; 8623 [srd, SRD_CC_v5.2.1]; 8643 [SRD]; 8645 [srd, SRD_CC_v5.2.1]; 8665 [SRD]; 8667 [srd, SRD_CC_v5.2.1]; 8686 [SRD]; 8688 [srd, SRD_CC_v5.2.1]; 8707 [SRD]; 8709 [srd, SRD_CC_v5.2.1]; 8728 [SRD]; 8730 [srd, SRD_CC_v5.2.1]; 8749 [SRD]; 8751 [srd, SRD_CC_v5.2.1]; 8770 [SRD]; 8772 [srd, SRD_CC_v5.2.1]; 8791 [SRD]; 8793 [srd, SRD_CC_v5.2.1]; 8812 [SRD]; 8814 [srd, SRD_CC_v5.2.1]; 8833 [SRD]; 8835 [srd, SRD_CC_v5.2.1]; 8854 [SRD]; 8856 [srd, SRD_CC_v5.2.1]; 8875 [SRD]; 8877 [srd, SRD_CC_v5.2.1]; 8896 [SRD]; 8898 [srd, SRD_CC_v5.2.1]; 8917 [SRD]; 8919 [srd, SRD_CC_v5.2.1]; 8938 [SRD]; 8940 [srd, SRD_CC_v5.2.1]; 8959 [SRD]; 8961 [srd, SRD_CC_v5.2.1]; 8980 [SRD]; 8982 [srd, SRD_CC_v5.2.1]; 9001 [SRD]; 9003 [srd, SRD_CC_v5.2.1]; 9022 [SRD]; 9024 [srd, SRD_CC_v5.2.1]; 9043 [SRD]; 9045 [srd, SRD_CC_v5.2.1]; 9064 [SRD]; 9066 [srd, SRD_CC_v5.2.1]; 9085 [SRD]; 9087 [srd, SRD_CC_v5.2.1]; 9106 [SRD]; 9108 [srd, SRD_CC_v5.2.1]; 9127 [SRD]; 9129 [srd, SRD_CC_v5.2.1]; 9148 [SRD]; 9150 [srd, SRD_CC_v5.2.1]; 9169 [SRD]; 9171 [srd, SRD_CC_v5.2.1]; 9190 [SRD]; 9192 [srd, SRD_CC_v5.2.1]; 9211 [SRD]; 9213 [srd, SRD_CC_v5.2.1]; 9232 [SRD]; 9234 [srd, SRD_CC_v5.2.1]; 9253 [SRD]; 9255 [srd, SRD_CC_v5.2.1]; 9274 [SRD]; 9276 [srd, SRD_CC_v5.2.1]; 9295 [SRD]; 9297 [srd, SRD_CC_v5.2.1]; 9316 [SRD]; 9318 [srd, SRD_CC_v5.2.1]; 9337 [SRD]; 9339 [srd, SRD_CC_v5.2.1]; 9358 [SRD]; 9360 [srd, SRD_CC_v5.2.1]; 9379 [SRD]; 9381 [srd, SRD_CC_v5.2.1]; 9400 [SRD]; 9402 [srd, SRD_CC_v5.2.1]; 9421 [SRD]; 9423 [srd, SRD_CC_v5.2.1]; 9442 [SRD]; 9444 [srd, SRD_CC_v5.2.1]; 9463 [SRD]; 9465 [srd, SRD_CC_v5.2.1]; 9484 [SRD]; 9486 [srd, SRD_CC_v5.2.1]; 9505 [SRD]; 9507 [srd, SRD_CC_v5.2.1]; 9526 [SRD]; 9528 [srd, SRD_CC_v5.2.1]; 9547 [SRD]; 9549 [srd, SRD_CC_v5.2.1]; 9568 [SRD]; 9570 [srd, SRD_CC_v5.2.1]; 9589 [SRD]; 9591 [srd, SRD_CC_v5.2.1]; 9610 [SRD]; 9612 [srd, SRD_CC_v5.2.1]; 9631 [SRD]; 9633 [srd, SRD_CC_v5.2.1]; 9652 [SRD]; 9654 [srd, SRD_CC_v5.2.1]; 9673 [SRD]; 9675 [srd, SRD_CC_v5.2.1]; 9694 [SRD]; 9696 [srd, SRD_CC_v5.2.1]; 9715 [SRD]; 9717 [srd, SRD_CC_v5.2.1]; 9736 [SRD]; 9738 [srd, SRD_CC_v5.2.1]; 9757 [SRD]; 9759 [srd, SRD_CC_v5.2.1]; 9778 [SRD]; 9780 [srd, SRD_CC_v5.2.1]; 9799 [SRD]; 9801 [srd, SRD_CC_v5.2.1]; 9820 [SRD]; 9822 [srd, SRD_CC_v5.2.1]; 9841 [SRD]; 9843 [srd, SRD_CC_v5.2.1]; 9862 [SRD]; 9864 [srd, SRD_CC_v5.2.1]; 9883 [SRD]; 9885 [srd, SRD_CC_v5.2.1]; 9904 [SRD]; 9906 [srd, SRD_CC_v5.2.1]
- src/modules/archipelago/system/rules2024/spellProfiles.js — 1 [SRD 5.2.1]
- tests/characterCombat.test.mjs — 1 [rules2024]
- tests/equipment.test.mjs — 1 [rules2024]; 49 [SRD table]; 353 [SRD Guard]
- tests/equipmentIntegration.test.mjs — 7 [rules2024]; 9 [rules2024]
- tests/equipmentProperties.test.mjs — 1 [rules2024]; 74 [SRD ranged]
- tests/helpers/phase2.mjs — 3 [rules2024]; 33 [srd-5.2.1]; 34 [rules2024]
- tests/helpers/rules2024.mjs — 3 [rules2024]; 10 [srd-5.2.1]
- tests/phase2.acceptance-numbers.test.mjs — 7 [rules2024]
- tests/phase2.authority.test.mjs — 5 [rules2024]; 46 [rules2024]
- tests/phase2.caster-paths.test.mjs — 5 [rules2024]
- tests/phase2.casting-components.test.mjs — 5 [rules2024]
- tests/phase2.conduit.test.mjs — 5 [rules2024]
- tests/phase2.covenant.test.mjs — 24 [rules2024]
- tests/phase2.creation-idempotency.test.mjs — 5 [rules2024]
- tests/phase2.creation-purchases.test.mjs — 5 [rules2024]
- tests/phase2.doctor-targets.test.mjs — 60 [rules2024]; 63 [rules2024]; 75 [rules2024]; 139 [rules2024]
- tests/phase2.feats.test.mjs — 90 [rules2024]
- tests/phase2.folio.test.mjs — 5 [rules2024]
- tests/phase2.gear-catalog.test.mjs — 21 [rules2024]; 28 [rules2024]
- tests/phase2.identity.test.mjs — 5 [rules2024]
- tests/phase2.materials.test.mjs — 5 [rules2024]
- tests/phase2.metamagic.test.mjs — 5 [rules2024]; 22 [rules2024]; 64 [rules2024]; 84 [rules2024]
- tests/phase2.overchannel.test.mjs — 5 [rules2024]
- tests/phase2.preparations.test.mjs — 31 [rules2024]; 65 [rules2024]
- tests/phase2.rebuild.test.mjs — 33 [rules2024]
- tests/phase2.shared-contracts.test.mjs — 43 [rules-2024]; 61 [rules-2024]
- tests/phase2.test.mjs — 37 [srd-5.2.1]
- tests/phase2.utility.test.mjs — 29 [rules2024]
- tests/rules2024.completion.test.mjs — 4 [rules2024]; 6 [rules2024]
- tests/rules2024.http.test.mjs — 21 [rules-2024]; 36 [srd-5.2.1]; 110 [rules-2024]
- tests/rules2024.persistence.test.mjs — 5 [rules2024]; 6 [rules2024]; 9 [srd-5.2.1]
- tests/rules2024.resources.test.mjs — 3 [rules2024]
- tests/rules2024.test.mjs — 5 [rules2024]; 76 [srd-5.2.1]; 273 [SRD]

### Training and legacy terminology

303 matching lines in 52 files. See the audit for classification and disposition.

- docs/attribute-modifiers.md — 3 [proficiency]
- docs/equipment-foundation.md — 32 [Proficiency]; 94 [Proficiencies]
- docs/progression-foundation.md — 3 [Proficiency]; 7 [proficiency]; 9 [proficiencies]; 19 [proficiency]; 21 [proficiency]; 23 [Proficiencies]
- docs/progression-v2-implementation.md — 9 [subclass]; 23 [Expertise]; 35 [Expertise]; 89 [Expertise, expertise]; 91 [subclass]; 94 [expertise, Expertise]; 97 [subclass]; 101 [subclass]; 105 [subclass]; 116 [subclass]; 120 [subclass]; 123 [subclass]; 128 [subclass]; 131 [subclass]; 140 [expertise]; 141 [subclass]; 145 [subclass]; 147 [Expertise, expertise]; 149 [subclass]; 153 [subclass]; 166 [subclass]; 169 [subclass]; 177 [subclass]; 181 [subclass]; 191 [subclass]; 195 [subclass]; 203 [subclass]; 208 [subclass]; 216 [subclass]; 219 [subclass]; 223 [subclass]; 227 [subclass]; 237 [Expertise]; 253 [expertise, Expertise]; 268 [expertise, Expertise]; 269 [expertise, Expertise]; 270 [expertise, Expertise]; 271 [expertise, Expertise]; 272 [expertise, Expertise]; 273 [expertise, Expertise]; 274 [expertise, Expertise]; 275 [expertise, Expertise]; 276 [expertise, Expertise]; 277 [expertise, Expertise]; 278 [expertise, Expertise]; 279 [expertise, Expertise]; 280 [expertise, Expertise]; 281 [expertise, Expertise]; 282 [expertise, Expertise]; 283 [expertise, Expertise]; 284 [expertise, Expertise]; 285 [expertise, Expertise]; 286 [expertise, Expertise]; 287 [expertise, Expertise]; 311 [expertise, Expertise]; 318 [expertise, Expertise]; 319 [expertise, Expertise]; 320 [expertise, Expertise]; 321 [expertise, Expertise]; 322 [expertise, Expertise]; 323 [expertise, Expertise]; 324 [expertise, Expertise]; 325 [expertise, Expertise]; 326 [expertise, Expertise]; 327 [expertise, Expertise]; 328 [expertise, Expertise]; 329 [expertise, Expertise]; 330 [expertise, Expertise]; 331 [expertise, Expertise]; 332 [expertise, Expertise]; 333 [expertise, Expertise]; 334 [expertise, Expertise]; 335 [expertise, Expertise]; 336 [expertise, Expertise]; 337 [expertise, Expertise]; 399 [Expertise]; 478 [Expertise]
- docs/rules2024-stage.md — 20 [subclasses]; 24 [Expertise]; 25 [Expertise]
- docs/training.md — 9 [proficiencies, Expertise]; 15 [proficiency, Proficiency, Expertise]
- phase2-final-tests.tmp — 9 [proficiency]; 10 [proficiency]; 2523 [Expertise]; 2524 [Expertise]
- phase2-push-tests.tmp — 9 [proficiency]; 10 [proficiency]; 2523 [Expertise]; 2524 [Expertise]
- src/modules/archipelago/combat/attack.js — 2 [proficiencyBonus]; 27 [proficiency]; 30 [proficiencyBonus]; 42 [proficiency]; 74 [proficiency]
- src/modules/archipelago/combat/snapshot.js — 2 [proficiencyBonus]; 31 [proficiencyBonus]; 98 [expertise]
- src/modules/archipelago/equipment/index.js — 3 [weaponTrained]; 5 [proficiencyBonus]; 178 [weaponTrained]; 212 [proficiencyBonus]
- src/modules/archipelago/equipment/training.js — 18 [weaponTrained]; 32 [weaponTrained]
- src/modules/archipelago/equipment/utilization.js — 46 [trainingBonus]
- src/modules/archipelago/system/rules2024/NOTICE.md — 3 [subclass, proficiency]
- src/modules/archipelago/system/rules2024/abilityOperations.js — 118 [trainingBonus]; 157 [trainingBonus]; 160 [trainingBonus]; 168 [trainingBonus]; 171 [trainingBonus]; 175 [trainingBonus]; 180 [trainingBonus]; 185 [trainingBonus]; 396 [trainingBonus]; 433 [trainingBonus]; 478 [trainingBonus]; 488 [trainingBonus]; 489 [trainingBonus]
- src/modules/archipelago/system/rules2024/agilityChecks.js — 13 [trainingBonus]
- src/modules/archipelago/system/rules2024/canonicalRules.json — 1188 [Expertise]; 1277 [expertise]; 1281 [Expertise]; 1282 [Expertise]; 1283 [Expertise]; 1429 [expertise]; 1433 [Expertise]; 1434 [Expertise]; 1435 [Expertise]; 1986 [Expertise]; 2878 [Expertise]; 3004 [Expertise]; 3130 [Expertise]; 3234 [Expertise]; 3540 [Expertise]; 3556 [Expertise]; 3574 [Expertise]; 3592 [Expertise]; 3618 [Expertise]; 3644 [Expertise]; 3940 [Expertise]; 5036 [classId]; 5037 [subclassId]; 5064 [classId]; 5065 [subclassId]; 5094 [classId]; 5095 [subclassId]; 5122 [classId]; 5123 [subclassId]; 5169 [classId]; 5170 [subclassId]; 5218 [classId]; 5219 [subclassId]; 5245 [classId]; 5246 [subclassId]; 5291 [classId]; 5292 [subclassId]; 5380 [Expertise]; 5496 [Expertise]; 5590 [Expertise]; 5888 [Expertise]; 6282 [Expertise]
- src/modules/archipelago/system/rules2024/casterPathOperations.js — 24 [trainingBonus]
- src/modules/archipelago/system/rules2024/catalog.js — 49 [classId]; 71 [classId]; 92 [classId]; 115 [classId]; 133 [classId]; 156 [classId]; 177 [classId]; 200 [classId]; 220 [Expertise]; 225 [Expertise]; 272 [Expertise]
- src/modules/archipelago/system/rules2024/conduitOperations.js — 19 [trainingBonus]
- src/modules/archipelago/system/rules2024/corsairOperations.js — 45 [trainingBonus]
- src/modules/archipelago/system/rules2024/engine.js — 75 [expertise]; 112 [expertise]; 227 [expertise]; 231 [expertise]; 232 [expertise]; 235 [expertise]; 249 [expertise]; 320 [expertise]; 337 [expertise]; 611 [trainingBonus]; 635 [trainingBonus]; 636 [trainingBonus]; 683 [trainingBonus]; 684 [trainingBonus]; 685 [trainingBonus]; 692 [trainingBonus]; 695 [expertise, trainingBonus]; 696 [trainingBonus]; 699 [trainingBonus]; 702 [expertise]; 722 [Expertise]; 734 [trainingBonus]; 743 [trainingBonus]
- src/modules/archipelago/system/rules2024/featOperations.js — 93 [trainingBonus]; 99 [trainingBonus]
- src/modules/archipelago/system/rules2024/featureOperations.js — 20 [trainingBonus]
- src/modules/archipelago/system/rules2024/newPaths.js — 1 [subclasses]; 7 [Expertise]; 14 [Expertise]; 36 [Expertise]; 66 [Expertise]
- src/modules/archipelago/system/rules2024/originalPaths.js — 1 [subclass, subclasses]; 9 [Expertise]; 26 [Expertise]
- src/modules/archipelago/system/rules2024/progression.js — 59 [expertise]; 101 [expertise]
- src/modules/archipelago/system/rules2024/selections.js — 75 [expertise, trainingBonus]; 98 [trainingBonus]
- src/modules/archipelago/system/rules2024/sourceRules.json — 1064 [Expertise]; 1143 [expertise]; 1147 [Expertise]; 1148 [Expertise]; 1149 [Expertise]; 1279 [expertise]; 1283 [Expertise]; 1284 [Expertise]; 1285 [Expertise]; 1778 [Expertise]; 2564 [classId]; 2565 [subclassId]; 2592 [classId]; 2593 [subclassId]; 2622 [classId]; 2623 [subclassId]; 2650 [classId]; 2651 [subclassId]; 2697 [classId]; 2698 [subclassId]; 2746 [classId]; 2747 [subclassId]; 2773 [classId]; 2774 [subclassId]; 2819 [classId]; 2820 [subclassId]; 2853 [subclass]; 2864 [subclass]; 2875 [subclass]
- src/modules/archipelago/system/rules2024/strikeOperations.js — 57 [trainingBonus]
- src/modules/archipelago/system/rules2024/toolChecks.js — 15 [toolTrained]; 16 [expertise, Expertise]; 23 [expertise, toolTrained, trainingBonus]; 25 [toolTrained]; 28 [toolTrained]; 30 [toolTrained, expertise]
- src/modules/archipelago/system/rules2024/vitality.js — 36 [trainingBonus]
- src/modules/archipelago/system/trainingChecks.js — 1 [proficiencyBonus]; 6 [trainingCheckModifier]; 12 [expertise]; 23 [proficiencyBonus]; 27 [expertise]; 31 [proficiencyBonus, trainingCheckModifier]
- tests/characterCombat.test.mjs — 71 [proficiency]; 78 [proficiency]; 94 [proficiency]; 233 [Proficiency]; 237 [Proficiency]
- tests/combat.test.mjs — 24 [proficiency]; 33 [proficiency]
- tests/equipment.test.mjs — 10 [weaponTrained]; 458 [weaponTrained]; 460 [weaponTrained]; 566 [proficiency]
- tests/phase2.acceptance-numbers.test.mjs — 82 [Expertise]; 89 [expertise]
- tests/phase2.caster-paths.test.mjs — 18 [trainingBonus]
- tests/phase2.cinder.test.mjs — 19 [trainingBonus]
- tests/phase2.conduit.test.mjs — 13 [trainingBonus]; 17 [trainingBonus]
- tests/phase2.corsair-paths.test.mjs — 27 [trainingBonus]; 58 [trainingBonus]
- tests/phase2.feats.test.mjs — 80 [trainingBonus]; 84 [trainingBonus]
- tests/phase2.gunslinger-paths.test.mjs — 18 [trainingBonus]
- tests/phase2.reaver-paths.test.mjs — 26 [trainingBonus]; 30 [trainingBonus]
- tests/phase2.remaining-path-clauses.test.mjs — 32 [trainingBonus]; 46 [trainingBonus]
- tests/phase2.strikes.test.mjs — 14 [trainingBonus]
- tests/phase2.test.mjs — 42 [trainingBonus]
- tests/phase2.tool-checks.test.mjs — 8 [toolTrained, trainingBonus]; 10 [Expertise]; 11 [expertise, trainingBonus]; 14 [toolTrained]; 18 [trainingBonus]
- tests/phase2.utility.test.mjs — 21 [trainingBonus]
- tests/phase2.warden-paths.test.mjs — 50 [trainingBonus]
- tests/rules2024.resources.test.mjs — 38 [Expertise]
- tests/rules2024.test.mjs — 141 [trainingBonus]

### Retired systems and compatibility

25 matching lines in 10 files. See the audit for classification and disposition.

- docs/attribute-modifiers.md — 7 [Core Checks]
- docs/historical-specialty-effects.md — 1 [Specialty]
- docs/progression-foundation.md — 9 [Legacy]; 17 [legacy]; 25 [Compatibility]; 27 [legacy, Legacy]; 29 [legacy]; 33 [legacy]; 37 [legacy]
- docs/progression-v2-implementation.md — 409 [Legacy]; 429 [Legacy]; 452 [Legacy]; 460 [Legacy]
- docs/rules2024-stage.md — 34 [Legacy]; 36 [compatibility]; 38 [Legacy, compatibility]
- docs/training.md — 5 [Core Check, Specialty]; 9 [Core Points, Specialty]; 25 [Core Check]; 29 [Specialty]; 31 [specialty]
- src/modules/archipelago/characters/controller.js — 8 [requiresRecreation]
- src/modules/archipelago/system/blueprints/characters/origins.js — 310 [Legacy]
- src/modules/archipelago/system/rules2024/canonicalRules.json — 2968 [specialty]
- src/modules/archipelago/system/rules2024/originalPaths.js — 19 [specialty]

