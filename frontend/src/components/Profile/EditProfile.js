import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    type: '',
    cin: '',
    photo: ''
  });
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
          const userData = response.data.user;
          setFormData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone_number: userData.phone_number,
            type: userData.type,
            cin: userData.cin,
            photo: userData.photo
          });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    data.append('phone_number', formData.phone_number);
    data.append('type', formData.type);
    data.append('cin', formData.cin);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const response = await axios.put(`/api/users/${userId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token, // Ajouter le token dans les headers de la requête
        }
      });
      const updatedUser = response.data.user;
      console.log('Photo URL:', updatedUser.photo);
      localStorage.setItem('userPhoto', updatedUser.photo);
      navigate('/profile'); // Rediriger vers la page profil après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations de l\'utilisateur :', error);
    }
    window.location.reload();
  };
    

    return (
        <div className="edit-profile-container">
            <h1 className='h1'>Edit Profile</h1>
            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="cin">CIN</label>
                <input
                    type="text"
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="photo">Photo</label>
                <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                />
            </div>
            <Link to="/profile">
            <button className='Btn--save' onClick={() => handleSave()}>
                      <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="30"
                            height="30"
                            class="icon"
                          >
                            <path
                              d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <span>Save</span>
                    </button>
            </Link>            
        </div>
    );
};

export default EditProfile;
