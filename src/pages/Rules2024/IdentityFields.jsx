export default function IdentityFields({value,onChange,nameLabel='Character name',notesLabel='Wounds, Corruption, and session notes',storyOnly=false,hideNotes=false}){
  function field(key,next){onChange({...value,[key]:next});}
  return <>
    <label>{nameLabel} <input data-field-path="name" value={value.name??''} minLength={2} maxLength={80} onChange={e=>field('name',e.target.value)}/></label>
    <label>Pronouns <input data-field-path="pronouns" value={value.pronouns??''} maxLength={1000} onChange={e=>field('pronouns',e.target.value)}/></label>
    <label>Appearance <textarea data-field-path="appearance" value={value.appearance??''} maxLength={1000} onChange={e=>field('appearance',e.target.value)}/></label>
    {!storyOnly && <><label>Portrait URL (HTTPS, optional) <input data-field-path="portraitUrl" type="url" value={value.portraitUrl??''} maxLength={2000} onChange={e=>field('portraitUrl',e.target.value)}/></label>
    {!hideNotes&&<label>{notesLabel} <textarea data-field-path="notes" value={value.notes??''} maxLength={5000} onChange={e=>field('notes',e.target.value)}/></label>}</>}
  </>;
}
