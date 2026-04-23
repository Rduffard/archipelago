export const RESOURCE_FIELDS = [
  ['health', 'Health'],
  ['stamina', 'Stamina'],
  ['focus', 'Focus'],
  ['corruption', 'Corruption'],
  ['wounds', 'Wounds'],
]

export const WOUND_SEVERITY_OPTIONS = ['minor', 'major', 'critical']

export const WOUND_STAT_PENALTY_OPTIONS = [
  '',
  'might',
  'agility',
  'wit',
  'spirit',
  'resolve',
  'instinct',
]

export function titleCase(value = '') {
  if (!value) {
    return 'None'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}
