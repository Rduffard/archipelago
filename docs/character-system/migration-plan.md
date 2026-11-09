# Preservation, recovery and controlled replacement

Both directories are independent Git roots and passed read/write/remove probes. Frontend HEAD: 0a49abff2f5c2a36bd277780ec5525dedd18bd56; backend HEAD: 0fe4488a3f33567e0c6f03cc7992bc7eff85d798.

Before this task, the frontend already had 104 tracked files changed (46 insertions, 9247 deletions), and the backend had 50 (223 insertions, 6223 deletions), plus untracked Rules2024 source/tests and the Phase 1 prompt. The deleted creator/sheet files and newer engine are pre-existing changes. The initial tracked/untracked file hashes and deletion states were recorded separately for preservation verification.

## Initial frontend status

```text
 M .gitignore
 M src/components/characters/CharacterRoster.jsx
 D src/components/creator/AbilitiesStep/AbilitiesStep.jsx
 D src/components/creator/AttributesStep/AttributesStep.jsx
 D src/components/creator/DetailsStep/DetailsStep.css
 D src/components/creator/DetailsStep/DetailsStep.jsx
 D src/components/creator/DetailsStep/detailsStepHelpers.js
 D src/components/creator/IdentityStep/IdentityStep.css
 D src/components/creator/IdentityStep/IdentityStep.jsx
 D src/components/creator/IdentityStep/identityStepHelpers.js
 D src/components/creator/LoadoutStep/LoadoutStep.css
 D src/components/creator/LoadoutStep/LoadoutStep.jsx
 D src/components/creator/LoadoutStep/loadoutStepHelpers.js
 D src/components/creator/ProgressionStep/ProgressionStep.css
 D src/components/creator/ReviewStep/ReviewStep.css
 D src/components/creator/ReviewStep/ReviewStep.jsx
 D src/components/creator/ReviewStep/reviewHelpers.js
 D src/components/creator/SkillsStep/SkillsStep.css
 D src/components/creator/SkillsStep/SkillsStep.jsx
 D src/components/creator/shared/CreatorChoiceStyles/CreatorChoiceStyles.css
 D src/components/creator/shared/CreatorForm/CreatorForm.css
 D src/components/creator/shared/CreatorForm/CreatorForm.jsx
 D src/components/creator/shared/CreatorRecordCardHeader/CreatorRecordCardHeader.jsx
 D src/components/creator/shared/CreatorStepFrame/CreatorStepFrame.css
 D src/components/creator/shared/CreatorStepFrame/CreatorStepFrame.jsx
 D src/components/creator/shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css
 D src/components/equipment/EquipmentPanel.jsx
 M src/components/layout/AppNavbar.jsx
 D src/components/progression/ProgressionView.jsx
 D src/contexts/SystemContext.jsx
 D src/data/archipelagoSystemBlueprint.js
 D src/data/archipelagoSystemSelectors.js
 D src/data/characterSheetData.js
 D src/data/training.js
 D src/hooks/useSystem.js
 D src/lib/advancement.js
 D src/lib/character.js
 D src/lib/creatorAttributes.js
 D src/lib/originBonus.js
 D src/lib/resources.js
 D src/lib/roll.js
 D src/lib/training.js
 M src/main.jsx
 D src/pages/CharacterCreator/CharacterCreator.css
 D src/pages/CharacterCreator/CharacterCreator.jsx
 D src/pages/CharacterCreator/CharacterCreatorPage.jsx
 D src/pages/CharacterCreator/logic/config/creatorConfig.js
 D src/pages/CharacterCreator/logic/controller/useCreatorController.js
 D src/pages/CharacterCreator/logic/guidance/creatorGuidance.js
 D src/pages/CharacterCreator/logic/hydration/hydrateState.js
 D src/pages/CharacterCreator/logic/mutations/createMutations.js
 D src/pages/CharacterCreator/logic/navigation/stepNavigation.js
 D src/pages/CharacterCreator/logic/payload/buildPatch.js
 D src/pages/CharacterCreator/logic/payload/buildPayload.js
 D src/pages/CharacterCreator/logic/state/creatorState.js
 D src/pages/CharacterCreator/logic/transforms/creatorTransforms.js
 D src/pages/CharacterCreator/sections/attributes/AttributesSection.jsx
 D src/pages/CharacterCreator/sections/calling/CallingSection.jsx
 D src/pages/CharacterCreator/sections/details/DetailsSection.jsx
 D src/pages/CharacterCreator/sections/loadout/LoadoutSection.jsx
 D src/pages/CharacterCreator/sections/progression/ProgressionSection.jsx
 D src/pages/CharacterCreator/sections/review/ReviewSection.jsx
 D src/pages/CharacterCreator/sections/roots/RootsSection.jsx
 D src/pages/CharacterCreator/sections/skills/SkillsSection.jsx
 D src/pages/CharacterCreator/sections/step-content/StepContent.jsx
 D src/pages/CharacterCreator/sections/step-content/stepRegistry.js
 D src/pages/CharacterCreator/shell/creator-nav/CreatorNav.css
 D src/pages/CharacterCreator/shell/creator-nav/CreatorNav.jsx
 D src/pages/CharacterCreator/shell/hero/Hero.css
 D src/pages/CharacterCreator/shell/hero/Hero.jsx
 D src/pages/CharacterCreator/shell/status/StatusPanel.jsx
 D src/pages/CharacterCreator/shell/submit/SubmitBar.css
 D src/pages/CharacterCreator/shell/submit/SubmitBar.jsx
 D src/pages/CharacterSheet/CharacterAdvancement.jsx
 D src/pages/CharacterSheet/CharacterAdvancementLegacy.jsx
 D src/pages/CharacterSheet/CharacterChecks.css
 D src/pages/CharacterSheet/CharacterChecks.jsx
 D src/pages/CharacterSheet/CharacterSheetHeader/CharacterSheetHeader.css
 D src/pages/CharacterSheet/CharacterSheetHeader/CharacterSheetHeader.jsx
 D src/pages/CharacterSheet/CharacterSheetLoadout/CharacterSheetLoadout.css
 D src/pages/CharacterSheet/CharacterSheetLoadout/CharacterSheetLoadout.jsx
 D src/pages/CharacterSheet/CharacterSheetOverview/CharacterSheetOverview.css
 D src/pages/CharacterSheet/CharacterSheetOverview/CharacterSheetOverview.jsx
 D src/pages/CharacterSheet/CharacterSheetPage.css
 D src/pages/CharacterSheet/CharacterSheetPage.jsx
 D src/pages/CharacterSheet/CharacterSheetReferenceGroups/CharacterSheetReferenceGroups.css
 D src/pages/CharacterSheet/CharacterSheetSectionBits/CharacterSheetSectionBits.css
 D src/pages/CharacterSheet/CharacterSheetSectionBits/CharacterSheetSectionBits.jsx
 D src/pages/CharacterSheet/CharacterSheetSkills/CharacterSheetSkills.css
 D src/pages/CharacterSheet/CharacterSheetSkills/CharacterSheetSkills.jsx
 D src/pages/CharacterSheet/characterSheetHelpers.js
 D src/pages/Playtest/PlaytestPage.jsx
 M src/routes/AppRoutes.jsx
 D tests/advancement.test.mjs
 M tests/characterCombat.test.mjs
 M tests/characterRoster.test.mjs
 D tests/characterSheetModifiers.test.mjs
 M tests/combat.test.mjs
 D tests/creatorIntegration.test.mjs
 M tests/equipment.test.mjs
 D tests/interactiveSheet.test.mjs
 D tests/originBonus.parity.test.mjs
 D tests/originBonus.test.mjs
 D tests/progressionV2.test.mjs
?? character-rebuild-phase1.md
?? src/pages/Rules2024/
?? tests/rules2024.rolls.test.mjs
?? tests/rules2024.test.mjs
```

