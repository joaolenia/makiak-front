import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import pessoasIcon from '../img/home/pessoas.png';
import processosIcon from '../img/home/processos.png';
import relatoriosIcon from '../img/home/relatórios.png';
import honorarioIcon from '../img/home/honorarios.png';
import configIcon from '../img/home/config.png';

const Home: React.FC = () => {
  return (
    <div className="banner">
      <div className="overlay">
        <div className="services">
          <Link to="/pessoas" className="service">
            <img src={pessoasIcon} alt="Pessoas" />
          </Link>
          <Link to="/processos" className="service">
            <img src={processosIcon} alt="Processos" />
          </Link>
          <Link to="/honorarios" className="service">
            <img src={honorarioIcon} alt="Honorários" />
          </Link>
          <Link to="/config" className="service">
            <img src={configIcon} alt="Configurações" />
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;
