// EditarPessoaJuridica.tsx
import React from 'react';
import './FormularioEdicao.css';

export default function EditarPessoaJuridica() {
  return (
    <div className="formulario-modal">
      <button className="formulario-fechar">X</button>
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
        <div className="formulario-botoes">
          <button type="button" className="btn-excluir">EXCLUIR</button>
          <button type="submit" className="btn-confirmar">CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}
