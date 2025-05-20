import React, { useState } from 'react';
import './FormularioCadastro.css';
import { criarPessoaFisica } from '../axios/Requests';

interface Props {
  onClose: () => void;
}

export default function FormPessoaFisica({ onClose }: Props) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "orgaoExpedidorRg") {
      updatedValue = value.toUpperCase();
    }

    if (name === "cpf" || name === "rg" || name=== "cep") {
      updatedValue = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setErrorMessage('');
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { nome, endereco, uf } = formData;

  if (!nome || !endereco || !uf) {
    setErrorMessage('Por favor, preencha os campos obrigatórios: Nome, Endereço e UF.');
    return;
  }

  try {
    await criarPessoaFisica({
      ...formData,
      profissao: formData.profissao || null,
      email: formData.email || null,
      whatsapp: formData.whatsapp || null,
      telefone: formData.telefone || null,
      observacoes: formData.observacoes || null,
    });

    // Reset do formulário
    setFormData({
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
    setErrorMessage('');
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

      <input type="text" name="nome" placeholder="Nome *" value={formData.nome} onChange={handleChange} />
      <input type="text" name="nacionalidade" placeholder="Nacionalidade *" value={formData.nacionalidade} onChange={handleChange} />
      <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange}>
        <option value="">Estado Civil </option>
        <option value="Solteiro(a)">Solteiro(a)</option>
        <option value="Casado(a)">Casado(a)</option>
        <option value="Divorciado(a)">Divorciado(a)</option>
        <option value="Viúvo(a)">Viúvo(a)</option>
        <option value="Separado(a)">Separado(a)</option>
        <option value="União Estável">União Estável</option>
      </select>

      <input type="text" name="profissao" placeholder="Profissão" value={formData.profissao} onChange={handleChange} />
      <input type="text" name="rg" placeholder="RG " value={formData.rg} onChange={handleChange} />
      <input type="text" name="orgaoExpedidorRg" placeholder="Órgão expedidor " value={formData.orgaoExpedidorRg} onChange={handleChange} />
      <input type="text" name="cpf" placeholder="CPF " value={formData.cpf} onChange={handleChange} />
      <input type="text" name="endereco" placeholder="Endereço *" value={formData.endereco} onChange={handleChange} />
      <input type="text" name="cep" placeholder="CEP " value={formData.cep} onChange={handleChange} />

      <select name="uf" value={formData.uf} onChange={handleChange}>
        <option value="">UF *</option>
        {["SC", "PR", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PE", "PI", "RJ", "RN", "RO", "RR", "RS", "SP", "SE", "TO"].map(sigla => (
          <option key={sigla} value={sigla}>{sigla}</option>
        ))}
      </select>

      <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
      <input type="text" name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} />
      <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} />
      <textarea name="observacoes" placeholder="Observações:" value={formData.observacoes} onChange={handleChange} />

      <button type="submit" className="cad-formulario-btn">CADASTRAR</button>
    </form>
  </div>
);

}
