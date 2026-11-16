# Phase 3 verification baseline

Backend commit `1208ebf288e3f84a97f00529eae13afa57a940fc`. Frontend commit `e44ecea31b716c066edd87668a5b1b3334702048`. Windows PowerShell, Node `22.17.1`, npm `10.9.2`.

## Current run

| Check | Result | Scope and reproduction |
|---|---|---|
| Backend test files | **572 passed, 0 failed, 1 skipped, 0 cancelled** | All 65 `tests/*.test.mjs` files were invoked in separate Node processes from PowerShell, with `node --experimental-test-isolation=none --test --test-timeout=12000 <file>`. Four batches totaled 143, 110, 209 and 110 passes. Includes local HTTP tests, memory-backed campaign and persistence fixtures, mechanics, and shared router contracts. |
| Frontend tests | **109 passed, 0 failed, 0 skipped** | All 11 files ran with `node --experimental-test-isolation=none --test --test-reporter=dot tests/*.test.mjs`. Exit 0. Two Vite test servers reported that WebSocket port 24678 was already in use. The test assertions still completed. |
| Backend lint | **Pass** | `npm run lint`, exit 0. |
| Frontend lint | **Pass** | `npm run lint`, exit 0. |
| Frontend production build | **Pass with chunk-size warning** | `node node_modules/vite/bin/vite.js build --configLoader=native --outDir=<fresh temporary directory>`, exit 0. Uses the repository Vite config. Vite 8.0.7 transformed 147 modules. JS 566.25 kB, 160.33 kB gzip. CSS 22.85 kB, 5.05 kB gzip. |
| Real MongoDB | **Skipped** | `phase2.mongo.test.mjs` uses `SA_PHASE2_TEST_MONGO_URI`. The audit run omitted that URI and exercised the skip. No application store was contacted. |
| Dependency freshness | **Unverified** | `npm outdated --json --fetch-retries=0 --fetch-timeout=4000` returned `ENOTCACHED` for both repositories. See the evidence index for direct lock versions, Node compatibility and importer counts. |
| Rules registry import | **Pass** | Importing backend `system/rules2024` ran its registry validator. `SA-CHAR-1` exposes 8 Callings, 32 Paths, 20 rows per Calling and 316 spells. Serialized blueprint length is 1,024,319 bytes. `tabletopReady` is false. `contentHash` is `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. |
| Tracked whitespace checks | **Pass** | `git diff --check` in both repos. New audit documentation checked separately because untracked files are outside that command. |

The default Node runner was unable to spawn test workers (`EPERM`), affecting all 65 backend and 11 frontend file wrappers before assertions ran. The backend's combined in-process run stalled and was superseded by the per-file execution above. The default Vite config loader also failed with `spawn EPERM`. An alternate runner loader failed on `require is not defined`; the native config loader ran the production build successfully. The baseline records the successful workarounds and does not infer a cause outside the runner. No new browser or live sibling-app workflow was exercised during this audit.

## Historical evidence

- [Phase 2 acceptance checklist](../character-system/phase2-checklist.md) records 557 backend passes plus one gated skip, 109 frontend passes, both lint checks, a successful frontend build and a representative browser campaign/session workflow using a memory fixture. These are earlier runs. The current test count comes from the fresh invocation above. A count difference alone does not establish new coverage.
- Backend `tests/support/PHASE2_MONGO.md` records real Mongo run `67aeab9f0f2d458491a2ddfad87eb68f` with 538 passes and zero failures or skips, including rollback, campaign authorization and fresh-process reload. The frontend Phase 2 checklist separately reports a later isolated run with successful real Mongo HTTP and campaign rollback checks and two Warden failures elsewhere in that run. Those Warden cases passed in a subsequent local rerun. Neither historical Mongo result establishes current-commit isolated persistence parity.
- The latest Phase 2 acceptance trace still identifies exhaustive ability and UI coverage, current real Mongo persistence and sibling UI workflow gaps. Keep the current `tabletopReady: false` capability gate separate from Phase 3 packaging and extraction work.

## Test ownership after extraction

| Destination | Reuse and retain |
|---|---|
| Engine unit and contract tests | Move pure attributes/point buy, dice and attack, Training, advancement, equipment properties, resources and feature-resolution cases once their dependencies are portable. Representative sources include backend `checkModifier.test.mjs`, `pointBuy.test.mjs`, `equipmentProperties.test.mjs`, pure sections of `combat.test.mjs`, and domain-level cases in `phase2.acceptance-numbers.test.mjs`, `rules2024.resources.test.mjs` and the feature-specific suites. Preserve an independent expected-results fixture for each behavior. |
| Backend API, auth and persistence | Keep HTTP routers, user/GM/outsider, owner scoping, validation mapping, idempotency, Mongo restart/rollback, shared contracts, and concurrent write tests. Examples include `rules2024.http.test.mjs`, `phase2.authority.test.mjs`, `phase2.commands.test.mjs`, `phase2.creation-idempotency.test.mjs`, `phase2.mongo.test.mjs`, `phase2.campaigns.test.mjs` and `phase2.shared-contracts.test.mjs`. Keep backend command coverage where it tests integration with the real engine through handlers. |
| Frontend interaction | Keep creator, roster, sheet, command and API integration, render/permission and workflow tests. `phase2.test.mjs` covers representative sheet controls. Keep UI assertions around local roll display, result formatting and error handling after shared arithmetic moves. Keep browser harnesses for identity, campaign/session, and reload verification. |
| Transitional tests | `checkModifier.parity.test.mjs` and `pointBuy.parity.test.mjs` deep-import a sibling. Replace these with package export/installation tests and independent fixtures after migration. Some frontend tests build local JSX fixtures or inspect markup/source wiring. Preserve the observed rendering or interaction contract when reorganizing components. |

## Missing characterization and integration gates

- Cover Training contribution for every supported level, Expertise and nonstacking skill/tool combinations, initial versus multiclass grants, exact versus grouped weapon eligibility, and armor/shield restrictions. Existing tests exercise representative cases; pin shared rule behavior across all current call sites before replacing them.
- Compare normalized old and new creation and advancement payloads including legacy ledger fields, used pools/slots, current Health, runtime effects, folio snapshots, armor restrictions, and rebuild state. Assert catalog and ETag compatibility deliberately. Include DTO contract tests that exercise genuine serialized JSON round trips.
- Characterize local sheet checks and authoritative check types as separate entry points. Test Advantage cancellation and floors, Exhaustion and armor restriction interactions, and whether each result is local-only or persisted. Avoid equating a local roll with a trusted combat result.
- For deterministic transitions, use known dice/time/IDs and compare raw rolls, ordered event effects and post-command state across repeated runs. Cover spell, scroll and charged-item limits on the same turn, rest timing and Concentration, and cross-target rollback/retry without rerolls.
- Verify install and import from the actual packed artifact in standalone backend and frontend checkouts. Test that a browser consumer reaches its public API without Node built-ins. Keep tests that exercise production guards and confirmed GM facts after rule extraction. Treat engine fixtures, HTTP fixtures, real-store tests and browser workflows as distinct evidence.
