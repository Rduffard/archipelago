import { useEffect, useMemo, useState } from 'react'
import AttributesStep from '../../components/creator/AttributesStep'
import DetailsStep from '../../components/creator/DetailsStep'
import { CallingStep, WorldPathStep } from '../../components/creator/IdentityStep'
import LoadoutStep from '../../components/creator/LoadoutStep'
import ProgressionStep from '../../components/creator/ProgressionStep'
import ReviewStep from '../../components/creator/ReviewStep'
import SkillsStep from '../../components/creator/SkillsStep'
import { ATTRIBUTE_POINTS } from '../../data/archipelagoSystemBlueprint'
import {
  getRankedSystemSpecializations,
  getSystemCallings,
  getSystemOrigins,
  getSystemOriginPaths,
  getSystemOriginStartingReputation,
  getSystemSpecialization,
  getSystemSpecializations,
} from '../../data/archipelagoSystemSelectors'
import { useSystem } from '../../hooks/useSystem'
import {
  applyAttributeBonus,
  calculateDerivedStats,
  calculatePairingStats,
  calculateSocialStats,
  createEmptyAttributes,
  getRemainingPoints,
  parseAttributeBonus,
} from '../../lib/character'
import './CharacterCreator.css'

const initialIdentity = {
  name: '',
  pronouns: '',
  callingId: '',
  path: '',
  originId: '',
}

const PATH_ORIGIN_MAP = {
  yuma: 'yuma-core',
  lilin: 'lilin-core',
}

const STARTING_SKILL_POINTS = 5

const steps = [
  {
    id: 'identity',
    title: 'Roots',
    description: 'Name the character and choose a world path or island origin.',
  },
  {
    id: 'calling',
    title: 'Calling',
    description: 'Define the role this character plays.',
  },
  {
    id: 'attributes',
    title: 'Attributes',
    description: 'Spend the 12 starting points.',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Spend training points on your starting verb skills.',
  },
  {
    id: 'loadout',
    title: 'Loadout',
    description: 'Add custom abilities, gear, relics, and carried inventory.',
  },
  {
    id: 'details',
    title: 'Details',
    description: 'Set background notes, custom traits, and starting tracks.',
  },
  {
    id: 'progression',
    title: 'Progression',
    description: 'Set rank, specialization path, and unlocked advancement.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Check the frame and save the sheet.',
  },
]

function toSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapAbilityType(typeLabel = '') {
  const normalized = typeLabel.trim().toLowerCase()

  if (normalized === 'reaction') {
    return 'reaction'
  }

  if (normalized === 'passive') {
    return 'passive'
  }

  return 'active'
}

function createIdentityTags(selectedPath, selectedOrigin, selectedCalling) {
  return [
    selectedPath
      ? {
          type: 'tag',
          key: `path-${selectedPath.id}`,
          label: selectedPath.name,
          mechanicalImpact: selectedPath.description ?? selectedPath.summary ?? '',
        }
      : null,
    selectedOrigin
      ? {
          type: 'trait',
          key: `origin-${selectedOrigin.id}`,
          label: selectedOrigin.identityTag || `${selectedOrigin.name} Born`,
          mechanicalImpact:
            selectedOrigin.identityTagDetail || `${selectedOrigin.summary} ${selectedOrigin.passiveRule}`.trim(),
        }
      : null,
    selectedCalling
      ? {
          type: 'tag',
          key: `calling-${selectedCalling.id}`,
          label: selectedCalling.name,
          mechanicalImpact: `${selectedCalling.focus}. ${selectedCalling.description}`.trim(),
        }
      : null,
  ].filter(Boolean)
}

function createStarterAbilities(selectedCalling) {
  if (!selectedCalling) {
    return []
  }

  return [
    {
      id: `ability-${selectedCalling.id}-${toSlug(selectedCalling.starterAbility)}`,
      name: selectedCalling.starterAbility,
      type: mapAbilityType(selectedCalling.starterAbilityType),
      description: `${selectedCalling.starterAbilityType}. ${selectedCalling.starterAbilityRule}`,
      source: 'calling',
      cost: {
        resource: '',
        amount: 0,
      },
      scaling: {
        attribute: selectedCalling.primaryStats?.[0]?.toLowerCase() ?? '',
        skill: '',
      },
      tags: ['calling', 'starter', selectedCalling.id],
      effect: selectedCalling.starterAbilityRule,
    },
  ]
}

function formatAbilitySource(source = '') {
  const normalized = source.trim().toLowerCase()

  if (['calling', 'origin', 'relic', 'custom'].includes(normalized)) {
    return normalized
  }

  return 'custom'
}

function createEmptyCustomAbility() {
  return {
    name: '',
    source: 'custom',
    type: 'active',
    costResource: '',
    costAmount: 0,
    scalingAttribute: '',
    scalingSkill: '',
    tagsText: '',
    effect: '',
  }
}

