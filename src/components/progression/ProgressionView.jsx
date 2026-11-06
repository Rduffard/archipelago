import { useState } from "react";
import {
  ProgressionTable,
  SelectionGroup,
} from "../creator/AbilitiesStep/AbilitiesStep";
export function RewardControl({ reward, items, training, onSpend, busy }) {
  const [selected, setSelected] = useState([]);
  const [first, setFirst] = useState("might");
  const [second, setSecond] = useState("");
  if (reward.kind === "path" || reward.kind === "calling")
    return <p>{reward.id} · unspent; reviewed content unavailable</p>;
  if (reward.kind === "attribute")
    return (
      <fieldset disabled={busy}>
        <legend>
          {reward.id} · Attribute improvement (other feats pending)
        </legend>
        <select value={first} onChange={(e) => setFirst(e.target.value)}>
          {["might", "agility", "wit", "spirit", "resolve", "instinct"].map(
            (k) => (
              <option key={k}>{k}</option>
            )
          )}
        </select>
        <select value={second} onChange={(e) => setSecond(e.target.value)}>
          <option value="">+2 to first</option>
          {["might", "agility", "wit", "spirit", "resolve", "instinct"]
            .filter((k) => k !== first)
            .map((k) => (
              <option key={k}>{k}</option>
            ))}
        </select>
        <button
          disabled={first === second}
          onClick={() =>
            onSpend({
              rewardId: reward.id,
              kind: "attribute",
              increases: second ? { [first]: 1, [second]: 1 } : { [first]: 2 },
            })
          }
        >
          Apply attribute improvement
        </button>
      </fieldset>
    );
  return (
    <div>
      <SelectionGroup
        group={reward}
        selected={selected}
        training={training}
        items={items}
        onChange={setSelected}
      />
      <button
        disabled={busy || selected.length !== reward.count}
        onClick={() =>
          onSpend({
            rewardId: reward.id,
            kind: "selection",
            abilityIds: selected,
          })
        }
      >
        Confirm selection
      </button>
    </div>
  );
}
export function FeatureList({ abilities }) {
  return (
    <section>
      {["passive", "action", "bonus-action", "reaction", "special"].map((t) => (
        <details key={t} open={t === "passive"}>
          <summary>{t}</summary>
          {abilities
            .filter((a) => a.timing === t)
            .map((a) => (
              <article key={a.id}>
                <h4>
                  {a.name} · acquired · {a.implementationStatus}
                </h4>
                <p>{a.description}</p>
                <small>
                  {a.source.type}: {a.source.id}; level {a.minimumLevel}.{" "}
                  {a.executableInCombat
                    ? "Mechanic integrated; activation depends on encounter legality"
                    : "Not an executable combat action"}
                  . {a.missingDependencies.join(", ")}
                </small>
              </article>
            ))}
        </details>
      ))}
    </section>
  );
}
export default function ProgressionView({
  summary,
  catalog,
  training,
  onSpend,
  busy,
}) {
  return (
    <>
      <FeatureList abilities={summary.abilities} />
      <p>
        {summary.complete
          ? "Required supported choices complete"
          : "Required choices remain"}
        . Reference-only features are not combat-ready.
      </p>
      {summary.unspent.map((r) => (
        <RewardControl
          key={r.id}
          reward={r}
          items={catalog.items}
          training={training}
          onSpend={onSpend}
          busy={busy}
        />
      ))}
      <ProgressionTable
        rows={summary.progression}
        items={catalog.items}
        level={summary.level}
      />
      {summary.limitations.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </>
  );
}
