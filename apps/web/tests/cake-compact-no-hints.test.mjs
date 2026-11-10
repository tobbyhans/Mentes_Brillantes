import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../src/games/cake/', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');

test('Come Tartas no enseña explicaciones ni sugiere la respuesta correcta al fallar', () => {
  const source = read('App.tsx');
  assert.doesNotMatch(source, /\{question\.explanation\}/);
  assert.doesNotMatch(source, /className=\{`cake-feedback/);
  assert.doesNotMatch(source, /¡Seguimos aprendiendo!|¡Muy bien! Un trocito menos\.|También puedes usar las teclas/);
  assert.match(source, /revealed && picked \? \(game\.lastCorrect \? 'right' : 'wrong'\) : ''/);
  assert.doesNotMatch(source, /revealed&&correct\?'right'/);
});

test('después de responder solo aparece la acción de pasar a la pregunta siguiente', () => {
  const source = read('App.tsx');
  assert.match(source, /game\.phase==='feedback'&&<button type="button" className="cake-primary cake-next-question" onClick=\{continueGame\}/);
  assert.match(source, /Siguiente pregunta/);
  assert.match(source, /cake-option-mark/);
  assert.match(source, /\{slices\} de 6 porciones comidas/);
});

test('el panel de preguntas y los botones tienen reglas compactas y responsive', () => {
  const css = read('Cake.css');
  assert.match(css, /v3\.2\.5/);
  assert.match(css, /\.cake-page \.cake-question-art \{height:clamp\(125px, 17vh, 165px\)/);
  assert.match(css, /\.cake-page \.cake-option \{\s*min-height:56px/);
  assert.match(css, /\.cake-page \.cake-next-question \{/);
  assert.match(css, /@media\(max-width:850px\)[\s\S]+\.cake-game-layout \.cake-quiz-panel \{grid-column:1;grid-row:1;/);
});
