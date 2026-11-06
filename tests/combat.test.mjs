import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createRequire } from 'node:module'
const require=createRequire(import.meta.url)
const {createFixture,applyCommand}=require('../../crossworld_backend/src/modules/archipelago/combat/state.js')
const server=await createServer({cacheDir:'.test-cache/combat',server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}})
after(()=>server.close())
const {CombatPanel}=await server.ssrLoadModule('/src/pages/CombatTest/CombatTestPage.jsx')
const render=state=>renderToStaticMarkup(React.createElement(CombatPanel,{encounter:state,busy:false,onCommand:()=>{}}))
test('combat panel displays authoritative state and disables spent attack',()=>{
 const state=createFixture('owner')
 assert.match(render(state),/Attack with cutlass/)
 const next=applyCommand(state,{id:'command-ui-01',expectedRevision:0,type:'attack',actor:'corsair',weapon:'cutlass',target:'enemy'},'owner',()=>1)
 const html=render(next)
 assert.match(html,/disabled="">Attack with cutlass/)
 assert.match(html,/miss/); assert.match(html,/0 damage applied/); assert.match(html,/Health 18/)
})
