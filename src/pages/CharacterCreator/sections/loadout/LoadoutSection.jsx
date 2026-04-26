import LoadoutStep from '../../../../components/creator/LoadoutStep/LoadoutStep'

function LoadoutSection({
  loadout,
  onAddCustomAbility,
  onCustomAbilityChange,
  onLoadoutChange,
  onRemoveCustomAbility,
}) {
  return (
    <LoadoutStep
      loadout={loadout}
      onLoadoutChange={onLoadoutChange}
      onCustomAbilityChange={onCustomAbilityChange}
      onAddCustomAbility={onAddCustomAbility}
      onRemoveCustomAbility={onRemoveCustomAbility}
    />
  )
}

export default LoadoutSection
