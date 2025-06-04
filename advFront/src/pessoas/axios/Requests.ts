import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface ProcessoResumo {
  id: number;
  numero: string;
  pasta:string;
  tipo: string;
  cidade: string;
  vara: string;
  valorCausa: string;
  situacao: string;
}

interface PessoaFisicaData {
  nome: string;
  nacionalidade: string;
  estadoCivil: string| null;
  profissao?: string | null;
  rg: string | null;
  orgaoExpedidorRg: string | null;
  cpf: string | null;
  endereco: string ;
  cep: string | null;
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
  email?: string | null;
  telefone?: string | null;
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
export interface PessoaFisicaDetalhes extends PessoaFisicaData {
  id: number;
  processos: ProcessoResumo[];
}

export interface PessoaJuridicaDetalhesComProcessos extends PessoaJuridicaDetalhes {
  processos: ProcessoResumo[];
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
export async function criarPessoajuridica(data: PessoaJuridicaData) {
  try {
    const response = await api.post('pessoa-juridica', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pessoa Jurídica:', error);
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
export async function getPessoaFisicaById(id: string): Promise<PessoaFisicaDetalhes> {
  try {
    const response = await api.get(`pessoa-fisica/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoa física:', error);
    throw error;
  }
}

export async function getPessoaJuridicaById(id: string): Promise<PessoaJuridicaDetalhesComProcessos> {
  try {
    const response = await api.get(`pessoa-juridica/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoa jurídica:', error);
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
