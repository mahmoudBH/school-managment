import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewMessages.css';

const ViewMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Vérifier si un token est présent dans le localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          // Si aucun token n'est présent, rediriger vers la page de connexion
          window.location.href = '/login'; // Remplacez '/login' par le chemin de votre page de connexion
          return;
        }

        // Si un token est présent, envoyer une requête avec le token dans l'en-tête Authorization
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          // Utilisateur connecté, récupérer les messages
          const messagesResponse = await axios.get('/api/messages', {
            headers: {
              Authorization: token,
            },
          });
          setMessages(messagesResponse.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        setError('Erreur lors de la récupération des messages');
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="view-messages-container">
      <h2>Sent Messages</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="messages-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.email}</td>
              <td>{message.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMessages;
