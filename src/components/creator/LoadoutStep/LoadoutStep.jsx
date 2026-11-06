import { useEffect, useState } from "react";
import { useSystem } from "../../../hooks/useSystem";
import { useAuth } from "../../../hooks/useAuth";
import { request } from "../../../lib/api";
import { EquipmentView } from "../../equipment/EquipmentPanel";
export default function LoadoutStep({
  characterId,
  callingId,
  origin,
  attributes,
  training,
  loadout,
  onLoadoutChange,
}) {
  const { blueprint } = useSystem();
  const { token } = useAuth();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const p = blueprint.startingEquipment?.[callingId];
  const selection = loadout.startingEquipment ?? {
    packageId: callingId,
    version: 1,
    choices: {},
  };
  const body = JSON.stringify({
    calling: callingId,
    origin,
    attributes,
    training,
    abilitySelections: loadout.abilitySelections ?? {},
    startingEquipment: selection,
  });
  useEffect(() => {
    let current = true;
    if (characterId) return;
    request("/archipelago/system/draft-preview", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body,
    })
      .then((value) => {
        if (current) {
          setPreview(value);
          setError("");
        }
      })
      .catch((err) => {
        if (current) {
          setPreview(null);
          setError(err.message);
        }
      });
    return () => {
      current = false;
    };
  }, [body, token, characterId]);
  if (characterId)
    return (
      <p>
        Starting equipment is not reissued during editing. Manage saved
        inventory on the character sheet.
      </p>
    );
  if (!p) return <p>Choose a Calling.</p>;
  function change(next) {
    onLoadoutChange("startingEquipment", next);
  }
  return (
    <section className="choice-group">
      <h2>Starting equipment</h2>
      <p>
        Owned and equipped are separate. Training comes from Calling. No
        purchasing system is active.
      </p>
      {Object.entries(p.choices).map(([key, options]) => (
        <label key={key}>
          {key}
          <select
            value={selection.choices[key] ?? ""}
            onChange={(e) =>
              change({
                ...selection,
                choices: { ...selection.choices, [key]: e.target.value },
                equipped: undefined,
              })
            }
          >
            <option value="">Choose…</option>
            {Object.entries(options).map(([id, grants]) => (
              <option key={id} value={id}>
                {Object.values(grants)
                  .map(
                    (d) =>
                      blueprint.equipment.items.find((i) => i.id === d)?.name ??
                      d
                  )
                  .join(" + ")}
              </option>
            ))}
          </select>
        </label>
      ))}
      {error ? (
        <>
          <p role="status">Preview: {error}</p>
          <button
            type="button"
            onClick={() => change({ ...selection, equipped: undefined })}
          >
            Reset equipped slots to package defaults
          </button>
        </>
      ) : null}
      {preview ? (
        <>
          <EquipmentView data={preview.equipment} />
          {["mainHand", "offHand", "armor"].map((slot) => (
            <label key={slot}>
              {slot}
              <select
                value={
                  selection.equipped?.[slot] ??
                  preview.equipment.loadout[slot]?.replace("preview:", "") ??
                  ""
                }
                onChange={(e) => {
                  const current = Object.fromEntries(
                    ["mainHand", "offHand", "armor"].map((k) => [
                      k,
                      preview.equipment.loadout[k]?.replace("preview:", "") ??
                        null,
                    ])
                  );
                  change({
                    ...selection,
                    equipped: {
                      ...current,
                      grip: preview.equipment.loadout.grip,
                      ...selection.equipped,
                      [slot]: e.target.value || null,
                    },
                  });
                }}
              >
                <option value="">Empty</option>
                {preview.equipment.inventory.map((i) => (
                  <option
                    key={i.instanceId}
                    value={i.instanceId.replace("preview:", "")}
                  >
                    {
                      blueprint.equipment.items.find(
                        (d) => d.id === i.definitionId
                      )?.name
                    }
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Grip
            <select
              value={selection.equipped?.grip ?? preview.equipment.loadout.grip}
              onChange={(e) => {
                const current = Object.fromEntries(
                  ["mainHand", "offHand", "armor"].map((k) => [
                    k,
                    preview.equipment.loadout[k]?.replace("preview:", "") ??
                      null,
                  ])
                );
                change({
                  ...selection,
                  equipped: {
                    ...current,
                    ...selection.equipped,
                    grip: e.target.value,
                  },
                });
              }}
            >
              <option value="one">One / required two-handed</option>
              <option value="two">Two-handed versatile</option>
            </select>
          </label>
        </>
      ) : null}
    </section>
  );
}
