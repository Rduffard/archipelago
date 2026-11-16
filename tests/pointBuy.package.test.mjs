import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as frontend from '../src/lib/pointBuy.js';
import * as engine from '@crossworld/sanguine-engine/point-buy';

test('frontend adapter uses the package exports for each point-buy operation', () => {
  for (const name of [
    'createPointBuyAttributes',
    'calculatePointBuyCost',
    'calculateRemainingPointBuyPoints',
    'validatePointBuyAllocation',
  ]) {
    assert.equal(frontend[name], engine[name], name);
  }
});

test('every legal point-buy score retains its price across all attributes', () => {
  const costs = [0, 1, 2, 3, 4, 5, 7, 9];
  for (const key of Object.keys(frontend.createPointBuyAttributes())) {
    costs.forEach((cost, index) => {
      const scores = { ...frontend.createPointBuyAttributes(), [key]: index + 8 };
      assert.equal(frontend.calculatePointBuyCost(scores), cost);
      assert.equal(frontend.calculateRemainingPointBuyPoints(scores), 27 - cost);
      assert.deepEqual(frontend.validatePointBuyAllocation(scores), { cost, remaining: 27 - cost });
    });
  }
});

test('invalid point-buy scores reject and overspending retains its negative remainder', () => {
  const base = frontend.createPointBuyAttributes();
  for (const invalid of [null, {}, { ...base, might: 8.5 }]) {
    assert.throws(() => frontend.calculatePointBuyCost(invalid), TypeError);
  }
  for (const might of [7, 16]) {
    assert.throws(() => frontend.calculatePointBuyCost({ ...base, might }), RangeError);
  }
  const allMax = Object.fromEntries(Object.keys(base).map(key => [key, 15]));
  assert.equal(frontend.calculateRemainingPointBuyPoints(allMax), -27);
  assert.throws(() => frontend.validatePointBuyAllocation(allMax), /27-point budget/);
});
