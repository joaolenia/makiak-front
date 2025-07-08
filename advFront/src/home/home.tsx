import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import pessoasIcon from '../img/home/pessoas.png';
import processosIcon from '../img/home/processos.png';
import honorarioIcon from '../img/home/honorarios.png';
import vencimentosIcon from '../img/home/vencimentos.png';


const Home: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (!storedRole) {
      navigate('/');
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="banner">
      <div className="overlay">
       <button className="logout-button" onClick={handleLogout}>
          SAIR
        </button>
        <div className="services">
          <Link to="/pessoas" className="service">
            <img src={pessoasIcon} alt="Pessoas" />
          </Link>

          <Link to="/processos" className="service">
            <img src={processosIcon} alt="Processos" />
          </Link>

          {role === 'PROPRIETARIO' && (
            <>
              <Link to="/honorarios" className="service">
                <img src={honorarioIcon} alt="Honorários" />
              </Link>

              <Link to="/vencimentos" className="service">
                <img src={vencimentosIcon} alt="Vencimentos" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
