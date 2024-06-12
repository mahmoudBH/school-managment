// Home.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Home.css'; // Importation du fichier CSS
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Rediriger vers la page de connexion si le token n'est pas présent
    }
  }, [navigate]);
  
  const onChange = date => {
    setDate(date);
  };

  return (
    <div className="home-container">
      <div className="cont-ainer">
      <section className="nouvelles">
        <h2><i className="fas fa-newspaper"></i> Nouvelles</h2>
        <div className="nouvelles-item">
          <h3>Description du projet ISETKE</h3>
          <p className="date"><i className="fas fa-calendar-alt"></i> 13 mai 2024</p>
          <p>Description du projet ISETKE Le projet s'inscrit dans le cadre de tout un...</p>
        </div>
        <div className="nouvelles-item">
          <h3>La politique qualité de l’ISET DE KEBELI</h3>
          <p className="date"><i className="fas fa-calendar-alt"></i> 2 mai 2024</p>
          <p>Politique ISET KEBELI_2-5-2024</p>
        </div>
        <div className="nouvelles-item">
          <h3>bourse Erasmus+ pour les étudiants (DSI 2024-2025)</h3>
          <p className="date"><i className="fas fa-calendar-alt"></i> 26 avril 2024</p>
          <p>bourse Erasmus+ pour les étudiants (DSI 2024-2025) Announcement_Cankri-for-Students-2024-2025</p>
        </div>
      </section>
      <section className="evenements">
        <h2><i className="fas fa-calendar-alt"></i> Événements</h2>
        <div className="evenements-item">
          <h3>Description du projet ISETKE</h3>
          <p>Description du projet ISETKE Le projet s'inscrit dans...</p>
        </div>
        <div className="evenements-item">
          <h3>La politique qualité de l’ISET DE KEBELI</h3>
          <p>Politique ISET KEBELI_2-5-2024</p>
        </div>
        <div className="evenements-item">
          <h3>bourse Erasmus+ pour les étudiants (DSI 2024-2025)</h3>
          <p>bourse Erasmus+ pour les étudiants (DSI 2024-2025) Announcement_Cankri-for-Students-2024-2025</p>
        </div>
      </section>
    </div>
      <div className="calendar-container">
        <h1>Mon Calendrier</h1>
        <Calendar
          onChange={onChange}
          value={date}
        />
        <p className="selected-date">Date sélectionnée: {date.toDateString()}</p>
      </div>
    </div>
  );
};

export default Home;
