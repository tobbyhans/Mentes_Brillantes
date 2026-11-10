import { QUESTION_BANKS, type AgeGroup, type CakeQuestion } from './questions.ts';

export const SLICES_PER_CAKE = 6;
export const CAKE_BONUS = 200;
export const POINTS_PER_ANSWER = 100;
export interface CakeReward { id: string; title: string; detail: string; emoji: string }
export const REWARDS: readonly { cakes: number; reward: CakeReward }[] = [
  {cakes:1,reward:{id:'first-cake',title:'Primera tarta',detail:'¡Has completado tu primera tarta!',emoji:'🍰'}},
  {cakes:2,reward:{id:'nature-star',title:'Estrella curiosa',detail:'¡Dos tartas y muchas ideas nuevas!',emoji:'⭐'}},
  {cakes:3,reward:{id:'master-chef',title:'Chef de las ideas',detail:'¡Has superado los tres primeros niveles!',emoji:'👑'}},
  {cakes:5,reward:{id:'golden-whisk',title:'Batidor de oro',detail:'¡Cinco tartas de conocimiento!',emoji:'🏅'}},
];
export type Phase = 'question' | 'feedback';
export interface CakeGame {
  age: AgeGroup;
  score: number;
  correct: number;
  wrong: number;
  cakes: number;
  level: number;
  questionCursor: number;
  phase: Phase;
  answerIndex: number | null;
  lastCorrect: boolean | null;
  earnedReward: CakeReward | null;
  rewards: CakeReward[];
}
export function newCakeGame(age: AgeGroup): CakeGame {
  if (!QUESTION_BANKS[age]) throw new Error('Nivel de edad no válido');
  return {age,score:0,correct:0,wrong:0,cakes:0,level:1,questionCursor:0,
    phase:'question',answerIndex:null,lastCorrect:null,earnedReward:null,rewards:[]};
}
export function currentQuestion(game: CakeGame): CakeQuestion {
  const bank = QUESTION_BANKS[game.age];
  // Se repite el banco tras recorrerlo: juego sin límite de tiempo ni fin obligatorio.
  return bank[game.questionCursor % bank.length];
}
export function slicesInCake(game: CakeGame): number {
  // Al conseguir la sexta respuesta correcta, la tarta se completa y se muestra 6/6 hasta continuar.
  if (game.correct > 0 && game.correct % SLICES_PER_CAKE === 0 && game.phase === 'feedback' && game.lastCorrect) return SLICES_PER_CAKE;
  return game.correct % SLICES_PER_CAKE;
}
export function chooseCakeAnswer(game: CakeGame, answerIndex: number): CakeGame {
  if (game.phase !== 'question' || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 2) return game;
  const correct = answerIndex === currentQuestion(game).correctIndex;
  if (!correct) return {...game,wrong:game.wrong+1,phase:'feedback',answerIndex,lastCorrect:false,earnedReward:null};
  const correctCount = game.correct+1;
  const cakes = Math.floor(correctCount/SLICES_PER_CAKE);
  const completedCake = cakes > game.cakes;
  const reward = completedCake ? (REWARDS.find(r => r.cakes === cakes)?.reward ?? null) : null;
  return {...game,correct:correctCount,score:game.score+POINTS_PER_ANSWER+(completedCake?CAKE_BONUS:0),cakes,level:cakes+1,
    phase:'feedback',answerIndex,lastCorrect:true,earnedReward:reward,
    rewards: reward?[...game.rewards,reward]:game.rewards};
}
export function nextCakeQuestion(game: CakeGame): CakeGame {
  if (game.phase !== 'feedback') return game;
  return {...game,questionCursor:game.questionCursor+1,phase:'question',answerIndex:null,lastCorrect:null,earnedReward:null};
}
