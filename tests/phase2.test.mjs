import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {rolldown} from 'rolldown';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import {createRequire} from 'node:module';
import {build,rules} from '../../crossworld_backend/tests/helpers/phase2.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const gear=createRequire(import.meta.url)('../../crossworld_backend/src/modules/archipelago/equipment');
async function component(name){
  const output=path.join(root,'.test-cache/phase2/'+name+'.mjs');
  const bundle=await rolldown({input:path.join(root,'src/pages/Rules2024/'+name+'.jsx'),external:id=>id.startsWith('react'),platform:'node',transform:{jsx:{runtime:'automatic'}}});
  await bundle.write({file:output,format:'esm'});await bundle.close();return (await import(pathToFileURL(output).href)).default;
}
const Abilities=await component('AbilityActions'),Spells=await component('SpellActions');
const Relays=await component('RelayControls'),Replacements=await component('AdvancementReplacements'),Equipment=await component('PersistentEquipment');
const Charges=await component('ChargeControls'),Result=await component('OperationResult');
const StateControls=await component('CharacterStateControls'),Rest=await component('RestPlanner');
const Rerolls=await component('SpellRerolls');
const Feats=await component('FeatControls'),Strikes=await component('StrikeControls');
const Tools=await component('ToolCheckControls');
const CorsairPaths=await component('CorsairPathControls');
const Envoy=await component('EnvoyControls');
const Identity=await component('IdentityFields');
const Audit=await component('AuditHistory');
const Conduit=await component('ConduitControls');
const Covenant=await component('CovenantControls');
const WardenPaths=await component('WardenPathControls'),Authority=await component('CharacterAuthorityControls'),Folio=await component('FolioControls');
const ReaverPaths=await component('ReaverPathControls');
const NavigatorPaths=await component('NavigatorPathControls'),CasterPaths=await component('CasterPathControls');
const GunslingerPaths=await component('GunslingerPathControls');
const Rebuild=await component('RebuildControls');
const Attacks=await component('AttackRecords'),GrayNet=await component('GrayNetControls');
const Utility=await component('UtilityControls'),Riders=await component('DamageRiderControls'),Healing=await component('HealingSpellControls'),Objects=await component('ObjectUseControls'),Errors=await component('CommandError');

test('attack and Gray Net controls expose first-attack decisions, off-turn records and actual source weapons',()=>{
  const b=build('reaver',9,'bloodwake'),html=renderToStaticMarkup(React.createElement(Attacks,{character:{...b.character,rulesSummary:b.summary},busy:false,onCommand(){}}));for(const label of ['External attack turn ID','Choose Reckless Attack','Frenzy weapon','Critical Hit'])assert.ok(html.includes(label),label);
  const n=build('navigator',7,'gray-net'),gray=renderToStaticMarkup(React.createElement(GrayNet,{character:{...n.character,rulesSummary:n.summary,equipment:gear.derive(n.character)},rules:rules.blueprint,busy:false,onCommand(){}}));for(const label of ['Gray Net prey and defense','Prey equipped weapon','Original Horde Breaker target ID','Replace these choices'])assert.ok(gray.includes(label),label);
});

