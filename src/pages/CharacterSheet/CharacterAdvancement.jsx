import { useState } from "react";
import { useSystem } from "../../hooks/useSystem";
import Legacy from "./CharacterAdvancementLegacy";
import ProgressionView from "../../components/progression/ProgressionView";
export default function CharacterAdvancement({ character, rules, onAdvance }) {
  const { blueprint } = useSystem();
  const [level, setLevel] = useState(character.progression.rank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (character.advancement?.version !== 2)
    return (
      <Legacy
        character={character}
        rules={rules?.legacy ?? rules}
        onAdvance={onAdvance}
      />
    );
  const summary = character.progressionDerived;
  async function change(values) {
    setBusy(true);
    setError("");
    try {
      await onAdvance({
        advancementOperation: {
          expectedRevision: character.advancement.revision,
          ...values,
        },
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>Calling progression</h2>
      {error ? <p role="alert">{error}</p> : null}
      <label>
        Level
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1)
            .filter((n) => n >= character.progression.rank)
            .map((n) => (
              <option key={n}>{n}</option>
            ))}
        </select>
      </label>
      <button disabled={busy} onClick={() => change({ level })}>
        Record level
      </button>
      {summary ? (
        <ProgressionView
          summary={summary}
          catalog={blueprint.abilityCatalog}
          training={character.training}
          busy={busy}
          onSpend={(spend) => change({ spends: [spend] })}
        />
      ) : (
        <p>Reload to resolve progression.</p>
      )}
    </section>
  );
}
