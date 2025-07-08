import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        username: usuario,
        senha: senha,
      });

      const { role } = response.data;

      localStorage.setItem('userRole', role);
      navigate('/home');
    } catch (error) {
      setErro('Usuário ou senha inválidos');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-banner">
      <div className="login-overlay">
        <div className="login-container">
          <h1 className="login-titulo">STASIAK & MAKIAK</h1>
          <h2 className="login-subtitulo">Advogados Associados</h2>

          <input
            className="login-input"
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="input-wrapper">
            <input
              className="login-input senha-input"
              type= 'password'
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {erro && <div className="login-erro">{erro}</div>}

          <button className="login-botao" onClick={handleLogin}>
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
