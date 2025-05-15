import React from 'react';
import './home.css';
import pessoasIcon from '../img/home/pessoas.png';
import processosIcon from '../img/home/processos.png';
import relatoriosIcon from '../img/home/relatórios.png';
import honorarioIcon from '../img/home/honorarios.png';

const Home: React.FC = () => {
  return (
    <div className="banner">
      <div className="overlay">
        <div className="services">
          <div className="service">
            <img src={pessoasIcon} alt="" />
          </div>
          <div className="service">
            <img src={processosIcon} alt="Processos" />
          </div>
          <div className="service">
            <img src={honorarioIcon} alt="Honorários" />
          </div>
          <div className="service">
            <img src={relatoriosIcon} alt="Relatórios" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
