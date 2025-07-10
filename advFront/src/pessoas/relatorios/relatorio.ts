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

interface RelatorioPessoaResponse {
    pessoa: PessoaFisica;
    processos: Processo[];
}

const formatarData = (data?: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};

export async function gerarRelatorioPessoaPDF(id: number) {
    console.log(id)
  const { data } = await api.get<RelatorioPessoaResponse>(`/pessoa-fisica/${id}/relatorio`);
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

  // Dados da Pessoa
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', 15, y);
  y += 8;

  doc.setFontSize(11);

  addLinhaDestacada('Nome', pessoa.nome);
  addLinhaDestacada('CPF', pessoa.cpf);
  addLinhaDestacada('RG', `${pessoa.rg} ${pessoa.orgaoExpedidorRg}`);
  addLinhaDestacada('Endereço', `${pessoa.endereco}, ${pessoa.uf}, CEP: ${pessoa.cep}`);
  addLinhaDestacada('Nacionalidade', pessoa.nacionalidade);
  addLinhaDestacada('Estado Civil', pessoa.estadoCivil);
  if (pessoa.profissao) addLinhaDestacada('Profissão', pessoa.profissao);
  if (pessoa.email) addLinhaDestacada('Email', pessoa.email);
  if (pessoa.telefone) addLinhaDestacada('Telefone', pessoa.telefone);
  if (pessoa.whatsapp) addLinhaDestacada('WhatsApp', pessoa.whatsapp);

  if (pessoa.observacoes) {
    const obs = doc.splitTextToSize(`Observações: ${pessoa.observacoes}`, 180);
    addLinhas(obs);
  }

  y += 8;
  doc.line(15, y, 195, y);
  y += 10;

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

  doc.save(`relatorio_${pessoa.nome}.pdf`);
}



