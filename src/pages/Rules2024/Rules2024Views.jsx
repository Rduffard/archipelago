import startingEquipment from '@crossworld/sanguine-engine/equipment/starting-equipment';
import { RuleDetails } from '../../game/creator/CreatorViews';
import { choiceTitle, skillExamples } from '../../game/creator/choiceLabels';
import { useState } from "react";
import { attributeNames } from "./labels";
import { rollSheetCheck } from './rolls';
function ruleLabel(id, rules) {
  if(id.startsWith('language:'))return rules.creation?.origins.find(o=>o.id===id.slice(9))?.name??id.slice(9);
  if(id.startsWith('skill:'))return 'Skill: '+ruleLabel(id.slice(6),rules);
  if(id.startsWith('tool:'))return 'Tool: '+id.slice(5).replaceAll('-',' ');
  return (
    [...rules.skills, ...rules.paths, ...rules.spells, ...rules.feats, ...rules.equipment.items].find(
      (item) => item.id === id
    )?.name ?? id.replace(/-/g, " ")
  );
}
export function CallingProgression({ calling, rules }) {
  return (
    <section>
      <h2>{calling.name}: levels 1–20</h2>
      <p>
        d{calling.hitDie} Hit Die. Saving throw Training:{" "}
        {calling.starting.saves.map((id) => attributeNames[id]).join(", ")}.
      </p>
      <div className="rules-2024__table">
        <table>
          <thead>
            <tr>
              <th>Calling level</th>
              <th>Features</th>
              <th>Path</th>
              <th>Spell slots</th>
            </tr>
          </thead>
          <tbody>
            {calling.progression.map((row) => (
              <tr key={row.callingLevel}>
                <td>{row.callingLevel}</td>
                <td>
                  {row.features
                    .map((f) => f.rules[0]?.name ?? f.name)
                    .join(", ")}
                  {row.featChoice ? " · Feat choice" : ""}
                </td>
                <td>
                  {row.pathChoiceRequired
                    ? "Choose a Path"
                    : row.pathFeatureGrant
                    ? "Automatic Path features"
                    : "—"}
                </td>
                <td>{row.spellcasting?.slots.join(" / ") ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Paths</h3>
      {rules.paths
        .filter((path) => path.callingId === calling.id)
        .map((path) => (
          <details key={path.id}>
            <summary>
              {path.name}
              {path.status === "reserved" ? " — reserved" : ""}
            </summary>
            <p>{path.description}</p>
            {path.grants
              .map((id) => rules.features.find((f) => f.id === id))
              .map((feature) => (
                <article key={feature.id}>
                  <h4>
                    Calling level {feature.callingLevel}: {feature.name}
                  </h4>
                  <p>{feature.description}</p>
                </article>
              ))}
          </details>
        ))}
    </section>
  );
}
export function RulesSummary({ summary, rules, title = "Temporary character sheet", equipment, playerChecks = false, referenceOnly = false }) {
  const [rollMode, setRollMode] = useState('normal');
  const [result, setResult] = useState(null);
  const [primalKnowledge,setPrimalKnowledge]=useState(false);
  const [checkTask,setCheckTask]=useState('general');
  function check(name, modifier, attribute, stealth = false, skillId, savingThrow=false) {
    const roll = rollSheetCheck(summary,equipment,{modifier,attribute,stealth,skillId,savingThrow,rollMode,primalKnowledge,task:checkTask});
    setResult({ name, ...roll });
  }
  const signed = value => value >= 0 ? "+" + value : value;
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      {!referenceOnly && <>
      <label>Roll mode <select value={rollMode} onChange={e => setRollMode(e.target.value)}>
        <option value="normal">Normal</option><option value="advantage">Advantage</option><option value="disadvantage">Disadvantage</option>
      </select></label>
      {(cinderSafeHandlingUnlocked(summary.paths.gunslinger,summary.callingLevels.gunslinger)||summary.detectFalseAdvantage||summary.paths.navigator==='storm-broker')&&<label>GM-confirmed check task <select value={checkTask} onChange={e=>setCheckTask(e.target.value)}><option value="general">General check</option>{cinderSafeHandlingUnlocked(summary.paths.gunslinger,summary.callingLevels.gunslinger)&&<option value="inspect-explosives">Inspect explosives (Safe Handling)</option>}{summary.detectFalseAdvantage&&<option value="detect-false">Detect disguises, shapechanging or illusions</option>}{summary.paths.navigator==='storm-broker'&&<><option value="predict-weather">Predict natural weather (Instinct, weather discipline)</option><option value="interpret-signals">Interpret signals (Wit, signals discipline)</option></>}</select></label>}
      {summary.raging&&summary.rageSkillModifiers&&<label><input type="checkbox" checked={primalKnowledge} onChange={e=>setPrimalKnowledge(e.target.checked)}/>Use Primal Knowledge Might for eligible trained Rage checks</label>}
      {summary.poisonedSaveAdvantage&&<p>Advantage on saving throws against Poisoned. Select Advantage for that save. End a next-save-only Inoculated effect after rolling.</p>}
      {result && <p className="sa-roll-result" role="status">{result.name}: {result.dice.join(' / ')}{result.naturalFloorApplied?` (treated as ${result.natural})`:''} {result.modifier >= 0 ? '+' : ''}{result.modifier} = {result.total}{result.minimumTotalApplied?' (Indomitable Might minimum)':''}</p>}
      {playerChecks ? <>
        <div className="sa-sheet__attributes">
          {Object.entries(attributeNames).map(([id, name]) => <article key={id}>
            <h3>{name}</h3><strong>{summary.attributes[id]}</strong>
            <button aria-label={'Roll ' + name + ' check'} onClick={() => check(name, summary.attributeModifiers[id], id)}>
              Check {signed(summary.attributeModifiers[id])}
            </button>
            <button aria-label={'Roll ' + name + ' save'} onClick={() => check(name + ' saving throw', summary.savingThrowModifiers[id], id, false, undefined, true)}>
              Save {signed(summary.savingThrowModifiers[id])}
            </button>
            {summary.savingThrows.includes(id) && <small>Trained save</small>}
          </article>)}
        </div>
        <h3>Skills</h3>
        <div className="sa-sheet__skills">
          {rules.skills.map(skill => <button key={skill.id} type="button" onClick={() =>
            check(skill.name, summary.skillModifiers[skill.id], skill.attribute, skill.id === 'stealth', skill.id)}>
            <span>{skill.name}<small>{summary.expertise.includes(skill.id) ? 'Expertise' : summary.training.includes(skill.id) ? 'Trained' : attributeNames[skill.attribute]}</small></span>
            <strong>{signed(summary.skillModifiers[skill.id])}</strong>
          </button>)}
        </div>
      </> : <>
      <table>
        <thead><tr><th>Attribute</th><th>Score</th><th>Modifier</th><th>Saving throw</th></tr></thead>
        <tbody>{Object.entries(attributeNames).map(([id, name]) => <tr key={id}>
          <th>{name}</th><td>{summary.attributes[id]}</td>
          <td><button onClick={() => check(name, summary.attributeModifiers[id], id)}>{summary.attributeModifiers[id]}</button></td>
          <td><button onClick={() => check(name + ' saving throw', summary.savingThrowModifiers[id], id,false,undefined,true)}>{summary.savingThrowModifiers[id]}{summary.savingThrows.includes(id) ? " (Trained)" : ""}</button></td>
        </tr>)}</tbody>
      </table>
      <details><summary>Skills</summary>
        <table><thead><tr><th>Skill</th><th>Modifier</th><th>Training</th></tr></thead>
          <tbody>{rules.skills.map(skill => <tr key={skill.id}><th>{skill.name}</th>
            <td><button onClick={() => check(skill.name, summary.skillModifiers[skill.id], skill.attribute, skill.id === 'stealth',skill.id)}>{summary.skillModifiers[skill.id]}</button></td><td>{summary.expertise.includes(skill.id) ? "Expertise" : summary.training.includes(skill.id) ? "Trained" : "Untrained"}</td></tr>)}</tbody>
        </table>
      </details>
      </>}
      </>}
      {playerChecks ? null : <>
      <p>
        Character level {summary.totalLevel} · Training Bonus +
        {summary.trainingBonus} · Health {summary.health.max}
      </p>
      <p>
        {Object.entries(summary.callingLevels)
          .map(
            ([id, n]) => `${rules.callings.find((c) => c.id === id).name} ${n}`
          )
          .join(" / ")}
      </p>
      <p>
        Hit Dice:{" "}
        {Object.entries(summary.hitDice)
          .map(([die, n]) => `${n}${die}`)
          .join(", ")}
      </p>
      <p>Speed: walk {summary.movement.walk} ft; climb {summary.movement.climb} ft; swim {summary.movement.swim} ft; fly {summary.movement.fly} ft.{summary.waterBreathing?' Can breathe underwater.':''}{summary.ignoreHalfCoverOnSpellAttacks?' Spell attacks ignore Half Cover.':''}</p>
      <p>
        Saving throw Training:{" "}
        {summary.savingThrows.map((id) => attributeNames[id]).join(", ")}
      </p>
      <p>
        Skill Training:{" "}
        {summary.training.map((id) => ruleLabel(id, rules)).join(", ")}
      </p>
      <p>
        Paths:{" "}
        {Object.values(summary.paths)
          .map((id) => ruleLabel(id, rules))
          .join(", ") || "Not yet selected"}
      </p>
      <p>
        Required choices:{" "}
        {summary.decisionsComplete
          ? "complete for this progression stage"
          : summary.requiredChoices.length + " remaining"}
        . Full playtest readiness is pending.
      </p>
      <h3>Feature resources</h3>
      <ul>
        {Object.entries(summary.resources).map(([id, p]) => (
          <li key={id}>
            {id.split(":").at(-1).replace(/-/g, " ")}: {p.max}; Long Rest:{" "}
            {p.recovery.longRest}; Short Rest: {p.recovery.shortRest}
          </li>
        ))}
      </ul>
      <h3>Spell slots</h3>
      <p>
        {summary.spellSlots.length
          ? summary.spellSlots.map((n, i) => `Level ${i + 1}: ${n}`).join(" · ")
          : "None"}
      </p>
      {Object.entries(summary.spellcasting).map(([id, s]) => (
        <details key={id}>
          <summary>
            {rules.callings.find((c) => c.id === id).name} spellcasting
          </summary>
          <p>
            Save DC {s.saveDC} · Attack {s.attackModifier >= 0 ? "+" : ""}
            {s.attackModifier} · Prepared {s.preparedCount}
          </p>
          {[...s.cantrips, ...s.prepared, ...s.alwaysPrepared]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((spellId) => {
              const spell = rules.spells.find((v) => v.id === spellId);
              return (
                <details key={spellId}>
                  <summary>{ruleLabel(spellId, rules)}</summary>
                  <p>{spell?.description ?? "See the source spell rules."}</p>
                </details>
              );
            })}
        </details>
      ))}
      <h3>Acquired feature rules</h3>
      <details><summary>Recorded feature choices and Training</summary>
        {Object.entries(summary.pathSelections).map(([id, choices]) => <div key={id}>
          <h4>{rules.callings.find(c => c.id === id).name}</h4>
          <dl>{Object.entries(choices).map(([key, value]) => <div key={key}>
            <dt>{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd>{(Array.isArray(value) ? value : [value]).filter(Boolean).map(v => ruleLabel(v, rules)).join(', ')}</dd>
          </div>)}</dl>
        </div>)}
        <p>Tools: {summary.equipmentTraining.tools.join(', ') || 'None'}.</p>
        <p>Tool Expertise: {summary.toolExpertise.join(', ') || 'None'}.</p>
        <p>Resistances: {summary.resistances.join(', ') || 'None'}.</p>
        <p>Languages: {summary.languages.map(id => id.replaceAll('-', ' ')).join(', ')}.</p>
      </details>
      {[...summary.feats, ...summary.fightingStyles].map((id,index) => {
        const feat = rules.feats.find(f => f.id === id);
        return <details key={`${id}:${index}`}><summary>{feat?.name || id}</summary><p>{feat?.description}</p></details>;
      })}
      {summary.features.map((f) => (
        <details key={f.id}>
          <summary>
            {f.name} · Calling level {f.callingLevel}
          </summary>
          <p>{f.description}</p>
          <small>GM-adjudicated rules; combat effects are not automated.</small>
        </details>
      ))}
      </>}
    </section>
  );
}
export function RequiredChoice({ choice, rules, onChange, initialSelected=[], tiles=false, onDraftChange }) {
  const [selected, setSelected] = useState(()=>[...new Set([...(tiles ? choice.requiredOptions ?? [] : []), ...initialSelected])].filter(id=>choice.options.includes(id)).slice(0,choice.count));
  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(option => option !== id) : choice.count === 1 ? [id] : [...selected, id];
    setSelected(next);
    onDraftChange?.(next);
  }
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState("might");
  const [feat, setFeat] = useState(choice.options.includes('ability-score-improvement')?'ability-score-improvement':choice.options[0]);
  const [split, setSplit] = useState(false);
  const [second, setSecond] = useState("agility");
  const featDefinition=rules.feats.find(f=>f.id===feat);
  const allowedAttributes=featDefinition?.attributeOptions??(feat==='grappler'||feat==='boon-of-irresistible-offense'?['might','agility']:feat==='boon-of-spell-recall'?['wit','instinct','spirit']:Object.keys(attributeNames));
  const firstChoice=allowedAttributes.includes(first)?first:allowedAttributes[0];
  if (choice.key === "feat")
    return (
      <fieldset>
        <legend>Feat choice</legend>
        <p>
          Choose an eligible feat. Its required subchoices are requested before saving.
        </p>
        <select
          aria-label="Feat"
          value={feat}
          onChange={(event) => setFeat(event.target.value)}
        >
          {choice.options.map((id) => (
            <option key={id} value={id}>
              {ruleLabel(id, rules)}
            </option>
          ))}
        </select>
        <p>{featDefinition?.description}</p>
        {feat === 'ability-score-improvement' && <>
          <label><input type="checkbox" checked={split} onChange={e => setSplit(e.target.checked)} />Increase two attributes by 1</label>
          {split && <select aria-label="Second improved attribute" value={second} onChange={e => setSecond(e.target.value)}>
            {Object.entries(attributeNames).map(([id, name]) => <option key={id} value={id} disabled={id === first}>{name}</option>)}
          </select>}
        </>}
        {rules.feats.find(f=>f.id===feat)?.category!=='origin'&&<select
          aria-label="Improved attribute"
          value={firstChoice}
          onChange={(event) => setFirst(event.target.value)}
        >
          {Object.entries(attributeNames).filter(([id])=>allowedAttributes.includes(id)).map(([id, name]) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>}
        <button
          type="button"
          disabled={feat === 'ability-score-improvement' && split && first === second}
          onClick={() =>
            onChange({
              feat,
              increases: rules.feats.find(f=>f.id===feat)?.category==='origin' ? {} : feat === 'ability-score-improvement' && split ? { [first]: 1, [second]: 1 } : {
                [firstChoice]: feat === "ability-score-improvement" ? 2 : 1,
              },
            })
          }
        >
          Confirm feat
        </button>
      </fieldset>
    );
  return (
    <fieldset>
      <legend>
        {choiceTitle(choice.key)} — choose {choice.count}
      </legend>
      {choice.requiredOptions?.length>0&&<p>Keep {choice.requiredOptions.map(id=>ruleLabel(id,rules)).join(', ')}. Replace duplicate Training with another available skill.</p>}
      {tiles ? <>
        {choice.options.length > 12 && <label>Filter choices <input type="search" value={search}
          onChange={event => setSearch(event.target.value)} /></label>}
        <div className="sa-choice-grid">
          {choice.options.filter(id => selected.includes(id) ||
            ruleLabel(id, rules).toLowerCase().includes(search.trim().toLowerCase())).map(id => {
            const checked = selected.includes(id);
            const required = choice.requiredOptions?.includes(id);
            const spell = rules.spells.find(entry => entry.id === id);
            const kit = choice.key === 'equipment' ? (rules.startingEquipment ?? startingEquipment.packages)[choice.callingId] : null;
            const option = kit?.[id.replace(/^pack-/, '')];
            const skill = rules.skills.find(entry => entry.id === id.replace(/^skill:/, ''));
            const item = rules.equipment.items.find(entry => entry.id === id);
            const itemDetails = [item?.damage, ...(Array.isArray(item?.properties) ? item.properties : [])]
              .filter(value => typeof value === 'string').join(' · ');
            const equipmentTitle = ['gold', 'starting-gold'].includes(id) && kit ? kit.gold + ' GP' : option?.items ? 'Package ' + id.replace(/^pack-/, '').toUpperCase() : null;
            const equipmentItems = option?.items?.map(item => ruleLabel(item, rules)).join(', ');
            return <div key={id} className="sa-choice-option"><label className="sa-card">
              <input type="checkbox" checked={checked} disabled={required || choice.count > 1 && !checked && selected.length >= choice.count}
                onChange={() => toggle(id)} />
              <span><strong>{equipmentTitle ?? ruleLabel(id, rules)}</strong>
                {required && <small>Granted by Background</small>}
                {skill && <small>{attributeNames[skill.attribute]} · {skillExamples[skill.id]}</small>}
                {spell && <small>{spell.level === 0 ? 'Cantrip' : 'Level ' + spell.level}{spell.school && ' · ' + spell.school}</small>}
                {equipmentItems && <small>{equipmentItems}</small>}
              </span>
            </label>
            {(spell?.description || item?.description || itemDetails) &&
              <RuleDetails title={ruleLabel(id, rules) + ' details'}>{spell?.description || item?.description || itemDetails}</RuleDetails>}
            </div>;
          })}
        </div>
        <p role="status">{selected.length} of {choice.count} selected</p>
        {selected.map(id => rules.feats.find(feat => feat.id === id)).filter(entry => entry?.description)
          .map(entry => <RuleDetails key={entry.id} title={entry.name + ' details'}>{entry.description}</RuleDetails>)}
      </> : <select
        multiple
        size={Math.min(8, Math.max(2, choice.options.length))}
        aria-label={choice.key}
        value={selected}
        onChange={(event) =>
          setSelected(
            Array.from(event.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {choice.options.map((id) => (
          <option key={id} value={id}>
            {ruleLabel(id, rules)}
          </option>
        ))}
      </select>}
      {onChange && <button
        type="button"
        disabled={selected.length !== choice.count}
        onClick={() => onChange({ [choice.key]: selected })}
      >
        Confirm choice
      </button>}
    </fieldset>
  );
}
import {cinderSafeHandlingUnlocked} from '@crossworld/sanguine-engine/callings/cinder-artillerist';
export function LineageSummary({ lineage, state, rules, headingId = "character-lineage" }) {
  if (!lineage) return null;
  const definition = rules.creation.lineages?.find(entry => entry.id === lineage.id);
  const forms = lineage.animalForms;
  const savedForms = state?.animalForms;
  return <section aria-labelledby={headingId}>
    <h2 id={headingId}>Lineage</h2>
    <p>{definition?.name ?? lineage.id}</p>
    {lineage.traits?.length > 0 && <ul>
      {lineage.traits.map(trait => <li key={trait.id}>{trait.name}</li>)}
    </ul>}
    <p>{Object.entries(lineage.movement ?? {}).filter(([, speed]) => speed > 0)
      .map(([mode, speed]) => mode + ' ' + speed + ' ft').join(' · ')}
      {lineage.senses?.darkvision > 0 && ' · Darkvision ' + lineage.senses.darkvision + ' ft'}</p>
    {lineage.damageResistances?.length > 0 && <p>Damage resistance: {lineage.damageResistances.join(', ')}.</p>}
    {lineage.maxHealthAdjustment > 0 && <p>Lineage Health bonus: +{lineage.maxHealthAdjustment}.</p>}
    {lineage.originFeat && <p>Origin feat: {ruleLabel(lineage.originFeat.id, rules)}.</p>}
    {lineage.heritage && <p>Heritage: {definition?.heritages?.[lineage.heritage]?.name ?? lineage.heritage}.</p>}
    {lineage.trainedSkills?.length > 0 && <p>Lineage Training: {lineage.trainedSkills.map(id => ruleLabel(id, rules)).join(', ')}.</p>}
    {lineage.spells?.length > 0 && <><h3>Innate spells</h3><ul>{lineage.spells.map(spell => <li key={spell.grantKey}>
      {ruleLabel(spell.spellId, rules)}{spell.unlocked ? ' (available)' : ' (level ' + spell.unlockLevel + ')'}
    </li>)}</ul></>}
    {forms?.knownForms?.length > 0 && <>
      <h3>Known animal forms</h3>
      <ul>{forms.knownForms.map(formId => {
        const form = rules.creation.beastshifterForms?.find(entry => entry.id === formId);
        const health = savedForms?.healthByForm?.[formId];
        const maximum = forms.maximumHealth?.[formId];
        return <li key={formId}>
          {form?.name ?? formId}
          {savedForms?.activeFormId === formId && ' (active)'}
          {health != null && maximum != null && ` · Health ${health}/${maximum}`}
        </li>;
      })}</ul>
    </>}
  </section>;
}
