import assert from "node:assert/strict";
import { test, after } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createRequire } from "node:module";
import { createRoll } from "../src/lib/roll.js";
const require = createRequire(import.meta.url);
const gear = require("../../crossworld_backend/src/modules/archipelago/equipment");
const {
  fromCharacter,
} = require("../../crossworld_backend/src/modules/archipelago/combat/snapshot");
const server = await createServer({
  cacheDir: ".test-cache/equipment",
  server: { middlewareMode: true, watch: null, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(() => server.close());
const { EquipmentView } = await server.ssrLoadModule(
  "/src/components/equipment/EquipmentPanel.jsx"
);
const { default: LoadoutStep } = await server.ssrLoadModule(
  "/src/components/creator/LoadoutStep/LoadoutStep.jsx"
);
const { CombatPanel, CharacterSelection } = await server.ssrLoadModule(
  "/src/pages/CombatTest/CombatTestPage.jsx"
);
const character = (calling = "corsair") => ({
  _id: "character",
  owner: "owner",
  name: "Equipment Sailor",
  calling,
  attributes: {
    might: 16,
    agility: 14,
    wit: 10,
    spirit: 10,
    resolve: 12,
    instinct: 10,
  },
  progression: { rank: 1 },
  resources: { health: { current: 12, max: 20 } },
  ...gear.startingEquipment(),
});
test("sheet separates equipped and carried items, Guard, Training and unsupported properties", () => {
  const c = character();
  c.inventory.push(gear.issue({ definitionId: "shortbow" }));
  const html = renderToStaticMarkup(
    React.createElement(EquipmentView, { data: gear.derive(c) })
  );
  for (const text of [
    "Guard 12",
    "cutlass",
    "Equipped",
    "Carried",
    "Trained",
    "1d6",
    "slashing",
    "Only standard melee attacks",
  ])
    assert.ok(html.includes(text), text);
  const other = renderToStaticMarkup(
    React.createElement(EquipmentView, {
      data: gear.derive(character("tidecaller")),
    })
  );
  assert.match(other, /Untrained/);
});
test("creator selects Calling packages without obsolete equipment textareas", async () => {
  const { default: SystemContext } = await server.ssrLoadModule(
    "/src/contexts/SystemContext.jsx"
  );
  const { default: AuthContext } = await server.ssrLoadModule(
    "/src/contexts/AuthContext.jsx"
  );
  const blueprint = require("../../crossworld_backend/src/modules/archipelago/system");
  const html = renderToStaticMarkup(
    React.createElement(
      SystemContext.Provider,
      { value: { blueprint } },
      React.createElement(
        AuthContext.Provider,
        { value: { token: "test" } },
        React.createElement(LoadoutStep, {
          callingId: "corsair",
          loadout: { abilitySelections: {}, startingEquipment: null },
          onLoadoutChange: () => {},
        })
      )
    )
  );
  assert.match(html, /Starting equipment/);
  assert.match(html, /Shield/);
  assert.doesNotMatch(html, /creator-loadout-textarea/);
});
test("real-character combat presents explicit finesse attribute choice and no proficiency checkbox", () => {
  const encounter = fromCharacter(character(), "owner");
  const html = renderToStaticMarkup(
    React.createElement(CombatPanel, {
      encounter,
      busy: false,
      onCommand: () => {},
    })
  );
  assert.match(html, /value="might"/);
  assert.match(html, /value="agility"/);
  assert.match(html, /Attack with equipped weapon/);
  const select = renderToStaticMarkup(
    React.createElement(CharacterSelection, {
      characters: [],
      loading: false,
      selected: "",
      onSelect: () => {},
      onStart: () => {},
    })
  );
  assert.doesNotMatch(select, /checkbox|practice-only proficiency/);
});
test("armor consequences affect sheet physical tests and Stealth without changing unrelated rolls", () => {
  const c = character("tidecaller"),
    armor = gear.issue({ definitionId: "chain-mail" });
  c.inventory.push(armor);
  c.loadout.armor = armor.instanceId;
  c.equipmentDerived = gear.derive(c);
  const values = [0.95, 0.05];
  assert.equal(
    createRoll(
      { character: c, type: "attribute", name: "Might", attribute: "might" },
      () => values.shift()
    ).natural,
    2
  );
  assert.equal(
    createRoll(
      { character: c, type: "attribute", name: "Wit", attribute: "wit" },
      () => 0.95
    ).natural,
    20
  );
});
