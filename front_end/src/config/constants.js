// src/config/constants.js

// ==================== API CONFIGURATION ====================
// Changer 'dev' en 'prod' pour la production, 'mock' pour les tests
const ENV = "dev"; // "mock" | "dev" | "prod"

const URLS = {
  mock: "https://bf3a92df-dc7a-441c-80dc-11ae4bb35595.mock.pstmn.io",
  dev: "http:////10.84.246.91:3000",  // ← Remplace par ton IP locale
  prod: "https://api.sporttracker.com", // ← À changer en production
};

export const API_URL = URLS[ENV];

// ==================== OPENSTREETMAP NOMINATIM ====================
export const NOMINATIM = {
  BASE_URL: 'https://nominatim.openstreetmap.org',
  USER_AGENT: 'SportTrackerApp/1.0',
  COUNTRY: 'ma',
  LANGUAGE: 'fr',
  LIMIT: 10,
};

// ==================== POSITION PAR DÉFAUT ====================
export const DEFAULT_POSITION = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

// ==================== CONFIGURATION GPS ====================
export const GPS_CONFIG = {
  ACCURACY_THRESHOLD: 20,
  MIN_DISTANCE: 3,
  DRIFT_THRESHOLD: 10,
  SPEED_SMOOTHING: 0.3,
};