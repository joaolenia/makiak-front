import React, { useState } from 'react';
import './ProcessoDetalhado.css';
import { useParams, useNavigate } from 'react-router-dom';
import EditarProcesso from './form/EditarProcesso'; 

interface Observacao {
  data: string;
  texto: string;
}

export default function ProcessoDetalhado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarEditar, setMostrarEditar] = useState(false);

  console.log(id);

  const observacoes: Observacao[] = Array(14).fill({
    data: '22/12/2005',
    texto: 'XXXXXXXX XXXXXXX XXXXXXXXX XXXXX SS XXXXXXX CCCCCC CCCCCC CCCCC XXXXX XXXXX SS',
  });

  return (
    <div className="detalhado-container">
      <div className="detalhado-top-bar">
        <button className="detalhado-btn" onClick={() => setMostrarEditar(true)}>EDITAR PROCESSO</button>
        <div className="detalhado-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="detalhado-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="detalhado-voltar" onClick={() => navigate('/processos')}>VOLTAR</a>
      </div>

      <div className="detalhado-corpo">
        <div className="detalhado-observacoes">
          {observacoes.map((obs, idx) => (
            <div className="detalhado-observacao" key={idx}>
              <span className="detalhado-bolinha" />
              <div className="detalhado-textos">
                <div className="detalhado-data">{obs.data}</div>
                <div className="detalhado-descricao">{obs.texto}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="detalhado-dados-processo">
          <div className="detalhado-info-scroll">
            <div className="detalhado-numero-processo">Nº 2122242334242</div>
            <div className="detalhado-subnumero">Nº 000001112</div>
            <div>PASTA: 127</div>
            <div>DATA: 12/02/2005</div>
            <div>SITUAÇÃO: Ativo</div>
            <div>TIPO: Ação Trabalhista de desvio de função</div>
            <div>AUTOR: Joao Da Silva</div>
            <div>RÉU: Petrobras</div>
            <div>TERCEIRO: União da Vitória PR</div>
            <div>VARA: Trabalhista</div>
            <div>CIDADE: União da Vitória PR</div>
          </div>

          <div className="detalhado-botoes-fixos">
            <button className="detalhado-acao">DESCRIÇÃO</button>
            <button className="detalhado-acao">VALORES</button>
            <button className="detalhado-acao">RELATÓRIO</button>
          </div>
        </div>
      </div>

      {/* Pop-up de edição */}
      {mostrarEditar && (
        <EditarProcesso onClose={() => setMostrarEditar(false)} />
      )}
    </div>
  );
}
