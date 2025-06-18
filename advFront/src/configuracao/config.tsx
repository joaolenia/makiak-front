import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './config.css'

export function Configuracao() {
  const navigate = useNavigate();
  const [apiUrl, setApiUrl] = useState<string>(localStorage.getItem('apiUrl') || '');

  const handleSalvar = () => {
    localStorage.setItem('apiUrl', apiUrl);
    alert('Configuração salva com sucesso!');
    navigate(-1); 
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  return (
    <div className="config-container">
      <h2 className="config-titulo">Configuração de API</h2>

      <div className="config-campo">
        <label htmlFor="apiUrl">URL da API:</label>
        <input
          id="apiUrl"
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Ex: http://localhost:3000"
        />
      </div>

      <div className="config-botoes">
        <button className="config-btn-salvar" onClick={handleSalvar}>
          Confirmar
        </button>
        <button className="config-btn-voltar" onClick={handleVoltar}>
          Voltar
        </button>
      </div>
    </div>
  );
}
