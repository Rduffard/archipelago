import { getRemainingPoints } from "../../../../lib/creatorAttributes.js";
import { PATH_ORIGIN_MAP } from "../config/creatorConfig";
import { clampTrackValue, createEmptyWound } from "../state/creatorState";

export function createMutations({
  resourceMaximums,
  setAttributeValues,
  setDetails,
  setIdentity,
  setLoadout,
  setProgressionValues,
  setResourceValues,
  setSaveMessage,
  setWounds,
}) {
  function clearSaveMessage() {
    setSaveMessage("");
  }

  function handleIdentityChange(field, value) {
    clearSaveMessage();

    setIdentity((current) => {
      if (field === "path") {
        return {
          ...current,
          path: value,
          originId: value === "archipelago" ? "" : PATH_ORIGIN_MAP[value] ?? "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function handleAttributeChange(key, nextValue) {
    clearSaveMessage();

    setAttributeValues((current) => {
      const clampedValue = Math.max(8, Math.min(15, nextValue));
      const draft = { ...current, [key]: clampedValue };

      if (getRemainingPoints(draft) < 0) {
        return current;
      }

      return draft;
    });
  }

  function handleDetailsChange(field, value) {
    clearSaveMessage();
    setDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleLoadoutChange(field, value) {
    clearSaveMessage();
    setLoadout((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleResourceChange(key, nextValue) {
    clearSaveMessage();
    setResourceValues((current) => ({
      ...current,
      [key]: clampTrackValue(
        nextValue,
        resourceMaximums[key] ?? Number.MAX_SAFE_INTEGER
      ),
    }));
  }

  function handleProgressionChange(field, value) {
    if (field !== "rank") return;
    clearSaveMessage();
    setProgressionValues((current) => ({
      ...current,
      rank: Math.max(1, Math.min(20, Number(value) || 1)),
    }));
  }

  function handleWoundChange(index, field, value) {
    clearSaveMessage();
    setWounds((current) =>
      current.map((wound, woundIndex) =>
        woundIndex === index
          ? {
              ...wound,
              [field]: value,
            }
          : wound
      )
    );
  }

  function handleAddWound() {
    clearSaveMessage();
    setWounds((current) => [...current, createEmptyWound()]);
  }

  function handleRemoveWound(index) {
    clearSaveMessage();
    setWounds((current) =>
      current.filter((_, woundIndex) => woundIndex !== index)
    );
  }

  return {
    clearSaveMessage,
    handleAddWound,
    handleAttributeChange,
    handleDetailsChange,
    handleIdentityChange,
    handleLoadoutChange,
    handleProgressionChange,
    handleRemoveWound,
    handleResourceChange,
    handleWoundChange,
  };
}
