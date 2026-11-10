export interface TugSettings {duration:number;operations:string[];digits:number;teams:string[];background:string}
export interface TugQuestion {operation:string;label:string;answer:string;compare:boolean}
export interface TugEvent {id:number;type:'correct'|'wrong'|'victory';team:number|null}
export interface TugMatch {status:'running'|'paused'|'finished'|'idle';scores:number[];inputs:string[];questions:TugQuestion[];feedback:string[];feedbackKind:string[];progress:number;secondsLeft:number|null;winner:number|null;endReason:string|null;event:TugEvent|null}
export const WIN_LEAD = 6;

export const DEFAULT_SETTINGS: TugSettings = {
  duration: 180,
  operations: ['+'],
  digits: 1,
  teams: ['Equipo azul', 'Equipo rosa'],
  background: 'classroom',
};

export const OPERATION_OPTIONS = [
  { value: '+', label: 'Suma', symbol: '+', subtitle: 'Sumar números' },
  { value: '-', label: 'Resta', symbol: '−', subtitle: 'Restar números' },
  { value: '*', label: 'Multiplicación', symbol: '×', subtitle: 'Tablas y productos' },
  { value: '/', label: 'División', symbol: '÷', subtitle: 'Divisiones exactas' },
  { value: 'compare', label: 'Comparación', symbol: '< >', subtitle: 'Mayor, menor o igual' },
];

export const BACKGROUNDS = [
  { value: 'plain', label: 'Claro', color: '#f7f9fd' },
  { value: 'classroom', label: 'Aula', color: '#e8f4ff' },
  { value: 'sky', label: 'Cielo', color: '#c8eafb' },
  { value: 'mint', label: 'Menta', color: '#d9f5eb' },
  { value: 'sunrise', label: 'Atardecer', color: '#ffe4d1' },
  { value: 'lavender', label: 'Lavanda', color: '#ece5ff' },
  { value: 'slate', label: 'Pizarra', color: '#dbe6ed' },
];

const randInt = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function formatTime(seconds:number|null) {
  if (seconds === null) return '∞';
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function limits(digits:number):[number,number] {
  if (digits === 1) return [0, 9];
  if (digits === 2) return [10, 99];
  return [100, 999];
}

function comparison(a:number, b:number) {
  if (a > b) return '>';
  if (a < b) return '<';
  return '=';
}

export function createQuestion(settings:TugSettings, previousText = ''):TugQuestion {
  const operations = settings.operations?.length ? settings.operations : ['+'];
  const [min, max] = limits(settings.digits);
  let question:TugQuestion|null=null;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const operation = operations[randInt(0, operations.length - 1)];
    let a = randInt(min, max);
    let b = randInt(min, max);
    let answer:string;
    let label:string;
    if (operation === '+') {
      answer = String(a + b);
      label = `${a} + ${b} = ?`;
    } else if (operation === '-') {
      if (a < b) [a, b] = [b, a];
      answer = String(a - b);
      label = `${a} − ${b} = ?`;
    } else if (operation === '*') {
      answer = String(a * b);
      label = `${a} × ${b} = ?`;
    } else if (operation === '/') {
      // Cociente entero y divisor dentro del intervalo configurado.
      const divisor = randInt(Math.max(1, min), max);
      const maxQuotient = Math.floor(max / divisor);
      const minQuotient = Math.max(1, Math.ceil(min / divisor));
      const quotient = randInt(minQuotient, maxQuotient);
      a = divisor * quotient;
      b = divisor;
      answer = String(quotient);
      label = `${a} ÷ ${b} = ?`;
    } else {
      // Incluimos de forma explícita casos de igualdad.
      if (Math.random() < 0.22) b = a;
      answer = comparison(a, b);
      label = `${a}  ?  ${b}`;
    }
    question = { operation, label, answer, compare: operation === 'compare' };
    if (label !== previousText) break;
  }
  return question!;
}

export function initialMatch(settings:TugSettings):TugMatch {
  return {
    status: 'running',
    scores: [0, 0],
    inputs: ['', ''],
    questions: [createQuestion(settings), createQuestion(settings)],
    feedback: ['', ''],
    feedbackKind: ['', ''],
    progress: 0,
    secondsLeft: settings.duration === 0 ? null : settings.duration,
    winner: null,
    endReason: null,
    event: null,
  };
}


export function winningTeam(scores:number[], progress:number):number|null {
  if (progress <= -WIN_LEAD) return 0;
  if (progress >= WIN_LEAD) return 1;
  if (scores[0] > scores[1]) return 0;
  if (scores[1] > scores[0]) return 1;
  return null;
}

export function applyAnswer(match:TugMatch, teamIndex:number, settings:TugSettings):TugMatch {
  if (match.status !== 'running') return match;
  const input = match.inputs[teamIndex];
  const question = match.questions[teamIndex];
  if (input.length === 0) return match;
  const correct = input === question.answer;
  const eventId = (match.event?.id || 0) + 1;
  const inputs = [...match.inputs];
  const feedback = [...match.feedback];
  const feedbackKind = [...match.feedbackKind];
  inputs[teamIndex] = '';
  if (!correct) {
    feedback[teamIndex] = 'Prueba otra vez';
    feedbackKind[teamIndex] = 'wrong';
    return { ...match, inputs, feedback, feedbackKind, event: { id: eventId, type: 'wrong', team: teamIndex } };
  }
  feedback[teamIndex] = '¡Correcto! +1 tirón';
  feedbackKind[teamIndex] = 'correct';
  const scores = [...match.scores];
  scores[teamIndex] += 1;
  const progress = Math.max(-WIN_LEAD, Math.min(WIN_LEAD, match.progress + (teamIndex === 0 ? -1 : 1)));
  const finished = Math.abs(progress) >= WIN_LEAD;
  const questions = [...match.questions];
  if (!finished) questions[teamIndex] = createQuestion(settings, question.label);
  return {
    ...match,
    inputs,
    feedback,
    feedbackKind,
    scores,
    progress,
    questions,
    status: finished ? 'finished' : 'running',
    winner: finished ? teamIndex : null,
    endReason: finished ? 'rope' : null,
    event: { id: eventId, type: finished ? 'victory' : 'correct', team: teamIndex },
  };
}
