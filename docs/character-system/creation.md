# Character creation and advancement

The backend computes every grant and total. A draft contains choices, not authoritative final statistics. Start at level 1; higher-level creation must replay each ordinary advancement with all required choices. GM permission never bypasses ownership or schema validation.

| Step | Required input and validation | Server result |
| --- | --- | --- |
| 1. Identity | Trimmed name 2–80 characters, notes at most 5000, optional HTTPS portrait URL, pronouns/appearance at most 1000 each | Narrative fields only |
| 2. Origin | Exactly one of 18 canonical IDs | Fixed +1 attribute and cultural language; no Calling restriction |
| 3. Background | One package or complete custom choices | Total +2 attributes, two skills, one tool, one Origin feat and equipment |
| 4. Calling | Exactly one of eight, no attribute minimum | Hit Die, saving throws, Training and level-one features |
| 5. Attributes | Six integer base scores 8–15, total point cost at most 27 | Apply origin +1, then background +2 or +1/+1; final creation cap 17 |
| 6. Training | Exact Calling count from its eligible skill list; no duplicate selection | Skills, saves and tools; Corsair selects two trained skills for Expertise |
| 7. Feats and feature choices | Background Origin feat with all subchoices; every level-one feature choice | Complete grants including mastery types and Divine Order |
| 8. Equipment | Calling package or gold; background package or 50 GP; only affordable purchases | Unique inventory instances, copper balance and explicit legal loadout |
| 9. Spells | Exact cantrip/preparation counts and eligible lists; Shipwright six level-one folio spells | Persisted spells and casting choices |
| 10. Review | Complete server preview, rules version and operation ID | Atomic creation at revision 0, full Health, Hit Dice and unlocked resources |

Point-buy costs: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9. Unspent points are permitted and visible in review. Store base scores separately from origin/background/advancement bonuses so they cannot be applied twice. Attribute modifier is floor((score−10)/2).

All cultures use a new neutral first-edition lineage baseline: Humanoid, Medium or Small chosen at creation, 30-foot walking Speed, no automatic darkvision or SRD species package. This is a mechanical design decision, not an assertion about established lore. Common plus origin cultural language plus one other standard language are granted; duplicate choices are replaced. Feature-granted languages are additional.

Maximum Health at level 1 is Hit Die face + Resolve modifier, minimum 1. Every later level adds fixed Hit Die/2+1 + Resolve modifier, minimum 1 for that level. Recalculate all contributions when Resolve changes. On a maximum increase preserve missing Health by increasing current by the maximum's increase; on a decrease clamp current to the new maximum. Temporary Health remains separate. Hit Dice capacity equals level and is full at creation. Guard, initiative, movement and attacks follow training.md and equipment.md. The client cannot submit final values.

## Advancement

Use milestones only: campaign GM authorization or owner-controlled solo character. Advance exactly one level, maximum 20. Preview all feature grants, choices, replacements, derived-stat deltas and resource consequences. At level 3 select exactly one of the Calling's four Paths, independent of origin. Ordinary Attribute Improvement/feat opportunities are 4, 8, 12 and 16; Corsair also 10; Gunslinger also 6 and 14. At 19 choose one eligible feat including an Epic Boon. Every opportunity uses a distinct grantKey, Calling:level:feat.

An ordinary feat opportunity may select an eligible Origin or General feat; Epic Boons require level 19. ASI is repeatable; other repeatability follows feats.md. All required Training, spell and Path choices must be complete before saving. Automatic grants apply once per source-level key. Upgrades replace earlier values rather than creating duplicates. A Path cannot change through ordinary advancement; an explicit GM-approved rebuild requires a complete preview, audit record and resource consequences.

Leveling preserves expenditures and does not count as a rest. For example, Second Wind spent 2/max 2 becoming max 3 leaves one available. Rest/level replacements occur only at the source feature's permitted boundary. Failed preview/commit changes nothing. Narrative edits never grant mechanics.

The frontend retains the draft across all ten steps, explains unavailable choices, focuses invalid fields and separates server preview from saved state. Canceling advancement writes nothing. Save/reload preserves chosen options and derived-stat parity.
