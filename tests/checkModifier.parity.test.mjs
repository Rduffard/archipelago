import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateCheckModifier as frontend } from '../src/lib/checkModifier.js';
import backend from '../../crossworld_backend/src/modules/archipelago/system/checkModifier.js';
test('frontend/backend parity across all keys and scores 1 through 30', () => {
  for (const key of ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']) {
    for (let score = 1; score <= 30; score += 1) {
      assert.equal(frontend({ [key]: score }, key), backend.calculateCheckModifier({ [key]: score }, key));
    }
  }
});
