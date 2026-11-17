import assert from 'node:assert/strict';
import test from 'node:test';
import { appearanceLayers, defaultAppearance, facings } from '../src/game/scene/appearance.js';
import { hasLineageChoices, lineageFields } from '../src/game/creator/lineageChoices.js';

test('appearance renders eight distinct facings and resolves disguises and forms as visual layers', () => {
  assert.equal(facings.length, 8);
  assert.equal(new Set(facings).size, 8);
  const body = { ...defaultAppearance, lineageId: 'changelings', disguise: { skinColor: '#593223' } };
  assert.deepEqual(appearanceLayers(body).map(layer => layer.kind), ['body', 'hair', 'clothing']);
  assert.equal(appearanceLayers(body)[0].color, '#593223');
  assert.equal(body.skinColor, defaultAppearance.skinColor);
  assert.deepEqual(appearanceLayers({ ...body, animalFormId: 'dock-rat' }), [{ kind: 'animal', id: 'dock-rat' }]);
});

test('Lineage fields resolve authoritative options and reject incomplete or stale choices', () => {
  const catalog = {
    skills: [{ id: 'deception', name: 'Deception' }, { id: 'persuasion', name: 'Persuasion' }],
    feats: [{ id: 'alert', category: 'origin' }, { id: 'tougher', category: 'general' }],
    creation: { beastshifterForms: [{ id: 'dock-rat', level: 1 }, { id: 'gray-wolf', level: 3 }] },
  };
  const fields = lineageFields({ choices: {
    size: ['small', 'medium'], skills: { count: 2, options: ['deception', 'persuasion'] },
  } }, catalog);
  assert.equal(hasLineageChoices(fields, { size: 'small', skills: ['deception', 'persuasion'] }), true);
  assert.equal(hasLineageChoices(fields, { size: 'large', skills: ['deception', 'persuasion'] }), false);
  assert.equal(hasLineageChoices(fields, { size: 'small', skills: ['deception', 'deception'] }), false);
  assert.equal(hasLineageChoices(fields, {}), false);
  assert.deepEqual(lineageFields({ choices: { originFeat: 'origin-feat', formId: 'level-one-form' } }, catalog)
    .map(({ options }) => options.map(option => option.id)), [['alert'], ['dock-rat']]);
});
