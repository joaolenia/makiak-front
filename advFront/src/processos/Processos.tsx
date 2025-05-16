import React, { useState } from 'react';
import './Processos.css';
import ProcessoDetalhado from './ProcessoDetalhado';
import CadastroProcesso from './form/CadastroProcesso';
import EditarProcesso from './form/EditarProcesso';
import { Link,useNavigate } from 'react-router-dom';


interface Processo {
  numero: string;
  pasta: string;
  data: string;
  situacao: string;
  tipo: string;
  autor: string;
  reu: string;
  cidade: string;
}

export default function Processos() {
  const processos: Processo[] = Array(10).fill({
    numero: '000001112',
    pasta: '127',
    data: '12/02/2005',
    situacao: 'Ativo',
    tipo: 'Ação Trabalhista de desvio de função',
    autor: 'Joao Da Silva',
    reu: 'Petrobras',
    cidade: 'União da Vitória PR',
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showDetalhado, setShowDetalhado] = useState(false);
  const navigate = useNavigate();

const handleCardClick = (idx: number) => {
  const processoId = idx + 1; 
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
          <span className="processos-icone">🔍</span>
          <input type="text" placeholder="Buscar processo..." />
        </div>
        <button className="processos-btn-filtro">FILTROS ▾</button>
        <button className="processos-btn-filtro">DATA ▾</button>
      </div>

      <div className="processos-lista-processos">
        {processos.map((p, idx) => (
          <div
            key={idx}
            className={`processos-card-processo ${selectedIndex === idx ? 'processos-selecionado' : ''}`}
            onClick={() => handleCardClick(idx)}
          >
            <div className="processos-card-conteudo">
              <div className="processos-col-esquerda">
                <div><span className="processos-numero">Nº {p.numero}</span></div>
                <div>PASTA: {p.pasta}</div>
                <div>DATA: {p.data}</div>
                <div>SITUAÇÃO: {p.situacao}</div>
              </div>
              <div className="processos-col-direita">
                <div><strong>TIPO:</strong> {p.tipo}</div>
                <div><strong>AUTOR:</strong> {p.autor}</div>
                <div><strong>RÉU:</strong> {p.reu}</div>
                <div><strong>CIDADE:</strong> {p.cidade}</div>
              </div>
            </div>
            <button
              className="processos-edit-btn"
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
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

      {/* Modal Cadastro */}
      {showCadastro && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CadastroProcesso onClose={() => setShowCadastro(false)} />
          </div>
        </div>
      )}

      {/* Modal Edição */}
      {showEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditarProcesso onClose={() => setShowEditar(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
