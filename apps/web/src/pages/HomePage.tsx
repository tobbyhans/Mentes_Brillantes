import {useEffect,useMemo,useState, type CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import type {Game,GameCategory} from '../api/games';
import {getGames} from '../api/games';
import {illustrations} from '../assets/illustrations';
import logo from '../assets/mentes-logo.svg';
import hero from '../assets/hero-mascotas.png';
import './Home.css';

const FILTERS = ['Todos','Ciencia','Tecnología','Ingeniería','Arte','Matemáticas'] as const;
type Filter = typeof FILTERS[number];
const accents:Record<GameCategory,string>={Ciencia:'#e3b64f',Tecnología:'#497d98',Ingeniería:'#db6447',Arte:'#db6447',Matemáticas:'#497d98'};

export default function HomePage(){
 const [games,setGames]=useState<Game[]>([]);
 const [filter,setFilter]=useState<Filter>('Todos');
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState<string|null>(null);
 const [modalOpen,setModalOpen]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();
  getGames(controller.signal).then(setGames).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'No disponible');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[]);
 const visible=useMemo(()=>games.filter(g=>filter==='Todos'||g.category===filter),[filter,games]);
 return <div className="home-root">
   <div className="shell">
    <div className="top-panel" id="inicio">
     <header className="header"><a href="#inicio" className="brand" aria-label="Mentes Brillantes, volver al inicio"><img src={logo} className="logo" alt=""/><span className="brand-lockup"><span className="brand-name"><span className="brand-first">MENTES</span><span className="brand-second">BRILLANTES<span className="brand-spark" aria-hidden="true">✳</span></span></span></span></a><nav className="nav" aria-label="Navegación principal"><a href="#inicio">Inicio</a><a className="nav-cta" href="#juegos">Ver los juegos ↗</a></nav></header>
     <section className="hero" aria-labelledby="title"><div className="hero-copy"><p className="eyebrow">Explora · juega · descubre</p><h1 id="title">Elige tu aventura<span className="spark" aria-hidden="true">✳</span></h1><p className="intro">Cada juego es una galaxia de ideas para crear, experimentar y aprender jugando.</p><p className="micro-note"><span aria-hidden="true"/>Tu próximo descubrimiento empieza aquí.</p></div><div className="hero-stage" aria-hidden="true"><span className="tiny-cross one">+</span><span className="tiny-cross two">·</span><img src={hero} alt="" className="home-hero-art"/><span className="hero-pencil">HECHO DE IDEAS ✳</span></div></section>
    </div>
    <main><section id="juegos" aria-label="Explorar juegos STEAM">
     <div className="filters-bar" role="group" aria-label="Filtrar por categoría">{FILTERS.map(value=><button key={value} className="filter" type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value}</button>)}</div>
     <div className="board"><div className="board-head"><strong>Tus mundos para explorar</strong><span id="counter" role="status" aria-live="polite">{loading?'Cargando juegos…':`${visible.length} ${visible.length===1?'juego':'juegos'} para descubrir`}</span></div>
      {error?<div role="alert" className="empty"><strong>No se pudo conectar con el catálogo.</strong><p>Comprueba que la API esté iniciada en el puerto 3001.</p><small>{error}</small><br/><button className="close" type="button" onClick={()=>window.location.reload()}>Reintentar</button></div>:
      <div id="cards" className="cards">{visible.map((game:Game)=><GameCard key={game.id} game={game} onSoon={()=>setModalOpen(true)}/>)}{!loading&&!visible.length&&<p className="empty">Pronto llegarán nuevas aventuras a este mundo.</p>}</div>}
      <div className="board-foot"><div className="legend"><span className="dot-set" aria-hidden="true"><i/><i/><i/></span> MENTES BRILLANTES · La imaginación empieza con una forma</div><span>CREA · EXPERIMENTA · JUEGA</span></div>
     </div>
    </section></main>
    <footer className="footer"><span>© 2026 Mentes Brillantes. Un universo de ideas.</span><span>Diseñado para mentes curiosas ✳</span></footer>
   </div>
   {modalOpen&&<div className="soon-backdrop" role="presentation" onClick={()=>setModalOpen(false)}><div className="soon-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={event=>event.stopPropagation()}><h2 id="modal-title">¡Este juego está en camino!</h2><p>Estamos preparando una nueva aventura.</p><button className="close" autoFocus onClick={()=>setModalOpen(false)}>Entendido ↗</button></div></div>}
 </div>;
}
function GameCard({game,onSoon}:{game:Game;onSoon:()=>void}){
 const isLive=game.status==='available'&&!!game.route;
 const content=<><span className="card-top"><span>{String(game.order).padStart(2,'0')} / STEAM</span><span className="asterisk" aria-hidden="true">✳</span></span><span className="illustration" aria-hidden="true"><img src={illustrations[game.icon] ?? illustrations.art} alt="" loading="lazy" decoding="async" /></span><span className="card-bottom"><span><span className="category">{game.category}</span><span className="game-title">{game.title}</span>{game.description&&<span className="game-hint">{game.description}</span>}</span><span className="go" aria-hidden="true">↗</span></span></>;
 const props={className:'card',style:{'--accent':accents[game.category]} as CSSProperties};
 return isLive?<Link {...props} to={game.route!} aria-label={`Jugar a ${game.title}`}>{content}</Link>:<button {...props} type="button" onClick={onSoon} aria-label={`${game.title}. Próximamente`}>{content}</button>;
}
