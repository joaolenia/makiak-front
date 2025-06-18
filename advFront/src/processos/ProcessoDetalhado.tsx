import { useState, useEffect } from 'react';
import './ProcessoDetalhado.css';
import { useParams, useNavigate } from 'react-router-dom';
import EditarProcesso from './form/EditarProcesso';

import {
  getProcessoById,
  getDescricoesByProcessoId,
  createDescricao,
  updateDescricao
} from './axios/Requests';
import { gerarPDFProcesso } from './relatórios/gerarPDFProcesso';
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

interface Descricao {
  id: number;
  descricao: string;
  data: string;
}

export default function ProcessoDetalhado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [descricoes, setDescricoes] = useState<Descricao[]>([]);
  const [mostrarFormDescricao, setMostrarFormDescricao] = useState(false);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaData, setNovaData] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoDescricao, setEditandoDescricao] = useState('');
  const [editandoData, setEditandoData] = useState('');

  useEffect(() => {
    if (id) {
      setCarregando(true);
      const processoId = Number(id);

      Promise.all([
        getProcessoById(processoId),
        getDescricoesByProcessoId(processoId)
      ])
        .then(([processoRes, descricoesRes]) => {
          setProcesso(processoRes);
          setDescricoes(descricoesRes);
          setCarregando(false);
        })
        .catch(err => {
          console.error('Erro ao carregar dados:', err);
          setCarregando(false);
        });
    }
  }, [id]);

  const handleCadastrarDescricao = async () => {
    if (!novaDescricao || !novaData || !id) return;

    try {
      await createDescricao({
        processoId: Number(id),
        descricao: novaDescricao,
        data: novaData,
      });
      const novasDescricoes = await getDescricoesByProcessoId(Number(id));
      setDescricoes(novasDescricoes);
      setNovaDescricao('');
      setNovaData('');
      setMostrarFormDescricao(false);
    } catch (error) {
      console.error('Erro ao cadastrar descrição:', error);
    }
  };

  const iniciarEdicao = (desc: Descricao) => {
    setEditandoId(desc.id);
    setEditandoDescricao(desc.descricao);
    setEditandoData(desc.data);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoDescricao('');
    setEditandoData('');
  };

  const salvarEdicao = async () => {
    if (editandoId === null) return;

    try {
      await updateDescricao(editandoId, {
        descricao: editandoDescricao,
        data: editandoData,
      });
      const novasDescricoes = await getDescricoesByProcessoId(Number(id));
      setDescricoes(novasDescricoes);
      cancelarEdicao();
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  };

  function formatarData(dataString: string) {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  if (carregando) return <div>Carregando dados do processo...</div>;
  if (!processo) return <div>Processo não encontrado.</div>;

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
          {[...descricoes]
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((desc) => (
              <div className="detalhado-observacao" key={desc.id}>
                <span className="detalhado-bolinha" />
                <div className="detalhado-textos">
                  <div
                    className="detalhado-data"
                    onDoubleClick={() => iniciarEdicao(desc)}
                  >
                    {editandoId === desc.id ? (
                      <input
                        type="date"
                        value={editandoData}
                        onChange={e => setEditandoData(e.target.value)}
                      />
                    ) : (
                      formatarData(desc.data)
                    )}
                  </div>
                  <div
                    className="detalhado-descricao"
                    onDoubleClick={() => iniciarEdicao(desc)}
                  >
                    {editandoId === desc.id ? (
                      <textarea
                        className="descricao-editando"
                        value={editandoDescricao}
                        onChange={e => setEditandoDescricao(e.target.value)}
                        rows={4}
                      />
                    ) : (
                      desc.descricao
                    )}
                  </div>
                </div>

                {editandoId === desc.id && (
                  <div className="descricao-botoes-edicao">
                    <button onClick={salvarEdicao}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="detalhado-dados-processo">
          <div className="detalhado-info-scroll">
            <div className="detalhado-numero-processo">Nº {processo.numero}</div>
            {processo.subnumero && <div className="detalhado-subnumero">Nº {processo.subnumero}</div>}
            <div>PASTA: {processo.pasta || '—'}</div>
            <div>DATA: {formatarData(processo.data)}</div>
            <div>SITUAÇÃO: {processo.situacao}</div>
            <div>TIPO: {processo.tipo}</div>
            <div>AUTOR: {nomes(processo.autores)}</div>
            <div>RÉU: {nomes(processo.reus)}</div>
            <div>TERCEIRO: {nomes(processo.terceiros)}</div>
            <div>VARA: {processo.vara || '—'}</div>
            <div>CIDADE: {processo.cidade || '—'}</div>
          </div>

          <div className="detalhado-botoes-fixos">
            <button className="detalhado-acao" onClick={() => setMostrarFormDescricao(!mostrarFormDescricao)}>
              DESCRIÇÃO
            </button>
            <button className="detalhado-acao" onClick={() => navigate(`/processos/${id}/valores`)}>
              VALORES
            </button>

            <button
              className="detalhado-acao"
              onClick={() => {
                if (processo) {
                  gerarPDFProcesso(processo, descricoes);
                }
              }}
            >
              RELATÓRIO
            </button>

          </div>

          {mostrarFormDescricao && (
            <div className="descricao-overlay">
              <div className="descricao-popup">
                <button className="descricao-fechar" onClick={() => setMostrarFormDescricao(false)}>×</button>
                <h3>Nova Descrição</h3>
                <input
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                />
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Digite a descrição"
                />
                <button onClick={handleCadastrarDescricao}>Cadastrar</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {mostrarEditar && (
        <EditarProcesso id={Number(id)} onClose={() => setMostrarEditar(false)} />
      )}
    </div>
  );
}
