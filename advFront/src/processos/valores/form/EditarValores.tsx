import React, { useEffect, useState } from 'react';
import {
  buscarValorPorIdDoProcesso,
  atualizarValor,
  deletarValor,
} from '../axios/Requests';
import './FormularioValores.css';
import { useNavigate } from 'react-router-dom';
import ModalConfirmacao from '../../../Honorarios/modal';

interface Parcela {
  valor: string;
  situacao: string;
  dataVencimento: string;
}

interface Props {
  id: number;
  onClose: () => void;
}

export default function EditarValoresProcesso({ id, onClose }: Props) {
  const navigate = useNavigate();
  const [valorTotal, setValorTotal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('boleto');
  const [parcelado, setParcelado] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('');
  const [entrada, setEntrada] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [valorPago, setValorPago] = useState(0);
  const [restante, setRestante] = useState(0);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idValor, setIdValor] = useState<number | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const valor = await buscarValorPorIdDoProcesso(id);
        const valorTotalNumber = parseFloat(valor.valorTotal);
        const entradaValor = parseFloat(valor.entrada || '0');
        const parcelasPagas = valor.parcelas?.filter((p: Parcela) => p.situacao === 'PAGO') || [];
        const valorParcelasPagas = parcelasPagas.reduce(
          (soma: number, p: Parcela) => soma + parseFloat(p.valor),
          0
        );
        const valorPagoCalculado = valorParcelasPagas + entradaValor;
        const restanteCalculado = valorTotalNumber - valorPagoCalculado;

        setValorTotal(valorTotalNumber.toString());
        setEntrada(entradaValor.toFixed(2));
        setValorPago(valorPagoCalculado);
        setRestante(restanteCalculado);
        setParcelado(valor.tipoPagamento === 'PARCELADO');
        setFormaPagamento(valor.formaPagamento || 'boleto');
        setQuantidadeParcelas(valor.quantidadeParcelas?.toString() || '');
        setIdValor(valor.id);

        if (valor.parcelas?.length > 0) {
          const ultimaParcela = valor.parcelas.reduce(
            (maisRecente: Parcela, atual: Parcela) =>
              new Date(atual.dataVencimento) > new Date(maisRecente.dataVencimento) ? atual : maisRecente
          );
          setDiaVencimento(ultimaParcela.dataVencimento.split('T')[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar valor:', error);
        setMensagemErro('Erro ao carregar dados do valor.');
      }
    };

    carregarDados();
  }, [id]);

  useEffect(() => {
    const total = parseFloat(valorTotal) || 0;
    setRestante(total - valorPago);
  }, [valorTotal, valorPago]);

  const calcularParcela = () => {
    const parcelas = parseInt(quantidadeParcelas);
    if (parcelado && !isNaN(restante) && !isNaN(parcelas) && parcelas > 0) {
      return (restante / parcelas).toFixed(2);
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');

    if (!valorTotal ||  idValor === null) {
      setMensagemErro('Dados inválidos.');
      return;
    }

    try {
      const payload = parcelado
        ? {
            valorTotal: parseFloat(valorTotal),
            tipoPagamento: 'PARCELADO' as const,
            quantidadeParcelas: parseInt(quantidadeParcelas),
            diaVencimento,
          }
        : {
            valorTotal: parseFloat(valorTotal),
            tipoPagamento: 'AVISTA' as const,
            formaPagamento,
          };

      await atualizarValor(idValor, payload);
      setMensagemSucesso('Valor atualizado com sucesso!');
      setTimeout(() => {
        setMensagemSucesso('');
        onClose();
      }, 2000);
    } catch (error: any) {
      const mensagemBackend = error?.response?.data?.message || error?.message || 'Erro ao atualizar valor.';
      setMensagemErro(mensagemBackend);
    }
  };

  const excluir = async () => {
    if (idValor === null) return;
    try {
      await deletarValor(idValor);
      navigate(`/processos/${id}`);
    } catch (error) {
      console.error('Erro ao excluir valor:', error);
      alert('Erro ao excluir valor.');
    }
  };

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Valor total</label>
        <input
          type="number"
          placeholder="Valor total"
          value={valorTotal}
          onChange={e => setValorTotal(e.target.value)}
          min="0"
          step="0.01"
        />

        {parcelado ? (
          <>
            <label>Entrada</label>
            <input type="text" value={`R$ ${entrada}`} readOnly />

            <label>Quantidade de parcelas</label>
            <input
              type="number"
              placeholder="Quantidade de parcelas"
              value={quantidadeParcelas}
              onChange={e => setQuantidadeParcelas(e.target.value)}
              min="1"
            />

            <label>Data de vencimento</label>
            <input
              type="date"
              value={diaVencimento}
              onChange={e => setDiaVencimento(e.target.value)}
            />

            <label>Valor já pago</label>
            <input type="text" value={`R$ ${valorPago.toFixed(2)}`} readOnly />

            <label>Restante</label>
            <input type="text" value={`R$ ${restante.toFixed(2)}`} readOnly />

            <label>Valor por parcela</label>
            <input type="text" value={calcularParcela()} readOnly />
          </>
        ) : (
          <>
            <label>Forma de pagamento</label>
            <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
              <option value="boleto">Boleto</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência</option>
            </select>
          </>
        )}

        <button type="submit" className="btn-salvar">SALVAR</button>
        <button type="button" className="btn-excluir" onClick={() => setMostrarConfirmacao(true)}>EXCLUIR</button>
      </form>

      {mensagemErro && <div className="mensagem-erro">{mensagemErro}</div>}
      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}

      {mostrarConfirmacao && (
        <ModalConfirmacao
          mensagem="Tem certeza que deseja excluir este valor? Essa ação não poderá ser desfeita."
          onConfirmar={() => {
            setMostrarConfirmacao(false);
            excluir();
          }}
          onCancelar={() => setMostrarConfirmacao(false)}
        />
      )}
    </div>
  );
}
