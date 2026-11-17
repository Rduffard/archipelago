import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { rolldown } from "rolldown";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
import { build } from '../../crossworld_backend/tests/helpers/rules2024.mjs';
const require = createRequire(import.meta.url);
const engine = require("../../crossworld_backend/src/modules/archipelago/system/characterSystem");
const rules = engine.blueprint;
const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, ".test-cache/rules2024/views.mjs");
const bundle = await rolldown({
  input: path.join(root, "src/pages/Rules2024/Rules2024Views.jsx"),
  external: (id) => id.startsWith("react"),
  platform: "node",
  transform: { jsx: { runtime: "automatic" } },
});
await bundle.write({ file: output, format: "esm" });
await bundle.close();
const { CallingProgression, LineageSummary, RulesSummary, RequiredChoice } = await import(
  pathToFileURL(output).href
);
test("Lineage sheet shows active form and saved Health while legacy sheets omit the panel", () => {
  const render = props => renderToStaticMarkup(React.createElement(LineageSummary, props));
  assert.equal(render({ rules }), "");
  const html = render({
    rules: { creation: {
      lineages: [{ id: "beastshifters", name: "Beastshifters" }],
      beastshifterForms: [{ id: "dock-rat", name: "Dock Rat" }],
    } },
    lineage: { id: "beastshifters", animalForms: {
      knownForms: ["dock-rat"], maximumHealth: { "dock-rat": 3, "reef-fox": 5 },
    } },
    state: { animalForms: {
      activeFormId: "dock-rat", healthByForm: { "dock-rat": 2, "reef-fox": 0 },
    } },
  });
  assert.match(html, /Beastshifters/);
  assert.match(html, /Dock Rat \(active\) · Health 2\/3/);
  assert.doesNotMatch(html, /reef-fox/);
});
for (const path of rules.paths) {
  test(`${path.name}: frontend renders the persisted level-twenty grants and choices`, () => {
    const fixture = build(path.callingId, 20, undefined, path.id);
    const summary = engine.replay(fixture.rulesLedger);
    const html = renderToStaticMarkup(React.createElement(RulesSummary, { summary, rules }));
    assert.ok(html.includes('Character level 20'));
    assert.ok(html.includes(path.name));
    for (const feature of rules.features.filter(f => f.ownerId === path.id))
      assert.ok(html.includes(feature.name.replaceAll('&', '&amp;').replaceAll("'", '&#x27;')), feature.name);
  });
}
test("frontend renders all eight backend-owned twenty-level timelines and original Paths", () => {
  for (const c of rules.callings) {
    const html = renderToStaticMarkup(
      React.createElement(CallingProgression, { calling: c, rules })
    );
    assert.ok(html.includes(c.name));
    assert.equal((html.match(/<tr>/g) ?? []).length, 21);
    assert.ok(html.includes(`d${c.hitDie} Hit Die`));
    assert.ok(html.includes("Choose a Path"));
    for (const path of rules.paths.filter((p) => p.callingId === c.id))
      assert.ok(html.includes(path.name));
    assert.ok(!html.includes("tier purchase"));
  }
});
test("temporary sheet consumes authoritative Health, Training, resources and preparation without formulas", () => {
  const summary = engine.create(
    { might: 13, agility: 13, resolve: 13, wit: 13, instinct: 13, spirit: 13 },
    { callingId: "doctor", choices: {} },
    { allowIncomplete: true }
  ).summary;
  const html = renderToStaticMarkup(
    React.createElement(RulesSummary, { summary, rules })
  );
  assert.ok(html.includes("Health 9"));
  assert.ok(html.includes("Doctor 1"));
  assert.ok(html.includes("Instinct, Spirit"));
  assert.ok(html.includes("Save DC 11"));
  assert.ok(html.includes("Prepared 4"));
  assert.ok(html.includes("GM-adjudicated rules"));
  assert.ok(html.includes("Full playtest readiness is pending"));
});
test("required Path UI only displays available owner-specific options supplied by backend", () => {
  const choice = { key: "pathId", count: 1, options: ["sanctuary-hand"] };
  const html = renderToStaticMarkup(
    React.createElement(RequiredChoice, { choice, rules, onChange: () => {} })
  );
  assert.ok(html.includes("Sanctuary Hand"));
  assert.ok(!html.includes("Field Surgeon"));
  assert.ok(!html.includes("Reef Knife"));
  assert.ok(html.includes('disabled=""'));
});

