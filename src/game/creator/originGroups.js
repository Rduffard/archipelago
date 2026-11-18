const originChoices = [
  { id: 'yuma-core', name: 'Yuma' },
  { id: 'lilin-core', name: 'Lilan' },
  { id: 'archipelago', name: 'The Archipelago', summary: 'Choose an island homeland.' },
];

export function originGroups(origins) {
  const entries = originChoices.map(entry => ({ ...origins.find(item => item.id === entry.id), ...entry }));
  const islands = origins.filter(entry => !originChoices.some(option => option.id === entry.id));
  return { entries, islands };
}
