import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { request, updateCharacter } from "../../lib/api";
import { useSystem } from "../../hooks/useSystem";
export function EquipmentView({ data }) {
  return (
    <>
      <p>
        Guard {data.guard} · Weapon Training:{" "}
        {[...data.training.categories, ...data.training.weapons].join(", ") ||
          "None"}{" "}
        · Armor Training: {data.training.armor.join(", ") || "None"}
      </p>
      {data.restrictions.untrainedArmor ? (
        <p>
          Untrained armor: disadvantage on Might/Agility D20 tests; spellcasting
          blocked.
        </p>
      ) : null}
      {data.restrictions.stealthDisadvantage ? (
        <p>Armor imposes Stealth disadvantage.</p>
      ) : null}
      {data.restrictions.speedPenaltyFeet ? (
        <p>
          Armor Might requirement unmet: pending movement penalty{" "}
          {data.restrictions.speedPenaltyFeet} feet.
        </p>
      ) : null}
      <p>
        Armor: {data.slots.armor?.definition.name ?? "Unarmored"} · Main hand:{" "}
        {data.slots.mainHand?.definition.name ?? "Empty"} · Off hand:{" "}
        {data.slots.offHand?.definition.name ?? "Empty"}
      </p>
      {data.restrictions.untrainedShield ? (
        <p>Untrained shield: no Guard bonus.</p>
      ) : null}
      <p>
        Only standard melee attacks are automated. Light extra attacks, mastery,
        ranged attacks, ammunition and thrown attacks are unavailable.
      </p>
      <p>
        Armor and shield changes occur outside combat; donning/doffing timing is
        not automated.
      </p>
      <ul>
        {data.attacks.map((a) => (
          <li key={a.id}>
            {a.name} · {a.trained ? "Trained" : "Untrained"} · attack{" "}
            {a.attackModifier >= 0 ? "+" : ""}
            {a.attackModifier} ·{" "}
            {a.weapon.damage.count
              ? a.weapon.damage.count + "d" + a.weapon.damage.sides
              : a.weapon.damage.fixed}{" "}
            {a.weapon.damage.type}
            {a.supported
              ? ""
              : " · Automated attack unavailable: " + a.unsupportedReason}
          </li>
        ))}
      </ul>
      <ul>
        {data.inventory.map((i) => (
          <li key={i.instanceId}>
            {i.customName || i.definitionId} × {i.quantity} ·{" "}
            {Object.values(data.loadout).includes(i.instanceId)
              ? "Equipped"
              : "Carried"}
            {i.notes ? " · " + i.notes : ""}
          </li>
        ))}
      </ul>
    </>
  );
}
export default function EquipmentPanel({ characterId, editable = false }) {
  const { token } = useAuth();
  const { blueprint } = useSystem();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [definitionId, setDefinitionId] = useState("cutlass");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    let active = true;
    request("/archipelago/characters/" + characterId + "/equipment", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((value) => {
        if (active) setData(value);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [characterId, token]);
  async function change(operation) {
    setBusy(true);
    setError("");
    try {
      await updateCharacter(token, characterId, {
        equipmentOperation: {
          expectedRevision: data.documentRevision,
          ...operation,
        },
      });
      setData(
        await request("/archipelago/characters/" + characterId + "/equipment", {
          headers: { Authorization: "Bearer " + token },
        })
      );
    } catch (err) {
      setError(err.message);
      try {
        setData(
          await request(
            "/archipelago/characters/" + characterId + "/equipment",
            { headers: { Authorization: "Bearer " + token } }
          )
        );
      } catch {
        /* Keep existing state. */
      }
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return (
      <p role={error ? "alert" : "status"}>{error || "Loading equipment…"}</p>
    );
  return (
    <section aria-label="Equipment">
      <h3>Equipment and inventory</h3>
      <EquipmentView data={data} />
      {error ? <p role="alert">{error}</p> : null}
      {editable ? (
        <fieldset disabled={busy}>
          <p>
            Development inventory editor: additions are server-issued. Equipment
            changes save immediately, separately from other character edits.
          </p>
          <label>
            Item{" "}
            <select
              value={definitionId}
              onChange={(e) => setDefinitionId(e.target.value)}
            >
              {(blueprint?.equipment?.items ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              <option value="">Descriptive item (no mechanics)</option>
            </select>
          </label>
          <label>
            Custom display name{" "}
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Notes{" "}
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          {!definitionId ? (
            <label>
              Quantity{" "}
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
          ) : null}
          <button
            type="button"
            onClick={() =>
              change({
                add: [
                  definitionId
                    ? { definitionId, customName: name, notes }
                    : { customName: name, notes, quantity },
                ],
              })
            }
          >
            Add owned item
          </button>
          {["mainHand", "offHand", "armor"].map((slot) => (
            <label key={slot}>
              {
                { mainHand: "Main hand", offHand: "Off hand", armor: "Armor" }[
                  slot
                ]
              }
              <select
                value={data.loadout[slot] ?? ""}
                onChange={(e) =>
                  change({
                    loadout: {
                      ...data.loadout,
                      [slot]: e.target.value || null,
                    },
                  })
                }
              >
                <option value="">Empty</option>
                {data.inventory
                  .filter((i) => {
                    const d = blueprint?.equipment?.items.find(
                      (d) => d.id === i.definitionId
                    );
                    return slot === "armor"
                      ? d?.kind === "armor"
                      : ["weapon", "shield"].includes(d?.kind);
                  })
                  .map((i) => (
                    <option key={i.instanceId} value={i.instanceId}>
                      {i.customName ||
                        blueprint.equipment.items.find(
                          (d) => d.id === i.definitionId
                        )?.name}
                    </option>
                  ))}
              </select>
            </label>
          ))}
          <label>
            Grip{" "}
            <select
              value={data.loadout.grip}
              onChange={(e) =>
                change({ loadout: { ...data.loadout, grip: e.target.value } })
              }
            >
              <option value="one">
                One-handed / automatic two-handed requirement
              </option>
              <option value="two">Two-handed versatile grip</option>
            </select>
          </label>
          {data.inventory.map((i) => (
            <div key={i.instanceId}>
              <label>
                Display name{" "}
                <input
                  key={i.instanceId + "name" + data.documentRevision}
                  defaultValue={i.customName}
                  onBlur={(e) => {
                    if (e.target.value !== i.customName)
                      change({
                        edit: [
                          {
                            instanceId: i.instanceId,
                            customName: e.target.value,
                          },
                        ],
                      });
                  }}
                />
              </label>
              <label>
                Notes{" "}
                <input
                  key={i.instanceId + "notes" + data.documentRevision}
                  defaultValue={i.notes}
                  onBlur={(e) => {
                    if (e.target.value !== i.notes)
                      change({
                        edit: [
                          { instanceId: i.instanceId, notes: e.target.value },
                        ],
                      });
                  }}
                />
              </label>
              {!i.definitionId ? (
                <label>
                  Quantity{" "}
                  <input
                    type="number"
                    min="1"
                    step="1"
                    key={i.instanceId + "quantity" + data.documentRevision}
                    defaultValue={i.quantity}
                    onBlur={(e) => {
                      if (Number(e.target.value) !== i.quantity)
                        change({
                          edit: [
                            {
                              instanceId: i.instanceId,
                              quantity: Number(e.target.value),
                            },
                          ],
                        });
                    }}
                  />
                </label>
              ) : null}
            </div>
          ))}
          {data.inventory.map((i) => (
            <button
              type="button"
              key={i.instanceId}
              disabled={Object.values(data.loadout).includes(i.instanceId)}
              onClick={() => change({ remove: [i.instanceId] })}
            >
              Remove {i.customName || i.definitionId}
            </button>
          ))}
        </fieldset>
      ) : null}
    </section>
  );
}
