import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestion, tilePosition, resolveMove, LADDERS, SNAKES } from '../src/games/snakes/lib/game.ts';

const constant = (n) => () => n;

test('el tablero serpentea entre filas con 100 casillas', () => {
  assert.deepEqual(tilePosition(1), {row:9,col:0,x:50,y:950});
  assert.deepEqual(tilePosition(10), {row:9,col:9,x:950,y:950});
  assert.deepEqual(tilePosition(11), {row:8,col:9,x:950,y:850});
  assert.deepEqual(tilePosition(20), {row:8,col:0,x:50,y:850});
  assert.deepEqual(tilePosition(100), {row:0,col:0,x:50,y:50});
  assert.throws(() => tilePosition(101), RangeError);
});

test('si acierta avanza exactamente la cantidad del dado', () => {
  assert.deepEqual(resolveMove(10, 5, true), { landing: 15, final: 15, special: null, won: false, correct: true, dice: 5 });
  assert.equal(resolveMove(96, 6, true).final, 100);
  assert.equal(resolveMove(96, 6, true).won, true);
});

test('si falla retrocede la cantidad del dado y nunca baja de 1', () => {
  assert.deepEqual(resolveMove(10, 4, false), { landing: 6, final: 6, special: null, won: false, correct: false, dice: 4 });
  assert.equal(resolveMove(2, 6, false).final, 1);
  assert.equal(resolveMove(8, 5, false).final, 3);
  assert.equal(resolveMove(8, 5, false).special, null, 'fallar no activa la escalera de 3');
});

test('escaleras suben y serpientes bajan tras acertar', () => {
  assert.deepEqual(resolveMove(1, 2, true).special, 'ladder');
  assert.equal(resolveMove(1, 2, true).final, 22);
  assert.equal(resolveMove(33, 6, true).final, 14);
  assert.equal(resolveMove(33, 6, true).special, 'snake');
  for (const [from, to] of Object.entries(LADDERS)) assert.ok(to > Number(from));
  for (const [from, to] of Object.entries(SNAKES)) assert.ok(to < Number(from));
});

test('preguntas matemáticas coherentes, sin decimales ni resultados negativos', () => {
  for (const symbol of ['+', '-', '×', '÷']) {
    for (const digits of [1, 2]) {
      for (let n = 0; n <= 100; n++) {
        const q = createQuestion([symbol], digits, constant(n / 101));
        const [a, b] = q.text.match(/\d+/g).map(Number);
        const expected = symbol === '+' ? a+b : symbol === '-' ? a-b : symbol === '×' ? a*b : a/b;
        assert.equal(q.answer, expected, q.text);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0);
      }
    }
  }
});

test('entradas no válidas son rechazadas', () => {
  assert.throws(() => resolveMove(0, 4, true), RangeError);
  assert.throws(() => resolveMove(10, 7, true), RangeError);
});
