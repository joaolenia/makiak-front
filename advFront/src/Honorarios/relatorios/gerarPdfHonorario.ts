import jsPDF from 'jspdf';

interface Parcela {
  id: number;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: string;
  formaPagamento: string | null;
  situacao: 'PAGO' | 'PENDENTE';
}

interface Honorario {
  id: number;
  valorTotal: number;
  tipoPagamento: 'AVISTA' | 'PARCELADO';
  formaPagamento: string | null;
  situacao: string | null;
  entrada?: number | null;
  quantidadeParcelas?: number | null;
  parcelasPagas: number;
  parcelas: Parcela[];
}

export function gerarPDFHonorario(honorario: Honorario) {
  const doc = new jsPDF();

  const formatarData = (data?: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  let y = 15;

  doc.setFont('helvetica');
  doc.setFontSize(18);
  doc.text('STASIAK & MAKIAK', 105, y, { align: 'center' });

  y += 10;
  doc.setFontSize(14);
  doc.text('Advogados Associados', 105, y, { align: 'center' });

  y += 10;
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);

  y += 10;
  doc.setFontSize(12);

  doc.text(`Extrato de Honorários`, 15, y);
  y += 10;

  doc.text(`Valor Total: R$ ${Number(honorario.valorTotal).toFixed(2)}`, 15, y);
  y += 8;
  doc.text(`Situação: ${honorario.situacao ?? 'PENDENTE'}`, 15, y);
  y += 8;
  doc.text(`Forma de Pagamento: ${honorario.formaPagamento ?? 'Parcelado'}`, 15, y);
  y += 8;
  doc.text(`Entrada: R$ ${honorario.entrada != null ? Number(honorario.entrada).toFixed(2) : '—'}`, 15, y);
  y += 12;

  if (honorario.tipoPagamento === 'PARCELADO' && honorario.parcelas.length > 0) {
    doc.setFontSize(14);
    doc.text('Parcelas', 15, y);
    y += 10;

    doc.setFontSize(10);

    // Cabeçalho tabela
    const startX = 15;
    const colWidths = [15, 40, 40, 30, 30]; // largura colunas
    const headers = ['Nº', 'Vencimento', 'Pagamento', 'Valor (R$)', 'Situação'];

    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x + 1, y);
      x += colWidths[i];
    });

    y += 6;
    doc.setLineWidth(0.2);
    doc.line(startX, y, startX + colWidths.reduce((a,b) => a+b, 0), y); // linha separadora
    y += 4;

    // Linhas da tabela
    honorario.parcelas
      .sort((a, b) => a.id - b.id)
      .forEach((p, index) => {
        x = startX;

        if (y > 280) { // nova página se estiver perto do fim
          doc.addPage();
          y = 15;
        }

        doc.text(String(index + 1), x + 1, y);
        x += colWidths[0];

        doc.text(formatarData(p.dataVencimento), x + 1, y);
        x += colWidths[1];

        doc.text(p.dataPagamento ? formatarData(p.dataPagamento) : '—', x + 1, y);
        x += colWidths[2];

        doc.text(Number(p.valor).toFixed(2), x + 1, y);
        x += colWidths[3];

        doc.text(p.situacao, x + 1, y);

        y += 7;
      });
  }

  doc.save(`honorarios_${honorario.id}.pdf`);
}
