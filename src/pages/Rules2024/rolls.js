// Modifiers are supplied by the canonical backend summary; the client only rolls dice.
export function rollCheck(modifier, { advantage = false, disadvantage = false,minimumNatural=1,minimumTotal=-10000 } = {}, random = Math.random) {
  if (!Number.isSafeInteger(modifier)) throw new Error('Missing authoritative roll modifier');
  const roll = () => Math.floor(random() * 20) + 1;
  const dice = advantage !== disadvantage ? [roll(), roll()] : [roll()];
  const natural = advantage && !disadvantage ? Math.max(...dice) : disadvantage && !advantage ? Math.min(...dice) : dice[0];
  const applied=Math.max(minimumNatural,natural),total=Math.max(minimumTotal,applied+modifier);
  return { dice, natural:applied, modifier, total,...(applied!==natural?{rolledNatural:natural,naturalFloorApplied:true}:{}),...(total!==applied+modifier?{minimumTotalApplied:true}:{}) };
}

export function rollSheetCheck(summary,equipment,{modifier,attribute,skillId,savingThrow=false,stealth=false,rollMode='normal',primalKnowledge=false,task='general'},random=Math.random){
  if(!savingThrow&&primalKnowledge&&summary.rageSkillModifiers?.[skillId]!==undefined){modifier=summary.rageSkillModifiers[skillId]-2*(summary.exhaustion??0);attribute='might';}
  // Skill and save modifiers already include Exhaustion; bare attributes do not.
  else if(!savingThrow&&!skillId)modifier-=2*(summary.exhaustion??0);
  const physical=['might','agility','resolve'].includes(attribute),conditions=summary.conditions??[];
  const shroudedStealth=!savingThrow&&skillId==='stealth'&&summary.silentKeelStealth;
  return rollCheck(modifier,{
    advantage:shroudedStealth||rollMode==='advantage'||savingThrow&&attribute==='agility'&&summary.agilitySaveAdvantage||!savingThrow&&(attribute==='might'&&summary.mightAdvantage||skillId==='athletics'&&summary.athleticsAdvantage||task==='inspect-explosives'&&summary.paths.gunslinger==='cinder-artillerist'&&summary.callingLevels.gunslinger>=7||task==='detect-false'&&summary.detectFalseAdvantage||summary.paths.navigator==='storm-broker'&&(task==='predict-weather'&&attribute==='instinct'&&summary.pathSelections.navigator.stormDiscipline==='weather'||task==='interpret-signals'&&attribute==='wit'&&summary.pathSelections.navigator.stormDiscipline==='signals')),
    disadvantage:rollMode==='disadvantage'||physical&&equipment?.restrictions.physicalD20Disadvantage||stealth&&equipment?.restrictions.stealthDisadvantage||!savingThrow&&conditions.includes('poisoned')||savingThrow&&attribute==='agility'&&conditions.includes('restrained'),
    minimumNatural:skillId&&summary.reliableTalent&&summary.training.includes(skillId)?10:1,
    minimumTotal:attribute==='might'?summary.minimumMightTestTotal??-10000:-10000,
  },random);
}
