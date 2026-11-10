import { resolveMove, type SnakeMove, type SnakeQuestion } from './game.ts';

/** Estado y transiciones puras: ningún componente React interviene en las reglas. */
export type PlayerIndex = 0 | 1;
export type MatchPhase = 'setup' | 'ready' | 'question' | 'moving' | 'won';
export interface MatchOptions {
  teams: [string, string];
  digits: 1 | 2;
  operations: string[];
}
export interface MatchState {
  status: MatchPhase;
  positions: [number, number];
  moves: [number, number];
  turn: PlayerIndex;
  dice: number | null;
  question: SnakeQuestion | null;
  winner: PlayerIndex | null;
  notice: string;
}
export const INITIAL_OPTIONS: MatchOptions = {
  teams: ['Equipo azul', 'Equipo rosa'],
  digits: 1,
  operations: ['+', '-', '×'],
};
export function newMatch(status: 'setup' | 'ready' = 'setup'): MatchState {
  return { status, positions: [1, 1], moves: [0, 0], turn: 0, dice: null, question: null, winner: null, notice: '' };
}
export function beginQuestion(state: MatchState, dice: number, question: SnakeQuestion): MatchState {
  if (state.status !== 'ready') throw new Error('El dado solo se puede lanzar al comenzar el turno');
  if (!Number.isInteger(dice) || dice < 1 || dice > 6) throw new RangeError('Dado no válido');
  return { ...state, status: 'question', dice, question, notice: `Ha salido un ${dice}.` };
}
export interface AnswerResolution {
  state: MatchState;
  movement: SnakeMove;
  player: PlayerIndex;
  correct: boolean;
  answer: number;
}
export function checkAnswer(state: MatchState, input: string): AnswerResolution {
  if (state.status !== 'question' || state.dice === null || state.question === null) {
    throw new Error('No hay ninguna pregunta pendiente');
  }
  if (!/^\d{1,5}$/.test(input)) throw new Error('Introduce una respuesta numérica');
  const player = state.turn;
  const correct = Number(input) === state.question.answer;
  const movement = resolveMove(state.positions[player], state.dice, correct);
  const moves: [number, number] = [...state.moves];
  moves[player] += 1;
  const notice = correct
    ? `¡Correcto! Avanzas ${state.dice} casillas.`
    : `La respuesta correcta era ${state.question.answer}. Retrocedes ${state.dice} casillas.`;
  return { state: { ...state, status: 'moving', moves, notice }, movement, player, correct, answer: state.question.answer };
}
export function finishMove(state: MatchState, movement: SnakeMove, player: PlayerIndex): MatchState {
  if (state.status !== 'moving') throw new Error('No hay un movimiento activo');
  const positions: [number, number] = [...state.positions];
  positions[player] = movement.final;
  if (movement.won) {
    return { ...state, positions, winner: player, status: 'won', question: null, dice: null, notice: '¡Partida terminada!' };
  }
  return {
    ...state, positions, status: 'ready', turn: player === 0 ? 1 : 0,
    question: null, dice: null,
  };
}
export function normaliseTeams(options: MatchOptions): MatchOptions {
  return {
    ...options,
    teams: [options.teams[0].trim() || 'Equipo azul', options.teams[1].trim() || 'Equipo rosa'],
  };
}
