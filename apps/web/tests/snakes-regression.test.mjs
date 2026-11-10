import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolveMove,createQuestion,LADDERS,SNAKES,FINISH,tilePosition} from '../src/games/snakes/lib/game.ts';

const get=(name)=>readFileSync(new URL(`../src/games/snakes/${name}`,import.meta.url),'utf8');

test('matemáticas generan operaciones y resultados coherentes',()=>{
 for(const operation of ['+','-','×','÷']){
  for(let i=0;i<20;i++){
   const q=createQuestion([operation],1);
   const match=q.text.match(/^(\d+) ([+\-×÷]) (\d+) = \?$/);
   assert.ok(match,q.text);
   const [a,op,b]=[Number(match[1]),match[2],Number(match[3])];
   const computed={'+':()=>a+b,'-':()=>a-b,'×':()=>a*b,'÷':()=>a/b}[op]();
   assert.equal(q.answer,computed);
  }
 }
});
test('avanzar al acertar, retroceder al fallar, limitados a 1..100',()=>{
 assert.equal(resolveMove(15,5,true).landing,20);
 assert.equal(resolveMove(15,5,false).final,10);
 assert.equal(resolveMove(1,6,false).final,1);
 assert.equal(resolveMove(98,6,true).final,100);
 assert.equal(resolveMove(98,6,true).won,true);
 assert.equal(tilePosition(1).row,9);
 assert.equal(tilePosition(FINISH).row,0);
});
test('una escalera solo se activa al acertar',()=>{
 const [from,to]=Object.entries(LADDERS)[0].map(Number);
 assert.equal(resolveMove(from-1,1,true).final,to);
 assert.equal(resolveMove(from+1,1,false).final,from);
});
test('las serpientes hacen bajar al acertar al caer sobre su cabeza',()=>{
 const [from,to]=Object.entries(SNAKES)[0].map(Number);
 assert.equal(resolveMove(from-1,1,true).final,to);
});
test('la versión React tiene su propia interfaz y no usa HTML externo', () => {
 const app=get('App.tsx');
 const board=get('components/Board.tsx');
 const routes=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 assert.match(app,/export default function SnakesAndLadders/);
 assert.match(app,/checkAnswer\(state, answer\)/);
 assert.match(board,/function Snake\(/);
 assert.match(board,/function Ladder\(/);
 assert.match(routes,/<Snakes\/>/);
 assert.doesNotMatch(routes,/serpientes-y-escaleras-jugar\.html|iframe/i);
 assert.doesNotMatch(app, /iframe|\.html/);
 assert.equal(existsSync(new URL('../public/juegos/serpientes-y-escaleras-jugar.html',import.meta.url)),false);
});
