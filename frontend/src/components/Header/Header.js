import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Header.css';
import logo from '../iset.png';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [userPhoto, setUserPhoto] = useState('');
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios.get(`/api/user/${userId}`)
        .then(response => {
          setUserPhoto(response.data.user.photo);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération de la photo de l\'utilisateur :', error);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId'); // Supprimer l'ID de l'utilisateur lors de la déconnexion
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {userType === 'admin' && (
            <li><Link to="/add-note">Add Note</Link></li>
          )}
          <li><Link to="/view-notes">View Notes</Link></li>
          {userType === 'admin' && (
            <li><Link to="/manage-users">Manage Users</Link></li>
          )}
          {userType === 'student' && (
            <li><Link to="/contact">Contact</Link></li>
          )}
          {userType === 'admin' && (
            <li><Link to="/message">Message</Link></li>
          )}
          <li><Link to="/about">About</Link></li>
          <li>
            {userPhoto && (
              <Link to="/profile">
                <img src={`http://localhost:5000${userPhoto}`} alt="Profile" className="profile-photo" />
              </Link>
            )}
          </li>
          <button className="Btn" onClick={handleLogout}>
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div className="text">Logout</div>
          </button>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
