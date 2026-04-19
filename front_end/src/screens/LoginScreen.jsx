import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications'; // ← AJOUTER
import useAuth from '../hooks/useAuth';
import { styles } from '../styles/LoginScreen.styles';
import { COLORS } from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerForPushNotificationsAsync, sendTokenToBackend } from '../services/notificationService'; // ← AJOUTER

export default function LoginScreen({ navigation, route }) {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Drawer');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (route.params?.message) {
      setSuccessMessage(route.params.message);
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [route.params?.message]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      
      // ✅ Notification de bienvenue après connexion
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await sendTokenToBackend(token);
      }
      
      // Afficher une notification locale
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "👋 Bienvenue !",
          body: `Bonjour, content de vous revoir sur SportTracker !`,
          sound: "default",
        },
        trigger: null, // immédiat
      });
      
    } catch (e) {
      setError(e.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.bgDecor1} />
        <View style={styles.bgDecor2} />

        <View style={styles.logoSection}>
          <LinearGradient colors={['#00E5FF', '#0080FF']} style={styles.logoCircle}>
            <Ionicons name="fitness" size={40} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>SportTracker</Text>
          <Text style={styles.tagline}>Suivez chaque performance</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Connexion</Text>

          {successMessage ? (
            <View style={[styles.errorBox, { backgroundColor: '#2ECC7120', borderColor: '#2ECC71' }]}>
              <Ionicons name="checkmark-circle" size={16} color="#2ECC71" />
              <Text style={[styles.errorText, { color: '#2ECC71' }]}>{successMessage}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.accent} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={COLORS.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor={COLORS.primary}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              selectionColor={COLORS.primary}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={['#00E5FF', '#0080FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Se connecter</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerBtnText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}