import test from 'node:test';
import assert from 'node:assert/strict';
import { beginQuestion, checkAnswer, finishMove, newMatch, normaliseTeams } from '../src/games/snakes/lib/flow.ts';

test('el flujo React comienza sin ninguna pregunta activa', () => {
  const setup = newMatch();
  assert.equal(setup.status, 'setup');
  assert.deepEqual(setup.positions, [1, 1]);
  assert.deepEqual(setup.moves, [0, 0]);
  assert.equal(newMatch('ready').status, 'ready');
});
test('el dado lleva a la pregunta y solo permite responder mientras está activa', () => {
  const current = beginQuestion(newMatch('ready'), 3, {text:'2 + 4 = ?',answer:6,symbol:'+'});
  assert.equal(current.status, 'question');
  assert.equal(current.dice,3);
  assert.throws(() => beginQuestion(current, 4, {text:'1 + 2 = ?',answer:3,symbol:'+'}));
  assert.throws(() => checkAnswer(current,''));
  assert.throws(() => checkAnswer(newMatch('ready'),'3'));
});
test('el equipo azul avanza, activa escalera y el turno pasa al rosa', () => {
  const step = beginQuestion(newMatch('ready'), 2, {text:'1 + 2 = ?',answer:3,symbol:'+'});
  const {state, movement, player, correct} = checkAnswer(step,'3');
  assert.equal(correct,true);
  assert.equal(player,0);
  assert.equal(movement.landing,3);
  assert.equal(movement.final,22);
  const next = finishMove(state,movement,player);
  assert.deepEqual(next.positions,[22,1]);
  assert.deepEqual(next.moves,[1,0]);
  assert.equal(next.turn,1);
  assert.equal(next.status,'ready');
});
test('un error retrocede sin traspasar la primera casilla',()=>{
  const current=beginQuestion(newMatch('ready'),6,{text:'4 + 5 = ?',answer:9,symbol:'+'});
  const {state,movement,player,correct}=checkAnswer(current,'8');
  assert.equal(correct,false);
  assert.equal(movement.final,1);
  const next=finishMove(state,movement,player);
  assert.deepEqual(next.positions,[1,1]);
  assert.equal(next.turn,1);
});
test('la victoria cierra el juego cuando se llega a 100',()=>{
  const almost={...newMatch('ready'),positions:[99,50]};
  const current=beginQuestion(almost,2,{text:'2 × 3 = ?',answer:6,symbol:'×'});
  const {state,movement,player}=checkAnswer(current,'6');
  const finished=finishMove(state,movement,player);
  assert.equal(finished.status,'won');
  assert.equal(finished.winner,0);
  assert.equal(finished.positions[0],100);
});
test('los nombres vacíos usan valores válidos por defecto',()=>{
  const opts=normaliseTeams({teams:['   ','Rosas'],digits:1,operations:['+']});
  assert.deepEqual(opts.teams,['Equipo azul','Rosas']);
});
