import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home/home';
import Pessoas from './pessoas/pessoas';
import Processos from './processos/Processos';
import Honorarios from './Honorarios/Honorarios';
import ProcessoDetalhado from './processos/ProcessoDetalhado';
import HonorariosDetalhado from './Honorarios/HonorarioDetalhado';
import ValoresDetalhado from './processos/valores/valores';
import Vencimentos from './vencimentos/Vencimentos';
import Login from './login/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/processos" element={<Processos />} />
        <Route path="/processos/:id" element={<ProcessoDetalhado />} />
        <Route path="/processos/:id/valores" element={<ValoresDetalhado />} />
        <Route path="/honorarios/:id" element={<HonorariosDetalhado />} />
        <Route path="/honorarios" element={<Honorarios />} />
        <Route path="/vencimentos" element={<Vencimentos />} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
