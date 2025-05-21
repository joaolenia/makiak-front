import React, { useState, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import './FormularioProcesso.css';
import { createProcesso } from '../axios/Requests';
import { buscarPessoaFisicaPorNome, buscarPessoaJuridicPorNome } from '../../pessoas/axios/Requests';

interface OptionType {
  value: number;
  label: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
}

const customStyles = {
   menu: (provided: any) => ({
    ...provided,
    maxHeight: 160, // Aproximadamente 4 itens (~40px cada)
    overflowY: 'auto',
    zIndex: 10000, // Garante que fique sobreposto
  }),
  option: (provided: any) => ({ ...provided, color: 'black' }),
}


export default function CadastroProcesso({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    pasta: '',
    cidade: '',
    vara: '',
    data: '',
    valorCausa: '',
    situacao: '',
  });

  const [autores, setAutores] = useState<OptionType[]>([]);
  const [reus, setReus] = useState<OptionType[]>([]);
  const [terceiros, setTerceiros] = useState<OptionType[]>([]);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero || !formData.tipo || !formData.cidade || !formData.pasta || !formData.vara || !formData.data || !formData.valorCausa || !formData.situacao) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      valorCausa: parseFloat(formData.valorCausa),
      autores: autores.map(a => ({ id: a.value, tipoPessoa: a.tipoPessoa })),
      reus: reus.map(r => ({ id: r.value, tipoPessoa: r.tipoPessoa })),
      terceiros: terceiros.length ? terceiros.map(t => ({ id: t.value, tipoPessoa: t.tipoPessoa })) : undefined,
    };

    try {
      await createProcesso(payload);
      onClose(); 
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar processo.');
    }
  };

return (
  <div className="cadpro-formulario-modal">
    <button className="cadpro-formulario-fechar" onClick={onClose}>X</button>
    <form className="cadpro-formulario" onSubmit={handleSubmit}>
      {error && <div className="cadpro-erro">{error}</div>}

      <input type="text" name="numero" placeholder="Nº *" value={formData.numero} onChange={handleChange} />
      <input type="text" name="tipo" placeholder="Tipo *" value={formData.tipo} onChange={handleChange} />
      <input type="text" name="pasta" placeholder="Pasta *" value={formData.pasta} onChange={handleChange} />
      <input type="text" name="cidade" placeholder="Cidade *" value={formData.cidade} onChange={handleChange} />
      <input type="text" name="vara" placeholder="Vara *" value={formData.vara} onChange={handleChange} />
      <input type="date" name="data" placeholder="Data *" value={formData.data} onChange={handleChange} />
      <input type="text" name="valorCausa" placeholder="Valor da Causa *" value={formData.valorCausa} onChange={handleChange} />

      <select name="situacao" value={formData.situacao} onChange={handleChange}>
        <option value="">Situação *</option>
        <option value="EM ANDAMENTO">Em Andamento</option>
        <option value="CONCLUÍDO">Concluído</option>
      </select>

      <AsyncSelect
        isMulti
        loadOptions={debouncedBuscarPessoas}
        onChange={(val) => setAutores(val as OptionType[])}
        placeholder="Autor(es) *"
        className="cadpro-select-multiplos"
        classNamePrefix="cadpro-select-multiplos"
        styles={customStyles}
        defaultOptions
        cacheOptions
      />

      <AsyncSelect
        isMulti
        loadOptions={debouncedBuscarPessoas}
        onChange={(val) => setReus(val as OptionType[])}
        placeholder="Réu(s) *"
        className="cadpro-select-multiplos"
        classNamePrefix="cadpro-select-multiplos"
        styles={customStyles}
        defaultOptions
        cacheOptions
      />

      <AsyncSelect
        isMulti
        loadOptions={debouncedBuscarPessoas}
        onChange={(val) => setTerceiros(val as OptionType[])}
        placeholder="Terceiro(s)"
        className="cadpro-select-multiplos"
        classNamePrefix="cadpro-select-multiplos"
        styles={customStyles}
        defaultOptions
        cacheOptions
      />

      <button type="submit" className="cadpro-btn-cadastrar">CADASTRAR</button>
    </form>
  </div>
);

}
