import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export function gerarPDFExtratoValores(valor: ValorProcesso) {
  const doc = new jsPDF();
  let y = 15;

const formatarData = (data: string | null): string => {
  if (!data) return '—';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};
  doc.setFont('helvetica', 'normal');
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
  doc.text('EXTRATO DE VALORES DO PROCESSO', 15, y);
  y += 10;

  doc.text(`Tipo de Pagamento: ${valor.tipoPagamento}`, 15, y);
  y += 8;

  doc.text(`Total: R$ ${Number(valor.valorTotal).toFixed(2)}`, 15, y);
  y += 8;

  doc.text(`Situação: ${valor.situacao ?? '—'}`, 15, y);
  y += 8;

  if (valor.tipoPagamento === 'PARCELADO') {
    doc.text(`Parcelas: ${valor.quantidadeParcelas}`, 15, y);
    y += 8;

    doc.text(
      `Entrada: R$ ${
        valor.entrada != null ? Number(valor.entrada).toFixed(2) : '—'
      }`,
      15,
      y
    );
    y += 8;

    doc.text(
      `Pagas: ${valor.parcelasPagas}/${valor.quantidadeParcelas}`,
      15,
      y
    );
    y += 12;
  } else {
    doc.text(
      `Forma de Pagamento: ${valor.formaPagamento ?? '—'}`,
      15,
      y
    );
    y += 12;
  }

  const tabelaDados = valor.parcelas.map((p, index) => [
    index + 1,
    formatarData(p.dataVencimento),
    formatarData(p.dataPagamento),
    `R$ ${Number(p.valor).toFixed(2)}`,
    p.situacao,
    p.formaPagamento ?? '—',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Vencimento', 'Pagamento', 'Valor', 'Situação', 'Forma Pagto']],
    body: tabelaDados,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: 15, right: 15 },
    tableLineWidth: 0.1,
    tableLineColor: 10,
  });

  doc.save(`extrato_valores_processo_${valor.id}.pdf`);
}
