import  { useState, useEffect } from 'react';
import './Processos.css';
import { Link, useNavigate } from 'react-router-dom';
import { buscarProcessos } from './axios/Requests';
import CadastroProcesso from './form/CadastroProcesso';
import EditarProcesso from './form/EditarProcesso';

interface Processo {
  id: number;
  numero: string;
  pasta: string;
  data: string;
  situacao: string;
  tipo: string;
  autores: string[];
  reus: string[];
  terceiros: string[];
}

export default function Processos() {
  const [filtro, setFiltro] = useState<number>(1);
  const [termoBusca, setTermoBusca] = useState('');
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [debouncedTermo, setDebouncedTermo] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedProcessoId, setSelectedProcessoId] = useState<number | null>(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (!showCadastro && !showEditar && termoBusca.trim()) {
    buscarProcessos(termoBusca, filtro)
      .then((res) => setProcessos(res))
      .catch((err) => console.error('Erro ao buscar processos:', err));
  }
}, [showCadastro, showEditar]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermo(termoBusca);
    }, 300);
    return () => clearTimeout(timer);
  }, [termoBusca]);

  useEffect(() => {
    if (debouncedTermo.trim()) {
      buscarProcessos(debouncedTermo, filtro)
        .then((res) => setProcessos(res))
        .catch((err) => console.error('Erro ao buscar processos:', err));
    }
  }, [debouncedTermo, filtro]);

  const handleCardClick = (idx: number) => {
    const processoId = processos[idx].id;
    navigate(`/processos/${processoId}`);
  }; 

  return (
    <div className="processos-container">
      <header className="processos-top-bar">
        <div className="processos-titulo">PROCESSOS</div>
        <div className="processos-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="processos-sub-logo">Advogados Associados</div>
        </div>
        <Link to="/" className="processos-voltar">VOLTAR</Link>
      </header>

      <div className="processos-filtros">
        <div className="processos-busca">
          <input
            type="text"
            placeholder="Buscar processo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        <select
          className="processos-select-filtro"
          value={filtro}
          onChange={(e) => setFiltro(Number(e.target.value))}
        >
          <option value={1}>Número do processo</option>
          <option value={2}>Nome do autor</option>
          <option value={3}>Nome do réu</option>
          <option value={4}>Nome do terceiro</option>
          <option value={5}>Tipo do processo</option>
        </select>
      </div>

      <div className="processos-lista-processos">
        {processos.map((p, idx) => (
          <div
            key={p.id}
            className={`processos-card-processo ${selectedIndex === idx ? 'processos-selecionado' : ''}`}
            onClick={() => handleCardClick(idx)}
          >
            <div className="processos-card-conteudo">
              <div className="processos-col-esquerda">
                <div><span className="processos-numero">Nº {p.numero}</span></div>
                <div>PASTA: {p.pasta || '—'}</div>
                <div>DATA: {p.data}</div>
                <div>SITUAÇÃO: {p.situacao}</div>
              </div>
              <div className="processos-col-direita">
                <div><strong>TIPO:</strong> {p.tipo}</div>
                <div><strong>AUTOR:</strong> {p.autores.join(', ')}</div>
                <div><strong>RÉU:</strong> {p.reus.join(', ')}</div>
                <div><strong>TERCEIRO:</strong> {p.terceiros.join(', ') || '—'}</div>
              </div>
            </div>
            <button
              className="processos-edit-btn"
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
                setSelectedProcessoId(p.id);
                setShowEditar(true);
              }}
            >✎</button>
          </div>
        ))}
      </div>

      <div className="processos-btn-cadastrar-wrapper">
        <button className="processos-btn-cadastrar" onClick={() => setShowCadastro(true)}>
          CADASTRAR
        </button>
      </div>

      {showCadastro && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CadastroProcesso onClose={() => setShowCadastro(false)} />
          </div>
        </div>
      )}

      {showEditar && selectedProcessoId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditarProcesso id={selectedProcessoId} onClose={() => setShowEditar(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
