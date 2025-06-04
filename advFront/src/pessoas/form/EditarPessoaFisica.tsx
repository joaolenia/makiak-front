import React, { useState, useEffect } from 'react';
import './FormularioEdicao.css';
import { getPessoaFisicaById, updatePessoaFisica } from '../axios/Requests';

interface Props {
  id: string; 
  onClose: () => void;
}

export default function EditarPessoaFisica({ id, onClose }: Props) {
  const [formData, setFormData] = useState({
    nome: '',
    nacionalidade: 'Brasileiro(a)',
    estadoCivil: '',
    profissao: '',
    rg: '',
    orgaoExpedidorRg: '',
    cpf: '',
    endereco: '',
    cep: '',
    uf: '',
    email: '',
    whatsapp: '',
    telefone: '',
    observacoes: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPessoa() {
      try {
        const pessoa = await getPessoaFisicaById(id);
        setFormData({
          nome: pessoa.nome || '',
          nacionalidade: pessoa.nacionalidade || 'Brasileiro(a)',
          estadoCivil: pessoa.estadoCivil || '',
          profissao: pessoa.profissao || '',
          rg: pessoa.rg || '',
          orgaoExpedidorRg: pessoa.orgaoExpedidorRg || '',
          cpf: pessoa.cpf || '',
          endereco: pessoa.endereco || '',
          cep: pessoa.cep || '',
          uf: pessoa.uf || '',
          email: pessoa.email || '',
          whatsapp: pessoa.whatsapp || '',
          telefone: pessoa.telefone || '',
          observacoes: pessoa.observacoes || '',
        });
      } catch {
        setErrorMessage('Erro ao carregar dados da pessoa.');
      } finally {
        setLoading(false);
      }
    }
    fetchPessoa();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "orgaoExpedidorRg") {
      updatedValue = value.toUpperCase();
    }
    if (name === "cpf" || name === "rg" || name === "cep") {
      updatedValue = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      nome, nacionalidade, estadoCivil, rg, orgaoExpedidorRg,
      cpf, endereco, cep, uf,
    } = formData;

    if (!nome || !nacionalidade || !endereco || !uf) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await updatePessoaFisica(id, {
        nome,
        nacionalidade,
        estadoCivil,
        rg,
        orgaoExpedidorRg,
        cpf,
        endereco,
        cep,
        uf,
        profissao: formData.profissao || null,
        email: formData.email || null,
        whatsapp: formData.whatsapp || null,
        telefone: formData.telefone || null,
        observacoes: formData.observacoes || null,
      });

      setErrorMessage('');
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erro ao atualizar. Verifique os dados.';
      setErrorMessage(msg);
    }
  };

  if (loading) return <div>Carregando dados...</div>;

  return (
    <div className="formulario-modal">
      <button className="formulario-fechar" onClick={onClose}>X</button>
      <form className="formulario" onSubmit={handleSubmit}>
        {errorMessage && <div className="formulario-erro">{errorMessage}</div>}

        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nacionalidade:
          <input
            type="text"
            name="nacionalidade"
            value={formData.nacionalidade}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Estado Civil:
          <select
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleChange}
            
          >
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
            <option value="Separado(a)">Separado(a)</option>
            <option value="União Estável">União Estável</option>
          </select>
        </label>

        <label>
          Profissão:
          <input
            type="text"
            name="profissao"
            value={formData.profissao}
            onChange={handleChange}
          />
        </label>

        <label>
          RG:
          <input
            type="text"
            name="rg"
            value={formData.rg}
            onChange={handleChange}
            
          />
        </label>

        <label>
          Órgão expedidor:
          <input
            type="text"
            name="orgaoExpedidorRg"
            value={formData.orgaoExpedidorRg}
            onChange={handleChange}
            
          />
        </label>

        <label>
          CPF:
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            
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
          UF:
          <select
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {[
              "SC", "PR", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
              "MA", "MT", "MS", "MG", "PA", "PB", "PE", "PI", "RJ", "RN", "RO",
              "RR", "RS", "SP", "SE", "TO"
            ].map(sigla => (
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
          WhatsApp:
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
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
          Observações:
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
          />
        </label>

        <div className="formulario-botoes">
          <button type="submit" className="btn-confirmar">CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}
