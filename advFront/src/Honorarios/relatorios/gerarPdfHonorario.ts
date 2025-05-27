import html2pdf from 'html2pdf.js';

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
  const formatarData = (data?: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const valorTotal = Number(honorario.valorTotal);

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 0;">STASIAK & MAKIAK</h1>
      <h3 style="text-align: center; margin-top: 0;">Advogados Associados</h3>

      <hr />

      <h2 style="margin-bottom: 5px;">Extrato de Honorários</h2>
      <div><strong>Valor Total:</strong> R$ ${valorTotal.toFixed(2)}</div>
      <div><strong>Situação:</strong> ${honorario.situacao ?? 'PENDENTE'}</div>
      <div><strong>Forma de Pagamento:</strong> ${honorario.formaPagamento ?? 'Parcelado'}</div>

      ${honorario.tipoPagamento === 'PARCELADO' && honorario.parcelas.length > 0
        ? `
        <hr />
        <h3>Parcelas</h3>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Valor (R$)</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            ${honorario.parcelas
              .sort((a, b) => a.id - b.id)
              .map((p, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${formatarData(p.dataVencimento)}</td>
                  <td>${p.dataPagamento ? formatarData(p.dataPagamento) : '—'}</td>
                  <td>${Number(p.valor).toFixed(2)}</td>
                  <td>${p.situacao}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
      `
        : ''}
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: `honorarios_${honorario.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .save();
}
