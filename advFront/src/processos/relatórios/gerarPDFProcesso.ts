import html2pdf from 'html2pdf.js';

interface Pessoa {
  nome: string;
}

interface Descricao {
  data: string;
  descricao: string;
}

interface Processo {
  numero: string;
  subnumero?: string;
  data: string;
  situacao: string;
  tipo: string;
  pasta?: string;
  autores: Pessoa[];
  reus: Pessoa[];
  terceiros: Pessoa[];
  vara?: string;
  cidade?: string;
}

export function gerarPDFProcesso(processo: Processo, descricoes: Descricao[]) {
  const autores = processo.autores.map(p => p.nome).join(', ') || '—';
  const reus = processo.reus.map(p => p.nome).join(', ') || '—';
  const terceiros = processo.terceiros.map(p => p.nome).join(', ') || '—';

  const formatarData = (data: string): string => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 0;">STASIAK & MAKIAK</h1>
      <h3 style="text-align: center; margin-top: 0;">Advogados Associados</h3>

      <hr />

      <h2 style="margin-bottom: 5px;">Processo nº ${processo.numero}</h2>
      ${processo.subnumero ? `<div><strong>Subnúmero:</strong> ${processo.subnumero}</div>` : ''}
      <div><strong>Data:</strong> ${formatarData(processo.data)}</div>
      <div><strong>Situação:</strong> ${processo.situacao}</div>
      <div><strong>Tipo:</strong> ${processo.tipo}</div>
      <div><strong>Pasta:</strong> ${processo.pasta || '—'}</div>
      <div><strong>Autor(es):</strong> ${autores}</div>
      <div><strong>Réu(s):</strong> ${reus}</div>
      <div><strong>Terceiro(s):</strong> ${terceiros}</div>
      <div><strong>Vara:</strong> ${processo.vara || '—'}</div>
      <div><strong>Cidade:</strong> ${processo.cidade || '—'}</div>

      <hr />

      <h3>Histórico de Descrições</h3>
      <ul>
        ${descricoes
          .sort((a, b) => b.data.localeCompare(a.data))
          .map(desc => `
            <li style="margin-bottom: 10px;">
              <strong>${formatarData(desc.data)}:</strong><br />
              ${desc.descricao.replace(/\n/g, '<br />')}
            </li>
          `)
          .join('')}
      </ul>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  html2pdf().from(element).set({
    margin: 10,
    filename: `processo_${processo.numero}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).save();
}
