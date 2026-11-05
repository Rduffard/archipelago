import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createRoll, skillIsTrained } from '../src/lib/roll.js'
import training from '../../crossworld_backend/src/modules/archipelago/system/blueprints/training.js'
const character = { attributes: { might: 16, agility: 8, wit: 12, spirit: 10, resolve: 14, instinct: 10 }, progression: { rank: 5 }, trainingRulesVersion: 1, training: [training[0].id], advancement: { savingThrows: ['agility', 'resolve'] } }
const roll = (type, attribute, extra = {}) => createRoll({ character, type, name: 'Check', attribute, ...extra }, () => 0.5)
test('attribute checks use only score modifiers', () => { assert.equal(roll('attribute', 'might').total, 14); assert.equal(roll('attribute', 'agility').total, 10) })
test('trained and untrained skills add proficiency exactly once', () => {
  assert.equal(roll('skill', 'might', { skillId: training[0].id }).total, 17)
  assert.equal(roll('skill', 'might', { skillId: 'unknown' }).total, 14)
  assert.equal(roll('skill', 'agility', { skillId: training[0].id }).total, 13)
  assert.throws(() => roll('skill', undefined, { skillId: training[0].id }))
})
test('saving throws use recorded save proficiencies independently of Training', () => {
  assert.equal(roll('save', 'agility').proficiency, 3)
  assert.equal(roll('save', 'might', { skillId: training[0].id }).proficiency, 0)
})
test('legacy selections cannot silently become trained General Skills', () => assert.equal(skillIsTrained({ ...character, trainingRulesVersion: undefined }, training[0].id), false))
const server = await createServer({ cacheDir: '.test-cache/interactive', server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
after(() => server.close())
const { default: Checks, RollResult } = await server.ssrLoadModule('/src/pages/CharacterSheet/CharacterChecks.jsx')
const { TrackerCard } = await server.ssrLoadModule('/src/pages/CharacterSheet/CharacterSheetSectionBits/CharacterSheetSectionBits.jsx')
const { getAbilityEntries } = await server.ssrLoadModule('/src/pages/CharacterSheet/characterSheetHelpers.js')
test('new progression never grants historical starter text as an acquired ability', () => {
  const calling = { starterAbility: 'Historical active', starterAbilityType: 'Active', starterAbilityRule: 'Historical rule' }
  assert.deepEqual(getAbilityEntries(character, calling), [])
  assert.equal(getAbilityEntries({}, calling)[0].label, 'Historical active')
})
test('sheet renders all canonical skills, six attributes and saves without rolling', () => {
  const html = renderToStaticMarkup(React.createElement(Checks, { character, skills: training }))
  assert.equal(training.length, 20)
  for (const skill of training) assert.ok(html.includes(skill.name))
  assert.equal((html.match(/attribute check/g) ?? []).length, 6)
  assert.equal((html.match(/saving throw&quot;|saving throw"/g) ?? []).length, 6)
  assert.ok(html.includes('Select an attribute, saving throw, or skill'))
  assert.ok(html.includes('Trained'))
})
test('natural extremes are labeled without changing totals or success rules', () => {
  for (const [sample, natural, tone] of [[0, 1, 'low'], [0.999, 20, 'high']]) {
    const result = createRoll({ character, type: 'attribute', name: 'Might', attribute: 'might' }, () => sample)
    const html = renderToStaticMarkup(React.createElement(RollResult, { roll: result }))
    assert.equal(result.total, natural + 3)
    assert.ok(html.includes(`sheet-roll--${tone}`)); assert.ok(html.includes(`Natural ${natural}`))
  }
})
test('legacy display retains unresolved labels and unavailable scores', () => {
  const html = renderToStaticMarkup(React.createElement(Checks, { character: { training: ['old-training'] }, skills: training, legacyOptions: [{ id: 'old-training', name: 'Historical choice' }] }))
  assert.ok(html.includes('Unresolved legacy Training')); assert.ok(html.includes('Historical choice')); assert.ok(html.includes('disabled'))
})
test('resource cards preserve depleted current and authoritative maximum', () => {
  const html = renderToStaticMarkup(React.createElement(TrackerCard, { label: 'Health', current: 0, max: 24, detail: 'Saved values' }))
  assert.ok(html.includes('Health')); assert.ok(html.includes('24')); assert.ok(html.includes('0'))
})
