import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {Component, type ErrorInfo, type ReactNode} from 'react';
import HomePage from './pages/HomePage';
import Tug from './games/tug/App';
import Snakes from './games/snakes/App';
import Cake from './games/cake/App';
import './games/tug/styles.css';
import './games/tug/world-theme.css';
import './games/tug/mentes-theme.css';
import './games/tug/compact-layout.css';
import './games/tug/snakes-parity.css';
import './games/snakes/styles.css';
import './games/snakes/notebook-theme.css';
import './games/snakes/mentes-theme.css';
class GameErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error en el juego React de Serpientes y Escaleras', error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main style={{maxWidth:650,margin:'8vh auto',padding:28,textAlign:'center',fontFamily:'Trebuchet MS, sans-serif'}}>
      <h1>Serpientes y Escaleras</h1>
      <p>La partida ha encontrado un error. Puedes volver a empezar desde Mentes Brillantes.</p>
      <a href="/" style={{display:'inline-block',padding:14,background:'#497d98',color:'white',borderRadius:12}}>Volver a Mentes Brillantes</a>
    </main>;
  }
}
export default function App(){return <BrowserRouter><Routes>
 <Route path="/" element={<HomePage/>}/>
 <Route path="/juegos/tira-tira" element={<Tug/>}/>
 <Route path="/juegos/tira-y-afloja" element={<Navigate to="/juegos/tira-tira" replace/>}/>
 <Route path="/juegos/come-tartas" element={<Cake/>}/>
 <Route path="/juegos/serpientes-y-escaleras" element={<GameErrorBoundary><Snakes/></GameErrorBoundary>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></BrowserRouter>}
