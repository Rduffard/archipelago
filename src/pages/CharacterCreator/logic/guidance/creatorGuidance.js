import { ATTRIBUTE_POINTS } from '../../../../data/archipelagoSystemBlueprint'

export function getCreatorValidations({
  identity,
  isIdentityComplete,
  progressionValues,
  remainingPoints,
  remainingSkillPoints,
}) {
  return {
    identity: isIdentityComplete,
    calling: Boolean(identity.callingId),
    attributes: remainingPoints === 0,
    skills: remainingSkillPoints === 0,
    loadout: true,
    details: true,
    progression: progressionValues.rank >= 1,
    review:
      isIdentityComplete &&
      Boolean(identity.callingId) &&
      Boolean(identity.originId) &&
      remainingPoints === 0 &&
      remainingSkillPoints === 0 &&
      progressionValues.rank >= 1,
  }
}

export function getCreatorActionHint({
  currentStepId,
  hasValidName,
  identity,
  remainingPoints,
  remainingSkillPoints,
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
    return `Spend the remaining ${remainingPoints} point${remainingPoints === 1 ? '' : 's'} to continue.`
  }

  if (currentStepId === 'skills' && !validations.skills) {
    return `Spend the remaining ${remainingSkillPoints} skill point${remainingSkillPoints === 1 ? '' : 's'} to continue.`
  }

  if (currentStepId === 'loadout') {
    return 'Add any optional gear, relics, inventory, or custom abilities before review.'
  }

  if (currentStepId === 'details') {
    return 'Add any optional history, trait notes, or starting track changes before review.'
  }

  if (currentStepId === 'progression') {
    return 'Set the current rank and any advancement state before review.'
  }

  if (currentStepId === 'review' && !validations.review) {
    return `Spend all ${ATTRIBUTE_POINTS} points and finish the earlier choices to save.`
  }

  return 'You can jump between unlocked steps from the rail above.'
}

export function getOriginSummaryValue(selectedOrigin, path) {
  return (
    selectedOrigin?.name ||
    (path === 'archipelago' ? 'Select island' : path ? 'Path-aligned homeland' : 'Not chosen')
  )
}
