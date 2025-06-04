import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { getProcessoById } from '../../processos/axios/Requests';
import type { HonorarioAvistaDTO, HonorarioParceladoDTO } from '../axios/Requests';
import {
  buscarHonorarioPorId,
  atualizarHonorario,
  deletarHonorario,
} from '../axios/Requests';
import { buscarProcessos } from '../../processos/axios/Requests';
import './Formulariohonorario.css';
import { Navigate, useNavigate } from 'react-router-dom';
import ModalConfirmacao from '../modal';

const customStyles = {
  menu: (provided: any) => ({ ...provided, zIndex: 10000 }),
  option: (provided: any) => ({ ...provided, color: 'black' }),
};



function formatarDataLocal(dataISO: string) {
  if (!dataISO) return '';
  return dataISO.split('T')[0];
}

const carregarProcessos = (() => {
  let timeoutRef: NodeJS.Timeout | null = null;
  return async (inputValue: string) => {
    return new Promise<any[]>(resolve => {
      if (timeoutRef) clearTimeout(timeoutRef);
      timeoutRef = setTimeout(async () => {
        if (!inputValue.trim()) return resolve([]);
        try {
          const processos = await buscarProcessos(inputValue, 2);
          const options = processos.map((p: any) => ({
            value: p.id,
            label: `Nº ${p.numero} | Autor: ${p.autores.join(', ')} | Réu: ${p.reus.join(', ')}`,
          }));
          resolve(options);
        } catch (err) {
          console.error('Erro ao carregar processos:', err);
          resolve([]);
        }
      }, 300);
    });
  };
})();

interface Parcela {
  valor: string;
  situacao: string;
  dataVencimento: string;
}

interface Props {
  id: number;
  onClose: () => void;
}

export default function EditarHonorarios({ id, onClose }: Props) {
  const navigate = useNavigate();
  const [valorTotal, setValorTotal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('boleto');
  const [parcelado, setParcelado] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('');
  const [entrada, setEntrada] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [valorPago, setValorPago] = useState(0);
  const [restante, setRestante] = useState(0);
  const [processoSelecionado, setProcessoSelecionado] = useState<any>(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);


  useEffect(() => {
    const carregarDados = async () => {
      try {
        const honorario = await buscarHonorarioPorId(id);
        const processo = await getProcessoById(honorario.processo.id);
        const valorTotalNumber = parseFloat(honorario.valorTotal);
        const entradaValor = parseFloat(honorario.entrada || '0');
        const parcelasPagas = honorario.parcelas?.filter((p: Parcela) => p.situacao === 'PAGO') || [];
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
        setParcelado(honorario.tipoPagamento === 'PARCELADO');
        setFormaPagamento(honorario.formaPagamento || 'boleto');
        setQuantidadeParcelas(honorario.quantidadeParcelas?.toString() || '');

        if (honorario.parcelas?.length > 0) {
          const ultimaParcela = honorario.parcelas.reduce(
            (maisRecente: Parcela, atual: Parcela) =>
              new Date(atual.dataVencimento) > new Date(maisRecente.dataVencimento) ? atual : maisRecente
          );
          setDiaVencimento(formatarDataLocal(ultimaParcela.dataVencimento));
        }

        setProcessoSelecionado({
          value: processo.id,
          label: `Nº ${processo.numero} | Autor: ${processo.autores.join(', ')} | Réu: ${processo.reus.join(', ')}`,
        });
      } catch (error) {
        console.error('Erro ao carregar honorário:', error);
        setMensagemErro('Erro ao carregar dados do honorário.');
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

    const processoId = processoSelecionado?.value;
    if (!processoId || !valorTotal) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const payload: HonorarioParceladoDTO | HonorarioAvistaDTO = parcelado
        ? {
            valorTotal: parseFloat(valorTotal),
            tipoPagamento: 'PARCELADO',
            quantidadeParcelas: parseInt(quantidadeParcelas),
            diaVencimento,
            processoId: Number(processoId),
          }
        : {
            valorTotal: parseFloat(valorTotal),
            tipoPagamento: 'AVISTA',
            formaPagamento,
            processoId: Number(processoId),
          };

      await atualizarHonorario(id, payload);

      setMensagemSucesso('Honorário atualizado com sucesso!');
      setTimeout(() => {
        setMensagemSucesso('');
        onClose();
      }, 2000);
    } catch (error: any) {
      const mensagemBackend = error?.response?.data?.message || error?.message || 'Erro ao atualizar honorário.';
      setMensagemErro(mensagemBackend);
    }
  };

const excluir = async () => {
  try {
    await deletarHonorario(Number(id));
    alert('Honorário excluído com sucesso.');
    navigate('/honorarios');
  } catch (error) {
    console.error('Erro ao excluir honorário:', error);
    alert('Erro ao excluir honorário.');
  }
};



  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Processo</label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={carregarProcessos}
          placeholder="Buscar processo por nome do autor..."
          styles={customStyles}
          value={processoSelecionado}
          onChange={setProcessoSelecionado}
          isClearable
        />

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
         <button  type="button" className="btn-excluir" onClick={() => setMostrarConfirmacao(true)}>EXCLUIR</button>

      </form>

      {mensagemErro && <div className="mensagem-erro">{mensagemErro}</div>}
      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}

        {mostrarConfirmacao && (
        <ModalConfirmacao
          mensagem="Tem certeza que deseja excluir este honorário? Essa ação não poderá ser desfeita."
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