test('healing and object controls expose native source identity, accepted recovery and actual item costs',()=>{
  const b=build('doctor',6,'sanctuary-hand');b.character.rulesRuntime.castings=[{castId:'cure',spellId:'cure-wounds',targets:['ally'],slotLevel:1}];const character={...b.character,rulesSummary:b.summary},healing=renderToStaticMarkup(React.createElement(Healing,{character,rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Recorded healing casting','original recipients satisfy','Prayer of Healing','Resolve and save spell healing'])assert.ok(healing.includes(text),text);
  const objects=renderToStaticMarkup(React.createElement(Objects,{character,rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Carried mundane object','Object-use event ID','Fast Hands changes Utilize only'])assert.ok(objects.includes(text),text);
});
test('utility and damage riders expose the required triggers and conflict recovery retains proposed choices',()=>{
  const b=build('corsair',3,'reef-knife'),utility=renderToStaticMarkup(React.createElement(Utility,{character:{...b.character,rulesSummary:b.summary},busy:false,onCommand(){}}));assert.ok(utility.includes('Speed remains zero')||utility.includes('sets all Speeds to zero'));const d=build('doctor',14,'sanctuary-hand'),rider=renderToStaticMarkup(React.createElement(Riders,{character:{...d.character,rulesSummary:d.summary},rules:rules.blueprint,busy:false,onCommand(){}}));assert.ok(rider.includes('Rider source casting or equipped weapon'));const error=renderToStaticMarkup(React.createElement(Errors,{message:'Changed',fieldPath:'expectedRevision',conflict:true,onRefresh(){}}));for(const text of ['role="alert"','tabindex="-1"','proposed choices are still here','retain drafts'])assert.ok(error.includes(text),text);
});
const MagicItems=await component('MagicItemControls');

test('magic item controls expose identified scroll costs and full Short Rest attunement',()=>{
  for(const definitionId of ['spell-scroll','cloak-of-protection']){const b=build('shipwright',3);b.character.inventory.push(gear.issue({definitionId,...(definitionId==='spell-scroll'?{spellId:'magic-missile'}:{})}));const html=renderToStaticMarkup(React.createElement(MagicItems,{character:{...b.character,rulesSummary:rules.runtime.project(b.summary,b.character.rulesRuntime,b.character)},rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Identified magic item','SRD 5.2.1','casting was not interrupted'])assert.ok(html.includes(text),text);assert.ok(html.includes(definitionId==='spell-scroll'?'Attempt to copy and destroy this scroll':'Start Short Rest to attune'));}
});

test('rebuild offers complete ledger choices and explicit resource consequences without editing raw JSON',()=>{
  const b=build('gunslinger',3,'iron-suppressor'),character={...b.character,permissions:{isOwner:true,canGM:true},rulesSummary:b.summary},html=renderToStaticMarkup(React.createElement(Rebuild,{character,rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Rebuild reason','Rebuilt Calling','Rebuilt origin','Rebuilt background','Choose level 3 again','Preview rebuild choices and consequences','never heals','no replacement equipment'])assert.ok(html.includes(text),text);assert.ok(!html.includes('textarea'));
});

test('Gunslinger controls distinguish spent ammunition, voluntary movement and secondary control',()=>{
  for(const path of ['iron-suppressor','brass-outrider']){const b=build('gunslinger',18,path),html=renderToStaticMarkup(React.createElement(GunslingerPaths,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Ammunition for Crossing Denied or Horizon','Record movement before the hit','zero extra damage','without spending ammunition again'])assert.ok(html.includes(text),text);}
});

test('Navigator controls expose mark, cover, guided ally and distinct teleport destination requirements',()=>{
  for(const path of ['starwake-pilot','mangrove-stalker']){const b=build('navigator',15,path),html=renderToStaticMarkup(React.createElement(NavigatorPaths,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Guided ally within five feet','Homeward destinations, self first','Hunter’s Mark','Unresolved incoming damage'])assert.ok(html.includes(text),text);}
});
test('Caster Path controls expose saved casting provenance and unresolved save choices',()=>{
  for(const path of ['memory-echo','tempest-heart']){const b=build('tidecaller',18,path),html=renderToStaticMarkup(React.createElement(CasterPaths,{character:{...b.character,rulesSummary:b.summary},busy:false,onCommand(){}}));for(const text of ['Source casting','Failed save attribute','Condition source','Conversion is consumed','Training Bonus'])assert.ok(html.includes(text),text);}
});

test('Reaver controls distinguish enemy turns, source escape DCs and supporting leap spaces',()=>{
  const b=build('reaver',14,'thunderhide'),html=renderToStaticMarkup(React.createElement(ReaverPaths,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));for(const text of ['Enemy turn ID for Walking Storm','Source save or grapple DC','supporting landing space','Stormhide leap','Walking Storm: enemy turn'])assert.ok(html.includes(text),text);
});

test('Free Port and Vigil controls expose source-specific cures, original saves and timed hit events',()=>{
  for(const path of ['oath-of-the-free-port','lantern-vigil']){const b=build('warden',20,path),character={...b.character,rulesSummary:rules.runtime.project(b.summary,b.character.rulesRuntime)},html=renderToStaticMarkup(React.createElement(WardenPaths,{character,rules:rules.blueprint,busy:false,onCommand(){}}));for(const label of ['Condition source to end or reroll','Original failed save d20','first weapon hit','Dawn target turn ID'])assert.ok(html.includes(label),label);}
});
test('campaign player controls cannot expose GM award buttons',()=>{
  const b=build('gunslinger'),character={...b.character,campaignId:'campaign',permissions:{isOwner:true,canGM:false,canAdvance:false},rulesSummary:b.summary};let html=renderToStaticMarkup(React.createElement(Authority,{character,rules:rules.blueprint,busy:false,onCommand(){}}));assert.ok(html.includes('must authorize the next milestone'));assert.ok(!html.includes('Record GM award'));
  character.permissions={isOwner:false,canGM:true,role:'campaign-gm'};html=renderToStaticMarkup(React.createElement(Authority,{character,rules:rules.blueprint,busy:false,onCommand(){}}));assert.ok(html.includes('Authorize level 2 milestone'));assert.ok(html.includes('Record GM award'));
});
test('folio controls display approved source and real-time transcription and rebuilding requirements',()=>{
  const b=build('shipwright',3),character={...b.character,rulesSummary:b.summary};const html=renderToStaticMarkup(React.createElement(Folio,{character,rules:rules.blueprint,busy:false,onCommand(){}}));for(const label of ['GM-recorded discovery','Transcription start (UTC)','Transcription completion (UTC)','Record lost folio','50 GP and two hours','10 GP and one hour'])assert.ok(html.includes(label),label);
});

test('Covenant controls expose held Shields, before-roll Sentinel and ally-turn Standard grants',()=>{
  const b=build('warden',20,'iron-covenant'),summary=rules.runtime.project(b.summary,b.character.rulesRuntime),html=renderToStaticMarkup(React.createElement(Covenant,{character:{...b.character,rulesSummary:summary},busy:false,onCommand(){}}));
  for(const text of ['Held Shield to empower','before its roll','Standard recipient turn ID','Aura of Resolve: 30 feet','Unyielding Standard','Standard: ally turn temporary Health'])assert.ok(html.includes(text),text);
});

test('Conduit controls expose source damage evidence, health costs and damage-bound Unbroken Current',()=>{
  const b=build('tidecaller',18,'sanguine-conduit'),summary=rules.runtime.project(b.summary,b.character.rulesRuntime);
  const html=renderToStaticMarkup(React.createElement(Conduit,{summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const text of ['Blood Price','Measured Sacrifice','Vital Circuit','Source damage operation ID','Expiry, replacement','damage controls'])assert.ok(html.includes(text),text);
  const state=renderToStaticMarkup(React.createElement(StateControls,{summary,state:b.character.rulesRuntime,rules:rules.blueprint,busy:false,onCommand(){}}));assert.ok(state.includes('Use Unbroken Current Reaction'));
  const result=renderToStaticMarkup(React.createElement(Result,{result:{type:'spell.cast',sanguineSurge:{amount:12,forfeited:false}}}));assert.ok(result.includes('one damage roll of this casting only'));
});

test('audit history offers explicit refresh without fetching during render',()=>{
  const html=renderToStaticMarkup(React.createElement(Audit,{loadPage(){throw Error('Render must not fetch');},revision:4}));
  for(const text of ['Saved command history','Character revision 4','Refresh history','Newest commands appear first'])assert.ok(html.includes(text),text);
});

test('identity fields expose bounded pronouns, appearance, portrait and separate narrative notes',()=>{
  const html=renderToStaticMarkup(React.createElement(Identity,{value:{name:'Sailor',pronouns:'they/them',appearance:'Red coat',portraitUrl:'https://example.com/portrait.png',notes:'Session one'},onChange(){}}));
  for(const text of ['Pronouns','Appearance','Portrait URL (HTTPS, optional)','they/them','Red coat','Session one','maxLength="1000"'])assert.ok(html.includes(text),text);
});

test('Envoy controls expose the server Parley save DC, action cost and unavailable reason',()=>{
  const b=build('corsair',17,'black-flag-envoy'),state=b.character.rulesRuntime;
  state.pools['black-flag-envoy:parley']=0;
  const summary=rules.runtime.project(b.summary,state,b.character);
  const html=renderToStaticMarkup(React.createElement(Envoy,{summary,state,busy:false,onCommand(){}}));
  for(const text of ['Unique command event ID','Command turn ID','All Hands','Crew Before Crown','Binding Parley','Each spends its own Reaction','Charmed immunity prevents both effects'])assert.ok(html.includes(text),text);
  const parley=html.match(/<h3>Binding Parley<\/h3>.*?<\/article>/)?.[0];
  assert.ok(parley?.includes('Instinct save DC '+(8+summary.trainingBonus+summary.attributeModifiers.spirit)));
  assert.ok(parley.includes('Action cost: Action'));
  assert.ok(parley.includes('Insufficient resources'));
  assert.match(parley,/<button disabled="">Use Binding Parley<\/button>/);
  const result=renderToStaticMarkup(React.createElement(Result,{result:{crewCommand:{rangeFeet:60,grants:[{targetId:'crew-member',repeatSaveAgainst:'frightened'}],resolution:'GM resolves the original save.'}}}));
  for(const text of ['crew-member','frightened save with Advantage','available Reaction'])assert.ok(result.includes(text),text);
});

test('Hollow Lantern controls use saved study-linked damage and display source-specific sensory limits',()=>{
  const b=build('corsair',17,'hollow-lantern');b.summary.detectFalseAdvantage=true;b.summary.unseenAttackAdvantageSuppressedTargets=['marked'];b.character.rulesRuntime.strikeHistory=[{kind:'cunning',eventId:'damage-roll',targetId:'foe',studyEffectId:'study',rolls:[1,2,3],extraDamage:6,damageType:'piercing'}];
  const html=renderToStaticMarkup(React.createElement(CorsairPaths,{summary:b.summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const text of ['Last Tell: saved studied Sneak Attack','up to three','Unmask the False','No automatic revelation','later movement is not revealed','Saved Sneak Attack damage'])assert.ok(html.includes(text),text);
});

test('Saltglass controls distinguish incoming natural rolls and attack-event follow-ups',()=>{
  const b=build('corsair',17,'saltglass-duelist'),html=renderToStaticMarkup(React.createElement(CorsairPaths,{summary:b.summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const text of ['Incoming attack natural d20','Attack or saved damage event ID','Open Challenge','Answer in Steel','Perfect Measure','Saltglass Footwork'])assert.ok(html.includes(text),text);
});

test('tool sheet exposes owned tools, adjudicated pairings and server-saved checks',()=>{
  const b=build('doctor',3),html=renderToStaticMarkup(React.createElement(Tools,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));
  for(const label of ['Owned tool or instrument','GM-selected attribute','Applicable skill','Training is added once','Roll and save tool check'])assert.ok(html.includes(label),label);
  for(const id of ['might','agility','resolve','wit','instinct','spirit'])assert.ok(html.includes(`value="${id}"`),id);
  assert.ok(!html.includes('value="strength"'));
});

test('feat sheet exposes Inspiration, saved Initiative, scene light and its known triggered feat',()=>{
  const b=build('gunslinger',3),character={...b.character,rulesSummary:b.summary,equipment:gear.derive(b.character)};
  const html=renderToStaticMarkup(React.createElement(Feats,{character,rules:rules.blueprint,busy:false,onCommand(){}}));
  for(const text of ['Feats and Inspiration','Spend Inspiration and reroll','Roll and save Initiative','Savage Attacker','Sneak Attack and spell-rider dice are excluded'])assert.ok(html.includes(text),text);
});

test('strike sheet exposes Cunning costs and later Devious choices; Brutal uses own turn and no Advantage',()=>{
  for(const [calling,level,labels] of [['corsair',20,['Sneak Attack and Cunning Strike','knock out (6d6)','obscure (3d6)','Forgone']],['reaver',17,['Brutal Strike','staggering blow','sundering blow','forgo ALL Advantage']]]){
    const b=build(calling,level),character={...b.character,rulesSummary:b.summary,equipment:gear.derive(b.character)},html=renderToStaticMarkup(React.createElement(Strikes,{character,rules:rules.blueprint,busy:false,onCommand(){}}));
    for(const text of labels.filter(t=>t!=='Forgone'))assert.ok(html.includes(text),text);
    assert.ok(html.includes('Resolve strike dice and effects'));
  }
});

test('Triage and Ghost Patch show the current roll and adjudication requirements',()=>{
  const render=(calling,level,path)=>{
    const {character,summary}=build(calling,level,path);
    return renderToStaticMarkup(React.createElement(Abilities,{summary,state:character.rulesRuntime,busy:false,onCommand(){}}));
  };
  const surgeon=render('doctor',6,'field-surgeon');
  assert.match(surgeon,/Healing at this level is 3d8 \+ 6 Health/);
  assert.match(surgeon,/sight and touch within 5 feet for Triage/);
  const ghost=render('shipwright',14,'drydock-ghost');
  assert.match(ghost,/Object repair at this level is 5d8 \+ 14 Health/);
  assert.match(ghost,/Completed minutes salvaging the wreck/);
});

test('Spell picker disables save-based Metamagic only for spells without a saving throw',()=>{
  const b=build('tidecaller',20,'memory-echo','yuma-core','archive-apprentice');
  b.summary.spellcasting.tidecaller.cantrips=[];
  for(const spellId of ['detect-magic','burning-hands']){
    b.character.rulesRuntime.preparations.tidecaller=[spellId];
    const html=renderToStaticMarkup(React.createElement(Spells,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));
    for(const id of ['careful-spell','heightened-spell']){
      const option=html.match(new RegExp(`<option[^>]*value="${id}"[^>]*>[^<]*</option>`))?.[0];
      assert.ok(option);
      assert.equal(option.includes('disabled'),spellId==='detect-magic');
      assert.equal(option.includes('requires a saving throw'),spellId==='detect-magic');
    }
  }
});

test('Doctor sheet offers unprepared Intervention choices and shows level-twenty Wish cooldown',()=>{
  const b=build('doctor',20),html=renderToStaticMarkup(React.createElement(Spells,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));
  assert.ok(html.includes('Raise Dead (Divine Intervention)'));assert.ok(html.includes('Wish (Divine Intervention)'));
  const result=renderToStaticMarkup(React.createElement(Result,{result:{interventionCooldown:{rolls:[2,3],longRestsRemaining:5}}}));assert.ok(result.includes('5 completed Long Rests'));
});

test('saved spell rerolls expose original dice, triggered-roll confirmation and actual saved outcomes',()=>{
  const b=build('tidecaller',20);b.summary.pathSelections.tidecaller.metamagic=['empowered-spell','seeking-spell'];
  b.character.rulesRuntime.castings=[{castId:'saved-fireball',spellId:'fireball',rerolls:[{eventId:'damage-one',optionId:'empowered-spell',originalDice:[{sides:6,value:1}],dice:[{sides:6,value:4}],metamagicCost:1}]}];
  const html=renderToStaticMarkup(React.createElement(Rerolls,{character:{...b.character,rulesSummary:b.summary},busy:false,onCommand(){}}));
  for(const label of ['Saved casting','Original damage dice','Dice to reroll','GM confirms','Arcane Apotheosis','damage-one','Resolve spell reroll'])assert.ok(html.includes(label),label);
});

test('saved casting presentation shows effective range, duration, target scaling and protected targets',()=>{
  const html=renderToStaticMarkup(React.createElement(Result,{result:{management:{castingTime:'Action',range:{kind:'distance',feet:300},components:['M'],durationSeconds:120,carefulTargets:['ally'],targetScalingLevel:4,damageTypes:['cold']},metamagicCost:1}}));
  for(const text of ['300 feet','120 seconds','Careful: ally','slot level 4','cold'])assert.ok(html.includes(text),text);
});
test('shared character-state controls expose damage, conditions, Concentration, death saves and world time',()=>{
  const b=build('doctor',3);b.character.rulesRuntime.health.current=0;b.character.rulesRuntime.concentrationChecks=[{id:'check',dc:15,damage:30,effects:['spell']}];
  const html=renderToStaticMarkup(React.createElement(StateControls,{summary:b.summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const label of ['Take damage','Receive healing','Roll death saving throw','Roll Concentration save','Record condition source','Choose temporary Health','Advance world time','Start owner turn','Record off-turn encounter turn','Save GM scene conditions'])assert.ok(html.includes(label),label);
});
test('rest planner exposes interruption cause, resumed-rest timing and nourishment',()=>{
  const b=build('doctor',3);
  const proposal=renderToStaticMarkup(React.createElement(Rest,{state:b.character.rulesRuntime,draft:{type:'long-rest'},onCommand(){},onDismiss(){}}));
  assert.ok(proposal.includes('Appropriate food and water'));
  b.character.rulesRuntime.restSession={id:'rest',kind:'long-rest',startedAt:0,interruptions:[],options:{}};
  const active=renderToStaticMarkup(React.createElement(Rest,{state:b.character.rulesRuntime,draft:null,onCommand(){},onDismiss(){}}));
  for(const label of ['Rolling Initiative','Taking damage','Resume immediately','Record GM-confirmed interruption'])assert.ok(active.includes(label),label);
});
test('Cinder controls expose distinct Grand Battery areas, target overlap, tools, costs and exemption limit',()=>{
  const b=build('gunslinger',18,'cinder-artillerist');
  const html=renderToStaticMarkup(React.createElement(Charges,{summary:b.summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const text of ['Artillery charges','smith tools','Second charge center','including overlapping targets','Grand Battery','Creatures exempt'])assert.ok(html.includes(text),text);
  assert.ok(html.includes('2 charge (3 remaining)'));assert.ok(html.includes('1 battery (1 remaining)'));
  assert.ok(html.includes('Fire damage per area at this level is 6d6.'));
  assert.ok(html.includes(`Agility save DC ${8+b.summary.trainingBonus+b.summary.attributeModifiers.wit}`));
});
test('saved Tactical Mind outcome shows its check total and refunded expenditure',()=>{
  const html=renderToStaticMarkup(React.createElement(Result,{result:{rolls:[4],checkTotal:12,success:false,refunded:true}}));
  for(const text of ['Check total: 12','Check still fails','Second Wind use refunded'])assert.ok(html.includes(text),text);
});
test('charge resolution table shows each overlapping target once and separates save advantage and exemptions',()=>{
  const html=renderToStaticMarkup(React.createElement(Result,{result:{targetResolutions:[
    {targetId:'overlap-target',areaId:'bow',damage:20,save:{attribute:'agility',dc:15,successDamage:10,advantage:true},smokeAffected:true},
    {targetId:'protected-ally',areaId:'stern',damage:0,save:{attribute:'agility',dc:15,successDamage:0},exempt:true},
  ]}}));
  assert.equal(html.split('overlap-target').length-1,1);assert.ok(html.includes('agility DC 15 (advantage)'));assert.ok(html.includes('Exempt from charge effects'));
});
test('relay sheet exposes placement, movement, proximity and object damage controls at their feature boundaries',()=>{
  const b=build('shipwright',14,'sparkwrite-aetherist');
  b.ledger.levels[2].choices.pathDiscipline=['mobile'];const summary=rules.runtime.project(rules.replay(b.ledger),b.character.rulesRuntime,b.character);
  const html=renderToStaticMarkup(React.createElement(Relays,{summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
  for(const label of ['Aether relays','Place Aether Relay','Move mobile relay','Grounding Circuit','Capacitor Discharge','Mobile relay movement'])assert.ok(html.includes(label),label);
  for(const label of ['All Discharge targets within 10 feet, including allies','Lightning damage at this level is 6d8',`Agility save DC ${summary.spellcasting.shipwright.saveDC}`,'Place a live relay first'])assert.ok(html.includes(label),label);
  const outcome=renderToStaticMarkup(React.createElement(Result,{result:{discharge:{relayId:'relay-one',targetIds:['ally','foe']},save:{attribute:'agility',dc:15,success:'half'},damage:11,damageType:'lightning'}}));
  assert.ok(outcome.includes('Discharge targets: ally, foe.'));
  assert.ok(outcome.includes('5 on success.'));
});
test('advancement exposes optional source-bound Magic Initiate and Calling cantrip replacements',()=>{
  const before=build('doctor',2,undefined,'yuma-core','archive-apprentice'),next=build('doctor',3,undefined,'yuma-core','archive-apprentice');
  const html=renderToStaticMarkup(React.createElement(Replacements,{before:before.summary,preview:next.summary,event:next.ledger.levels[2],rules:rules.blueprint,busy:false,onChange(){}}));
  for(const label of ['Optional level replacements','Magic Initiate (shipwright)','Calling cantrip','Preview replacement'])assert.ok(html.includes(label),label);
});
test('inventory sheet offers catalog purchases and presets without unchecked item or currency grants',()=>{
  const b=build('gunslinger',5);b.character.inventory.push(gear.issue({definitionId:'arrows',quantity:20}));
  const character={...b.character,rulesSummary:b.summary,equipment:gear.derive(b.character)};
  const html=renderToStaticMarkup(React.createElement(Equipment,{character,rules:rules.blueprint,busy:false,onCommand(){}}));
  for(const label of ['Buy item','Save current loadout','Split','Merge destination','Healer'])assert.ok(html.includes(label),label);
  assert.ok(!html.includes('Record gold change'));assert.ok(!html.includes('Record item'));
});
for(const[callingId,pathId]of [['gunslinger','deadeye'],['tidecaller','memory-echo'],['doctor','field-surgeon'],['shipwright','breakwater']]){
  test(`${pathId}: sheet exposes source-owned activation controls, full rules and spell costs`,()=>{
    const b=build(callingId,6,pathId),before=JSON.stringify(b.character);
    const html=renderToStaticMarkup(React.createElement(Abilities,{summary:b.summary,state:b.character.rulesRuntime,busy:false,onCommand(){}}));
    assert.ok(html.includes('Ability management'));assert.ok(html.includes('Recorded effects'));
    for(const option of b.summary.abilityOptions)assert.ok(html.includes(option.name.replaceAll('&','&amp;').replaceAll("'",'&#x27;')),option.name);
    const spells=renderToStaticMarkup(React.createElement(Spells,{character:{...b.character,rulesSummary:b.summary},rules:rules.blueprint,busy:false,onCommand(){}}));
    if(callingId!=='gunslinger'){assert.ok(spells.includes('Spell casting'));assert.ok(spells.includes('Cast '));}
    assert.equal(JSON.stringify(b.character),before);
  });
}
