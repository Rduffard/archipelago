# Sanguine Archipelago — Phase 3, Pass 18

## Resource command payload contracts

Authenticated resource commands now reject malformed and irrelevant fields with HTTP 422. The dispatcher constructs each runtime operation from its registered subtype and validated fields. The expected runtime revision comes from the saved character. The envelope's expected document revision remains the client's concurrency check.

### Registered contracts

Every row requires the exact subtype in the payload's `type` field. Pool IDs must be nonblank strings and match the applicable rules or character resources. Quantities use safe integers without coercion. The contract accepts no optional fields beyond the conditional fifth-level slot selector for restoration.

| Command | Subtype | Other accepted fields | Runtime eligibility and server-derived values |
| --- | --- | --- | --- |
| `resource.adjust` | `spend-pool` | `poolId`, `amount` (positive safe integer) | Spends the requested amount from a pool owned by the character. An unavailable pool or insufficient balance returns 400. |
| `resource.adjust` | `spend-slot` | `slotLevel` (integer 1–9) | Spends one available slot at the selected level. A level unavailable to the character or an empty balance returns 400. |
| `resource.adjust` | `initiative-recovery` | `poolId` | Requires saved combat Initiative and one recovery per pool per combat. The runtime derives the reserve, amount, and empty-pool requirement. Only Rage, Squall, and Colossus have registered Initiative grants. Missing Initiative and repeat attempts return 422. Ineligible pools and insufficient reserves retain their runtime 400 responses. |
| `resource.convert` | `slot-to-sorcery` | `slotLevel` (integer 1–9) | Spends one slot and restores Sorcery Points under the existing capacity rules. The target pool and quantity come from the rules. No slot or capacity returns 400. |
| `resource.convert` | `sorcery-to-slot` | `slotLevel` (integer 1–9) | Only levels 1–5 have creation terms. The runtime derives point cost and minimum Tidecaller level, and tracks created slots. Unavailable levels, insufficient points, or an invalid resulting balance return 400. |
| `resource.convert` | `restore-feature` | `poolId`; `slotLevel: 5` is required for the four Warden pools and forbidden for other pools | Restores one use of an exhausted feature. Rules derive the alternate cost and check eligibility, including Sorcery Incarnate for Innate Sorcery and the existing Bonus Action restriction for three Warden Paths. Well-formed requests that cannot pay or restore the pool retain their runtime 400 responses. |

| Restoration pool | Existing cost |
| --- | --- |
| `omen-diver:wings` | Three Sorcery Points |
| `tidecaller:innate-sorcery` | Two Sorcery Points with Sorcery Incarnate |
| `bloodwake:presence` | One Rage use |
| `leviathan-anchor:nimbus` | One fifth-level slot |
| `oath-of-the-free-port:open-harbor`, `iron-covenant:standard`, `lantern-vigil:dawn` | One fifth-level slot and existing Bonus Action eligibility and effect expiration |

### Before and after

| Payload or dispatch behavior | Before | After |
| --- | --- | --- |
| Payload `expectedRevision` | The payload could replace the dispatcher's runtime revision. Matching values were accepted and mismatches returned the runtime 400. | Rejected with 422 in all six subtypes. The server supplies the revision. |
| Pool selectors | Pool spending and Initiative recovery used property-key coercion. Non-slot restoration could accept a single-element array via property lookup. | Only nonblank string selectors pass validation. The runtime retains its prior direct-call behavior. |
| Initiative recovery fields | The shared feature handler accepted and ignored `featureId`, `note`, `slotLevel`, and `value`. | Only the pool selector is accepted. |
| Restoration fields | The shared feature handler ignored `featureId`, `note`, and `value`. Pool-funded restoration also ignored `slotLevel`. Warden restoration checked slot level after checking exhaustion. | Irrelevant fields return 422. A missing or incorrect Warden slot selector now returns 422 before gameplay eligibility checks. |
| Manual spending and both conversions | Runtime allowlists rejected mixed fields with 400. Missing, coerced, or out-of-range numeric selectors reached runtime validation. | Authenticated validation rejects mixed fields and malformed numeric selectors with 422. Runtime eligibility still determines whether a correctly formed request can be fulfilled. |
| Unsupported subtype or extra field | Unsupported subtypes already returned 422. Unknown keys often fell through to a runtime 400. | Unsupported subtypes still return 422. Every subtype rejects unknown fields, including selectors that belong to another subtype. |

