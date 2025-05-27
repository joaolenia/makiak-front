import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Honorarios.css';
import EditarHonorarios from './form/EditarHonorarios';
import CadastroHonorarios from './form/CadastroHonorarios';
import { buscarHonorariosPorAutor, buscarHonorariosPorAutorAvista } from './axios/Requests';

export default function Honorarios() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState<'PARCELADO' | 'AVISTA'>('PARCELADO');
  const [busca, setBusca] = useState('');
  const [honorarios, setHonorarios] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (busca.trim()) {
        if (tipoPagamento === 'PARCELADO') {
          buscarHonorariosPorAutor(busca).then(setHonorarios);
        } else {
          buscarHonorariosPorAutorAvista(busca).then(setHonorarios);
        }
      } else {
        setHonorarios([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [busca, tipoPagamento]);

  useEffect(() => {
    setBusca('');
    setHonorarios([]);
  }, [tipoPagamento]);


const handleCardClick = (idHonorario: number) => {
  navigate(`/honorarios/${idHonorario}`);
};
;

  return (
    <div className="honorario-container-p">
      <header className="honorario-top-bar-p">
        <div className="honorario-titulo-p">HONORÁRIOS</div>
        <div className="honorario-logo-p">
          <strong>STASIAK & MAKIAK</strong>
          <div className="honorario-sub-logo-p">Advogados Associados</div>
        </div>
        <a href="#" className="honorario-voltar-p" onClick={() => navigate('/')}>VOLTAR</a>
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
              <div><strong>PROCESSO:</strong> Nº {h.processo.numero}</div>
              <div><strong>PASTA:</strong> {h.processo.pasta}</div>
              <div><strong>AUTOR:</strong> {h.processo.cidade}</div>
              <div><strong>TOTAL:</strong> <span style={{ color: 'green' }}>R$ {Number(h.valorTotal).toFixed(2)}</span></div>
            </div>

            <div className="honorario-card-direita-p">
              {tipoPagamento === 'PARCELADO' ? (
                <>
                  <div><strong>QTD PARCELAS:</strong> {h.quantidadeParcelas}</div>
                  <div><strong>PAGAS:</strong> {h.parcelasPagas}/{h.quantidadeParcelas}</div>
                  <div><strong>SITUAÇÃO:</strong> <span style={{ color: 'red' }}>{h.situacao || 'PENDENTE'}</span></div>
                  <div>
                    <strong>VALOR PARCELA:</strong> R$
                    {Array.isArray(h.parcelas) && h.parcelas.length > 0
                      ? Number(h.parcelas[0].valor).toFixed(2)
                      : '-'}
                  </div>

                </>
              ) : (
                <>
                  <div><strong>FORMA DE PAGAMENTO:</strong> {h.formaPagamento}</div>
                  <div><strong>SITUAÇÃO:</strong> <span style={{ color: 'green' }}>{h.situacao}</span></div>
                </>
              )}
            </div>

            <button
              className="honorario-edit-btn-p"
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarEdicao(true);
              }}
            >
              ✎
            </button>
          </div>
        ))}
      </div>

      <div className="honorario-btn-cadastrar-wrapper-p">
        <button className="honorario-btn-cadastrar-p" onClick={() => setMostrarCadastro(true)}>
          CADASTRAR
        </button>
      </div>

      {mostrarCadastro && <CadastroHonorarios onClose={() => setMostrarCadastro(false)} />}
      {mostrarEdicao && <EditarHonorarios onClose={() => setMostrarEdicao(false)} />}
    </div>
  );
}
