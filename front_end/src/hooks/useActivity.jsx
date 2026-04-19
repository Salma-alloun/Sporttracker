import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http:///10.84.246.91:3000';

export const useActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserId = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const userId = await getUserId();
      if (!userId) return;
      
      const response = await fetch(`${API_URL}/activities/user/${userId}`);
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivityById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const saveActivity = async (activityData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/activities/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });
      
      if (response.ok) {
        await fetchActivities();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchActivities();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getHomeStats = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/activities/stats/${userId}`);
      const data = await response.json();
      return data;
    } catch (err) {
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

  return {
    activities,
    loading,
    error,
    fetchActivities,
    getActivityById,
    saveActivity,
    deleteActivity,
    getHomeStats,
  };
};
export default useActivity;  // ← AJOUTE CETTE LIGNE