import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario === 'admin' && senha === 'admin') {
      navigate('/home');
    } else {
      setErro('Usuário ou senha inválidos');
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
          />
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

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
