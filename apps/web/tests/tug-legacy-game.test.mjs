import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestion, initialMatch, applyAnswer, WIN_LEAD, formatTime, winningTeam } from '../src/games/tug/lib/game.ts';

const settings = (operations, digits = 1) => ({ duration: 60, teams: ['Azul', 'Rojo'], operations, digits });

const evaluators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  compare: (a, b) => a < b ? '<' : a > b ? '>' : '=',
};

test('genera operaciones correctas y divisiones exactas para 1, 2 y 3 cifras', () => {
  for (const digits of [1, 2, 3]) {
    for (const op of Object.keys(evaluators)) {
      for (let i = 0; i < 200; i += 1) {
        const q = createQuestion(settings([op], digits));
        const operands = q.label.match(/\d+/g).map(Number);
        assert.equal(operands.length, 2);
        const [a, b] = operands;
        assert.equal(q.answer, String(evaluators[op](a, b)));
        if (op === '/') assert.equal(a % b, 0);
      }
    }
  }
});

test('los errores no suman puntos y los aciertos sí', () => {
  const config = settings(['+']);
  let match = initialMatch(config);
  match = applyAnswer({ ...match, inputs: ['99999', ''] }, 0, config);
  assert.deepEqual(match.scores, [0, 0]);
  assert.equal(match.progress, 0);
  match = applyAnswer({ ...match, inputs: [match.questions[0].answer, ''] }, 0, config);
  assert.deepEqual(match.scores, [1, 0]);
  assert.equal(match.progress, -1);
});

test('se gana con seis tirones de diferencia', () => {
  const config = settings(['+']);
  let match = initialMatch(config);
  for (let i = 0; i < WIN_LEAD; i += 1) {
    match = applyAnswer({ ...match, inputs: [match.questions[0].answer, ''] }, 0, config);
  }
  assert.equal(match.status, 'finished');
  assert.equal(match.winner, 0);
  assert.deepEqual(match.scores, [WIN_LEAD, 0]);
});

test('formato de reloj y criterios de desempate', () => {
  assert.equal(formatTime(121), '02:01');
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(null), '∞');
  assert.equal(winningTeam([3, 3], 0), null);
  assert.equal(winningTeam([5, 3], 0), 0);
  assert.equal(winningTeam([4, 5], WIN_LEAD), 1);
});
