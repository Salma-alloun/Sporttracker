// src/screens/TrackingScreen.jsx - VERSION AVEC WEBSOCKET
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  AppState,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGeolocation } from '../hooks/useGeolocation';
import useAuth from '../hooks/useAuth';
import { styles, liveStyles, darkMapStyle } from '../styles/TrackingScreen.styles';
import { COLORS } from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CityAutocomplete } from '../components/CityAutocomplete';
import { API_URL } from '../config/constants';
import webSocketService from '../services/websocketService';

const SPORT_TYPES = [
  { id: 'Course', icon: 'walk-outline', label: 'Course', caloriesPerKm: 65 },
  { id: 'Vélo', icon: 'bicycle-outline', label: 'Vélo', caloriesPerKm: 40 },
  { id: 'Randonnée', icon: 'compass-outline', label: 'Rando', caloriesPerKm: 55 },
  { id: 'Natation', icon: 'water-outline', label: 'Natation', caloriesPerKm: 80 },
];

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function TrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSport, setSelectedSport] = useState('Course');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [route, setRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState('unknown');
  const [initialRegion, setInitialRegion] = useState({
    latitude: 33.5731,
    longitude: -7.5898,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [mapReady, setMapReady] = useState(false);
  
  // ✅ État pour les autres utilisateurs (WebSocket)
  const [otherUsers, setOtherUsers] = useState([]);

  const timerRef = useRef(null);
  const lastPointRef = useRef(null);
  const mapRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const hasCenteredRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const routeRef = useRef([]);
  const distanceRef = useRef(0);
  const lastSpeedUpdateRef = useRef(0);
  const userIdRef = useRef(null);
  const isActiveRef = useRef(true);

  const { location, error: geoError, startTracking: startGpsTracking, stopTracking: stopGpsTracking, getCurrentLocation, calculateDistance } = useGeolocation();
  const { user } = useAuth();

  // Paramètres GPS
  const MIN_ACCURACY = 25;
  const MIN_DISTANCE_FILTER = 2;
  const SPEED_UPDATE_INTERVAL = 2;

  // ✅ Récupérer userId
  useEffect(() => {
    const getUserId = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userIdRef.current = userData.id;
      }
    };
    getUserId();
  }, []);

  // ✅ Connexion WebSocket au démarrage (si déjà connecté)
  useEffect(() => {
    if (userIdRef.current && !isTracking) {
      webSocketService.connect(
        userIdRef.current,
        (positionData) => {
          // Autre utilisateur a bougé
          if (isActiveRef.current) {
            setOtherUsers(prev => {
              const filtered = prev.filter(u => u.userId !== positionData.userId);
              return [...filtered, positionData];
            });
          }
        },
        (nearbyUsers) => {
          // Liste des utilisateurs à proximité
          if (isActiveRef.current) setOtherUsers(nearbyUsers);
        },
        (leftUserId) => {
          // Utilisateur déconnecté
          if (isActiveRef.current) {
            setOtherUsers(prev => prev.filter(u => u.userId !== leftUserId));
          }
        }
      );
    }
    
    return () => {
      isActiveRef.current = false;
      webSocketService.disconnect();
    };
  }, []);

  // Gestion de l'état de l'application
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isTracking && !isPaused) {
          initializeLocation();
        }
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isTracking, isPaused]);

  useEffect(() => { initializeLocation(); }, []);

  // Centrer la carte
  useEffect(() => {
    if (mapReady && location && !isTracking && !hasCenteredRef.current) {
      hasCenteredRef.current = true;
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion);
    }
  }, [mapReady, location, isTracking]);

  // ✅ Mise à jour de la position GPS avec WebSocket
  useEffect(() => {
    if (!isTracking || isPaused || !location || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const now = Date.now();
    const accuracy = location.coords?.accuracy || 999;
    
    if (accuracy > MIN_ACCURACY) {
      isUpdatingRef.current = false;
      return;
    }

    const newPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: now,
      accuracy: accuracy,
    };

    routeRef.current = [...routeRef.current, newPoint];
    if (routeRef.current.length % 5 === 0 || routeRef.current.length < 10) {
      setRoute([...routeRef.current]);
    }

    if (mapRef.current && isTracking) {
      mapRef.current.animateCamera({
        center: { latitude: newPoint.latitude, longitude: newPoint.longitude },
        zoom: 18,
      }, { duration: 300 });
    }

    if (lastPointRef.current) {
      const timeDiff = (now - lastPointRef.current.timestamp) / 1000;
      
      if (timeDiff > 0.2 && timeDiff < 5) {
        const movedDistance = calculateDistance(
          lastPointRef.current.latitude,
          lastPointRef.current.longitude,
          newPoint.latitude,
          newPoint.longitude
        );

        if (movedDistance >= MIN_DISTANCE_FILTER) {
          const newTotalDistance = distanceRef.current + movedDistance;
          distanceRef.current = newTotalDistance;
          setDistance(newTotalDistance);
          
          const nowSec = now / 1000;
          if (nowSec - lastSpeedUpdateRef.current >= SPEED_UPDATE_INTERVAL) {
            const timeDiffSpeed = nowSec - lastSpeedUpdateRef.current;
            const distanceDiff = distanceRef.current - (lastSpeedUpdateRef.current > 0 ? distanceRef.current - movedDistance : 0);
            
            if (timeDiffSpeed > 0 && distanceDiff > 0) {
              const avgSpeed = (distanceDiff / timeDiffSpeed) * 3.6;
              const finalSpeed = Math.min(Math.round(avgSpeed * 10) / 10, 30);
              setSpeed(finalSpeed);
              console.log(`🏃 Vitesse: ${finalSpeed} km/h | Distance: ${(newTotalDistance/1000).toFixed(2)} km`);
            }
            lastSpeedUpdateRef.current = nowSec;
          }
          
          console.log(`📍 +${movedDistance.toFixed(1)}m | Total: ${(newTotalDistance/1000).toFixed(2)}km`);
        }
        
        lastPointRef.current = newPoint;
      }
    } else {
      lastPointRef.current = newPoint;
      lastSpeedUpdateRef.current = now / 1000;
      console.log('📍 Point de départ enregistré');
    }
    
    // ✅ Envoyer position via WebSocket (pas en DB !)
    if (userIdRef.current) {
      webSocketService.sendPosition(
        userIdRef.current,
        newPoint.latitude,
        newPoint.longitude,
        accuracy,
        selectedSport
      );
    }
    
    setGpsStatus('active');
    isUpdatingRef.current = false;
  }, [location, isTracking, isPaused, calculateDistance, selectedSport]);

  // Calcul des calories
  useEffect(() => {
    if (isTracking && !isPaused) {
      const sport = SPORT_TYPES.find(s => s.id === selectedSport);
      const distanceKm = distance / 1000;
      const newCalories = Math.round(distanceKm * sport.caloriesPerKm);
      setCalories(newCalories);
    }
  }, [distance, selectedSport, isTracking, isPaused]);

  // Timer
  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { 
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTracking, isPaused]);

  const initializeLocation = async () => {
    setIsLoading(true);
    const loc = await getCurrentLocation();
    if (loc) {
      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(newRegion);
      setGpsStatus('active');
      if (mapRef.current && mapReady) {
        mapRef.current.animateToRegion(newRegion);
      }
    } else {
      setGpsStatus('inactive');
    }
    setIsLoading(false);
  };

  const startActivity = async () => {
    const started = await startGpsTracking();
    if (!started) { 
      Alert.alert('Erreur', 'Impossible de démarrer le tracking GPS'); 
      return; 
    }
    
    // ✅ Connexion WebSocket si pas déjà connectée
    if (userIdRef.current) {
      webSocketService.connect(
        userIdRef.current,
        (positionData) => {
          if (isActiveRef.current) {
            setOtherUsers(prev => {
              const filtered = prev.filter(u => u.userId !== positionData.userId);
              return [...filtered, positionData];
            });
          }
        },
        (nearbyUsers) => {
          if (isActiveRef.current) setOtherUsers(nearbyUsers);
        },
        (leftUserId) => {
          if (isActiveRef.current) {
            setOtherUsers(prev => prev.filter(u => u.userId !== leftUserId));
          }
        }
      );
    }
    
    // ✅ Notification locale de début d'activité
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏁 Activité démarrée',
        body: `Vous avez commencé une séance de ${selectedSport}`,
        data: { type: 'activity_start', sport: selectedSport },
      },
      trigger: null,
    });
    
    console.log('🏁 ACTIVITÉ DÉMARRÉE');
    hasCenteredRef.current = false;
    setIsTracking(true);
    setIsPaused(false);
    
    routeRef.current = [];
    distanceRef.current = 0;
    setRoute([]);
    setDistance(0);
    setCalories(0);
    setElapsedTime(0);
    setSpeed(0);
    lastPointRef.current = null;
    lastSpeedUpdateRef.current = 0;
  };

  const pauseActivity = () => { 
    setIsPaused(true);
    console.log('⏸️ PAUSE');
  };
  
  const resumeActivity = () => { 
    setIsPaused(false);
    console.log('▶️ REPRISE');
    lastSpeedUpdateRef.current = Date.now() / 1000;
  };

  const stopActivity = () => {
    Alert.alert("Arrêter l'activité", 'Voulez-vous enregistrer cette séance ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: discardActivity },
      { text: 'Enregistrer', onPress: saveActivity },
    ]);
  };

  const saveActivity = async () => {
    stopGpsTracking();
    setIsTracking(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const finalDistance = distanceRef.current;
    const finalRoute = routeRef.current;
    const finalDuration = elapsedTime;
    const finalAvgSpeed = finalDuration > 0 ? (finalDistance / finalDuration) * 3.6 : 0;
    const finalCalories = calories;
    
    console.log('💾 SAUVEGARDE:', { 
      distance_meters: finalDistance,
      distance_km: (finalDistance/1000).toFixed(2),
      duration_seconds: finalDuration,
      avg_speed_kmh: finalAvgSpeed.toFixed(1),
      calories: finalCalories,
      route_points: finalRoute.length 
    });
    
    if (!user || finalDuration < 5 || finalDistance < 5) { 
      Alert.alert('Erreur', 'Activité trop courte (minimum 5 secondes et 5 mètres)'); 
      resetState(); 
      return; 
    }

    const distanceKm = (finalDistance / 1000).toFixed(2);
    const timeStr = formatTime(finalDuration);

    try {
      const response = await fetch(`${API_URL}/activities/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sport: selectedSport,
          duration: finalDuration,
          distance: finalDistance,
          averageSpeed: finalAvgSpeed,
          calories: finalCalories,
          route: finalRoute,
          isCompleted: true,
        }),
      });

      if (response.ok) {
        // ✅ Notification locale de fin d'activité
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '✅ Activité terminée',
            body: `${selectedSport} — ${distanceKm} km en ${timeStr}`,
            data: { type: 'activity_complete', sport: selectedSport, distance: distanceKm, duration: timeStr },
          },
          trigger: null,
        });
        
        Alert.alert('Succès', `${selectedSport} — ${distanceKm} km en ${timeStr}`);
        resetState();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur saveActivity:', error);
      Alert.alert('Erreur', error.message || "Impossible d'enregistrer l'activité");
      setIsTracking(true);
    }
  };

  const discardActivity = () => {
    stopGpsTracking();
    setIsTracking(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetState();
    Alert.alert('Activité supprimée', 'La séance a été annulée');
  };

  const resetState = () => {
    routeRef.current = [];
    distanceRef.current = 0;
    setRoute([]);
    setDistance(0);
    setCalories(0);
    setElapsedTime(0);
    setSpeed(0);
    lastPointRef.current = null;
    lastSpeedUpdateRef.current = 0;
  };

  const handleCitySelect = (city) => {
    if (city.latitude && city.longitude && !isTracking) {
      const newRegion = {
        latitude: city.latitude,
        longitude: city.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(newRegion);
      if (mapRef.current && mapReady) {
        mapRef.current.animateToRegion(newRegion);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.text }}>Initialisation GPS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (gpsStatus === 'inactive') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="location-off" size={80} color={COLORS.accent} />
          <Text style={{ fontSize: 24, color: COLORS.text, marginTop: 20 }}>GPS inactif</Text>
          <Text style={{ fontSize: 16, color: COLORS.muted, textAlign: 'center', marginTop: 10 }}>
            Activez votre GPS pour tracer vos activités.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, marginTop: 30 }}
            onPress={initializeLocation}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={isTracking}
          customMapStyle={darkMapStyle}
          onMapReady={() => setMapReady(true)}
        >
          {/* Route de l'utilisateur */}
          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeColor={COLORS.primary}
              strokeWidth={4}
            />
          )}
          
          {/* Marqueur de départ */}
          {route.length > 0 && (
            <Marker coordinate={route[0]} title="Départ">
              <View style={styles.startMarker}>
                <Ionicons name="flag" size={16} color="#fff" />
              </View>
            </Marker>
          )}
          
          {/* Marqueur de position actuelle */}
          {route.length > 1 && (
            <Marker coordinate={route[route.length - 1]} title="Position actuelle">
              <View style={styles.currentMarker}>
                <Ionicons name="navigate" size={16} color="#fff" />
              </View>
            </Marker>
          )}
          
          {/* ✅ Autres utilisateurs (WebSocket) */}
          {otherUsers.map(user => (
            <Marker
              key={user.userId}
              coordinate={{
                latitude: user.position.lat,
                longitude: user.position.lng
              }}
              title={`Utilisateur ${user.userId}`}
              description={`Distance: ${user.distance || '?'}m`}
            >
              <View style={styles.otherUserMarker}>
                <Ionicons name="person" size={14} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={[styles.wsIndicator, { backgroundColor: gpsStatus === 'active' ? '#00FF9430' : '#FF3D6B30' }]}>
          <View style={[styles.wsDot, { backgroundColor: gpsStatus === 'active' ? COLORS.green : COLORS.accent }]} />
          <Text style={[styles.wsLabel, { color: gpsStatus === 'active' ? COLORS.green : COLORS.accent }]}>
            {gpsStatus === 'active' ? 'GPS ACTIF' : 'GPS INACTIF'}
          </Text>
        </View>

        {geoError && (
          <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
            <View style={[styles.wsIndicator, { backgroundColor: '#FF3D6B30' }]}>
              <Ionicons name="alert-circle" size={16} color={COLORS.accent} />
              <Text style={[styles.wsLabel, { color: COLORS.accent }]}>{geoError}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.panel}>
        <CityAutocomplete onSelectCity={handleCitySelect} placeholder="Rechercher une ville..." />

        {!isTracking ? (
          <>
            <Text style={styles.panelTitle}>Choisir l'activité</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportList}>
              {SPORT_TYPES.map(sport => (
                <TouchableOpacity
                  key={sport.id}
                  style={[styles.sportBtn, selectedSport === sport.id && styles.sportBtnActive]}
                  onPress={() => setSelectedSport(sport.id)}
                >
                  <Ionicons name={sport.icon} size={22} color={selectedSport === sport.id ? COLORS.primary : COLORS.muted} />
                  <Text style={[styles.sportBtnLabel, selectedSport === sport.id && { color: COLORS.primary }]}>
                    {sport.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={styles.statsRow}>
            <LiveStat label="DURÉE" value={formatTime(elapsedTime)} icon="time-outline" color={COLORS.primary} />
            <LiveStat label="DISTANCE" value={(distance / 1000).toFixed(2)} unit="km" icon="location-outline" color={COLORS.green} />
            <LiveStat label="VITESSE" value={speed.toFixed(1)} unit="km/h" icon="speedometer-outline" color={COLORS.accent} />
            <LiveStat label="CALORIES" value={calories.toString()} unit="kcal" icon="flame-outline" color="#FFD700" />
          </View>
        )}

        <View style={styles.controls}>
          {!isTracking ? (
            <TouchableOpacity onPress={startActivity}>
              <LinearGradient colors={[COLORS.accent, '#FF6B35']} style={styles.mainBtn}>
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.mainBtnText}>Démarrer</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={isPaused ? resumeActivity : pauseActivity}>
                <Ionicons name={isPaused ? 'play' : 'pause'} size={24} color={COLORS.primary} />
                <Text style={styles.secondaryBtnText}>{isPaused ? 'Reprendre' : 'Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={stopActivity}>
                <LinearGradient colors={[COLORS.accent, '#FF6B35']} style={[styles.mainBtn, { paddingHorizontal: 30 }]}>
                  <Ionicons name="stop" size={24} color="#fff" />
                  <Text style={styles.mainBtnText}>Arrêter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isTracking && (
          <View style={styles.statusBar}>
            <View style={[styles.statusDot, { backgroundColor: isPaused ? COLORS.accent : COLORS.green }]} />
            <Text style={styles.statusText}>{isPaused ? 'En pause' : `${selectedSport} en cours...`}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function LiveStat({ label, value, unit, icon, color }) {
  return (
    <View style={liveStyles.container}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={liveStyles.value}>{value}</Text>
      {unit && <Text style={liveStyles.unit}>{unit}</Text>}
      <Text style={liveStyles.label}>{label}</Text>
    </View>
  );
}