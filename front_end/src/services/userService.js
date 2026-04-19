// src/services/userService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';

// Récupérer le token JWT
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Erreur getToken:', error);
    return null;
  }
};

// Récupérer les informations de l'utilisateur connecté
const getCurrentUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    return null;
  }
};

// Récupérer les informations complètes de l'utilisateur depuis l'API
const getUserProfile = async (userId) => {
  try {
    const token = await getToken();
    console.log(`📡 GET /users/${userId} - Token présent: ${!!token}`);
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📡 Statut GET /users/${userId}: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getUserProfile:', error);
    return null;
  }
};

// ✅ Mettre à jour le profil utilisateur (version corrigée)
// src/services/userService.js - Version corrigée
const updateUserProfile = async (userId, updateData) => {
  try {
    const token = await getToken();
    
    // ✅ Log pour vérifier le token
    console.log('🔑 Token récupéré:', token ? `${token.substring(0, 20)}...` : 'AUCUN TOKEN');
    
    if (!token) {
      console.error('❌ Pas de token d\'authentification');
      return null;
    }
    
    console.log(`📡 PATCH /users/${userId} - Données:`, updateData);
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    console.log(`📡 Statut PATCH /users/${userId}: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse:', errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }
    
    const updatedUser = await response.json();
    console.log('✅ Profil mis à jour:', updatedUser);
    
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Erreur updateUserProfile:', error);
    return null;
  }
};

// Déconnexion
// src/services/userService.js
const logout = async () => {
  try {
    console.log('🔓 Déconnexion en cours...');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
    console.log('✅ Déconnexion réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur logout:', error);
    return false;
  }
};

export const userService = {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  logout,
  getToken,
};