# Sanguine Archipelago Phase 3 migration plan

This is the implementation proposal that follows the [architecture audit](phase3-audit.md). A stage is complete when its acceptance checks pass. Complexity describes coupling and verification effort.

## Stage A — Baseline and preparation

**Complexity** Medium. **Depends on** audit review and access to a test runner that can execute both app suites.

1. Record repository SHAs, test commands, current rules version, ledger schema and catalog hash. Capture fixtures for legal level-one creation, level-three Paths, multiclass advancement, high-level spell/rest interactions, and GM/player flows. Use sanitized model fixtures, with a separate isolated real-Mongo lane.
2. Document and freeze the initial API contracts for catalog/ETag, create and preview, character commands and receipts, sheet rolls, campaign registration/session, and practice encounters. Capture character ledger/runtime/inventory snapshots and known legacy shapes, with no application database reset.
3. Put explicit test entry points in both repos and add them to CI. Separate local fixture tests and real-store checks. Record Phase 2 acceptance gaps without treating them as regression failures. Agree on the initial public engine surface, provenance classification, and common runtime version.

**Risk** Existing tests sometimes assert source text or depend on sibling folder placement. An import-only green check can hide behavior drift.

**Acceptance** CI runs actual tests from clean checkouts. Fixtures capture normalized accepted and rejected outcomes, known unresolved acceptance gaps, and version/hash expectations. The CI failure path is exercised before these tests become gates.

## Stage B — Independent engine foundation

**Complexity** Medium. **Depends on** A and approval to create `sanguine-engine`.

1. Create one package with an `exports` map. Start with explicit public exports for catalog, character, check and encounter operations as each becomes usable. Keep internal folders private by default. Use the existing JavaScript and Node test runner initially. Prefer a single portable source of truth. Verify either synchronous CommonJS consumption of the selected module format on the pinned backend runtime or a generated compatibility entry from that same source. No parallel hand-maintained implementation.
2. Write a browser and Node smoke consumer against the packed artifact. Use a local directory dependency only during iterative development. Use `npm pack` and install the tarball in isolated clean consumer checkouts to test contents, lockfiles and boundaries. Version releases through one existing-access private registry or a pinned Git release if supported by both CI and VM. Choose after proving reproducible installs in both contexts. Avoid committing absolute file dependencies or registry credentials.
3. Define plain serialized state, typed domain errors, result/event contracts and explicit inputs for random dice, time and IDs. Package the notices with any vendored material from the first extraction. Distinguish npm SemVer, mechanics/content identity, document schema version, and API version.

**Risk** Frontend ESM and backend CommonJS may interpret exports and JSON assets differently. A Git install that works locally may fail in VM `npm ci`.

**Acceptance** A single tarball installs and exercises the supported entry points in the Node backend and Vite browser consumer. The package tests independently and has no React, Express, Mongoose, browser storage or Node-only runtime dependency in portable entry points. Tarball includes required catalog assets and notices. CI tests both supported module entry points if two are shipped.

## Stage C — Mechanical extraction

**Complexity** High. **Depends on** B and characterization fixtures for each slice.

1. Move validated attributes, dice, check composition and point-buy behavior. Establish `training/` with the validated bonus, one Training/Expertise term, and grant and membership operations. Move gear-group and tool alias rules with their fixtures. Feed stable inputs into Training to keep it independent of the aggregate rule registry.
2. Split `canonicalRules.json` and related catalogs by mechanical owner. Preserve IDs, descriptions, schedules, and ordering where the old contract relies on it. Replace the progression source-name join with a checked ID mapping. Keep catalog modules free of handler imports. Verify catalog integrity and provenance together.
3. Move character creation, ledger replay, advancement, and derived summaries. Extract reconciliation separately from authorized writes. Move equipment derivation and runtime resources/rest with realistic saved fixtures. Untangle `engine.js`, `selections.js`, `equipment/index.js` and the registry by passing the facts each actually needs.
4. Move attack, condition, damage, healing, action, spell and feature transitions in small groups. Extract the shared casting turn budget with spells, scrolls and charged items under one parity gate. Keep the practice encounter public contract until its separate snapshot and state machine can consume the same applicable primitives. Add neutral encounter transitions when a tested command contract exists.
5. Compare legacy and engine outputs using fixed dice, time and IDs in tests. Use fixtures for expected results and short-lived side-by-side tests during cutover. Remove old implementations after all callers migrate and parity passes. Avoid dual production writes and rerolls.

**Risk** Implicit ordering, equipment and feature cycles, mutable projections, authorization facts embedded in rule handlers, and untested paid feature interactions.

**Acceptance** Each slice has independent engine tests and passes supported inputs, invalid input and historical fixture parity. Final package has one owner per rule and no cross-domain dependency cycles. The 8×4 roster, progression through level 20, representative numerical fixtures, Training rules, spent-resource reconciliation and adjudicated effect boundaries are preserved.

## Stage D — Backend integration

**Complexity** High. **Depends on** the relevant C slices and a tested packed package version.

