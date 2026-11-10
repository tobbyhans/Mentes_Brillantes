// Tarta SVG original: seis porciones con los sectores retirados según los aciertos.
const palette = ['#f9dca4','#f6b8ac','#f9dca4','#f6b8ac','#f9dca4','#f6b8ac'];
function arcSlice(i: number) {
  const start = (-90 + i*60)*Math.PI/180, end = (-90+(i+1)*60)*Math.PI/180;
  const cx=116,cy=116,r=83;
  const a=[cx+r*Math.cos(start),cy+r*Math.sin(start)];
  const b=[cx+r*Math.cos(end),cy+r*Math.sin(end)];
  return `M ${cx} ${cy} L ${a[0].toFixed(2)} ${a[1].toFixed(2)} A ${r} ${r} 0 0 1 ${b[0].toFixed(2)} ${b[1].toFixed(2)} Z`;
}
export default function CakeVisual({eaten=0,celebrate=false}:{eaten?:number;celebrate?:boolean}) {
  return <svg className={`cake-visual ${celebrate?'cake-celebrate':''}`} viewBox="0 0 232 232" role="img" aria-label={`Tarta de seis porciones: ${eaten} comidas y ${6-eaten} restantes`}>
    <ellipse cx="116" cy="206" rx="105" ry="18" fill="#d5ccbe" opacity=".45"/>
    <circle cx="116" cy="116" r="100" fill="#fffdfa" stroke="#303934" strokeWidth="3"/>
    <circle cx="116" cy="116" r="88" fill="#d0a278"/>
    {Array.from({length:6},(_,i)=>i>=eaten&&<g key={i}><path d={arcSlice(i)} fill={palette[i]} stroke="#fffaf0" strokeWidth="5"/><path d={`M ${116+53*Math.cos((-60+i*60)*Math.PI/180)} ${116+53*Math.sin((-60+i*60)*Math.PI/180)} l -2 -5`} stroke="#fffaf0" strokeWidth="6" strokeLinecap="round"/><circle cx={116+56*Math.cos((-60+i*60)*Math.PI/180)} cy={116+56*Math.sin((-60+i*60)*Math.PI/180)} r="9" fill="#d95580" stroke="#fffdfa" strokeWidth="3"/></g>)}
    {eaten===6&&<><text x="116" y="114" textAnchor="middle" fontSize="36">✨</text><text x="116" y="146" textAnchor="middle" fontSize="13" fill="#497d98" fontWeight="900">¡TARTA COMPLETA!</text></>}
  </svg>;
}
