import {useState} from 'react';
import OperationResult from './OperationResult';
export default function AuditHistory({loadPage,revision}){
  const [page,setPage]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function load(cursor){
    setBusy(true);setError('');
    try{const result=await loadPage(cursor);setPage(result);}
    catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <details><summary>Saved command history</summary><p>Character revision {revision}. Newest commands appear first; refresh to include recent changes.</p>
    <button disabled={busy} onClick={()=>load()}>Refresh history</button>
    {busy&&<p role="status">Loading history.</p>}{error&&<p role="alert">{error}</p>}
    {page?.items.length===0&&<p>No saved commands.</p>}
    {page?.items.map(item=><article key={item.id}><h3>{item.result?.type??'Saved command'}</h3><p>{item.createdAt?new Date(item.createdAt).toLocaleString():''} — {item.operationId}</p><OperationResult result={item.result}/></article>)}
    {page?.nextCursor&&<button disabled={busy} onClick={()=>load(page.nextCursor)}>Older commands</button>}
  </details>;
}
