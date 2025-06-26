import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import pessoasIcon from '../img/home/pessoas.png';
import processosIcon from '../img/home/processos.png';
import honorarioIcon from '../img/home/honorarios.png';

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


        </div>
      </div>
    </div>
  );
};

export default Home;
