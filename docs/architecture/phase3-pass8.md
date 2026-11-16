# Phase 3, Pass 8 — Prepared-spell reconciliation

`@crossworld/sanguine-engine@0.6.0` owns the deterministic ordinary preparation list for saved-character advancement. The backend supplies preparation grants, capacity, and eligibility facts from ledger replay and runtime state. It retains rest, casting, folio operations, rebuild, and persistence.

## Preparation sources

| Source | Role |
| --- | --- |
| `rulesRuntime.preparations[callingId]` | Current ordered ordinary preparations. Rest commands write selections here and record completed rests under `restHistory`. |
| Replayed `spellcasting[callingId].prepared` | Ledger choices. Advancement compares the previous and next replay to identify new grants, and uses the next replay as fallback. |
| Replayed `alwaysPrepared` | Path spells, Calling grants such as Hunter's Mark, and Shipwright Spell Mastery or Signature Spells. These use a separate grant list. Runtime mastery replacements affect effective eligibility through the saved projection. |
| Cantrips, feat grants, and other casting sources | The backend exposes each through its existing eligibility or command path. They supply no ordinary preparation candidates. |
| `folio`, `folioUnavailable`, and `folioMemory` | Ledger and copied folio entries, unavailable entries, and spells still remembered after loss. Folio access can make a spell eligible. A copy or discovery alone does not prepare it. Copy, loss, and recovery retain their existing journals. |

## Characterized Pass 7 behavior

Four backend tests were run before changing production logic.

- Advancement processes saved selections in their original order, then newly earned preparations in replay order, then the remaining replay defaults. The first occurrence wins. Replayed always-prepared IDs are removed before applying the cap. A missing Calling entry historically falls back to the initialized replay list.
- Fixtures pin empty, single, partial, and full lists, duplicate sources, zero and changed capacities, excess additions, and spells moving to the always-prepared list. Zero and decreasing capacity cases use synthetic next summaries.
- Eligibility checks the final capped selection. An ineligible retained spell rejects the advancement. Candidates after the cap do not affect the result. The Shipwright fixture rejected a newly selected spell whose folio entry was unavailable and accepted a retained spell backed by folio memory. The host checks required count before eligibility.
- Saved-state validation rejects malformed arrays, wrong counts, duplicates, nonspell IDs, cantrips, unsupported levels, and missing entries. The engine requires dense string ID arrays and a nonnegative safe-integer capacity. Malformed transition inputs that JavaScript could formerly iterate or coerce now reject at the reconciliation boundary. Duplicate source IDs still deduplicate in first-occurrence order. The saved-state validator still requires unique ordinary IDs.

## Integration and command behavior

`reconcilePreparations({ saved, additions, replayed, alwaysPrepared, eligible, capacity })` is available from `@crossworld/sanguine-engine/preparations`. It returns a fresh ordered list and reports typed errors with codes `INVALID_PREPARATION_RECONCILIATION` and `INELIGIBLE_PREPARATION`. It rejects underfilled results before checking retained eligibility, matching the saved command's count-first rule.

The advancement handler replaced its inline merge, deduplication, exclusion, and cap with the engine call. The backend projects eligible candidate IDs using the existing folio and runtime selection projection. It shares the eligibility predicate with saved-state validation. For folio memory, a candidate is checked as if it were selected, since the projection retains memory for selected spells. The final saved state still goes through the existing runtime validator. The engine receives explicit IDs and never reads the catalog, ledger, runtime, or database.

An in-memory transaction fixture changed a Doctor's preparations through a Long Rest, advanced to level 3, and verified the saved order after a JSON reload. Sanctuary stayed in the ordinary list, while Bless and Cure Wounds moved to always-prepared. The rest journal survived advancement. Rebuild preview retained the saved list and commit restored replay defaults, as before. Replaying the advancement receipt after rebuild returned the original response. A stale revision and an invalid level request left the whole saved character and receipt set intact.

## Files changed

| Repository | Changes |
| --- | --- |
| Engine | Added `src/preparations/index.js` and `tests/preparations.test.cjs`. Updated `package.json` and `README.md`. |
| Backend | Updated `src/modules/archipelago/characters/rules2024.js` and `src/modules/archipelago/system/rules2024/runtimeValidation.js`. Added `tests/phase3.preparations.test.mjs` and extended `tests/phase2.commands.test.mjs`. Updated both npm manifests and the vendored archive. |
| Frontend | Updated both npm manifests and the vendored archive. Added this report. |

## Verification

The engine pack and both vendored archives share SHA-256 `a36248957005ae1e8f3b65d8a34f95dc0873b184f016a3bb93d33f2f96bbf341`. Both lockfiles pin version 0.6.0 by relative archive path and record the same integrity. Fresh offline `npm ci` passed for both apps. An isolated packed consumer exercised all eight exports with CommonJS, Node ESM, and a browser-targeted Vite bundle executed with a minimal DOM stub. The archive includes the license and provenance notices.

| Lane | Result |
| --- | --- |
| Engine | 28 passed, 0 failed. |
| Backend | 606 passed, 0 failed, 1 isolated MongoDB skip. Lint passed. |
| Frontend | 112 passed, 0 failed. Lint and production build passed. A render smoke used a serialized advancement response and confirmed saved preparation order and unique always-prepared choices. Existing WebSocket port and chunk-size warnings recurred. |
| Dependency scan | Zero cycles in the Archipelago backend, full backend source, and engine. The existing frontend cycle remains among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. |
| Live persistence | The isolated MongoDB test URI was unset. HTTP and in-memory transaction fixtures passed. |

The backend suite exercises preparation eligibility, rest changes, folio loss and recovery, copying, shared casting restrictions, Metamagic, Quickened Spell, Concentration, Contingency, slot expenditure, and created slots. Contract fixtures pin `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, the catalog hash and quoted ETag, practice compatibility, and `tabletopReady: false`. Progression coverage retains all eight Callings, 32 Paths, and levels 1–20 under the single-Calling rule.

The source prompt ends midway through its backend verification list. This report, the frontend checks, and the dependency scans follow the established Pass 7 verification pattern.
