import LoadoutStep from "../../../../components/creator/LoadoutStep/LoadoutStep";

function LoadoutSection({
  loadout,
  onAddCustomAbility,
  onCustomAbilityChange,
  characterId,
  onRemoveCustomAbility,
}) {
  return (
    <LoadoutStep
      loadout={loadout}
      characterId={characterId}
      onCustomAbilityChange={onCustomAbilityChange}
      onAddCustomAbility={onAddCustomAbility}
      onRemoveCustomAbility={onRemoveCustomAbility}
    />
  );
}

export default LoadoutSection;
