import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {useAuth} from '../../hooks/useAuth';
import {getCharacters, request} from '../../lib/api';
import '../shared/PageShell.css';
import '../Rules2024/CharacterCreation.css';

const campaignsPath='/archipelago/campaigns';

export default function CampaignPage({mode}){
  const {campaignId}=useParams();
  const {token,setCharacters}=useAuth();
  const navigate=useNavigate();
  const [loaded,setLoaded]=useState(null);
  const [refresh,setRefresh]=useState(0);
  const [loadError,setLoadError]=useState(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const path=mode==='detail'?`${campaignsPath}/${campaignId}`:campaignsPath;

  useEffect(()=>{
    if(mode==='new')return;
    let active=true;
    Promise.all([
      request(path,{headers:{Authorization:`Bearer ${token}`}}),
      mode==='detail'?getCharacters(token):Promise.resolve([]),
      mode==='detail'?request(`${path}/sessions`,{headers:{Authorization:`Bearer ${token}`}}):Promise.resolve([]),
    ]).then(([data,characters,sessions])=>{
      if(!active)return;
      setLoaded({path,data,characters,sessions});
      setLoadError(null);
      if(mode==='detail')setCharacters(characters);
    }).catch(err=>{if(active)setLoadError({path,message:err.message});});
    return ()=>{active=false;};
  },[mode,path,token,refresh,setCharacters]);

  async function submit(event,action){
    event.preventDefault();
    const form=event.currentTarget;
    const fields=new FormData(form);
    setError('');setNotice('');setBusy(true);
    try{
      const headers={Authorization:`Bearer ${token}`};
      if(action==='register'){
        await request(`${path}/characters/${fields.get('characterId')}`,{method:'PUT',headers});
        form.reset();
        setRefresh(value=>value+1);
        setNotice('Character registered. The campaign GM can authorize its next milestone from the character sheet.');
      }else if(action==='host-session'||action==='join-session'){
        const host=action==='host-session';
        const session=await request(`${path}/sessions${host?'':'/join'}`,{method:'POST',headers,
          body:JSON.stringify(host?{name:fields.get('sessionName')}:{roomCode:fields.get('roomCode')})});
        form.reset();
        setRefresh(value=>value+1);
        setNotice(`${host?'Hosted':'Joined'} ${session.name}.`);
      }else{
        const creating=action==='create';
        const campaign=await request(creating?campaignsPath:`${campaignsPath}/join`,{
          method:'POST',headers,body:JSON.stringify(creating?{name:fields.get('name'),description:fields.get('description')}:{inviteCode:fields.get('inviteCode')}),
        });
        navigate(`/campaigns/${campaign._id}`);
      }
    }catch(err){setError(err.message);}finally{setBusy(false);}
  }

  const data=loaded?.path===path?loaded.data:null;
  const available=mode==='detail'&&data?loaded.characters.filter(character=>character.rulesVersion==='SA-CHAR-1'&&character.status==='active'&&!character.campaignId):[];
  return <main className="page-shell character-creation">
    <PageHeader eyebrow="Campaigns" title={mode==='new'?'Create a campaign':mode==='open'?'Open a campaign':data?.name??'Campaign'}/>
    <p><Link to="/campaigns/open">My campaigns</Link>{' · '}<Link to="/campaigns/new">Create a campaign</Link></p>
    {error&&<p role="alert">{error}</p>}
    {notice&&<p role="status">{notice}</p>}
    {loadError?.path===path&&mode!=='new'&&<p role="alert">{loadError.message}</p>}
    {mode==='new'&&<form className="character-creation__surface" onSubmit={event=>submit(event,'create')}>
      <fieldset disabled={busy}>
        <label>Campaign name <input name="name" minLength={2} maxLength={100} required/></label>
        <label>Description <textarea name="description" maxLength={2000}/></label>
        <button type="submit">Create campaign</button>
      </fieldset>
    </form>}
    {mode==='open'&&<>
      <section className="character-creation__surface"><h2>Your campaigns</h2>
        {data?.length>0?<ul>{data.map(campaign=><li key={campaign._id}><Link to={`/campaigns/${campaign._id}`}>{campaign.name}</Link> · {campaign.canGM?'GM':'Player'}</li>)}</ul>:data&&<p>You have no campaigns yet.</p>}
        {!data&&loadError?.path!==path&&<p role="status">Loading campaigns…</p>}
      </section>
      <form className="character-creation__surface" onSubmit={event=>submit(event,'join')}>
        <fieldset disabled={busy}><legend>Join with an invite code</legend>
          <label>Invite code <input name="inviteCode" minLength={4} maxLength={12} required autoComplete="off"/></label>
          <button type="submit">Join campaign</button>
        </fieldset>
      </form>
    </>}
    {mode==='detail'&&(data?<section className="character-creation__surface">
      <p>{data.canGM?'You are the GM.':'You are a player.'} {data.status}. {data.playerCount} of {data.maxPlayers} player seats used.</p>
      {data.description&&<p>{data.description}</p>}
      {data.canGM&&<p>Invite code <code>{data.inviteCode}</code></p>}
      <h2>{data.canGM?'Registered characters':'Your registered characters'}</h2>
      {data.characters.length?<ul>{data.characters.map(character=><li key={character._id}><Link to={`/characters/${character._id}`}>{character.name}</Link> · {character.calling}</li>)}</ul>:<p>No characters registered yet.</p>}
      {data.status==='active'&&<form onSubmit={event=>submit(event,'register')}>
        <fieldset disabled={busy||!available.length}>
          <legend>Register your character</legend>
          <label>Unassigned character <select name="characterId" defaultValue="" required>
            <option value="">Choose a character</option>{available.map(character=><option key={character._id} value={character._id}>{character.name}</option>)}
          </select></label>
          <button type="submit">Register character</button>
        </fieldset>
        {!available.length&&<p><Link to="/characters/new">Create a character</Link> or open your roster.</p>}
      </form>}
      <h2>Campaign sessions</h2>
      {loaded.sessions.length?<ul>{loaded.sessions.map(session=><li key={session._id}>
        {session.name} · {session.status}{session.joined?' · joined':''}{session.host&&<> · Room code <code>{session.roomCode}</code></>}
      </li>)}</ul>:<p>No sessions yet.</p>}
      {data.status==='active'&&data.canGM&&<form onSubmit={event=>submit(event,'host-session')}>
        <fieldset disabled={busy}><legend>Host a session</legend>
          <label>Session name <input name="sessionName" maxLength={100} required/></label>
          <button type="submit">Host session</button>
        </fieldset>
      </form>}
      {data.status==='active'&&<form onSubmit={event=>submit(event,'join-session')}>
        <fieldset disabled={busy}><legend>Join a session</legend>
          <label>Room code <input name="roomCode" minLength={4} maxLength={12} required autoComplete="off"/></label>
          <button type="submit">Join session</button>
        </fieldset>
      </form>}
    </section>:loadError?.path!==path&&<p role="status">Loading campaign…</p>)}
  </main>;
}
