import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface Parte {
  id: number;
  tipoPessoa: 'FISICA' | 'JURIDICA';
}

export interface DescricaoPayload {
  processoId?: number; 
  descricao: string;
  data: string;
}

export interface ProcessoPayload {
  numero: string;
  tipo: string;
  cidade: string;
  vara: string;
  data: string; 
  valorCausa: number;
  situacao: string;
  autores: Parte[];
  reus: Parte[];
  terceiros?: Parte[]; 
}

export async function createProcesso(payload: ProcessoPayload) {
  console.log(payload);
  const response = await api.post('/processos', payload);
  return response.data;
}

export async function buscarProcessos(termo: string, filtro: number) {
  const response = await api.get('/processos/buscar', {
    params: {
      termo,
      filtro
    }
  });

  return response.data as {
    id:number;
    numero: string;
    tipo: string;
    data: string;
    situacao: string;
    pasta: string;
    autores: string[];
    reus: string[];
    terceiros: string[];
  }[];
}

export async function updateProcesso(id: number, payload: ProcessoPayload) {
  const response = await api.put(`/processos/${id}`, payload);
  return response.data;
}

export async function getProcessoById(id: number) {
  const response = await api.get(`/processos/${id}`);
  return response.data as {
    id: number;
    numero: string;
    tipo: string;
    cidade: string;
    pasta: string;
    vara: string;
    data: string;
    valorCausa: string;
    situacao: string;
    autores: {
      id: number;
      nome: string;
      tipoPessoa: 'FISICA' | 'JURIDICA';
    }[];
    reus: {
      id: number;
      nome: string;
      tipoPessoa: 'FISICA' | 'JURIDICA';
    }[];
    terceiros: {
      id: number;
      nome: string;
      tipoPessoa: 'FISICA' | 'JURIDICA';
    }[];
  };
}

export async function createDescricao(payload: DescricaoPayload) {
  const response = await api.post('/processos/descricao', payload);
  return response.data;
}

export async function getDescricoesByProcessoId(processoId: number) {
  const response = await api.get(`/processos/${processoId}/descricoes`);
  return response.data as {
    id:number;
    descricao: string;
    data: string;
  }[];
}

export async function updateDescricao(id: number, payload: DescricaoPayload) {
  console.log(payload)
  const response = await api.put(`/processos/descricao/${id}`, payload);
  return response.data;
}

