// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
import tugTeamsArtwork from '../assets/tug-teams.png';
import { WorldBackdrop } from './WorldDoodles';

// Ilustración PNG transparente proporcionada por el usuario. La cargamos
// directamente para mantener los personajes, colores y cuerda originales.
const SPARK_DIRECTIONS = [
  [-60, -18], [-46, -65], [-16, -73], [17, -74], [48, -55], [67, -7],
  [-53, 24], [-27, 46], [27, 48], [49, 20],
];

export default function TugScene({ progress, playing, event }) {
  // El signo es negativo a favor del azul: desplazamos a todos y a la cuerda.
  const moving = progress * 16;
  const success = event && ['correct', 'victory'].includes(event.type);
  const flashX = event?.team === 0 ? 275 : 570;
  return (
    <svg className="tug-svg" viewBox="0 0 840 430" role="img" aria-label="Seis niños y niñas de dos equipos, tres de azul y tres de rosa, que tiran de una cuerda que avanza con las respuestas correctas" preserveAspectRatio="xMidYMid meet">
      <WorldBackdrop />
      {/* Toda la ilustración avanza al tirar; la animación interior simula el esfuerzo. */}
      <g className="tug-people" style={{ transform: `translateX(${moving}px)` }}>
        <g className={`custom-tug-motion ${playing ? 'custom-tug-motion--active' : ''}`}>
          <image
            href={tugTeamsArtwork}
            x="-6" y="18" width="852" height="426"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
      {success && (
        <g key={`spark-${event.id}`} className="spark-burst" transform={`translate(${flashX} 170)`} aria-hidden="true">
          <circle r="32" className="spark-ring" stroke={event.team === 0 ? '#159beb' : '#ed4f75'} fill="none" strokeWidth="3" />
          {SPARK_DIRECTIONS.map(([dx, dy], i) => <circle key={i} r={i % 3 === 0 ? 6 : 4} fill={i % 2 ? '#f9c14d' : '#f7fbff'} className="spark-dot" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--delay': `${i * 15}ms` }} />)}
          <text y="-15" textAnchor="middle" className="spark-label" fill={event.team === 0 ? '#188dd0' : '#e74468'}>+1</text>
        </g>
      )}
    </svg>
  );
}
