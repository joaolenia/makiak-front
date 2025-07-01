import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vencimentos.css';
import { buscarHonorariosVencidos } from '../Honorarios/axios/Requests';
import { buscarValoresVencidos } from '../processos/valores/axios/Requests';

export default function Vencimentos() {
  const navigate = useNavigate();

  // Inicializa tipo lendo do localStorage ou usa 'HONORARIOS' como padrão
  const [tipo, setTipo] = useState<'HONORARIOS' | 'VALORES'>(() => {
    const saved = localStorage.getItem('vencimentos-tipo');
    return saved === 'VALORES' ? 'VALORES' : 'HONORARIOS';
  });

  const [itens, setItens] = useState<any[]>([]);

  // Quando o filtro muda, salva no localStorage
  const handleTipoChange = (novoTipo: 'HONORARIOS' | 'VALORES') => {
    setTipo(novoTipo);
    localStorage.setItem('vencimentos-tipo', novoTipo);
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados =
          tipo === 'HONORARIOS'
            ? await buscarHonorariosVencidos()
            : await buscarValoresVencidos();

        setItens(dados);
      } catch (erro) {
        console.error('Erro ao carregar vencimentos:', erro);
      }
    };

    carregar();
  }, [tipo]);

  const handleCardClick = (item: any) => {
    if (tipo === 'HONORARIOS') {
      navigate(`/honorarios/${item.id}`);
    } else if (item.processo && item.processo.id) {
      navigate(`/processos/${item.processo.id}/valores`);
    } else {
      console.warn('Processo indefinido para item:', item);
    }
  };

  // Função para encontrar parcela vencida mais antiga
  function parcelaVencidaMaisAntiga(parcelas: any[]) {
    if (!parcelas || parcelas.length === 0) return null;
    const hoje = new Date();

    // Filtra parcelas pendentes com vencimento no passado (vencidas)
    const vencidas = parcelas.filter((p) => {
      return (
        p.situacao === 'PENDENTE' &&
        new Date(p.dataVencimento) < hoje
      );
    });

    if (vencidas.length === 0) return null;

    // Ordena pela data de vencimento crescente (mais antiga primeiro)
    vencidas.sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

    return vencidas[0];
  }

  return (
    <div className="vencimento-container">
      <header className="vencimento-top-bar">
        <div className="vencimento-titulo">VENCIMENTOS</div>
        <div className="vencimento-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="vencimento-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="vencimento-voltar" onClick={() => navigate('/')}>
          VOLTAR
        </a>
      </header>

      <div className="vencimento-filtros">
        <select
          className="vencimento-select"
          value={tipo}
          onChange={(e) => handleTipoChange(e.target.value as any)}
        >
          <option value="HONORARIOS">Honorários</option>
          <option value="VALORES">Valores</option>
        </select>
      </div>

      <div className="vencimento-lista">
        {itens.map((item, idx) => {
          const parcelaVencida = parcelaVencidaMaisAntiga(item.parcelas);

          return (
            <div
              key={idx}
              className="vencimento-card"
              onClick={() => handleCardClick(item)}
            >
              <div className="vencimento-card-esquerda">
                <div><strong>PROCESSO:</strong> Nº {item.processo?.numero || '-'}</div>
                <div><strong>PASTA:</strong> {item.processo?.pasta || '-'}</div>
                <div>
                  <strong>AUTOR:</strong>{' '}
                  {item.processo?.partes
                    ?.filter((p: any) => p.papel === 'AUTOR')
                    .map((p: any) => p.pessoaFisica?.nome || p.pessoaJuridica?.razaoSocial)
                    .join(', ') || 'Desconhecido'}
                </div>
                <div>
                  <strong>TOTAL:</strong>{' '}
                  <span style={{ color: 'green' }}>
                    R$ {Number(item.valorTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="vencimento-card-direita">
                {tipo === 'HONORARIOS' ? (
                  <>
                    <div><strong>QTD PARCELAS:</strong> {item.quantidadeParcelas}</div>
                    <div><strong>PAGAS:</strong> {item.parcelasPagas}/{item.quantidadeParcelas}</div>
                    <div>
                      <strong>SITUAÇÃO:</strong>{' '}
                      <span style={{ color: item.situacao === 'PENDENTE' ? 'red' : 'green' }}>
                        {item.situacao}
                      </span>
                    </div>
                    <div><strong>ENTRADA:</strong> {item.entrada || '-'}</div>
                  </>
                ) : (
                  <>
                    <div><strong>DESCRIÇÃO:</strong> {item.descricao || '-'}</div>
                    <div>
                      <strong>SITUAÇÃO:</strong>{' '}
                      <span style={{ color: item.situacao === 'PENDENTE' ? 'red' : 'green' }}>
                        {item.situacao}
                      </span>
                    </div>
                  </>
                )}

                {parcelaVencida ? (
                  <>
                    <div>
                      <strong>Data Vencimento:</strong>{' '}
                      <span className="vencimentos-data">
                        {new Date(parcelaVencida.dataVencimento).toLocaleDateString()}
                      </span>
                    </div>

                    <div><strong>Valor:</strong> R$ {Number(parcelaVencida.valor).toFixed(2)}</div>
                  </>
                ) : (
                  <div style={{ marginTop: 10, color: 'green' }}>Nenhuma parcela vencida</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
