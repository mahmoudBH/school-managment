import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Home from './components/Home/Home';
import AddNote from './components/AddNotes/AddNote';
import ViewNotes from './components/ViewNotes/ViewNotes';
import ManageUsers from './components/users/ManageUsers';
import ViewMessages from './components/Messages/ViewMessages';
import Contact from './components/Contact/Contact';
import About from './components/About/About';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import axios from 'axios';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/user', {
            headers: {
              Authorization: token
            }
          });
          setUserRole(response.data.user.type);
        } else {
          // Si aucun token n'est présent, rediriger vers la page de connexion
          setUserRole(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {userRole && <Header />}
      <Routes>
        {/* Route de la page d'accueil */}
        <Route path="/" element={userRole ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/view-notes" element={<ViewNotes />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/message" element={<ViewMessages />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
      {userRole && <Footer />}
    </Router>
  );
}

export default App;
