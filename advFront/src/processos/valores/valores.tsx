import { useEffect, useState } from 'react';
import './Valores.css';
import CadastroValores from './form/CadastroValores';
import { gerarPDFExtratoValores } from './relatorios/relatorios';

import { useNavigate, useParams } from 'react-router-dom';
import {
  buscarValorPorIdDoProcesso,
  pagarParcela as apiPagarParcela,
  rollbackParcela
} from './axios/Requests';
import EditarValoresProcesso from './form/EditarValores';

interface Parcela {
  id: number;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: string;
  formaPagamento: string | null;
  situacao: 'PAGO' | 'PENDENTE';
  observacoes?: string | null;
}

interface ValorProcesso {
  id: number;
  valorTotal: number;
  tipoPagamento: 'AVISTA' | 'PARCELADO';
  formaPagamento: string | null;
  situacao: string | null;
  entrada?: number | null;
  quantidadeParcelas?: number | null;
  parcelasPagas: number;
  parcelas: Parcela[];
}

export default function ValoresDetalhado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [valorProcesso, setValorProcesso] = useState<ValorProcesso | null>(null);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<number | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelasPendentes, setParcelasPendentes] = useState<Parcela[]>([]);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [editandoParcelaId, setEditandoParcelaId] = useState<number | null>(null);
  const [descricaoParcela, setDescricaoParcela] = useState('');
  const [modoRollback, setModoRollback] = useState<0 | 1>(0);

  const carregarDados = async () => {
    try {
      const dados = await buscarValorPorIdDoProcesso(Number(id));
      setValorProcesso(dados);
    } catch (err) {
      console.error(err);
      setValorProcesso(null);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const isParcelado = valorProcesso?.tipoPagamento === 'PARCELADO';

  const formatarData = (dt: string) => {
    if (!dt) return '—';
    const [ano, mes, dia] = dt.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const abrirPagamento = () => {
    if (!valorProcesso) return;
    const pend = valorProcesso.parcelas?.filter(p => p.situacao === 'PENDENTE') ?? [];
    setParcelasPendentes(pend);
    setMostrarPagamento(true);
  };

  const confirmarPagamento = async () => {
    if (!parcelaSelecionada || !formaPagamento) {
      alert('Selecione parcela e forma de pagamento');
      return;
    }
    try {
      await apiPagarParcela(parcelaSelecionada, formaPagamento);
      await carregarDados();
      setMostrarPagamento(false);
    } catch (err) {
      console.error(err);
      alert('Erro no pagamento');
    }
  };

  const iniciarEdicaoParcela = (parcela: Parcela) => {
    setEditandoParcelaId(parcela.id);
    setDescricaoParcela(parcela.observacoes ?? '');
    setModoRollback(0);
  };

  const salvarEdicaoParcela = async () => {
    if (!editandoParcelaId) return;
    try {
      await rollbackParcela(editandoParcelaId, modoRollback, descricaoParcela);
      await carregarDados();
      cancelarEdicaoParcela();
    } catch (error) {
      console.error('Erro ao salvar edição da parcela:', error);
      alert('Erro ao salvar edição da parcela');
    }
  };

  const cancelarEdicaoParcela = () => {
    setEditandoParcelaId(null);
    setDescricaoParcela('');
    setModoRollback(0);
  };

  return (
    <div className="valores-container">
      <div className="valores-top-bar">
        <button className="valores-btn" onClick={() => setMostrarEdicao(true)}>EDITAR</button>
        <div className="valores-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="valores-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="valores-voltar" onClick={() => navigate(-1)}>VOLTAR</a>
      </div>

      <div className="valores-corpo">
        <div className="valores-parcelas">
          {isParcelado && valorProcesso?.parcelas?.length > 0 && valorProcesso.parcelas.map(p => (
            <div className="valores-parcela" key={p.id} onDoubleClick={() => iniciarEdicaoParcela(p)}>
              <span className="valores-bolinha" />
              <div className="valores-textos">
                <div className="valores-data">{formatarData(p.dataVencimento)}</div>
                {editandoParcelaId === p.id ? (
                  <div className="honorario-edicao">
                    <textarea
                      value={descricaoParcela}
                      onChange={e => setDescricaoParcela(e.target.value)}
                      rows={3}
                      placeholder="Observações"
                    />
                    {p.situacao === 'PAGO' && (
                      <label>
                        <input
                          type="checkbox"
                          checked={modoRollback === 1}
                          onChange={e => setModoRollback(e.target.checked ? 1 : 0)}
                        />
                        Reverter pagamento (marcar como pendente)
                      </label>
                    )}
                    <div className="honorario-edicao-botoes">
                      <button className='edit-save-v' onClick={salvarEdicaoParcela}>Salvar</button>
                      <button className='edit-cancel-v' onClick={cancelarEdicaoParcela}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="valores-descricao">
                    R$ {p.valor}{' '}
                    <span style={{ color: p.situacao === 'PAGO' ? 'green' : 'red' }}>{p.situacao}</span>
                    <br /><small>{p.formaPagamento ?? ''}</small>
                    {p.observacoes && (
                      <div className="honorario-observacoes">
                        <strong>Observações:</strong> {p.observacoes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="valores-dados">
          <div className="valores-info-scroll">
            <div className="valores-total">
              TOTAL: R$ {valorProcesso?.valorTotal ?? '---'}
            </div>
            <div><strong>PAGAMENTO</strong></div>
            <div style={{ color: valorProcesso?.situacao === 'PAGO' ? 'green' : 'red' }}>
              <strong>{valorProcesso?.situacao ?? '---'}</strong>
            </div>

            {isParcelado ? (
              <>
                <div><strong>QTD PARCELAS:</strong> {valorProcesso?.quantidadeParcelas}</div>
                <div><strong>ENTRADA:</strong> R$ {valorProcesso?.entrada}</div>
                <div><strong>PAGAS:</strong> {valorProcesso?.parcelasPagas}/{valorProcesso?.quantidadeParcelas}</div>
              </>
            ) : (
              <div><strong>FORMA:</strong> {valorProcesso?.formaPagamento ?? '---'}</div>
            )}
          </div>

          <div className="valores-botoes">
            {isParcelado && (
              <button className="valores-acao" onClick={abrirPagamento}>PAGAR</button>
            )}
            <button
              className="valores-acao"
              onClick={() => {
                if (valorProcesso) gerarPDFExtratoValores(valorProcesso);
              }}
            >
              EXTRATO
            </button>
            {!valorProcesso && (
              <button className="valores-acao" onClick={() => setMostrarCadastro(true)}>
                NOVO VALOR
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarPagamento && (
        <div className="pagamento-modal">
          <div className="pagamento-formulario">
            <button className="pagamento-close" onClick={() => setMostrarPagamento(false)}>×</button>
            <h3>Pagamento de Parcela</h3>

            <label>Parcela</label>
            <select value={parcelaSelecionada ?? ''} onChange={e => setParcelaSelecionada(Number(e.target.value))}>
              <option value="">-- selecione --</option>
              {parcelasPendentes.map(p => (
                <option key={p.id} value={p.id}>
                  {formatarData(p.dataVencimento)} - R$ {p.valor}
                </option>
              ))}
            </select>

            <label>Forma de Pagamento</label>
            <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
              <option value="">-- selecione --</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">Pix</option>
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="CARTAO">Cartão</option>
              <option value="BOLETO">Boleto</option>
            </select>

            <div className="pagamento-botoes">
              <button onClick={confirmarPagamento}>Confirmar</button>
              <button onClick={() => setMostrarPagamento(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarCadastro && (
        <CadastroValores
          processoId={Number(id)}
          onClose={async () => {
            setMostrarCadastro(false);
            await carregarDados(); // ← atualiza após cadastro
          }}
        />
      )}
      {mostrarEdicao && valorProcesso && (
        <EditarValoresProcesso
          id={Number(id)}
          onClose={async () => {
            setMostrarEdicao(false);
            await carregarDados(); // ← atualiza após edição
          }}
        />
      )}
    </div>
  );
}