## Initial backend status

```text
 M src/modules/archipelago/characters/controller.js
 M src/modules/archipelago/characters/model.js
 M src/modules/archipelago/characters/routes.js
 D src/modules/archipelago/characters/validators.js
 M src/modules/archipelago/combat/guard.js
 M src/modules/archipelago/combat/snapshot.js
 M src/modules/archipelago/combat/state.js
 M src/modules/archipelago/equipment/index.js
 D src/modules/archipelago/equipment/startingEquipment.js
 M src/modules/archipelago/equipment/training.js
 D src/modules/archipelago/system/advancement.js
 D src/modules/archipelago/system/advancementLegacy.js
 D src/modules/archipelago/system/blueprints/abilities/NOTICE.md
 D src/modules/archipelago/system/blueprints/abilities/historical.js
 D src/modules/archipelago/system/blueprints/abilities/index.js
 D src/modules/archipelago/system/blueprints/catalogs.js
 D src/modules/archipelago/system/blueprints/characters/callings.js
 D src/modules/archipelago/system/blueprints/characters/equipmentTraining.js
 D src/modules/archipelago/system/blueprints/characters/paths.js
 D src/modules/archipelago/system/blueprints/characters/progressionSources.js
 D src/modules/archipelago/system/blueprints/characters/startingEquipment.js
 D src/modules/archipelago/system/blueprints/display.js
 D src/modules/archipelago/system/blueprints/legacyTraining.js
 D src/modules/archipelago/system/blueprints/meta.js
 D src/modules/archipelago/system/blueprints/progression.js
 D src/modules/archipelago/system/blueprints/progressionLegacy.js
 D src/modules/archipelago/system/blueprints/samples.js
 D src/modules/archipelago/system/blueprints/schema.js
 D src/modules/archipelago/system/blueprints/startingProficiencies.js
 D src/modules/archipelago/system/blueprints/training.js
 D src/modules/archipelago/system/controller.js
 D src/modules/archipelago/system/draft.js
 D src/modules/archipelago/system/featureHandlers.js
 D src/modules/archipelago/system/index.js
 D src/modules/archipelago/system/originBonus.js
 D src/modules/archipelago/system/playtest.js
 D src/modules/archipelago/system/resources.js
 M src/modules/archipelago/system/routes.js
 D src/modules/archipelago/system/training.js
 D tests/advancement.test.mjs
 D tests/catalogs.test.mjs
 M tests/characterCombat.test.mjs
 D tests/characterCreation.test.mjs
 M tests/equipment.test.mjs
 M tests/equipmentIntegration.test.mjs
 M tests/equipmentProperties.test.mjs
 D tests/originBonus.test.mjs
 D tests/progressionV2.test.mjs
 D tests/resources.test.mjs
 D tests/training.test.mjs
?? docs/rules2024-stage.md
?? src/modules/archipelago/characters/rules2024.js
?? src/modules/archipelago/system/rules2024/
?? tests/helpers/
?? tests/rules2024.completion.test.mjs
?? tests/rules2024.http.test.mjs
?? tests/rules2024.persistence.test.mjs
?? tests/rules2024.resources.test.mjs
?? tests/rules2024.test.mjs
```


