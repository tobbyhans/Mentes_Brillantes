// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
import TugScene from './TugScene';
import { formatTime, WIN_LEAD } from '../lib/game';

export default function Arena({ match, settings, onAgain, onConfigure, onResume }) {
  const left = Math.max(4, Math.min(96, 50 + (match.progress / WIN_LEAD) * 46));
  const done = match.status === 'finished';
  const paused = match.status === 'paused';
  const winnerName = match.winner === null ? null : (settings.teams[match.winner]?.trim() || `Equipo ${match.winner + 1}`);
  const latestSuccess = match.event && ['correct', 'victory'].includes(match.event.type) ? match.event : null;
  return (
    <section className="arena" aria-label="Zona central de Tira Tira">
      <div className="arena-scoreboard">
        <div className="arena-score blue-score"><span>{settings.teams[0] || 'Equipo azul'}</span><strong>{match.scores[0]}</strong></div>
        <div className="arena-clock"><small>{match.secondsLeft === null ? 'PARTIDA LIBRE' : 'TIEMPO RESTANTE'}</small><time className={match.secondsLeft !== null && match.secondsLeft <= 10 ? 'urgent' : ''}>{formatTime(match.secondsLeft)}</time></div>
        <div className="arena-score red-score"><span>{settings.teams[1] || 'Equipo rosa'}</span><strong>{match.scores[1]}</strong></div>
      </div>
      <div className="scene-area">
        <p className="scene-caption">¡COMIENZA LA GRAN AVENTURA!</p>
        <p className="scene-description">¡Cada cuenta mueve a los equipos!</p>
        <TugScene progress={match.progress} playing={match.status === 'running'} event={latestSuccess} />
      </div>
      <div className="arena-bottom">
        <div className="side-labels"><span>← EQUIPO AZUL</span><span>EQUIPO ROSA →</span></div>
        <div className="rope-meter"><div className="meter-center" /><div className="meter-flag" style={{ left: `${left}%` }} aria-label={`Posición: ${match.progress}`} /></div>
        <p>Consigue {WIN_LEAD} tirones de ventaja o más aciertos al acabar el tiempo.</p>
      </div>
      {(done || paused) && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-label={done ? 'Resultado final' : 'Partida pausada'}>
          {done && <div className="confetti-layer" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => (
            <i key={i} className="confetti-bit" style={{ '--x': `${(i * 37 + 11) % 98}%`, '--delay': `${(i * 73) % 900}ms`, '--duration': `${2100 + (i % 5) * 340}ms`, '--rot': `${(i * 127) % 720}deg`, '--color': ['#2b9cd8', '#f35e7a', '#f8c853', '#6fcdad'][i % 4] }} />
          ))}</div>}
          <div className={`result-card ${done ? 'result-celebration' : ''}`}>
            <div className="result-emoji">{paused ? '⏸️' : (winnerName ? '🏆' : '🤝')}</div>
            <h2>{paused ? 'Partida en pausa' : (winnerName ? '¡Tenemos ganador!' : '¡Empate!')}</h2>
            <p>{paused ? 'Los dos equipos pueden descansar un momento.' : (winnerName ? `¡Enhorabuena, ${winnerName}!` : 'Los equipos han conseguido los mismos aciertos.')}</p>
            {done && <div className="final-score"><span className="final-blue">{match.scores[0]}</span><span>:</span><span className="final-red">{match.scores[1]}</span></div>}
            <div className="result-buttons">
              {paused ? <button className="btn btn-primary" type="button" onClick={onResume}>▶ Continuar</button> : <button className="btn btn-primary" type="button" onClick={onAgain}>↻ Volver a jugar</button>}
              <button className="btn btn-ghost" type="button" onClick={onConfigure}>⚙ Configurar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
