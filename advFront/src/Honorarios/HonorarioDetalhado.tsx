import React, { useState } from 'react';
import './HonorarioDetalhado.css';
import { useParams, useNavigate } from 'react-router-dom';
import EditarHonorarios from './form/EditarHonorarios'; // Importa o formulário

interface Parcela {
  data: string;
  valor: string;
  status: 'PAGO' | 'PENDENTE';
  tipo: string;
}

export default function HonorariosDetalhado() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mostrarEditar, setMostrarEditar] = useState(false); // controla pop-up

  console.log(id);

  const parcelas: Parcela[] = [
    { data: '22/12/2005', valor: 'R$ 110,00', status: 'PENDENTE', tipo: '' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
    { data: '22/11/2005', valor: 'R$ 110,00', status: 'PAGO', tipo: 'PIX' },
  ];

  return (
    <div className="honorario-container">
      <div className="honorario-top-bar">
        <button className="honorario-btn" onClick={() => setMostrarEditar(true)}>EDITAR</button>
        <div className="honorario-logo">
          <strong>STASIAK & MAKIAK</strong>
          <div className="honorario-sub-logo">Advogados Associados</div>
        </div>
        <a href="#" className="honorario-voltar" onClick={() => navigate('/honorarios')}>VOLTAR</a>
      </div>

      <div className="honorario-corpo">
        <div className="honorario-parcelas">
          {parcelas.map((parcela, idx) => (
            <div className="honorario-parcela" key={idx}>
              <span className="honorario-bolinha" />
              <div className="honorario-textos">
                <div className="honorario-data">{parcela.data}</div>
                <div className="honorario-descricao">
                  {parcela.valor}{' '}
                  <span style={{ color: parcela.status === 'PAGO' ? 'green' : 'red' }}>
                    {parcela.status}
                  </span><br />
                  <small>{parcela.tipo}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="honorario-dados">
          <div className="honorario-info-scroll">
            <div className="honorario-total">TOTAL: 3500,00</div>
            <div className="honorario-subnumero">Nº 000001112</div>

            <div><strong>PASTA:</strong> 127</div>
            <div><strong>AUTOR:</strong> Petrobras</div>
            <div><strong>RÉU:</strong> Joao Da Silva</div>
            <div><strong>TERCEIRO:</strong> União da Vitória PR</div>

            <br />
            <div><strong>PAGAMENTO</strong></div>
            <div style={{ color: 'red' }}><strong>PENDENTE</strong></div>
            <div><strong>QTD PARCELAS:</strong> 12</div>
            <div><strong>VALOR DA PARCELA:</strong> 110,00</div>
            <div><strong>PARCELAS PAGAS:</strong> 3/12</div>
          </div>

          <div className="honorario-botoes">
            <button className="honorario-acao">PAGAR</button>
            <button className="honorario-acao">EXTRATO</button>
          </div>
        </div>
      </div>

      {/* Pop-up de edição */}
      {mostrarEditar && (
        <EditarHonorarios onClose={() => setMostrarEditar(false)} />
      )}
    </div>
  );
}
