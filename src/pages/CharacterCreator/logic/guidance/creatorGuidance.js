const ATTRIBUTE_POINTS = 27

export function getCreatorValidations({
  identity,
  isIdentityComplete,
  progressionValues,
  remainingPoints,
  isEditing = false,
  attributesUnchanged = false,
  validTraining = false,
}) {
  const validAttributes = (isEditing && attributesUnchanged) || remainingPoints >= 0
  return {
    identity: isIdentityComplete,
    calling: Boolean(identity.callingId),
    attributes: validAttributes,
    skills: validTraining,
    loadout: true,
    details: true,
    progression: Number.isInteger(progressionValues.rank) && progressionValues.rank >= 1 && progressionValues.rank <= 20,
    review:
      isIdentityComplete &&
      Boolean(identity.callingId) &&
      Boolean(identity.originId) &&
      validAttributes &&
      (validTraining) &&
      Number.isInteger(progressionValues.rank) && progressionValues.rank >= 1 && progressionValues.rank <= 20,
  }
}

export function getCreatorActionHint({
  currentStepId,
  hasValidName,
  identity,
  remainingPoints,
  trimmedName,
  validations,
}) {
  if (currentStepId === 'identity' && !validations.identity) {
    if (!trimmedName) {
      return 'Give the character a name before moving on.'
    }

    if (!hasValidName) {
      return 'Character names need at least 2 characters.'
    }

    if (!identity.path) {
      return 'Pick Yuma, Lilin, or the Archipelago to continue.'
    }

    return 'Choose one of the island origins to continue.'
  }

  if (currentStepId === 'calling' && !validations.calling) {
    return 'Choose a calling before moving on.'
  }

  if (currentStepId === 'attributes' && !validations.attributes) {
    return `Keep the allocation within the ${ATTRIBUTE_POINTS}-point budget (${remainingPoints} remaining).`
  }

  if (currentStepId === 'skills' && !validations.skills) return 'Choose exactly four distinct Training proficiencies to continue.'

  if (currentStepId === 'loadout') {
    return 'Add any optional gear, relics, inventory, or custom abilities before review.'
  }

  if (currentStepId === 'details') {
    return 'Add any optional history, trait notes, or starting track changes before review.'
  }

  if (currentStepId === 'progression') {
    return 'Inspect the Paths and their recorded benefits before review.'
  }

  if (currentStepId === 'review' && !validations.review) {
    return `Stay within the ${ATTRIBUTE_POINTS}-point budget and finish the earlier choices to save.`
  }

  return 'You can jump between unlocked steps from the rail above.'
}

export function getOriginSummaryValue(selectedOrigin, path) {
  return (
    selectedOrigin?.name ||
    (path === 'archipelago' ? 'Select island' : path ? 'Path-aligned homeland' : 'Not chosen')
  )
}
