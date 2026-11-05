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
  assert.equal(roll('skill', undefined, { skillId: training[0].id }).attribute, 'spirit')
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
  assert.equal((html.match(/class="is-trained"/g) ?? []).length, 1)
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
import { skillAttributes } from '../src/lib/roll.js'
import { selectCallingTraining, toggleTraining } from '../src/data/training.js'
import packages from '../../crossworld_backend/src/modules/archipelago/system/blueprints/startingProficiencies.js'
test('all twenty defaults match the approved attribute groups', () => {
  const groups = { spirit: ['bargain','deceive','perform','persuade','attune'], resolve: ['command','threaten','endure'], instinct: ['read','track','perception'], wit: ['navigate','investigate','lore','jury-rig','stabilize'], might: ['climb','dive'], agility: ['stealth','finesse'] }
  assert.deepEqual(Object.keys(skillAttributes).sort(), training.map(s => s.id).sort())
  for (const [attribute, ids] of Object.entries(groups)) for (const id of ids) assert.equal(skillAttributes[id], attribute)
})
test('every Calling package, free choice and substitution uses saved Training exactly once', () => {
  for (const pkg of Object.values(packages.callings)) {
    let owned = selectCallingTraining([], [], pkg.skills)
    assert.deepEqual(owned, [])
    for (const entry of training.filter(s => !owned.includes(s.id)).slice(0,4)) owned = toggleTraining(owned, entry.id, training)
    assert.equal(owned.length, 4)
    const c = { ...character, training: owned }
    for (const skill of training) {
      const result = createRoll({ character: c, type: 'skill', skillId: skill.id }, () => .5)
      assert.equal(result.attribute, skillAttributes[skill.id])
      assert.equal(result.proficiency, owned.includes(skill.id) ? 3 : 0)
    }
    const replacement = training.find(s => !owned.includes(s.id)).id
    const substituted = toggleTraining(toggleTraining(owned, owned[0], training), replacement, training)
    assert.equal(skillIsTrained({...c, training: substituted}, owned[0]), false)
    assert.equal(skillIsTrained({...c, training: substituted}, replacement), true)
  }
})
import { appendRollHistory } from '../src/lib/roll.js'
test('history preserves the newest eight mixed checks without mutating earlier results', () => {
  let history = []
  for (let i = 0; i < 10; i++) {
    const previous = [...history]
    const type = ['attribute','save','skill'][i % 3]
    const result = createRoll({ character, type, name: String(i), attribute: type === 'skill' ? undefined : 'might', skillId: 'climb' }, () => .5)
    const next = appendRollHistory(history, result)
    assert.deepEqual(history, previous)
    history = next
  }
  assert.deepEqual(history.map(r => r.name), ['9','8','7','6','5','4','3','2'])
})

