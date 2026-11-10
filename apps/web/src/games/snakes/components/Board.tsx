import { FINISH, LADDERS, SNAKES, tilePosition } from '../lib/game';
import type { PlayerIndex } from '../lib/flow';

const ladders = Object.entries(LADDERS).map(([start, end]) => ({ start: Number(start), end }));
const snakes = Object.entries(SNAKES).map(([start, end]) => ({ start: Number(start), end }));
const palette = ['#d96082', '#7a8dbb', '#e9a447', '#4caaa2', '#db7f61', '#728aaf', '#ca5d85', '#41938e'];

function Ladder({ from, to }: { from: number; to: number }) {
  const a = tilePosition(from);
  const b = tilePosition(to);
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len = Math.hypot(vx, vy);
  const nx = -vy / len * 12;
  const ny = vx / len * 12;
  const rail = (sign: number) => `M ${a.x + nx * sign} ${a.y + ny * sign} L ${b.x + nx * sign} ${b.y + ny * sign}`;
  const steps = Math.max(3, Math.floor(len / 31));
  return <g aria-hidden="true" className="ladder-art">
    <path d={rail(-1)} stroke="#805b42" strokeWidth="12" strokeLinecap="round" />
    <path d={rail(1)} stroke="#805b42" strokeWidth="12" strokeLinecap="round" />
    <path d={rail(-1)} stroke="#e7b363" strokeWidth="7" strokeLinecap="round" />
    <path d={rail(1)} stroke="#e7b363" strokeWidth="7" strokeLinecap="round" />
    {Array.from({ length: steps }, (_, i) => {
      const t = (i + .5) / steps;
      const x = a.x + vx * t;
      const y = a.y + vy * t;
      return <line key={i} x1={x - nx} y1={y - ny} x2={x + nx} y2={y + ny} stroke="#fff5d7" strokeWidth="8" strokeLinecap="round" />;
    })}
  </g>;
}

function Snake({ from, to, index }: { from: number; to: number; index: number }) {
  const head = tilePosition(from);
  const tail = tilePosition(to);
  const vx = tail.x - head.x;
  const vy = tail.y - head.y;
  const len = Math.hypot(vx, vy);
  const nx = -vy / len;
  const ny = vx / len;
  const bend = (index % 2 ? -1 : 1) * Math.min(74, 20 + len / 6);
  const x1 = head.x + vx * .34 + nx * bend;
  const y1 = head.y + vy * .34 + ny * bend;
  const x2 = head.x + vx * .64 - nx * bend;
  const y2 = head.y + vy * .64 - ny * bend;
  const d = `M ${head.x} ${head.y} C ${x1} ${y1}, ${x2} ${y2}, ${tail.x} ${tail.y}`;
  const color = palette[index % palette.length];
  return <g className="snake-art" aria-hidden="true">
    <path d={d} stroke="#fff" strokeWidth="29" strokeLinecap="round" fill="none" opacity=".92" />
    <path d={d} stroke={color} strokeWidth="22" strokeLinecap="round" fill="none" />
    <path d={d} stroke="#fff" strokeWidth="3.2" strokeDasharray="4 24" strokeLinecap="round" fill="none" opacity=".7" />
    <ellipse cx={head.x} cy={head.y} rx="20" ry="19" fill={color} stroke="#fff" strokeWidth="3" />
    <circle cx={head.x - 8} cy={head.y - 6} r="5" fill="white" />
    <circle cx={head.x + 8} cy={head.y - 6} r="5" fill="white" />
    <circle cx={head.x - 7} cy={head.y - 6} r="2.3" fill="#203851" />
    <circle cx={head.x + 7} cy={head.y - 6} r="2.3" fill="#203851" />
    <path d={`M ${head.x - 6} ${head.y + 8} Q ${head.x} ${head.y + 13} ${head.x + 6} ${head.y + 8}`} fill="none" stroke="#8c3353" strokeWidth="2.5" strokeLinecap="round" />
  </g>;
}

interface BoardProps {
  positions: [number, number];
  active: PlayerIndex;
  preview?: boolean;
}
export default function Board({ positions, active, preview = false }: BoardProps) {
  return <div className={`board-frame ${preview ? 'board-preview' : ''}`}>
    <div className="board-halo" />
    <div className="board" role="img" aria-label={`Tablero de 100 casillas con serpientes y escaleras. Equipo azul en la ${positions[0]}, rosa en la ${positions[1]}.`}>
      <div className="board-squares">
        {Array.from({ length: FINISH }, (_, i) => {
          const number = i + 1;
          const { row, col } = tilePosition(number);
          const special = LADDERS[number] ? 'square-ladder' : SNAKES[number] ? 'square-snake' : '';
          return <div key={number} className={`square tile-${(row + col) % 4} ${special} ${number === FINISH ? 'square-finish' : ''}`} style={{ gridRow: row + 1, gridColumn: col + 1 }}>
            <span className="square-number">{number}</span>
            {number === FINISH && <span className="finish-emoji">🏆</span>}
          </div>;
        })}
      </div>
      <svg className="board-decor" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        {ladders.map(({ start, end }) => <Ladder key={start} from={start} to={end} />)}
        {snakes.map(({ start, end }, index) => <Snake key={start} from={start} to={end} index={index} />)}
      </svg>
      {positions.map((number, index) => {
        const point = tilePosition(number);
        return <div key={index} className={`player-token token-${index} ${active === index && !preview ? 'token-active' : ''}`} style={{ left: `${point.x / 10}%`, top: `${point.y / 10}%` }} aria-hidden="true"><span>{index + 1}</span></div>;
      })}
    </div>
    <div className="board-foot"><span><i className="legend-dot legend-blue" /> Equipo azul</span><span className="legend-mid">🐍 Baja · 🪜 Sube</span><span><i className="legend-dot legend-pink" /> Equipo rosa</span></div>
  </div>;
}
