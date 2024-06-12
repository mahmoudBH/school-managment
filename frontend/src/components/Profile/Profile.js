// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de la page
    const checkUserSession = async () => {
      try {
        if (!token) {
          navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
          return;
        }

        if (!userId) {
          console.error('Identifiant utilisateur introuvable.');
          return;
        }

        // Vérifier le token et obtenir les informations de l'utilisateur
        const response = await axios.get(`/api/user/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          navigate('/login'); // Rediriger vers la page de connexion si la session n'est pas valide
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
        navigate('/login'); // Rediriger vers la page de connexion en cas d'erreur
      }
    };

    checkUserSession();
  }, [navigate, userId, token]);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-details">
          <h1 className='h1'>User profile</h1>
          {user.photo ? (
            <img className='photo-profile' src={`http://localhost:5000${user.photo}`} alt="Profil" />
          ) : (
            <div className="photo-placeholder">Aucune photo</div>
          )}
          <p><strong>First Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phone_number}</p>
          <p><strong>Type:</strong> {user.type}</p>
          <p><strong>CIN:</strong> {user.cin}</p>

          <Link to="/edit-profile">
            <button className="Btn-edit-profile">Edit
              <svg className="svg-edit" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
          </Link>
        </div>
      ) : (
        <p>Chargement des informations de l'utilisateur...</p>
      )}
    </div>
  );
};

export default Profile;
