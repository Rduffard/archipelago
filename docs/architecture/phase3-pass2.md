# Phase 3, Pass 2 · Catalog and equipment boundaries

Pass 2 separated catalog reads, inventory validation, Training inputs, and loadout calculation from character replay and feature dispatch. The largest backend import cycle went from **34 files to 10**. The catalog hash, quoted ETag, character fixtures, and practice event fields matched the pre-split behavior.

## Dependency graph

Run `node scripts/archipelago-dependencies.cjs` from the backend to reproduce the Archipelago graph, or pass `src` to scan the whole backend. The scanner resolves literal relative JavaScript imports, including calls inside functions, and records line numbers. The module-scope view is lexical. A function-local require may still execute at initialization, for example when the catalog invokes its validation function. The separate catalog test checks actual CommonJS initialization using the module cache.

| Scope | Before | After |
| --- | --- | --- |
| Archipelago, including function-local imports | One component, 34 files | One component, 10 files |
| Archipelago, module-scope imports only | No cycles | No cycles |
| Entire backend, including function-local imports | The audit identified the Archipelago component | One component, the same 10 files |
| Engine package source | One point-buy-to-attributes edge | Same edge, no cycles |

The original audit describes 33 files. Its [source evidence](phase3-source-evidence.md) enumerates 34 paths, and the pre-change AST scan reproduced that exact membership. The import graph includes calls such as equipment replay, folio replay, spell-material spending, and feature handlers that were deferred until execution. Before the split, the registry loaded operation modules during initialization to get metadata, while feature execution and equipment derivation reached back into the registry. The gear catalog also imported spell-material spending to obtain its item rows. The catalog and inventory tests now start without loading any replay, feature execution, or command module.

### Removed edges in the original component

In this table, `R` is `system/rules2024`, `E` is `equipment`, and `G` is `system/blueprints/equipment`. Each row lists direct edges removed from the original strongly connected component.

| Old importer | Removed targets | Replacement |
| --- | --- | --- |
| `R/index.js` | `G/index.js`, `E/utilization.js`, `R/{contingency,creation,equipment,featOperations,healingSpells,metamagic,spellMaterials,strikeOperations,vitality}.js` | `R/blueprint.js` reads data modules and owns public serialization. The compatibility facade imports the blueprint, replay and runtime separately. |
| `G/index.js` | `R/spellMaterials.js` | `R/definitions/spellMaterials.js` provides rows and derived component items. Spending consumes the same definitions separately. |
| `R/engine.js` | `R/{abilityOperations,equipment,metamagic}.js` | Ability option projection, starting package choices, and Metamagic options have data or read-only providers. |
| `R/selections.js` | `R/abilityOperations.js` | `R/abilityOptions.js` provides option previews and kit availability independently of ability execution. |
| `E/index.js` | `E/training.js`, `G/index.js`, `R/clock.js`, `R/index.js` | Inventory and loadout are separate services. The compatibility facade delegates character composition to `R/equipmentView.js` and retains its update entry point. |
| `E/training.js` | `G/index.js` | Explicit grant and weapon-group inputs. Its former dependency on `R/catalog.js`, which was outside the component, was also removed. |
| `E/{bundles,commands,magic,utilization}.js` | `E/index.js` | Narrow inventory import for definitions, issuance, and validation. |
| `E/commands.js`, `R/folioOperations.js` | `R/index.js` | Equipment fire consumes the caller's summary. Folio reads unprojected replay directly to distinguish ledger grants from copied spells. |
| `R/{abilityOperations,agilityChecks,corsairOperations,covenantOperations,damageRiders,featOperations,gunslingerOperations,navigatorOperations,reaverOperations,spellComponents,spellMaterials,strikeOperations,vitality}.js` | `E/index.js` | Definitions come from inventory. Live loadout requests use the character equipment view where fresh effects are required. |

Attack records, Gray Net, scrolls, spell casting, tool checks, and charged items also switched away from the broad equipment facade. These import changes were outside the original cyclic component. The new catalog and lower equipment modules have no reverse imports into character replay or runtime. The remaining higher-level dependencies are visible in the graph.

