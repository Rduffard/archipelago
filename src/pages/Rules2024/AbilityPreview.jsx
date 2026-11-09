import {attributeNames} from './labels';

export default function AbilityPreview({option}){
  const {roll,save,fixed,kitCharges}=option.preview??{};
  const bonus=roll?.bonus?` ${roll.bonus<0?'-':'+'} ${Math.abs(roll.bonus)}`:'';
  return <>
    {option.action&&<p>Action cost: {option.action}.</p>}
    {option.unavailableReason&&<p>{option.unavailableReason}</p>}
    {roll&&<p>{`${roll.label} at this level is ${roll.count}d${roll.sides}${bonus}${roll.unit?' '+roll.unit:''}.`}{roll.maximum?' Use the maximum on each die.':''}</p>}
    {save&&<p>{save.label?`${save.label} `:''}{attributeNames[save.attribute]??save.attribute} save DC {save.dc}.</p>}
    {fixed&&<p>{fixed.label} at this level is {fixed.amount} {fixed.unit}.</p>}
    {kitCharges&&<p>Also spends {kitCharges} healer's kit {kitCharges===1?'charge':'charges'}.</p>}
    {option.source?.document&&<p>Source {option.source.document}</p>}
  </>;
}