The existing JSON parser supplies the decoded object to envelope validation. The contract rejects competing selector fields in that object. Repeated instances of the same raw JSON key are handled by the existing parser.

### Execution, callers, and replay

The Archipelago router authenticates the actor and the character route validates the ID. The handler validates the envelope and hashes its full canonical contents before opening the transaction. Within the transaction it resolves the character and checks authorization before looking up the receipt. A matching digest returns the saved response immediately. An authorized operation ID reuse with a different digest returns 409 `operation_conflict`.

For a fresh request, the handler checks the character's rules version and the dispatcher checks the persisted storage format and document revision before subtype validation. A stale document revision therefore returns 409 `revision_conflict` even when a fresh payload would return 422. The dispatcher applies the operation to a clone, runs the existing runtime and equipment checks, and increments the document revision. The handler saves using the owner and previous document revision as predicates and inserts the response receipt in the same transaction. Rejections preserve both the document and receipts.

`PersistentResources.jsx` supplies manual pool and slot spending and both conversions through `PersistentSheet.jsx`. `FeatureActions.jsx` supplies Initiative recovery and both restoration forms. Those callers already use the accepted payloads. Backend command and persistence fixtures also use those shapes for legitimate operations. No production callers needed changes. The standalone runtime continues to accept its original operation shapes.

Transaction coverage checks successful writes and matching retries for every subtype, authorization before replay, canonical key-order equivalence, payload conflicts, stale revision precedence, and preservation of saved state and receipts on failures. A seeded historical restoration receipt with fields now rejected by fresh requests still replays its original response.

### Verification

| Check | Result |
| --- | --- |
| Pass 18 transaction probe | 112 before-and-after observations. 59 matched in full. The other 53 now return 422, including 13 requests previously accepted with a supplied runtime revision, ignored fields, or coerced pool selectors. Every changed request leaves both the character and receipts untouched. |
| Retained recovery matrix | 336 matched. |
| Conversion matrix | 1,640 of 1,656 matched in full. The 16 changes cover 14 malformed slot selectors and two mixed payloads. |
| Slot-spending matrix | 256 of 326 matched in full. The 70 changes cover 15 malformed slot selectors, 54 missing or incorrect Warden slot selectors, and one extra amount field. |
| Pass 16 transaction replay | All 128 observations matched, with generated effect IDs normalized. |
| Pass 17 direct-runtime replay | All 385 observations matched the retained SHA-256 baseline. |
| Engine, backend, frontend tests | 47 engine, 626 backend, and 113 frontend tests passed. |
| Isolated MongoDB | One skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. |
| Lint, build, syntax | Backend and frontend lint, frontend production build, and 185 backend source syntax checks passed. Vite retained its existing bundle-size warning. |
| Dependency cycles | Zero in the engine and backend. The existing frontend map cycle remains. |
| Engine package | `@crossworld/sanguine-engine@0.13.0`. Engine sources, vendor archives, and lockfiles were outside this pass. Both existing vendor archives had identical SHA-256 hashes. |

### Files changed

- `crossworld_backend/src/modules/archipelago/characters/resourceCommands.js` owns authenticated resource payload validation, operation construction, and the Initiative recovery journal gate.
- `crossworld_backend/src/modules/archipelago/characters/commands.js` routes both command types through that module.
- `crossworld_backend/src/modules/archipelago/system/rules2024/featureOperations.js` shares the existing fifth-level restoration classification with the command boundary.
- `crossworld_backend/tests/phase2.commands.test.mjs` pins the stricter contract and the transaction and historical replay behavior.
- `archipelago/docs/character-system/phase3-pass18.md` records the audit and verification.

The transaction fixture exercises the handler's persistence and receipt sequence. Database-backed transaction verification remains pending the isolated MongoDB URI. For Pass 19, audit authenticated `rest.*` payload contracts and characterize their nested Hit Die, preparation, and recovery inputs before any changes.