The ten remaining files are `equipment/magic.js` and `system/rules2024/{clock,covenantOperations,equipmentView,featOperations,featureOperations,folioOperations,runtime,selections,vitality}.js`. The key back edges are runtime validation and recovery calling feature handlers, selections applying magic equipment, the feat handler requesting a fresh equipment view, and the clock and vitality modules calling each other for timed effects and recovery.

## Ownership and integration

- **Catalog.** `catalog.js` still owns Calling definitions, starting Training and level tables. `rules.js` still owns canonical Paths, features, feats, spells and source metadata. `system/blueprints/equipment` still owns weapons, armor, shields, gear, and packs. Weapon group membership now has a read-only module beside the gear catalog. `rules2024/definitions` holds the moved starting packages, origins and backgrounds, and the definitions previously read from execution modules for the public blueprint. Catalog HTTP routes now load `blueprint.js` directly.
- **Training.** Replay continues to resolve which grants a character has earned. `equipment/training.js` maps supplied grant IDs and group definitions into the existing profile. The engine's `/training` export still implements membership, armor and shield Training, Training contribution, tool aliases and grant aggregation. The equipment DTO still includes the existing group grant ID in `training.weapons`.
- **Equipment.** Inventory owns instance issuance, catalog lookup, and inventory and slot validation. Loadout calculates Guard, armor restrictions, attacks and carrying from supplied projected stats, grants, group definitions and feature queries. `equipmentView.js` composes replay and live effects for feature callers that need a fresh read. Character decoration and practice snapshots reuse the projection they already computed. The backend still owns trusted IDs, rolls, time, saves, revisions and receipts.
- **Package and frontend.** The independently packed `@crossworld/sanguine-engine@0.1.0` matched both vendored tarballs byte for byte. SHA-256 is `ab4288449174d20bcfb76c32c4e521ce747f6c486af993f6d49754a0fc8e7ac2`. The four exports remain `/attributes`, `/point-buy`, `/dice`, and `/training`. This pass required no engine or frontend source changes.

## Compatibility evidence

- The catalog is byte-compatible at the JSON serialization used for hashing. Its SHA-256 remains `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. The authenticated route retained the quoted ETag and returned 304 for a matching conditional GET. Eight Callings, 32 Paths, 20 level rows per Calling, 316 spells, and `tabletopReady: false` were verified.
- The Pass 1 Warden fixture still matches `SA-CHAR-1`, ledger version 3, `srd-5.2.1`, Path selection, inventory, loadout and resource reconciliation. Replay still rejects a second Calling. The tests also exercised character creation, commands and receipts, and shared backend contracts.
- The pre-split equipment fixture pins weapon-group membership, exact weapon grants, the Gunslinger firearm package, equipped Warden/Corsair/Gunslinger snapshots, armor and shield Training restrictions, inventory reference identity, and a deterministic practice attack with the historical `proficiency` field. Negative fixture cases cover missing and duplicate item references and an item in the wrong slot. Existing tool-check cases pin aliases, nonstacking skill/tool Training and Expertise.

## Verification

| Lane | Result |
| --- | --- |
| Engine | 6 passed. Fresh package install, CommonJS and ESM execution for all four exports, and isolated Vite bundle build and execution passed. |
| Backend | 580 passed, 0 failed, 1 skipped across 68 files. The equipment fixture, catalog isolation, authenticated ETag, practice combat, and shared-contract tests passed. Backend lint passed. |
| Frontend | 110 passed, including creator and sheet integration. Lint passed. The suite emitted two Vite WebSocket port warnings. |
| Production build | Passed with Vite 8.0.7. The main JS asset was 566.96 kB and 160.69 kB gzip. The existing chunk-size warning and the advisory for the temporary output directory were emitted. |
| Persistence | The isolated real-Mongo lane remained environment-gated. This pass used HTTP, fixtures, and in-memory command verification. |
| Remote CI and browser | GitHub Actions and a live interactive browser workflow were outside this run. The browser-targeted package bundle was built and exercised locally. |

## Recommended Pass 3

Split read-only live projection and persisted journal validation from rest and feat commands. Start with the `runtime → featOperations → equipmentView → selections` path. Give feat execution its already projected facts where they remain valid and isolate the saved feat/folio validators from their command handlers. Pin timed expiry, recovery, spell/scroll/charged-item turn restrictions, and command replay before changing the clock or vitality boundaries. Full character replay extraction can follow once those dependencies are explicit.
