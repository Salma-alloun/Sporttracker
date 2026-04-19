// src/services/activityService.js
// Version RÉELLE - Avec connexion au backend

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';

// Récupérer l'ID de l'utilisateur connecté
const getUserId = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  } catch (error) {
    console.error('Erreur getUserId:', error);
    return null;
  }
};

// Récupérer toutes les activités de l'utilisateur
const getAll = async () => {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    console.log('📡 Appel API: GET /activities/user/${userId}');
    const response = await fetch(`${API_URL}/activities/user/${userId}`);
    const data = await response.json();
    console.log(`📡 ${data.length} activités reçues`);
    return data;
  } catch (error) {
    console.error('Erreur getAll:', error);
    return [];
  }
};

// Récupérer une activité par son ID
const getById = async (id) => {
  try {
    console.log(`📡 Appel API: GET /activities/${id}`);
    const response = await fetch(`${API_URL}/activities/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getById:', error);
    return null;
  }
};

// Sauvegarder une nouvelle activité
const save = async (activityData) => {
  try {
    console.log('📡 Appel API: POST /activities/save', activityData);
    const response = await fetch(`${API_URL}/activities/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
    const result = response.ok;
    console.log(`📡 Sauvegarde ${result ? 'réussie' : 'échouée'}`);
    return result;
  } catch (error) {
    console.error('Erreur save:', error);
    return false;
  }
};

// Supprimer une activité
const deleteActivity = async (id) => {
  try {
    console.log(`📡 Appel API: DELETE /activities/${id}`);
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur delete:', error);
    return false;
  }
};

// Récupérer les statistiques pour le tableau de bord
const getHomeStats = async (userId) => {
  try {
    console.log(`📡 Appel API: GET /activities/stats/${userId}`);
    const response = await fetch(`${API_URL}/activities/stats/${userId}`);
    const data = await response.json();
    console.log('📡 Statistiques reçues:', data);
    
    // ✅ S'assurer que les données sont au bon format
    return {
      totalActivities: data.totalActivities || 0,
      totalDistance: data.totalDistance || '0',
      totalDuration: data.totalDuration || '0 min',
      avgCalories: data.avgCalories || 0,
      avgSpeed: data.avgSpeed || '0',
      favoriteSport: data.favoriteSport || 'Aucun',
      hasActivities: (data.totalActivities || 0) > 0,
    };
  } catch (error) {
    console.error('Erreur getHomeStats:', error);
    return {
      totalActivities: 0,
      totalDistance: '0',
      totalDuration: '0 min',
      avgCalories: 0,
      avgSpeed: '0',
      favoriteSport: 'Aucun',
      hasActivities: false,
    };
  }
};

export const activityService = {
  getAll,
  getById,
  save,
  delete: deleteActivity,
  getHomeStats,
};