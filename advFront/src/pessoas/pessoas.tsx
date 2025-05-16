import React, { useState } from 'react';
import './Pessoas.css';
import { Link } from 'react-router-dom';
import FormPessoaFisica from './form/FormPessoaFisica';
import EditarPessoaFisica from './form/EditarPessoaFisica';

const pessoas = Array(13).fill('João da Silva');

export default function Pessoas() {
  const [selected, setSelected] = useState(0);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);

  return (
    <div className="container">
      <header>
        <div className="title">PESSOAS</div>
        <div className="logo">
          <strong>STASIAK & MAKIAK</strong>
          <div>Advogados Associados</div>
        </div>
        <Link to="/" className="voltar">VOLTAR</Link>
      </header>

      <div className="content-wrapper">
        <div className="search">
          <input type="text" placeholder="buscar" />
        </div>

        <div className="content">
          <aside>
            <ul className="pessoa-lista">
              {pessoas.map((nome, index) => (
                <li
                  key={index}
                  className={selected === index ? 'active' : ''}
                  onClick={() => setSelected(index)}
                >
                  {nome}
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditar(true);
                    }}
                  >
                    ✎
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main>
            <div className="main-grid">
              <div className="col-esquerda">
                <h2>João da Silva</h2>
                <p>
                  Nacionalidade: Brasileiro<br />
                  Estado civil: Casado<br />
                  Profissão: Pedreiro<br />
                  RG: 14.234.552-7 SESP/PR<br />
                  CPF: 126.088.000-33<br />
                  Endereço: Rua 123 União da Vitória PR, 86430000<br />
                  Email: joao@email.com<br />
                  WhatsApp: 42 9 0002-8922<br />
                  Telefone Fixo: 3523-536
                </p>

                <div className="observacoes">
                  <strong>OBSERVAÇÕES</strong>
                  <p>
                    XXXXXXXXXXX x xxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxxxxx xxxxxxxxxxxxx
                    xxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxx XXX
                  </p>
                </div>
              </div>

              <div className="col-direita">
                <div className="processos">
                  <strong>PROCESSOS</strong>
                  <ul>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <li key={i}>XXXXXX</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="btn-direita">
              <button className="copiar-btn">COPIAR</button>
            </div>
          </main>
        </div>

        <div className="btn-cadastrar-container">
          <button className="cadastrar-btn" onClick={() => setShowCadastro(true)}>CADASTRAR</button>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {showCadastro && (
        <div className="modal-overlay">
          <FormPessoaFisica onClose={() => setShowCadastro(false)} />
        </div>
      )}

      {/* Modal de Edição */}
      {showEditar && (
        <div className="modal-overlay">
          <EditarPessoaFisica onClose={() => setShowEditar(false)} />
        </div>
      )}
    </div>
  );
}
