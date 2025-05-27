import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface HonorarioAvistaDTO {
  valorTotal: number;
  tipoPagamento: 'AVISTA';
  formaPagamento: string;
  processoId: number;
}

export interface HonorarioParceladoDTO {
  valorTotal: number;
  tipoPagamento: 'PARCELADO';
  quantidadeParcelas: number;
  entrada?: number;
  diaVencimento: string; 
  processoId: number;
}

export const criarHonorarioAvista = async (dados: HonorarioAvistaDTO) => {
  const response = await api.post('/honorarios', dados);
  return response.data;
};

export const criarHonorarioParcelado = async (dados: HonorarioParceladoDTO) => {
  const response = await api.post('/honorarios', dados);
  return response.data;
};

export const buscarHonorariosPorAutor = async (nome: string) => {
  const response = await api.get(`/honorarios/buscar-por-autor`, {
    params: { nome },
  });
  return response.data;
};
export const buscarHonorariosPorAutorAvista = async (nome: string) => {
  const response = await api.get(`/honorarios/buscar-por-autor-avista`, {
    params: { nome },
  });
  return response.data;
};

export const buscarHonorarioPorId = async (id: number) => {
  const response = await api.get(`/honorarios/${id}`);
  return response.data;
};

export const pagarParcela = async (parcelaId: number, formaPagamento: string) => {
  const response = await api.patch(`/honorarios/parcelas/${parcelaId}/pagar`, {
    formaPagamento,
  });
  return response.data;
};
