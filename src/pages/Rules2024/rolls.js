import { applyRollFloors, selectD20, sheetCheckRules, d20RollCount, d20Total } from '@crossworld/sanguine-engine/dice';

// Modifiers are supplied by the canonical backend summary; the client only rolls dice.
export function rollCheck(modifier, { advantage = false, disadvantage = false,minimumNatural=1,minimumTotal=-10000 } = {}, random = Math.random) {
  if (!Number.isSafeInteger(modifier)) throw new Error('Missing authoritative roll modifier');
  const roll = () => Math.floor(random() * 20) + 1;
  const dice = Array.from({ length: d20RollCount(advantage, disadvantage) }, roll);
  const natural = selectD20(dice, Boolean(advantage), Boolean(disadvantage));
  const { applied, total } = applyRollFloors(natural, modifier, minimumNatural, minimumTotal);
  return { dice, natural:applied, modifier, total,...(applied!==natural?{rolledNatural:natural,naturalFloorApplied:true}:{}),...(total!==d20Total(applied,modifier)?{minimumTotalApplied:true}:{}) };
}

export function rollSheetCheck(summary, equipment, check, random = Math.random) {
  const { modifier, ...options } = sheetCheckRules(summary, equipment, check);
  return rollCheck(modifier, options, random);
}
