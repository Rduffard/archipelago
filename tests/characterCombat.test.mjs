import test, { after } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({
  cacheDir: ".test-cache/character-combat",
  server: { middlewareMode: true, watch: null, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(() => server.close());
const { CharacterSelection, CombatPanel } = await server.ssrLoadModule(
  "/src/pages/CombatTest/CombatTestPage.jsx"
);
const { combatRequest } = await server.ssrLoadModule("/src/lib/combatApi.js");
const { getCharacters } = await server.ssrLoadModule("/src/lib/api.js");
const c = {
  _id: "character-id",
  name: "Mara",
  calling: "tidecaller",
  progression: { rank: 3 },
  resources: { health: { current: 12, max: 20 } },
};
const render = (overrides = {}) =>
  renderToStaticMarkup(
    React.createElement(CharacterSelection, {
      characters: [c],
      loading: false,
      error: "",
      selected: "",
      onSelect: () => {},
      busy: false,
      onProficiency: () => {},
      onStart: () => {},
      ...overrides,
    })
  );
test("roster loading, empty, error and selection states", () => {
  assert.match(render({ loading: true }), /Loading characters/);
  assert.match(render({ characters: [] }), /No characters available/);
  assert.match(
    render({ error: "Unable to load" }),
    /role="alert">Unable to load/
  );
  assert.match(render(), /Mara.*tidecaller.*Level 3.*Health 12\/20/);
  assert.match(render(), /disabled="">Start Character Encounter/);
  assert.doesNotMatch(
    render({ selected: c._id }),
    /disabled="">Start Character Encounter/
  );
  assert.doesNotMatch(render(), /type="checkbox"/);
});
test("authenticated character loading, initialization, reload, fixture fallback, and API errors", async () => {
  const original = globalThis.fetch;
  const calls = [];
  let payload = [c],
    status = 200;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: status === 200,
      status,
      headers: { get: () => "application/json" },
      json: async () => payload,
    };
  };
  try {
    assert.deepEqual(await getCharacters("token"), [c]);
    assert.match(calls.at(-1).url, /\/archipelago\/characters$/);
    payload = { _id: "encounter", revision: 0 };
    assert.equal(
      (await combatRequest("token", "/from-character", { characterId: c._id }))
        ._id,
      "encounter"
    );
    assert.deepEqual(JSON.parse(calls.at(-1).options.body), {
      characterId: c._id,
    });
    assert.equal(calls.at(-1).options.headers.Authorization, "Bearer token");
    assert.equal((await combatRequest("token", "/encounter")).revision, 0);
    assert.equal(calls.at(-1).options.method, "GET");
    await combatRequest("token", "/test", {});
    assert.match(calls.at(-1).url, /\/test$/);
    status = 400;
    payload = { message: "Saved Health is invalid" };
    await assert.rejects(
      combatRequest("token", "/from-character", { characterId: c._id }),
      /Saved Health is invalid/
    );
  } finally {
    globalThis.fetch = original;
  }
});
test("panel displays saved player identity and snapshot boundary", () => {
  const player = {
    id: "player",
    name: "Mara",
    calling: "tidecaller",
    level: 3,
    health: { current: 12, max: 20 },
    weaponTraining: [],
    actions: 1,
  };
  const encounter = {
    combatants: [
      player,
      {
        id: "enemy",
        name: "Practice opponent",
        guard: 10,
        health: { current: 18, max: 18 },
        actions: 1,
      },
    ],
    activeCombatant: "player",
    events: [],
    round: 1,
    status: "active",
    revision: 0,
  };
  const html = renderToStaticMarkup(
    React.createElement(CombatPanel, {
      encounter,
      busy: false,
      onCommand: () => {},
    })
  );
  assert.match(html, /Mara.*tidecaller.*Level.*3.*Health.*12/);
  assert.match(html, /No equipped weapon attack/);
  assert.match(html, /External character edits are not synchronized/);
  assert.match(html, /disabled="">Attack with equipped weapon/);
});
