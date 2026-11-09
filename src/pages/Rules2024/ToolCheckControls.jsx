import {useState} from 'react';
import {attributeNames} from './labels';
export default function ToolCheckControls({character,rules,busy,onCommand}){
  const [instanceId,setInstanceId]=useState(''),[attribute,setAttribute]=useState(''),[skillId,setSkillId]=useState(''),[dc,setDC]=useState(15),[eventId,setEventId]=useState(''),[confirmed,setConfirmed]=useState(false),[advantage,setAdvantage]=useState(false),[disadvantage,setDisadvantage]=useState(false);
  const [task,setTask]=useState('general'),[turnId,setTurnId]=useState('');
  const {rulesSummary:summary,rulesRuntime:state}=character;
  const ghostTrade=summary.paths.shipwright==='drydock-ghost'&&summary.pathSelections.shipwright.ghostTrade===task;
  const savedTurn=state.ownerTurn?.open?state.ownerTurn.id:state.inCombat?state.externalCastingTurn:null;
  const tools=character.inventory.map(i=>({...i,definition:rules.equipment.items.find(d=>d.id===i.definitionId)})).filter(i=>i.definition?.toolAbility),tool=tools.find(i=>i.instanceId===instanceId)??tools[0];
  if(!tool)return null;
  return <section className="character-creation__surface" aria-label="Tool checks"><h2>Tool checks</h2><fieldset disabled={busy}>
    <label>Owned tool or instrument <select value={tool.instanceId} onChange={e=>setInstanceId(e.target.value)}>{tools.map(i=><option key={i.instanceId} value={i.instanceId}>{i.customName||i.definition.name}</option>)}</select></label>
    <p>{tool.definition.description}</p>
    <label>GM-confirmed tool task <select value={task} onChange={e=>setTask(e.target.value)}><option value="general">General task</option><option value="inspect-explosives">Inspect explosives</option><option value="reinforce-structure">Reinforce a structure</option><option value="covert-repair">Covert repair</option><option value="sabotage">Sabotage</option><option value="predict-weather">Predict natural weather (Instinct)</option><option value="interpret-signals">Interpret signals (Wit)</option></select></label>
    {ghostTrade&&(savedTurn?<p>Recorded turn: {savedTurn}.</p>:state.inCombat?<p>Ask the GM to record the current encounter turn.</p>:<label>Turn ID (consistent table label) <input value={turnId} onChange={e=>setTurnId(e.target.value)} maxLength={100}/></label>)}
    <label>GM-selected attribute <select value={attribute} onChange={e=>setAttribute(e.target.value)}><option value="">Printed default ({attributeNames[tool.definition.toolAbility]??tool.definition.toolAbility})</option>{Object.entries(attributeNames).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
    <label>Applicable skill (GM adjudicated) <select value={skillId} onChange={e=>setSkillId(e.target.value)}><option value="">Tool only</option>{rules.skills.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <label>Check DC <input type="number" min={1} max={1000} value={dc} onChange={e=>setDC(Number(e.target.value))}/></label>
    <label>Stable check event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={advantage} onChange={e=>setAdvantage(e.target.checked)}/>Additional GM-confirmed Advantage</label>
    <label><input type="checkbox" checked={disadvantage} onChange={e=>setDisadvantage(e.target.checked)}/>Additional GM-confirmed Disadvantage</label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the task, attribute, applicable skill, DC and circumstances</label>
    <p>Training is added once. Tool and skill Training together grant Advantage; Expertise doubles the single Training Bonus. Eligible Path task benefits apply automatically. Ghost Patch adds its trade bonus once per turn. The server rolls and saves the result. Crafting or world changes are adjudicated separately.</p>
    <button disabled={!confirmed||!eventId.trim()||ghostTrade&&!savedTurn&&(state.inCombat||!turnId.trim())} onClick={()=>onCommand('tool.check',{instanceId:tool.instanceId,...(attribute?{attribute}:{}),...(skillId?{skillId}:{}),task,...(ghostTrade&&!savedTurn?{turnId:turnId.trim()}:{}),dc,eventId,advantage,disadvantage,confirmed})}>Roll and save tool check</button>
  </fieldset></section>;
}
