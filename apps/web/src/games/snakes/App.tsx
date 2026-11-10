import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type Dispatch, type SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import Board from './components/Board';
import adventureDoodles from './assets/adventure-doodles.svg';
import { AudioDirector } from './lib/audio';
import { OPERATIONS, createQuestion } from './lib/game';
import {
  INITIAL_OPTIONS, beginQuestion, checkAnswer, finishMove, newMatch, normaliseTeams,
  type MatchOptions, type MatchState, type PlayerIndex,
} from './lib/flow';

interface SoundSettings { musicOn: boolean; sfxOn: boolean; musicVolume: number; sfxVolume: number }
const SOUND_DEFAULT: SoundSettings = { musicOn: true, sfxOn: true, musicVolume: .32, sfxVolume: .7 };
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function Dice({ value, rolling = false }: { value: number | null; rolling?: boolean }) {
  const patterns: Record<number, number[]> = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
  };
  const active = patterns[value ?? 1];
  return <div className={`dice-face ${rolling ? 'dice-wiggle' : ''}`} aria-label={`Dado: ${value ?? 'sin lanzar'}`} role="img">
    {Array.from({ length: 9 }, (_, i) => <span key={i} className={`die-dot ${active.includes(i) ? 'visible' : ''}`} />)}
  </div>;
}

function Header({ sound, onSoundChange, onSettings, playing }: {
  sound: SoundSettings;
  onSoundChange: (change: Partial<SoundSettings>) => void;
  onSettings: () => void;
  playing: boolean;
}) {
  return <header className="site-header">
    <div className="brand-wrap">
      <div className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="60" height="60" rx="10" fill="#fdfcf8"/><path d="M14 52 35 12M26 55 47 15" stroke="#db6447" strokeWidth="4" strokeLinecap="round"/><path d="M18 44 30 47M23 34 35 37M28 25 40 28M34 17 45 20" stroke="#282c2a" strokeWidth="2.3" strokeLinecap="round"/><path d="M8 13C22 2 26 16 15 21S6 35 19 37" stroke="#497d98" strokeWidth="6.5" strokeLinecap="round"/><circle cx="8" cy="13" r="7" fill="#497d98"/><circle cx="10" cy="11" r="1.5" fill="#fff"/><path d="m16 37 4 5" stroke="#497d98" strokeWidth="2" strokeLinecap="round"/><path d="m51 7 2 4 5 2-5 2-2 4-2-4-5-2 5-2Z" fill="#e3b64f"/></svg>
      </div>
      <div className="brand-copy">
        <span className="brand-eyebrow">JUEGO EDUCATIVO · DOS EQUIPOS</span>
        <h1>SERPIENTES <span className="title-and">Y</span> ESCALERAS</h1>
        <span className="brand-accent">MATEMÁTICAS · JUEGA Y APRENDE</span>
      </div>
    </div>
    <img className="header-art" src={adventureDoodles} alt="" aria-hidden="true" />
    <div className="header-actions">
      <button type="button" className={`sound-btn ${sound.musicOn ? 'enabled' : ''}`} onClick={() => onSoundChange({ musicOn: !sound.musicOn })} aria-pressed={sound.musicOn}>♫ <span>Música</span></button>
      <button type="button" className={`sound-btn ${sound.sfxOn ? 'enabled' : ''}`} onClick={() => onSoundChange({ sfxOn: !sound.sfxOn })} aria-pressed={sound.sfxOn}>♬ <span>Sonidos</span></button>
      {playing && <button type="button" className="settings-btn" onClick={onSettings}>⚙ Configurar</button>}
    </div>
  </header>;
}

