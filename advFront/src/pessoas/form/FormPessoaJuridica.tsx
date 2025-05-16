import React from 'react';
import './FormularioCadastro.css';

interface Props {
  onClose: () => void;
}

export default function FormPessoaJuridica({ onClose }: Props) {
  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario">
        <input type="text" placeholder="Razão Social" />
        <input type="text" placeholder="CNPJ" />
        <input type="text" placeholder="Endereço" />
        <input type="text" placeholder="CEP" />
        <select><option>UF</option></select>
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Telefone" />
        <input type="text" placeholder="Representante" />
        <textarea placeholder="Observações:" />
        <button type="submit" className="formulario-btn">Cadastrar</button>
      </form>
    </div>
  );
}
