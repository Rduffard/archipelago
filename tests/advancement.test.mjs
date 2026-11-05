import assert from 'node:assert/strict';
import {test,after} from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import engine from '../../crossworld_backend/src/modules/archipelago/system/advancement.js';
import rules from '../../crossworld_backend/src/modules/archipelago/system/blueprints/progression.js';
import packages from '../../crossworld_backend/src/modules/archipelago/system/blueprints/startingProficiencies.js';
import training from '../../crossworld_backend/src/modules/archipelago/system/blueprints/training.js';
import legacyTraining from '../../crossworld_backend/src/modules/archipelago/system/blueprints/legacyTraining.js';
import {unspentRewards,advancementRequest} from '../src/lib/advancement.js';
import {getTrainingOptions,toggleTraining} from '../src/data/training.js';
const server=await createServer({cacheDir:'.test-cache/advancement',server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
after(()=>server.close());
const {default:Advancement}=await server.ssrLoadModule('/src/pages/CharacterSheet/CharacterAdvancement.jsx');
const {default:Skills}=await server.ssrLoadModule('/src/components/creator/SkillsStep/SkillsStep.jsx');
const scores={might:16,agility:14,wit:13,spirit:12,resolve:10,instinct:8};
const fresh=()=>({progression:{rank:1},advancement:engine.initialize('corsair',scores)});
test('frontend reward display agrees with server accounting at every level',()=>{
 for(let n=1;n<=20;n++) {
  const character={...fresh(),progression:{rank:n}};
  assert.deepEqual(unspentRewards(character,rules),engine.summarize(character.advancement,n).unspent);
 }
 const character=fresh(),next=engine.advance(character.advancement,1,{expectedRevision:0,level:8,exchanges:[{rewardId:'attribute:4',kind:'path'}],spends:[{rewardId:'attribute:8',kind:'attribute',increases:{might:2}}]});
 assert.deepEqual(unspentRewards({progression:{rank:8},advancement:next.ledger},rules),next.summary.unspent);
});
test('requests contain operations and expected revision, never client ownership or balances',()=>{
 assert.deepEqual(advancementRequest(fresh(),{level:4}),{advancementOperation:{level:4,expectedRevision:0}});
});
test('sheet shows retained rewards, pending content, passive, and equipment status',()=>{
 const html=renderToStaticMarkup(React.createElement(Advancement,{character:fresh(),rules,startingPackage:packages.callings.corsair,onAdvance:()=>{}}));
 for(const text of ['Sea Legs','Unspent rewards: 1','Calling selections await reviewed','pending review','Record level','Item categories and combat effects await review']) assert.ok(html.includes(text),text);
 assert.equal(html.includes('Apply improvement'),false);
});
test('attribute reward controls and exchange cap reflect saved ledger',()=>{
 const c=fresh(),next=engine.advance(c.advancement,1,{expectedRevision:0,level:12,exchanges:[{rewardId:'attribute:4',kind:'path'},{rewardId:'attribute:8',kind:'calling'}]});
 const html=renderToStaticMarkup(React.createElement(Advancement,{character:{progression:{rank:12},advancement:next.ledger},rules,onAdvance:()=>{}}));
 assert.ok(html.includes('Level 12 attribute milestone'));assert.ok(html.includes('Apply improvement'));
 assert.equal(html.includes('Exchange for Calling selection'),false);
});
test('historical sheet has no advancement write controls',()=>{
 const html=renderToStaticMarkup(React.createElement(Advancement,{character:{progression:{rank:12}},rules,onAdvance:()=>{}}));
 assert.ok(html.includes('reviewed upgrade'));assert.equal(html.includes('<button'),false);
});

test('sheet distinguishes acquired milestones, exchanges, Path tiers and future rewards',()=>{
 const character=fresh();
 character.advancement.spends=[{rewardId:'attribute:4',kind:'attribute',increases:{might:2}},{rewardId:'path:3',kind:'path',pathId:'historical-path',tier:1},{rewardId:'calling:1',kind:'calling',abilityId:'recorded-ability'}];
 character.advancement.exchanges=[{rewardId:'attribute:8',kind:'calling'}];
 character.progression.rank=8;
 const html=renderToStaticMarkup(React.createElement(Advancement,{character,rules,onAdvance:()=>{}}));
 for(const text of ['might +2','historical-path','tier 1','recorded-ability','attribute:8 exchanged for calling','Locked future rewards','Level 20']) assert.ok(html.includes(text),text);
});
test('legacy Training is shown unchanged; retired IDs can be removed explicitly',()=>{
 assert.equal(getTrainingOptions({training,legacyTraining},{training:['board']}).length,23);
 assert.equal(getTrainingOptions({training,legacyTraining},{trainingRulesVersion:1}).length,20);
 assert.deepEqual(toggleTraining(['board','shoot','deceive','navigate'],'board',training),['shoot','deceive','navigate']);
 const html=renderToStaticMarkup(React.createElement(Skills,{trainingOptions:training,training:['board','shoot','deceive','navigate'],historical:true,startingPackage:packages.callings.corsair,onTrainingToggle:()=>{}}));
 assert.ok(html.includes('Legacy Training: board'));assert.ok(html.includes('explicit replacement'));assert.ok(html.includes('Saving throws: agility, resolve'));
});
