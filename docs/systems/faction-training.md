# Faction Training

Faction training connects reputation to progression without turning reputation into a raw stat bonus.

## Purpose

Factions should teach distinctive ways of acting:

- industrial doctrine
- ritual discipline
- pirate boarding practice
- underworld leverage
- faith-order restraint
- sea-people survival knowledge

Faction rewards should usually unlock access, permissions, trainers, or Specialty branches.

Faction training answers:

> What has this institution taught you, and what does that training now cost you socially?

Training is both reward and affiliation. A character who learns a Yuma boarding doctrine, Lilin ritual restraint, or Free Captain ambush method has gained more than a technique. They have become readable to people who know what that training looks like.

## Rule Direction

Prefer:

- unlock a Specialty
- reduce a Specialty prerequisite
- unlock a rank IV trainer
- add a faction tag to a Specialty
- grant a once-per-session faction technique
- provide institutional cover for a restricted action
- create access to archives, docks, shrines, yards, courts, or safehouses

Avoid:

- generic `+1 to all checks`
- permanent math bonuses that ignore fiction
- faction rewards that feel interchangeable
- faction reputation as a universal vendor currency

## Training Access

Faction training should require one or more of:

- reputation threshold
- sponsor or instructor
- proof of ideology
- debt, oath, or service
- access to restricted tools or sites
- willingness to be publicly associated with the faction

Example:

`Free Captains +2` may unlock a boarding trainer, but the trainer expects the character to refuse imperial customs inspections when called upon. The reward creates future trouble.

## Obligation Patterns

Good faction obligations are concrete:

- deliver a sealed message
- hide a fugitive
- sabotage a rival supply line
- refuse an enemy faction's protection
- recover a relic before state agents can catalog it
- testify in a court where neutrality is impossible

Avoid vague obligations like "owe a favor" unless the campaign immediately names who can call it in and what kind of pressure it carries.

## Example

`Guild Consortium +2` might allow:

```js
{
  unlocksTraining: ["calibrate", "jury-rig"],
  prerequisiteAdjustment: {
    specialty: "calibrate",
    rank: 3,
    coreCheck: "fabricate",
    modifier: -1
  }
}
```

This expresses institutional access rather than abstract power.

## Example: Same Specialty, Different Doctrine

`Suppress` can be taught differently:

- Yuma doctrine: disciplined fire lanes, visible command, ammunition accountability.
- Free Captain doctrine: dirty angles, hatch control, escape routes, intimidation by reputation.
- Guild doctrine: turret rigging, smoke baffles, industrial cover, hazard control.

The registry may keep one Specialty id while faction tags and unlock text explain the source. If a doctrine becomes mechanically distinct enough, it can branch into a faction Specialty later.

## Design Constraint

Faction training should make characters more situated, not merely stronger. If two factions offer the same reward with different names and no different obligation, one of them is underdesigned.
