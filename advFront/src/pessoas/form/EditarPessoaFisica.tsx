import React from 'react';
import './FormularioEdicao.css';

interface Props {
  onClose: () => void;
}

export default function EditarPessoaFisica({ onClose }: Props) {
  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario">
        <input type="text" placeholder="Nome" />
        <input type="text" placeholder="Nacionalidade" />
        <input type="text" placeholder="Estado Civil" />
        <input type="text" placeholder="Profissão" />
        <input type="text" placeholder="RG" />
        <input type="text" placeholder="Órgão expedidor" />
        <input type="text" placeholder="CPF" />
        <input type="text" placeholder="Endereço" />
        <input type="text" placeholder="CEP" />
        <select><option>UF</option></select>
        <input type="email" placeholder="E-mail" />
        <input type="text" placeholder="WhatsApp" />
        <input type="text" placeholder="Telefone" />
        <textarea placeholder="Observações:" />
        <div className="formulario-botoes">
          <button type="button" className="btn-excluir">EXCLUIR</button>
          <button type="submit" className="btn-confirmar">CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}
