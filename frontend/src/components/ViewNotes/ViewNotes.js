import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewNotes.css'; // Fichier CSS pour le style

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate(); // Utiliser useNavigate pour gérer la redirection

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de la page
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
          return;
        }
        
        // Vérifier le token auprès du backend pour obtenir les informations de l'utilisateur et son rôle
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: token,
          },
        });
        
        if (response.status === 200) {
          setUserRole(response.data.user.type);
          fetchNotes(); // Si l'utilisateur est connecté, récupérer les notes
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session utilisateur :', error);
        navigate('/login'); // Rediriger vers la page de connexion en cas d'erreur
      }
    };

    checkUserSession();
  }, [navigate]); // Ajouter 'navigate' comme dépendance pour permettre la redirection

  // Fonction pour récupérer les notes depuis l'API
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notes', {
        headers: {
          Authorization: token,
        },
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Erreur lors de la récupération des notes :', error);
      setError('Erreur lors de la récupération des notes');
    }
  };

  // Fonction pour gérer le clic sur le bouton Modifier
  const handleEditClick = (note) => {
    setEditingNoteId(note.id);
    setFormData({ ...note }); // Pré-remplir le formulaire avec les données de la note
  };

  // Fonction pour mettre à jour une note
  const handleSaveClick = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notes/${noteId}`, formData, {
        headers: {
          Authorization: token,
        },
      });
      setEditingNoteId(null);
      fetchNotes(); // Re-fetch notes to update the table
    } catch (error) {
      setError('Erreur lors de la modification de la note');
      console.error(error);
    }
  };

  // Fonction pour supprimer une note
  const handleDeleteClick = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notes/${noteId}`, {
        headers: {
          Authorization: token,
        },
      });
      fetchNotes(); // Re-fetch notes to update the table
    } catch (error) {
      setError('Erreur lors de la suppression de la note');
      console.error(error);
    }
  };

  // Fonction pour mettre à jour les données du formulaire lors de la saisie
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="view-notes-container">
      <h2>List of Notes</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="notes-table">
        {/* En-tête de tableau */}
        <thead>
        <tr>
          <th>Photo</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Department</th>
          <th>Class</th>
          <th>Note</th>
          {userRole === 'admin' && (
            <>
              <th>Edit</th>
              <th>Delete</th>
            </>
          )}
        </tr>

        </thead>
        {/* Corps de tableau */}
        <tbody>
          {/* Mapping des notes */}
          {notes.map(note => (
            <tr key={note.id}>
              {/* Colonne de la photo */}
              <td>
                {note.photo ? (
                  <img 
                    className='photo-utilisateur'
                    src={`http://localhost:5000/uploads/${note.photo}`} // Mettez le chemin correct ici
                    alt="User" 
                    width="50" 
                    height="50" 
                  />
                ) : (
                  <img 
                    className='photo-utilisateur'
                    src="/default-user.png" // Image par défaut
                    alt="User" 
                    width="50" 
                    height="50" 
                  />
                )}
              </td>
              {/* Autres colonnes */}
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.first_name
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.last_name
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.section
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="classe"
                    value={formData.classe}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.classe
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.note
                )}
              </td>
              {/* Boutons Modifier et Supprimer (si l'utilisateur est un admin) */}
              {userRole === 'admin' && (
                <>
                  <td>
                    {editingNoteId === note.id ? (
                      <button className='Btn-save' onClick={() => handleSaveClick(note.id)}>
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
                    ) : (
                      <button className="Btn-edit" onClick={() => handleEditClick(note)}>Edit
                        <svg className="svg-edit" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="button" type="button" onClick={() => handleDeleteClick(note.id)}>
                        <span className="button__text">Delete</span>
                        <span className="button__icon">
                          <svg className="svg-delete" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                            <title></title>
                            <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                            <line style={{ stroke: '#fff', strokeLinecap: 'round', strokeMiterlimit: '10', strokeWidth: '32px' }} x1="80" x2="432" y1="112" y2="112"></line>
                            <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                            <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="256" x2="256" y1="176" y2="400"></line>
                            <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="184" x2="192" y1="176" y2="400"></line>
                            <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="328" x2="320" y1="176" y2="400"></line>
                          </svg>
                        </span>
                      </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewNotes;
