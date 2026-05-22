function titleCase(value = '') {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getCheckGroups(blueprint) {
  return Object.entries(blueprint?.checks ?? {}).map(([categoryKey, checks]) => ({
    key: categoryKey,
    label: titleCase(categoryKey),
    description: blueprint?.display?.checkCategories?.[categoryKey]?.description ?? '',
    checks: checks.map((check) => ({
      ...check,
      category: categoryKey,
      formulaLabel: check.formulaLabel ?? (check.attributes ?? []).map(titleCase).join(' + '),
    })),
  }))
}

export function getCheckList(blueprint) {
  return getCheckGroups(blueprint).flatMap((group) => group.checks)
}

export function calculateChecks(attributes = {}, blueprint) {
  return getCheckList(blueprint).reduce((scores, check) => {
    scores[check.key] =
      10 + (check.attributes ?? []).reduce((total, attributeKey) => total + (attributes[attributeKey] ?? 0), 0)
    return scores
  }, {})
}

export function resolveCharacterChecks(character = {}, blueprint) {
  const generatedChecks = calculateChecks(character.attributes ?? {}, blueprint)

  return {
    ...generatedChecks,
    ...(character.pairingStats ?? {}),
    ...(character.socialStats ?? {}),
    ...(character.derivedStats ?? {}),
    ...(character.checks ?? {}),
  }
}

export function getLegacyDerivedStats(checks = {}) {
  return {
    vitality: checks.vitality ?? 10,
    guard: checks.guard ?? 10,
    initiative: checks.initiative ?? 10,
    focus: checks.focus ?? 10,
  }
}

export function getLegacySocialStats(checks = {}) {
  return {
    grace: checks.grace ?? 10,
    guile: checks.guile ?? 10,
    pressure: checks.pressure ?? 10,
  }
}
