import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCharacters } from '../../lib/api'
import { combatRequest } from '../../lib/combatApi'
import PageHeader from '../../components/layout/PageHeader'
import '../shared/PageShell.css'

export function CombatPanel({ encounter, busy, onCommand }) {
  const actor = encounter.combatants.find(c => c.id === encounter.activeCombatant)
  const corsair = encounter.combatants.find(c => c.id !== 'enemy')
  const enemy = encounter.combatants.find(c => c.id === 'enemy')
  const latest = [...encounter.events].reverse()
  return <section className="character-sheet__panel" aria-label="Test encounter">
    <p>Practice encounter changes do not update the permanent character sheet. External character edits are not synchronized into this encounter.</p>
    <p>Fixed in-range practice encounter. No movement, cover, abilities, or character synchronization. The opponent can pass its turn.</p>
    <p>{corsair.name} · {corsair.calling} · Level {corsair.level} · Health {corsair.health.current}/{corsair.health.max} · Cutlass (1d6 slashing, finesse, light; {corsair.weaponTraining.includes('cutlass') ? 'practice-only proficiency' : 'not proficient'})</p>
    <p>{enemy.name} · Guard {enemy.guard} (unarmored) · Health {enemy.health.current}/{enemy.health.max}</p>
    <p>Round {encounter.round} · {encounter.status} · Active: {actor.name} · Action: {actor.actions ? 'available' : 'spent'} · Revision {encounter.revision}</p>
    <button disabled={busy || encounter.status !== 'active' || actor.id === 'enemy' || !actor.actions} onClick={() => onCommand('attack')}>Attack with cutlass</button>
    <button disabled={busy || encounter.status !== 'active'} onClick={() => onCommand('end-turn')}>End {actor.name} turn</button>
    <button disabled={busy || encounter.status === 'completed'} onClick={() => onCommand(encounter.status === 'paused' ? 'resume' : 'pause')}>{encounter.status === 'paused' ? 'Resume' : 'Pause'}</button>
    <div role="status" aria-live="polite">{latest[0]?.attackDice ? `${latest[0].result}: attack ${latest[0].attackTotal} against Guard ${latest[0].targetGuard}; ${latest[0].damageApplied} damage applied. Target Health ${latest[0].healthAfter}.` : 'Choose Attack to resolve on the server.'}</div>
    <h2>Combat events</h2>
    <ol>{latest.slice(0, 20).map(event => <li key={event.commandId}>#{event.revision} {event.actor}: {event.result}{event.attackDice ? ` · d20 [${event.attackDice.join(', ')}] → ${event.selectedD20}, modifier ${event.attributeModifier}, proficiency ${event.proficiency}, total ${event.attackTotal} vs Guard ${event.targetGuard}; damage [${event.damageDice.join(', ')}] + ${event.damageModifier} = ${event.damageTotal}, applied ${event.damageApplied}; Health ${event.healthBefore} → ${event.healthAfter}` : ''}</li>)}</ol>
  </section>
}
export function CharacterSelection({characters,loading,error,selected,onSelect,busy,practiceProficiency,onProficiency,onStart}) {
  return <section aria-label="Character practice selection">
    <p>Temporary cutlass and unarmored Guard only. Permanent equipment and resources are unchanged.</p>
    {loading ? <p role="status">Loading characters…</p> : error ? <p role="alert">{error}</p> : !characters.length ? <p>No characters available. Create a character or use the fixture below.</p> : <label>Character <select value={selected} onChange={event => onSelect(event.target.value)} disabled={busy}><option value="">Select a character</option>{characters.map(c => <option key={c._id} value={c._id}>{c.name} · {c.calling} · Level {c.progression?.rank ?? 'unavailable'} · Health {c.resources?.health?.current ?? '?'}/{c.resources?.health?.max ?? '?'}</option>)}</select></label>}
    <label><input type="checkbox" checked={practiceProficiency} onChange={event => onProficiency(event.target.checked)} disabled={busy} />Grant cutlass proficiency for this practice encounter only</label>
    <p>General Skill Training and Calling equipment labels do not establish weapon proficiency. The server checks character eligibility.</p>
    <button disabled={busy || loading || Boolean(error) || !characters.some(c => c._id === selected)} onClick={onStart}>Start Character Encounter</button>
  </section>
}
export default function CombatTestPage() {
  const { token } = useAuth()
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const [roster, setRoster] = useState([])
  const [rosterLoading, setRosterLoading] = useState(true)
  const [rosterError, setRosterError] = useState('')
  const [selected, setSelected] = useState('')
  const [practiceProficiency, setPracticeProficiency] = useState(false)
  const [encounter, setEncounter] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  useEffect(() => {
    let current = true
    if (encounterId) combatRequest(token, `/${encounterId}`).then(value => { if (current) setEncounter(value) }).catch(err => { if (current) setError(err.message) })
    return () => { current = false }
  }, [token, encounterId])
  useEffect(() => {
    let current = true
    getCharacters(token).then(values => { if (current) { setRoster(values); setRosterLoading(false) } }).catch(err => { if (current) { setRosterError(err.message); setRosterLoading(false) } })
    return () => { current = false }
  }, [token])
  async function initialize(character = false) {
    setBusy(true); setError('')
    try { const value = await combatRequest(token, character ? '/from-character' : '/test', character ? { characterId: selected, practiceProficiency } : {}); setEncounter(value); navigate(`/combat-test/${value._id}`) }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function send(command) {
    setBusy(true); setError(''); setPending(command)
    try { setEncounter(await combatRequest(token, `/${encounterId}/commands`, command)); setPending(null) }
    catch (err) {
      setError(err.message)
      // A lost response is safe to retry with the same command identifier.
      try { setEncounter(await combatRequest(token, `/${encounterId}`)) } catch { /* Keep last server snapshot. */ }
    } finally { setBusy(false) }
  }
  function command(type) {
    const value = { id: crypto.randomUUID(), expectedRevision: encounter.revision, type, actor: encounter.activeCombatant }
    if (type === 'attack') Object.assign(value, { weapon: 'cutlass', target: 'enemy' })
    send(value)
  }
  return <main className="page-shell"><PageHeader title="Combat test" description="Server-resolved practice encounter" />
    {!encounterId ? <>
      <CharacterSelection characters={roster} loading={rosterLoading} error={rosterError} selected={selected} onSelect={setSelected} busy={busy} practiceProficiency={practiceProficiency} onProficiency={setPracticeProficiency} onStart={() => initialize(true)} />
      <button disabled={busy} onClick={() => initialize(false)}>Start test encounter (fixture Corsair)</button>
    </> : null}
    {error ? <p role="alert">{error}</p> : null}
    {pending && !busy ? <><button onClick={() => send(pending)}>Retry same command safely</button><button onClick={() => { setPending(null); setError('') }}>Dismiss command</button></> : null}
    {encounter && encounterId ? <CombatPanel encounter={encounter} busy={busy || Boolean(pending)} onCommand={command} /> : null}
  </main>
}
