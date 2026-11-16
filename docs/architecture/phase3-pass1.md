# Sanguine Archipelago Phase 3 implementation, pass 1

The audited backend and frontend revisions were `1208ebf288e3f84a97f00529eae13afa57a940fc` and `e44ecea31b716c066edd87668a5b1b3334702048`. This pass used their [audit](phase3-audit.md), [migration plan](phase3-migration-plan.md), [verification baseline](phase3-verification-baseline.md), and [source evidence](phase3-source-evidence.md).

## Package and consumers

`@crossworld/sanguine-engine@0.1.0` is a private npm package in its own Git repository. Its dependency-free CommonJS sources expose named exports to CommonJS, Node ESM, and Vite. The package has one internal dependency from point buy to attributes. There are no cycles or Node built-in imports in its public module graph. The packed archive includes the README, license statement, and attribution notice.

| Public subpath | Live consumers |
| --- | --- |
| `/attributes` | Backend character replay, spellcasting modifiers, recovery, equipment and practice checks via the existing modifier adapter. Frontend modifier helper re-export. |
| `/point-buy` | Backend validates the base allocation before applying existing origin and background increases. The creator uses the shared table and budget, keeping its existing invalid-draft display behavior. |
| `/dice` | Backend practice and tool checks delegate validation and selection while retaining the server's random source. Frontend sheet checks share die selection and floors, with the browser still supplying local rolls. |
| `/training` | Backend character replay uses the level schedule and single Training or Expertise term for skills and saves. Tool checks use the same contribution and grant aliases. Equipment retains catalog ownership and passes weapon groups and Calling profiles to the engine for membership, armor/shield eligibility, and grant aggregation. |

Both apps pin the same packed tarball through relative `file:vendor/crossworld-sanguine-engine-0.1.0.tgz` dependencies and lockfile integrity. The SHA-256 of each copy is `ab4288449174d20bcfb76c32c4e521ce747f6c486af993f6d49754a0fc8e7ac2`. Update the archive and lockfile together when cutting a new version. Rollback should revert the consumer imports and matching dependency entry in the same change.

## Verification

| Lane | Result |
| --- | --- |
| Independent engine | 6 passed, 0 failed, 0 skipped. |
| Package install | `npm pack` included all four exports and notices. Fresh CommonJS and ESM consumers imported and executed all four subpaths. A separate minimal browser project installed only the engine tarball, built with Vite 8.0.7, and executed its generated bundle with the expected outputs. |
| Fresh app dependency installs | Both lockfiles passed offline `npm ci` in new directories with the relative tarballs and a writable cache populated from available lockfile artifacts. |
| Backend mechanics, HTTP, authorization and memory fixtures | 577 passed, 0 failed, 1 skipped, 0 cancelled across 66 files. The authenticated catalog HTTP suite also passed a targeted rerun with the explicit ETag and conditional GET assertions. Backend lint passed. |
| Frontend interaction and integration | 110 passed, 0 failed, 0 skipped. Lint passed. Vite's test servers reported two WebSocket port 24678 collisions during the suite. |
| Frontend production build | Passed. Vite 8.0.7 transformed 150 modules. JavaScript was 566.96 kB and 160.69 kB gzip. CSS was 22.85 kB and 5.05 kB gzip. Vite reported the existing chunk-size warning and an advisory for the temporary output path outside the project. |
| Failure propagation | Both app `npm test` commands exited 1 with a deliberately failing test. Both temporary fixtures were removed. |
| Chrome workflow, in-memory fixture | The creator showed 27/27 with the starting scores and 28/27 after Might increased from 8 to 9. A saved fixture Doctor sheet displayed the result of a local Agility check as 2 + 2 = 4. This smoke covered the migrated frontend paths. The full browser creation, campaign/session, and reload workflows were outside the smoke. |
| Isolated real MongoDB | The one MongoDB test skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. Run `npm run test:mongo` with an isolated test database to exercise that lane. |
| GitHub Actions | Both CI workflows invoke the local test entry points under Node 22.17.1. The workflows have yet to run on GitHub. Frontend CI needs read access to the pinned backend revision for four existing cross-repository integration suites. Local network restrictions prevented verifying unauthenticated checkout access. |

The backend runner launches each test file in its own Node process with test isolation disabled inside that process, which keeps file-level mocks isolated without spawning Node test workers. Frontend tests use the in-process runner. No failing tests are suppressed.

## Contract record

These paths are relative to the authenticated `/archipelago` mount.

