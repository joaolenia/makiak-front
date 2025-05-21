import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface Parte {
  id: number;
  tipoPessoa: 'FISICA' | 'JURIDICA';
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

// Função de cadastro
export async function createProcesso(payload: ProcessoPayload) {
  console.log(payload);
  const response = await api.post('/processos', payload);
  return response.data;
}

// NOVA FUNÇÃO: Buscar processos por termo e filtro
export async function buscarProcessos(termo: string, filtro: number) {
  const response = await api.get('/processos/buscar', {
    params: {
      termo,
      filtro
    }
  });

  return response.data as {
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