function createEmptySkills() {
  return {
    combat: [],
    social: [],
    exploration: [],
    utility: [],
    arcane: [],
  }
}

function countAllocatedSkillPoints(skills = {}) {
  return Object.values(skills).reduce(
    (total, entries) => total + (entries ?? []).reduce((groupTotal, skill) => groupTotal + (skill.rank ?? 0), 0),
    0,
  )
}

function normalizeSkills(initialSkills = {}, expandedSkillList = {}) {
  return Object.keys(expandedSkillList).reduce((skills, categoryKey) => {
    const savedSkills = initialSkills?.[categoryKey] ?? []
    skills[categoryKey] = savedSkills
      .filter((skill) => expandedSkillList[categoryKey].some((entry) => entry.id === skill.id))
      .map((skill) => ({
        ...skill,
        rank: Math.max(0, Math.min(3, skill.rank ?? 0)),
        specialty: skill.specialty ?? '',
      }))
    return skills
  }, createEmptySkills())
}

function createEmptyEquipment() {
  return {
    weapons: [],
    armor: [],
    techRelics: [],
    cargo: [],
  }
}

function normalizeCustomAbilities(abilities = []) {
  const normalizedAbilities = abilities
    .filter((ability) => ability?.source !== 'calling')
    .map((ability) => ({
      name: ability.name ?? '',
      source: formatAbilitySource(ability.source),
      type: mapAbilityType(ability.type),
      costResource: ability.cost?.resource ?? '',
      costAmount: ability.cost?.amount ?? 0,
      scalingAttribute: ability.scaling?.attribute ?? '',
      scalingSkill: ability.scaling?.skill ?? '',
      tagsText: Array.isArray(ability.tags) ? ability.tags.join(', ') : '',
      effect: ability.effect || ability.description || '',
    }))

  return normalizedAbilities.length ? normalizedAbilities : [createEmptyCustomAbility()]
}

function parseCustomAbilityTags(tagsText = '') {
  const parsedTags = tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return parsedTags.length ? parsedTags : ['custom']
}

function parseCustomAbilities(customAbilities = []) {
  return customAbilities
    .map((ability, index) => {
      const name = ability.name.trim()
      const effect = ability.effect.trim()

      if (!name && !effect) {
        return null
      }

      return {
        id: `ability-custom-${toSlug(name || `entry-${index + 1}`)}`,
        name: name || `Custom Ability ${index + 1}`,
        type: mapAbilityType(ability.type),
        description: effect,
        source: formatAbilitySource(ability.source),
        cost: {
          resource: ability.costResource ?? '',
          amount: Math.max(0, Number(ability.costAmount) || 0),
        },
        scaling: {
          attribute: ability.scalingAttribute ?? '',
          skill: ability.scalingSkill?.trim() ?? '',
        },
        tags: parseCustomAbilityTags(ability.tagsText),
        effect,
      }
    })
    .filter(Boolean)
}

function formatEquipmentText(items = []) {
  return items.map((item) => [item.name, item.description || ''].join(' | ')).join('\n')
}

function parseEquipmentText(text = '', type) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const description = descriptionParts.join('|').trim()

      return {
        id: `${type}-${toSlug(name || `entry-${index + 1}`)}`,
        name: name || `${type} ${index + 1}`,
        type,
        skillLinks: [],
        tags: [],
        grants: [],
        description,
      }
    })
}

function formatInventoryText(items = []) {
  return items.map((item) => [item.name, item.quantity ?? 1, item.description || ''].join(' | ')).join('\n')
}

function parseInventoryText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', quantityPart = '1', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const quantity = Number(quantityPart.trim()) || 1
      const description = descriptionParts.join('|').trim()

      return {
        name: name || `Item ${index + 1}`,
        quantity: Math.max(1, quantity),
        description,
      }
    })
}

function formatRelicsText(relics = []) {
  return relics.map((relic) => [relic.name, relic.bonded ? 'yes' : 'no', relic.description || ''].join(' | ')).join('\n')
}

function parseRelicsText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart = '', bondedPart = 'no', ...descriptionParts] = line.split('|')
      const name = namePart.trim()
      const bonded = ['yes', 'true', 'bonded', 'y'].includes(bondedPart.trim().toLowerCase())
      const description = descriptionParts.join('|').trim()

      return {
        name: name || `Relic ${index + 1}`,
        bonded,
        description,
      }
    })
}

function createEmptyWound() {
  return {
    name: '',
    severity: 'minor',
    statPenalty: '',
    description: '',
  }
}

function normalizeWounds(wounds = []) {
  return wounds.length
    ? wounds.map((wound) => ({
        name: wound.name ?? '',
        severity: wound.severity ?? 'minor',
        statPenalty: wound.statPenalty ?? '',
        description: wound.description ?? '',
      }))
    : []
}