function Setup({ options, setOptions, onStart }: {
  options: MatchOptions;
  setOptions: Dispatch<SetStateAction<MatchOptions>>;
  onStart: () => void;
}) {
  const setTeam = (index: PlayerIndex, value: string) => setOptions(old => {
    const teams: [string, string] = [...old.teams];
    teams[index] = value;
    return { ...old, teams };
  });
  const toggleOp = (symbol: string) => setOptions(old => {
    if (old.operations.includes(symbol) && old.operations.length === 1) return old;
    return { ...old, operations: old.operations.includes(symbol)
      ? old.operations.filter(item => item !== symbol) : [...old.operations, symbol] };
  });
  return <section className="side-panel setup-panel">
    <span className="panel-kicker">PREPARAR PARTIDA</span>
    <h2>¡Empezamos el desafío! <span aria-hidden="true">✳</span></h2>
    <p className="panel-intro">Lanza el dado, responde y avanza. ¡Cada cálculo cuenta!</p>
    <div className="section-divider" />
    <span className="field-title">¿Quiénes juegan?</span>
    <label className="team-field team-blue"><span className="team-symbol" aria-hidden="true">🔵</span><input value={options.teams[0]} onChange={(event: ChangeEvent<HTMLInputElement>) => setTeam(0, event.target.value)} maxLength={25} aria-label="Nombre del equipo azul" placeholder="Equipo azul" /></label>
    <label className="team-field team-pink"><span className="team-symbol" aria-hidden="true">🩷</span><input value={options.teams[1]} onChange={(event: ChangeEvent<HTMLInputElement>) => setTeam(1, event.target.value)} maxLength={25} aria-label="Nombre del equipo rosa" placeholder="Equipo rosa" /></label>
    <span className="field-title">Operaciones matemáticas</span>
    <div className="op-grid">
      {OPERATIONS.map(op => {
        const selected = options.operations.includes(op.symbol);
        return <button type="button" key={op.symbol} className={`op-option ${selected ? 'selected' : ''}`} onClick={() => toggleOp(op.symbol)} aria-pressed={selected}><strong>{op.symbol}</strong><span>{op.name}</span><small>{selected ? '✓' : '+'}</small></button>;
      })}
    </div>
    <span className="field-title">Nivel de dificultad</span>
    <div className="difficulty-row" role="group" aria-label="Dificultad">
      <button type="button" className={options.digits === 1 ? 'chosen' : ''} onClick={() => setOptions(old => ({ ...old, digits: 1 }))}>🌱 Básico <small>1 cifra</small></button>
      <button type="button" className={options.digits === 2 ? 'chosen' : ''} onClick={() => setOptions(old => ({ ...old, digits: 2 }))}>🚀 Avanzado <small>2 cifras</small></button>
    </div>
    <button type="button" className="primary-btn start-btn" onClick={onStart}>▶ EMPEZAR PARTIDA <span>→</span></button>
    <p className="small-note">Dos equipos · Una pantalla · Pizarra digital</p>
  </section>;
}

function NumberPad({ answer, setAnswer, submit, disabled }: {
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  submit: () => void;
  disabled: boolean;
}) {
  const change = (key: string) => {
    if (key === '⌫') setAnswer(old => old.slice(0, -1));
    else if (key === '✓') submit();
    else if (answer.length < 5) setAnswer(old => old.length < 5 ? old + key : old);
  };
  return <div className="numberpad">
    {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(key => <button key={key} type="button" disabled={disabled} className={`${key === '⌫' ? 'key-erase' : ''} ${key === '✓' ? 'key-submit' : ''}`} onClick={() => change(key)} aria-label={key === '⌫' ? 'Borrar' : key === '✓' ? 'Comprobar respuesta' : key}>{key}</button>)}
  </div>;
}

function PlayerScore({ name, number, index, active, moves }: {
  name: string;
  number: number;
  index: PlayerIndex;
  active: boolean;
  moves: number;
}) {
  return <div className={`score-row ${active ? 'score-active' : ''} ${index === 0 ? 'score-blue' : 'score-pink'}`}>
    <span className="score-marker">{index + 1}</span>
    <div className="score-label"><strong title={name}>{name}</strong><small>{active ? '● En turno' : `${moves} tiradas`}</small></div>
    <span className="score-pos"><small>Casilla</small><strong>{number}<span>/100</span></strong></span>
  </div>;
}

function PlayPanel({ state, options, onRoll, answer, setAnswer, onSubmit, onAgain, onConfigure }: {
  state: MatchState;
  options: MatchOptions;
  onRoll: () => void;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  onAgain: () => void;
  onConfigure: () => void;
}) {
  const { status, turn, positions, dice, question, moves, winner } = state;
  const questionActive = status === 'question';
  return <section className="side-panel play-panel" aria-label="Controles de la partida">
    <div className="panel-heading"><div><span className="panel-kicker">LA CARRERA HASTA 100</span><h2>¡A por la meta! 🏆</h2></div><span className="mini-cup">100</span></div>
    <div className="score-list">{options.teams.map((team, idx) => <PlayerScore key={idx} name={team} index={idx as PlayerIndex} number={positions[idx]} active={turn === idx && status !== 'won'} moves={moves[idx]} />)}</div>
    <div className={`turn-card ${turn === 0 ? 'turn-blue' : 'turn-pink'}`}>
      <div className="turn-header"><span>AHORA JUEGA</span><strong>{options.teams[turn]}</strong></div>
      {status === 'ready' && <>
        <p className="turn-prompt">Lanza el dado para saber cuántas casillas puedes avanzar.</p>
        <div className="dice-area"><Dice value={dice} /></div>
        <button type="button" className="primary-btn roll-btn" onClick={onRoll}>🎲 LANZAR DADO <span>→</span></button>
      </>}
      {(questionActive || status === 'moving') && <>
        <div className="dice-reminder"><Dice value={dice} /><span>El dado marca <strong>{dice} {dice === 1 ? 'casilla' : 'casillas'}</strong></span></div>
        <span className="question-kicker">RESPONDE PARA MOVER TU FICHA</span>
        <div className="question-text" aria-label={`Pregunta ${question?.text ?? ''}`}>{question?.text}</div>
        <div className="answer-row"><input inputMode="numeric" type="text" pattern="[0-9]*" autoComplete="off" maxLength={5} value={answer} onChange={(event: ChangeEvent<HTMLInputElement>) => setAnswer(event.target.value.replace(/\D/g, '').slice(0, 5))} onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter') { event.preventDefault(); onSubmit(); } }} disabled={!questionActive} placeholder={questionActive ? 'Tu respuesta' : 'Moviendo la ficha…'} aria-label="Escribe el resultado" /></div>
        <NumberPad answer={answer} setAnswer={setAnswer} submit={onSubmit} disabled={!questionActive} />
      </>}
      {status === 'won' && <>
        <div className="win-cup" aria-hidden="true">🏆</div>
        <h3 className="win-heading">¡Victoria de {options.teams[winner ?? 0]}!</h3>
        <p className="win-subtitle">¡Habéis llegado a la casilla 100!</p>
        <button type="button" className="primary-btn" onClick={onAgain}>↻ JUGAR OTRA VEZ</button>
        <button type="button" className="secondary-btn" onClick={onConfigure}>⚙ Cambiar equipos y operaciones</button>
      </>}
    </div>
    <div className="sr-only" role="status" aria-live="polite">{state.notice}</div>
  </section>;
}

