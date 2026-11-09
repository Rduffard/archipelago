// Browser acceptance adapter only. Uses the actual handlers/engine and in-memory
// persistence. Never imports app.js, model.js, DB config, Mongoose or MongoDB.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import {build} from '../../../crossworld_backend/tests/helpers/phase2.mjs';
import {campaignStore} from '../../../crossworld_backend/tests/helpers/campaign-store.mjs';
const front=fileURLToPath(new URL('../..',import.meta.url)),back=path.join(front,'../crossworld_backend'),require=createRequire(path.join(back,'package.json'));
const express=require('express'),rules=require(path.join(back,'src/modules/archipelago/characters/rules2024'));
const actors={
  gm:{_id:'aaaaaaaaaaaaaaaaaaaaaaaa',name:'Local Memory GM',email:'memory-gm@example.invalid'},
  player:{_id:'bbbbbbbbbbbbbbbbbbbbbbbb',name:'Local Memory Player',email:'memory-player@example.invalid'},
};
let records=[],receipts=[],treatments=[],queue=Promise.resolve();
const campaignFixture=campaignStore(()=>records),Campaign=campaignFixture.Campaign;
const matches=(c,q)=>Object.entries(q).every(([k,v])=>k==='$or'?v.some(part=>matches(c,part)):v?.$lt!==undefined?String(c[k])<String(v.$lt):String(k.split('.').reduce((a,p)=>a?.[p],c))===String(v));
const query=fn=>({session(){return this;},select(){return this;},sort(){return this;},limit(n){this.n=n;return this;},async lean(){const result=fn();return structuredClone(Array.isArray(result)&&this.n?result.slice(0,this.n):result);}});
const Character={
  db:{startSession:async()=>({async withTransaction(fn){let release;const before=queue;queue=new Promise(resolve=>{release=resolve;});await before;const snapshot=structuredClone({records,receipts,treatments,campaigns:campaignFixture.campaigns});try{return await fn();}catch(error){({records,receipts,treatments}=snapshot);campaignFixture.campaigns=snapshot.campaigns;throw error;}finally{release();}},endSession:async()=>{}})},
  ...campaignFixture.Character,
  countDocuments:async q=>records.filter(c=>matches(c,q)).length,
  create:async c=>{if(c.creationRequest&&records.some(r=>r.owner===c.owner&&r.creationRequest?.operationId===c.creationRequest.operationId))throw Object.assign(new Error('Duplicate creation operation'),{code:11000});const value={...JSON.parse(JSON.stringify(c)),_id:c._id?String(c._id):randomBytes(12).toString('hex'),campaignId:null,status:'active',createdAt:c.createdAt??new Date().toISOString()};records.push(value);return structuredClone(value);},
  findOne:q=>query(()=>records.find(c=>matches(c,q))??null),
  findOneAndUpdate:(q,u)=>query(()=>{const c=records.find(c=>matches(c,q));if(!c)return null;Object.assign(c,structuredClone(u.$set));return c;}),
};
const Receipt={find:q=>query(()=>receipts.filter(c=>matches(c,q)).sort((a,b)=>String(b._id).localeCompare(String(a._id)))),findOne:q=>query(()=>receipts.find(c=>matches(c,q))??null),create:async values=>receipts.push(...structuredClone(values).map(v=>({...v,_id:(receipts.length+1).toString(16).padStart(24,'0'),createdAt:new Date().toISOString()})))};
const Treatment={init:async()=>{},findOne:q=>query(()=>treatments.find(c=>matches(c,q))??null),create:async values=>treatments.push(...structuredClone(values))};
const api=express();api.use(require('cors')({origin:'http://127.0.0.1:38130'}));api.use(express.json());
api.use((req,res,next)=>{
  if(req.path.startsWith('/archipelago/system/'))return next();
  const role=Object.keys(actors).find(key=>req.headers.authorization==='Bearer local-memory-'+key);
  if(!role)return res.status(401).send({message:'Local fixture authentication required'});
  req.user=actors[role];next();
});
api.get('/users/me',(req,res)=>res.send(req.user));
const campaignApi=require(path.join(back,'src/modules/archipelago/campaigns/controller')).handlers(Campaign,Character);
api.get('/archipelago/campaigns',campaignApi.list);api.post('/archipelago/campaigns',campaignApi.create);
api.post('/archipelago/campaigns/join',campaignApi.join);api.get('/archipelago/campaigns/:campaignId',campaignApi.open);
api.put('/archipelago/campaigns/:campaignId/characters/:characterId',campaignApi.register);
const sessionApi=require(path.join(back,'src/modules/archipelago/sessions/controller')).handlers(Campaign,campaignFixture.Session);
api.get('/archipelago/campaigns/:campaignId/sessions',sessionApi.list);
api.post('/archipelago/campaigns/:campaignId/sessions',sessionApi.create);
api.post('/archipelago/campaigns/:campaignId/sessions/join',sessionApi.join);
api.use('/archipelago/system',require(path.join(back,'src/modules/archipelago/system/routes')));
const handlers=rules.handlers(Character,Campaign),base='/archipelago/characters';
api.get(base,(req,res)=>res.send(records.filter(c=>c.owner===req.user._id).map(rules.decorate)));api.post(base,handlers.create);api.post(base+'/preview',handlers.createPreview);
api.get(base+'/:characterId',handlers.get);api.post(base+'/:characterId/preview',handlers.preview);
api.post(base+'/:characterId/commands',require(path.join(back,'src/modules/archipelago/characters/commands')).handler(Character,Receipt,Treatment,Campaign));
api.get(base+'/:characterId/commands',require(path.join(back,'src/modules/archipelago/characters/audit')).handler(Character,Receipt,Campaign));
api.use(require(path.join(back,'src/core/middleware/errorHandler')));
const listener=api.listen(38129,'127.0.0.1');
process.env.VITE_API_BASE_URL='http://127.0.0.1:38129';
function bootstrap(res,destination,role){
  const session={user:actors[role],token:'local-memory-'+role};
  res.setHeader('Content-Type','text/html');
  res.end('<!doctype html><title>In-memory character QA</title><script>localStorage.setItem("cw_auth",'+JSON.stringify(JSON.stringify(session))+');location.replace('+JSON.stringify(destination)+');</script>');
}
const fixture=async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1:38130');
  const role=url.searchParams.get('role')??'gm';
  if(!Object.hasOwn(actors,role)){res.statusCode=400;return res.end('Choose the GM or player fixture');}
  if(url.pathname==='/_phase2_memory_campaigns')return bootstrap(res,role==='gm'?'/campaigns/new':'/campaigns/open',role);
  if(url.pathname==='/_phase2_memory_theme'){
    const mode=url.searchParams.get('mode'),destination=url.searchParams.get('returnTo')??'/_phase2_memory';
    if(!['default','light'].includes(mode)||!/^\/(?:characters\/(?:new|[a-f0-9]{24})|_phase2_memory)$/.test(destination)){res.statusCode=400;return res.end('Choose a local fixture destination and supported theme');}
    res.setHeader('Content-Type','text/html');return res.end('<!doctype html><title>Fixture theme</title><script>localStorage.setItem("cw_theme",'+JSON.stringify(JSON.stringify({theme:mode}))+');location.replace('+JSON.stringify(destination)+');</script>');
  }
  if(url.pathname==='/_phase2_memory_new')return bootstrap(res,'/characters/new',role);
  if(url.pathname==='/_phase2_memory_seed'){
    try{
      const calling=url.searchParams.get('calling')??'tidecaller',level=Number(url.searchParams.get('level')??19),pathId=url.searchParams.get('path')??undefined;
      if(!Number.isInteger(level)||level<1||level>20)throw Error('Fixture level must be 1-20');
      const b=build(calling,level,pathId),c=await Character.create({...b.character,name:'Memory QA '+calling+' '+level,owner:actors[role]._id});return bootstrap(res,'/characters/'+c._id,role);
    }catch(error){res.statusCode=400;return res.end(error.message);}
  }
  res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>In-memory character QA</title><h1>In-memory character QA</h1><p>No MongoDB connection. Reloading a browser page retains server memory; stopping this harness discards fixtures.</p><p><a href="/_phase2_memory_campaigns">Create campaign as GM</a> · <a href="/_phase2_memory_campaigns?role=player">Open campaigns as player</a></p><p><a href="/_phase2_memory_seed?role=player&calling=doctor&level=1">Seed player Doctor</a></p><a href="/_phase2_memory_new">Actual blank creator</a><p><a href="/_phase2_memory_seed?calling=tidecaller&level=19&path=memory-echo">Seed Tidecaller 19</a></p><p><a href="/_phase2_memory_seed?calling=shipwright&level=20&path=sparkwrite-aetherist">Seed Sparkwrite 20</a></p><ul>'+records.map(c=>'<li>'+c.name+' - '+c._id+' <a href="/characters/'+c._id+'">Open saved sheet</a></li>').join('')+'</ul>');
};
const ui=await createServer({root:front,configFile:false,plugins:[react(),{name:'memory-only-fixtures',configureServer(server){server.middlewares.use((req,res,next)=>{if(req.url?.startsWith('/_phase2_memory'))fixture(req,res).catch(next);else next();});}}],resolve:{preserveSymlinks:true},server:{host:'127.0.0.1',port:38130,strictPort:true},optimizeDeps:{include:['react','react-dom/client','react-router-dom']}});
await ui.listen();console.log('Memory-only UI ready: http://127.0.0.1:38130/_phase2_memory');
async function close(){await ui.close();await new Promise(resolve=>listener.close(resolve));process.exit(0);}process.on('SIGINT',close);process.on('SIGTERM',close);
