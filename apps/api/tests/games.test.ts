import test from 'node:test';
import assert from 'node:assert/strict';
import { GetGames } from '../src/application/use-cases/GetGames.js';
import { GetGameById } from '../src/application/use-cases/GetGameById.js';
import { JsonGameRepository } from '../src/infrastructure/repositories/JsonGameRepository.js';
import { createApp } from '../src/app.js';
const repo = new JsonGameRepository();
test('catálogo JSON: nueve juegos y dos disponibles en Matemáticas', async () => {
  const games = await new GetGames(repo).execute();
  assert.equal(games.length, 9);
  assert.deepEqual((await new GetGames(repo).execute('Matemáticas')).filter(g=>g.status==='available').map(g=>g.id), ['serpientes-y-escaleras','tira-y-afloja']);
});
test('GetGameById devuelve juego o null', async () => {
  assert.equal((await new GetGameById(repo).execute('tira-y-afloja'))?.category,'Matemáticas');
  assert.equal(await new GetGameById(repo).execute('no-existe'), null);
});
test('API: lista, detalle, filtro y respuestas 404/400', async () => {
  const server=createApp(repo).listen(0);
  try {
    const address=server.address();
    if(!address || typeof address==='string') throw new Error('Servidor no disponible');
    const url=`http://127.0.0.1:${address.port}`;
    const list=await fetch(`${url}/api/games?category=Matem%C3%A1ticas`);
    assert.equal(list.status,200);
    assert.equal((await list.json()).count,2);
    assert.equal((await fetch(`${url}/api/games/tira-y-afloja`).then(r=>r.json())).data.id,'tira-y-afloja');
    assert.equal((await fetch(`${url}/api/games/inexistente`)).status,404);
    assert.equal((await fetch(`${url}/api/games?category=Inv%C3%A1lido`)).status,400);
  } finally { server.close(); }
});
