import React, { useEffect, useState } from 'react';
import './Pessoas.css';
import { Link } from 'react-router-dom';
import FormPessoaFisica from './form/FormPessoaFisica';
import EditarPessoaFisica from './form/EditarPessoaFisica';
import FormPessoaJuridica from './form/FormPessoaJuridica';
import EditarPessoaJuridica from './form/EditarPessoaJuridica';

import {
  buscarPessoaFisicaPorNome,
  buscarPessoaJuridicPorNome,
  getPessoaFisicaById,
  getPessoaJuridicaById,
  copiarPessoaFisica,
  copiarPessoajuridica
} from './axios/Requests';

interface Pessoa {
  id: string;
  nome: string;
}

interface PessoaDetalhes {
  nome: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao?: string | null;
  rg: string;
  orgaoExpedidorRg: string;
  cpf: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string | null;
  whatsapp?: string | null;
  telefone?: string | null;
  observacoes?: string | null;
}

interface PessoaJuridicaDetalhes {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cep: string;
  uf: string;
  email?: string | null;
  telefone?: string | null;
  observacoes?: string | null;
  representantes: { id: number; nome: string }[];
}

export default function Pessoas() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
  const [busca, setBusca] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [detalhesPessoa, setDetalhesPessoa] = useState<PessoaDetalhes | PessoaJuridicaDetalhes | null>(null);


  useEffect(() => {
    setSelected(null);
    setDetalhesPessoa(null);
    setPessoas([]);
  }, [tipoPessoa]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!busca.trim()) return;

      try {
        const resultado =
          tipoPessoa === 'fisica'
            ? await buscarPessoaFisicaPorNome(busca)
            : await buscarPessoaJuridicPorNome(busca);

        const pessoasConvertidas: Pessoa[] = resultado.map((p: any) => ({
          id: String(p.id),
          nome: tipoPessoa === 'fisica' ? p.nome : p.razaoSocial,
        }));

        setPessoas(pessoasConvertidas);
        setSelected(null);
        setDetalhesPessoa(null);
      } catch (error) {
        console.error('Erro na busca:', error);
        setPessoas([]);
        setDetalhesPessoa(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [busca, tipoPessoa]);

  const handleSelecionarPessoa = async (id: string) => {
    if (selected === id) {
      setSelected(null);
      setDetalhesPessoa(null);
      return;
    }

    setSelected(id);
    try {
      if (tipoPessoa === 'fisica') {
        const dados = await getPessoaFisicaById(id);
        setDetalhesPessoa(dados);
      } else {
        const dados = await getPessoaJuridicaById(id);
        setDetalhesPessoa(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const handleCopiar = async () => {
    if (!selected) return;

    try {
      const texto =
        tipoPessoa === 'fisica'
          ? await copiarPessoaFisica(selected)
          : await copiarPessoajuridica(selected);

      await navigator.clipboard.writeText(texto);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

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
        <div className="search-area">
          <input
            type="text"
            placeholder="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className="tipo-select"
            value={tipoPessoa}
            onChange={(e) => setTipoPessoa(e.target.value as 'fisica' | 'juridica')}
          >
            <option value="fisica">Pessoa Física</option>
            <option value="juridica">Pessoa Jurídica</option>
          </select>
        </div>

        <div className="content">
          <aside>
            <ul className="pessoa-lista">
              {pessoas.map((pessoa) => (
                <li
                  key={pessoa.id}
                  className={selected === pessoa.id ? 'active' : ''}
                  onClick={() => handleSelecionarPessoa(pessoa.id)}
                >
                  {pessoa.nome}
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
  {detalhesPessoa ? (
    <div className="main-grid">
      <div className="col-esquerda">
        {tipoPessoa === 'fisica' ? (
          <>
            <h2>{(detalhesPessoa as PessoaDetalhes).nome}</h2>
            <p>
              <strong>Nacionalidade:</strong> {(detalhesPessoa as PessoaDetalhes).nacionalidade}<br />
              <strong>Estado civil:</strong> {(detalhesPessoa as PessoaDetalhes).estadoCivil}<br />
              <strong>Profissão:</strong> {(detalhesPessoa as PessoaDetalhes).profissao ?? 'N/A'}<br />
              <strong>RG:</strong> {(detalhesPessoa as PessoaDetalhes).rg} {(detalhesPessoa as PessoaDetalhes).orgaoExpedidorRg}<br />
              <strong>CPF:</strong> {(detalhesPessoa as PessoaDetalhes).cpf}<br />
              <strong>Endereço:</strong> {(detalhesPessoa as PessoaDetalhes).endereco}, {(detalhesPessoa as PessoaDetalhes).uf}, {(detalhesPessoa as PessoaDetalhes).cep}<br />
              <strong>Email:</strong> {(detalhesPessoa as PessoaDetalhes).email ?? 'N/A'}<br />
              <strong>WhatsApp:</strong> {(detalhesPessoa as PessoaDetalhes).whatsapp ?? 'N/A'}<br />
              <strong>Telefone Fixo:</strong> {(detalhesPessoa as PessoaDetalhes).telefone ?? 'N/A'}
            </p>
            <div className="observacoes">
              <strong>OBSERVAÇÕES</strong>
              <p>{(detalhesPessoa as PessoaDetalhes).observacoes ?? 'Nenhuma observação registrada.'}</p>
            </div>
          </>
        ) : (
          <>
            <h2>{(detalhesPessoa as PessoaJuridicaDetalhes).razaoSocial}</h2>
            <p>
              <strong>Razão Social:</strong> {(detalhesPessoa as PessoaJuridicaDetalhes).razaoSocial}<br />
              <strong>CNPJ:</strong> {(detalhesPessoa as PessoaJuridicaDetalhes).cnpj}<br />
              <strong>Endereço:</strong> {(detalhesPessoa as PessoaJuridicaDetalhes).endereco}, {(detalhesPessoa as PessoaJuridicaDetalhes).uf}, {(detalhesPessoa as PessoaJuridicaDetalhes).cep}<br />
              <strong>Email:</strong> {(detalhesPessoa as PessoaJuridicaDetalhes).email ?? 'N/A'}<br />
              <strong>Telefone:</strong> {(detalhesPessoa as PessoaJuridicaDetalhes).telefone ?? 'N/A'}<br />
              <strong>Representante(s):</strong>
              <ul>
                {(detalhesPessoa as PessoaJuridicaDetalhes).representantes?.map((rep) => (
                  <li key={rep.id}>{rep.nome}</li>
                )) ?? <li>Nenhum representante cadastrado</li>}
              </ul>
            </p>
            <div className="observacoes">
              <strong>OBSERVAÇÕES</strong>
              <p>{(detalhesPessoa as PessoaJuridicaDetalhes).observacoes ?? 'Nenhuma observação registrada.'}</p>
            </div>
          </>
        )}
      </div>

      <div className="col-direita">
        <div className="processos">
          <strong>PROCESSOS</strong>
          <ul>
            <li>Carregamento futuro de processos...</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ padding: '2rem' }}></div>
  )}

  <div className="btn-direita">
    <button className="copiar-btn" onClick={handleCopiar}>COPIAR</button>
  </div>
</main>

        </div>

        <div className="btn-cadastrar-container">
          <button className="cadastrar-btn" onClick={() => setShowCadastro(true)}>CADASTRAR</button>
        </div>
      </div>

      {showCadastro && (
        <div className="modal-overlay">
          {tipoPessoa === 'fisica' ? (
            <FormPessoaFisica onClose={() => setShowCadastro(false)} />
          ) : (
            <FormPessoaJuridica onClose={() => setShowCadastro(false)} />
          )}
        </div>
      )}

      {showEditar && selected && (
        <div className="modal-overlay">
          {tipoPessoa === 'fisica' ? (
            <EditarPessoaFisica id={selected} onClose={() => setShowEditar(false)} />
          ) : (
            <EditarPessoaJuridica id={selected} onClose={() => setShowEditar(false)} />
          )}
        </div>
      )}
    </div>
  );
}
