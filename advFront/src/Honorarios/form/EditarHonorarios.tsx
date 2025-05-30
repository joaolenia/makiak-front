import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { getProcessoById } from '../../processos/axios/Requests';
import type { HonorarioAvistaDTO } from '../axios/Requests';
import type { HonorarioParceladoDTO, } from '../axios/Requests';
import {
  buscarHonorarioPorId,
  atualizarHonorario,
} from '../axios/Requests';
import { buscarProcessos } from '../../processos/axios/Requests';
import './Formulariohonorario.css';

const customStyles = {
  menu: (provided: any) => ({ ...provided, zIndex: 10000 }),
  option: (provided: any) => ({ ...provided, color: 'black' }),
};

function formatarDataLocal(dataISO: string) {
  console.log(dataISO)
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
          const options = processos.map((p) => ({
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

interface Props {
  id: number;
  onClose: () => void;
}



export default function EditarHonorarios({ id, onClose }: Props) {
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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const honorario = await buscarHonorarioPorId(id);
        const processo = await getProcessoById(honorario.processo.id);

        const valorTotalNumber = parseFloat(honorario.valorTotal);
        const parcelasPagas = honorario.parcelas?.filter(p => p.situacao === 'PAGO') || [];
        const valorPagoCalculado = parcelasPagas.reduce((soma: number, p: { valor: string }) => soma + parseFloat(p.valor), 0);



        setValorTotal(valorTotalNumber.toString());
        setValorPago(valorPagoCalculado);
        setRestante(valorTotalNumber - valorPagoCalculado);
        setParcelado(honorario.tipoPagamento === 'PARCELADO');
        setFormaPagamento(honorario.formaPagamento || 'boleto');
        setQuantidadeParcelas(honorario.quantidadeParcelas?.toString() || '');
        setEntrada(honorario.entrada?.toString() || '');
        if (honorario.parcelas && honorario.parcelas.length > 0) {
          const ultimaParcela = honorario.parcelas.reduce(
            (
              maisRecente: { dataVencimento: string },
              atual: { dataVencimento: string }
            ) => {
              return new Date(atual.dataVencimento) > new Date(maisRecente.dataVencimento)
                ? atual
                : maisRecente;
            }
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
    if (parcelado && restante && quantidadeParcelas) {
      const parcelas = parseInt(quantidadeParcelas);
      if (!isNaN(restante) && !isNaN(parcelas) && parcelas > 0) {
        return (restante / parcelas).toFixed(2);
      }
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
      const mensagemBackend =
        error?.response?.data?.message || error?.message || 'Erro ao atualizar honorário.';
      setMensagemErro(mensagemBackend);
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
            <input
              type="text"
              value={`R$ ${valorPago.toFixed(2)}`}
              readOnly
            />

            <label>Restante</label>
            <input
              type="text"
              value={`R$ ${restante.toFixed(2)}`}
              readOnly
            />

            <label>Valor por parcela</label>
            <input
              type="text"
              value={calcularParcela()}
              readOnly
            />
          </>
        ) : (
          <>
            <label>Forma de pagamento</label>
            <select
              value={formaPagamento}
              onChange={e => setFormaPagamento(e.target.value)}
            >
              <option value="boleto">Boleto</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência</option>
            </select>
          </>
        )}

        <button type="submit" className="btn-confirmar">SALVAR</button>
      </form>

      {mensagemErro && <div className="mensagem-erro">{mensagemErro}</div>}
      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}
    </div>
  );
}

