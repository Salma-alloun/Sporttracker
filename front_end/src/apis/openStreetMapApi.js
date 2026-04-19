// src/apis/openStreetMapApi.js
// Couche API : appels HTTP bruts vers OpenStreetMap

import axios from 'axios';
import { NOMINATIM } from '../config/constants';

/**
 * Appel API pour rechercher des lieux
 */
export const searchPlaces = async (query) => {
  const response = await axios.get(`${NOMINATIM.BASE_URL}/search`, {
    params: {
      q: `${query}, Maroc`,
      format: 'json',
      limit: NOMINATIM.LIMIT,
      addressdetails: 1,
      countrycodes: NOMINATIM.COUNTRY,
      'accept-language': NOMINATIM.LANGUAGE,
    },
    headers: { 'User-Agent': NOMINATIM.USER_AGENT },
  });
  return response.data;
};

/**
 * Appel API pour reverse geocoding (coords → nom ville)
 */
export const reverseGeocode = async (latitude, longitude) => {
  const response = await axios.get(`${NOMINATIM.BASE_URL}/reverse`, {
    params: {
      lat: latitude,
      lon: longitude,
      format: 'json',
      'accept-language': NOMINATIM.LANGUAGE,
    },
    headers: { 'User-Agent': NOMINATIM.USER_AGENT },
  });
  return response.data;
};