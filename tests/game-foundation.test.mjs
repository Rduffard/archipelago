import assert from 'node:assert/strict';
import test from 'node:test';
import { appearanceLayers, defaultAppearance, facings } from '../src/game/scene/appearance.js';
import { createRequire } from 'node:module';
import { beastshifterForms, lineages, validateLineageSelection } from '@crossworld/sanguine-engine/lineages';
import { creationWithLineage, hasLineageChoices, lineageFields } from '../src/game/creator/lineageChoices.js';

const require = createRequire(import.meta.url);
const { spells } = require('@crossworld/sanguine-engine/spells');
const { feats, magicInitiateSpells } = require('@crossworld/sanguine-engine/feats');
const { skills } = require('../../crossworld_backend/src/modules/archipelago/system/catalog');

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

test('all six canonical Lineages serialize to engine-valid Ledger v4 creation selections', () => {
  const rules = { skills, feats, creation: { beastshifterForms } };
  const context = { skillIds: skills.map(skill => skill.id), trained: ['athletics'] };
  const roots = { size: 'medium', originId: 'yuma-core', backgroundId: 'deckhand', method: 'point-buy' };
  const selections = {
    human: { size: 'small', skill: 'stealth', originFeat: { id: 'alert' } },
    fishmen: { castingAttribute: 'wit' },
    stoneborn: {},
    'fey-touched': { heritage: 'greenwake', castingAttribute: 'spirit', skill: 'perception' },
    beastshifters: { size: 'small', skill: 'intimidation', formId: 'dock-rat' },
    changelings: { size: 'medium', skills: ['deception', 'persuasion'] },
  };
  assert.deepEqual(Object.keys(selections).sort(), lineages.map(lineage => lineage.id).sort());

  for (const lineage of lineages) {
    const values = selections[lineage.id];
    const fields = lineageFields(lineage, rules);
    assert.ok(hasLineageChoices(fields, values, rules), lineage.id);
    const creation = creationWithLineage(roots, lineage.id, values);
    assert.equal(creation.originId, roots.originId);
    assert.equal(creation.backgroundId, roots.backgroundId);
    assert.equal(Object.hasOwn(creation, 'size'), false);
    assert.deepEqual(validateLineageSelection(creation.lineage, context).issues, []);
    for (const { key } of fields) {
      const incomplete = { ...values, [key]: undefined };
      assert.equal(hasLineageChoices(fields, incomplete, rules), false, lineage.id + '.' + key);
    }
  }

  assert.deepEqual(creationWithLineage(roots, 'stoneborn', {}).lineage, { id: 'stoneborn' });
  assert.equal(roots.size, 'medium');
});

test('Human Origin feat selections retain their nested Training and spell options', () => {
  const featOptions = [
    { id: 'skilled', options: { training: ['skill:deception', 'skill:persuasion', 'tool:thieves-tools'] } },
    { id: 'magic-initiate', options: {
      list: 'shipwright', attribute: 'wit',
      cantrips: magicInitiateSpells('shipwright', 0).slice(0, 2),
      spell: magicInitiateSpells('shipwright', 1)[0],
    } },
  ];

  const rules = { skills, feats, spells, creation: { tools: ['thieves-tools'] } };
  const fields = lineageFields(lineages.find(lineage => lineage.id === 'human'), rules);
  for (const originFeat of featOptions) {
    const choices = { size: 'small', skill: 'stealth', originFeat };
    const { lineage } = creationWithLineage({ size: 'medium' }, 'human', choices);
    assert.ok(hasLineageChoices(fields, choices, rules));
    assert.equal(hasLineageChoices(fields, { ...choices, originFeat: { id: originFeat.id } }, rules), false);
    assert.deepEqual(lineage.choices.originFeat, originFeat);
    const context = { skillIds: skills.map(skill => skill.id), toolIds: ['thieves-tools'] };
    assert.deepEqual(validateLineageSelection(lineage, context).issues, []);
  }
});

test('creator navigation has eight stages and routes validation errors to their owning stage', async () => {
  const { creationStages, stageIndexFor } = await import('../src/game/creator/creationStages.js');
  assert.equal(creationStages.length, 8);
  assert.equal(stageIndexFor('Identity'), 0);
  assert.equal(stageIndexFor('Lineage'), 1);
  assert.equal(stageIndexFor('Origin'), stageIndexFor('Background'));
  assert.equal(stageIndexFor('Attributes'), stageIndexFor('Training'));
  assert.equal(stageIndexFor('Equipment'), stageIndexFor('Spells'));
  assert.equal(stageIndexFor('Review'), 7);
});
