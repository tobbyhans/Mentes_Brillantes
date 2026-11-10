import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';
import { isGame, JsonGameRepository } from '../src/infrastructure/repositories/JsonGameRepository.js';
import type { Game } from '../src/domain/entities/Game.js';

const game: Game = {
  id: 'come-tartas', title: 'Come Tartas', category: 'Ciencia', icon: 'cakeQuiz',
  description: 'Preguntas', status: 'available', route: '/juegos/come-tartas', order: 2,
};

test('el repositorio rechaza rutas inyectadas e identificadores incorrectos', () => {
  assert.equal(isGame(game), true);
  for (const route of ['javascript:alert(1)', '//bad.example', '/api/games', '/juegos/../../etc']) {
    assert.equal(isGame({...game, route}), false);
  }
  assert.equal(isGame({...game, id: '../config'}), false);
  assert.equal(isGame({...game, order: 1.5}), false);
  assert.equal(isGame({...game, status: 'available', route: null}), false);
});

test('el repositorio valida el archivo completo e impide IDs duplicados', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'mentes-security-'));
  try {
    const path = join(folder, 'games.json');
    const repo = new JsonGameRepository(path);
    await writeFile(path, JSON.stringify([game, game]));
    await assert.rejects(repo.findAll(), /inválido/);
    await writeFile(path, JSON.stringify([{...game, route:'https://evil.example'}]));
    await assert.rejects(repo.findAll(), /inválido/);
    await writeFile(path, JSON.stringify([game]));
    assert.equal((await repo.findAll()).length, 1);
  } finally { await rm(folder, {recursive:true,force:true}); }
});

test('la API emite CSP y cabeceras de seguridad, valida IDs y no expone errores internos', async () => {
  const server = createApp({
    findAll: async () => [game],
    findById: async (id: string) => id === game.id ? game : null,
  }).listen(0);
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Sin puerto');
    const url = `http://127.0.0.1:${address.port}`;
    const response = await fetch(`${url}/api/games`);
    assert.equal(response.status, 200);
    const csp = response.headers.get('content-security-policy') ?? '';
    assert.match(csp, /script-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-powered-by'), null);
    assert.equal((await fetch(`${url}/api/games/%3Cscript%3E`)).status, 400);
    assert.equal((await fetch(`${url}/api/games/no-existe`)).status, 404);
  } finally { server.close(); }
});
