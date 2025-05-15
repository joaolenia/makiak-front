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
      <header className="top-bar">
        <div className="titulo">PROCESSOS</div>
        <div className="logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="voltar">VOLTAR</a>
      </header>

      <div className="filtros">
        <div className="busca">
          <span className="icone">🔍</span>
          <input type="text" placeholder="jo" />
        </div>
        <button className="btn-filtro">FILTROS ▾</button>
        <button className="btn-filtro">DATA ▾</button>
      </div>

      <div className="lista-processos">
        {processos.map((p, idx) => (
          <div
            key={idx}
            className={`card-processo ${selectedIndex === idx ? 'selecionado' : ''}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="dados">
              <div><span className="numero">Nº {p.numero}</span></div>
              <div>PASTA: {p.pasta}</div>
              <div>DATA: {p.data}</div>
              <div>SITUAÇÃO: {p.situacao}</div>
              <br />
              <div><strong>TIPO:</strong> {p.tipo}</div>
              <div><strong>AUTOR:</strong> {p.autor}</div>
              <div><strong>RÉU:</strong> {p.reu}</div>
              <div><strong>CIDADE:</strong> {p.cidade}</div>
            </div>
            <button className="edit-btn">✎</button>
          </div>
        ))}
      </div>

      <div className="btn-cadastrar-wrapper">
        <button className="btn-cadastrar">CADASTRAR</button>
      </div>
    </div>
  );
}
