// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
import { useCallback, useEffect, useRef, useState } from 'react';
import Setup from './components/Setup';
import { Link } from 'react-router-dom';
import TeamPanel from './components/TeamPanel';
import Arena from './components/Arena';
import AudioButtons, { type SoundSettings } from './components/AudioButtons';
import { AudioDirector } from './lib/audio';
import { applyAnswer, DEFAULT_SETTINGS, initialMatch } from './lib/game';

const INITIAL_AUDIO: SoundSettings = { musicOn: true, sfxOn: true, musicVolume: 0.36, sfxVolume: 0.66 };
const emptyGame = {
  status: 'idle', scores: [0, 0],
  questions: [{ label: '7 + 4 = ?', answer: '11' }, { label: '9 + 6 = ?', answer: '15' }],
  inputs: ['', ''], feedback: ['', ''], feedbackKind: ['', ''], progress: 0,
  secondsLeft: 0, winner: null, endReason: null, event: null,
};

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [game, setGame] = useState(emptyGame);
  const [audioSettings, setAudioSettings] = useState(INITIAL_AUDIO);
  const [keyboardTeam, setKeyboardTeam] = useState(0);
  const endTime = useRef(null);
  const matchSettings = useRef(settings);
  // Crear el motor cuando hace falta evita reutilizar un AudioContext ya cerrado
  // tras el montaje de comprobación que realiza React StrictMode.
  const audio = useRef<AudioDirector | null>(null);
  const lastAudioEvent = useRef(null);

  useEffect(() => () => {
    audio.current?.dispose();
    audio.current = null;
  }, []);

  const withAudio = (action: (director: AudioDirector) => void) => {
    try {
      if (!audio.current) audio.current = new AudioDirector();
      action(audio.current);
    } catch (error) {
      console.warn('El audio no está disponible; el juego sigue funcionando.', error);
    }
  };

  // El canal musical y las campanillas se controlan igual que en Serpientes.
  const updateAudio = (changes: Partial<SoundSettings>) => {
    const next = { ...audioSettings, ...changes };
    setAudioSettings(next);
    withAudio(director => director.setPreferences(next));
  };

  const start = useCallback(() => {
    const sanitized = { ...settings, teams: [settings.teams[0].trim() || 'Equipo azul', settings.teams[1].trim() || 'Equipo rosa'] };
    matchSettings.current = sanitized;
    setSettings(sanitized);
    setGame(initialMatch(sanitized));
    setKeyboardTeam(0);
    lastAudioEvent.current = null;
    endTime.current = sanitized.duration === 0 ? null : Date.now() + sanitized.duration * 1000;
    withAudio(director => {
      director.setPreferences(audioSettings);
      director.startMatch();
    });
  }, [settings, audioSettings]);

  const configure = () => {
    withAudio(director => director.endMatch());
    endTime.current = null;
    setGame((prev) => ({ ...prev, status: 'idle', event: null }));
  };
  const pause = () => {
    withAudio(director => director.pauseMatch());
    setGame((prev) => prev.status === 'running' ? { ...prev, status: 'paused' } : prev);
  };
  const resume = () => {
    endTime.current = game.secondsLeft === null ? null : Date.now() + game.secondsLeft * 1000;
    withAudio(director => director.resumeMatch());
    setGame((prev) => prev.status === 'paused' ? { ...prev, status: 'running' } : prev);
  };

  useEffect(() => {
    if (game.status !== 'running' || endTime.current === null) return undefined;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime.current - Date.now()) / 1000));
      setGame((prev) => {
        if (prev.status !== 'running' || prev.secondsLeft === remaining) return prev;
        if (remaining === 0) {
          const winner = prev.scores[0] === prev.scores[1] ? null : (prev.scores[0] > prev.scores[1] ? 0 : 1);
          return { ...prev, status: 'finished', secondsLeft: 0, winner, endReason: 'time', event: { id: (prev.event?.id || 0) + 1, type: 'victory', team: winner } };
        }
        return { ...prev, secondsLeft: remaining };
      });
    }, 200);
    return () => clearInterval(timer);
  }, [game.status]);

  // Los efectos son eventos de React, nunca ocurren dentro del actualizador de estado.
  // Así evitamos duplicar sonidos cuando StrictMode comprueba funciones puras.
  useEffect(() => {
    if (!game.event || lastAudioEvent.current === game.event) return;
    lastAudioEvent.current = game.event;
    if (game.event.type === 'correct') withAudio(director => director.playCorrect(game.event.team));
    if (game.event.type === 'wrong') withAudio(director => director.playWrong());
    if (game.event.type === 'victory') {
      withAudio(director => {
        director.endMatch();
        director.playVictory(game.event.team);
      });
    }
  }, [game.event]);

  const enterKey = useCallback((team, key) => {
    setGame((prev) => {
      if (prev.status !== 'running') return prev;
      const question = prev.questions[team];
      if (question.compare) {
        if (!['<', '>', '='].includes(key)) return prev;
        const inputs = [...prev.inputs];
        inputs[team] = key;
        return applyAnswer({ ...prev, inputs }, team, matchSettings.current);
      }
      if (!/^\d$/.test(key) || prev.inputs[team].length >= 8) return prev;
      const inputs = [...prev.inputs];
      inputs[team] += key;
      const feedback = [...prev.feedback];
      const feedbackKind = [...prev.feedbackKind];
      feedback[team] = '';
      feedbackKind[team] = '';
      return { ...prev, inputs, feedback, feedbackKind };
    });
  }, []);

  const backspace = useCallback((team) => setGame((prev) => {
    if (prev.status !== 'running') return prev;
    const inputs = [...prev.inputs];
    inputs[team] = inputs[team].slice(0, -1);
    return { ...prev, inputs };
  }), []);

  const submit = useCallback((team) => setGame((prev) => applyAnswer(prev, team, matchSettings.current)), []);

  useEffect(() => {
    if (game.status !== 'running') return undefined;
    const handler = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      if (event.key.toLowerCase() === 'q') { setKeyboardTeam(0); return; }
      if (event.key.toLowerCase() === 'p') { setKeyboardTeam(1); return; }
      if (/^\d$/.test(event.key) || ['<', '>', '='].includes(event.key)) enterKey(keyboardTeam, event.key);
      else if (event.key === 'Backspace') { event.preventDefault(); backspace(keyboardTeam); }
      else if (event.key === 'Enter') { event.preventDefault(); submit(keyboardTeam); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [game.status, keyboardTeam, enterKey, backspace, submit]);

  const playing = game.status !== 'idle';
  return (
    <div className="tug-page">
    <div className={`app-shell bg-${settings.background}`}>
      <div className="app-container">
        <div className="tira-topline"><Link className="home-back-link" to="/#juegos">← Volver a Mentes Brillantes</Link></div>
        <header className="tira-site-header">
          <div className="tira-header-brand">
            <span className="tira-header-mark" aria-hidden="true">
              <svg viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 38H66" stroke="#D6A351" strokeWidth="6" strokeLinecap="round"/>
                <path d="m24 35 4 6m8-6 4 6m8-6 4 6" stroke="#FDFCF8" strokeWidth="2" strokeLinecap="round"/>
                <path d="m35 38 3 16 5-8-4-8" fill="#D95580" stroke="#282C2A" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="15" cy="14" r="9" fill="#497D98" stroke="#282C2A" strokeWidth="1.8"/>
                <path d="M15 24 9 38m7-13 10 12M12 39 5 53m13-14 8 14" stroke="#497D98" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="57" cy="14" r="9" fill="#D95580" stroke="#282C2A" strokeWidth="1.8"/>
                <path d="m57 24 6 14m-7-13-10 12m14 2 7 14m-13-14-8 14" stroke="#D95580" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="13" r="1.6" fill="#FDFCF8"/><circle cx="53" cy="13" r="1.6" fill="#FDFCF8"/>
              </svg>
            </span>
            <div className="tira-header-copy">
              <span className="tira-header-eyebrow">JUEGO EDUCATIVO · DOS EQUIPOS</span>
              <h1>TIRA <span>TIRA</span></h1>
              <span className="tira-header-tagline">MATEMÁTICAS · JUEGA Y APRENDE</span>
            </div>
          </div>
          <div className="tira-header-actions">
            <AudioButtons settings={audioSettings} onChange={updateAudio} />
            {playing && <>
              <button className="header-button" type="button" onClick={configure}>⚙ Configurar</button>
              {game.status === 'running' && <button className="header-button" type="button" onClick={pause}>⏸ Pausar</button>}
            </>}
          </div>
        </header>
        {playing ? (
          <main className="game-main">
            <div className="game-grid">
              <TeamPanel index={0} name={settings.teams[0]} score={game.scores[0]} question={game.questions[0]} input={game.inputs[0]} feedback={game.feedback[0]} feedbackKind={game.feedbackKind[0]} isRunning={game.status === 'running'} onDigit={enterKey} onBackspace={backspace} onSubmit={submit} onSelectKeyboard={setKeyboardTeam} isKeyboardActive={keyboardTeam === 0} />
              <Arena match={game} settings={settings} onAgain={start} onConfigure={configure} onResume={resume} />
              <TeamPanel index={1} name={settings.teams[1]} score={game.scores[1]} question={game.questions[1]} input={game.inputs[1]} feedback={game.feedback[1]} feedbackKind={game.feedbackKind[1]} isRunning={game.status === 'running'} onDigit={enterKey} onBackspace={backspace} onSubmit={submit} onSelectKeyboard={setKeyboardTeam} isKeyboardActive={keyboardTeam === 1} />
            </div>
            <p className="game-bottom-note">Dibuja tu camino con cada acierto · Dos equipos · Una aventura matemática</p>
          </main>
        ) : <Setup settings={settings} setSettings={setSettings} onStart={start} />}
      </div>
    </div>
    </div>
  );
}
