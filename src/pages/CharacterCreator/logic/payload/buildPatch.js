const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function changedFields(current, baseline) {
  return Object.fromEntries(
    Object.entries(current).flatMap(([key, value]) => {
      if (equal(value, baseline?.[key])) return [];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const nested = changedFields(value, baseline?.[key]);
        return Object.keys(nested).length ? [[key, nested]] : [];
      }
      return [[key, value]];
    })
  );
}

function preserveEntries(next, previous, before, fields, identityKey = "name") {
  const used = new Set();
  return next.map((entry, index) => {
    let match = before.findIndex(
      (saved, savedIndex) =>
        !used.has(savedIndex) && saved[identityKey] === entry[identityKey]
    );
    if (match < 0 && next.length === before.length && !used.has(index))
      match = index;
    if (match < 0) return entry;
    used.add(match);
    const original = previous[match] ?? {};
    const changes = Object.fromEntries(
      fields
        .filter((field) => !equal(entry[field], before[match]?.[field]))
        .map((field) => [field, entry[field]])
    );
    return { ...original, ...changes };
  });
}

export function buildCharacterPatch(current, baseline, existing) {
  const patch = changedFields(current, baseline);
  for (const field of [
    "checks",
    "derivedStats",
    "socialStats",
    "reputation",
    "portraitUrl",
    "campaignId",
    "status",
  ]) {
    delete patch[field];
  }
  if (patch.resources) {
    for (const [track, values] of Object.entries(patch.resources)) {
      delete values.max;
      if (!Object.keys(values).length) delete patch.resources[track];
    }
    if (!Object.keys(patch.resources).length) delete patch.resources;
  }
  if (patch.abilities) {
    const saved = (existing.abilities ?? []).filter(
      (ability) => ability.source !== "calling"
    );
    patch.abilities = [
      ...(existing.abilities ?? []).filter(
        (ability) => ability.source === "calling"
      ),
      ...preserveEntries(
        current.abilities.filter((ability) => ability.source !== "calling"),
        saved,
        baseline.abilities.filter((ability) => ability.source !== "calling"),
        ["name", "type", "source", "cost", "scaling", "tags", "effect"]
      ),
    ];
  }
  if (patch.identity?.tags) {
    patch.identity.tags = preserveEntries(
      current.identity.tags,
      existing.identity?.tags ?? [],
      baseline.identity.tags,
      ["label", "mechanicalImpact"],
      "label"
    ).map((entry, index) =>
      /^(origin|calling|path)-/.test(current.identity.tags[index].key)
        ? { ...entry, ...current.identity.tags[index] }
        : entry
    );
  }
  return patch;
}