export default function SnakesAndLadders() {
  const [options, setOptions] = useState<MatchOptions>(INITIAL_OPTIONS);
  const [state, setState] = useState<MatchState>(() => newMatch());
  const [answer, setAnswer] = useState('');
  const [sound, setSound] = useState<SoundSettings>(SOUND_DEFAULT);
  const runId = useRef(0);
  const answering = useRef(false);
  const audio = useRef<AudioDirector | null>(null);

  useEffect(() => () => {
    runId.current += 1;
    audio.current?.dispose();
    audio.current = null;
  }, []);

  const playSound = (action: (director: AudioDirector) => void) => {
    try {
      if (!audio.current) audio.current = new AudioDirector();
      action(audio.current);
    } catch (error) {
      console.warn('El audio no está disponible; la partida continúa.', error);
    }
  };

  const updateSound = (change: Partial<SoundSettings>) => {
    const next = { ...sound, ...change };
    setSound(next);
    playSound(director => director.setPreferences(next));
  };

  const start = useCallback(() => {
    runId.current += 1;
    answering.current = false;
    setOptions(previous => normaliseTeams(previous));
    setAnswer('');
    setState(newMatch('ready'));
    playSound(director => {
      director.setPreferences(sound);
      director.startMatch();
    });
  }, [sound]);

  const configure = () => {
    runId.current += 1;
    answering.current = false;
    setAnswer('');
    setState(newMatch());
    playSound(director => director.endMatch());
  };

  const roll = () => {
    if (state.status !== 'ready') return;
    const dice = 1 + Math.floor(Math.random() * 6);
    const question = createQuestion(options.operations, options.digits);
    setAnswer('');
    setState(current => current.status === 'ready' ? beginQuestion(current, dice, question) : current);
  };

  const submit = async () => {
    if (state.status !== 'question' || answering.current || !/^\d{1,5}$/.test(answer)) return;
    answering.current = true;
    const run = runId.current;
    const { state: moving, movement, player, correct } = checkAnswer(state, answer);
    setState(moving);
    setAnswer('');
    playSound(director => {
      director.init();
      if (correct) director.playCorrect(player);
      else director.playWrong();
    });
    let location = state.positions[player];
    const direction = Math.sign(movement.landing - location);
    while (location !== movement.landing) {
      await wait(125);
      if (run !== runId.current) return;
      location += direction;
      const next = location;
      setState(old => {
        const positions: [number, number] = [...old.positions];
        positions[player] = next;
        return { ...old, positions };
      });
    }
    if (movement.special !== null) {
      await wait(350);
      if (run !== runId.current) return;
      setState(old => {
        const positions: [number, number] = [...old.positions];
        positions[player] = movement.final;
        return { ...old, positions, notice: movement.special === 'ladder' ? `¡Escalera! Subes a ${movement.final}.` : `¡Serpiente! Bajas a ${movement.final}.` };
      });
    }
    await wait(movement.special ? 850 : 450);
    if (run !== runId.current) return;
    if (movement.won) playSound(director => { director.endMatch(); director.playVictory(player); });
    setState(old => finishMove(old, movement, player));
    answering.current = false;
  };

  const playing = state.status !== 'setup';
  return <div className="snakes-page"><div className="app-shell"><div className="app-inner">
    <Link className="home-back-link" to="/#juegos">← Volver a Mentes Brillantes</Link>
    <Header sound={sound} onSoundChange={updateSound} onSettings={configure} playing={playing} />
    <main className="game-layout">
      <div className="board-column"><Board positions={state.positions} active={state.turn} preview={!playing} /></div>
      {playing
        ? <PlayPanel state={state} options={options} onRoll={roll} answer={answer} setAnswer={setAnswer} onSubmit={submit} onAgain={start} onConfigure={configure} />
        : <Setup options={options} setOptions={setOptions} onStart={start} />}
    </main>
    <footer className="footer-note"><span>🎼 Música barroca original · 60 BPM</span><span>🔔 Campanillas para los aciertos</span><span>🖐️ Pantalla táctil</span></footer>
  </div></div></div>;
}
