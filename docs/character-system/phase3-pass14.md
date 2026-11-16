# Phase 3, Pass 14 — Shared spell-slot conversion accounting

`@crossworld/sanguine-engine@0.12.0` owns the arithmetic for converting spell slots into Sorcery Points and creating spell slots with Sorcery Points. The authenticated character command retains eligibility, validation, error precedence, revisions, transactions, receipts and persistence.

## Audit

Both operations previously performed their conversion arithmetic in backend `runtime.js`. The slot-to-points path already used Pass 13's `spendSlot` adapter. The frontend resource panel independently encoded the five-level creation cutoff.

| Rule | Slot to Sorcery Points | Sorcery Points to slot |
| --- | --- | --- |
| Slot level | A level present in the character's saved slot allocation, up to 9 | A level present in that allocation and supported for creation, 1–5 |
| Exchange | One available slot yields points equal to its level | Levels 1–5 cost 2, 3, 5, 6 and 7 points |
| Calling | Requires the registered Tidecaller pool | Requires that pool and Tidecaller levels 1, 3, 5, 7 or 9 respectively |
| Capacity | An exact fill is accepted. An over-cap gain rejects the full operation. | Creation adds one available slot and one created marker, including when the ordinary allocation is full. |
| Markers | A positive marker is consumed first. A zero available total still prevents spending. | The command validates the saved result, which permits up to 100 created markers per level. |

The backend supplies the earned Sorcery Point maximum from the character summary. Saved points must be between zero and that maximum. Saved slot totals must be nonnegative integers no greater than the ordinary allocation plus created markers. The validation also permits markers to exceed available totals. Long Rest clears created markers under the existing rest rules. Neither conversion branch consumes a turn action or records a cast.

The command handler checks ownership before receipt lookup and checks a new request's document revision before rule execution. The runtime validates the saved state and runtime revision before rejecting mixed operation fields. An invalid level or missing pool then returns HTTP 400 `Unavailable conversion`. A slot-to-points availability or cap failure returns `No slot or Sorcery Point capacity`. A level outside the creation table, insufficient Tidecaller level, or insufficient points returns `Insufficient Sorcery Points or Calling level` after the common eligibility check. A candidate with 101 markers fails final validation with `Invalid saved spell slots` before a write or receipt.

## Implementation

| Engine API in `/spell-slots` | Behavior |
| --- | --- |
| `getSpellSlotCreationTerms(slotLevel)` | Returns fresh `{ cost, minimumCallingLevel }` for supported creation levels, otherwise null. |
| `projectSorceryPointsFromSlot({ slotLevel, points, maximum })` | Projects the new pool balance from validated facts and returns null if it would exceed the cap. |
| `calculateCreatedSpellSlotBalances({ available, created, points, cost })` | Returns fresh `{ available, created, points }` after the caller validates eligibility and affordability. |

Backend `runtime.js` consumes all three functions. Slot-to-points spending still routes through `spellSlotState.js` to `deductSpellSlot`, sharing marker precedence with Pass 13's spending paths. The command still applies creation balances to the cloned runtime and validates the result before persistence. Frontend `PersistentResources.jsx` reads the shared creation terms to decide which slot rows display the creation button. Its click payload and existing availability checks are preserved.

## Parity and transaction verification

- Captured the Pass 13 implementation's **1,656 serialized command outcomes** before editing production code. Pass 14 reproduced SHA-256 `4c9fe6ce619091ac4ca0071c0926ec14b38a7f8ef5eaca04578229cb5be3e3a1`. The matrix covers levels 1–9, invalid and mixed requests, pool and Calling eligibility, costs and returns, exact and exceeded pool capacity, empty slots, markers above available totals, and markers at 99, 100 and 101. It compares responses and stable state changes or error status, code and message. Every case asserts input immutability. The earlier **326-case** slot-spending matrix also passed.
- A transaction fixture created two level-one slots, converted both created slots back into points, then converted one ordinary slot. Each success advanced the document and runtime revisions once and saved one receipt with the original response. Replaying all five commands after later writes returned their original responses without changing balances or receipts. New stale requests, a point shortage, and the attempted 101st marker preserved the full saved character and receipt set. The existing Pass 13 transaction case also verified empty-slot rejection.
- Engine tests verify the cost and Calling-level table, exact and exceeded pool caps at every convertible slot level, and creation followed by shared deduction without mutating inputs.

## Verification

| Check | Result |
| --- | --- |
| Engine | 46 passed |
| Backend | 618 passed, one isolated MongoDB test skipped because `SA_PHASE2_TEST_MONGO_URI` was unset |
| Frontend | 112 passed. The existing Vite WebSocket port warning recurred. |
| Lint and builds | Both consumer lint checks passed. Frontend production build passed with the existing chunk-size warning. Backend has no production build script. All 184 backend source files passed Node syntax checks. |
| Dependency cycles | Zero in the engine, Archipelago backend and full backend source graphs. The frontend retains one cycle among `MapCanvas.jsx`, `AuthoredShapeLayer.jsx` and `ShapeEditorLayer.jsx`. |
| Offline package consumers | Fresh `npm ci --offline` passed in both apps. All ten subpaths passed CommonJS and Node ESM export checks in both installs. A Vite browser-targeted bundle imported and executed all three conversion APIs through explicit named imports. |

Two independent packs and both consumer archives matched SHA-256 `8eefe5a98838a712d1088a2a91e0a174fcaf4d5c2d8e0ff016b7fcc631042773`. Both consumers pin `file:vendor/crossworld-sanguine-engine-0.12.0.tgz`. Both lockfiles match the computed archive integrity `sha512-Ly06Q2lqRL70yN5O6lV56Z+ns0Z0mugbprjH2kYkm7sDGDWGPqWQv9dGfmqRZL/O+44o81FmouIoi6bZf8MfSw==`.

## Deferred work and Pass 15

The two conversion directions share their respective formulas across callers. Saved-slot representation and reconciliation, Warden restoration, and rest or Path recovery are outside the conversion extraction. The absence of a conversion action gate and the ability for markers to outlive available slots are existing behaviors for separate gameplay review. The marker cap still surfaces through the saved-state validation error.

For Pass 15, audit capped Sorcery Point recovery. The two backend Measured Sacrifice paths duplicate the six-Health cost and two-point capped recovery, and Sorcerous Restoration applies its own amount with the same capped-addition pattern. Characterize their distinct error order, action handling and response fields before deciding which calculations to share. Conversion rejects an over-cap gain, while these recovery paths clamp it, so preserve those policies separately.
