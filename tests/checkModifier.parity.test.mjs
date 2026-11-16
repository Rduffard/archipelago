import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateCheckModifier as frontend } from '../src/lib/checkModifier.js';
import { calculateCheckModifier } from '@crossworld/sanguine-engine/attributes';

test('frontend adapter uses the published modifier export across all keys and scores 1 through 30', () => {
  assert.equal(frontend, calculateCheckModifier);
  const modifiers = [-5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2,
    3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10];
  for (const key of ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']) {
    for (let score = 1; score <= 30; score += 1) {
      assert.equal(frontend({ [key]: score }, key), modifiers[score - 1]);
    }
  }
});
