// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Email ou mot de passe incorrect');
  }

  if (!data.token) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // Stocker le token et l'utilisateur
  await AsyncStorage.setItem('userToken', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de l\'inscription');
  }

  return data;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('user');
};