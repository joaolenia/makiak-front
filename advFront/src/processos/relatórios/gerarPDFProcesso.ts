import jsPDF from 'jspdf';

// --- Interfaces ---
// (Estas interfaces foram mantidas como você definiu)
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
    // Adicionei valorCausa para manter a consistência com os outros relatórios, se aplicável
    valorCausa?: number | string;
}


// ==========================================================================
//      RELATÓRIO DE PROCESSO ÚNICO (FORMATO PROFISSIONAL)
// ==========================================================================

export function gerarPDFProcesso(processo: Processo, descricoes: Descricao[]) {
    // --- 1. Configurações de Design ---
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

    // --- 2. Funções Auxiliares de Desenho ---

    const addCabecalhoERodape = () => {
        const totalPages = (doc.internal as any).getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);

            // Cabeçalho
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
        if (value === null || value === undefined || String(value).trim() === '' || String(value).trim() === '—') return;
        
        const valorFormatado = String(value);
        const larguraLabel = 40;
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

    // --- 3. Construção do PDF ---

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(CORES.textoPrincipal);
    doc.text('RELATÓRIO DETALHADO DE PROCESSO', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Seção de Informações do Processo
    addTituloSecao('Informações do Processo');
    addLinhaInfo('Número', processo.numero);
    addLinhaInfo('Subnúmero', processo.subnumero);
    addLinhaInfo('Tipo', processo.tipo);
    addLinhaInfo('Situação', processo.situacao);
    addLinhaInfo('Data de Início', formatarData(processo.data));
    addLinhaInfo('Pasta', processo.pasta);
    addLinhaInfo('Comarca', processo.cidade && processo.vara ? `${processo.cidade} - ${processo.vara}` : processo.cidade || processo.vara);
    
    if (processo.valorCausa) {
        const valorNumerico = parseFloat(String(processo.valorCausa));
        const valorFormatado = !isNaN(valorNumerico) ? `R$ ${valorNumerico.toFixed(2).replace('.',',')}` : '—';
        addLinhaInfo('Valor da Causa', valorFormatado);
    }
            
    addLinhaInfo('Autor(es)', processo.autores.map(p => p.nome).join(', ') || '—');
    addLinhaInfo('Réu(s)', processo.reus.map(p => p.nome).join(', ') || '—');
    addLinhaInfo('Terceiro(s)', processo.terceiros.map(p => p.nome).join(', ') || '—');
    
    y += 5;

    // Seção de Histórico de Movimentações
    if (descricoes && descricoes.length > 0) {
        addTituloSecao('Histórico de Movimentações');

        // Ordena as descrições da mais recente para a mais antiga
        descricoes
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .forEach(desc => {
                const textoMovimentacao = `${formatarData(desc.data)} - ${desc.descricao}`;
                const linhas = doc.splitTextToSize(textoMovimentacao, MARGENS.larguraUtil - 2);

                verificarPaginacao(linhas.length * 5 + 2);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(CORES.textoPrincipal);
                doc.setFontSize(10);
                
                doc.text(linhas, MARGENS.left + 2, y); // Adiciona um pequeno recuo
                y += linhas.length * 5 + 1.5;
            });
    }

    // --- 4. Finalização e Download ---
    addCabecalhoERodape();
    doc.save(`Relatorio_Processo_${processo.numero.replace(/[^\w-]/g, '_')}.pdf`);
}