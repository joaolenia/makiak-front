import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Interfaces ---
interface Parcela {
  id: number;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: string | number;
  formaPagamento: string | null;
  situacao: 'PAGO' | 'PENDENTE';
}

interface ValorProcesso {
  id: number;
  valorTotal: string | number;
  tipoPagamento: 'AVISTA' | 'PARCELADO';
  formaPagamento: string | null;
  situacao: string | null;
  entrada?: number | string | null;
  quantidadeParcelas?: number | null;
  parcelasPagas: number;
  parcelas: Parcela[];
}

// ==========================================================================
//      RELATÓRIO FINANCEIRO (FORMATO PROFISSIONAL)
// ==========================================================================

export function gerarPDFExtratoValores(valor: ValorProcesso) {
  // --- 1. Configurações de Design ---
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const CORES = {
    fundoSecundario: '#2c251e',
    destaque: '#c5a169',
    textoPrincipal: '#212529',
    textoSecundario: '#495057',
    bordaEscura: '#787878ff',
    statusPago: '#198754',      // Verde
    statusPendente: '#dc3545', // Vermelho
    fundoAlternado: '#F8F9FA'   // Cinza muito claro
  };

  const MARGENS = {
    top: 30,
    bottom: 25,
    left: 15,
    right: 15,
    larguraUtil: pageWidth - 30,
  };

  let y = MARGENS.top;

  // --- 2. Funções Auxiliares de Desenho e Formatação ---

  const addCabecalhoERodape = () => {
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      // (O código do cabeçalho e rodapé é o mesmo dos exemplos anteriores)
      // Cabeçalho
      doc.setFillColor(CORES.destaque);
      doc.rect(MARGENS.left, 10, 8, 8, 'F');
      doc.setFillColor(CORES.fundoSecundario);
      doc.rect(MARGENS.left + 2, 12, 8, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(CORES.textoPrincipal);
      doc.text('STASIAK & MAKIAK', MARGENS.left + 14, 15);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(CORES.textoSecundario);
      doc.text('A D V O G A D O S  A S S O C I A D O S', MARGENS.left + 14, 20);

      // Rodapé
      doc.setDrawColor(CORES.destaque); doc.setLineWidth(1);
      doc.line(MARGENS.left, pageHeight - MARGENS.bottom + 5, pageWidth - MARGENS.right, pageHeight - MARGENS.bottom + 5);
      doc.setFontSize(8); doc.setTextColor(CORES.textoSecundario);
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
    verificarPaginacao(20); // Mais espaço para títulos de seção
    y += 5;
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(CORES.destaque);
    doc.text(titulo.toUpperCase(), MARGENS.left, y);
    y += 5;
    doc.setDrawColor(CORES.bordaEscura); doc.setLineWidth(0.2);
    doc.line(MARGENS.left, y, pageWidth - MARGENS.right, y);
    y += 8;
  };

  const addLinhaInfo = (label: string, value: string | number | null | undefined) => {
    if (value === null || value === undefined || String(value).trim() === '') return;

    verificarPaginacao(8);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(CORES.textoSecundario);
    doc.text(`${label}:`, MARGENS.left, y);

    doc.setFont('helvetica', 'normal'); doc.setTextColor(CORES.textoPrincipal);
    doc.text(String(value), MARGENS.left + 50, y);

    y += 6;
  };

  const formatarData = (data: string | null): string => {
    if (!data) return '—';
    const datePart = data.split('T')[0];
    const [ano, mes, dia] = datePart.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '—';
    const valorNumerico = Number(val);
    if (isNaN(valorNumerico)) return '—';
    return `R$ ${valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- 3. Construção do PDF ---

  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(CORES.textoPrincipal);
  doc.text('EXTRATO FINANCEIRO', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Seção de Resumo Financeiro
  addTituloSecao('Resumo Financeiro');
  addLinhaInfo('Valor Total', formatarMoeda(valor.valorTotal));
  addLinhaInfo('Tipo de Pagamento', valor.tipoPagamento);
  addLinhaInfo('Situação Geral', valor.situacao);

  if (valor.tipoPagamento === 'PARCELADO') {
    addLinhaInfo('Valor de Entrada', formatarMoeda(valor.entrada));
    addLinhaInfo('Total de Parcelas', valor.quantidadeParcelas);
    addLinhaInfo('Parcelas Pagas', `${valor.parcelasPagas} de ${valor.quantidadeParcelas}`);
  } else {
    addLinhaInfo('Forma de Pagamento', valor.formaPagamento);
  }

  // Seção da Tabela de Parcelas
  if (valor.parcelas && valor.parcelas.length > 0) {
    addTituloSecao('Detalhamento das Parcelas');

    const corpoTabela = valor.parcelas.map((p, index) => [
      `#${index + 1}`,
      formatarData(p.dataVencimento),
      formatarMoeda(p.valor),
      p.situacao,
      formatarData(p.dataPagamento),
      p.formaPagamento ?? '—',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Vencimento', 'Valor', 'Situação', 'Data Pagto.', 'Forma Pagto.']],
      body: corpoTabela,
      theme: 'grid',
      headStyles: {
        fillColor: CORES.fundoSecundario,
        textColor: CORES.destaque,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: CORES.fundoAlternado
      },
      didDrawCell: (data) => {
        // Colore o texto da célula de Situação
        if (data.section === 'body' && data.column.index === 3) {
          const texto = data.cell.raw as string;
          let cor = CORES.textoPrincipal;
          if (texto.toUpperCase() === 'PAGO') {
            cor = CORES.statusPago;
          } else if (texto.toUpperCase() === 'PENDENTE') {
            cor = CORES.statusPendente;
          }
          doc.setTextColor(cor);
        }
      }
    });
  }

  // --- 4. Finalização e Download ---
  addCabecalhoERodape();
  doc.save(`Extrato_${valor.id}_${new Date().toISOString().split('T')[0]}.pdf`);
}