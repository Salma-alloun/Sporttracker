import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { activityService } from '../services/activityService';
import { styles, blockStyles } from '../styles/ActivityDetailScreen.styles';
import { COLORS } from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatTime = (s) => {
  if (!s) return '00:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const MOCK = { id: '1', type: 'Course', distance: 5200, duration: 1800, calories: 380, date: new Date().toISOString(), route: [] };

export default function ActivityDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [activity, setActivity] = useState(null);

  useEffect(() => { loadActivity(); }, []);

  const loadActivity = async () => {
    try {
      const data = await activityService.getById(id);
      setActivity(data);
    } catch (e) { setActivity(MOCK); }
  };

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer cette activité ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await activityService.delete(id); navigation.goBack(); } },
    ]);
  };

  if (!activity) return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: COLORS.muted }}>Chargement...</Text>
      </View>
    </SafeAreaView>
  );

  const mapRegion = activity.route?.length > 0 ? {
    latitude: activity.route[0].latitude,
    longitude: activity.route[0].longitude,
    latitudeDelta: 0.02, longitudeDelta: 0.02,
  } : null;

  const pace = activity.duration && activity.distance ? Math.round((activity.duration / 60) / (activity.distance / 1000)) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{activity.type}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        <Text style={styles.dateText}>
          {new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>

        {mapRegion && (
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={mapRegion} scrollEnabled={false} zoomEnabled={false}>
              {activity.route.length > 1 && <Polyline coordinates={activity.route} strokeColor={COLORS.primary} strokeWidth={4} />}
            </MapView>
          </View>
        )}

        <View style={styles.statsGrid}>
          <StatBlock icon="location" label="Distance" value={`${(activity.distance / 1000).toFixed(2)}`} unit="km" color={COLORS.primary} />
          <StatBlock icon="time" label="Durée" value={formatTime(activity.duration)} color="#00FF94" />
          <StatBlock icon="speedometer" label="Allure" value={`${pace}'`} unit="/km" color="#FFD700" />
          <StatBlock icon="flame" label="Calories" value={activity.calories?.toString()} unit="kcal" color={COLORS.accent} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ icon, label, value, unit, color }) {
  return (
    <View style={[blockStyles.container, { borderColor: `${color}30` }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={blockStyles.value}>{value}<Text style={blockStyles.unit}> {unit}</Text></Text>
      <Text style={blockStyles.label}>{label}</Text>
    </View>
  );
}