import React, { useState } from 'react';
import Select from 'react-select';
import  './Formulariohonorario.css'

const opcoesProcessos = [
  { value: 'proc1', label: 'Processo 1' },
  { value: 'proc2', label: 'Processo 2' },
  { value: 'proc3', label: 'Processo 3' }
];

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    zIndex: 10000,
  }),
  option: (provided: any) => ({
    ...provided,
    color: 'black',
  }),
};
interface Props {
  onClose: () => void;
}
export default function EditarHonorarios({onClose}:Props) {
  const [valorTotal, setValorTotal] = useState('1000'); // Exemplo valor inicial
  const [formaPagamento, setFormaPagamento] = useState('boleto');
  const [parcelado, setParcelado] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('1');
  const [desconto, setDesconto] = useState(''); // valor desconto opcional
  const [processoSelecionado, setProcessoSelecionado] = useState(opcoesProcessos[0]);

  const valorComDesconto = () => {
    const total = parseFloat(valorTotal) || 0;
    const desc = parseFloat(desconto) || 0;
    return total - desc >= 0 ? total - desc : 0;
  };

  const calcularParcela = () => {
    if (parcelado && valorTotal && quantidadeParcelas) {
      const valor = valorComDesconto();
      const parcelas = parseInt(quantidadeParcelas);
      if (!isNaN(valor) && !isNaN(parcelas) && parcelas > 0) {
        return (valor / parcelas).toFixed(2);
      }
    }
    return '';
  };

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar"  onClick={onClose}>X</button>
      <form className="formulario">
        <Select 
          options={opcoesProcessos} 
          placeholder="Processo"
          value={processoSelecionado}
          styles={customStyles}
        />

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
              type="number" 
              placeholder="Desconto (opcional)" 
              value={desconto} 
              onChange={e => setDesconto(e.target.value)} 
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

        <div className="formulario-botoes">
          <button type="button" className="btn-excluir">EXCLUIR</button>
          <button type="submit" className="btn-confirmar">CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}
