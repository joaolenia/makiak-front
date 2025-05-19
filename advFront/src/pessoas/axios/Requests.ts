import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface PessoaFisicaData {
  nome: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao?: string | null;
  rg: string;
  orgaoExpedidorRg: string;
  cpf: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string | null;
  whatsapp?: string | null;
  telefone?: string | null;
  observacoes?: string | null;
}
interface PessoaJuridicaData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cep: string;
  uf: string;
  municipio: string;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  inscricaoEstadual?: string | null;
  inscricaoMunicipal?: string | null;
  observacoes?: string | null;
  representantesIds: number[];
}
interface PessoaFisicaBusca {
  id: number;
  nome: string;
}
interface PessoajuridicaBusca {
  id: number;
  razaoSocial: string;
}
export interface PessoaJuridicaDetalhes {
  id: number;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string | null;
  telefone?: string | null;
  observacoes?: string | null;
   representantes: (PessoaFisicaData & { id: number })[];
}

export async function criarPessoaFisica(data: PessoaFisicaData) {
  try {
    const response = await api.post('pessoa-fisica', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pessoa física:', error);
    throw error;
  }

}
  export async function updatePessoaFisica(id: string, data: PessoaFisicaData) {
  try {
    const response = await api.patch(`pessoa-fisica/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar pessoa física:', error);
    throw error;
  }

  
}
export async function getPessoaFisicaById(id: string): Promise<PessoaFisicaData> {
  try {
    const response = await api.get(`pessoa-fisica/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoa física:', error);
    throw error;
  }
}
export async function buscarPessoaFisicaPorNome(nome: string): Promise<PessoaFisicaBusca[]> {
  try {
    const response = await api.get(`pessoa-fisica/buscar`, {
      params: { nome }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoas físicas por nome:', error);
    throw error;
  }


}
export async function buscarPessoaJuridicPorNome(razao: string): Promise<PessoajuridicaBusca[]> {
  try {
    const response = await api.get(`pessoa-juridica/buscar`, {
      params: { razao }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoas físicas por nome:', error);
    throw error;
  }

}
export async function copiarPessoaFisica(id: string): Promise<string> {
  try {
    const response = await api.get(`pessoa-fisica/${id}/descricao`);
    return response.data;
  } catch (error) {
    console.error('Erro ao copiar pessoa física:', error);
    throw error;
  }
}
export async function copiarPessoajuridica(id: string): Promise<string> {
  try {
    const response = await api.get(`pessoa-juridica/${id}/descricao`);
    return response.data;
  } catch (error) {
    console.error('Erro ao copiar pessoa jurídica:', error);
    throw error;
  }
}
export async function criarPessoaJuridica(data: PessoaJuridicaData) {
  try {
    const response = await api.post('pessoa-juridica', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pessoa jurídica:', error);
    throw error;
  }
}
export async function updatePessoaJuridica(id: string, data: PessoaJuridicaData) {
  try {
    const response = await api.patch(`pessoa-juridica/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar pessoa jurídica:', error);
    throw error;
  }
}
export async function getPessoaJuridicaById(id: string): Promise<PessoaJuridicaDetalhes> {
  try {
    const response = await api.get(`pessoa-juridica/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoa juridica:', error);
    throw error;
  }
}