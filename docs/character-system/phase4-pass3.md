# Phase 4, Pass 3 — Backend Lineage lifecycle

The backend uses the vendored Sanguine Engine 0.69.1 package. Character schema 1 and the `SA-CHAR-1` protocol remain in use. The canonical character-rules catalog includes `creation.lineages` and `creation.beastshifterForms`, with provenance and choice descriptors from the engine. Its content hash supplies the ETag.

## Creation and replay

Send `creation.lineage` with the existing Roots, point-buy and first-level payload to the character preview and creation routes. Ledger v4 records the selection in `creation.lineage`. Variable size belongs to that selection. Fixed-size Lineages derive size from the catalog.

| Lineage ID | Selection fields in addition to `id` |
| --- | --- |
| `human` | `size`, `choices.skill`, `choices.originFeat: { id, options? }`. Skilled takes `options.training`. Magic Initiate takes `options.list`, `attribute`, `cantrips`, and `spell`. |
| `fishmen` | `choices.castingAttribute` |
| `stoneborn` | The ID is sufficient. |
| `fey-touched` | `choices.heritage`, `choices.skill`, `choices.castingAttribute`. Glasslight starts with Prestidigitation. |
| `beastshifters` | `size`, `choices.skill`, `choices.formId` |
| `changelings` | `size`, `choices.skills` with two distinct skills |

The engine validates Lineage choices against the creation Training and Origin feat grants. Preview lists missing choices and commit requires a complete selection. Roots supply the existing attribute increases. Requests shaped for the legacy creator still create ledger v3. Existing v3 ledgers replay through their original creation and event contract. Rebuilds keep the ledger version, Lineage selection, and historical form selections.

## Advancement and saved Health

An `advance` payload accepts `{ level, choices, lineageForm? }`. Solo v4 characters can submit `{ levels: [...] }` using consecutive entries of that shape in chronological order. Campaigns advance one GM-authorized level per command. The level, choices, and optional form replacement are validated before the transaction commits.

At levels 3, 5, 9, 13, and 17, a Beastshifter supplies `lineageForm: { learnFormId, replaceForm?: { fromFormId, toFormId } }`. The first form belongs to creation. The same optional field is accepted in the next-level preview. A preview with a pending form choice lists eligible new forms and replaceable known forms.

The engine replays each level in order to reconstruct currently known forms, every form previously learned, each form's initial Health when first learned, and current maxima. `rulesRuntime.animalForms` persists `{ activeFormId: null, healthByForm: { [formId]: currentHealth } }`. Health records for previously learned forms survive replacement, relearning, rests, and rebuilds. Advancement reconciles maxima without healing. Saved records must match the set of forms established by the ledger. Humanoid Health uses its existing separate record.

## Projection and deferred work

The summary exposes Lineage, creature type, size, movement, senses, Training, defenses, innate spell grants, and recovery definitions. Stoneborn Health uses the normal maximum Health reconciliation. Human Origin feats use the existing feat systems. Human Long Rests award Heroic Inspiration if the character has none.

Innate Lineage spell grants carry stable source IDs and report `castSupported: false` until spell dispatch is connected. Active transformation, reversion, appearance changes, Stone Listening, animal damage and healing, Primal Recovery, Waking Reverie rest timing, Glasslight replacement, and Inspiration transfer remain deferred. Condition-specific defenses without a matching command context are available in the Lineage projection. The frontend still uses the existing creator.

## Verification

The focused backend run passed 9 tests, the fast tier passed 73, and the standard backend run passed all 648, including isolated MongoDB rollback and reload. The 21 focused engine tests passed. Syntax, ESLint, dependency cycle, and backend archive integrity checks passed. All eight historical Calling hashes matched in the roster probe. Its expected catalog hash changed with the new Lineage definitions.
