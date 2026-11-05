import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyOriginBonus } from '../src/lib/originBonus.js';
import backend from '../../crossworld_backend/src/modules/archipelago/system/originBonus.js';
import catalog from '../../crossworld_backend/src/modules/archipelago/system/blueprints/catalogs.js';
import { createPointBuyAttributes } from '../src/lib/pointBuy.js';
test('every origin has frontend/backend parity across scores 8 through 15', () => {
  for (const origin of catalog.origins) for (const key of Object.keys(createPointBuyAttributes())) for (let score = 8; score <= 15; score += 1) {
    const allocation = { ...createPointBuyAttributes(), [key]: score };
    assert.deepEqual(applyOriginBonus(allocation, origin.id, { catalogs: catalog }), backend.applyOriginBonus(allocation, origin.id));
  }
});
test('missing catalog and unsupported bonus fail explicitly', () => {
  assert.throws(() => applyOriginBonus(createPointBuyAttributes(), 'yuma-core'), TypeError);
  assert.throws(() => applyOriginBonus(createPointBuyAttributes(), 'bad', { catalogs: { origins: [{ id: 'bad', bonus: '+1 Strength' }] } }), TypeError);
});
test('invalid input error parity', () => {
  for (const [allocation,id] of [[{},'yuma-core'],[createPointBuyAttributes(),'unknown'],[{ ...createPointBuyAttributes(), might: 16 },'yuma-core']]) {
    const outcome = fn => { try { fn(); } catch (e) { return [e.name,e.message]; } };
    assert.deepEqual(outcome(() => applyOriginBonus(allocation,id,{ catalogs: catalog })), outcome(() => backend.applyOriginBonus(allocation,id)));
  }
});
