// src/services/statService.js
import { activityService } from './activityService';

export const statService = {
  /**
   * Récupère les statistiques formatées pour l'affichage
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques formatées
   */
  getFormattedStats: async (userId) => {
    try {
      const stats = await activityService.getHomeStats(userId);
      
      return {
        totalActivities: stats.totalActivities || 0,
        totalDistance: stats.totalDistance || '0',
        totalDuration: stats.totalDuration || '0 min',
        avgCalories: stats.avgCalories || 0,
        avgSpeed: stats.avgSpeed || '0',
        favoriteSport: stats.favoriteSport || 'Aucun',
        hasActivities: stats.hasActivities || false,
      };
    } catch (error) {
      console.error('Erreur statService:', error);
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
  },
  
  /**
   * Calcule le pourcentage de progression (exemple)
   * @param {number} current - Valeur actuelle
   * @param {number} target - Objectif
   * @returns {number} Pourcentage
   */
  calculateProgress: (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  },
};