function parseWounds(wounds = []) {
  return wounds
    .map((wound) => {
      const name = wound.name.trim()

      if (!name) {
        return null
      }

      return {
        name,
        severity: wound.severity || 'minor',
        statPenalty: wound.statPenalty || null,
        description: wound.description.trim(),
      }
    })
    .filter(Boolean)
}

function createResources(attributes, derivedStats) {
  const staminaMax = 4 + (attributes.might ?? 0) + (attributes.agility ?? 0)
  const focusMax = Math.max(0, (derivedStats.focus ?? 10) - 10)
  const woundMax = Math.max(3, 2 + Math.ceil((attributes.resolve ?? 0) / 2))

  return {
    health: {
      current: derivedStats.vitality ?? 0,
      max: derivedStats.vitality ?? 0,
    },
    wounds: {
      current: 0,
      max: woundMax,
      active: [],
    },
    stamina: {
      current: staminaMax,
      max: staminaMax,
    },
    focus: {
      current: focusMax,
      max: focusMax,
    },
    corruption: {
      current: 0,
      max: 6,
    },
  }
}

function clampTrackValue(value, max) {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.max(0, Math.min(max, numericValue))
}

function createProgression(rank = 1) {
  return {
    rank,
    skillPoints: 0,
    advancementPoints: 0,
    specializationPath: '',
    unlockedNodes: [],
  }
}

function normalizeProgression(progression = {}) {
  return {
    rank: Math.max(1, Number(progression.rank) || 1),
    skillPoints: Math.max(0, Number(progression.skillPoints) || 0),
    advancementPoints: Math.max(0, Number(progression.advancementPoints) || 0),
    specializationPath: progression.specializationPath ?? '',
    unlockedNodes: progression.unlockedNodes ?? [],
  }
}

function getCreatorIdentity(character, origin) {
  return {
    name: character?.name ?? '',
    pronouns: character?.pronouns ?? '',
    callingId: character?.calling ?? '',
    path: origin?.path ?? '',
    originId: character?.origin ?? '',
  }
}

function removeAttributeBonus(attributeValues, bonusText = '') {
  const parsedBonus = parseAttributeBonus(bonusText)

  if (!parsedBonus) {
    return attributeValues
  }

  return {
    ...createEmptyAttributes(),
    ...attributeValues,
    [parsedBonus.key]: Math.max(0, (attributeValues?.[parsedBonus.key] ?? 0) - parsedBonus.amount),
  }
}

function formatCustomTraitsText(traits = []) {
  return traits
    .map((trait) =>
      trait.mechanicalImpact
        ? `${trait.label} | ${trait.mechanicalImpact}`
        : trait.label,
    )
    .join('\n')
}

function parseCustomTraitsText(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelPart, ...impactParts] = line.split('|')
      const label = labelPart.trim()
      const mechanicalImpact = impactParts.join('|').trim()

      return {
        type: 'trait',
        key: `custom-trait-${toSlug(label || `entry-${index + 1}`)}`,
        label: label || `Trait ${index + 1}`,
        mechanicalImpact,
      }
    })
}

function getGeneratedTraitKeys(pathId, originId, callingId) {
  return new Set(
    [`path-${pathId}`, `origin-${originId}`, `calling-${callingId}`].filter(Boolean),
  )
}

