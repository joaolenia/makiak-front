import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import pessoasIcon from '../img/home/pessoas.png';
import processosIcon from '../img/home/processos.png';
import honorarioIcon from '../img/home/honorarios.png';
import vencimentosIcon from '../img/home/vencimentos.png';
import sairIcon from '../img/home/sair.png';

const Home: React.FC = () => {
  return (
    <div className="banner">
      <div className="overlay">
        {/* Ícone de sair */}
        <Link to="/" className="logout-icon" title="Sair">
         <img src={sairIcon} alt="Sair" />
        </Link>

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
          <Link to="/vencimentos" className="service">
            <img src={vencimentosIcon} alt="Vencimentos" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
