import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { request } from "../../lib/api";
import "./Rules2024.css";

import {
  CallingProgression,
  RulesSummary,
  RequiredChoice,
} from "./Rules2024Views";
import { attributeNames } from "./labels";
export default function Rules2024Page() {
  const { token } = useAuth();
  const [rules, setRules] = useState(null),
    [error, setError] = useState(""),
    [callingId, setCallingId] = useState("corsair"),
    [nextCalling, setNextCalling] = useState("corsair"),
    [ledger, setLedger] = useState(null),
    [summary, setSummary] = useState(null),
    [busy, setBusy] = useState(false);
  const [scores, setScores] = useState({
    might: 13,
    agility: 13,
    resolve: 13,
    wit: 13,
    instinct: 13,
    spirit: 13,
  });
  useEffect(() => {
    let cancelled = false;
    request("/archipelago/system/character-rules?version=SA-CHAR-1", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((result) => {
        if (!cancelled) setRules(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);
  async function preview(next) {
    setBusy(true);
    setError("");
    try {
      const result = await request("/archipelago/system/rules-2024/preview", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ledger: next }),
      });
      setSummary(result);
      setLedger(next);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const calling = rules?.callings.find((c) => c.id === callingId);
  return (
    <main className="page-shell rules-2024">
      <h1>Calling and Path rules preview</h1>
      <p>
        Explore temporary builds using SRD 5.2.1. Use the character creator for origin, background, point buy and saved characters.
      </p>
      <Link to="/characters/new">Create a character</Link>
      {error ? <p role="alert">{error}</p> : null}
      {!rules ? (
        <p>Loading rules…</p>
      ) : (
        <>
          <label>
            Calling{" "}
            <select
              value={callingId}
              onChange={(e) => {
                setCallingId(e.target.value);
                setNextCalling(e.target.value);
                setLedger(null); setSummary(null);
              }}
            >
              {rules.callings.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <CallingProgression calling={calling} rules={rules} />
          <h2>Temporary build</h2>
          <p>
            Enter final test scores, including any GM-approved background
            adjustments. This preview does not enforce creation point buy.
          </p>
          <fieldset disabled={busy}>
            {Object.entries(attributeNames).map(([id, name]) => (
              <label key={id}>
                {name}
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={scores[id]}
                  onChange={(e) => {
                    setScores({ ...scores, [id]: Number(e.target.value) });
                    setLedger(null); setSummary(null);
                  }}
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() =>
                preview({
                  version: 3,
                  ruleset: "srd-5.2.1",
                  revision: 0,
                  baseAttributes: scores,
                  levels: [{ callingId, choices: {} }],
                })
              }
            >
              Start new temporary build
            </button>
          </fieldset>
          {summary && (
            <>
              <RulesSummary summary={summary} rules={rules} />
              <fieldset disabled={busy}>
                {summary.requiredChoices[0] && (
                  <RequiredChoice
                    key={summary.requiredChoices[0].id}
                    choice={summary.requiredChoices[0]}
                    rules={rules}
                    onChange={(changes) => {
                      const next = structuredClone(ledger);
                      Object.assign(next.levels.at(-1).choices, changes);
                      preview(next);
                    }}
                  />
                )}
                <label>
                  Next Calling level
                  <select
                    value={nextCalling}
                    onChange={(e) => setNextCalling(e.target.value)}
                  >
                    {rules.callings.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={
                    !summary.decisionsComplete || summary.totalLevel >= maximumCharacterLevel
                  }
                  onClick={() =>
                    preview({
                      ...ledger,
                      revision: ledger.revision + 1,
                      levels: [
                        ...ledger.levels,
                        { callingId: nextCalling, choices: {} },
                      ],
                    })
                  }
                >
                  Add Calling level
                </button>
              </fieldset>
            </>
          )}
        </>
      )}
    </main>
  );
}
import {maximumCharacterLevel} from '@crossworld/sanguine-engine/progression';
