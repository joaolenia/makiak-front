import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface ValorAvistaDTO {
  valorTotal: number;
  tipoPagamento: 'AVISTA';
  formaPagamento: string;
  processoId: number;
}

export interface ValorParceladoDTO {
  valorTotal: number;
  tipoPagamento: 'PARCELADO';
  quantidadeParcelas: number;
  entrada?: number;
  diaVencimento: string; 
  processoId: number;
}

export interface AtualizarValorAvistaDTO {
  valorTotal: number;
  tipoPagamento: 'AVISTA';
  formaPagamento: string;
}

export interface AtualizarValorParceladoDTO {
  valorTotal: number;
  tipoPagamento: 'PARCELADO';
  quantidadeParcelas: number;
  diaVencimento: string;
}
export const criarValorAvista = async (dados: ValorAvistaDTO) => {
  const response = await api.post('/valores', dados);
  return response.data;
};

export const criarValorParcelado = async (dados: ValorParceladoDTO) => {
  const response = await api.post('/valores', dados);
  return response.data;
};

export const buscarValorPorIdDoProcesso = async (id: number) => {
  console.log(id)
  const response = await api.get(`/valores/${id}`);
  console.log(response.data)
  return response.data;
};

export const pagarParcela = async (parcelaId: number, formaPagamento: string) => {
  const response = await api.patch(`/valores/parcelas/${parcelaId}/pagar`, {
    formaPagamento,
  });
  return response.data;
};
export const rollbackParcela = async (
  parcelaId: number,
  modo: 0 | 1,
  observacoes?: string
) => {
  const response = await api.patch(`/valores/parcelas/${parcelaId}/rollback`, {
    modo,
    observacoes,
  });
  return response.data;
};

export const atualizarValor = async (
  idvalor: number,
  dados: AtualizarValorAvistaDTO | AtualizarValorParceladoDTO
) => {
  const response = await api.put(`/valores/${idvalor}`, dados);
  return response.data;
};

export const deletarValor = async (idvalor: number) => {
  const response = await api.delete(`/valores/${idvalor}`);
  return response.data;
};

export const buscarValoresVencidos = async () => {
  const response = await api.get('/valores/vencidos');
  return response.data;
};


