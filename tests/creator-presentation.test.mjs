import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePointBuyCost, POINT_BUY_BUDGET } from '@crossworld/sanguine-engine/point-buy';
import { callingRoles, recommendedAttributes } from '../src/game/creator/creationStages.js';
import { displayName, equipmentQuantities } from '../src/game/creator/choiceLabels.js';
import { creationWithLineage } from '../src/game/creator/lineageChoices.js';
import { lineageTraining, lineageTrainingErrorKey, unavailableTrainingOptions } from '../src/game/creator/trainingChoices.js';

test('each Calling has an optional recommendation that spends the full point-buy budget', () => {
  assert.deepEqual(Object.keys(recommendedAttributes), Object.keys(callingRoles));
  for (const [id, recommendation] of Object.entries(recommendedAttributes)) {
    assert.equal(calculatePointBuyCost(recommendation.scores), POINT_BUY_BUDGET, id);
  }
});

test('kit display combines duplicate item quantities without changing inventory records', () => {
  const items = Array.from({ length: 8 }, (_, index) => ({ name: 'Javelin', instanceId: index, quantity: 1 }));
  items.push({ name: 'Rations', quantity: 3 });
  assert.deepEqual(equipmentQuantities(items, item => item.name), [
    { name: 'Javelin', quantity: 8 }, { name: 'Rations', quantity: 3 },
  ]);
  assert.equal(items.length, 9);
});

test('language labels keep established origin names and punctuation', () => {
  const rules = { creation: { origins: [{ id: 'yuma-core', name: 'Yuma' }] } };
  assert.equal(displayName('language:yuma-core', rules), 'Yuma');
  assert.equal(displayName('common-sign-language', rules), 'Common Sign Language');
  assert.equal(displayName('thieves-cant', rules), "Thieves' Cant");
  assert.equal(displayName("Dungeoneer's Pack"), "Dungeoneer's Pack");
});

test('Human Skilled retains eligible Training and identifies a conflicting grant after a Background change', () => {
  const skills = ['athletics', 'stealth', 'history', 'perception', 'nature'].map(id => ({ id, name: displayName(id) }));
  const rules = { skills, creation: { tools: ['navigators-tools', 'smiths-tools'] } };
  const values = { size: 'medium', skill: 'stealth', originFeat: {
    id: 'skilled', options: { training: ['skill:history', 'skill:nature', 'tool:smiths-tools'] },
  } };
  const choices = {};
  const background = { skills: ['athletics', 'history'], tool: 'navigators-tools' };
  const summary = { training: background.skills, equipmentTraining: { tools: [background.tool] } };
  const [decision] = lineageTraining([], values, rules, summary, background, {}, choices);
  assert.equal(decision.invalid, true);
  assert.equal(decision.complete, false);
  assert.deepEqual(decision.selected, ['skill:nature', 'tool:smiths-tools']);
  assert.equal(decision.entries.find(option => option.id === 'skill:history').unavailable, 'Already granted by your Background.');
  assert.equal(decision.entries.find(option => option.id === 'skill:stealth').unavailable, 'Already granted by your Lineage.');
  assert.equal(decision.entries.find(option => option.id === 'tool:navigators-tools').unavailable, 'Already granted by your Background.');
  values.originFeat.options.training = [...decision.selected, 'skill:perception'];
  assert.equal(lineageTraining([], values, rules, summary, background, {}, choices)[0].complete, true);
  assert.deepEqual(creationWithLineage({ size: 'medium', originId: 'yuma-core' }, 'human', values), {
    originId: 'yuma-core', lineage: {
      id: 'human', size: 'medium', choices: { skill: values.skill, originFeat: values.originFeat },
    },
  });
  assert.equal(lineageTrainingErrorKey('creation.lineage.choices.originFeat.options.training'), 'training');
});

test('already granted languages use the rules preview eligibility and preserve their provenance', () => {
  assert.deepEqual(unavailableTrainingOptions(
    { key: 'callingLanguages', options: ['elvish'] },
    { languages: ['language:yuma-core', 'draconic', 'thieves-cant', 'elvish'] },
    { languages: ['draconic'] },
  ), {
    'language:yuma-core': 'Already granted by your Origin.',
    draconic: 'Already granted by your standard language choice.',
    'thieves-cant': 'Already granted by your Calling.',
  });
});
