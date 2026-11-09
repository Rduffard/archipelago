// Isolated local acceptance harness. Never imports app.js or its configured DB connection.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const front=fileURLToPath(new URL('../..',import.meta.url));
const back=path.join(front,'../crossworld_backend');
const require=createRequire(path.join(back,'package.json'));
const uri=process.env.SA_PHASE2_TEST_MONGO_URI;
if(!uri?.startsWith('mongodb://127.0.0.1:37027/sa_phase2_'))throw Error('Only an isolated local acceptance DB is permitted');
process.env.VITE_API_BASE_URL='http://127.0.0.1:38119';
const mongoose=require('mongoose'),express=require('express'),jwt=require('jsonwebtoken');
await mongoose.connect(uri);
const User=require(path.join(back,'src/modules/users/model'));
const user=await User.create({name:'Local Character QA',email:'phase2-local@example.com',password:'isolated-fixture-not-a-login-password'});
const {JWT_SECRET}=require(path.join(back,'src/config/env'));
const token=jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:'1h'});
const app=express();app.use(require('cors')({origin:'http://127.0.0.1:38120'}));app.use(express.json());
app.use('/',require(path.join(back,'src/routes/index')));
app.use((e,_req,res,_next)=>res.status(e.statusCode??500).send({message:e.message}));
const api=app.listen(38119,'127.0.0.1');
const bootstrap=(_req,res)=>{
  res.setHeader('Content-Type','text/html');
  res.end('<!doctype html><title>Local character QA</title><script>localStorage.setItem("cw_auth",'+JSON.stringify(JSON.stringify({token,user:{_id:String(user._id),name:user.name}}))+');location.replace("/characters/new");</script>');
};
const ui=await createServer({root:front,configFile:false,plugins:[react(),{name:'isolated-fixture',configureServer(server){server.middlewares.use('/_phase2_fixture',bootstrap);}}],resolve:{preserveSymlinks:true},server:{host:'127.0.0.1',port:38120,strictPort:true},
  optimizeDeps:{include:['react','react-dom/client','react-router-dom']}});
await ui.listen();
console.log('Isolated UI ready: http://127.0.0.1:38120/_phase2_fixture');
async function close(){await ui.close();await new Promise(resolve=>api.close(resolve));await mongoose.disconnect();process.exit(0);}
process.on('SIGINT',close);process.on('SIGTERM',close);
