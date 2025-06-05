import { useEffect, useState } from 'react';
import './Valores.css';
import { useNavigate, useParams } from 'react-router-dom';

interface Parcela {
  id: number;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: string;
  formaPagamento: string | null;
  situacao: 'PAGO' | 'PENDENTE';
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

  const [valorProcesso, setValorProcesso] = useState<ValorProcesso | null>(null);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<number | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelasPendentes, setParcelasPendentes] = useState<Parcela[]>([]);

  useEffect(() => {
    setValorProcesso({
      id: Number(id),
      valorTotal: 5000,
      tipoPagamento: 'PARCELADO',
      formaPagamento: null,
      situacao: 'PENDENTE',
      entrada: 1000,
      quantidadeParcelas: 4,
      parcelasPagas: 2,
      parcelas: [
        {
          id: 1,
          dataVencimento: '2025-06-01T00:00:00Z',
          dataPagamento: '2025-06-01T00:00:00Z',
          valor: '1000',
          formaPagamento: 'PIX',
          situacao: 'PAGO',
        },
        {
          id: 2,
          dataVencimento: '2025-07-01T00:00:00Z',
          dataPagamento: '2025-07-01T00:00:00Z',
          valor: '1000',
          formaPagamento: 'PIX',
          situacao: 'PAGO',
        },
        {
          id: 3,
          dataVencimento: '2025-08-01T00:00:00Z',
          dataPagamento: null,
          valor: '1000',
          formaPagamento: null,
          situacao: 'PENDENTE',
        },
        {
          id: 4,
          dataVencimento: '2025-09-01T00:00:00Z',
          dataPagamento: null,
          valor: '1000',
          formaPagamento: null,
          situacao: 'PENDENTE',
        },
      ],
    });
  }, [id]);

  if (!valorProcesso) return <div>Carregando...</div>;

  const isParcelado = valorProcesso.tipoPagamento === 'PARCELADO';

  function formatarDataLocal(dataISO: string) {
    if (!dataISO) return '';
    return dataISO.split('T')[0];
  }

return (
  <div className="valores-container">
    <div className="valores-top-bar">
      <button className="valores-btn">EDITAR</button>
      <div className="valores-logo">
        <strong>STASIAK & MAKIAK</strong>
        <div className="valores-sub-logo">Advogados Associados</div>
      </div>
      <a href="#" className="valores-voltar" onClick={() => navigate(-1)}>VOLTAR</a>
    </div>

    <div className="valores-corpo">
      <div className="valores-parcelas">
        {isParcelado && valorProcesso.parcelas.map((parcela) => (
          <div className="valores-parcela" key={parcela.id}>
            <span className="valores-bolinha" />
            <div className="valores-textos">
              <div className="valores-data">{formatarDataLocal(parcela.dataVencimento)}</div>
              <div className="valores-descricao">
                R$ {parcela.valor}{' '}
                <span style={{ color: parcela.situacao === 'PAGO' ? 'green' : 'red' }}>
                  {parcela.situacao}
                </span>
                <br />
                <small>{parcela.formaPagamento ?? ''}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="valores-dados">
        <div className="valores-info-scroll">
          <div className="valores-total">TOTAL: R$ {valorProcesso.valorTotal}</div>
          <div><strong>PAGAMENTO</strong></div>
          <div style={{ color: valorProcesso.situacao === 'PAGO' ? 'green' : 'red' }}>
            <strong>{valorProcesso.situacao ?? 'PENDENTE'}</strong>
          </div>

          {isParcelado ? (
            <>
              <div><strong>QTD PARCELAS:</strong> {valorProcesso.quantidadeParcelas}</div>
              <div><strong>ENTRADA:</strong> {valorProcesso.entrada}</div>
              <div><strong>PARCELAS PAGAS:</strong> {valorProcesso.parcelasPagas}/{valorProcesso.quantidadeParcelas}</div>
            </>
          ) : (
            <>
              <div><strong>FORMA DE PAGAMENTO:</strong> {valorProcesso.formaPagamento}</div>
            </>
          )}
        </div>

        <div className="valores-botoes">
          {isParcelado && (
            <button
              className="valores-acao"
              onClick={() => {
                const pendentes = valorProcesso.parcelas.filter(p => p.situacao === 'PENDENTE');
                setParcelasPendentes(pendentes);
                setMostrarPagamento(true);
              }}
            >
              PAGAR
            </button>
          )}

          <button className="valores-acao">EXTRATO</button>
        </div>
      </div>
    </div>

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
            <button
              onClick={() => {
                if (parcelaSelecionada && formaPagamento) {
                  alert('Pagamento simulado.');
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