| Surface | Contract and evidence |
| --- | --- |
| Catalog | `GET /system/character-rules?version=SA-CHAR-1` serves the same catalog as the legacy GET. The body hash and quoted ETag remain `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. A matching conditional request receives 304. The catalog retains eight Callings, 32 Paths, progression through 20, 316 spells, and `tabletopReady: false`. Verified by the Phase 3 contract test and `rules2024.http.test.mjs`. |
| Creation and preview | `POST /characters/preview` accepts `attributes`, `firstLevel`, `creation` and optional `purchases`. `POST /characters` adds identity fields, returns 201 and supports `Idempotency-Key`. The legacy `POST /system/rules-2024/preview` still accepts a ledger. HTTP tests and `phase2.creation-idempotency.test.mjs` cover these paths. |
| Commands and receipts | `POST /characters/:characterId/commands` accepts `operationId`, `rulesVersion`, `expectedRevision`, `type` and `payload`. The result carries the decorated state and `operationResult`. A matching receipt replays the recorded response and conflicting reuse returns 409. `GET` on the same path provides authorized audit history. See `phase2.commands.test.mjs`, `phase2.audit.test.mjs` and `phase2.authority.test.mjs`. |
| Sheet checks | Clickable sheet rolls use backend-projected modifiers and retain local roll history. Saved `tool.check` uses the command envelope and preserves ordered dice, natural and applied rolls, modifiers and Training flags. See frontend `rules2024.rolls.test.mjs` and backend `phase2.tool-checks.test.mjs`. |
| Campaign registration and sessions | `PUT /campaigns/:campaignId/characters/:characterId` returns campaign and character IDs. `GET/POST /campaigns/:campaignId/sessions` lists or hosts. Hosting takes `name`. `POST /campaigns/:campaignId/sessions/join` takes `roomCode`. Only the host sees the code in session DTOs. Backend campaign, authority, and shared-contract suites cover authorization and responses. |
| Practice encounters | `POST /encounters/test`, `POST /encounters/from-character`, `GET /encounters/:encounterId`, and `POST /encounters/:encounterId/commands` retain owner scoping, revision checks, command replay and the existing `proficiency` result field. See `combat.test.mjs` and `characterCombat.test.mjs`. |

The serialized Warden fixture in backend `tests/fixtures/phase3-characters.json` was captured before extraction. It fixes level-one creation, item and loadout reference identity, level-three Iron Covenant selection, and advancement with spent Health, a slot and a Hit Die. It preserves schema version 1, rules version `SA-CHAR-1`, ledger version 3, and the `srd-5.2.1` replay discriminator. Existing backend tests explicitly assert rejection of a second Calling because active `SA-CHAR-1` rules currently allow one Calling per character. The pass preserves that rejection. Existing equipment and tool-check cases exercise armor/shield restrictions and nonstacking skill/tool Training. Numeric unit fixtures use fixed expected values, with a separate serialized pre-extraction comparison for state.

## Files

| Repository | Changes |
| --- | --- |
| `sanguine-engine` | Created `.gitignore`, `package.json`, `README.md`, `LICENSE.md`, `NOTICE.md`, `src/core/attributes/index.js`, `src/core/attributes/pointBuy.js`, `src/core/dice/index.js`, `src/training/index.js`, and `tests/mechanics.test.cjs`. |
| `crossworld_backend` | Added `scripts/test.mjs`, `tests/phase3.contract.test.mjs`, `tests/helpers/phase3-baseline.mjs`, `tests/fixtures/phase3-characters.json`, and the packed dependency under `vendor/`. Updated `.github/workflows/ci.yml`, both npm manifests, `tests/rules2024.http.test.mjs`, and Archipelago's `combat/dice.js`, `equipment/index.js`, `equipment/training.js`, `system/checkModifier.js`, `system/pointBuy.js`, `system/trainingChecks.js`, and `system/rules2024/{creation,engine,progression,runtime,toolChecks}.js`. |
| `archipelago` | Added `.github/workflows/ci.yml`, `tests/pointBuy.package.test.mjs`, this report, and the packed dependency under `vendor/`. Updated both npm manifests, `src/lib/{checkModifier,pointBuy}.js`, `src/pages/Rules2024/{CharacterCreation.jsx,rolls.js}`, and `tests/checkModifier.parity.test.mjs`. Replaced `tests/pointBuy.parity.test.mjs` with the package test. |

## Remaining migration

| Stage | Remaining work |
| --- | --- |
| C | Isolate catalog reads from the aggregate rules registry. Progression, replay, resource reconciliation, equipment projections and feature dispatch still share the 33-file rules/equipment cycle. Specialized agility checks, Rage skill projections and other context-specific consumers still need parity fixtures before their rule composition moves. Preserve casting turn limits across spells, scrolls and charged items when those systems move. |
| D | Move preview/replay and command mechanics behind backend adapters while preserving validation, receipts, authorization, revisions and transactional writes. Run isolated MongoDB restart and rollback checks against the migrated implementation. |
| E | Finish UI cutover and replace the four cross-repository test dependencies with independent contract fixtures. Exercise creator, advancement, commands, reload and campaign/session paths in a full browser workflow. |
| F | Migrate active terminology and debug surfaces behind versioned readers and access checks. Retain notices, historical evidence and legacy read compatibility through the cutover. |
| G | Run the complete engine, app, isolated persistence and browser acceptance matrix before changing release readiness. |

The next bounded pass is to break the catalog/equipment/Training import cycle. Pass stable Calling profiles and weapon group data into the existing Training adapter, and pin catalog hash and equipment outputs before moving further into replay or feature execution.
