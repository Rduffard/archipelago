import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
} from '../../../data/archipelagoSystemSelectors'

export function getOrderedPaths(originPaths = []) {
  return [
    originPaths.find((path) => path.id === 'yuma'),
    originPaths.find((path) => path.id === 'archipelago'),
    originPaths.find((path) => path.id === 'lilin'),
  ].filter(Boolean)
}

export function getWorldPathBadge(pathId) {
  if (pathId === 'yuma') {
    return 'Tech-forged'
  }

  if (pathId === 'lilin') {
    return 'Old magic'
  }

  if (pathId === 'archipelago') {
    return 'Nuanced start'
  }

  return ''
}

export function getOriginSuggestedCalling(origin, callings) {
  return callings.find((calling) => origin.recommendedCallings.includes(calling.id))?.name
}

export function getOriginStartingReputationPreview(originId, blueprint, limit = 3) {
  return getActiveSystemReputationEntries(
    getSystemOriginStartingReputation(originId, blueprint),
    blueprint,
  ).slice(0, limit)
}

export function getReputationPillDetail(trackKey, score, blueprint) {
  return `${getSystemReputationTier(score, blueprint).label}. ${
    getSystemReputationTier(score, blueprint).effect
  } ${getSystemReputationTrack(trackKey, blueprint)?.scope ?? ''}`.trim()
}

export function getReputationPillLabel(trackKey, score, blueprint) {
  return `${getSystemReputationTrack(trackKey, blueprint)?.name}: ${formatSystemReputationScore(score)}`
}

export function getSelectedPathSummary({
  isArchipelagoExpanded,
  selectedOrigin,
  selectedPath,
}) {
  if (isArchipelagoExpanded) {
    return (
      selectedOrigin?.lore ||
      'The Archipelago is the wider campaign region. Pick a specific island origin to define the character’s local upbringing, politics, and starting reputation.'
    )
  }

  return selectedPath?.selectedBio ?? ''
}

export function getSelectedPathEyebrow(isArchipelagoExpanded) {
  return isArchipelagoExpanded ? 'Selected Island Origin' : 'Selected World Path'
}

export function getEmpirePathHighlight(pathId) {
  if (pathId === 'yuma') {
    return 'Recommended for new players'
  }

  return 'Arcane-first start'
}

export function getEmpirePathHighlightDetail(pathId) {
  if (pathId === 'yuma') {
    return 'Yuma is the cleanest onboarding path: tech-forward, structured, and grounded in firearms and planning.'
  }

  return 'Lilin starts closer to ritual power, spirits, and arcane risk, so it leans more magical from the beginning.'
}