test("saved sheets render server-owned modifiers and every Calling without universal Stamina or Focus", () => {
  for (const calling of rules.callings) {
    const summary = engine.create(
      { might: 13, agility: 13, resolve: 13, wit: 13, instinct: 13, spirit: 13 },
      { callingId: calling.id, choices: {} }, { allowIncomplete: true }
    ).summary;
    const html = renderToStaticMarkup(React.createElement(RulesSummary,
      { summary, rules, title: "Character sheet" }));
    assert.ok(html.includes('aria-label="Character sheet"'));
    assert.ok(html.includes(`${calling.name} 1`));
    assert.ok(html.includes("Untrained"));
    assert.ok(html.includes("Saving throw"));
    assert.ok(!html.includes("Stamina"));
    assert.ok(!html.includes("Focus</h3>"));
  }
});

const resourceOutput = path.join(root, ".test-cache/rules2024/resources.mjs");
const resourceBundle = await rolldown({
  input: path.join(root, "src/pages/Rules2024/PersistentResources.jsx"),
  external: id => id.startsWith("react"), platform: "node",
  transform: { jsx: { runtime: "automatic" } },
});
await resourceBundle.write({ file: resourceOutput, format: "esm" });
await resourceBundle.close();
const { default: PersistentResources } = await import(pathToFileURL(resourceOutput).href);
test("persistent resource controls render saved expenditure rather than preview maxima", () => {
  const summary = engine.create(
    { might: 13, agility: 13, resolve: 13, wit: 13, instinct: 13, spirit: 13 },
    { callingId: "doctor", choices: {} }, { allowIncomplete: true }
  ).summary;
  const state = engine.runtime.initialize(summary);
  state.health.current = 3;
  state.slots[0] = 0;
  state.hitDice.d8 = 0;
  const html = renderToStaticMarkup(React.createElement(PersistentResources,
    { summary, state: JSON.parse(JSON.stringify(state)), busy: false, onOperation: () => {} }));
  assert.ok(html.includes("Health 3 / 9"));
  assert.ok(html.includes("Level 1 slots: 0 / 2"));
  assert.ok(html.includes('disabled=""'));
  assert.ok(html.includes("GM-recorded roll"));
  assert.ok(html.includes("Hit Dice remaining: 0d8"));
  assert.ok(html.includes('<button disabled="">Short Rest and spend Hit Die</button>'));
  assert.ok(html.includes("<button>Short Rest (no Hit Dice)</button>"));
  assert.ok(html.includes("<button>Long Rest</button>"));
  state.hitDice.d8 = 1;
  const recovered = renderToStaticMarkup(React.createElement(PersistentResources,
    { summary, state: JSON.parse(JSON.stringify(state)), busy: false, onOperation: () => {} }));
  assert.ok(recovered.includes("Hit Dice remaining: 1d8"));
  assert.ok(recovered.includes("<button>Short Rest and spend Hit Die</button>"));
});

test("creator choice tiles retain required Training and pending selections", () => {
  const choice = { id: 'doctor:1:backgroundSkills', key: 'backgroundSkills', count: 2,
    options: ['athletics', 'stealth', 'nature'], requiredOptions: ['athletics'] };
  const render = initialSelected => renderToStaticMarkup(React.createElement(RequiredChoice,
    { choice, rules, tiles: true, initialSelected }));
  const incomplete = render([]);
  assert.match(incomplete, /1 of 2 selected/);
  assert.match(incomplete, /disabled="" checked=""/);
  assert.match(incomplete, /disabled="">Confirm choice/);
  const restored = render(['stealth']);
  assert.match(restored, /2 of 2 selected/);
  assert.doesNotMatch(restored, /disabled="">Confirm choice/);
  assert.doesNotMatch(restored, /<select/);
});

test("creator outfitting tiles describe canonical packages and gold", () => {
  const choice = { key: 'equipment', callingId: 'doctor', options: ['a', 'gold'], count: 1 };
  const html = renderToStaticMarkup(React.createElement(RequiredChoice, { choice, rules, tiles: true }));
  assert.match(html, /Package A/);
  assert.match(html, /Chain Shirt/i);
  assert.match(html, /110 GP/);
});
