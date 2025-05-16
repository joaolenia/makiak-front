import React, { useState } from 'react';
import './Processos.css';

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

  return (
    <div className="processos-container">
      <header className="processos-top-bar">
        <div className="processos-titulo">PROCESSOS</div>
        <div className="processos-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="processos-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="processos-voltar">VOLTAR</a>
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
            onClick={() => setSelectedIndex(idx)}
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
            <button className="processos-edit-btn" title="Editar">✎</button>
          </div>
        ))}
      </div>

      <div className="processos-btn-cadastrar-wrapper">
        <button className="processos-btn-cadastrar">CADASTRAR</button>
      </div>
    </div>
  );
}
