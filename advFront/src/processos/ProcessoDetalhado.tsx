import React, { useState, useEffect } from 'react';
import './ProcessoDetalhado.css';
import { useParams, useNavigate } from 'react-router-dom';
import EditarProcesso from './form/EditarProcesso'; 
import { getProcessoById } from './axios/Requests';

interface Observacao {
  data: string;
  texto: string;
}

interface Pessoa {
  id: number;
  nome: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
}

interface Processo {
  id: number;
  numero: string;
  subnumero?: string;
  pasta?: string;
  data: string;
  situacao: string;
  tipo: string;
  autores: Pessoa[];
  reus: Pessoa[];
  terceiros: Pessoa[];
  vara?: string;
  cidade?: string;
}

export default function ProcessoDetalhado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Observações fixas conforme seu pedido
  const observacoes: Observacao[] = Array(14).fill({
    data: '22/12/2005',
    texto: 'XXXXXXXX XXXXXXX XXXXXXXXX XXXXX SS XXXXXXX CCCCCC CCCCCC CCCCC XXXXX XXXXX SS',
  });

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getProcessoById(Number(id))
        .then(res => {
          setProcesso(res);
          setCarregando(false);
        })
        .catch(err => {
          console.error('Erro ao buscar processo:', err);
          setCarregando(false);
        });
    }
  }, [id]);

  if (carregando) {
    return <div>Carregando dados do processo...</div>;
  }

  if (!processo) {
    return <div>Processo não encontrado.</div>;
  }

  // Função auxiliar para extrair nomes das pessoas
  const nomes = (pessoas: Pessoa[]) => pessoas.map(p => p.nome).join(', ') || '—';

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
            <div className="detalhado-numero-processo">Nº {processo.numero}</div>
            {processo.subnumero && <div className="detalhado-subnumero">Nº {processo.subnumero}</div>}
            <div>PASTA: {processo.pasta || '—'}</div>
            <div>DATA: {processo.data}</div>
            <div>SITUAÇÃO: {processo.situacao}</div>
            <div>TIPO: {processo.tipo}</div>
            <div>AUTOR: {nomes(processo.autores)}</div>
            <div>RÉU: {nomes(processo.reus)}</div>
            <div>TERCEIRO: {nomes(processo.terceiros)}</div>
            <div>VARA: {processo.vara || '—'}</div>
            <div>CIDADE: {processo.cidade || '—'}</div>
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
        <EditarProcesso id={Number(id)} onClose={() => setMostrarEditar(false)} />
      )}
    </div>
  );
}
