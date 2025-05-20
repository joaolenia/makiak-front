import React, { useState, useEffect, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import './FormularioEdicao.css';
import {
  getPessoaJuridicaById,
  updatePessoaJuridica,
  buscarPessoaFisicaPorNome,
} from '../axios/Requests';
import type { PessoaJuridicaDetalhes } from '../axios/Requests';

interface Props {
  id: string;
  onClose: () => void;
}

export default function EditarPessoaJuridica({ id, onClose }: Props) {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    cep: '',
    uf: '',
    email: '',
    telefone: '',
    observacoes: '',
    representantes: [] as { label: string; value: number }[],
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const data: PessoaJuridicaDetalhes = await getPessoaJuridicaById(id);
        setFormData({
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          endereco: data.endereco,
          cep: data.cep,
          uf: data.uf,
          email: data.email || '',
          telefone: data.telefone || '',
          observacoes: data.observacoes || '',
          representantes: data.representantes.map(rep => ({
            label: rep.nome,
            value: rep.id,
          })),
        });
      } catch (error) {
        setErrorMessage('Erro ao carregar dados da pessoa jurídica.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue = ['cnpj', 'cep'].includes(name) ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setErrorMessage('');
  };

  const handleRepresentantesChange = (selectedOptions: any) => {
    setFormData(prev => ({
      ...prev,
      representantes: selectedOptions || [],
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

    const { razaoSocial, cnpj, endereco, cep, uf, representantes } = formData;

    if (!razaoSocial || !cnpj || !endereco || !cep || !uf || representantes.length === 0) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await updatePessoaJuridica(id, {
        ...formData,
        representantesIds: representantes.map(r => r.value),
        email: formData.email || null,
        telefone: formData.telefone || null,
        observacoes: formData.observacoes || null,
      });

      onClose(); // fecha o modal após edição
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erro ao salvar alterações.';
      setErrorMessage(msg);
    }
  };

  if (isLoading) return <div className="formulario-modal">Carregando...</div>;

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        {errorMessage && <div className="formulario-erro">{errorMessage}</div>}

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
          value={formData.representantes}
          placeholder="Buscar representantes..."
          styles={{ option: (provided) => ({ ...provided, color: 'black' }) }}
        />

        <textarea name="observacoes" placeholder="Observações:" value={formData.observacoes} onChange={handleChange} />

        <button type="submit" className="btn-confirmar">CONFIRMAR</button>
      </form>
    </div>
  );
}
