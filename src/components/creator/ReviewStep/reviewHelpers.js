import {
  formatSystemReputationScore,
  getActiveSystemReputationEntries,
  getSystemOriginStartingReputation,
  getSystemReputationTier,
  getSystemReputationTrack,
  getSystemSpecialization,
  getSystemSpecializationNode,
} from '../../../data/archipelagoSystemSelectors'
import {
  applyAttributeBonus,
  parseAttributeBonus,
} from '../../../lib/character'

export function getReviewContext({
  attributeValues,
  blueprint,
  identity,
  progression,
  reputation,
}) {
  const callings = blueprint ? blueprint.catalogs?.callings ?? [] : []
  const origins = blueprint ? blueprint.catalogs?.origins ?? [] : []
  const originPaths = blueprint ? blueprint.catalogs?.originPaths ?? [] : []
  const calling = callings.find((entry) => entry.id === identity.callingId)
  const origin = origins.find((entry) => entry.id === identity.originId)
  const path = originPaths.find((entry) => entry.id === identity.path)
  const specialization = getSystemSpecialization(progression?.specializationPath, blueprint)
  const advancementSpent =
    specialization?.nodes
      ?.filter((node) => progression?.unlockedNodes?.includes(node.id))
      .reduce((total, node) => total + (node.cost ?? 0), 0) ?? 0
  const parsedOriginBonus = parseAttributeBonus(origin?.bonus)
  const finalAttributes = applyAttributeBonus(attributeValues, origin?.bonus)
  const activeReputation = getActiveSystemReputationEntries(
    reputation ?? getSystemOriginStartingReputation(identity.originId, blueprint),
    blueprint,
  )
  return {
    activeReputation,
    advancementSpent,
    calling,
    finalAttributes,
    origin,
    parsedOriginBonus,
    path,
    specialization,
  }
}

export function getStartingFeatures({ calling, origin, parsedOriginBonus, path }) {
  return [
    path ? { label: 'World Path', value: path.name, detail: path.description } : null,
    calling?.primaryStats?.length
      ? {
          label: 'Calling Focus',
          value: calling.primaryStats.join(' / '),
          detail: `${calling.name} leans on these attributes most heavily in play.`,
        }
      : null,
    calling?.passive
      ? {
          label: 'Calling Passive',
          value: calling.passive,
          detail: calling.passiveRule,
        }
      : null,
    calling?.starterAbility
      ? {
          label: 'Historical ability reference',
          value: calling.starterAbility,
          detail: `Not automatically granted; ability content awaits review. ${calling.starterAbilityType}. ${calling.starterAbilityRule}`,
        }
      : null,
    origin?.bonus
      ? {
          label: 'Origin Bonus',
          value: origin.bonus,
          detail: `${origin.summary} Final ${parsedOriginBonus?.label ?? 'attribute'} gains ${parsedOriginBonus?.amount ?? 0}.`,
        }
      : null,
    origin?.passive
      ? {
          label: 'Origin Passive',
          value: origin.passive,
          detail: origin.passiveRule,
        }
      : null,
    origin?.drawback
      ? {
          label: 'Origin Drawback',
          value: origin.drawback,
          detail: origin.drawbackRule,
        }
      : null,
  ].filter(Boolean)
}

export function getLoadoutItemCount(loadout) {
  return (
    (loadout?.weaponsText?.split('\n').filter(Boolean).length ?? 0) +
    (loadout?.armorText?.split('\n').filter(Boolean).length ?? 0) +
    (loadout?.techRelicsText?.split('\n').filter(Boolean).length ?? 0)
  )
}

export function getReputationEntries(activeReputation, blueprint) {
  return activeReputation.map(([trackKey, score]) => {
    const track = getSystemReputationTrack(trackKey, blueprint)
    const tier = getSystemReputationTier(score, blueprint)

    return {
      key: trackKey,
      label: track?.name ?? trackKey,
      value: formatSystemReputationScore(score),
      detail: `${tier.label}. ${tier.effect} ${track?.scope ?? ''}`.trim(),
    }
  })
}

export function getUnlockedNodeDetail(nodeIds, progression, blueprint) {
  if (!nodeIds?.length) {
    return undefined
  }

  return nodeIds
    .map((nodeId) => {
      const node = getSystemSpecializationNode(progression?.specializationPath, nodeId, blueprint)
      return node ? `${node.name}\n${node.effect}` : nodeId
    })
    .join('\n\n')
}
