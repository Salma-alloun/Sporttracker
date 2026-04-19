import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/HistoryScreen.styles';
import { COLORS, SPORT_COLORS } from '../styles/colors';

const API_URL = 'http:///10.84.246.91:3000';
const FILTERS = ['Tout', 'Course', 'Vélo', 'Natation', 'Randonnée', 'Gym', 'Tennis'];
const SPORT_ICONS = { Course: 'walk', Vélo: 'bicycle', Natation: 'water', Randonnée: 'compass', Gym: 'barbell', Tennis: 'tennisball' };

const formatDistance = (meters) => {
  const distance = parseFloat(meters) || 0;
  if (distance >= 1000) return `${(distance / 1000).toFixed(2)} km`;
  return `${Math.round(distance)} m`;
};

const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  if (minutes > 0) return `${minutes} min`;
  return `${seconds} sec`;
};

const formatSpeed = (speed) => {
  const s = parseFloat(speed) || 0;
  return s > 0 ? `${s.toFixed(1)} km/h` : '—';
};

const formatDateTime = (dateString) => {
  try {
    // La chaîne est "2026-04-05T17:52:25.796Z"
    // On veut extraire et ajouter 2 heures
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    let [hours, minutes] = timePart.split(':');
    
    // Ajouter 2 heures (Maroc UTC+1)
    let newHours = parseInt(hours) + 2;
    if (newHours >= 24) {
      newHours -= 24;
    }
    hours = newHours.toString().padStart(2, '0');
    
    const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 
                  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    
    return `${parseInt(day)} ${mois[parseInt(month)-1]} ${year} • ${hours}:${minutes}`;
  } catch (e) {
    return 'Date inconnue';
  }
};

export default function HistoryScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('Tout');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => { loadActivities(); }, []);
  useEffect(() => { applyFilter(); }, [activities, filter, search, sortBy]);

  const getUserId = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) return JSON.parse(userStr).id;
      return 6;
    } catch (error) { return 6; }
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const response = await fetch(`${API_URL}/activities/user/${userId}`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('❌ Erreur:', error);
      setActivities([]);
    } finally { setLoading(false); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const applyFilter = () => {
    let result = [...activities];
    if (filter !== 'Tout') result = result.filter(a => a.sport === filter);
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(a => a.sport?.toLowerCase().includes(searchLower));
    }
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.startTime) - new Date(a.startTime);
      if (sortBy === 'distance') return (parseFloat(b.distance) || 0) - (parseFloat(a.distance) || 0);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      return 0;
    });
    setFiltered(result);
  };

  const renderActivity = ({ item }) => {
    const color = SPORT_COLORS[item.sport] || COLORS.primary;
    const icon = SPORT_ICONS[item.sport] || 'fitness';

    return (
      <TouchableOpacity style={[styles.activityCard, { borderLeftColor: color, borderLeftWidth: 4 }]} onPress={() => navigation.navigate('ActivityDetail', { id: item.id })} activeOpacity={0.7}>
        <View style={styles.activityContent}>
          <View style={styles.cardHeader}>
            <View style={styles.sportContainer}>
              <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={22} color={color} />
              </View>
              <View>
                <Text style={styles.sportName}>{item.sport}</Text>
                <Text style={styles.activityTime}>{formatDateTime(item.startTime)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Ionicons name="location-outline" size={16} color={color} />
              <Text style={styles.metricValue}>{formatDistance(item.distance)}</Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.muted} />
              <Text style={styles.metricValue}>{formatDuration(item.duration)}</Text>
              <Text style={styles.metricLabel}>Durée</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Ionicons name="speedometer-outline" size={16} color="#FFD700" />
              <Text style={styles.metricValue}>{formatSpeed(item.averageSpeed)}</Text>
              <Text style={styles.metricLabel}>Vitesse</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="flash-outline" size={14} color="#FFD700" />
              <Text style={styles.detailText}>{item.calories || 0} kcal</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="flag-outline" size={14} color={item.isCompleted ? '#4CAF50' : '#FFA500'} />
              <Text style={[styles.detailText, { color: item.isCompleted ? '#4CAF50' : '#FFA500' }]}>{item.isCompleted ? 'Terminé' : 'En cours'}</Text>
            </View>
          </View>

          {item.route && item.route.length > 0 && (
            <View style={styles.routeInfo}>
              <Ionicons name="map-outline" size={14} color={COLORS.muted} />
              <Text style={styles.routeText}>Trajet enregistré ({item.route.length} points)</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de vos activités...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique</Text>
        <TouchableOpacity onPress={() => setSortBy(sortBy === 'date' ? 'distance' : sortBy === 'distance' ? 'duration' : 'date')}>
          <View style={styles.sortBtn}>
            <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sortText}>Trier par: {sortBy === 'date' ? 'Date' : sortBy === 'distance' ? 'Distance' : 'Durée'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.muted} />
          <TextInput style={styles.searchInput} placeholder="Rechercher un sport..." placeholderTextColor={COLORS.muted} value={search} onChangeText={setSearch} selectionColor={COLORS.primary} />
        </View>
      </View>

      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {FILTERS.map((item) => (
            <TouchableOpacity key={item} style={[styles.filterChip, filter === item && styles.filterChipActive]} onPress={() => setFilter(item)}>
              <Text style={[styles.filterChipText, filter === item && styles.filterChipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderActivity}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={60} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>Aucune activité</Text>
            <Text style={styles.emptyText}>{search || filter !== 'Tout' ? 'Essayez de modifier vos filtres' : 'Commencez par enregistrer une activité'}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}