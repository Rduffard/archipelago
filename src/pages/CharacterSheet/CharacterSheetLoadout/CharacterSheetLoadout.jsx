import EquipmentPanel from "../../../components/equipment/EquipmentPanel";
import "./CharacterSheetLoadout.css";
export default function CharacterSheetLoadout({ character }) {
  return (
    <section className="character-sheet__panel">
      <EquipmentPanel characterId={character._id} />
      <h3>Wounds</h3>
      <ul>
        {(character.resources?.wounds?.active ?? []).map((w, i) => (
          <li key={i}>
            {w.name} · {w.severity} · {w.description}
            {w.statPenalty ? " · " + w.statPenalty : ""}
          </li>
        ))}
      </ul>
      {character.notes ? <p>{character.notes}</p> : null}
    </section>
  );
}
