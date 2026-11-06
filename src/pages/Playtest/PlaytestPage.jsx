import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSystem } from "../../hooks/useSystem";
import { request, getCharacters } from "../../lib/api";
import ProgressionView from "../../components/progression/ProgressionView";
import { EquipmentView } from "../../components/equipment/EquipmentPanel";
export default function PlaytestPage() {
  const { token } = useAuth();
  const { blueprint } = useSystem();
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [id, setId] = useState("");
  const [level, setLevel] = useState(1);
  const [decisions, setDecisions] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const body = JSON.stringify({
    level,
    decisions: decisions.filter((d) => d.level <= level),
  });
  useEffect(() => {
    let active = true;
    Promise.all([
      request("/archipelago/system/capabilities", {
        headers: { Authorization: "Bearer " + token },
      }),
      getCharacters(token),
    ])
      .then(([caps, chars]) => {
        if (active) {
          setEnabled(caps.playtestEnabled);
          setCharacters(chars);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [token]);
  useEffect(() => {
    let active = true;
    if (!id || !enabled) return;
    request("/archipelago/characters/" + id + "/playtest-preview", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body,
    })
      .then((p) => {
        if (active) {
          setPreview(p);
          setError("");
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setPreview(null);
        }
      });
    return () => {
      active = false;
    };
  }, [id, enabled, token, body]);
  function spend(s) {
    const acquiredLevel = preview.progression.rewards.find(
      (r) => r.id === s.rewardId
    ).level;
    setDecisions((old) => {
      const next = structuredClone(old);
      let group = next.find((d) => d.level === acquiredLevel);
      if (!group) {
        group = { level: acquiredLevel, spends: [] };
        next.push(group);
      }
      group.spends.push(s);
      return next;
    });
  }
  async function encounter() {
    setBusy(true);
    try {
      const result = await request(
        "/archipelago/characters/" + id + "/playtest-encounter",
        { method: "POST", headers: { Authorization: "Bearer " + token }, body }
      );
      navigate("/combat-test/" + result._id);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page-shell">
      <h1>Development playtest</h1>
      <p>
        Temporary build only. Saved characters, inventory, resources and
        existing encounters are unchanged.
      </p>
      {!enabled ? (
        <p>
          Disabled. Requires a non-production server and explicit
          ARCHIPELAGO_PLAYTEST_ENABLED=true configuration.
        </p>
      ) : (
        <>
          <label>
            Character
            <select
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setDecisions([]);
              }}
            >
              <option value="">Choose…</option>
              {characters.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Target level
            <select
              value={level}
              onChange={(e) => {
                setLevel(Number(e.target.value));
                setPreview(null);
              }}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <button
            onClick={() => {
              setDecisions([]);
              setPreview(null);
            }}
          >
            Discard decisions
          </button>
        </>
      )}
      {error ? <p role="alert">{error}</p> : null}
      {preview ? (
        <>
          <ProgressionView
            summary={preview.progression}
            catalog={blueprint.abilityCatalog}
            training={preview.character.training}
            onSpend={spend}
            busy={busy}
          />
          <EquipmentView data={preview.equipment} />
          <button disabled={busy || !preview.complete} onClick={encounter}>
            Start temporary encounter
          </button>
        </>
      ) : null}
    </main>
  );
}
