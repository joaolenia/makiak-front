import { useEffect, useState } from 'react';
import './HonorarioDetalhado.css';
import { useParams, useNavigate } from 'react-router-dom';
import EditarHonorarios from './form/EditarHonorarios';
import { buscarHonorarioPorId, rollbackParcela } from './axios/Requests';
import { gerarPDFHonorario } from './relatorios/gerarPdfHonorario';
import { pagarParcela } from './axios/Requests';

interface Parcela {
  id: number;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: string;
  formaPagamento: string | null;
  situacao: 'PAGO' | 'PENDENTE';
  observacoes?: string | null;
}

interface Honorario {
  id: number;
  valorTotal: number;
  tipoPagamento: 'AVISTA' | 'PARCELADO';
  formaPagamento: string | null;
  situacao: string | null;
  entrada?: number | null;
  quantidadeParcelas?: number | null;
  parcelasPagas: number;
  parcelas: Parcela[];
  processo: ProcessoResumo[];
}
interface ProcessoResumo {
  id: number;
  numero: string;
  pasta: string;
  tipo: string;
  cidade: string;
  vara: string;
  valorCausa: string;
  situacao: string;
}


export default function HonorariosDetalhado() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [honorario, setHonorario] = useState<Honorario | null>(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<number | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelasPendentes, setParcelasPendentes] = useState<Parcela[]>([]);
  const [editandoParcelaId, setEditandoParcelaId] = useState<number | null>(null);
  const [descricaoParcela, setDescricaoParcela] = useState('');
  const [modoRollback, setModoRollback] = useState<0 | 1>(0);




  useEffect(() => {
    if (id) {
      buscarHonorarioPorId(Number(id)).then(setHonorario);
    }
  }, [id]);

  if (!honorario) return <div>Carregando...</div>;

  const isParcelado = honorario.tipoPagamento === 'PARCELADO';

  const iniciarEdicaoParcela = (parcela: Parcela) => {
    setEditandoParcelaId(parcela.id);
    setDescricaoParcela(parcela.observacoes ?? '');
    setModoRollback(0);
  };


  const salvarEdicaoParcela = async () => {
    if (!editandoParcelaId) return;
    try {
      await rollbackParcela(editandoParcelaId, modoRollback, descricaoParcela);
      const atualizado = await buscarHonorarioPorId(Number(id));
      setHonorario(atualizado);
      cancelarEdicaoParcela();
    } catch (error) {
      console.error('Erro ao salvar edição da parcela:', error);
    }
  };

  const cancelarEdicaoParcela = () => {
    setEditandoParcelaId(null);
    setDescricaoParcela('');
    setModoRollback(0);
  };



