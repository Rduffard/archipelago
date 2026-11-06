import PathPreview from "../../../pages/CharacterCreator/sections/progression/ProgressionSection";
import { useSystem } from "../../../hooks/useSystem";
export function ProgressionTable({ rows, items, level = 1 }) {
  return (
    <details>
      <summary>Levels 1–20 progression</summary>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Training Bonus</th>
            <th>Features and decisions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.level}>
              <td>
                {row.level}
                {row.level > level ? " · locked" : ""}
              </td>
              <td>+{row.trainingBonus}</td>
              <td>
                {row.automatic
                  .map((id) => items.find((a) => a.id === id)?.name)
                  .join(", ")}
                {row.selections.map((g) => (
                  <span key={g.id}>
                    {" "}
                    ·{" "}
                    {g.kind === "attribute"
                      ? "Attribute improvement / reviewed feat"
                      : g.id + " — choose " + g.count}
                  </span>
                ))}
                {row.pathOpportunity ? " · Optional Path opportunity" : ""}
                {row.references.length
                  ? " · Source subclass/scaling reference"
                  : ""}{" "}
                · {row.attacksPerAction} attack(s)/Action
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
export function SelectionGroup({
  group,
  items,
  selected = [],
  training = [],
  onChange,
}) {
  return (
    <fieldset>
      <legend>
        {group.id} · choose {group.count}
      </legend>
      {group.options.map((id) => {
        const a = items.find((a) => a.id === id);
        const unavailable =
          a?.prerequisites.trainedSkill &&
          !training.includes(a.prerequisites.trainedSkill);
        return (
          <label key={id}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              disabled={
                unavailable ||
                (!selected.includes(id) && selected.length >= group.count)
              }
              onChange={() =>
                onChange(
                  selected.includes(id)
                    ? selected.filter((x) => x !== id)
                    : [...selected, id]
                )
              }
            />
            {a?.name} · {a?.implementationStatus}
            {unavailable ? " · requires trained skill" : ""}
          </label>
        );
      })}
    </fieldset>
  );
}
export default function AbilitiesStep({
  callingId,
  training,
  loadout,
  onLoadoutChange,
}) {
  const { blueprint } = useSystem();
  const cat = blueprint.abilityCatalog;
  const rows = cat?.tables[callingId] ?? [];
  if (!rows.length) return <p>Choose a Calling to inspect abilities.</p>;
  const first = rows[0];
  return (
    <section className="choice-group">
      <h2>Abilities</h2>
      <h3>Automatic level-one features</h3>
      {first.automatic.map((id) => {
        const a = cat.items.find((a) => a.id === id);
        return (
          <article key={id}>
            <h4>
              {a.name} · {a.timing} · {a.implementationStatus}
            </h4>
            <p>{a.description}</p>
            <p>{a.missingDependencies.join(", ")}</p>
          </article>
        );
      })}
      {first.selections
        .filter((g) => g.kind === "selection")
        .map((g) => (
          <SelectionGroup
            key={g.id}
            group={g}
            items={cat.items}
            training={training}
            selected={loadout.abilitySelections?.[g.id] ?? []}
            onChange={(value) =>
              onLoadoutChange("abilitySelections", {
                ...loadout.abilitySelections,
                [g.id]: value,
              })
            }
          />
        ))}
      <ProgressionTable rows={rows} items={cat.items} />
      <details>
        <summary>
          Discover universal Specialization Paths · level 3 onward
        </summary>
        <p>
          Invest across multiple Paths; tiers are sequential at levels 3, 6, 11
          and 16. Historical nodes below are reference material; reviewed
          four-tier abilities are unavailable. Opportunities may remain unspent.
        </p>
        <PathPreview specializations={blueprint.catalogs.specializations} />
      </details>
    </section>
  );
}