1. Wrap engine calls behind the existing Archipelago application interface. Start with catalog and read/preview, then character creation, single-character commands, cross-character commands, and practice encounter transitions. Apply the same engine invariant validation where document hooks and direct updates take different paths.
2. Keep authorization, trusted facts, RNG, IDs, timestamps, DTO versioning, database operations, revision compare-and-set, transactional rollback, and receipts in the backend. Validate command shape at the HTTP boundary and rule legality at the engine boundary. Keep stored and returned state stable through initial cutover, including existing error status/code/path shapes, canonical digests, and ETag behavior.
3. Verify sign-in, owner/GM/outsider reads, duplicate and stale requests, target permission and treatment locks, campaign registration, session host/join, reload and restart. Run shared-router smoke tests because this backend also serves other apps. Verify multi-document writes and rollbacks in isolated real Mongo before declaring production persistence parity.

**Risk** Partial updates, retries that double-spend or reroll, unauthorized target writes, and clean installs on the shared deployment host.

**Acceptance** API contract fixtures, CI, and real-store workflow checks pass with matching persisted state and results. The package can be rolled back by dependency version while the initial storage contract remains the same.

## Stage E — Frontend integration

**Complexity** Medium–high. **Depends on** B, relevant C exports, and a compatible backend adapter from D.

1. Route creator previews and persistent commands through feature-specific API adapters. Keep review, error mapping, browser retry/draft state, and route ownership in React.
2. Replace local point-buy cost, Blood Price projection and check-resolution duplication with narrow engine calls or the existing backend projections. Keep local dice previews for interactive sheets. Saved multiplayer actions still use the server command response as authority. Replace sibling source imports with package contract tests and cover absence/mismatch of the supported rules version.
3. Split sheet and creator workflow state from rendered sections where useful. Keep campaign and session controls permission-aware. Measure bundle impact and defer non-initial route loading where the measurement supports it. Preserve behavior before the later visual redesign.

**Risk** Lost draft or retry state, drift between projected and saved results, and importing the entire catalog or map into the initial browser chunk.

**Acceptance** A clean frontend checkout builds and tests without sibling source. Creator, choice review, sheet rolls, equipment, reload, command conflicts, and owner/GM/campaign/session workflows pass. Capture bundle sizes by route and preserve current keyboard/accessibility behavior.

## Stage F — Cleanup and terminology

**Complexity** Medium–high. **Depends on** D/E parity and identified external consumers.

1. Rename internal paths, UI labels and active docs to Sanguine Archipelago terms. Keep the rules ID `SA-CHAR-1` stable during package extraction. If retiring ledger `ruleset: "srd-5.2.1"`, first support both formats at the reader. Then write the Sanguine Archipelago discriminator through an explicitly versioned adapter and preserve legacy replay for supported records. Verify migration or compatibility across previews, rebuilds, receipts, model validation, campaign registration and cached catalogs before removal. Keep `proficiency` encounter event compatibility as long as supported data or API clients need it.
2. Move source metadata and adaptation records into a provenance section where appropriate. Preserve notices and verify they ship with actual distributed assets. Archive superseded paired-check and Specialty docs with backlinks. Remove confirmed dead code, test caches and transcripts only after reference and evidence checks. Retain account, campaign, session and lore data.
3. Separate player-facing Calling reference and supported practice flows from test fixtures, temporary-build editors and privileged diagnostics. Keep authorized GM review/audit/command functions available. Gate internal endpoints as well as links. Deprecate old routes only after call-site and external usage verification, with redirects or explicit adapter aliases where still needed.

**Risk** Replay or reader breakage, removing a live preview or admin function, deleting historical evidence, or losing attribution in distributed output.

**Acceptance** Supported older fixtures still load, replay and round-trip. Active names use project terminology. Public compatibility and provenance exceptions are documented. No verified orphan paths or debug-only tools remain exposed to players by default. Packed notices and external client checks pass.

## Stage G — Acceptance verification

**Complexity** High verification effort. **Depends on** all consumer cutovers and a usable isolated persistence test environment.

1. Run complete engine and consumer tests, lint, frontend production build, backend start/import smoke with test fixtures, and independent package installation in clean checkouts. Re-run isolated real-Mongo transactions, restart, CAS, rollback and idempotency checks. Record exact results and versions.
2. Verify representative browser workflows across creator, advancement, local rolls, saved mechanics, campaign registration, GM approval, session host/join and reload. Re-run shared backend contracts and check sibling applications where changed surfaces are shared. Compare against Stage A mechanics and serialized fixtures. Exercise one event replay from a host-style consumer without Express or React as a Loom-readiness check.
3. Publish a Phase 3 acceptance report with results per criterion, residual limitations and rollback instructions. Keep Phase 2’s `tabletopReady` gate tied to its own outstanding acceptance requirements.

**Risk** Treating fixture coverage as live persistence or treating a package build as proof of behavioral parity.

**Acceptance** One package installs reproducibly and owns the migrated rules, Training is first-class, storage and authority checks hold, and expected workflows are equivalent. Report any blocked acceptance check explicitly. Loom and the single-player game can consume the resulting contracts in later work.
