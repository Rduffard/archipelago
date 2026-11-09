import {useEffect,useRef} from 'react';
export default function CommandError({message,fieldPath,conflict=false,busy=false,onRefresh}){
  const alert=useRef(null);
  useEffect(()=>{if(!message)return;const field=fieldPath?document.querySelector(`[data-field-path="${CSS.escape(fieldPath)}"]`):null;if(field){let parent=field.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}}(field??alert.current)?.focus();},[message,fieldPath]);
  if(!message)return null;
  return <div ref={alert} tabIndex={-1} role="alert" className="character-creation__error"><p>{message}</p>{fieldPath&&<p>Field: {fieldPath}</p>}{conflict&&onRefresh&&<><p>Your proposed choices are still here. Refresh saved values before submitting a new command.</p><button disabled={busy} onClick={onRefresh}>Refresh saved character and retain drafts</button></>}</div>;
}
