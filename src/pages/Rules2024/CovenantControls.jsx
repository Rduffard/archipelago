import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function CovenantControls({character,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [shield,setShield]=useState(''),[target,setTarget]=useState(''),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('covenant-'));
  if(!options.length)return null;
  const shields=character.inventory.filter(i=>[character.loadout.mainHand,character.loadout.offHand].includes(i.instanceId)&&i.definitionId==='shield');
  function activate(o){const targetNeeded=['covenant-sentinel','covenant-grant'].includes(o.handler);onCommand('ability.activate',{optionId:o.id,targetIds:targetNeeded?[target.trim()]:[],parameters:{confirmed,...(o.handler==='covenant-steel'?{objectId:shield||shields[0]?.instanceId}:{}),...(targetNeeded?{eventId}:{})},...(o.handler==='covenant-grant'?{turnId:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Iron Covenant"><h2>Iron Covenant</h2><fieldset disabled={busy}>
    <label>Held Shield to empower <select value={shield||shields[0]?.instanceId||''} onChange={e=>setShield(e.target.value)}><option value="">Choose a held Shield</option>{shields.map(i=><option key={i.instanceId} value={i.instanceId}>{i.customName||'Shield'}: {i.instanceId}</option>)}</select></label>
    <p>Covenant of Steel lasts one minute and ends when you release that Shield. Bulwark adds 1 Guard while you hold it. Sentinel requires seeing the attacker and a declaration before its roll, protecting one other ally within five feet.</p>
    <label>Protected ally or Standard recipient ID <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    <label>Attack or ally-turn event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Standard recipient turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms range, sight, the trigger and any available Reaction. Standard grants occur at the ally's turn start inside my active aura.</label>
    {summary.covenantAura&&<p>Aura of Resolve: {summary.covenantAura.radiusFeet} feet; allies have Advantage on saves against forced movement and being knocked Prone. {summary.covenantAura.standardTemporaryHealth?`Standard grants ${summary.covenantAura.standardTemporaryHealth} temporary Health at each ally turn start.`:''}</p>}
    {summary.preventsEnemyForcedMovement&&<p>Unyielding Standard: physical damage Resistance; enemies cannot move you against your will.</p>}
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p><button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>activate(o)}>Use {o.name}</button></article>)}
  </fieldset></section>;
}
