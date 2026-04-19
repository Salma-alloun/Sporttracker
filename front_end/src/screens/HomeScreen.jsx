// src/screens/HomeScreen.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
import { activityService } from '../services/activityService';
import { StatCard } from '../components/StatCard';
import { styles } from '../styles/HomeScreen.styles';
import { COLORS } from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalDistance: '0',
    totalDuration: '0 min',
    avgCalories: 0,
    avgSpeed: '0',
    favoriteSport: 'Aucun',
    hasActivities: false,
  });
  
  // ✅ Flag pour éviter les doubles appels
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadHomeData = useCallback(async (isRefresh = false) => {
    // ✅ Évite les appels simultanés
    if (isLoadingRef.current) return;
    
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // ✅ Évite les rechargements inutiles (sauf si refresh forcé)
    if (hasLoadedRef.current && !isRefresh) {
      return;
    }

    isLoadingRef.current = true;

    try {
      const homeStats = await activityService.getHomeStats(user.id);
      
      setStats({
        totalActivities: homeStats.totalActivities || 0,
        totalDistance: homeStats.totalDistance || '0',
        totalDuration: homeStats.totalDuration || '0 min',
        avgCalories: homeStats.avgCalories || 0,
        avgSpeed: homeStats.avgSpeed || '0',
        favoriteSport: homeStats.favoriteSport || 'Aucun',
        hasActivities: homeStats.totalActivities > 0,
      });
      
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user]);

  // ✅ Chargement initial
  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // ✅ Rafraîchissement manuel
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData(true);
    setRefreshing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 10 }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header avec bienvenue */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'Athlète'}</Text>
          </View>
          <View style={[styles.wsBadge, { backgroundColor: '#00FF9420' }]}>
            <View style={[styles.wsDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={[styles.wsText, { color: '#4CAF50' }]}>Online</Text>
          </View>
        </View>

        {/* Carte de bienvenue */}
        <LinearGradient colors={['#00E5FF20', '#0080FF15']} style={styles.goalCard}>
          <Text style={styles.goalTitle}>
            {stats.hasActivities
              ? 'Bienvenue sur votre espace sportif !'
              : 'Commencez votre première activité !'}
          </Text>
          <Text style={styles.goalHint}>
            {stats.hasActivities
              ? `Vous avez déjà réalisé ${stats.totalActivities} activité(s)`
              : 'Appuyez sur "Démarrer" pour commencer'}
          </Text>
        </LinearGradient>

        {/* Section statistiques */}
        <Text style={styles.sectionTitle}>Vos statistiques</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="fitness-outline"
            label="Activités"
            value={stats.totalActivities.toString()}
            color={COLORS.primary}
          />
          <StatCard
            icon="map-outline"
            label="Distance"
            value={`${stats.totalDistance} km`}
            color={COLORS.green}
          />
          <StatCard
            icon="time-outline"
            label="Durée totale"
            value={stats.totalDuration}
            color={COLORS.accent}
          />
          <StatCard
            icon="flame-outline"
            label="Moy. calories"
            value={`${stats.avgCalories} kcal`}
            color={COLORS.yellow}
          />
          <StatCard
            icon="speedometer-outline"
            label="Vitesse moy."
            value={`${stats.avgSpeed} km/h`}
            color={COLORS.primary}
          />
          <StatCard
            icon="heart-outline"
            label="Sport favori"
            value={stats.favoriteSport}
            color={COLORS.accent}
          />
        </View>

        {/* Bouton démarrer */}
        <TouchableOpacity onPress={() => navigation.navigate('Track')}>
          <LinearGradient colors={['#FF3D6B', '#FF6B35']} style={styles.startBtn}>
            <View style={styles.startBtnContent}>
              <View style={styles.startBtnLeft}>
                <Ionicons name="play-circle" size={32} color="#fff" />
                <View>
                  <Text style={styles.startBtnTitle}>Démarrer une activité</Text>
                  <Text style={styles.startBtnSubtitle}>GPS - Chrono - Calories</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Lien vers historique */}
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyLinkText}>Voir tout mon historique →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}