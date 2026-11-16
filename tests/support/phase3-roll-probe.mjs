import { createHash } from 'node:crypto';
import { rollCheck, rollSheetCheck } from '../../src/pages/Rules2024/rolls.js';

const base = { paths: { gunslinger: 'cinder-artillerist', navigator: 'storm-broker' },
  callingLevels: { gunslinger: 7 }, pathSelections: { navigator: { stormDiscipline: 'weather' } },
  training: ['stealth'], reliableTalent: true, minimumMightTestTotal: 18, mightAdvantage: true,
  athleticsAdvantage: true, agilitySaveAdvantage: true, silentKeelStealth: true, detectFalseAdvantage: true,
  rageSkillModifiers: { stealth: 6 } };
const checks = [
  { attribute: 'might' }, { attribute: 'agility', savingThrow: true },
  { attribute: 'agility', skillId: 'stealth', stealth: true },
  { attribute: 'agility', skillId: 'stealth', stealth: true, primalKnowledge: true },
  { attribute: 'might', skillId: 'athletics' }, { attribute: 'wit', task: 'inspect-explosives' },
  { attribute: 'wit', task: 'detect-false' }, { attribute: 'instinct', task: 'predict-weather' },
  { attribute: 'wit', task: 'interpret-signals' },
];
const random = () => { const values = [0.05, 0.95]; return () => values.shift(); };
const rows = [];
for (const check of checks) {
  for (const exhaustion of [0, 2, 5]) {
    for (const conditions of [[], ['poisoned'], ['restrained']]) {
      for (const rollMode of ['normal', 'advantage', 'disadvantage']) {
        for (const restricted of [false, true]) {
          const equipment = { restrictions: { physicalD20Disadvantage: restricted, stealthDisadvantage: restricted } };
          rows.push(rollSheetCheck({ ...base, conditions, exhaustion }, equipment, { modifier: 3, rollMode, ...check }, random()));
        }
      }
    }
  }
}
for (const modifier of [2, 7]) {
  for (const advantage of [false, true]) {
    for (const disadvantage of [false, true]) rows.push(rollCheck(modifier, { advantage, disadvantage }, random()));
  }
}
console.log(rows.length, createHash('sha256').update(JSON.stringify(rows)).digest('hex'));
