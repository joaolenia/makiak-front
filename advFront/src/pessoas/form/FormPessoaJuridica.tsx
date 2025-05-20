import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import './FormularioCadastro.css';
import { criarPessoaJuridica, buscarPessoaFisicaPorNome } from '../axios/Requests';

interface Props {
  onClose: () => void;
}

export default function FormPessoaJuridica({ onClose }: Props) {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    cep: '',
    uf: '',
    email: '',
    telefone: '',
    observacoes: '',
    representantesIds: [] as number[],
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "cnpj" || name === "cep") {
      updatedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setErrorMessage('');
  };

  const handleRepresentantesChange = (selectedOptions: any) => {
    setFormData(prev => ({
      ...prev,
      representantesIds: selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [],
    }));
  };

  const buscarRepresentantes = async (inputValue: string) => {
    try {
      const data = await buscarPessoaFisicaPorNome(inputValue);
      return data.map((p: any) => ({
        label: p.nome,
        value: p.id,
      }));
    } catch {
      return [];
    }
  };

  const debouncedLoadOptions = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      buscarRepresentantes(inputValue).then(callback);
    }, 350),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      razaoSocial, cnpj, endereco, cep, uf, representantesIds,
    } = formData;

    if (!razaoSocial || !cnpj || !endereco || !cep || !uf || representantesIds.length === 0) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await criarPessoaJuridica({
        ...formData,
        email: formData.email || null,
        telefone: formData.telefone || null,
        observacoes: formData.observacoes || null,
      });

      onClose(); // fecha o modal após cadastro
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="cad-formulario-modal">
      <button className="cad-formulario-fechar" onClick={onClose}>X</button>
      <form className="cad-formulario" onSubmit={handleSubmit}>
        {errorMessage && <div className="cad-formulario-erro">{errorMessage}</div>}

        <input type="text" name="razaoSocial" placeholder="Razão Social *" value={formData.razaoSocial} onChange={handleChange} />
        <input type="text" name="cnpj" placeholder="CNPJ *" value={formData.cnpj} onChange={handleChange} />
        <input type="text" name="endereco" placeholder="Endereço *" value={formData.endereco} onChange={handleChange} />
        <input type="text" name="cep" placeholder="CEP *" value={formData.cep} onChange={handleChange} />

        <select name="uf" value={formData.uf} onChange={handleChange}>
          <option value="">UF *</option>
          {["SC", "PR", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PE", "PI", "RJ", "RN", "RO", "RR", "RS", "SP", "SE", "TO"].map(sigla => (
            <option key={sigla} value={sigla}>{sigla}</option>
          ))}
        </select>

        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
        <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} />

        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={debouncedLoadOptions}
          onChange={handleRepresentantesChange}
          placeholder="Buscar representantes..."
          styles={{
            option: (provided) => ({
              ...provided,
              color:'black'
            })
          }}
        />

        <textarea name="observacoes" placeholder="Observações:" value={formData.observacoes} onChange={handleChange} />

        <button type="submit" className="cad-formulario-btn">CADASTRAR</button>
      </form>
    </div>
  );
}
