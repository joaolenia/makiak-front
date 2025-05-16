import React from 'react';
import './FormularioCadastro.css';

export default function FormPessoaFisica() {
  return (
    <div className="formulario-modal">
      <button className="formulario-fechar">X</button>
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
        <button type="submit" className="formulario-btn">CADASTRAR</button>
      </form>
    </div>
  );
}
