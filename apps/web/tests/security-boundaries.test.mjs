import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parseGame, parseGamesResponse } from '../src/api/games.ts';

const catalog = JSON.parse(readFileSync(new URL('../../api/data/games.json', import.meta.url), 'utf8'));
const valid = catalog.find(game => game.status === 'available');

test('el cliente acepta el catálogo válido y solo devuelve datos verificados', () => {
  const data = parseGamesResponse({data:catalog});
  assert.equal(data.length, 9);
  assert.equal(data.find(g => g.id === 'come-tartas')?.route, '/juegos/come-tartas');
  assert.deepEqual(parseGame({...valid, extra: 'never exposed'}), valid);
});

test('el cliente rechaza enlaces externos y scripts en las rutas', () => {
  for (const route of ['javascript:alert(1)', 'https://evil.example', '//evil.example', '/juegos/../api', '/juegos/%0afoo', '/api/games']) {
    assert.throws(() => parseGame({...valid, route}), /inválido/);
  }
});

test('el cliente rechaza objetos inesperados, identificadores manipulados y JSON malformado', () => {
  for (const id of ['../../../etc/passwd', '__proto__', 'a'.repeat(200), '']) {
    assert.throws(() => parseGame({...valid, id}), /inválido/);
  }
  assert.throws(() => parseGame({...valid, order: Infinity}), /inválido/);
  assert.throws(() => parseGame({...valid, category: 'Administración'}), /inválido/);
  assert.throws(() => parseGame({...valid, status: 'available', route:null}), /inválido/);
  assert.throws(() => parseGamesResponse({data:[valid,valid]}), /duplicados/);
  assert.throws(() => parseGamesResponse({data:{}}), /inválida/);
});

test('las ilustraciones del catálogo se entregan como imágenes y no mediante HTML inyectado', () => {
  const src = readFileSync(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /dangerouslySetInnerHTML|\.innerHTML\s*=/);
  assert.match(src, /<img src=\{illustrations\[game\.icon\]/);
  const icons = new URL('../src/assets/catalog-illustrations/', import.meta.url);
  const files = readdirSync(icons).filter(f => f.endsWith('.svg'));
  assert.equal(files.length, 10);
  for (const name of files) {
    const svg = readFileSync(new URL(name, icons), 'utf8');
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\bon\w+\s*=|javascript:/i);
  }
});
