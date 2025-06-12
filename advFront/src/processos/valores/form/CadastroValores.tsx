import React, { useState } from 'react';
import './FormularioValores.css';
import { criarValorAvista, criarValorParcelado } from '../axios/Requests';

interface Props {
  onClose: () => void;
  processoId: number;
}

export default function CadastroValores({ onClose, processoId }: Props) {
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('boleto');
  const [parcelado, setParcelado] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('');
  const [entrada, setEntrada] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');

  const valorComDesconto = () => parseFloat(valorTotal) || 0;

  const calcularParcela = () => {
    if (parcelado && valorTotal && quantidadeParcelas) {
      const valor = valorComDesconto() - (parseFloat(entrada) || 0);
      const parcelas = parseInt(quantidadeParcelas);
      if (!isNaN(valor) && !isNaN(parcelas) && parcelas > 0) {
        return (valor / parcelas).toFixed(2);
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');

    if (!valorTotal) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
      return;
    }

    const valorTotalNumber = parseFloat(valorTotal);
    const entradaNumber = parseFloat(entrada) || undefined;

    try {
      if (parcelado) {
        await criarValorParcelado({
          valorTotal: valorTotalNumber,
          tipoPagamento: 'PARCELADO',
          quantidadeParcelas: parseInt(quantidadeParcelas),
          entrada: entradaNumber,
          diaVencimento: diaVencimento,
          processoId: processoId,
        });
      } else {
        await criarValorAvista({
          valorTotal: valorTotalNumber,
          tipoPagamento: 'AVISTA',
          formaPagamento,
          processoId: processoId,
        });
      }

      setMensagemSucesso('Valor cadastrado com sucesso!');
      setValorTotal('');
      setParcelado(false);
      setQuantidadeParcelas('');
      setEntrada('');
      setFormaPagamento('boleto');
      setDiaVencimento('');

      setTimeout(() => {
        setMensagemSucesso('');
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const mensagemBackend =
        error?.response?.data?.message ||
        error?.message ||
        'Erro desconhecido ao cadastrar valor.';
      setMensagemErro(mensagemBackend);
    }
  };

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Valor total"
          value={valorTotal}
          onChange={e => setValorTotal(e.target.value)}
          min="0"
          step="0.01"
        />

        <div className="opcoes-pagamento">
          <label>
            <input
              type="radio"
              checked={!parcelado}
              onChange={() => setParcelado(false)}
            />
            À vista
          </label>
          <label>
            <input
              type="radio"
              checked={parcelado}
              onChange={() => setParcelado(true)}
            />
            Parcelado
          </label>
        </div>

        <select
          value={formaPagamento}
          onChange={e => setFormaPagamento(e.target.value)}
          disabled={parcelado}
        >
          <option value="boleto">Boleto</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">PIX</option>
          <option value="transferencia">Transferência</option>
        </select>

        {parcelado && (
          <>
            <input
              type="number"
              placeholder="Quantidade de parcelas"
              value={quantidadeParcelas}
              onChange={e => setQuantidadeParcelas(e.target.value)}
              min="1"
            />

            <input
              type="date"
              placeholder="Dia de vencimento das parcelas"
              value={diaVencimento}
              onChange={e => setDiaVencimento(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Entrada (opcional)"
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
              min="0"
              step="0.01"
            />

            <input
              type="text"
              placeholder="Valor por parcela"
              value={calcularParcela()}
              readOnly
            />
          </>
        )}

        <button type="submit" className="btn-cadastrar">CADASTRAR</button>
      </form>

      {mensagemErro && <div className="mensagem-erro">{mensagemErro}</div>}
      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}
    </div>
  );
}
