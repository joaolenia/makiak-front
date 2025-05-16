import React from 'react';
import Select from 'react-select';
import './FormularioProcesso.css';

const opcoesPessoas = [
  { value: 'joao', label: 'João da Silva' },
  { value: 'maria', label: 'Maria Oliveira' },
  { value: 'empresa_x', label: 'Empresa X' }
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

export default function CadastroProcesso({ onClose }: { onClose: () => void }) {
  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario">
        <input type="text" placeholder="Nº" />
        <input type="text" placeholder="Tipo" />
        <input type="text" placeholder="Pasta" />

        <Select 
          isMulti 
          options={opcoesPessoas} 
          placeholder="Autor"
          className="select-multiplos"
          classNamePrefix="select-multiplos"
          styles={customStyles}
        />

        <Select 
          isMulti 
          options={opcoesPessoas} 
          placeholder="Réu"
          className="select-multiplos"
          classNamePrefix="select-multiplos"
          styles={customStyles}
        />

        <Select 
          isMulti 
          options={opcoesPessoas} 
          placeholder="Terceiro"
          className="select-multiplos"
          classNamePrefix="select-multiplos"
          styles={customStyles}
        />

        <input type="text" placeholder="Cidade" />
        <input type="text" placeholder="Vara" />
        <input type="date" placeholder="Data" />
        <input type="text" placeholder="Valor da Causa" />

        <select>
          <option value="">Situação</option>
          <option value="andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="suspenso">Suspenso</option>
        </select>

        <button type="submit" className="btn-cadastrar">CADASTRAR</button>
      </form>
    </div>
  );
}
