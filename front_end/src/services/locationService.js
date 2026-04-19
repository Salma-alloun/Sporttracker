// src/services/locationService.js
// Service métier : logique de tracking GPS

import * as Location from 'expo-location';
import { GPS_CONFIG, DEFAULT_POSITION } from '../config/constants';

/**
 * Calcule la distance entre deux points (formule Haversine)
 * @returns {number} Distance en mètres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Vérifie si un point GPS est suffisamment précis
 */
export const isPointAccurate = (accuracy) => {
  return accuracy <= GPS_CONFIG.ACCURACY_THRESHOLD;
};

/**
 * Calcule la vitesse à partir de la distance et du temps
 */
export const calculateSpeed = (distance, timeInSeconds) => {
  if (timeInSeconds <= 0) return 0;
  return (distance / timeInSeconds) * 3.6; // km/h
};

/**
 * Applique un lissage exponentiel à la vitesse
 */
export const smoothSpeed = (previousSpeed, newSpeed, factor = GPS_CONFIG.SPEED_SMOOTHING) => {
  if (previousSpeed === 0) return newSpeed;
  return previousSpeed * (1 - factor) + newSpeed * factor;
};

/**
 * Calcule les calories brûlées
 * @param {number} distanceKm - Distance en kilomètres
 * @param {number} caloriesPerKm - Calories par km pour le sport
 */
export const calculateCalories = (distanceKm, caloriesPerKm) => {
  return Math.round(distanceKm * caloriesPerKm);
};

/**
 * Position par défaut (Casablanca)
 */
export const getDefaultPosition = () => ({
  coords: {
    latitude: DEFAULT_POSITION.latitude,
    longitude: DEFAULT_POSITION.longitude,
    accuracy: 100,
  },
  timestamp: Date.now(),
});