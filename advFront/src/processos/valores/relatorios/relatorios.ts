import html2pdf from 'html2pdf.js';

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
  const formatarData = (data: string | null): string => {
    if (!data) return '—';
    const dt = new Date(data);
    return dt.toLocaleDateString('pt-BR');
  };

  const totalFormatado = Number(valor.valorTotal).toFixed(2);

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 0;">STASIAK & MAKIAK</h1>
      <h3 style="text-align: center; margin-top: 0;">Advogados Associados</h3>

      <hr />

      <h2>EXTRATO DE VALORES DO PROCESSO</h2>
      <div><strong>Tipo de Pagamento:</strong> ${valor.tipoPagamento}</div>
      <div><strong>Total:</strong> R$ ${totalFormatado}</div>
      <div><strong>Situação:</strong> ${valor.situacao ?? '—'}</div>
      ${
        valor.tipoPagamento === 'PARCELADO'
          ? `
        <div><strong>Parcelas:</strong> ${valor.quantidadeParcelas}</div>
        <div><strong>Entrada:</strong> R$ ${valor.entrada != null ? Number(valor.entrada).toFixed(2) : '—'}</div>
        <div><strong>Pagas:</strong> ${valor.parcelasPagas}/${valor.quantidadeParcelas}</div>
      `
          : `
        <div><strong>Forma de Pagamento:</strong> ${valor.formaPagamento ?? '—'}</div>
      `
      }

      <hr />

      <h3>Parcelas</h3>
      <ul>
        ${valor.parcelas
          .map(
            parcela => `
          <li style="margin-bottom: 10px;">
            <strong>Vencimento:</strong> ${formatarData(parcela.dataVencimento)}<br />
            <strong>Pagamento:</strong> ${formatarData(parcela.dataPagamento)}<br />
            <strong>Valor:</strong> R$ ${Number(parcela.valor).toFixed(2)}<br />
            <strong>Situação:</strong> ${parcela.situacao}<br />
            <strong>Forma de Pagamento:</strong> ${parcela.formaPagamento ?? '—'}
          </li>
        `
          )
          .join('')}
      </ul>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: `extrato_valores_processo_${valor.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .save();
}
