import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  let y = 15;

  const formatarData = (data?: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

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
  doc.text(`EXTRATO DE HONORÁRIOS`, 15, y);
  y += 10;

  doc.text(`Tipo de Pagamento: ${honorario.tipoPagamento}`, 15, y);
  y += 8;
  doc.text(`Valor Total: R$ ${Number(honorario.valorTotal).toFixed(2)}`, 15, y);
  y += 8;
  doc.text(`Situação: ${honorario.situacao ?? '—'}`, 15, y);
  y += 8;

  if (honorario.tipoPagamento === 'PARCELADO') {
    doc.text(`Parcelas: ${honorario.quantidadeParcelas ?? '—'}`, 15, y);
    y += 8;

    doc.text(
      `Entrada: R$ ${honorario.entrada != null ? Number(honorario.entrada).toFixed(2) : '—'}`,
      15,
      y
    );
    y += 8;

    doc.text(
      `Pagas: ${honorario.parcelasPagas}/${honorario.quantidadeParcelas}`,
      15,
      y
    );
    y += 12;
  } else {
    doc.text(`Forma de Pagamento: ${honorario.formaPagamento ?? '—'}`, 15, y);
    y += 12;
  }

  // Tabela das parcelas
  if (honorario.tipoPagamento === 'PARCELADO' && honorario.parcelas.length > 0) {
    const tabela = honorario.parcelas.map((p, i) => [
      i + 1,
      formatarData(p.dataVencimento),
      formatarData(p.dataPagamento ?? ''),
      `R$ ${Number(p.valor).toFixed(2)}`,
      p.situacao,
      p.formaPagamento ?? '—'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Vencimento', 'Pagamento', 'Valor', 'Situação', 'Forma Pagto']],
      body: tabela,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 15, right: 15 },
      tableLineWidth: 0.1,
      tableLineColor: 10,
    });
  }

  doc.save(`honorarios_${honorario.id}.pdf`);
}
  