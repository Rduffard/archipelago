# Sanguine Archipelago — Phase 3, Pass 24

## Saving throw projection

The replay summary derives each of the six saves from the floored attribute modifier, binary Training contribution and self Aura of Protection. Saving throw Training comes from the starting Calling and additional grants such as Corsair 15 Instinct and Spirit. The same dedicated engine Training module computes the level-based bonus, 2–6 across levels 1–20, and applies it once to a trained save. Skill Expertise does not double save Training. Gear adds a separate flat contribution. The frontend displays the projected modifier and rolls against it, with sheet-side roll mode and relevant advantage/disadvantage flags. It does not recalculate save Training or add Exhaustion again to the projected save.

Live projection keeps the same order. It removes the already included Aura when the character is incapacitated, subtracts twice Exhaustion, then adds the resolved equipment bonus. Save totals have no new caps or rounding. Exhaustion is validated as an integer from zero through six in the vitality layer. Recording level six kills the character. The pure penalty also serves skill, Initiative and spell attack projections as before. Speed uses its separate penalty and save DCs stay unchanged.

| Source | Current ownership and behavior |
| --- | --- |
| Equipment | The backend resolves inventory definitions, wear or held slots, attunement, eligibility and loadout. Worn, attuned Ring and Cloak of Protection each give +1 to every save. Their bonuses add, with no save-specific cap or attribute split in this projection. Unattuned and unworn items contribute zero. No concentration-only equipment bonus is projected here. Physical D20 equipment restrictions remain separate from flat bonuses. |
| Aura of Protection | Warden 6+ includes the character’s own Spirit modifier, minimum +1. Replay needs no separate active aura record. Live incapacitation suppresses the contribution. The catalog describes a 10-foot Aura, 30 feet at Warden 18, and a choice of one overlapping Aura. This character-local projection does not query proximity or import allied Aura sources. Multiple synthetic Aura records do not stack onto the projected modifier. Feature-specific aura and ally eligibility remain backend-owned. |
| Feature modifiers | Holy Nimbus, Covenant and other conditional save advantages are represented separately from flat bonuses. Corsair and other save triggers still use their specialized behavior. Indomitable uses a new roll plus the projected attribute save and Calling level. Warden reroll and Stroke of Luck replace the original die in a supplied total. |
| Concentration | Uses projected Resolve with one die or the higher of two when the backend grants advantage. Item and Aura adjustments and Exhaustion are already present in the supplied modifier. |
| Relentless Rage | Server-generated saves add live projected Resolve. A confirmed total bypasses modifier recalculation. Stored response DC and count-derived transition DC retain their existing behavior. |
| Death saves | Natural roll thresholds and Defy Death remain independent of attribute modifiers and Training. |
| Spell and ability saves | Save DCs and target resolution are separate from the caster’s own projected save modifier. No change to the DC formulas or contextual target decisions. |

## Extraction and files

The new `/saving-throws` export provides `baseSavingThrowModifier({ score, trained, trainingBonus, auraBonus })`, `projectSavingThrowModifiers(base, { suppressedAura, exhaustion, equipmentBonus })` and `exhaustionD20Penalty(level)`. It reuses the attribute and Training modules. Backend replay still resolves class grants and Aura amount. Live projection resolves suppression, and magic projection returns the total applicable gear bonus while retaining its other side effects. Command validation, rolls, effects, authorization, persistence and receipts remain backend-owned.

- Engine: `package.json`, `README.md`, `src/saving-throws/index.js`, `tests/savingThrows.test.cjs`.
- Backend: `src/modules/archipelago/system/rules2024/engine.js`, `src/modules/archipelago/system/rules2024/selections.js`, `src/modules/archipelago/equipment/magicProjection.js`, `tests/phase2.commands.test.mjs`, `tests/support/phase3-saving-throws-probe.mjs`.
- Both applications: `package.json`, `package-lock.json`, `vendor/crossworld-sanguine-engine-0.19.0.tgz`.
- Frontend checkpoint: `docs/character-system/phase3-pass24.md`.

## Behavior and verification

Run `node crossworld_backend/tests/support/phase3-saving-throws-probe.mjs` from the workspace root. An optional output argument writes normalized rows. The matrix captures all six attribute and live save modifiers, Training, base and suppressed aura, active items, Exhaustion and neighboring projections, direct and authenticated concentration results, confirmed Rage saves and invalid inputs. It varies eight Calling and level fixtures, five exhaustion values, five gear states and three incapacity states. The targeted transaction test resolves a save exactly at DC under Aura, ring and Exhaustion, then verifies no duplicate commit or effect cleanup on historical replay, outsider rejection and digest conflict. Previous tests cover stale revisions and rollback.

| Matrix | Matched | SHA-256 |
| --- | ---: | --- |
| Pass 24 save projections | 4,275 | `566c03294a5609a9bc9bbe02ffcf9bb1208504339d00cfc7f6dfa56346f643a1` |
| Pass 23 concentration | 8,544 | `506000dcbaa7a56588724be57e53c50bb8d86186d624483c3c019c50f7c46710` |
| Pass 22 damage-triggered features | 2,410 | `fffabe75da72b679a1cd1680f715e9df2bbb43c1e8dd717db9cb05a5344881b6` |
| Pass 21 damage | 8,910 | `dd5831919a705cbb9e55a59c7b6bf5ef9577835e84e9394a2644c3d2c6fb94b9` |
| Pass 20 vitality | 3,960 | `6f1284e59b3c941510503478bd3d5e51cf9cbd5f57128e9fd2916360e28f9826` |
| Pass 19 rest | 2,640 | `7bc3d24375fde80a0dc7e18ac11c54285567f9a772cb9e490a27d1f35a3fa24b` |

Engine **64 passed** and frontend **113 passed**, both with zero failures and skips, backend **634 passed** (0 failed, 0 cancelled, 1 skipped). Both lint checks, frontend production build and all 185 backend syntax checks passed. Engine and backend Archipelago dependency analysis found zero cycles. The existing frontend map cycle was outside scope. Vite retains its bundle-size warning. Isolated MongoDB was skipped because `SA_PHASE2_TEST_MONGO_URI` was unset, so transaction verification uses the handler fixture. Both applications resolve 0.19.0 and byte-identical archives match their lockfile integrity values.

## Pass 25

Audit canonical effect-instance identity across creation, replacement, expiration, manual removal and pending references. Characterize collisions between exact IDs and feature-ID fallback, with duplicate legacy instances and historical receipts. Keep the catalog feature identity separate from instance identity and preserve observable behavior until the compatibility contract is established. Cross-character Aura projection remains a separate encounter integration question.