## Recovery before Phase 2

Capture both HEAD IDs, git diff --binary, git diff --cached --binary, porcelain status and a SHA-256 manifest. Copy modified and untracked source/doc/test files into a dated private recovery directory. Exclude credentials, .env files and dependencies from any shared artifact. Verify backup hashes and restore into a separate verification directory before implementation mutations. HEAD cannot recover untracked newPaths.js/Rules2024 files; a patch alone cannot back them up either. Preserve deliberate deletions and staged/unstaged distinctions. Do not reset, clean or check out over existing work. Phase 1 does not commit the baseline.

Rollback later: disable the replacement feature flag and restore only files changed by that implementation from the verified baseline, in an isolated branch/worktree after checking for intervening user edits. Copy reviewed presentation from HEAD rather than bulk-restoring old mechanics. Keep the previous application bundle and rules version until cutover is accepted. Phase 1 adds no runtime feature flags or routes.

## Implementation and cutover sequence

1. Freeze SA-CHAR-1. Vendor exact referenced SRD tables with attribution, validate the registry and establish behavioral fixtures.
2. Implement unified pure creation, replay, grants, derived statistics and all command handlers behind a disabled flag. Cover all 32 Paths, choices and resources.
3. Add an isolated VNext persistence schema/collection and owner-scoped commands. Recreate experimental characters rather than supporting obsolete formats. Preserve accounts, campaigns, sessions, lore, reputation and reviewed associations.
4. Reuse historical creator/sheet presentation with new state and API contracts. Preserve protected routes and navigation; do not replay old records with the new schema accidentally.
5. Run behavioral acceptance, real development-Mongo persistence/concurrency/transactions/reload tests and browser checks at 320/768/1440 pixels in both themes. Verify unrelated login, maps and campaign flows.
6. Review backup and cutover reports. Deployment requires authorization. Remove old character engines/routes only after the replacement passes acceptance. Retire old tests only with equivalent behavior coverage; preserve presentation assets.

No commit, push, deployment or Mongo operation occurs in Phase 1. No data deletion is authorized here. If the experimental character must be removed later, identify the environment, collection, exact record and impact, then obtain explicit confirmation. Never reset an entire database or delete unrelated accounts/data. This design does not claim an implemented or tabletop-ready system.
