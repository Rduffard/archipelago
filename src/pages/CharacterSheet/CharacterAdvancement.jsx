import { useState } from 'react'
import { unspentRewards, advancementRequest } from '../../lib/advancement'

const attributes = ['might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']

function AttributeReward({ reward, busy, canExchange, onAdvance }) {
  const [first, setFirst] = useState('might')
  const [second, setSecond] = useState('')
  return <fieldset disabled={busy}>
    <legend>Level {reward.level} attribute milestone</legend>
    <label>Improve attribute <select value={first} onChange={e => setFirst(e.target.value)}>{attributes.map(key => <option key={key}>{key}</option>)}</select></label>
    <label>Second attribute <select value={second} onChange={e => setSecond(e.target.value)}><option value="">None: +2 to the first</option>{attributes.filter(key => key !== first).map(key => <option key={key}>{key}</option>)}</select></label>
    <button type="button" disabled={second === first} onClick={() => onAdvance({ spends: [{ rewardId: reward.id, kind: 'attribute', increases: second ? { [first]: 1, [second]: 1 } : { [first]: 2 } }] })}>Apply improvement</button>
    {canExchange ? <><button type="button" onClick={() => onAdvance({ exchanges: [{ rewardId: reward.id, kind: 'calling' }] })}>Exchange for Calling selection</button><button type="button" onClick={() => onAdvance({ exchanges: [{ rewardId: reward.id, kind: 'path' }] })}>Exchange for Path investment</button></> : null}
  </fieldset>
}

export default function CharacterAdvancement({ character, rules, startingPackage, onAdvance }) {
  const [selectedLevel, setSelectedLevel] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const ledger = character.advancement
  async function submit(changes) {
    if (busy) return
    setBusy(true)
    setError('')
    try { await onAdvance(advancementRequest(character, changes)); setSelectedLevel('') }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  if (!ledger) return <section className="review-card"><h2>Advancement</h2><p>Historical progression is preserved. A reviewed upgrade is required before using the new reward system.</p></section>
  const rewards = unspentRewards(character, rules)
  const level = character.progression.rank
  return <section className="review-card">
    <h2>Advancement · Level {level}</h2>
    <p>Defining passive: {ledger.passive.name}. Original combat text awaits review; no converted combat effect is applied.</p>
    <p>Unspent rewards: {rewards.length}. Milestone exchanges: {ledger.exchanges.length} / 2. Exchanges require an explicit respec to reverse.</p>
    <p>Calling selections await reviewed ability definitions. Path investments await reviewed four-tier content. Rewards remain available.</p>
    {startingPackage ? <p>Planned equipment proficiencies: {[...startingPackage.weapons, ...startingPackage.armor, ...startingPackage.tools].join(', ') || 'None'}. Item categories and combat effects await review.</p> : null}
    <fieldset disabled={busy || level === 20}><legend>Record a level increase</legend><label>New level <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}><option value="">Choose level</option>{Array.from({ length: 20 - level }, (_, i) => level + i + 1).map(n => <option key={n} value={n}>{n}</option>)}</select></label><button type="button" disabled={!selectedLevel} onClick={() => submit({ level: Number(selectedLevel) })}>Record level</button></fieldset>
    {rewards.map(reward => reward.kind === 'attribute' ? <AttributeReward key={reward.id} reward={reward} busy={busy} canExchange={ledger.exchanges.length < 2} onAdvance={submit} /> : <p key={reward.id}>Level {reward.level}: unspent {reward.kind === 'calling' ? 'Calling selection' : 'Path investment'} · content pending review</p>)}
    {error ? <p role="alert">{error}</p> : null}
  </section>
}
