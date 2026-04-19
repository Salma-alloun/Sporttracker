// src/services/geocodingService.js
// Service métier : transformation des données API en objets utilisables

import { searchPlaces, reverseGeocode } from '../apis/openStreetMapApi';

/**
 * Formate un résultat d'API en objet ville standardisé
 */
const formatCityResult = (item) => ({
  id: item.place_id,
  name: item.display_name.split(',')[0],
  fullName: item.display_name,
  latitude: parseFloat(item.lat),
  longitude: parseFloat(item.lon),
  type: item.type,
  importance: item.importance,
});

/**
 * Recherche des villes au Maroc par nom
 */
export const searchMoroccoCities = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const data = await searchPlaces(query);
    return data.map(formatCityResult);
  } catch (error) {
    console.error('Erreur recherche villes:', error);
    return [];
  }
};

/**
 * Récupère le nom d'une ville à partir de coordonnées GPS
 */
export const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    const data = await reverseGeocode(latitude, longitude);
    const address = data.address;
    return address?.city || address?.town || address?.village || null;
  } catch (error) {
    console.error('Erreur reverse geocoding:', error);
    return null;
  }
};

/**
 * Récupère les coordonnées d'une ville par son nom
 */
export const getCityCoordinates = async (cityName) => {
  const results = await searchMoroccoCities(cityName);
  return results.length > 0 ? results[0] : null;
};