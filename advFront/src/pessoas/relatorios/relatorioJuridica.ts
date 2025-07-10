import jsPDF from 'jspdf';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface PessoaFisica {
  id: number;
  nome: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao?: string;
  rg: string;
  orgaoExpedidorRg: string;
  cpf: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string;
  whatsapp?: string;
  telefone?: string;
  observacoes?: string;
}

interface PessoaJuridica {
  id: number;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  representantes: PessoaFisica[];
}

interface Descricao {
  data: string;
  descricao: string;
}

interface Processo {
  id: number;
  numero: string;
  tipo: string;
  cidade: string;
  vara: string;
  pasta: string;
  data: string;
  situacao: string;
  valorCausa: number;
  autores: string[];
  reus: string[];
  terceiros: string[];
  descricoes: Descricao[];
}

interface RelatorioPessoaJuridicaResponse {
  pessoa: PessoaJuridica;
  processos: Processo[];
}

const formatarData = (data?: string): string => {
  if (!data) return '—';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

export async function gerarRelatorioPessoaJuridicaPDF(id: number) {
  const { data } = await api.get<RelatorioPessoaJuridicaResponse>(`/pessoa-juridica/${id}/relatorio`);
  const { pessoa, processos } = data;

  const doc = new jsPDF();
  let y = 15;
  const margemTopo = 15;
  const margemInferior = 280;

  const novaPagina = () => {
    doc.addPage();
    y = margemTopo;
  };

  const addTexto = (texto: string) => {
    if (y > margemInferior) novaPagina();
    doc.text(texto, 15, y);
    y += 6;
  };

  const addLinhas = (linhas: string[]) => {
    linhas.forEach((linha: string) => addTexto(linha));
  };

  const addLinhaSeparadora = () => {
    if (y > margemInferior - 5) novaPagina();
    doc.setLineWidth(0.2);
    doc.line(15, y, 195, y);
    y += 10;
  };

  const addLinhaDestacada = (titulo: string, valor?: string | null) => {
    if (y > margemInferior) novaPagina();
    const textoValor = valor ?? '—';
    doc.setFont('helvetica', 'bold');
    doc.text(`${titulo}:`, 15, y);
    const larguraTitulo = doc.getTextWidth(`${titulo}: `);
    doc.setFont('helvetica', 'normal');
    doc.text(textoValor, 15 + larguraTitulo, y);
    y += 6;
  };

  // Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('STASIAK & MAKIAK', 105, y, { align: 'center' });
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('ADVOGADOS ASSOCIADOS', 105, y, { align: 'center' });
  y += 10;

  doc.setLineWidth(0.4);
  doc.line(15, y, 195, y);
  y += 12;

  // Dados da Pessoa Jurídica
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA EMPRESA', 15, y);
  y += 8;

  doc.setFontSize(11);

  addLinhaDestacada('Razão Social', pessoa.razaoSocial);
  addLinhaDestacada('CNPJ', pessoa.cnpj);
  addLinhaDestacada('Endereço', `${pessoa.endereco}, ${pessoa.uf}, CEP: ${pessoa.cep}`);
  if (pessoa.email) addLinhaDestacada('Email', pessoa.email);
  if (pessoa.telefone) addLinhaDestacada('Telefone', pessoa.telefone);

  if (pessoa.observacoes) {
    const obs = doc.splitTextToSize(`Observações: ${pessoa.observacoes}`, 180);
    addLinhas(obs);
  }

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Representantes Legais:', 15, y);
  y += 6;

  pessoa.representantes.forEach(rep => {
    const linhas = doc.splitTextToSize(
      `• ${rep.nome}, ${rep.nacionalidade}, ${rep.estadoCivil}, ${rep.profissao ?? ''}, RG: ${rep.rg} ${rep.orgaoExpedidorRg}, CPF: ${rep.cpf}, endereço: ${rep.endereco}, ${rep.uf}, CEP: ${rep.cep}`,
      180
    );
    addLinhas(linhas);
  });

  addLinhaSeparadora();

  // Processos
  processos.forEach((proc, i) => {
    if (y > margemInferior - 40) novaPagina();

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`PROCESSO ${i + 1}: Nº ${proc.numero}`, 15, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    addLinhaDestacada('Tipo', proc.tipo);
    addLinhaDestacada('Situação', proc.situacao);
    addLinhaDestacada('Data', formatarData(proc.data));
    addLinhaDestacada('Pasta', proc.pasta);
    addLinhaDestacada('Cidade', proc.cidade);
    addLinhaDestacada('Vara', proc.vara);

    const valor = Number(proc.valorCausa);
    const valorFormatado = isNaN(valor) ? '—' : `R$ ${valor.toFixed(2)}`;
    addLinhaDestacada('Valor da Causa', valorFormatado);

    addLinhaDestacada('Autor(es)', proc.autores.join(', ') || '—');
    addLinhaDestacada('Réu(s)', proc.reus.join(', ') || '—');
    addLinhaDestacada('Terceiro(s)', proc.terceiros.join(', ') || '—');

    if (proc.descricoes.length > 0) {
      doc.setFont('helvetica', 'bold');
      addTexto('Movimentações:');
      doc.setFont('helvetica', 'normal');

      proc.descricoes.forEach(desc => {
        const linhas = doc.splitTextToSize(`${formatarData(desc.data)} - ${desc.descricao}`, 180);
        addLinhas(linhas);
      });
    }

    addLinhaSeparadora();
  });

  doc.save(`relatorio_${pessoa.razaoSocial}.pdf`);
}