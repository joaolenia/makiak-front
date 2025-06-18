import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Honorarios.css';
import CadastroHonorarios from './form/CadastroHonorarios';
import {
  buscarHonorariosPorAutor,
  buscarHonorariosPorAutorAvista,
  buscarHonorariosProximosVencimento,
} from './axios/Requests';

export default function Honorarios() {
  const navigate = useNavigate();
  const [selectedIndex] = useState<number | null>(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState<'PARCELADO' | 'AVISTA'>('PARCELADO');
  const [busca, setBusca] = useState('');
  const [honorarios, setHonorarios] = useState<any[]>([]);
  const [honorariosProximos, setHonorariosProximos] = useState<any[]>([]);

  useEffect(() => {
    const carregarHonorariosProximos = async () => {
      const dados = await buscarHonorariosProximosVencimento();
      setHonorariosProximos(dados);
      if (!busca.trim()) {
        setHonorarios(dados);
      }
    };
    carregarHonorariosProximos();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (busca.trim()) {
        if (tipoPagamento === 'PARCELADO') {
          buscarHonorariosPorAutor(busca).then(setHonorarios);
        } else {
          buscarHonorariosPorAutorAvista(busca).then(setHonorarios);
        }
      } else {
        setHonorarios(honorariosProximos);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busca, tipoPagamento, honorariosProximos]);

  useEffect(() => {
    setBusca('');
    setHonorarios(honorariosProximos);
  }, [tipoPagamento, honorariosProximos]);

  const handleCardClick = (idHonorario: number) => {
    navigate(`/honorarios/${idHonorario}`);
  };

  return (
    <div className="honorario-container-p">
      <header className="honorario-top-bar-p">
        <div className="honorario-titulo-p">HONORÁRIOS</div>
        <div className="honorario-logo-p">
          <strong>STASIAK & MAKIAK</strong>
          <div className="honorario-sub-logo-p">Advogados Associados</div>
        </div>
        <a href="#" className="honorario-voltar-p" onClick={() => navigate('/')}>
          VOLTAR
        </a>
      </header>

      <div className="honorario-filtros-p">
        <div className="honorario-busca-p">
          <span className="honorario-icone-p">🔍</span>
          <input
            type="text"
            placeholder="Buscar por autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          className="honorario-btn-filtro-p"
          value={tipoPagamento}
          onChange={(e) => setTipoPagamento(e.target.value as any)}
        >
          <option value="PARCELADO">Parcelado</option>
          <option value="AVISTA">À Vista</option>
        </select>
      </div>

      <div className="honorario-lista-p">
        {honorarios.map((h, idx) => (
          <div
            key={idx}
            className={`honorario-card-p ${selectedIndex === idx ? 'honorario-selecionado' : ''}`}
            onClick={() => handleCardClick(h.id)}
          >
            <div className="honorario-card-esquerda-p">
              <div>
                <strong>PROCESSO:</strong> Nº {h.processo.numero}
              </div>
              <div>
                <strong>PASTA:</strong> {h.processo.pasta}
              </div>
              <div>
                <strong>AUTOR:</strong>{' '}
                <div>
                  {h.processo.partes
                    ?.filter((p: any) => p.papel === 'AUTOR')
                    .map((p: any) => p.pessoaFisica?.nome || p.pessoaJuridica?.razaoSocial)
                    .join(', ') || 'Desconhecido'}
                </div>
              </div>
              <div>
                <strong>TOTAL:</strong>{' '}
                <span style={{ color: 'green' }}>R$ {Number(h.valorTotal).toFixed(2)}</span>
              </div>
            </div>

            <div className="honorario-card-direita-p">
              {tipoPagamento === 'PARCELADO' ? (
                <>
                  <div>
                    <strong>QTD PARCELAS:</strong> {h.quantidadeParcelas}
                  </div>
                  <div>
                    <strong>PAGAS:</strong> {h.parcelasPagas}/{h.quantidadeParcelas}
                  </div>
                  <div>
                    <strong>SITUAÇÃO:</strong>{' '}
                    <span style={{ color: h.situacao === 'PENDENTE' || !h.situacao ? 'red' : 'green' }}>
                      {h.situacao || 'PENDENTE'}
                    </span>
                  </div>
                  <div>
                    <strong>ENTRADA:</strong> {h.entrada || '-'}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>FORMA DE PAGAMENTO:</strong> {h.formaPagamento}
                  </div>
                  <div>
                    <strong>SITUAÇÃO:</strong> <span style={{ color: 'green' }}>{h.situacao}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="honorario-btn-cadastrar-wrapper-p">
        <button className="honorario-btn-cadastrar-p" onClick={() => setMostrarCadastro(true)}>
          CADASTRAR
        </button>
      </div>

      {mostrarCadastro && <CadastroHonorarios onClose={() => setMostrarCadastro(false)} />}
    </div>
  );
}
