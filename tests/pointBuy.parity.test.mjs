import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as frontend from '../src/lib/pointBuy.js';
import backend from '../../crossworld_backend/src/modules/archipelago/system/pointBuy.js';
test('frontend/backend parity across every legal score for every key', () => {
  for (const key of Object.keys(frontend.createPointBuyAttributes())) {
    for (let score = 8; score <= 15; score += 1) {
      const attributes = { ...frontend.createPointBuyAttributes(), [key]: score };
      for (const name of ['calculatePointBuyCost','calculateRemainingPointBuyPoints','validatePointBuyAllocation']) {
        assert.deepEqual(frontend[name](attributes), backend[name](attributes));
      }
    }
  }
});
test('frontend/backend invalid and over-budget parity', () => {
  for (const attributes of [{},null,{ ...frontend.createPointBuyAttributes(), might: 7 },{ ...frontend.createPointBuyAttributes(), might: 16 },{ ...frontend.createPointBuyAttributes(), might: 8.5 },Object.fromEntries(Object.keys(frontend.createPointBuyAttributes()).map(k => [k,15]))]) {
    for (const name of ['calculatePointBuyCost','calculateRemainingPointBuyPoints','validatePointBuyAllocation']) {
      const outcome = (fn) => { try { return fn(attributes); } catch (e) { return [e.name,e.message]; } };
      assert.deepEqual(outcome(frontend[name]), outcome(backend[name]));
    }
  }
});
