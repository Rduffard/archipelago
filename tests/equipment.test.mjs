import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { rolldown } from 'rolldown';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build, rules } from '../../crossworld_backend/tests/helpers/phase2.mjs';
const require = createRequire(import.meta.url);
const persistence = require('../../crossworld_backend/src/modules/archipelago/characters/rules2024');
const equipment = require('../../crossworld_backend/src/modules/archipelago/equipment');
const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, '.test-cache/canonical-equipment.mjs');
const bundle = await rolldown({ input: path.join(root, 'src/pages/Rules2024/PersistentEquipment.jsx'),
  external: id => id.startsWith('react'), platform: 'node', transform: { jsx: { runtime: 'automatic' } } });
await bundle.write({ file: output, format: 'esm' }); await bundle.close();
const { default: Equipment } = await import(pathToFileURL(output).href);
for (const calling of rules.blueprint.callings) {
  test(`${calling.name}: saved equipment renders owned inventory, loadout, Guard and mastery`, () => {
    const fixture = build(calling.id);
    let c = persistence.build({ name: 'Sailor', creation:fixture.ledger.creation, attributes: fixture.ledger.baseAttributes, firstLevel: fixture.ledger.levels[0] });
    const sword = equipment.issue({ definitionId: 'cutlass' });
    c.inventory.push(sword); c.loadout.mainHand = sword.instanceId;
    c = persistence.decorate(c);
    const before = structuredClone(c);
    const html = renderToStaticMarkup(React.createElement(Equipment, { character: c, rules: rules.blueprint, busy: false, onSave() {} }));
    for (const text of ['Equipment and Guard', 'Main hand', 'Off hand', 'Armor', 'Cutlass', 'Weapon mastery', 'Buy item', 'Save current loadout']) assert.ok(html.includes(text), text);
    assert.deepEqual(c, before);
    assert.ok(!html.includes('Focus pool'));
  });
}
