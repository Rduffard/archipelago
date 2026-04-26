export const ABILITY_SOURCE_OPTIONS = ['custom', 'origin', 'relic']
export const ABILITY_TYPE_OPTIONS = ['active', 'passive', 'reaction']
export const RESOURCE_OPTIONS = ['', 'stamina', 'focus', 'corruption', 'health']
export const ATTRIBUTE_OPTIONS = ['', 'might', 'agility', 'wit', 'spirit', 'resolve', 'instinct']

export const GEAR_SECTIONS = [
  {
    key: 'weaponsText',
    title: 'Weapons',
    hint: 'One per line: Name | description',
  },
  {
    key: 'armorText',
    title: 'Armor',
    hint: 'One per line: Name | description',
  },
  {
    key: 'techRelicsText',
    title: 'Tech / Relics',
    hint: 'One per line: Name | description',
  },
  {
    key: 'cargoText',
    title: 'Cargo',
    hint: 'One per line: Name | description',
  },
  {
    key: 'inventoryText',
    title: 'Inventory',
    hint: 'One per line: Name | quantity | description',
  },
  {
    key: 'relicsText',
    title: 'Bonded Relics',
    hint: 'One per line: Name | bonded yes/no | description',
  },
]

export function titleCase(value = '') {
  if (!value) {
    return 'None'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}
