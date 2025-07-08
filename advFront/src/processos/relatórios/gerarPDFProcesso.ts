import jsPDF from 'jspdf';

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
  const doc = new jsPDF();

  const formatarData = (data: string): string => {
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
  doc.text(`Processo nº: ${processo.numero}`, 15, y);
  y += 8;

  if (processo.subnumero) {
    doc.text(`Subnúmero: ${processo.subnumero}`, 15, y);
    y += 8;
  }

  doc.text(`Data: ${formatarData(processo.data)}`, 15, y);
  y += 8;
  doc.text(`Situação: ${processo.situacao}`, 15, y);
  y += 8;
  doc.text(`Tipo: ${processo.tipo}`, 15, y);
  y += 8;
  doc.text(`Pasta: ${processo.pasta || '—'}`, 15, y);
  y += 8;
  doc.text(`Autor(es): ${processo.autores.map(p => p.nome).join(', ') || '—'}`, 15, y);
  y += 8;
  doc.text(`Réu(s): ${processo.reus.map(p => p.nome).join(', ') || '—'}`, 15, y);
  y += 8;
  doc.text(`Terceiro(s): ${processo.terceiros.map(p => p.nome).join(', ') || '—'}`, 15, y);
  y += 8;
  doc.text(`Vara: ${processo.vara || '—'}`, 15, y);
  y += 8;
  doc.text(`Cidade: ${processo.cidade || '—'}`, 15, y);
  
  y += 10;
  doc.line(15, y, 195, y);
  y += 10;

  doc.setFontSize(14);
  doc.text('Histórico de Descrições', 15, y);
  y += 10;

  doc.setFontSize(12);

  descricoes
    .sort((a, b) => b.data.localeCompare(a.data))
    .forEach(desc => {
      const dataFormatada = formatarData(desc.data);
      const texto = `${dataFormatada}: ${desc.descricao}`;

      const linhas = doc.splitTextToSize(texto, 180);

      if (y + linhas.length * 7 > 290) {
        doc.addPage();
        y = 15;
      }

      doc.text(linhas, 15, y);
      y += linhas.length * 7;
      y += 5; 
    });

  doc.save(`processo_${processo.numero}.pdf`);
}
