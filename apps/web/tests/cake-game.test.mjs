import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AGE_OPTIONS, QUESTION_BANKS } from '../src/games/cake/questions.ts';
import { CAKE_BONUS, POINTS_PER_ANSWER, SLICES_PER_CAKE, chooseCakeAnswer, currentQuestion, newCakeGame, nextCakeQuestion, slicesInCake } from '../src/games/cake/game.ts';

const root = new URL('../src/', import.meta.url);
const src = path => readFileSync(new URL(path,root), 'utf8');

test('hay tres rangos de edad con 15 preguntas originales de tres opciones', () => {
 assert.deepEqual(AGE_OPTIONS.map(x=>x.id),['4-6','7-9','10-12']);
 for (const { id } of AGE_OPTIONS) {
  const bank=QUESTION_BANKS[id];
  assert.equal(bank.length,15);
  assert.equal(new Set(bank.map(x=>x.id)).size,15);
  for(const question of bank) {
   assert.equal(question.choices.length,3);
   assert.ok(question.correctIndex>=0 && question.correctIndex<3);
   assert.ok(question.picture && question.explanation && question.prompt && question.topic);
  }
 }
});
test('acierto suma puntos y retira una porción, sin perder puntos al fallar', () => {
 let state=newCakeGame('7-9');
 let miss=(currentQuestion(state).correctIndex+1)%3;
 state=chooseCakeAnswer(state,miss);
 assert.equal(state.score,0);assert.equal(state.wrong,1);assert.equal(slicesInCake(state),0);
 assert.strictEqual(chooseCakeAnswer(state,currentQuestion(state).correctIndex),state,'no acepta doble respuesta');
 state=nextCakeQuestion(state);
 state=chooseCakeAnswer(state,currentQuestion(state).correctIndex);
 assert.equal(state.score,POINTS_PER_ANSWER);assert.equal(state.correct,1);assert.equal(slicesInCake(state),1);
});
test('se completa una tarta a las seis respuestas, se desbloquean recompensas y se sube de nivel', () => {
 let state=newCakeGame('4-6');
 for(let i=0;i<6;i++) {
  state=chooseCakeAnswer(state,currentQuestion(state).correctIndex);
  if(i<5)state=nextCakeQuestion(state);
 }
 assert.equal(state.cakes,1);assert.equal(state.level,2);assert.equal(state.correct,SLICES_PER_CAKE);
 assert.equal(state.score,6*POINTS_PER_ANSWER+CAKE_BONUS);
 assert.equal(state.earnedReward?.id,'first-cake');
 assert.equal(slicesInCake(state),6);
 state=nextCakeQuestion(state);
 assert.equal(slicesInCake(state),0);
 for(let i=6;i<18;i++) {
  state=chooseCakeAnswer(state,currentQuestion(state).correctIndex);
  if(i<17)state=nextCakeQuestion(state);
 }
 assert.equal(state.cakes,3);assert.equal(state.level,4);
 assert.deepEqual(state.rewards.map(r=>r.id),['first-cake','nature-star','master-chef']);
});
test('el juego continúa sin cronómetro, incluso tras agotar el banco de preguntas', () => {
 let state=newCakeGame('10-12');
 const first=currentQuestion(state).id;
 for(let i=0;i<QUESTION_BANKS['10-12'].length;i++) {
  state=chooseCakeAnswer(state,currentQuestion(state).correctIndex);
  state=nextCakeQuestion(state);
 }
 assert.equal(currentQuestion(state).id,first);
 assert.ok(!('secondsLeft' in state));
 assert.ok(state.level>1);
});
test('la navegación y el catálogo de la API incluyen Come Tartas como juego React', () => {
 const routes=src('App.tsx');
 const cake=src('games/cake/App.tsx');
 const catalog=JSON.parse(readFileSync(new URL('../../api/data/games.json',import.meta.url),'utf8'));
 const game=catalog.find(game=>game.id==='come-tartas');
 assert.ok(game);
 assert.equal(game.status,'available');
 assert.equal(game.route,'/juegos/come-tartas');
 assert.match(routes,/path="\/juegos\/come-tartas" element=\{<Cake\/>\}/);
 assert.match(cake,/from '\.\/game\.ts'/);
 assert.match(cake,/CakeVisual/);
 assert.doesNotMatch(cake,/iframe|\.html/);
});
