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

      onClose(); 
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

        <label>
          Razão Social:
          <input
            type="text"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          CNPJ:
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Endereço:
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          CEP:
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          UF*:
          <select
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {["SC", "PR", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PE", "PI", "RJ", "RN", "RO", "RR", "RS", "SP", "SE", "TO"].map(sigla => (
              <option key={sigla} value={sigla}>{sigla}</option>
            ))}
          </select>
        </label>

        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Telefone:
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </label>

        <label>
          Representantes*:
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
        </label>

        <label>
          Observações:
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn-confirmar">CONFIRMAR</button>
      </form>
    </div>
  );
}
