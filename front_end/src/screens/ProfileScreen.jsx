// src/screens/ProfileScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../hooks/useAuth';
import { userService } from '../services/userService';
import { EditProfileModal } from '../components/EditProfileModal';
import { styles } from '../styles/ProfileScreen.styles';
import { COLORS } from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config/constants';

// Menu items
const MENU_ITEMS = [
  { id: 'edit', icon: 'person-outline', label: 'Modifier le profil', color: '#00E5FF' },
  { id: 'notifications', icon: 'notifications-outline', label: 'Paramètres notifications', color: '#FFD700' },
  { id: 'goals', icon: 'flag-outline', label: 'Objectifs', color: '#00FF94' },
  { id: 'nutrition', icon: 'restaurant-outline', label: 'Conseils nutrition', color: '#4CAF50' },
  { id: 'fcm_token', icon: 'key-outline', label: '🔑 Afficher Token FCM', color: '#FF6B35' }, // ← AJOUTER
  { id: 'privacy', icon: 'shield-checkmark-outline', label: 'Confidentialité', color: '#FF6B35' },
  { id: 'help', icon: 'help-circle-outline', label: 'Aide & Support', color: '#6B7280' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // ✅ Fonction pour récupérer le token FCM
  const getFcmToken = async () => {
    try {
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      console.log('📱 Token FCM complet:', deviceToken);
      console.log('📱 Token data:', deviceToken.data);
      Alert.alert(
        '🔑 Token FCM',
        `Token: ${deviceToken.data}\n\nType: ${deviceToken.type}`,
        [
          { text: 'Copier', onPress: () => console.log('Token:', deviceToken.data) },
          { text: 'OK' }
        ]
      );
      return deviceToken.data;
    } catch (error) {
      console.error('❌ Erreur récupération token:', error);
      Alert.alert('Erreur', error.message);
      return null;
    }
  };

  const loadUserProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Chargement profil pour userId:', user.id);
      const userProfile = await userService.getUserProfile(user.id);
      console.log('✅ Profil chargé:', userProfile);
      setProfile(userProfile || user);
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      setProfile(user);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleUpdateProfile = async (updateData) => {
    setUpdateError(null);
    console.log('📤 Envoi mise à jour des données:', updateData);
    console.log('👤 ID utilisateur:', user?.id);
    
    try {
      const updatedUser = await userService.updateUserProfile(user.id, updateData);
      console.log('📥 Réponse mise à jour reçue:', updatedUser);
      
      if (updatedUser) {
        setProfile(updatedUser);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "✅ Profil mis à jour",
            body: "Vos informations ont été modifiées avec succès !",
            sound: "default",
          },
          trigger: null,
        });
        
        Alert.alert('Succès', 'Profil mis à jour avec succès');
        return true;
      } else {
        const errorMsg = 'La mise à jour a échoué (réponse vide)';
        setUpdateError(errorMsg);
        Alert.alert('Erreur', errorMsg);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      const errorMsg = error.message || 'Une erreur est survenue lors de la mise à jour';
      setUpdateError(errorMsg);
      Alert.alert('Erreur', errorMsg);
      return false;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            console.log('🔓 Bouton déconnexion cliqué');
            
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "👋 À bientôt !",
                body: "Vous avez été déconnecté. Revenez vite sur SportTracker !",
                sound: "default",
              },
              trigger: null,
            });
            
            await logout();
          },
        },
      ]
    );
  };

  const handleMenuItemPress = async (itemId) => {
    switch (itemId) {
      case 'edit':
        setModalVisible(true);
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Fonctionnalité à venir');
        break;
      case 'goals':
        Alert.alert('Objectifs', 'Fonctionnalité à venir');
        break;
      case 'nutrition':
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${API_URL}/users/nutrition-advice`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            Alert.alert('Conseil nutrition', 'Un conseil personnalisé vous sera envoyé sous peu');
          } else {
            Alert.alert('Erreur', 'Impossible d\'envoyer la demande de conseil');
          }
        } catch (error) {
          console.error('Erreur nutrition advice:', error);
          Alert.alert('Erreur', 'Une erreur est survenue');
        }
        break;
      case 'fcm_token':
        await getFcmToken();
        break;
      case 'privacy':
        Alert.alert('Confidentialité', 'Fonctionnalité à venir');
        break;
      case 'help':
        Alert.alert('Aide & Support', 'Fonctionnalité à venir');
        break;
      default:
        break;
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 10 }}>Chargement du profil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        <View style={styles.avatarSection}>
          <LinearGradient colors={['#00E5FF', '#0080FF']} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.name}>{profile?.name || 'Athlète'}</Text>
          <Text style={styles.email}>{profile?.email || ''}</Text>
          {profile?.sport && (
            <View style={styles.sportBadge}>
              <Ionicons name="fitness" size={14} color={COLORS.primary} />
              <Text style={styles.sportBadgeText}>{profile.sport}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="fitness-outline" size={18} color={COLORS.muted} />
            <Text style={styles.infoLabel}>Niveau:</Text>
            <Text style={styles.infoValue}>{profile?.activityLevel || 'Non renseigné'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="male-female-outline" size={18} color={COLORS.muted} />
            <Text style={styles.infoLabel}>Genre:</Text>
            <Text style={styles.infoValue}>{profile?.gender || 'Non renseigné'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="fitness-outline" size={18} color={COLORS.muted} />
            <Text style={styles.infoLabel}>Âge:</Text>
            <Text style={styles.infoValue}>{profile?.age || 'Non renseigné'} ans</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="barbell-outline" size={18} color={COLORS.muted} />
            <Text style={styles.infoLabel}>Poids:</Text>
            <Text style={styles.infoValue}>{profile?.weight || 'Non renseigné'} kg</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={18} color={COLORS.muted} />
            <Text style={styles.infoLabel}>Taille:</Text>
            <Text style={styles.infoValue}>{profile?.height || 'Non renseigné'} cm</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SportTracker v1.0.0</Text>
      </ScrollView>

      <EditProfileModal
        visible={modalVisible}
        user={profile}
        onClose={() => setModalVisible(false)}
        onSave={handleUpdateProfile}
      />
    </SafeAreaView>
  );
}