function formatarDataLocal(dataISO: string) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}





  return (
    <div className="honorario-container">
      <div className="honorario-top-bar">
        <button className="honorario-btn" onClick={() => setMostrarEditar(true)}>EDITAR</button>
        <div className="honorario-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="honorario-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="honorario-voltar" onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}>VOLTAR</a>

      </div>

      <div className="honorario-corpo">
        <div className="honorario-parcelas">
          {isParcelado && honorario.parcelas.map((parcela) => (
            <div
              className="honorario-parcela"
              key={parcela.id}
              onDoubleClick={() => iniciarEdicaoParcela(parcela)}
            >
              <span className="honorario-bolinha" />
              <div className="honorario-textos">
                <div className="honorario-data">{formatarDataLocal(parcela.dataVencimento)}</div>

                {editandoParcelaId === parcela.id ? (
                  <div className="honorario-edicao">
                    <textarea
                      value={descricaoParcela}
                      onChange={e => setDescricaoParcela(e.target.value)}
                      rows={3}
                      placeholder="Observações"
                    />
                    {parcela.situacao === 'PAGO' && (
                      <label>
                        <input
                          type="checkbox"
                          checked={modoRollback === 1}
                          onChange={(e) => setModoRollback(e.target.checked ? 1 : 0)}
                        />
                        Reverter pagamento (marcar como pendente)
                      </label>
                    )}
                    <div className="honorario-edicao-botoes">
                      <button className='edit-save' onClick={salvarEdicaoParcela}>Salvar</button>
                      <button className='edit-cancel' onClick={cancelarEdicaoParcela}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="honorario-descricao">
                    <div>
                      <strong>Valor:</strong> R$ {parcela.valor}{' '}
                      <span style={{ color: parcela.situacao === 'PAGO' ? 'green' : 'red' }}>
                        ({parcela.situacao})
                      </span>
                    </div>
                    {parcela.formaPagamento && (
                      <div><strong>Forma de Pagamento:</strong> {parcela.formaPagamento}</div>
                    )}
                    {parcela.observacoes && (
                      <div className="honorario-observacoes">
                        <strong>Observações:</strong> {parcela.observacoes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}


        </div>

        <div className="honorario-dados">
          <div className="honorario-info-scroll">
            <div className="honorario-total">TOTAL: R$ {honorario.valorTotal}</div>
            <div><strong>PAGAMENTO</strong></div>
            <div style={{ color: honorario.situacao === 'PAGO' ? 'green' : 'red' }}>
              <strong>{honorario.situacao ?? 'PENDENTE'}</strong>
            </div>

            {isParcelado ? (
              <>
                <div><strong>QTD PARCELAS:</strong> {honorario.quantidadeParcelas}</div>
                <div><strong>ENTRADA:</strong> {honorario.entrada}</div>
                <div><strong>PARCELAS PAGAS:</strong> {honorario.parcelasPagas}/{honorario.quantidadeParcelas}</div>
              </>
            ) : (
              <>
                <div><strong>FORMA DE PAGAMENTO:</strong> {honorario.formaPagamento}</div>
              </>
            )}
          </div>

          <div className="honorario-botoes">
            {honorario.tipoPagamento === 'PARCELADO' && (
              <button

                className="honorario-acao"
                onClick={(e) => {
                  e.stopPropagation();
                  const pendentes = honorario.parcelas.filter(p => p.situacao === 'PENDENTE');
                  setParcelasPendentes(pendentes);
                  setMostrarPagamento(true);
                }}
              >
                PAGAR
              </button>

            )}

            <button className="honorario-acao" onClick={() => gerarPDFHonorario(honorario)}>EXTRATO</button>

          </div>
        </div>
      </div>

      {mostrarEditar && (
        <EditarHonorarios
          id={Number(id)}
          onClose={async () => {
            setMostrarEditar(false);
            const atualizado = await buscarHonorarioPorId(Number(id));
            setHonorario(atualizado);
          }}
        />
      )}

      {mostrarPagamento && (
        <div className="pagamento-modal">
          <div className="pagamento-formulario">
            <button className="pagamento-close" onClick={() => setMostrarPagamento(false)}>×</button>
            <h3>Pagamento de Parcela</h3>

            <label>Selecione a parcela:</label>
            <select
              value={parcelaSelecionada ?? ''}
              onChange={(e) => setParcelaSelecionada(Number(e.target.value))}
            >
              <option value="">-- Selecione --</option>
              {parcelasPendentes.map(parcela => (
                <option key={parcela.id} value={parcela.id}>
                  {formatarDataLocal(parcela.dataVencimento)} - R$ {parcela.valor}
                </option>
              ))}
            </select>

            <label>Forma de pagamento:</label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">Pix</option>
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="CARTAO">Cartão</option>
              <option value="BOLETO">Boleto</option>
            </select>

            <div className="pagamento-botoes">
              <button className='confirm-pagamento'
                onClick={async () => {
                  if (parcelaSelecionada && formaPagamento) {
                    await pagarParcela(parcelaSelecionada, formaPagamento);
                    const atualizado = await buscarHonorarioPorId(Number(id));
                    setHonorario(atualizado);
                    setMostrarPagamento(false);
                    setParcelaSelecionada(null);
                    setFormaPagamento('');
                  } else {
                    alert('Selecione a parcela e a forma de pagamento.');
                  }
                }}
              >
                Confirmar Pagamento
              </button>
              <button onClick={() => setMostrarPagamento(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
