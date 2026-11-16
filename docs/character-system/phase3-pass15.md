# Phase 3, Pass 15 — Shared capped Sorcery Point recovery

## Audit

| Path | Eligibility and error precedence | Action and result |
| --- | --- | --- |
| Runtime feature use | The runtime validates saved Health, revision and pools, then checks operation shape and revision. Feature fields, earned Sanguine Conduit level-six action, note, one available transfusion use and Health greater than six are checked in that order. Errors include HTTP 400 `Unavailable feature action`, `Insufficient feature resource: sanguine-conduit:transfusion` and `Sacrifice must leave at least one Health`. | Pays six actual Health, recovers two points capped at the earned maximum, spends one transfusion use and records a named effect and note. It has no action or incapacitation gate. The runtime returns the updated state and increments its revision once. |
| Typed ability activation | The command validates its envelope and document revision. Ability fields, earned option, incapacitation, note, target shape, parameters and transfusion affordability precede Conduit confirmation, the no-target rule and Health greater than six. Errors include HTTP 422 `Ability option is unavailable`, `Insufficient resource: sanguine-conduit:transfusion` and `Health cost must leave at least one`. Projected saved-state validation follows execution. | Also pays six Health and one transfusion use. The declared Bonus Action expires effects with `endsAfterAction`. There is no numeric Bonus Action gate or deduction. The response includes actual `sorceryRecovered`, `healthLost`, `recordOnly` and effect metadata, without persisting that effect. Each successful command increments the runtime and document revisions once. |
| Sorcerous Restoration | A level-five or higher Tidecaller earns one restoration use. A Short Rest must explicitly set `restoreSorcery: true` and have a use available. Rest eligibility, payload, duration, saved-state validation and earlier rest choices retain precedence. An ineligible flag or depleted reserve yields HTTP 400 `Sorcerous Restoration unavailable`. A Long Rest request with that option fails before recovery. | Spends one restoration use to recover floor(Tidecaller level / 2) points up to the earned maximum. It has no action cost. Rest start previews the recovery on a clone and increments the runtime revision once. Rest completion applies it and increments the runtime revision twice. A qualifying interrupted Long Rest can invoke the same Short Rest rules. Each successful rest command increments the document revision once. |

The pool cap comes from the replayed Tidecaller progression. Exact fills succeed, over-cap recovery fills the pool, and a full pool still consumes the applicable costs. Six current Health is insufficient for sacrifice and seven leaves one. Temporary Health and Resistance do not offset the cost. Zero and negative recovery amounts cannot arise from earned features. A missing saved Sorcery Point balance fails saved-pool validation. Missing or invalid saved pools can reach the typed ability's cost and eligibility checks before that validation, while the runtime path validates them first.

The frontend calls the typed ability from `ConduitControls.jsx` and selects Restoration in `PersistentResources.jsx` before submitting via `RestPlanner.jsx`. The persistent sheet uses supplemental `FeatureActions.jsx`, which hides its generic use controls. No dedicated authenticated use-feature command exists. The existing effect.end fallback forwards the payload type to the runtime, which makes the older implementation reachable through that branch.

Authenticated commands authorize the actor before looking up a receipt. A matching request returns the original response ahead of the document revision check. A reused operation ID with a different request is rejected. Writes use a document revision predicate and save the receipt in the same transaction.

## Pre-edit characterization

Two independent runs produced 339 identical serialized outcomes and SHA-256 `ae3ce43a5d10b0af4dccc6dabfecfce2c3c5beaf8e0c899453443d3ebce463a2`. The matrix pins cap boundaries, Health thresholds, spent reserves, Calling and Path eligibility, malformed requests, missing and invalid pools, action effects and incapacitation, rest durations, stale and invalid revisions, and authenticated receipt replay. Each case checks input immutability. The fixture assigns stable inventory IDs and normalizes only the generated ability effect ID after checking its format.

## Implementation

`@crossworld/sanguine-engine/resources` now exports `calculateCappedPoolRecovery({ current, maximum, amount }) → { remaining, recovered }`. Callers supply the current balance, earned maximum and recovery amount. The function calculates `remaining = Math.min(maximum, current + amount)` and `recovered = remaining - current`. Each call returns a fresh object and leaves the inputs intact.

The three backend implementations previously calculated their own capped addition. All three now call the engine. The backend Conduit module supplies the shared six-Health and two-point terms, while each command preserves its own Health guard and error. Restoration still derives its amount from the Tidecaller level. Slot conversion retains its separate over-cap rejection in `/spell-slots`.

## Parity and transactions

- All 339 outcomes reproduced the pre-edit digest. The 1,656-case conversion and 326-case slot-spending regressions also passed.
- The transaction fixture exercised the older runtime path through its existing command fallback, the typed ability directly, and Restoration through rest start and completion. It checked saved balances, exact Health costs, both revisions, and one receipt per successful command. Rest start saved the plan without granting points or spending the reserve.
- Replayed commands returned their original responses. Replaying rest start after completion returned its original preview response without reopening the rest. Stale revisions, malformed payloads and exhausted reserves preserved the complete saved character and receipt set.
- The engine test covers empty, exact-cap, over-cap and full balances, zero recovery, zero capacity, safe-integer boundaries, input immutability and fresh results.

## Release verification

| Check | Result |
| --- | --- |
| Engine | 47 passed |
| Backend | 619 passed. One isolated MongoDB test skipped because `SA_PHASE2_TEST_MONGO_URI` was unset. |
| Frontend | 112 passed. The existing Vite WebSocket port warning recurred. |
| Lint, build and syntax | Both consumer lint checks passed. The frontend production build passed with its existing chunk-size warning. All 184 backend JavaScript source files passed syntax checks. |
| Dependency cycles | Zero in the engine, Archipelago backend and full backend. The existing frontend cycle between `MapCanvas.jsx`, `AuthoredShapeLayer.jsx` and `ShapeEditorLayer.jsx` remains. |
| Clean consumers | Fresh `npm ci --offline` passed in both applications. Both loaded all ten subpaths in CommonJS and Node ESM. The Vite browser bundle imported and executed capped recovery and over-cap conversion. |

Two independent packs and both vendored copies match SHA-256 `10dfd860d14a536dabddb7379c222954060749f2003538eee552101d05bde2c0`. Both consumers pin `file:vendor/crossworld-sanguine-engine-0.13.0.tgz`, and their lockfiles match archive integrity `sha512-bX8q0ARQGJ1VFgZV+PB6+PJeYZu2MBgFuwsBtKf6mqIxYx9hQvKNrqDKzbeOwcfb9q8uRKKFAE7WeY3zsQnvjA==`.

## Remaining calculations and Pass 16

The generic numeric Short Rest pool refill still has its own capped addition. The two Conduit paths retain separate Health guards and subtraction at their respective validation points. Blood Price uses a different, Training-scaled Health cost. Those paths remain outside this extraction.

For Pass 16, audit command routing around feature activation and effect ending. Confirm which feature operations the typed command and current sheet actually use, then characterize the effect-ending fallback and its accepted payloads. Give any change to Bonus Action enforcement its own gameplay decision and tests.
