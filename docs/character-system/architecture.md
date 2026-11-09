# Replacement architecture and preserved presentation

## Inspected implementation

The frontend and backend are separate writable Git repositories under Crossworld Creative. The backend's current character implementation is in src/modules/archipelago/system/rules2024: catalog, rules, progression, engine, runtime, featureOperations, selections, creation and equipment. The composed registry reads sourceRules.json, originalPaths.js and newPaths.js. The current character model stores rulesLedger, rulesRuntime, documentRevision, duplicated attributes, inventory, loadout and owner; model validation replays the ledger. Character routes expose both ordinary and /rules-2024 aliases. These observations describe the starting implementation, not the proposed architecture's completion.

## One registry and one engine

The backend owns immutable registry version SA-CHAR-1: Callings, Paths, abilities, options, feats, origins, backgrounds, spells, equipment, resources and conditions. Startup validation rejects duplicate IDs, missing references, foreign parent links, invalid unlock levels, impossible choice counts, dependency cycles, unsafe formulas and unknown pool bindings. Publish a display-safe registry with version and content hash; the frontend caches by hash and never owns a parallel rules implementation.

The pure processing sequence is: validate choices; replay one level ledger; resolve grants once; apply chosen options; compute derived statistics; reconcile runtime capacities while preserving expenditures; validate and apply a command; save using compare-and-set. No separate engine for each Calling or Path. Reusable handlers implement stat changes, Training grants, pool expenditures, spell casts, healing, created objects, active effects and choice replacements. The full ability text must be encoded into typed clauses and verified with behavioral fixtures; descriptions are not executable code.

Formulas use a bounded expression tree: constant, attributeMod, level, Training Bonus, sum, product, floor, min, max and dice. Reject arbitrary JavaScript, database expressions and user-provided formulas. A feature can supply different parameters to the same handler without duplicating advancement logic.

## Persistent contract

The following is a data contract, not an implementation added in Phase 1:

```text
CharacterVNext {
  id, ownerId, campaignId?, schemaVersion: 1, rulesVersion: 'SA-CHAR-1', revision,
  name, originId, background: { id, choices }, baseAttributes, identity,
  levels: [{ level, callingId, pathId?, choices, grantKeys }],
  inventory, loadout, presets, goldCp, folio, preparation, selections,
  runtime: {
    healthCurrent, tempHealth: { amount, source, expiresAt }, hitDiceSpent,
    pools: { poolId: { spent, temporary } },
    effects: [{ id, sourceAbilityId, optionId, targetIds, concentration,
                startsAt, expiresAt, parameters }],
    turnUses, targetLocks, deathSaves, restHistory, cooldowns
  }, timestamps
}
```

Derived responses include final attributes, saving throws, skills, Guard, movement speeds, weapon attacks, spellcasting, every unlocked ability, availability reasons, active effects and available/max resources. Never accept duplicated derived totals from the client as authoritative. Optional caches require both rules hash and character revision.

Every command has {operationId: UUID, expectedRevision, rulesVersion, type, payload}. Obtain owner from authentication, character ID from the route. Identical operation ID and body returns the stored result; changing the body for an existing ID returns 409. A stale revision returns 409 and the current revision. Invalid choices/schema return 422 with fieldPath and code; unauthenticated requests 401; foreign or missing characters 404; GM-only violations 403; rules-version mismatch 409. Save operation/result atomically with unique(characterId, operationId). Cap inventory at 1000 entries and active effects at 200; level ledger contains at most 20 entries. Store the audit journal separately and paginate it. Multi-character effects require a Mongo transaction or idempotent outbox, never two uncoordinated saves.

## Future endpoints and commands

GET /archipelago/system/character-rules?version=SA-CHAR-1 publishes the registry. POST /archipelago/characters/preview and POST /archipelago/characters share the complete creation draft contract. GET /archipelago/characters/:id returns the derived record. POST /archipelago/characters/:id/commands accepts the command envelope. These routes are specifications only.

