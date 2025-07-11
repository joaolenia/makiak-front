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
  const [role, setRole] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        username: usuario,
        senha: senha,
      });

      const userRole = response.data.role;
      localStorage.setItem('userRole', userRole);
      setRole(userRole);

      if (userRole !== 'BACKUP') {
        navigate('/home');
      }
      // Se for BACKUP, fica na tela mostrando o botão
    } catch (error) {
      setErro('Usuário ou senha inválidos');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleBackup = async () => {
    setBackupStatus('Fazendo backup...');
    try {
      const res = await api.post('/backup');
      if (res.data.sucesso) {
        setBackupStatus(`Backup criado com sucesso! Arquivo: ${res.data.arquivo}`);
      } else {
        setBackupStatus('Falha ao criar backup');
      }
    } catch {
      setBackupStatus('Erro ao criar backup');
    }
  };

  const handleVoltarLogin = () => {
    setRole(null);
    setUsuario('');
    setSenha('');
    setErro('');
    setBackupStatus(null);
    localStorage.removeItem('userRole');
  };

  if (role === 'BACKUP') {
    return (
      <div className="login-banner">
        <div className="login-overlay">
          <div className="login-container">
            <h1>Usuário Backup</h1>
            <button className="login-botao" onClick={handleBackup}>
              Fazer Backup
            </button>
            {backupStatus && <p>{backupStatus}</p>}
            <button 
              className="login-botao" 
              style={{ marginTop: '20px', backgroundColor: '#888' }}
              onClick={handleVoltarLogin}
            >
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela normal de login para outros usuários
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
              type="password"
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
