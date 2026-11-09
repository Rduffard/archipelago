import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
const ids=value=>[...new Set(value.split(',').map(s=>s.trim()).filter(Boolean))];
export default function ChargeControls({summary,state,busy,onCommand}){
  const [first,setFirst]=useState(''),[second,setSecond]=useState('');
  const [firstTargets,setFirstTargets]=useState(''),[secondTargets,setSecondTargets]=useState('');
  const [exempt,setExempt]=useState(''),[allies,setAllies]=useState(''),[objects,setObjects]=useState('');
  const [radius,setRadius]=useState(5),[confirmed,setConfirmed]=useState(false);
  const options=(summary.abilityOptions??[]).filter(o=>['measured-charge','grand-battery'].includes(o.handler));
  if(!options.length)return null;
  const level=summary.callingLevels.gunslinger;
  function detonate(option){
    const areas=[{pointId:first.trim(),targetIds:ids(firstTargets)},...(option.handler==='grand-battery'?[{pointId:second.trim(),targetIds:ids(secondTargets)}]:[])];
    onCommand('ability.activate',{optionId:option.id,targetIds:[...new Set(areas.flatMap(a=>a.targetIds))],parameters:{confirmed,areas,radiusFeet:radius,
      exemptTargets:ids(exempt),advantageTargets:ids(allies),objectTargets:ids(objects)}});
  }
  return <section className="character-creation__surface" aria-label="Artillery charges"><h2>Artillery charges</h2>
    <p>Carry smith tools and leave a hand free. Charges are prepared components, not inventory bombs. Resolve target saves and damage with the GM.</p>
    <fieldset disabled={busy}>
      <label>First charge center, stable table label <input value={first} onChange={e=>setFirst(e.target.value)} maxLength={100}/></label>
      <label>Targets in first area, stable IDs separated by commas <input value={firstTargets} onChange={e=>setFirstTargets(e.target.value)} maxLength={1000}/></label>
      {level>=18&&<><label>Second charge center, different stable label <input value={second} onChange={e=>setSecond(e.target.value)} maxLength={100}/></label>
        <label>Targets in second area, including overlapping targets <input value={secondTargets} onChange={e=>setSecondTargets(e.target.value)} maxLength={1000}/></label>
        <p>Grand Battery costs two Charges and one battery use. Each target is affected once; an overlapping target uses the first declared area's roll.</p></>}
      <label>Damage radius <select value={radius} onChange={e=>setRadius(Number(e.target.value))}><option value={5}>5 feet</option>{level>=10&&<option value={10}>10 feet</option>}</select></label>
      {level>=7&&<label>Chosen allies with save advantage, stable IDs <input value={allies} onChange={e=>setAllies(e.target.value)} maxLength={1000}/></label>}
      {level>=10&&<label>Creatures exempt from charge damage and effects (maximum {Math.max(1,summary.attributeModifiers.wit)}) <input value={exempt} onChange={e=>setExempt(e.target.value)} maxLength={1000}/></label>}
      <label>Unattended object targets, stable IDs <input value={objects} onChange={e=>setObjects(e.target.value)} maxLength={1000}/></label>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms all affected creatures, unattended objects, total cover and centers within 30 feet (60 for Grand Battery)</label>
      {options.map(option=><div key={option.id}><p>{option.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')}</p>
        <AbilityPreview option={option}/>
        
        <button disabled={option.available===false||!confirmed||!first.trim()||option.handler==='grand-battery'&&(!second.trim()||first.trim()===second.trim())||option.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>detonate(option)}>{option.name}</button></div>)}
    </fieldset>
  </section>;
}
