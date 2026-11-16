import {useState} from 'react';
import {arcaneApotheosisUnlocked,metamagicRerollOptions} from '@crossworld/sanguine-engine/spells/metamagic';
import callingRules from '@crossworld/sanguine-engine/calling-mechanics';
export default function SpellRerolls({character,busy,onCommand}){
  const [castId,setCastId]=useState(''),[optionId,setOptionId]=useState('empowered-spell'),[eventId,setEventId]=useState(''),[dice,setDice]=useState('1/6, 3/6'),[indices,setIndices]=useState('1'),[originalRoll,setOriginalRoll]=useState(1),[confirmed,setConfirmed]=useState(false),[free,setFree]=useState(false),[turnId,setTurnId]=useState('');
  const known=(character.rulesSummary.pathSelections.tidecaller?.metamagic??[]).filter(id=>metamagicRerollOptions.includes(id));
  if(!known.length)return null;
  const casts=character.rulesRuntime.castings??[],selected=casts.find(c=>c.castId===castId)??casts.at(-1),option=known.includes(optionId)?optionId:known[0];
  function reroll(){onCommand('spell.reroll',{castId:selected.castId,eventId,optionId:option,confirmed,...(option==='empowered-spell'?{dice:dice.split(',').map(d=>{const [value,sides]=d.trim().split('/').map(Number);return {value,sides};}),indices:indices.split(',').map(i=>Number(i.trim())-1)}:{originalRoll}),...(free?{free,turnId}:{})});}
  return <section className="character-creation__surface" aria-label="Spell rerolls"><h2>Spell rerolls</h2><fieldset disabled={busy||!selected}>
    <label>Saved casting <select value={selected?.castId??''} onChange={e=>setCastId(e.target.value)}>{casts.map(c=><option key={c.castId} value={c.castId}>{c.spellId} — {c.castId}</option>)}</select></label>
    <label>Reroll option <select value={option} onChange={e=>setOptionId(e.target.value)}>{known.map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Unique roll event label <input value={eventId} maxLength={100} onChange={e=>setEventId(e.target.value)}/></label>
    {option==='empowered-spell'?<><label>Original damage dice (value/sides, comma separated) <input value={dice} onChange={e=>setDice(e.target.value)}/></label><label>Dice to reroll (positions starting at 1, comma separated) <input value={indices} onChange={e=>setIndices(e.target.value)}/></label><p>Reroll up to {callingRules.empoweredSpellRerollLimit(character.rulesSummary.attributeModifiers.spirit)} dice. Add any unchanged flat damage modifier separately.</p></>:<label>Missed attack: original d20 <input type="number" min="1" max="20" value={originalRoll} onChange={e=>setOriginalRoll(Number(e.target.value))}/></label>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms this casting's damage dice or missed spell attack and roll label</label>
    {arcaneApotheosisUnlocked(character.rulesSummary.callingLevels.tidecaller)&&<><label><input type="checkbox" checked={free} onChange={e=>setFree(e.target.checked)}/>Use Arcane Apotheosis with active Innate Sorcery</label>{free&&<label>Current turn label <input value={turnId} maxLength={100} onChange={e=>setTurnId(e.target.value)}/></label>}</>}
    <p>Costs one Sorcery Point unless Apotheosis applies. Server rolls replacements; you must use the new rolls. A roll event cannot use the same option twice. Saved castings are retained through a rest only while their timed effect remains active.</p>
    <button disabled={!selected||!confirmed||!eventId.trim()} onClick={reroll}>Resolve spell reroll</button>
    {(selected?.rerolls??[]).map((r,i)=><p key={i}>{r.eventId}: {r.optionId} — {r.roll!==undefined?`d20 ${r.originalRoll} → ${r.roll}`:r.dice.map((d,i)=>`${r.originalDice[i].value} → ${d.value} (d${d.sides})`).join(', ')}; cost {r.metamagicCost}.</p>)}
  </fieldset></section>;
}
