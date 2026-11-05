import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ cacheDir: 'node_modules/.vite-test-characterSheetModifiers.test', server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => server.close());
const { default: Overview } = await server.ssrLoadModule('/src/pages/CharacterSheet/CharacterSheetOverview/CharacterSheetOverview.jsx');

const keys = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct'];
const names = ['Might', 'Agility', 'Wit', 'Spirit', 'Resolve', 'Instinct'];
for (const [score, expected] of [[8, '-1'], [9, '-1'], [10, '+0'], [11, '+0'], [12, '+1'], [15, '+2'], [16, '+3'], [20, '+5']]) {
  test(`sheet renders all six attributes at ${score} with ${expected}`, () => {
    const track = { current: 0, max: 0 };
    const html = renderToStaticMarkup(React.createElement(Overview, {
      character: { attributes: Object.fromEntries(keys.map(key => [key, score])) },
      attributeDetails: {}, abilities: [], activeReputation: [], identityEntries: [], progressionEntries: [], traits: [],
      health: track, stamina: track, focus: track, corruption: track, woundTrack: track,
    }));
    const modifiers = [...html.matchAll(/class="character-sheet__reference-modifier">([^<]+)</g)].map(match => match[1]);
    assert.deepEqual(modifiers, keys.map(() => expected));
    for (const name of names) assert.ok(html.includes(`<strong>${name}</strong>`));
  });
}
