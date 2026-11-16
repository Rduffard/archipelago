# Phase 3, Pass 5 · Pool reconciliation

`@crossworld/sanguine-engine@0.3.0` owns pool reconciliation for advancement and character rebuild. The backend still computes earned grants and maxima, selects the reconciliation policy, and owns the command and persistence boundary.

## Pre-extraction behavior

The new pool and advancement receipt tests ran against the Pass 4 implementation before extraction. The focused run passed all 26 tests across the pool fixtures, command handlers, and rebuild suites. The same tests passed after integration.

| Case | Advancement | Rebuild |
| --- | --- | --- |
| Same maximum | Preserve the saved balance | Preserve the saved balance |
| Higher maximum | Preserve spent uses. Second Wind at 0 / 2 becomes 1 / 3. | Preserve spent uses and cap the result at the old available balance. |
| Lower maximum | Preserve spent uses down to a floor of zero. For example, 3 / 5 becomes 2 / 4. | Apply the same expenditure and the old-balance cap. |
| New grant | Initialize to the earned maximum | Initialize to zero |
| Removed grant | Omit from the active balance map | Omit from the active balance map |
| Several changes | Emit balances in the order of next definitions | Emit balances in the order of next definitions |

Fixtures cover full and depleted pools, a reduced maximum smaller than the amount already spent, zero maxima, multiple simultaneous changes, and old Initiative journal keys surviving removal of an active pool. They also pin the existing integer clamp and missing-balance fallback on advancement. A missing retained balance in rebuild still rejects with `Invalid saved pools`. The saved-state validator rejects unknown active IDs, fractional or text balances, invalid quantities, and missing required saved balances.

The new engine boundary requires plain maps and safe integer maxima and balances for participating pools, with advancement's existing nullish balance fallback. It rejects malformed values, including numeric strings that raw JavaScript arithmetic could previously coerce when applied to an invalid record. The existing advancement clamp for integer balances remains. Stale IDs outside the next grant set are dropped. Valid saved-character behavior and the public schema are preserved.

## Engine API and backend integration

`reconcilePools(previousDefinitions, previousPools, nextDefinitions, policy)` is exported from the existing `/resources` subpath. It returns a fresh balance map and accepts `advance` or `rebuild` as the policy. It uses explicit `{ max }` definitions and leaves all three input maps untouched. Invalid transition inputs produce `ResourceTransitionError` with code `INVALID_POOL_RECONCILIATION` and the affected pool ID when available. The existing spending and Initiative APIs retain their behavior.

The backend adapter maps reconciliation errors to its existing 400 `Invalid saved pools` response. The backend advancement reconciler and the rebuild planner now call the engine. The former inline pool calculations were removed from both paths. Character replay still determines which grants are earned, and the surrounding reconciler retains Health, temporary Health, slots, Hit Dice, preparations, and journals.

The receipt fixture exercises actual level-two to level-three advancement, an unchanged depleted Second Wind pool, and a new Iron Suppressor pool. A second advancement raises Second Wind's maximum without refunding the two spent uses. JSON reload preserves both balances, receipt replay returns the original accepted response, and a new stale request rejects with 409. Rejection leaves the saved character and receipts intact. The same-level rebuild suite exercises preview and commit, new pools starting empty, and loss of old grants.

## Files changed

| Repository | Changes |
| --- | --- |
| Engine | Updated `src/resources/index.js`, `tests/resources.test.cjs`, `README.md`, and `package.json`. |
| Backend | Updated `characters/rules2024.js`, `characters/rebuild.js`, and `system/rules2024/resourceTransitions.js` under `src/modules/archipelago`. Added `tests/phase3.pool-reconciliation.test.mjs` and extended `tests/phase2.commands.test.mjs`. Updated both npm manifests and replaced the vendored tarball. |
| Frontend | Updated both npm manifests, replaced the vendored tarball, and added this report. Existing resource display coverage ran against the updated package and backend. |

The package retains five public subpaths. Both applications pin `file:vendor/crossworld-sanguine-engine-0.3.0.tgz` with matching lockfile integrity. The engine pack and both vendored files share SHA-256 `203d5da33ed053f2cb62cac404fb00efe3eb6e4f2eacf20dca4566f2df387c3a`. Fresh offline `npm ci` installs passed independently in both applications. An isolated consumer imported all five subpaths in CommonJS and ESM and built and executed the browser-targeted Vite bundle.

## Verification

| Lane | Result |
| --- | --- |
| Engine | 14 passed, 0 failed. Includes both reconciliation policies, deterministic output, immutability, typed rejection, spending, and Initiative recovery. |
| Backend | 594 passed, 0 failed, 1 isolated MongoDB skip across 70 files. Lint and post-extraction focused checks passed. |
| Frontend | 111 passed, 0 failed. Lint and production build passed. Existing WebSocket port and chunk-size warnings were reported. |
| Dependency graph | Zero cycles in Archipelago backend, the full backend, and the engine under the literal import scanner. The same scanner with JSX and ESM parsing enabled found one pre-existing frontend component involving `MapCanvas.jsx`, `AuthoredShapeLayer.jsx`, and `ShapeEditorLayer.jsx`. Those files were outside this pass. |
| Isolated persistence | The MongoDB test URI was unset. Fixture, authenticated HTTP, and in-memory transaction results establish application behavior. Live MongoDB parity remains open. |

The catalog hash remains `60e932f1cf6a397395ee56b28472249f2f1abca464e85a3e798a2f4927b887f8`. Regression coverage pins the quoted ETag, conditional GET, `SA-CHAR-1`, ledger version 3, the persisted `srd-5.2.1` discriminator, the existing command and practice contracts, the single-Calling rule, and `tabletopReady: false`.

## Recommended Pass 6

Characterize Hit Dice reconciliation as a separate deterministic slice. Pin the existing advancement and rebuild caps, die grant changes, saved expenditure, and interactions with rest. Use the same narrow backend boundary if the fixtures establish a stable input contract. Keep spell-slot conversion, trusted rolls, rest commands, and receipt handling in their current owners.
