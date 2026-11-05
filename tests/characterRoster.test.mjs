import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
const server = await createServer({server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
after(() => server.close());
const {default: Roster} = await server.ssrLoadModule('/src/components/characters/CharacterRoster.jsx');
const render = characters => renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(Roster,{characters})));
test('current and historical characters use canonical resources without mutation', () => {
  for (const legacy of [{}, {derivedStats:{vitality:99,guard:99,focus:99}}]) {
    const character = {_id:'one',resources:{health:{current:0,max:30},stamina:{current:4,max:12},focus:{current:2,max:8}},...legacy};
    const before = JSON.stringify(character);
    const html = render([character]);
    for (const text of ['Health 0 / 30','Stamina 4 / 12','Focus 2 / 8']) assert.ok(html.includes(text));
    assert.equal(JSON.stringify(character),before);
  }
});
test('missing tracks and loading lists render safely', () => {
  assert.ok(render([{_id:'old',derivedStats:{vitality:99}}]).includes('Health Unavailable'));
  for (const value of [undefined,null,[]]) assert.ok(render(value).includes('No characters yet'));
});
