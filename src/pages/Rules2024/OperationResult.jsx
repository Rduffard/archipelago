export default function OperationResult({result}){
  if(!result)return null;
  return <section className="character-creation__surface" aria-label="Saved action result"><h2>Saved action</h2>
    <p role="status">Saved. {result.healing!==undefined?`Healing: ${result.healing}.`:''} {result.temporaryHealth!==undefined?`Temporary Health: ${result.temporaryHealth}.`:''}</p>
    {result.contingency&&<p>Contingency is pending. Spent level {result.slotLevel} and level {result.contingency.slotLevel} slots. Trigger: {result.contingency.trigger}.</p>}
    {result.type==='contingency.trigger'&&<>
      <p>The contingent spell took effect on you. {result.resolvedHealing&&`Healing: ${result.resolvedHealing.healing}.`}</p>
      <p>{result.description}</p>
    </>}
    {result.rolls&&<p>Rolls: {result.rolls.map(roll=>Array.isArray(roll)?roll.join(' + '):roll).join('; ')}.</p>}
    {result.healthLost!==undefined&&result.type==='ability.activate'&&<p>Health paid: {result.healthLost}; temporary Health and Resistance do not reduce this cost.</p>}
    {result.sorceryRecovered!==undefined&&<p>Sorcery Points recovered: {result.sorceryRecovered}.</p>}
    {result.temporaryHealthGrant&&<p>Temporary Health grant: {result.temporaryHealthGrant.amount} to {result.temporaryHealthGrant.targetIds.join(', ')}. Choose one pool; pools never stack.{result.temporaryHealthGrant.metadata?.grantId?` Grant ID: ${result.temporaryHealthGrant.metadata.grantId}.`:''}</p>}
    {result.sanguineSurge&&<p>Blood Price Surge: {result.sanguineSurge.forfeited?'forfeited by this nondamaging spell.':`add ${result.sanguineSurge.amount} Necrotic damage to one damage roll of this casting only.`}</p>}
    {result.unbrokenCurrent&&<p>Unbroken Current Reaction spent: remain at 1 Health before Unconscious and gain {result.unbrokenCurrent.temporaryHealth} temporary Health.</p>}
    {result.bloodPriceLoss&&<p>Blood Price temporary Health lost to damage: {result.bloodPriceLoss.amount}. Vital Circuit damage operation ID: {result.bloodPriceLoss.eventId}.</p>}
    {result.checkTotal!==undefined&&<p>Check total: {result.checkTotal}. {result.success?'Check succeeds.':'Check still fails.'} {result.refunded!==undefined?(result.refunded?'Second Wind use refunded.':'Second Wind use spent.'):''} {result.mustUseNewRoll?'Use the new roll.':''}</p>}
    {result.type==='concentration.resolve'&&<p>Concentration total {result.total} against DC {result.dc}: {result.success?'maintained':'ended'}.</p>}
    {result.type==='relentless-rage.resolve'&&<p>Relentless Rage total {result.total} against DC {result.dc}: {result.success?'Health restored; Rage continues':'Rage ends; zero Health'}.</p>}
    {result.type==='health.damage'&&<p>Damage after mitigation {result.damage}; temporary Health absorbed {result.absorbed}; Health lost {result.healthLost}.</p>}
    {result.management&&<><p>Casting: {result.management.castingTime}. Range: {result.management.range.kind==='distance'?`${result.management.range.feet} feet`:result.management.range.kind}. Components: {result.management.components.join(', ')||'none'}. Duration: {result.management.durationSeconds?`${result.management.durationSeconds} seconds`:'instantaneous or special; see spell rules'}. Metamagic cost: {result.metamagicCost}.</p>
      {result.management.carefulTargets&&<p>Careful: {result.management.carefulTargets.join(', ')} succeed on saves and take no damage when a successful save normally halves damage.</p>}
      {result.management.heightenedTarget&&<p>Heightened: {result.management.heightenedTarget} has disadvantage on all saves against this casting.</p>}
      {result.management.sculptTargets&&<p>Sculpt Spells: {result.management.sculptTargets.join(', ')} automatically succeed on saves and take no damage when successful saves normally halve it.</p>}
      {result.management.healingFeatures&&<p>Healing features, only when this casting restores Health:{result.management.healingFeatures.maximumHealingDice?' use the maximum on every healing die;':''}{result.management.healingFeatures.additionalHealingOnCastingTurn?` add ${result.management.healingFeatures.additionalHealingOnCastingTurn} healing on the casting turn;`:''}{result.management.healingFeatures.blessedHealerEligible?' healing another creature can trigger Blessed Healer.':''}</p>}
      <p>Target scaling uses slot level {result.management.targetScalingLevel}; other effects use the spent slot level. Damage types: {result.management.damageTypes.join(', ')||'see spell'}.</p></>}
    {result.type==='spell.reroll'&&<p>Use the new roll: {result.roll??result.dice.map(d=>`${d.value} (d${d.sides})`).join(', ')}. Cost: {result.metamagicCost} Sorcery Points.</p>}
    {result.spellRecall&&<p>Spell Recall: d4 {result.spellRecall.roll} against slot level {result.spellRecall.slotLevel}; slot {result.spellRecall.preserved?'preserved':'expended'}.</p>}
    {result.interventionCooldown&&<p>Greater Divine Intervention: 2d4 rolls {result.interventionCooldown.rolls.join(' + ')}; recover after {result.interventionCooldown.longRestsRemaining} completed Long Rests.</p>}
    {result.overchannel&&<p>Overchannel: maximum spell damage on turn {result.overchannel.maximumDamageOnTurn}. Backlash rolls: {result.overchannel.backlashDice.join(' + ')||'none'}; {result.overchannel.damage} Necrotic damage, ignoring Resistance and Immunity.</p>}
    {result.type==='inspiration.spend'&&<p>Inspiration: d{result.sides} {result.originalRoll} → {result.roll}. Use the new roll.</p>}
    {result.type==='initiative.record'&&<p>Saved Initiative {result.total} in combat {result.combatId}.</p>}
    {result.parry&&<p>Open Challenge: Guard {result.parry.guardBefore} → {result.parry.guardAfter} against total {result.parry.attackTotal}; {result.parry.causedMiss?'attack misses because of this feature':'feature did not turn a hit into a miss'}.</p>}
    {result.grantedAttack&&<p>{result.grantedAttack.source?`${result.grantedAttack.source}: one weapon attack`:'Answer in Steel: one melee attack'} against {result.grantedAttack.targetId}.{result.grantedAttack.source?' Ammunition, when required, is already spent.':' Same Reaction; no Sneak Attack.'} Use attack event ID {result.grantedAttack.attackEventId}.</p>}
    {result.sneakDamage!==undefined&&<p>Last Tell: use the new Sneak Attack dice, total {result.sneakDamage}.</p>}
    {result.sentinel&&<p>Sentinel Reaction: impose Disadvantage on attack {result.sentinel.eventId} against {result.sentinel.protectedTargetId}, within five feet. Declare before the attack roll.</p>}
    {result.freeMovement&&<p>{result.freeMovement.targetId}: move {result.freeMovement.feet} feet without Opportunity Attacks.</p>}
    {result.watchHit&&<p>Watch hit: {result.damage} {result.damageType} damage to {result.watchHit.targetId}.{result.watchHit.preventsHealing?' Undead target cannot regain Health until your next turn.':''}</p>}
    {result.noSave&&result.damage!==undefined&&<p>{result.damage} {result.damageType} damage; no saving throw.</p>}
    {result.movement&&<p>Move {result.movement.feet} feet; {result.movement.provokesOpportunityAttacks===false?'this movement does not provoke Opportunity Attacks':'Opportunity Attacks apply normally'}.{result.movement.extraMovement===false?' This grants no extra movement.':''}{result.movement.endsHiddenOnLeavingCover?' Leaving cover ends Hidden.':''}</p>}
    {result.passage&&<p>Guided allies gain {result.passage.speedType} Speed {result.passage.speedFeet} feet for one minute with Concentration.{result.passage.ignoreNonmagicalDifficultTerrain?' They ignore nonmagical Difficult Terrain.':''} No extra movement.</p>}
    {result.teleport&&<p>Teleport within {result.teleport.maximumFeet} feet: {result.teleport.targetIds.map((id,i)=>`${id} to ${result.teleport.destinations[i]}`).join('; ')}. Passage ends.</p>}
    {result.hideTotal!==undefined&&<p>Hide rolls {(result.hideRolls??[result.hideRoll]).join(' / ')}. Total {result.hideTotal} against DC {result.hideDC}. {result.hidden?'Hidden while its normal conditions hold.':'Hide attempt failed.'}</p>}
    {Number.isInteger(result.appliedRoll)&&result.appliedRoll!==result.naturalRoll&&<p>Reliable Talent treats the selected {result.naturalRoll} as {result.appliedRoll}.</p>}
    {result.revealCharmedImmunity&&<p>GM reveals whether {result.revealCharmedImmunity.targetId} is immune to Charmed. The successful save and spell cost remain unchanged.</p>}
    {result.singleDamageRoll&&<p>Add {result.damage} {result.damageType} to one spell damage roll only.</p>}
    {result.effect?.telepathy&&<p>Telepathic link range {result.effect.telepathy.rangeFeet} feet; no shared language required.{result.effect.telepathy.endsBeyondRange?' Link ends beyond range.':''}</p>}
    {result.effect?.snare&&<p>On a failed save, the marked target’s Speed is zero until your next turn.</p>}
    {result.controlTargets&&<ul>{result.controlTargets.map(t=><li key={t.targetId}>{t.targetId}: {t.extraDamage} extra damage; on a failed Resolve save, {t.pushFeet?`push ${t.pushFeet} feet directly away`:`reduce Speed by ${t.speedReductionFeet} feet until your next turn`}. Does not stack with the same mastery effect.</li>)}</ul>}
    {result.type==='movement.record'&&<p>Recorded this turn: {result.movementFeet} feet total; {result.voluntarySpeedFeet} feet of voluntary Speed movement.</p>}
    {result.suppressionRecovered!==undefined&&<p>Suppression pool restored to {result.suppressionRecovered}; Suppressing Fire DC increases by two until your next turn.</p>}
    {result.landing&&<p>On a failed save, targets fall Prone: {result.landing.targetIds.join(', ')}. Radius {result.landing.radiusFeet} feet.</p>}
    {result.saveSucceedsInstead&&<p>The eligible failed save succeeds instead; no healing.</p>}
    {result.type==='milestone.authorize'&&<p>Level {result.milestone.level} authorized: {result.milestone.reason}.</p>}
    {result.type==='equipment.award'&&<p>GM award: {result.awardedCp} copper and {result.instanceIds.length} inventory entries. {result.reason}</p>}
    {result.type==='equipment.sell'&&<p>Sold {result.quantity} item(s) for {result.proceedsCp} copper. {result.reason}</p>}
    {result.type==='scroll.cast'&&<p>Scroll {result.spellId}: {result.success?`cast successfully, save DC ${result.saveDC}, spell attack +${result.attackModifier}`:'casting check failed; no spell effect'}. The identified scroll is destroyed.</p>}
    {result.type==='item.cast'&&<p>{result.spellId} cast at level {result.slotLevel}; {result.chargesSpent} charges spent, {result.chargesRemaining} remaining.{result.chargeRoll!==undefined?` Reef Knife d6: ${result.chargeRoll}${result.chargesPreserved?'; charges preserved':''}.`:''}{result.destructionRoll!==undefined?` Last-charge d20: ${result.destructionRoll}; item ${result.destroyed?'destroyed':'survives'}.`:''}</p>}
    {result.resistanceGrant&&<p>{result.resistanceGrant.targetId} gains Resistance to {result.resistanceGrant.damageType}{result.resistanceGrant.onlyThisDamageInstance?' for this damage instance only':` through the end of turn ${result.resistanceGrant.untilTurnEnd}`}. Resistance never stacks; record original damage when the server already applies this Resistance.</p>}
    {result.dash&&<p>Dash grants {result.dash.additionalMovementFeet} feet of additional movement this turn.</p>}
    {result.speedRemainsZero&&<p>Steady Aim’s next attack Advantage is consumed. Your Speed remains zero until turn end.</p>}
    {result.heroicRally!==undefined&&<p>Heroic Rally restored {result.heroicRally} Health at the start of your turn.</p>}
    {result.healingAllocations&&<ul>{result.healingAllocations.map(a=><li key={a.targetId}>{a.targetId}: allocate {a.amount} Health{result.healingCapFraction===0.5?', capped at half maximum Health':''}{result.requireBloodied?'; requires Bloodied':''}.</li>)}</ul>}
    {result.type==='spell.heal'&&<p>{result.spellId}: {result.restoreAllHealth?'restore all Health':result.healingAllocations?'use the saved allocation':`${result.healing} healing`}.{result.supremeHealing?' Supreme Healing maximizes healing dice.':''}{result.discipleLifeBonus?` Includes ${result.discipleLifeBonus} Disciple of Life healing on the casting turn.`:''}{result.blessedHealerSelfHealing!==undefined?` Blessed Healer restored ${result.blessedHealerSelfHealing} to you.`:''}</p>}
    {result.type==='equipment.utilize'&&<p>Used {result.definitionId}; activation: {result.action}.{result.deployedEffectId?` Deployed object: ${result.deployedEffectId}.`:''}{result.objectProfile?.fiendOrUndeadOnly?' Radiant damage affects only Fiends and Undead.':''}</p>}
    {result.type==='equipment.recover'&&<p>Recovered {result.definitionId} as inventory instance {result.instanceId}.</p>}
    {result.type==='attack.record'&&<p>Attack against {result.targetId}: {result.hit?'hit':'miss'}. Advantage sources: {[result.recklessAdvantage&&'Reckless Attack',result.studiedAdvantage&&'Studied Attacks',result.steadyAimAdvantage&&'Steady Aim'].filter(Boolean).join(', ')||'none from these features'}. Apply other Advantage and Disadvantage with your GM.</p>}
    {result.type==='equipment.poison-hit'&&<p>Basic Poison: {result.damage} Poison damage; {result.remainingCoatedHits} coated ammunition hits remain.</p>}
    {result.additionalAttack&&<p>Make one additional attack with the same weapon against {result.additionalAttack.targetId}; no additional Action granted. {result.ammunitionSpent?'One ammunition piece spent.':''}</p>}
    {result.subsequentAttacksDisadvantage&&<p>This attacker's subsequent attacks against you have Disadvantage through the recorded turn end.</p>}
    {result.type==='equipment.flame'&&<p>Oil is {result.lit?'lit':'extinguished'}.{result.remainingMs!==undefined?` Fuel remaining at this change: ${Math.floor(result.remainingMs/60000)} minutes.`:' Ground Oil deals five Fire damage at most once per creature turn and burns for twelve seconds.'}</p>}
    {result.instinctivePounce&&<p>Instinctive Pounce: optionally move up to {result.instinctivePounce.maximumFeet} feet as part of entering Rage. Opportunity Attacks apply normally.</p>}
    {result.type==='equipment.dawn'&&<ul>{result.recoveries.map(r=><li key={r.instanceId}>{r.instanceId}: dawn rolls {r.rolls.join(' + ')}, recovered {r.recovered}; {r.chargesRemaining} charges remaining.</li>)}</ul>}
    {result.type==='spells.discover'&&<p>Discovery recorded: {result.discovery.discoveryId}, {result.discovery.spellId}.</p>}
    {['spells.copy','folio.rebuild'].includes(result.type)&&<p>Transcribed {result.spellIds.join(', ')}; paid {result.costCp} copper and completed {result.hours} required hours.</p>}
    {result.type==='folio.lose'&&<p>Folio {result.folioId} lost. {result.memorizedSpellIds.length} prepared spells retained in memory; unprepared lost spells remain unavailable.</p>}
    {result.crewCommand&&<><p>Crew command within {result.crewCommand.rangeFeet} feet. Each ally spends its own available Reaction.</p><ul>{result.crewCommand.grants.map(g=><li key={g.targetId}>{g.targetId}: {g.repeatSaveAgainst?`repeat the original ${g.repeatSaveAgainst} save with Advantage; end the condition on success`:'move up to half Speed without Opportunity Attacks'}.</li>)}</ul><p>{result.crewCommand.resolution}</p></>}
    {result.parley&&<p>Binding Parley targets: {result.parley.targetIds.join(', ')}. On failure: Charmed and cannot attack you. Repeat the save at each target turn end. Harm from you or an ally ends both effects for that target. Charmed immunity prevents both effects. Duration: one minute.</p>}
    {result.hitInstead&&result.featId===undefined&&<p>The signature weapon attack hits instead. It is not a Critical Hit; choose before rolling damage.</p>}
    {result.type==='tool.check'&&<p>{result.definitionId}: {result.attribute} modifier {result.modifier}; total {result.total}{result.dc!==undefined?` against DC ${result.dc}: ${result.success?'success':'failure'}`:''}. {result.expertise?'Expertise. ':result.toolTrained||result.skillTrained?'Training. ':''}{result.advantage&&result.disadvantage?'Advantage and Disadvantage cancel.':result.advantage?'Advantage.':result.disadvantage?'Disadvantage.':''}{result.featureAdvantage?' Path task Advantage applies.':''}{result.tradeBonus?` Ghost Patch trade bonus +${result.tradeBonus}.`:''}</p>}
    {result.type==='strike.resolve'&&<><p>{result.kind==='cunning'?'Sneak Attack':'Brutal Strike'} damage: {result.extraDamage} {result.damageType}. Forgone Sneak Attack dice: {result.costDice}. {result.hit===false?'Chosen attack missed; no damage/effects, and this turn’s Brutal Strike choice is used.':''}</p>
      <ul>{result.effects.map(e=><li key={e.id}>{e.optionId.replaceAll('-',' ')}: {e.save?`${e.save.attribute} save DC ${e.save.dc}; `:''}{e.targetCondition??''} {e.pushFeet?`push ${e.pushFeet} feet`:''} {e.speedReductionFeet?`Speed -${e.speedReductionFeet} feet`:''} {e.movementFeet!==undefined?`move up to ${e.movementFeet} feet without Opportunity Attacks`:''} {e.targetTurnRestriction??''} {e.nextSaveDisadvantage?'next saving throw has disadvantage; no Opportunity Attacks':''} {e.nextOtherCreatureAttackBonus?'next other creature attack +5 (does not stack)':''} {e.preservesHide?'retain Hide only with required end-of-turn cover':''}</li>)}</ul></>}
    {result.type==='feat.use'&&<><p>{result.featId}: {result.hitInstead?'Attack hits instead; this is not a natural twenty.':''}{result.invisible?'Invisible until you take an action, Bonus Action or Reaction.':''}{result.stabilize?'Target stabilized without healing.':''}</p>
      {result.weaponDiceTotal!==undefined&&<p>Weapon dice totals: {result.totals.join(' or ')}. Best: {result.weaponDiceTotal}; add the attack's permitted flat modifier and separate rider dice.</p>}
      {result.adjustment!==undefined&&<p>Fate adjustment {result.adjustment}; new D20 Test total {result.total}.</p>}
      {result.swap&&<p>Initiative swap: you now have {result.swap.ownerReceives}; ally receives {result.swap.allyReceives}. External table allies must record their total with the GM.</p>}
      {result.teleportFeet!==undefined&&<p>Teleport up to {result.teleportFeet} feet to the confirmed visible unoccupied space.</p>}
      {result.extraDamage!==undefined&&<p>Extra damage: {result.extraDamage} {result.damageType}.</p>}
      {result.grapple&&<p>Punch and Grab: target chooses Might or Agility save DC {result.grapple.dc}; also apply the Unarmed Strike damage.</p>}
    </>}
    {result.deathSaves&&<p>{result.deathSaves.dead?'Dead.':result.deathSaves.stable?'Stable.':`${result.deathSaves.successes} successful and ${result.deathSaves.failures} failed death saves.`}</p>}
    {result.additionalAction&&<p>Additional action: {result.additionalAction}. Magic actions are excluded.</p>}
    {result.tacticalShift&&<p>Tactical Shift: move up to {result.tacticalShift.maximumFeet} feet without provoking Opportunity Attacks.</p>}
    {result.objectHealing!==undefined&&<p>Object repair: {result.objectHealing} Health.</p>}
    {result.damageReduction!==undefined&&<p>Reduce the confirmed damage by {result.damageReduction}.</p>}
    {result.remainingDamage!==undefined&&<p>Remaining damage before Resistance: {result.remainingDamage}.</p>}
    {result.allyDamage!==undefined&&<p>Ally takes {result.allyDamage}; you take {result.transferredDamage}, which cannot be reduced.</p>}
    {result.discharge&&<p>Relay destroyed. Discharge targets: {result.discharge.targetIds.join(', ')||'none'}.</p>}
    {result.save&&<p>Targets make a {result.save.attribute} save against DC {result.save.dc}. {result.damage!==undefined?`${result.damage} ${result.damageType} damage on failure; ${result.save.successDamage??(result.save.success==='half'?Math.floor(result.damage/2):0)} on success.`:''}</p>}
    {result.effect?.targetConditions&&<p>On failed saves: {result.effect.targetConditions.join(', ')}. {result.effect.fleeCaster?'Move away from the caster.':''} {result.effect.targetTurnRestriction??''} Ends on target damage{result.effect.endsOnCasterIncapacitated?' or caster Incapacitation':''}.</p>}
    {result.targetResolutions&&<><p>Resolve each saving throw with the GM. Overlapping charge areas affect each listed target once.</p>
      <div style={{overflowX:'auto'}}><table><thead><tr><th>Target</th><th>Area</th><th>Fire damage</th><th>Save</th><th>On success</th><th>Effects</th></tr></thead>
        <tbody>{result.targetResolutions.map(t=><tr key={t.targetId}><td>{t.targetId}</td><td>{t.areaId}</td><td>{t.damage}</td>
          <td>{t.save?`${t.save.attribute} DC ${t.save.dc}${t.save.advantage?' (advantage)':''}`:'Unattended object'}</td><td>{t.save?.successDamage??'—'}</td>
          <td>{t.exempt?'Exempt from charge effects. ':''}{t.smokeAffected?'Heavy obscurement. ':''}{t.ignoresFireResistance?'Ignores Fire resistance.':''}</td></tr>)}</tbody></table></div>
    </>}
  </section>;
}