| Command | Required payload and validation | Persistent result |
| --- | --- | --- |
| advance | level=current+1, complete choices, Path at 3 | One level event; grants and capacity reconciliation |
| ability.activate | abilityId, optionId, targetIds, parameters, eventId/roll evidence when needed | Atomic costs, counters, effects, created objects and log |
| spell.cast | spellId, sourceGrantId, slotSource/slotLevel, metamagic, targets and parameters | Slots/free cast, Sorcery Points, materials and Concentration |
| effect.end | Owned cancelable effectId | Remove the effect and dependent benefits |
| resource.convert | Registered conversionId and source slot/amount | Atomic debit and credit; no arbitrary resource setting |
| rest.start / rest.complete | restId, kind, world time, interruption evidence, Hit Dice and replacement choices | Recovery, target rest epoch and validated choices |
| equipment.issue / buy / sell / consume / split / merge | Item instance/definition, quantity; awards need GM permission | Inventory, copper and charges |
| equipment.equip / unequip / preset.apply | Slot, owned instance, grip or preset; hands and time checked | Loadout and derived modifiers |
| spells.prepare / learn / copy / replace | Source grant, spell IDs, replacement/discovery IDs and eligible boundary | Preparation, folio and choices |
| choices.replace | Grant key, option, value and rest ID if required | Validated replacement and dependent recalculation |
| health.apply / temp-health.choose / condition.record | Amount, source and event evidence | Current Health, temporary Health, death saves and conditions |
| identity.patch | Allowlisted name, notes and portrait URL | Narrative changes only |
| rebuild.preview / rebuild.commit | Complete choices, reason and campaign GM consent | Validated ledger, audit and explicit resource consequences |

Every persistent ability clause requires a command handler, including paid option selections, item charges, free casts, target restrictions, cooldowns, salvage credits and created objects. A generic spend button alone is insufficient. In tabletop mode record GM adjudication provenance without claiming automated target validation. A future encounter adapter supplies turn tokens, movement, range, line of sight, reactions and trigger evidence using the same registry and formulas. Owners cannot directly set maxima, grant abilities or refill restricted counters.

## Frontend presentation to preserve

Keep AppLayout, AppNavbar, Outlet, useAuth/logout, AuthProvider, ProtectedRoute, CharactersPage, CharacterRoster and portrait assets. Current /characters/new mounts Rules2024Page in persistent mode; /characters/:id and /edit mount PersistentSheet. PersistentResources, PersistentEquipment, FeatureActions, PreparationChoices, RestSelections, RequiredChoice and RulesSummary provide reusable interaction patterns. The current Rules2024.css has plain fieldsets and a 1120px maximum width; that is not proof that the former rich character presentation survives.

The old creator and sheet files are already deleted in the starting working tree. HEAD versions remain recoverable. Later reuse presentation from CreatorStepFrame, CreatorForm, CreatorRecordCardHeader, CreatorChoiceStyles, CreatorSurfaceStyles, CreatorNav, Hero, SubmitBar, CharacterSheetHeader, CharacterSheetSectionBits, CharacterSheetSkills and CharacterSheetLoadout. Replace mechanical hooks and selectors; do not restore obsolete paired checks or progression engines. The historical creator uses width min(100%,1180px), padding 3rem 1.25rem 4rem and 1.5rem card gaps.

Preserve src/index.css tokens: dark background #0f1a24, accent #d1b38f, text #f3eadb, muted #cabca8, translucent blue-gray surfaces and warm borders; light background #eef1f4 and text #1d2732. Keep Georgia/Times typography, 320px minimum width, radial and linear backgrounds, current theme selection, assets, focus styles and tooltips. Stack cards on narrow screens and scroll tables inside cards without page overflow.

The creator exposes all ten steps in creation.md. Advancement is preview, choices, review and commit with revision protection; unsaved drafts remain distinct from saved state. Sheet sections are Overview, Abilities, Training, Inventory/Loadouts, Spells, Resources and Narrative. Each ability shows full rules, category, activation, target/range/duration, costs and uses, computed attack/DC/dice, upgrades, source, prerequisites and unavailable reason. Show separate option buttons; passives have no fake activation button. Pending commands prevent duplicate clicks; conflicts refresh the server state while preserving proposed choices. The rest dialog includes Hit Dice, preparations and all eligible replacements before commit. Equipment and spell-material operations need no database editing. Keyboard labels, focus, live errors and responsive behavior are mandatory.

Authentication/accounts, maps, nations/lore, campaigns/sessions, reputation, artwork, unrelated combat-test functionality, other applications and infrastructure are preservation boundaries. Character-to-encounter adapters may change later with dedicated regression coverage; Phase 1 changes none of these systems.
