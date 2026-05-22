function titleCase(value = '') {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getSkillCategories(expandedSkillList = {}) {
  return Object.keys(expandedSkillList)
}

export function createEmptySkillState(expandedSkillList = {}) {
  return getSkillCategories(expandedSkillList).reduce((skills, categoryKey) => {
    skills[categoryKey] = []
    return skills
  }, {})
}

export function getSkillCatalogMap(expandedSkillList = {}) {
  return Object.entries(expandedSkillList).reduce((catalog, [categoryKey, categorySkills]) => {
    ;(categorySkills ?? []).forEach((skill) => {
      catalog[skill.id] = {
        ...skill,
        categoryKey,
      }
    })

    return catalog
  }, {})
}

export function getCanonicalSkillGroups(blueprint) {
  return Object.entries(blueprint?.expandedSkillList ?? {}).map(([categoryKey, categorySkills]) => ({
    key: categoryKey,
    label: titleCase(categoryKey),
    description: blueprint?.display?.pairingCategories?.[categoryKey]?.description ?? '',
    skills: categorySkills,
  }))
}

function clampSkillRank(rank) {
  return Math.max(0, Math.min(3, Number(rank) || 0))
}

function getSavedSkillEntries(initialSkills = {}) {
  if (Array.isArray(initialSkills)) {
    return initialSkills.map((skill) => ({
      categoryKey: skill.categoryKey ?? skill.category ?? '',
      skill,
    }))
  }

  return Object.entries(initialSkills ?? {}).flatMap(([categoryKey, entries]) =>
    (entries ?? []).map((skill) => ({
      categoryKey,
      skill,
    })),
  )
}

export function normalizeCharacterSkills(initialSkills = {}, expandedSkillList = {}) {
  const emptySkills = createEmptySkillState(expandedSkillList)
  const skillCatalog = getSkillCatalogMap(expandedSkillList)

  getSavedSkillEntries(initialSkills).forEach(({ categoryKey, skill }) => {
    const catalogSkill = skillCatalog[skill.id]
    const resolvedCategoryKey = catalogSkill?.categoryKey ?? categoryKey

    if (!catalogSkill || !emptySkills[resolvedCategoryKey]) {
      return
    }

    const rank = clampSkillRank(skill.rank)

    if (rank <= 0) {
      return
    }

    emptySkills[resolvedCategoryKey].push({
      id: catalogSkill.id,
      rank,
      specialty: skill.specialty ?? '',
    })
  })

  Object.keys(emptySkills).forEach((categoryKey) => {
    emptySkills[categoryKey] = emptySkills[categoryKey].sort((left, right) => {
      const leftSkill = skillCatalog[left.id]
      const rightSkill = skillCatalog[right.id]

      return (leftSkill?.name ?? left.id).localeCompare(rightSkill?.name ?? right.id)
    })
  })

  return emptySkills
}

export function resolveCharacterSkillGroups({
  characterSkills = {},
  expandedSkillList = {},
  includeUntrained = false,
}) {
  const normalizedSkills = normalizeCharacterSkills(characterSkills, expandedSkillList)

  return Object.entries(expandedSkillList)
    .map(([categoryKey, categorySkills]) => {
      const rankMap = new Map((normalizedSkills[categoryKey] ?? []).map((skill) => [skill.id, skill]))
      const entries = (categorySkills ?? [])
        .map((catalogSkill) => {
          const savedSkill = rankMap.get(catalogSkill.id)
          const rank = savedSkill?.rank ?? 0

          if (!includeUntrained && rank <= 0) {
            return null
          }

          return {
            key: `${categoryKey}-${catalogSkill.id}`,
            id: catalogSkill.id,
            label: catalogSkill.name,
            value: rank,
            modifier: rank > 0 ? `Rank ${rank}` : 'Untrained',
            detail: [
              catalogSkill.verb ?? 'No system description loaded yet.',
              catalogSkill.linkedAttributes?.length
                ? `Linked Attributes: ${catalogSkill.linkedAttributes.map(titleCase).join(' + ')}`
                : null,
              savedSkill?.specialty
                ? `Granted Focus: ${savedSkill.specialty}\nThis is a system- or progression-granted edge inside the skill, not a separate stat players assign freely.`
                : null,
            ]
              .filter(Boolean)
              .join('\n\n'),
            rank,
            categoryKey,
            linkedAttributes: catalogSkill.linkedAttributes ?? [],
            specialty: savedSkill?.specialty ?? '',
          }
        })
        .filter(Boolean)

      if (!entries.length) {
        return null
      }

      return {
        key: categoryKey,
        label: titleCase(categoryKey),
        entries,
      }
    })
    .filter(Boolean)
}
