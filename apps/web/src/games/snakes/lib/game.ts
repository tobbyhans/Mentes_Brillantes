/** Reglas independientes de React para poder probar el juego. */
export const FINISH = 100;
export const LADDERS: Readonly<Record<number, number>> = Object.freeze({ 3: 22, 8: 30, 17: 45, 28: 52, 36: 58, 51: 71, 62: 81, 74: 95 });
export const SNAKES: Readonly<Record<number, number>> = Object.freeze({ 39: 14, 47: 25, 59: 34, 68: 48, 80: 56, 87: 63, 93: 69, 99: 77 });

export const DEFAULT_OPTIONS = {
  teams: ['Equipo azul', 'Equipo rosa'],
  digits: 1,
  operations: ['+', '-', '×'],
};
export const OPERATIONS = [
  { symbol: '+', name: 'Sumas', color: 'sky' },
  { symbol: '-', name: 'Restas', color: 'peach' },
  { symbol: '×', name: 'Multiplicaciones', color: 'lavender' },
  { symbol: '÷', name: 'Divisiones exactas', color: 'mint' },
];

const integer = (random: () => number, low: number, high: number) => low + Math.floor(random() * (high - low + 1));

export interface SnakeQuestion { text:string; answer:number; symbol:string }
export function createQuestion(operations: string[] = DEFAULT_OPTIONS.operations, digits = 1, random: () => number = Math.random): SnakeQuestion {
  const allowed = operations.length ? operations : ['+'];
  const symbol = allowed[integer(random, 0, allowed.length - 1)];
  const bound = digits === 2 ? 99 : 9;
  const min = digits === 2 ? 10 : 1;
  let a: number;
  let b: number;
  let answer: number;
  switch (symbol) {
    case '-':
      a = integer(random, min, bound);
      b = integer(random, min, a);
      answer = a - b;
      break;
    case '×':
      a = integer(random, 1, digits === 2 ? 20 : 9);
      b = integer(random, 1, digits === 2 ? 12 : 9);
      answer = a * b;
      break;
    case '÷':
      b = integer(random, 2, digits === 2 ? 12 : 9);
      answer = integer(random, 1, digits === 2 ? 12 : 9);
      a = answer * b;
      break;
    case '+':
    default:
      a = integer(random, min, bound);
      b = integer(random, min, bound);
      answer = a + b;
      break;
  }
  return { text: `${a} ${symbol} ${b} = ?`, answer, symbol };
}

/** Filas en zigzag: 1 abajo izquierda; 10 abajo derecha; 11 encima a la derecha. */
export function tilePosition(number: number) {
  if (!Number.isInteger(number) || number < 1 || number > FINISH) throw new RangeError('Casilla fuera del tablero');
  const rowFromBottom = Math.floor((number - 1) / 10);
  const inRow = (number - 1) % 10;
  const col = rowFromBottom % 2 === 0 ? inRow : 9 - inRow;
  return { row: 9 - rowFromBottom, col, x: (col + 0.5) * 100, y: (9 - rowFromBottom + 0.5) * 100 };
}

export interface SnakeMove {landing:number;final:number;special:'ladder'|'snake'|null;won:boolean;correct:boolean;dice:number}
export function resolveMove(current:number, dice:number, correct:boolean):SnakeMove {
  if (!Number.isInteger(current) || current < 1 || current > FINISH) throw new RangeError('Posición incorrecta');
  if (!Number.isInteger(dice) || dice < 1 || dice > 6) throw new RangeError('Dado incorrecto');
  const landing = correct ? Math.min(FINISH, current + dice) : Math.max(1, current - dice);
  let final = landing;
  let special: SnakeMove['special'] = null;
  // Una respuesta incorrecta nunca activa una escalera que la recompense.
  if (correct && landing !== FINISH) {
    if (LADDERS[landing]) {
      final = LADDERS[landing];
      special = 'ladder';
    } else if (SNAKES[landing]) {
      final = SNAKES[landing];
      special = 'snake';
    }
  }
  return { landing, final, special, won: final === FINISH, correct, dice };
}
