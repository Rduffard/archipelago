# Core Checks

Core Checks are the primary rollable and investable stats in Sanguine Archipelago.

They define broad competence across combat, social pressure, exploration, utility, and arcane danger. They are the main numbers players improve over time.

## Canonical Role

Core Checks answer:

> What can this character generally do under pressure?

They are the game engine beneath moment-to-moment resolution. When a situation needs uncertainty, the GM should usually call for a Core Check.

## Structure

A Core Check has:

- a `key`
- a display `name`
- linked Attributes
- a summary
- examples
- a derived value

Current baseline formula:

```text
10 + linked Attribute values + Core Check investment
```

Core Check investment is stored separately from Attribute values so campaign advancement can increase broad competence without rewriting character identity.

## Selection Principle

When choosing a Core Check, ask what pressure the character is actually under.

- Is the danger direct violence, movement, or tempo? Use Combat.
- Is the conflict attention, leverage, trust, or intimidation? Use Social.
- Is the obstacle environment, route, pursuit, or fear? Use Exploration.
- Is the problem access, repair, containment, craft, or trade? Use Utility.
- Is the force spiritual, forbidden, ritual, or unseen? Use Arcane.

The same fictional action can use different checks depending on the pressure. Cutting a rope under calm conditions might be `Fabricate`; cutting it while falling through rigging might be `Reflex`; cutting it to drop a mast exactly across a boarding path might be `Precision`.

## Categories

### Combat

Examples:

- `Vitality`: blood loss, impact, poison, and staying alive.
- `Guard`: defense, blocking, resisting knockback.
- `Initiative`: opening tempo, ambush response, seizing a brief chance.
- `Skirmish`: fast violence, boarding actions, dueling tempo.
- `Precision`: aim, surgical action, controlled strikes.
- `Reflex`: evasive motion, quick reaction, split-second positioning.
- `Tactics`: discipline, planning, coordination, and smart movement under chaos.
- `Endurance`: fatigue, pain, deprivation, repeated strain.

### Social

Examples:

- `Grace`: poise, diplomacy, trust-building, and calm authority.
- `Guile`: misdirection, layered lies, secret negotiation.
- `Pressure`: intimidation, hard demands, and forcing a choice.
- `Conviction`: oaths, prayers, zeal, and soul-force declarations.
- `Flourish`: style, performance, ceremonial display, and magnetic motion.
- `Presence`: commanding attention.
- `Composure`: keeping judgment steady under social fire.

### Exploration

Examples:

- `Pursuit`: running something down, hunting, pressing through wildland chase.
- `Balance`: footing, deck control, rope bridges, and unstable surfaces.
- `Sense`: traps, weather signs, hidden patterns, and danger reading.
- `Nerve`: fear response, disaster judgment, and acting before panic wins.
- `Survival`: staying alive when the world stops cooperating.
- `Navigation`: routes, currents, and arrival.
- `Scouting`: advance movement, hidden approaches, and useful truth.
- `Adaptation`: changing plans cleanly when conditions become strange or hostile.

### Utility

Examples:

- `Leverage`: using strength intelligently against objects and environments.
- `Patch`: emergency repair and restoration.
- `Breach`: opening what was built to stay shut.
- `Salvage`: extracting value, secrets, and components from dangerous ruin.
- `Signal`: sending, intercepting, spoofing, or interpreting communication.
- `Secure`: containment and lockdown.
- `Fabricate`: assembling tools, decoys, and field infrastructure.
- `Broker`: moving permits, access, goods, and favors through the right hands.

### Arcane

Examples:

- `Focus`: magical control and resistance to strain.
- `Attunement`: resonance, spirits, relics, and the unseen pulse of place.
- `Invoke`: calling forces or entities into action.
- `Ward`: protection against intrusion and backlash.
- `Unravel`: breaking curses, exposing false miracles, and pulling hostile magic apart.
- `Corruption`: resisting, containing, or channeling tainted power.
- `Omen`: interpreting signs, dreams, warnings, and echoes.
- `Bind`: holding a spirit, oath, effect, or anomaly in a controlled state.

## Outcome Guidance

Core Checks should resolve meaningful uncertainty. Outcomes should include at least one of:

- position change
- harm or prevented harm
- resource loss or recovery
- clock progress
- access gained or denied
- faction response
- information revealed
- corruption exposure

Avoid rolls where failure only means "nothing happens." Nothing happening rarely fits the pressure-forward tone of the system.

## Anti-Patterns

Avoid:

- treating a Specialty as a replacement Core Check
- calling for a roll when the fiction has no uncertainty
- resolving every action as damage
- using the same Core Check for every clever plan
- granting universal check bonuses as routine progression

## Relationship To Specialties

Core Checks may display Attribute links and formulas. Specialties should not.

Specialties may list `relatedChecks` for context and prerequisites, but those references are not formulas. They communicate which broad competencies a technique tends to modify.

Example:

```js
{
  id: "brace",
  relatedChecks: ["guard", "endurance"]
}
```

This means Brace often modifies or depends on Guard and Endurance. It does not mean Brace is calculated from those checks.

## Preserved History: Pairing Matrix

The original pairing matrix is preserved in `systems/pairing-matrix.md`. It records the attribute-pair design language that informed many Core Checks. The current architecture treats Core Checks as the visible gameplay layer rather than exposing every pairing as a primary stat.