function CharacterCreator({
  onSaveCharacter,
  initialCharacter = null,
  isSaving = false,
  showIntro = true,
}) {
  const { blueprint, isBlueprintLoading, blueprintError } = useSystem()
  const callings = getSystemCallings(blueprint)
  const origins = getSystemOrigins(blueprint)
  const originPaths = getSystemOriginPaths(blueprint)
  const specializations = getSystemSpecializations(blueprint)
  const [identity, setIdentity] = useState(initialIdentity)
  const [attributeValues, setAttributeValues] = useState(createEmptyAttributes)
  const [details, setDetails] = useState({
    pastRole: '',
    definingEvent: '',
    notes: '',
    customTraitsText: '',
  })
  const [loadout, setLoadout] = useState({
    customAbilities: [createEmptyCustomAbility()],
    weaponsText: '',
    armorText: '',
    techRelicsText: '',
    cargoText: '',
    inventoryText: '',
    relicsText: '',
  })
  const [skills, setSkills] = useState(createEmptySkills)
  const [resourceValues, setResourceValues] = useState({
    health: 0,
    stamina: 0,
    focus: 0,
    corruption: 0,
    wounds: 0,
  })
  const [wounds, setWounds] = useState([])
  const [progressionValues, setProgressionValues] = useState(() => normalizeProgression(createProgression()))
  const [saveMessage, setSaveMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [hydratedCharacterId, setHydratedCharacterId] = useState(null)
  const isEditing = Boolean(initialCharacter?._id)

  const selectedCalling = callings.find((entry) => entry.id === identity.callingId)
  const selectedOrigin = origins.find((entry) => entry.id === identity.originId)
  const selectedPath = originPaths.find((entry) => entry.id === identity.path)
  const rankedSpecializations = useMemo(
    () => getRankedSystemSpecializations(identity.callingId, skills, blueprint),
    [blueprint, identity.callingId, skills],
  )
  const activeSpecialization =
    rankedSpecializations.find((entry) => entry.id === progressionValues.specializationPath) ??
    getSystemSpecialization(progressionValues.specializationPath, blueprint)
  const recommendedSpecializations = rankedSpecializations.filter(
    (specialization) => specialization.recommendationScore > 0,
  )
  const advancementSpent = useMemo(
    () =>
      (activeSpecialization?.nodes ?? [])
        .filter((node) => progressionValues.unlockedNodes.includes(node.id))
        .reduce((total, node) => total + (node.cost ?? 0), 0),
    [activeSpecialization, progressionValues.unlockedNodes],
  )
  const finalAttributes = useMemo(
    () => applyAttributeBonus(attributeValues, selectedOrigin?.bonus),
    [attributeValues, selectedOrigin?.bonus],
  )
  const startingReputation = useMemo(
    () => getSystemOriginStartingReputation(identity.originId, blueprint),
    [blueprint, identity.originId],
  )
  const derivedStats = useMemo(() => calculateDerivedStats(finalAttributes), [finalAttributes])
  const socialStats = useMemo(() => calculateSocialStats(finalAttributes), [finalAttributes])
  const pairings = useMemo(() => blueprint?.catalogs?.pairings ?? [], [blueprint])
  const skillGroups = useMemo(
    () =>
      Object.entries(blueprint?.expandedSkillList ?? {}).map(([categoryKey, categorySkills]) => ({
        key: categoryKey,
        label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
        description: blueprint?.display?.pairingCategories?.[categoryKey]?.description ?? '',
        skills: categorySkills,
      })),
    [blueprint],
  )
  const pairingStats = useMemo(
    () => calculatePairingStats(finalAttributes, pairings),
    [finalAttributes, pairings],
  )
  const totalSkillPoints = useMemo(
    () => Math.max(STARTING_SKILL_POINTS, countAllocatedSkillPoints(initialCharacter?.skills ?? {})),
    [initialCharacter],
  )
  const allocatedSkillPoints = useMemo(() => countAllocatedSkillPoints(skills), [skills])
  const remainingSkillPoints = Math.max(0, totalSkillPoints - allocatedSkillPoints)
  const resourceMaximums = useMemo(() => {
    const generatedResources = createResources(finalAttributes, derivedStats)

    return {
      health: generatedResources.health.max,
      stamina: generatedResources.stamina.max,
      focus: generatedResources.focus.max,
      corruption: generatedResources.corruption.max,
      wounds: generatedResources.wounds.max,
    }
  }, [derivedStats, finalAttributes])
  const remainingPoints = getRemainingPoints(attributeValues)
  const trimmedName = identity.name.trim()
  const hasValidName = trimmedName.length >= 2

  useEffect(() => {
    if (!initialCharacter?._id || !blueprint || hydratedCharacterId === initialCharacter._id) {
      return
    }

    const initialOrigin =
      origins.find((entry) => entry.id === initialCharacter.origin) ??
      origins.find((entry) => entry.name === initialCharacter.identity?.background?.origin) ??
      null
    const generatedTraitKeys = getGeneratedTraitKeys(
      initialOrigin?.path,
      initialCharacter.origin,
      initialCharacter.calling,
    )
    const customTraits = (initialCharacter.identity?.tags ?? []).filter(
      (trait) => !generatedTraitKeys.has(trait.key),
    )
    const fallbackResources = createResources(initialCharacter.attributes ?? createEmptyAttributes(), initialCharacter.derivedStats ?? {})

    setIdentity(getCreatorIdentity(initialCharacter, initialOrigin))
    setAttributeValues(removeAttributeBonus(initialCharacter.attributes ?? createEmptyAttributes(), initialOrigin?.bonus))
    setSkills(normalizeSkills(initialCharacter.skills ?? createEmptySkills(), blueprint?.expandedSkillList ?? {}))
    setLoadout({
      customAbilities: normalizeCustomAbilities(initialCharacter.abilities ?? []),
      weaponsText: formatEquipmentText(initialCharacter.equipment?.weapons ?? []),
      armorText: formatEquipmentText(initialCharacter.equipment?.armor ?? []),
      techRelicsText: formatEquipmentText(initialCharacter.equipment?.techRelics ?? []),
      cargoText: formatEquipmentText(initialCharacter.equipment?.cargo ?? []),
      inventoryText: formatInventoryText(initialCharacter.inventory ?? []),
      relicsText: formatRelicsText(initialCharacter.relics ?? []),
    })
    setDetails({
      pastRole: initialCharacter.identity?.background?.pastRole ?? '',
      definingEvent: initialCharacter.identity?.background?.definingEvent ?? '',
      notes: initialCharacter.notes ?? '',
      customTraitsText: formatCustomTraitsText(customTraits),
    })
    setResourceValues({
      health: initialCharacter.resources?.health?.current ?? fallbackResources.health.current,
      stamina: initialCharacter.resources?.stamina?.current ?? fallbackResources.stamina.current,
      focus: initialCharacter.resources?.focus?.current ?? fallbackResources.focus.current,
      corruption: initialCharacter.resources?.corruption?.current ?? fallbackResources.corruption.current,
      wounds: initialCharacter.resources?.wounds?.current ?? 0,
    })
    setWounds(normalizeWounds(initialCharacter.resources?.wounds?.active ?? []))
    setProgressionValues(normalizeProgression(initialCharacter.progression ?? createProgression()))
    setHydratedCharacterId(initialCharacter._id)
  }, [blueprint, hydratedCharacterId, initialCharacter, origins])

  if (isBlueprintLoading && !blueprint) {
    return (
      <section className="creator-page creator-page--embedded">
        {showIntro ? (
          <section className="hero-banner">
            <p className="hero-banner__eyebrow">Sanguine Archipelago</p>
            <h1>Character Creator</h1>
            <p className="hero-banner__copy">
              Pulling the shared system blueprint so this creator uses the canonical world paths,
              callings, origins, and sheet math.
            </p>
          </section>
        ) : null}

        <section className="creator-panel">
          <div className="creator-panel__header">
            <p className="creator-panel__kicker">System Data</p>
            <h2>Loading creator blueprint</h2>
            <p>The creator is waiting for the backend system package before it unlocks choices.</p>
          </div>
        </section>
      </section>
    )
  }

  if (blueprintError || !blueprint) {
    return (
      <section className="creator-page creator-page--embedded">
        {showIntro ? (
          <section className="hero-banner">
            <p className="hero-banner__eyebrow">Sanguine Archipelago</p>
            <h1>Character Creator</h1>
            <p className="hero-banner__copy">
              This flow is now driven by the shared system blueprint instead of local fallback data.
            </p>
          </section>
        ) : null}

        <section className="creator-panel">
          <div className="creator-panel__header">
            <p className="creator-panel__kicker">System Data</p>
            <h2>Blueprint unavailable</h2>
            <p>{blueprintError || 'The shared system blueprint could not be loaded.'}</p>
          </div>
        </section>
      </section>
    )
  }

  const isIdentityComplete =
    hasValidName &&
    Boolean(identity.path) &&
    (identity.path === 'archipelago' ? Boolean(identity.originId) : Boolean(PATH_ORIGIN_MAP[identity.path]))

  const validations = useMemo(
    () => ({
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
    }),
    [
      identity.callingId,
      identity.originId,
      isIdentityComplete,
      progressionValues.rank,
      remainingPoints,
      remainingSkillPoints,
    ],
  )

  function handleIdentityChange(field, value) {
    setSaveMessage('')

    setIdentity((current) => {
      if (field === 'path') {
        return {
          ...current,
          path: value,
          originId: value === 'archipelago' ? '' : PATH_ORIGIN_MAP[value] ?? '',
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  function handleAttributeChange(key, nextValue) {
    setSaveMessage('')

    setAttributeValues((current) => {
      const clampedValue = Math.max(0, Math.min(4, nextValue))
      const draft = { ...current, [key]: clampedValue }

      if (getRemainingPoints(draft) < 0) {
        return current
      }

      return draft
    })
  }

  function handleDetailsChange(field, value) {
    setSaveMessage('')
    setDetails((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleLoadoutChange(field, value) {
    setSaveMessage('')
    setLoadout((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCustomAbilityChange(index, field, value) {
    setSaveMessage('')
    setLoadout((current) => ({
      ...current,
      customAbilities: current.customAbilities.map((ability, abilityIndex) =>
        abilityIndex === index
          ? {
              ...ability,
              [field]: field === 'costAmount' ? Math.max(0, Number(value) || 0) : value,
            }
          : ability,
      ),
    }))
  }

  function handleAddCustomAbility() {
    setSaveMessage('')
    setLoadout((current) => ({
      ...current,
      customAbilities: [...current.customAbilities, createEmptyCustomAbility()],
    }))
  }

  function handleRemoveCustomAbility(index) {
    setSaveMessage('')
    setLoadout((current) => ({
      ...current,
      customAbilities:
        current.customAbilities.length === 1
          ? [createEmptyCustomAbility()]
          : current.customAbilities.filter((_, abilityIndex) => abilityIndex !== index),
    }))
  }

  function handleSkillRankChange(categoryKey, blueprintSkill, nextRank) {
    setSaveMessage('')

    setSkills((current) => {
      const clampedRank = Math.max(0, Math.min(3, nextRank))
      const currentGroup = current[categoryKey] ?? []
      const existingEntry = currentGroup.find((entry) => entry.id === blueprintSkill.id)
      const nextGroup =
        clampedRank === 0
          ? currentGroup.filter((entry) => entry.id !== blueprintSkill.id)
          : [
              ...currentGroup.filter((entry) => entry.id !== blueprintSkill.id),
              {
                id: blueprintSkill.id,
                name: blueprintSkill.name,
                rank: clampedRank,
                linkedAttributes: blueprintSkill.linkedAttributes ?? [],
                specialty: existingEntry?.specialty ?? '',
              },
            ].sort((left, right) => left.name.localeCompare(right.name))

      const nextSkills = {
        ...current,
        [categoryKey]: nextGroup,
      }

      if (countAllocatedSkillPoints(nextSkills) > totalSkillPoints) {
        return current
      }

      return nextSkills
    })
  }

  function handleResourceChange(key, nextValue) {
    setSaveMessage('')
    setResourceValues((current) => ({
      ...current,
      [key]: clampTrackValue(nextValue, resourceMaximums[key] ?? Number.MAX_SAFE_INTEGER),
    }))
  }

  function handleProgressionChange(field, value) {
    setSaveMessage('')
    setProgressionValues((current) => {
      if (field === 'specializationPath') {
        const refundedAdvancement =
          current.advancementPoints +
          ((activeSpecialization?.nodes ?? [])
            .filter((node) => current.unlockedNodes.includes(node.id))
            .reduce((total, node) => total + (node.cost ?? 0), 0) ?? 0)

        return {
          ...current,
          advancementPoints: refundedAdvancement,
          specializationPath: value,
          unlockedNodes: [],
        }
      }

      return {
        ...current,
        [field]:
          field === 'rank' || field === 'skillPoints' || field === 'advancementPoints'
            ? Math.max(field === 'rank' ? 1 : 0, Number(value) || 0)
            : value,
      }
    })
  }

  function handleWoundChange(index, field, value) {
    setSaveMessage('')
    setWounds((current) =>
      current.map((wound, woundIndex) =>
        woundIndex === index
          ? {
              ...wound,
              [field]: value,
            }
          : wound,
      ),
    )
  }

  function handleAddWound() {
    setSaveMessage('')
    setWounds((current) => [...current, createEmptyWound()])
  }

  function handleRemoveWound(index) {
    setSaveMessage('')
    setWounds((current) => current.filter((_, woundIndex) => woundIndex !== index))
  }

  async function handleSaveCharacter() {
    if (!onSaveCharacter || !validations.review) {
      return
    }

    const rank = progressionValues.rank
    const generatedTraits = createIdentityTags(selectedPath, selectedOrigin, selectedCalling)
    const customTraits = parseCustomTraitsText(details.customTraitsText)
    const traits = [...generatedTraits, ...customTraits]
    const customAbilities = parseCustomAbilities(loadout.customAbilities)
    const abilities = [...createStarterAbilities(selectedCalling), ...customAbilities]
    const baseResources = createResources(finalAttributes, derivedStats)
    const activeWounds = parseWounds(wounds)
    const savedWoundCount = Math.max(resourceValues.wounds, activeWounds.length)
    const resources = {
      ...baseResources,
      health: {
        current: clampTrackValue(resourceValues.health, baseResources.health.max),
        max: baseResources.health.max,
      },
      wounds: {
        current: clampTrackValue(savedWoundCount, baseResources.wounds.max),
        max: baseResources.wounds.max,
        active: activeWounds,
      },
      stamina: {
        current: clampTrackValue(resourceValues.stamina, baseResources.stamina.max),
        max: baseResources.stamina.max,
      },
      focus: {
        current: clampTrackValue(resourceValues.focus, baseResources.focus.max),
        max: baseResources.focus.max,
      },
      corruption: {
        current: clampTrackValue(resourceValues.corruption, baseResources.corruption.max),
        max: baseResources.corruption.max,
      },
    }
    const progression = {
      ...(initialCharacter?.progression ?? createProgression(rank)),
      rank,
      skillPoints: progressionValues.skillPoints,
      advancementPoints: progressionValues.advancementPoints,
      specializationPath: progressionValues.specializationPath.trim(),
      unlockedNodes: progressionValues.unlockedNodes,
    }

    const payload = {
      name: trimmedName,
      pronouns: identity.pronouns.trim(),
      calling: identity.callingId,
      origin: identity.originId,
      identity: {
        background: {
          origin: selectedOrigin?.name ?? '',
          pastRole: details.pastRole.trim() || selectedCalling?.name || '',
          definingEvent:
            details.definingEvent.trim() || selectedPath?.summary || selectedOrigin?.summary || '',
        },
        tags: traits,
      },
      attributes: finalAttributes,
      derivedStats,
      socialStats,
      pairingStats,
      reputation: startingReputation,
      skills,
      abilities,
      resources,
      inventory: parseInventoryText(loadout.inventoryText),
      relics: parseRelicsText(loadout.relicsText),
      equipment: {
        weapons: parseEquipmentText(loadout.weaponsText, 'weapon'),
        armor: parseEquipmentText(loadout.armorText, 'armor'),
        techRelics: parseEquipmentText(loadout.techRelicsText, 'tech'),
        cargo: parseEquipmentText(loadout.cargoText, 'cargo'),
      },
      progression,
      notes: details.notes.trim(),
      portraitUrl: initialCharacter?.portraitUrl ?? '',
      campaignId: initialCharacter?.campaignId ?? null,
      status: initialCharacter?.status ?? 'active',
    }

    await onSaveCharacter(payload)
    setSaveMessage(
      `${payload.name || 'Character'} ${isEditing ? 'updated' : 'saved'} ${isEditing ? 'successfully' : 'to your roster'}.`,
    )
  }

  function getStepValidity(stepId) {
    return validations[stepId]
  }

  function isStepAccessible(stepIndex) {
    return steps.slice(0, stepIndex).every((step) => getStepValidity(step.id))
  }

  function handleGoToStep(stepIndex) {
    if (stepIndex === currentStep || isStepAccessible(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  function handleNextStep() {
    const nextStep = Math.min(currentStep + 1, steps.length - 1)

    if (isStepAccessible(nextStep)) {
      setCurrentStep(nextStep)
    }
  }

  function handlePreviousStep() {
    setCurrentStep((current) => Math.max(current - 1, 0))
  }

  const currentStepMeta = steps[currentStep]
  const canGoNext = currentStepMeta.id === 'review' ? false : isStepAccessible(currentStep + 1)

  let stepContent = null

  if (currentStepMeta.id === 'identity') {
    stepContent = <WorldPathStep identity={identity} onIdentityChange={handleIdentityChange} />
  }

  if (currentStepMeta.id === 'calling') {
    stepContent = <CallingStep identity={identity} onIdentityChange={handleIdentityChange} />
  }

  if (currentStepMeta.id === 'attributes') {
    stepContent = (
      <AttributesStep attributeValues={attributeValues} onAttributeChange={handleAttributeChange} />
    )
  }

  if (currentStepMeta.id === 'skills') {
    stepContent = (
      <SkillsStep
        skillGroups={skillGroups}
        skills={skills}
        finalAttributes={finalAttributes}
        remainingSkillPoints={remainingSkillPoints}
        totalSkillPoints={totalSkillPoints}
        onSkillRankChange={handleSkillRankChange}
      />
    )
  }

  if (currentStepMeta.id === 'loadout') {
    stepContent = (
      <LoadoutStep
        loadout={loadout}
        onLoadoutChange={handleLoadoutChange}
        onCustomAbilityChange={handleCustomAbilityChange}
        onAddCustomAbility={handleAddCustomAbility}
        onRemoveCustomAbility={handleRemoveCustomAbility}
      />
    )
  }

  if (currentStepMeta.id === 'details') {
    stepContent = (
      <DetailsStep
        details={details}
        resources={resourceValues}
        resourceMaximums={resourceMaximums}
        wounds={wounds}
        onDetailsChange={handleDetailsChange}
        onResourceChange={handleResourceChange}
        onWoundChange={handleWoundChange}
        onAddWound={handleAddWound}
        onRemoveWound={handleRemoveWound}
      />
    )
  }

  if (currentStepMeta.id === 'progression') {
    stepContent = (
      <ProgressionStep
        progression={progressionValues}
        specializations={specializations}
        activeSpecialization={activeSpecialization}
        recommendedSpecializations={recommendedSpecializations}
        rankedSpecializations={rankedSpecializations}
        advancementSpent={advancementSpent}
        onProgressionChange={handleProgressionChange}
      />
    )
  }

  if (currentStepMeta.id === 'review') {
    stepContent = (
        <ReviewStep
          identity={identity}
          attributeValues={attributeValues}
          derivedStats={derivedStats}
          socialStats={socialStats}
          reputation={startingReputation}
          details={details}
          loadout={loadout}
          resources={resourceValues}
          resourceMaximums={resourceMaximums}
          skills={skills}
          wounds={wounds}
          progression={progressionValues}
        />
      )
  }

  let actionHint = 'You can jump between unlocked steps from the rail above.'

  if (currentStepMeta.id === 'identity' && !validations.identity) {
    if (!trimmedName) {
      actionHint = 'Give the character a name before moving on.'
    } else if (!hasValidName) {
      actionHint = 'Character names need at least 2 characters.'
    } else if (!identity.path) {
      actionHint = 'Pick Yuma, Lilin, or the Archipelago to continue.'
    } else {
      actionHint = 'Choose one of the island origins to continue.'
    }
  }

  if (currentStepMeta.id === 'calling' && !validations.calling) {
    actionHint = 'Choose a calling before moving on.'
  }

  if (currentStepMeta.id === 'attributes' && !validations.attributes) {
    actionHint = `Spend the remaining ${remainingPoints} point${remainingPoints === 1 ? '' : 's'} to continue.`
  }

  if (currentStepMeta.id === 'skills' && !validations.skills) {
    actionHint = `Spend the remaining ${remainingSkillPoints} skill point${remainingSkillPoints === 1 ? '' : 's'} to continue.`
  }

  if (currentStepMeta.id === 'loadout') {
    actionHint = 'Add any optional gear, relics, inventory, or custom abilities before review.'
  }

  if (currentStepMeta.id === 'details') {
    actionHint = 'Add any optional history, trait notes, or starting track changes before review.'
  }

  if (currentStepMeta.id === 'progression') {
    actionHint = 'Set the current rank and any advancement state before review.'
  }

  if (currentStepMeta.id === 'review' && !validations.review) {
    actionHint = `Spend all ${ATTRIBUTE_POINTS} points and finish the earlier choices to save.`
  }

  const originSummaryValue =
    selectedOrigin?.name ||
    (identity.path === 'archipelago'
      ? 'Select island'
      : identity.path
      ? 'Path-aligned homeland'
      : 'Not chosen')

  return (
    <section className="creator-page creator-page--embedded">
      {showIntro ? (
        <section className="hero-banner">
          <p className="hero-banner__eyebrow">Sanguine Archipelago</p>
          <h1>Character Creator</h1>
          <p className="hero-banner__copy">
            A guided first pass for your tabletop app, grounded in world paths, callings,
            island origins, thematic attributes, and the politics waiting for you offshore.
          </p>
        </section>
      ) : null}

      <section className="creator-nav">
        <div className="creator-nav__header">
          <div>
            <p className="creator-summary__label">Step {currentStep + 1} of {steps.length}</p>
            <h2>{currentStepMeta.title}</h2>
            <p>{currentStepMeta.description}</p>
          </div>
          <div className="creator-nav__progress">
            <strong>{Math.round(((currentStep + 1) / steps.length) * 100)}%</strong>
            <span>Flow Progress</span>
          </div>
        </div>

        <section className="creator-stepper">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep
            const isComplete = index < currentStep && getStepValidity(step.id)
            const isAccessible = isStepAccessible(index)

            return (
              <button
                key={step.id}
                type="button"
                className={`creator-stepper__item ${isCurrent ? 'is-current' : ''} ${
                  isComplete ? 'is-complete' : ''
                } ${!isAccessible ? 'is-locked' : ''} ${
                  isAccessible && !isCurrent && !isComplete ? 'is-open' : ''
                }`}
                onClick={() => handleGoToStep(index)}
                disabled={!isAccessible}
              >
                <span className="creator-stepper__index">{index + 1}</span>
                <div className="creator-stepper__copy">
                  <strong>{step.title}</strong>
                  <span>
                    {isCurrent ? 'Current' : isComplete ? 'Done' : isAccessible ? 'Available' : 'Locked'}
                  </span>
                </div>
              </button>
            )
          })}
        </section>

        <section className="creator-summary">
          <p className="creator-summary__label">Current Build</p>
          <div className="creator-summary__chips">
            <span>
              <strong>Origin</strong> {originSummaryValue}
            </span>
            <span>
              <strong>Calling</strong> {selectedCalling?.name || 'Not chosen'}
            </span>
            <span>
              <strong>Attr</strong> {remainingPoints} left
            </span>
            <span>
              <strong>Skills</strong> {remainingSkillPoints} left
            </span>
          </div>
        </section>
      </section>

      <div className="creator-stack">{stepContent}</div>

      <section className="creator-submit">
        <div>
          <p>
            {currentStepMeta.id === 'review'
              ? 'One last breath, and this name is no longer a rumor. Save the sheet, and let the sea decide what survives it.'
              : 'The flow is staged so new players can stay simple while island-born builds open deeper nuance.'}
          </p>
          {saveMessage ? <strong>{saveMessage}</strong> : null}
        </div>

        <div className="creator-submit__actions">
          {currentStep > 0 ? (
            <button
              type="button"
              className="creator-submit__secondary"
              onClick={handlePreviousStep}
              disabled={isSaving}
            >
              Back
            </button>
          ) : null}

          {currentStepMeta.id !== 'review' ? (
            <div className="creator-submit__primary">
              <button type="button" onClick={handleNextStep} disabled={!canGoNext}>
                Next Step
              </button>
              {!canGoNext ? <p className="creator-submit__hint">{actionHint}</p> : null}
            </div>
          ) : (
            <div className="creator-submit__primary">
              <button
                type="button"
                onClick={handleSaveCharacter}
                disabled={!validations.review || isSaving}
              >
                {isSaving ? 'Saving...' : isEditing ? 'Update Character' : 'Save Character'}
              </button>
              {!validations.review ? <p className="creator-submit__hint">{actionHint}</p> : null}
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default CharacterCreator
