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
  return Object.entries(blueprint?.specialties ?? blueprint?.expandedSkillList ?? {}).map(([categoryKey, categorySkills]) => ({
    key: categoryKey,
    label: titleCase(categoryKey),
    description: blueprint?.display?.pairingCategories?.[categoryKey]?.description ?? '',
    skills: categorySkills,
  }))
}

const SPECIALTY_RANK_LABELS = ['Untrained', 'I', 'II', 'III', 'IV', 'V']

export function getSpecialtyRankLabel(rank = 0) {
  return SPECIALTY_RANK_LABELS[Math.max(0, Math.min(SPECIALTY_RANK_LABELS.length - 1, Number(rank) || 0))]
}

export function getSpecialtyRankEntry(specialty, rank = 0) {
  return (specialty?.ranks ?? []).find((entry) => Number(entry.rank) === Number(rank))
}

export function getSpecialtyRankEffect(specialty, rank = 0) {
  if (rank <= 0) {
    return 'No specialty training recorded yet.'
  }

  return (
    getSpecialtyRankEntry(specialty, rank)?.effect ??
    specialty?.description ??
    'A ranked technique that changes what the character can do in the right situation.'
  )
}

export function getSpecialtyRankTitle(specialty, rank = 0) {
  if (rank <= 0) {
    return 'Untrained'
  }

  return getSpecialtyRankEntry(specialty, rank)?.title ?? `Rank ${getSpecialtyRankLabel(rank)}`
}

export function getNextSpecialtyRankEffect(specialty, rank = 0) {
  const nextRank = rank + 1
  const maxRank = specialty?.maxRank ?? specialty?.ranks?.length ?? 3

  if (nextRank > maxRank) {
    return ''
  }

  return getSpecialtyRankEntry(specialty, nextRank)?.effect ?? ''
}

export function formatSpecialtyPrerequisites(prerequisites = []) {
  const prerequisiteList = Array.isArray(prerequisites)
    ? prerequisites
    : Object.entries(prerequisites ?? {}).flatMap(([rank, rankPrerequisites]) =>
        (rankPrerequisites ?? []).map((prerequisite) => ({
          ...prerequisite,
          rankRequiredFor: Number(rank),
        })),
      )

  if (!prerequisiteList.length) {
    return 'None'
  }

  return prerequisiteList
    .map((prerequisite) => {
      if (typeof prerequisite === 'string') {
        return prerequisite
      }

      if (prerequisite.coreCheck) {
        return `${titleCase(prerequisite.coreCheck)} ${prerequisite.min}+`
      }

      return [prerequisite.type, prerequisite.id, prerequisite.rank ? `Rank ${prerequisite.rank}` : null]
        .filter(Boolean)
        .join(' ')
    })
    .join(', ')
}

export function getSpecialtyPrerequisitesForRank(specialty, rank) {
  return specialty?.prerequisites?.[rank] ?? []
}

export function getSpecialtyPrerequisiteStatus(specialty, rank, checks = {}) {
  const prerequisites = getSpecialtyPrerequisitesForRank(specialty, rank)
  const checksByKey = checks ?? {}

  return prerequisites.map((prerequisite) => {
    if (prerequisite.coreCheck) {
      const current = checksByKey[prerequisite.coreCheck] ?? 0

      return {
        ...prerequisite,
        label: `${titleCase(prerequisite.coreCheck)} ${prerequisite.min}+`,
        current,
        met: current >= prerequisite.min,
      }
    }

    return {
      ...prerequisite,
      label: formatSpecialtyPrerequisites([prerequisite]),
      met: true,
    }
  })
}

export function meetsSpecialtyPrerequisites(specialty, rank, checks = {}) {
  return getSpecialtyPrerequisiteStatus(specialty, rank, checks).every((entry) => entry.met)
}

function clampSkillRank(rank, maxRank = 3) {
  return Math.max(0, Math.min(maxRank, Number(rank) || 0))
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

    const rank = clampSkillRank(skill.rank, catalogSkill.maxRank ?? 3)

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
            modifier: rank > 0 ? getSpecialtyRankLabel(rank) : 'Untrained',
            detail: [
              catalogSkill.description,
              `Specialty Rank: ${getSpecialtyRankLabel(rank)}`,
              getSpecialtyRankEffect(catalogSkill, rank),
              getNextSpecialtyRankEffect(catalogSkill, rank)
                ? `Next Rank: ${getNextSpecialtyRankEffect(catalogSkill, rank)}`
                : null,
              `Prerequisites: ${formatSpecialtyPrerequisites(catalogSkill.prerequisites)}`,
              catalogSkill.context ? `Context: ${catalogSkill.context}` : null,
              savedSkill?.specialty
                ? `Granted Focus: ${savedSkill.specialty}\nThis is a system- or progression-granted edge inside the specialty, not a separate stat players assign freely.`
                : null,
            ]
              .filter(Boolean)
              .join('\n\n'),
            rank,
            rankLabel: getSpecialtyRankLabel(rank),
            maxRank: catalogSkill.maxRank ?? catalogSkill.ranks?.length ?? 3,
            currentRankTitle: getSpecialtyRankTitle(catalogSkill, rank),
            nextRankTitle: getSpecialtyRankTitle(catalogSkill, rank + 1),
            currentEffect: getSpecialtyRankEffect(catalogSkill, rank),
            nextRankEffect: getNextSpecialtyRankEffect(catalogSkill, rank),
            categoryKey,
            relatedChecks: catalogSkill.relatedChecks ?? [],
            description: catalogSkill.description ?? '',
            ranks: catalogSkill.ranks ?? [],
            prerequisites: catalogSkill.prerequisites ?? [],
            prerequisiteLabel: formatSpecialtyPrerequisites(catalogSkill.prerequisites),
            tags: catalogSkill.tags ?? [],
            context: catalogSkill.context ?? '',
            trained: rank > 0,
            unlocked: rank > 0,
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
