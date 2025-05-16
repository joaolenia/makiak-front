import React, { useState } from 'react';
import './Honorarios.css';

interface Honorario {
  numero: string;
  pasta: string;
  total: string;
  situacao: string;
  qtdParcelas: string;
  valorParcela: string;
  pagas: string;
  autor: string;
}

export default function Honorarios() {
  const honorarios: Honorario[] = Array(4).fill({
    numero: '000001112',
    pasta: '127',
    total: 'R$ 3250,00',
    situacao: 'PENDENTE',
    qtdParcelas: '12',
    valorParcela: '110,00',
    pagas: '3/12',
    autor: 'Joao Da Silva',
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="honorario-container-p">
      <header className="honorario-top-bar-p">
        <div className="honorario-titulo-p">HONORÁRIOS</div>
        <div className="honorario-logo-p">
          <strong>STASIAK & MAKIAK</strong>
          <div className="honorario-sub-logo-p">Advogados Associados</div>
        </div>
        <a href="#" className="honorario-voltar-p">VOLTAR</a>
      </header>

      <div className="honorario-filtros-p">
        <div className="honorario-busca-p">
          <span className="honorario-icone-p">🔍</span>
          <input type="text" placeholder="Buscar honorário..." />
        </div>
        <button className="honorario-btn-filtro-p">FILTROS ▾</button>
        <button className="honorario-btn-filtro-p">DATA ▾</button>
      </div>

      <div className="honorario-lista-p">
        {honorarios.map((h, idx) => (
          <div
            key={idx}
            className={`honorario-card-p ${selectedIndex === idx ? 'honorario-selecionado' : ''}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="honorario-card-esquerda-p">
              <div><strong>PROCESSO:</strong> Nº {h.numero}</div>
              <div><strong>PASTA:</strong> {h.pasta}</div>
              <div><strong>AUTOR:</strong> {h.autor}</div>
              <div><strong>TOTAL:</strong> <span style={{ color: 'green' }}>{h.total}</span></div>
            </div>

            <div className="honorario-card-direita-p">
              <div><strong>QTD PARCELAS:</strong> {h.qtdParcelas}</div>
              <div><strong>PAGAS:</strong> {h.pagas}</div>
              <div><strong>SITUAÇÃO:</strong> <span style={{ color: 'red' }}>{h.situacao}</span></div>
              <div><strong>VALOR DA PARCELA:</strong> {h.valorParcela}</div>
            </div>

            <button className="honorario-edit-btn-p" title="Editar">✎</button>
          </div>
        ))}
      </div>

      <div className="honorario-btn-cadastrar-wrapper-p">
        <button className="honorario-btn-cadastrar-p">CADASTRAR</button>
      </div>
    </div>
  );
}
