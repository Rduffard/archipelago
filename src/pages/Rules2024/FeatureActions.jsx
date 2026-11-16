import { featureRestorations, featureRestorationError } from '@crossworld/sanguine-engine/resources/feature-restoration';

export default function FeatureActions({ summary, state, busy, onCommand }) {
  return <details><summary>Feature actions and temporary Health</summary>
    <fieldset disabled={busy}>
      <p>Temporary Health: {state.temporaryHealth ?? 0}</p>
      {featureRestorations.filter(({poolId}) => summary.resources[poolId]).map(restoration => {
        const {poolId,slotLevel,bonusAction}=restoration;
        const error=featureRestorationError(restoration,{poolId,resources:summary.resources,pools:state.pools,
          slots:state.slots,tidecallerLevel:summary.callingLevels?.tidecaller,slotLevel});
        return <button key={poolId} disabled={Boolean(error)}
        onClick={() => onCommand('resource.convert', { type: 'restore-feature', poolId, ...(slotLevel ? { slotLevel } : {}) })}>
        Restore {poolId.replaceAll('-', ' ')} {slotLevel?`with a level-five slot (${bonusAction?'Bonus Action':'no action'})`:'using its alternate cost'}
        </button>;
      })}
      {summary.resources['reaver:persistent-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onCommand('resource.adjust', { type: 'initiative-recovery', poolId: 'reaver:rage' })}>Initiative: recover Rage (once per Long Rest)</button>}
      {summary.resources['storm-broker:eye-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onCommand('resource.adjust', { type: 'initiative-recovery', poolId: 'storm-broker:squall' })}>Initiative: recover one Squall when empty</button>}
      {summary.resources['reef-colossus:colossus-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onCommand('resource.adjust', { type: 'initiative-recovery', poolId: 'reef-colossus:colossus' })}>Initiative: recover one Colossus use when empty</button>}
    </fieldset>
  </details>;
}
