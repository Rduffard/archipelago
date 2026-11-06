import assert from "node:assert/strict";
import { test, after } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createRequire } from "node:module";
import { createRoll } from "../src/lib/roll.js";
const require = createRequire(import.meta.url);
const blueprint = require("../../crossworld_backend/src/modules/archipelago/system");
const advancement = require("../../crossworld_backend/src/modules/archipelago/system/advancement");
const server = await createServer({
  cacheDir: ".test-cache/progression-v2",
  server: { middlewareMode: true, watch: null, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(() => server.close());
const { default: SystemContext } = await server.ssrLoadModule(
  "/src/contexts/SystemContext.jsx"
);
const { default: Abilities } = await server.ssrLoadModule(
  "/src/components/creator/AbilitiesStep/AbilitiesStep.jsx"
);
const { CREATOR_STEPS } = await server.ssrLoadModule(
  "/src/pages/CharacterCreator/logic/config/creatorConfig.js"
);
const { buildCharacterPayload } = await server.ssrLoadModule(
  "/src/pages/CharacterCreator/logic/payload/buildPayload.js"
);
const { createEmptyLoadout } = await server.ssrLoadModule(
  "/src/pages/CharacterCreator/logic/state/creatorState.js"
);
const { ProgressionTable } = await server.ssrLoadModule(
  "/src/components/creator/AbilitiesStep/AbilitiesStep.jsx"
);
test("creator has exactly the approved eight steps with no mandatory Path step", () => {
  assert.deepEqual(
    CREATOR_STEPS.map((s) => s.title),
    [
      "Roots",
      "Calling",
      "Attributes",
      "Training",
      "Abilities",
      "Loadout",
      "Details",
      "Review",
    ]
  );
  assert.equal("customAbilities" in createEmptyLoadout(), false);
  assert.equal(typeof buildCharacterPayload, "function");
});
test("Abilities shows automatic reference-only signatures, required choices, all levels and universal Path discovery", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      SystemContext.Provider,
      { value: { blueprint } },
      React.createElement(Abilities, {
        callingId: "corsair",
        training: ["climb", "read", "lore", "attune"],
        loadout: createEmptyLoadout(),
        onLoadoutChange: () => {},
      })
    )
  );
  for (const text of [
    "Sea Legs",
    "reference-only",
    "choose 2",
    "Climb Expertise",
    "Levels 1–20",
    "Drydock Ghost",
    "Omen Diver",
    "multiple Paths",
  ])
    assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /Add Ability|Custom Ability|effect-input/);
  const zero = renderToStaticMarkup(
    React.createElement(
      SystemContext.Provider,
      { value: { blueprint } },
      React.createElement(Abilities, {
        callingId: "warden",
        training: [],
        loadout: createEmptyLoadout(),
        onLoadoutChange: () => {},
      })
    )
  );
  assert.doesNotMatch(zero, /type="checkbox"/);
});
test("all six progression previews render twenty rows and locked future features", () => {
  for (const rows of Object.values(blueprint.abilityCatalog.tables)) {
    const html = renderToStaticMarkup(
      React.createElement(ProgressionTable, {
        rows,
        items: blueprint.abilityCatalog.items,
        level: 1,
      })
    );
    assert.equal((html.match(/<tr>/g) ?? []).length, 21);
    assert.match(html, /locked/);
  }
});
test("Expertise doubles Training Bonus once on trained skills, not saves or untrained skills", () => {
  const training = ["climb", "read", "lore", "attune"],
    attributes = {
      might: 14,
      agility: 10,
      wit: 10,
      spirit: 10,
      resolve: 10,
      instinct: 10,
    };
  const ledger = advancement.initialize(
    "corsair",
    attributes,
    {
      "choice:corsair:expertise:1": [
        "corsair:expertise-climb",
        "corsair:expertise-read",
      ],
    },
    training
  );
  const character = {
    training,
    trainingRulesVersion: 1,
    attributes,
    progression: { rank: 1 },
    advancement: ledger,
    progressionDerived: advancement.summarize(ledger, 1, { training }),
  };
  assert.equal(
    createRoll(
      { character, type: "skill", skillId: "climb", name: "Climb" },
      () => 0
    ).proficiency,
    4
  );
  assert.equal(
    createRoll(
      { character, type: "save", attribute: "agility", name: "Save" },
      () => 0
    ).proficiency,
    2
  );
  assert.equal(
    createRoll(
      { character, type: "skill", skillId: "stealth", name: "Stealth" },
      () => 0
    ).proficiency,
    0
  );
});
