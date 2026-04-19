// src/hooks/useAuth.jsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';
import { userService } from '../services/userService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Erreur checkAuth:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📤 Tentative de connexion:', { email, password });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Statut réponse:', response.status);
      
      const data = await response.json();
      console.log('📥 Données réponse:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Email ou mot de passe incorrect');
      }

      if (!data.token) {
        throw new Error('Token non reçu');
      }

      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.log('❌ Erreur login:', err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Envoi inscription à:', `${API_URL}/users/register`);
      console.log('📦 Données:', JSON.stringify(userData, null, 2));
      
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📥 Statut réponse:', response.status);
      
      const data = await response.json();
      console.log('📥 Données réponse:', data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      return true;
    } catch (err) {
      console.log('❌ Erreur register:', err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // src/hooks/useAuth.jsx
const logout = async () => {
  try {
    console.log('🔓 Déconnexion...');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Déconnecté, isAuthenticated = false');
    return true;
  } catch (err) {
    console.error('Erreur logout:', err);
    return false;
  }
};

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;