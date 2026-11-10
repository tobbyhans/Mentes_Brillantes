import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Picture from './Picture';
import CakeVisual from './CakeVisual';
import CakeMascot from './CakeMascot';
import { AGE_OPTIONS, type AgeGroup } from './questions.ts';
import { chooseCakeAnswer, currentQuestion, newCakeGame, nextCakeQuestion, slicesInCake, SLICES_PER_CAKE, type CakeGame } from './game.ts';
import './Cake.css';

function playSound(correct:boolean, enabled:boolean) {
  if (!enabled || typeof window==='undefined') return;
  try {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const ctx = new AudioContextConstructor();
    const frequencies = correct ? [660, 880, 1046] : [440, 360];
    frequencies.forEach((frequency, i) => {
      const start = ctx.currentTime + i*.105;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value=frequency;
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(.065,start+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,start+.24);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start); oscillator.stop(start+.25);
    });
    window.setTimeout(()=>{void ctx.close().catch(()=>{});}, frequencies.length*110+450);
  } catch { /* El sonido es opcional; nunca interrumpe el juego. */ }
}

export default function CakeGamePage() {
  const [age,setAge] = useState<AgeGroup>('4-6');
  const [game,setGame] = useState<CakeGame|null>(null);
  const [sounds,setSounds] = useState(true);
  const answerLock = useRef(false);
  const question = game ? currentQuestion(game) : null;
  const slices = game ? slicesInCake(game) : 0;
  const completedCake = game?.phase==='feedback' && game.lastCorrect && slices===SLICES_PER_CAKE;

  const start = () => {answerLock.current=false;setGame(newCakeGame(age));};
  const select = (index:number) => {
    if (answerLock.current || !game || game.phase!=='question' || !question) return;
    answerLock.current=true;
    const next=chooseCakeAnswer(game,index);
    setGame(next);
    playSound(next.lastCorrect===true,sounds);
  };
  const continueGame = () => {
    if (!game || game.phase!=='feedback') return;
    answerLock.current=false;
    setGame(nextCakeQuestion(game));
  };
  const goToSelection = () => {answerLock.current=false;setGame(null);};

  const handleKeys = useCallback((event:KeyboardEvent) => {
    if (!game || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target instanceof Element && event.target.closest('button, input, textarea, select, a')) return;
    if (game.phase==='question' && ['1','2','3'].includes(event.key)) select(Number(event.key)-1);
    if (game.phase==='feedback' && event.key==='Enter') continueGame();
  // select and continueGame are based on current render state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[game,sounds]);
  useEffect(()=>{window.addEventListener('keydown',handleKeys);return()=>window.removeEventListener('keydown',handleKeys);},[handleKeys]);

  return <div className="cake-page">
    <div className="cake-shell">
      <div className="cake-topline"><Link to="/#juegos" className="cake-back">← Volver a Mentes Brillantes</Link><span className="cake-mini">CIENCIA · NATURALEZA · JUEGA Y APRENDE</span></div>
      <header className="cake-header">
        <div className="cake-brand"><div className="cake-logo" aria-hidden="true"><span>🍰</span></div><div><span className="cake-overline">JUEGO EDUCATIVO · PREGUNTAS CON DIBUJOS</span><h1>COME <span>TARTAS</span></h1><p>¡Aprende un poquito y disfruta cada porción!</p></div></div>
        <div className="cake-header-actions"><button type="button" className={`cake-sound ${sounds?'active':''}`} aria-pressed={sounds} onClick={()=>setSounds(!sounds)}>{sounds?'♫':'♪'} Sonidos {sounds?'●':'○'}</button>{game&&<button type="button" className="cake-outline-button" onClick={goToSelection}>⚙ Cambiar edad</button>}</div>
      </header>
      {!game ? <main className="cake-start-layout">
        <section className="cake-intro-card" aria-labelledby="cake-welcome-title"><div className="cake-kicker">EL RETO MÁS DULCE</div><h2 id="cake-welcome-title">¡Una aventura llena de descubrimientos!</h2><p>Responde, gana puntos y come porciones de tarta. Cada seis aciertos completarás una tarta y desbloquearás una sorpresa.</p><div className="cake-intro-art"><CakeVisual eaten={0}/><CakeMascot/><span className="cake-doodle a" aria-hidden="true">✳</span><span className="cake-doodle b" aria-hidden="true">♡</span><span className="cake-doodle c" aria-hidden="true">✦</span></div><div className="cake-intro-footer"><span>✓ 3 opciones por pregunta</span><span>✓ Sin límite de tiempo</span></div></section>
        <section className="cake-setup-card" aria-labelledby="cake-age-title"><span className="cake-kicker">PREPARAR PARTIDA</span><h2 id="cake-age-title">¿Qué edad tienes?</h2><p>Elige tu nivel. Todas las preguntas tienen dibujos y tres respuestas posibles.</p><div className="cake-age-options">{AGE_OPTIONS.map(option=><button type="button" key={option.id} aria-pressed={age===option.id} className={`cake-age-card ${age===option.id?'selected':''}`} onClick={()=>setAge(option.id)}><span className="cake-age-emoji" aria-hidden="true">{option.emoji}</span><span className="cake-age-body"><strong>{option.years}</strong><span className="cake-age-name">{option.label}</span><small>{option.detail}</small></span><span className="cake-radio" aria-hidden="true">{age===option.id?'✓':''}</span></button>)}</div><button className="cake-primary" onClick={start}>▶ ¡EMPEZAR A JUGAR! <span aria-hidden="true">→</span></button><p className="cake-setup-note">🍓 Puedes jugar a tu ritmo · Sin reloj · Sin perder puntos por fallar</p></section>
      </main> : question && <main className="cake-game-layout">
        <aside className="cake-progress-panel" aria-label="Tus logros y tus tartas">
          <div className="cake-progress-heading"><span className="cake-kicker">TU AVENTURA DULCE</span><h2>¡A por otra tarta! <span aria-hidden="true">🏆</span></h2></div>
          <div className="cake-scoreboard"><div><span>⭐ Puntos</span><strong>{game.score}</strong></div><div><span>🍰 Tartas</span><strong>{game.cakes}</strong></div><div><span>✓ Aciertos</span><strong>{game.correct}</strong></div></div>
          <div className="cake-plate"><div className="cake-feast"><CakeMascot eating={game.phase==='feedback' && game.lastCorrect===true}/><CakeVisual eaten={slices} celebrate={Boolean(completedCake)}/></div><div className="cake-cake-label">{completedCake?'¡Una tarta más para tu colección!':'¡Come las 6 porciones!'}</div><div className="cake-slices" role="progressbar" aria-valuenow={slices} aria-valuemin={0} aria-valuemax={6} aria-label="Porciones comidas">{Array.from({length:6},(_,i)=><span key={i} className={i<slices?'eaten':''}/>)}</div><p>{slices} de 6 porciones comidas</p></div>
          <section className="cake-achievements"><h3>Mis recompensas</h3>{game.rewards.length?<div className="cake-reward-list">{game.rewards.map(reward=><div className="cake-reward" key={reward.id} title={reward.detail}><span aria-hidden="true">{reward.emoji}</span><span>{reward.title}</span></div>)}</div>:<div className="cake-no-reward">🎁 Tu primera sorpresa aparece al completar una tarta.</div>}</section>
        </aside>
        <section className="cake-quiz-panel" aria-labelledby="cake-question-heading">
          <div className="cake-quiz-top"><div><span className="cake-kicker">PREGUNTA {game.questionCursor+1} · {question.topic.toUpperCase()}</span><h2 id="cake-question-heading">¡Piensa y elige!</h2></div><span className="cake-level-tag">NIVEL {game.level}</span></div>
          <div className="cake-question-art"><Picture name={question.picture}/><span className="cake-art-star" aria-hidden="true">✳</span></div>
          <h3 className="cake-question-text">{question.prompt}</h3>
          <div className="cake-answer-options" role="group" aria-label="Elige una de las tres respuestas">{question.choices.map((choice,index)=>{
            const revealed=game.phase==='feedback';
            const picked=game.answerIndex===index;
            // No mostramos explicaciones ni revelamos la opción correcta al equivocarse.
            // Únicamente identificamos la respuesta que ha pulsado el jugador.
            const selectionState = revealed && picked ? (game.lastCorrect ? 'right' : 'wrong') : '';
            return <button type="button" key={`${question.id}-${index}`} className={`cake-option ${selectionState}`} disabled={revealed} aria-label={`Respuesta ${index+1}: ${choice}${revealed&&picked?(game.lastCorrect?", acertada":", fallada"):""}`} onClick={()=>select(index)}><span className="cake-option-number">{index+1}</span><span>{choice}</span><span className="cake-option-mark" aria-hidden="true">{revealed&&picked?(game.lastCorrect?'✓':'×'):''}</span></button>;
          })}</div>
          {game.phase==='feedback'&&<button type="button" className="cake-primary cake-next-question" onClick={continueGame}>Siguiente pregunta <span aria-hidden="true">→</span></button>}
        </section>
      </main>}
      <footer className="cake-footer">MENTES BRILLANTES <span>✳</span> CREA · EXPERIMENTA · JUEGA</footer>
    </div>
  </div>;
}
