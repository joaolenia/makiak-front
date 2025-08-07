import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import axios from 'axios';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  valorCausa: number | string;
  autores: string[];
  reus: string[];
  terceiros: string[];
  descricoes: Descricao[];
}

interface RelatorioPessoaJuridicaResponse {
  pessoa: PessoaJuridica;
  processos: Processo[];
}

export async function gerarRelatorioPessoaJuridicaPDF(id: number) {

  const { data } = await api.get<RelatorioPessoaJuridicaResponse>(`/pessoa-juridica/${id}/relatorio`);
  const { pessoa, processos } = data;

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const CORES = {
    fundoSecundario: '#2c251e',
    destaque: '#c5a169',
    textoPrincipal: '#212529',
    textoSecundario: '#495057',
    bordaClara: '#EAEAEA',
    bordaEscura: '#787878ff', 
  };

  const MARGENS = {
    top: 30,
    bottom: 25,
    left: 15,
    right: 15,
    larguraUtil: pageWidth - 30,
  };

  let y = MARGENS.top;


  const addCabecalhoERodape = () => {
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      doc.setFillColor(CORES.destaque);
      doc.rect(MARGENS.left, 10, 8, 8, 'F');
      doc.setFillColor(CORES.fundoSecundario);
      doc.rect(MARGENS.left + 2, 12, 8, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(CORES.textoPrincipal);
      doc.text('STASIAK & MAKIAK', MARGENS.left + 14, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(CORES.textoSecundario);
      doc.text('A D V O G A D O S  A S S O C I A D O S', MARGENS.left + 14, 20);


      doc.setDrawColor(CORES.destaque);
      doc.setLineWidth(1);
      doc.line(MARGENS.left, pageHeight - MARGENS.bottom + 5, pageWidth - MARGENS.right, pageHeight - MARGENS.bottom + 5);
      doc.setFontSize(8);
      doc.setTextColor(CORES.textoSecundario);
      doc.text(' Stasiak & Makiak Advogados Associados - Desenvolvido por JG Soluções em Software', MARGENS.left, pageHeight - MARGENS.bottom + 10);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - MARGENS.right, pageHeight - MARGENS.bottom + 10, { align: 'right' });
    }
  };

  const verificarPaginacao = (espacoNecessario = 10) => {
    if (y + espacoNecessario > pageHeight - MARGENS.bottom) {
      doc.addPage();
      y = MARGENS.top;
    }
  };

  const addTituloSecao = (titulo: string) => {
    verificarPaginacao(15);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(CORES.destaque);
    doc.text(titulo.toUpperCase(), MARGENS.left, y);
    y += 5;
    doc.setDrawColor(CORES.bordaEscura);
    doc.setLineWidth(0.2);
    doc.line(MARGENS.left, y, pageWidth - MARGENS.right, y);
    y += 8;
  };

  const addLinhaInfo = (label: string, value: string | null | undefined) => {
    if (value === null || value === undefined || String(value).trim() === '') return;

    const valorFormatado = String(value);
    const larguraLabel = 45
    const larguraDisponivel = MARGENS.larguraUtil - larguraLabel - 2;
    const linhasValor = doc.splitTextToSize(valorFormatado, larguraDisponivel);

    verificarPaginacao(linhasValor.length * 5 + 3);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(CORES.textoSecundario);
    doc.text(`${label}:`, MARGENS.left, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(CORES.textoPrincipal);
    doc.text(linhasValor, MARGENS.left + larguraLabel, y);

    y += linhasValor.length * 5 + 2.5;
  };

  const formatarData = (data?: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };


  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(CORES.textoPrincipal);
  doc.text('RELATÓRIO DETALHADO DE CLIENTE', pageWidth / 2, y, { align: 'center' });
  y += 15;

  addTituloSecao('Informações da Empresa');
  addLinhaInfo('Razão Social', pessoa.razaoSocial);
  addLinhaInfo('CNPJ', pessoa.cnpj);
  addLinhaInfo('Endereço', `${pessoa.endereco}, ${pessoa.uf}, CEP: ${pessoa.cep}`);
  addLinhaInfo('Email', pessoa.email);
  addLinhaInfo('Telefone', pessoa.telefone);
  addLinhaInfo('Observações', pessoa.observacoes);

  y += 5;

  if (pessoa.representantes && pessoa.representantes.length > 0) {
    addTituloSecao('Representantes Legais');
    pessoa.representantes.forEach((rep, index) => {
      if (index > 0) {
        y += 5;
        verificarPaginacao(20);
      }
      addLinhaInfo('Nome', rep.nome);
      addLinhaInfo('CPF', rep.cpf);
      addLinhaInfo('RG', `${rep.rg} ${rep.orgaoExpedidorRg}`);
      addLinhaInfo('Endereço', `${rep.endereco}, ${rep.uf}, CEP: ${rep.cep}`);
      addLinhaInfo('Nacionalidade', rep.nacionalidade);
      addLinhaInfo('Estado Civil', rep.estadoCivil);
      addLinhaInfo('Profissão', rep.profissao);
    });
  }

  if (processos.length > 0) {
    processos.forEach((proc) => {
      y += 5;
      verificarPaginacao(60);

      addTituloSecao(`Processo Nº ${proc.numero}`);

      addLinhaInfo('Tipo', proc.tipo);
      addLinhaInfo('Situação', proc.situacao);
      addLinhaInfo('Data de Início', formatarData(proc.data));
      addLinhaInfo('Pasta', proc.pasta);
      addLinhaInfo('Comarca', `${proc.cidade} - ${proc.vara}`);

      const valorNumerico = parseFloat(String(proc.valorCausa));
      const valorFormatado = !isNaN(valorNumerico) ? `R$ ${valorNumerico.toFixed(2).replace('.', ',')}` : '—';
      addLinhaInfo('Valor da Causa', valorFormatado);

      addLinhaInfo('Autor(es)', proc.autores.join(', ') || '—');
      addLinhaInfo('Réu(s)', proc.reus.join(', ') || '—');
      addLinhaInfo('Terceiro(s)', proc.terceiros.join(', ') || '—');

      if (proc.descricoes.length > 0) {
        y += 4;
        verificarPaginacao(10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(CORES.textoSecundario);
        doc.text('Movimentações:', MARGENS.left, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        proc.descricoes.forEach(desc => {
          const textoMovimentacao = `${formatarData(desc.data)} - ${desc.descricao}`;
          const linhas = doc.splitTextToSize(textoMovimentacao, MARGENS.larguraUtil - 2);
          verificarPaginacao(linhas.length * 5 + 2);
          doc.text(linhas, MARGENS.left + 2, y); 
          y += linhas.length * 5 + 1.5;
        });
      }
    });
  }

  addCabecalhoERodape();
  doc.save(`Relatorio_${pessoa.razaoSocial.replace(/\s/g, '_')}.pdf`);
}