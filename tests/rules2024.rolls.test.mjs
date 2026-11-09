import test from 'node:test';
import assert from 'node:assert/strict';
import { rollCheck,rollSheetCheck } from '../src/pages/Rules2024/rolls.js';

test('Silent Keel grants Stealth Advantage and cancels with Poisoned',()=>{
  const summary={paths:{},callingLevels:{},training:[],silentKeelStealth:true};
  const check={modifier:2,attribute:'agility',skillId:'stealth'};
  assert.equal(rollSheetCheck(summary,null,check,()=>0).dice.length,2);
  assert.equal(rollSheetCheck({...summary,conditions:['poisoned']},null,check,()=>0).dice.length,1);
  assert.equal(rollSheetCheck(summary,null,{...check,skillId:'acrobatics'},()=>0).dice.length,1);
});

test('Reliable Talent floors the chosen natural roll while Indomitable Might floors the total',()=>{
  const reliable=rollCheck(6,{minimumNatural:10},()=>0);assert.equal(reliable.total,16);assert.equal(reliable.rolledNatural,1);assert.equal(reliable.naturalFloorApplied,true);const mighty=rollCheck(-1,{minimumTotal:20},()=>0);assert.equal(mighty.total,20);assert.equal(mighty.minimumTotalApplied,true);assert.equal(rollCheck(-3,{},()=>0).total,-2);
});

test('sheet checks apply Exhaustion once to attributes, skills and saves and Poisoned only to checks',()=>{
  const s={exhaustion:2,conditions:['poisoned'],paths:{},callingLevels:{},training:[]};
  assert.equal(rollSheetCheck(s,null,{modifier:3,attribute:'wit'},()=>0).total,0);
  assert.equal(rollSheetCheck(s,null,{modifier:1,attribute:'wit',skillId:'arcana'},()=>0).modifier,1);
  assert.equal(rollSheetCheck(s,null,{modifier:1,attribute:'wit',savingThrow:true},()=>0).dice.length,1);
  assert.equal(rollSheetCheck(s,null,{modifier:1,attribute:'wit',skillId:'arcana'},()=>0).dice.length,2);
});

test('Path task Advantage is scoped to checks, cancels Poisoned and requires the unlocked feature',()=>{
  const s={conditions:[],paths:{gunslinger:'cinder-artillerist'},callingLevels:{gunslinger:7},training:[],detectFalseAdvantage:true},p={modifier:2,attribute:'wit',task:'inspect-explosives'};
  assert.equal(rollSheetCheck(s,null,p,()=>0).dice.length,2);
  assert.equal(rollSheetCheck(s,null,{...p,savingThrow:true},()=>0).dice.length,1);
  assert.equal(rollSheetCheck({...s,conditions:['poisoned']},null,p,()=>0).dice.length,1);
  assert.equal(rollSheetCheck({...s,callingLevels:{gunslinger:6}},null,p,()=>0).dice.length,1);
  assert.equal(rollSheetCheck(s,null,{...p,task:'detect-false'},()=>0).dice.length,2);
  assert.equal(rollSheetCheck({...s,detectFalseAdvantage:false},null,{...p,task:'detect-false'},()=>0).dice.length,1);
});

test('Danger Sense and restrained cancel on Agility saves, and Primal Knowledge does not double Exhaustion',()=>{
  const s={conditions:['restrained'],paths:{},callingLevels:{},training:[],agilitySaveAdvantage:true,exhaustion:1,mightAdvantage:true,rageSkillModifiers:{stealth:5}};
  assert.equal(rollSheetCheck(s,null,{modifier:2,attribute:'agility',savingThrow:true},()=>0).dice.length,1);
  const r=rollSheetCheck(s,null,{modifier:1,attribute:'agility',skillId:'stealth',primalKnowledge:true},()=>0);assert.equal(r.modifier,3);assert.equal(r.dice.length,2);
});

test('Barometer Instinct Advantage requires the chosen discipline, matching attribute, and a check',()=>{
  for(const [discipline,task,attribute,wrongAttribute] of [['weather','predict-weather','instinct','wit'],['signals','interpret-signals','wit','instinct']]){
    const s={paths:{navigator:'storm-broker'},callingLevels:{navigator:3},pathSelections:{navigator:{stormDiscipline:discipline}},training:[]},p={modifier:2,attribute,task};
    assert.equal(rollSheetCheck(s,null,p,()=>0).dice.length,2);
    assert.equal(rollSheetCheck(s,null,{...p,attribute:wrongAttribute},()=>0).dice.length,1);
    assert.equal(rollSheetCheck(s,null,{...p,savingThrow:true},()=>0).dice.length,1);
    assert.equal(rollSheetCheck({...s,pathSelections:{navigator:{stormDiscipline:discipline==='weather'?'signals':'weather'}}},null,p,()=>0).dice.length,1);
  }
});
test('sheet rolls apply authoritative modifiers and cancel advantage against disadvantage', () => {
  const values = [0.95, 0.05];
  const result = rollCheck(6, { disadvantage: true }, () => values.shift());
  assert.equal(result.natural, 2); assert.equal(result.total, 8);
  assert.deepEqual(result.dice, [20, 2]);
  assert.deepEqual(rollCheck(-1, { advantage: true, disadvantage: true }, () => 0.95),
    { natural: 20, dice: [20], modifier: -1, total: 19 });
  assert.throws(() => rollCheck(undefined));
});
