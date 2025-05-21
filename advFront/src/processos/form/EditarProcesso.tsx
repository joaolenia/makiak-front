import React, { useEffect, useState, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import './FormularioProcesso.css';
import { getProcessoById, updateProcesso } from '../axios/Requests';
import {
  buscarPessoaFisicaPorNome,
  buscarPessoaJuridicPorNome,
} from '../../pessoas/axios/Requests';

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    maxHeight: 160,
    overflowY: 'auto',
    zIndex: 10000,
  }),
  option: (provided: any) => ({
    ...provided,
    color: 'black',
    fontWeight: 'bold',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontWeight: 'bold',
  }),
};

interface OptionType {
  value: number;
  label: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
}

interface Props {
  id: number;
  onClose: () => void;
}

export default function EditarProcesso({ id, onClose }: Props) {
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    pasta: '',
    cidade: '',
    vara: '',
    data: '',
    valorCausa: '',
    situacao: '',
    autores: [] as OptionType[],
    reus: [] as OptionType[],
    terceiros: [] as OptionType[],
  });

  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getProcessoById(id);
        setFormData({
          numero: dados.numero,
          tipo: dados.tipo,
          pasta: dados.pasta || '',
          cidade: dados.cidade,
          vara: dados.vara,
          data: dados.data,
          valorCausa: String(dados.valorCausa),
          situacao: dados.situacao,
          autores: dados.autores.map((a: any) => ({
            label: a.nome,
            value: a.id,
            tipoPessoa: a.tipoPessoa,
          })),
          reus: dados.reus.map((r: any) => ({
            label: r.nome,
            value: r.id,
            tipoPessoa: r.tipoPessoa,
          })),
          terceiros: dados.terceiros.map((t: any) => ({
            label: t.nome,
            value: t.id,
            tipoPessoa: t.tipoPessoa,
          })),
        });
      } catch {
        setErro('Erro ao carregar dados do processo.');
      }
    }

    carregar();
  }, [id]);

  const debouncedBuscarPessoas = useMemo(() => {
    let timeout: NodeJS.Timeout;

    return (inputValue: string, callback: (options: OptionType[]) => void) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const [fisicas, juridicas] = await Promise.all([
          buscarPessoaFisicaPorNome(inputValue),
          buscarPessoaJuridicPorNome(inputValue),
        ]);

        const opFisicas = fisicas.map((p: any) => ({
          value: p.id,
          label: p.nome,
          tipoPessoa: 'FISICA' as const,
        }));

        const opJuridicas = juridicas.map((p: any) => ({
          value: p.id,
          label: p.razaoSocial,
          tipoPessoa: 'JURIDICA' as const,
        }));

        callback([...opFisicas, ...opJuridicas]);
      }, 300);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: 'autores' | 'reus' | 'terceiros') => (selected: any) => {
    setFormData((prev) => ({ ...prev, [field]: selected || [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProcesso(id, {
        ...formData,
        valorCausa: parseFloat(formData.valorCausa),
        autores: formData.autores.map((a) => ({ id: a.value, tipoPessoa: a.tipoPessoa })),
        reus: formData.reus.map((r) => ({ id: r.value, tipoPessoa: r.tipoPessoa })),
        terceiros: formData.terceiros.map((t) => ({ id: t.value, tipoPessoa: t.tipoPessoa })),
      });

      onClose();
    } catch {
      setErro('Erro ao atualizar processo.');
    }
  };

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        {erro && <div className="formulario-erro">{erro}</div>}

        <input name="numero" value={formData.numero} onChange={handleChange} placeholder="Nº" />
        <input name="tipo" value={formData.tipo} onChange={handleChange} placeholder="Tipo" />
        <input name="pasta" value={formData.pasta} onChange={handleChange} placeholder="Pasta" />
        <input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" />
        <input name="vara" value={formData.vara} onChange={handleChange} placeholder="Vara" />
        <input name="data" type="date" value={formData.data} onChange={handleChange} />
        <input name="valorCausa" value={formData.valorCausa} onChange={handleChange} placeholder="Valor da Causa" />

        <select name="situacao" value={formData.situacao} onChange={handleChange}>
          <option value="">Situação</option>
          <option value="EM ANDAMENTO">Em Andamento</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="SUSPENSO">Suspenso</option>
        </select>

        <AsyncSelect
          isMulti
          loadOptions={debouncedBuscarPessoas}
          onChange={handleSelectChange('autores')}
          value={formData.autores}
          placeholder="Autor(es) *"
          classNamePrefix="cadpro-select-multiplos"
          styles={customStyles}
          defaultOptions
          cacheOptions
        />
        <AsyncSelect
          isMulti
          loadOptions={debouncedBuscarPessoas}
          onChange={handleSelectChange('reus')}
          value={formData.reus}
          placeholder="Réu(s) *"
          classNamePrefix="cadpro-select-multiplos"
          styles={customStyles}
          defaultOptions
          cacheOptions
        />
        <AsyncSelect
          isMulti
          loadOptions={debouncedBuscarPessoas}
          onChange={handleSelectChange('terceiros')}
          value={formData.terceiros}
          placeholder="Terceiro(s)"
          classNamePrefix="cadpro-select-multiplos"
          styles={customStyles}
          defaultOptions
          cacheOptions
        />

        <div className="formulario-botoes">
          <button type="submit" className="btn-confirmar">CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}
