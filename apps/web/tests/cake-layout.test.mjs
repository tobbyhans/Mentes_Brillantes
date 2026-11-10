import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../src/games/cake/', import.meta.url);
const src = name => readFileSync(new URL(name, root), 'utf8');

test('Come Tartas renderiza la tarta y el pastelero a la izquierda y las preguntas a la derecha', () => {
  const component = src('App.tsx');
  const gameStart = component.indexOf('className="cake-game-layout"');
  const game = component.slice(gameStart);
  assert.ok(gameStart >= 0);
  const progress = game.indexOf('className="cake-progress-panel"');
  const quiz = game.indexOf('className="cake-quiz-panel"');
  assert.ok(progress > 0 && quiz > progress, 'el panel de la tarta debe preceder al de preguntas');
  assert.match(game, /<CakeMascot eating=/);
  assert.match(game, /<CakeVisual eaten=\{slices\}/);
  assert.match(game, /className="cake-answer-options"/);
  assert.match(game, /question\.choices\.map/);
});

test('dos columnas en escritorio y preguntas primero en pantallas estrechas', () => {
  const css = src('Cake.css');
  assert.match(css, /\.cake-page \.cake-game-layout\s*\{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1\.04fr\)/);
  assert.match(css, /\.cake-page \.cake-game-layout \.cake-progress-panel\s*\{\s*grid-column: 1;\s*grid-row: 1;/);
  assert.match(css, /\.cake-page \.cake-game-layout \.cake-quiz-panel\s*\{\s*grid-column: 2;\s*grid-row: 1;/);
  assert.match(css, /@media \(max-width: 850px\)[\s\S]*?\.cake-game-layout \.cake-quiz-panel \{\s*grid-column:1;\s*grid-row:1;/);
});

test('la selección de edades, las recompensas y las tres opciones siguen disponibles', () => {
  const app = src('App.tsx');
  assert.match(app, /AGE_OPTIONS\.map/);
  assert.match(app, /game\.rewards\.map/);
  assert.match(app, /question\.choices\.map/);
  assert.match(app, /Sin límite de tiempo/);
});
