import React, { useState } from 'react';
import Select from 'react-select';
import  './Formulariohonorario.css'

const opcoesProcessos = [
  { value: 'proc1', label: 'N° 12327466456| Réu: João Pedro| Autor: Carlos| Valor da Causa: R$3000',  },
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

export default function CadastroHonorarios({ onClose }: Props) {
  const [valorTotal, setValorTotal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('boleto');
  const [parcelado, setParcelado] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('');
  const [desconto, setDesconto] = useState(''); // valor desconto opcional

  // Função que retorna o valor total já descontado
  const valorComDesconto = () => {
    const total = parseFloat(valorTotal) || 0;
    const desc = parseFloat(desconto) || 0;
    return total - desc >= 0 ? total - desc : 0;
  };

  // calcular valor da parcela
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
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario">
        <Select 
          options={opcoesProcessos} 
          placeholder="Processo"
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
              placeholder="Entrada (opcional)" 
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

        <button type="submit" className="btn-cadastrar">CADASTRAR</button>
      </form>
    </div>
  );
}
