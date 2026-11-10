import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const load = relative => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

test('Tira Tira comparte cabecera editorial con Serpientes y Escaleras', () => {
  const app = load('src/games/tug/App.tsx');
  const theme = load('src/games/tug/snakes-parity.css');
  assert.match(app, /<h1>TIRA <span>TIRA<\/span><\/h1>/);
  assert.match(app, /className="tira-site-header"/);
  assert.match(app, /Volver a Mentes Brillantes/);
  assert.match(app, /<AudioButtons/);
  assert.match(theme, /\.tug-page \.tira-site-header/);
  assert.match(theme, /\.tug-page \.tira-setup-layout/);
});

test('preparación con ilustración + pasos y juego con dos teclados y cuerda', () => {
  const setup = load('src/games/tug/components/Setup.tsx');
  const app = load('src/games/tug/App.tsx');
  const root = load('src/App.tsx');
  for (const name of ['Tiempo','Operaciones','Números','Equipos']) assert.ok(setup.includes(name));
  assert.match(setup, /<TugScene progress=\{0\}/);
  assert.match(app, /<TeamPanel/);
  assert.match(app, /<Arena/);
  assert.match(root, /snakes-parity\.css/);
  assert.match(root, /path="\/juegos\/tira-tira"/);
  assert.match(root, /path="\/juegos\/tira-y-afloja"/);
  assert.match(root, /<Snakes\/?>/);
});

test('catálogo publica Tira Tira con ruta nueva y conserva el id', () => {
  const all = JSON.parse(load('../api/data/games.json'));
  const game = all.find(entry => entry.id === 'tira-y-afloja');
  assert.equal(game.title, 'Tira Tira');
  assert.equal(game.route, '/juegos/tira-tira');
});
