import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Platform, Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import { styles } from '../styles/RegisterScreen.styles';
import { COLORS } from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const SPORTS = ['Course', 'Vélo', 'Natation', 'Football', 'Basketball', 'Randonnée', 'Gym', 'Tennis'];
const GENDERS = ['Homme', 'Femme', 'Autre'];
const ACTIVITY_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
const GOALS_OPTIONS = ['Perdre du poids', 'Gagner en muscle', 'Améliorer endurance', 'Préparation marathon', 'Santé générale', 'Autre'];
const MEDICAL_CONDITIONS_OPTIONS = ['Asthme', 'Problèmes cardiaques', 'Diabète', 'Allergies', 'Arthrite', 'Aucune', 'Autre'];
const NOTIFICATION_PREFERENCES = [
  { id: 'email', label: 'Email', icon: 'mail-outline' },
  { id: 'push', label: 'Push', icon: 'notifications-outline' },
  { id: 'sms', label: 'SMS', icon: 'chatbubble-outline' },
];
const UNITS = ['metric', 'imperial'];

// Fonction pour calculer l'âge à partir de la date de naissance
const calculateAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Fonction pour valider et parser une date au format JJ/MM/AAAA
const parseDateString = (dateString) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    
    const date = new Date(year, month, day);
    
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day && date <= new Date()) {
      return date;
    }
  }
  return null;
};

// Fonction pour formater la date en JJ/MM/AAAA
const formatDateToString = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Composant RadioButton réutilisable
const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity 
    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}
    onPress={onPress}
  >
    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.primary, marginRight: 8, alignItems: 'center', justifyContent: 'center' }}>
      {selected && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary }} />}
    </View>
    <Text style={{ color: COLORS.text }}>{label}</Text>
  </TouchableOpacity>
);

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    sport: '', weight: '', height: '', gender: '', activityLevel: '',
    goals: '', medicalConditions: '',
    favoriteSports: [],
    preferences: {
      notifications: { email: true, push: true, sms: false },
      privacy: { shareActivities: true, shareProfile: false },
      units: 'metric'
    },
  });
  
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthDateText, setBirthDateText] = useState(formatDateToString(new Date()));
  const [age, setAge] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [customMedicalCondition, setCustomMedicalCondition] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [showCustomMedical, setShowCustomMedical] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const updateNotificationPref = (key, value) => {
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, notifications: { ...prev.preferences.notifications, [key]: value } }
    }));
  };

  const updatePrivacyPref = (key, value) => {
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, privacy: { ...prev.preferences.privacy, [key]: value } }
    }));
  };

  const updateUnits = (value) => {
    setForm(prev => ({ ...prev, preferences: { ...prev.preferences, units: value } }));
  };

  const toggleFavoriteSport = (sport) => {
    setForm(prev => {
      const currentFavorites = [...prev.favoriteSports];
      if (currentFavorites.includes(sport)) {
        return { ...prev, favoriteSports: currentFavorites.filter(s => s !== sport) };
      } else {
        return { ...prev, favoriteSports: [...currentFavorites, sport] };
      }
    });
  };

  // Gestion de la saisie manuelle de la date
  const handleBirthDateTextChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 2) {
        formatted += '/' + cleaned.substring(2, 4);
      }
      if (cleaned.length >= 4) {
        formatted += '/' + cleaned.substring(4, 8);
      }
    }
    
    setBirthDateText(formatted);
    
    if (formatted.length === 10) {
      const parsedDate = parseDateString(formatted);
      if (parsedDate) {
        setBirthDate(parsedDate);
        const calculatedAge = calculateAge(parsedDate);
        setAge(calculatedAge.toString());
      } else {
        setAge('');
      }
    }
  };

  // Gestion du picker de date
  const handleDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      setBirthDateText(formatDateToString(selectedDate));
      const calculatedAge = calculateAge(selectedDate);
      setAge(calculatedAge.toString());
    }
  };

  const handleGoalSelect = (value) => {
    if (value === 'Autre') {
      setShowCustomGoal(true);
      setForm(prev => ({ ...prev, goals: '' }));
    } else {
      setShowCustomGoal(false);
      setCustomGoal('');
      setForm(prev => ({ ...prev, goals: value }));
    }
  };

  const handleMedicalSelect = (value) => {
    if (value === 'Autre') {
      setShowCustomMedical(true);
      setForm(prev => ({ ...prev, medicalConditions: '' }));
    } else if (value === 'Aucune') {
      setShowCustomMedical(false);
      setCustomMedicalCondition('');
      setForm(prev => ({ ...prev, medicalConditions: 'Aucune' }));
    } else {
      setShowCustomMedical(false);
      setCustomMedicalCondition('');
      setForm(prev => ({ ...prev, medicalConditions: value }));
    }
  };

  const validateStep1 = () => {
    if (!form.name || !form.email) {
      setError('Remplissez tous les champs obligatoires');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(form.password);
    const hasLowerCase = /[a-z]/.test(form.password);
    const hasNumber = /[0-9]/.test(form.password);
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format d'email invalide");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.sport) {
      setError('Choisissez un sport principal');
      return false;
    }
    if (!form.gender) {
      setError('Sélectionnez votre genre');
      return false;
    }
    if (!form.activityLevel) {
      setError('Sélectionnez votre niveau d\'activité');
      return false;
    }
    if (!age || parseInt(age) < 10 || parseInt(age) > 120) {
      setError('Âge invalide (doit être entre 10 et 120)');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setError('');
    try {
      const finalGoals = showCustomGoal ? customGoal : form.goals;
      const finalMedical = showCustomMedical ? customMedicalCondition : form.medicalConditions;
      
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        sport: form.sport,
        gender: form.gender,
        activityLevel: form.activityLevel,
        age: parseInt(age),
        birthDate: birthDate.toISOString(),  // ← Envoi en string ISO
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseInt(form.height) : null,
        favoriteSports: form.favoriteSports,
        goals: finalGoals,
        medicalConditions: finalMedical === 'Aucune' ? null : finalMedical,
        preferences: {
          notifications: { email: true, push: true, sms: false },
          privacy: { shareActivities: true, shareProfile: false },
          units: 'metric',
        },
      };
      
      console.log('📦 Données envoyées:', userData);
      
      const success = await register(userData);
      if (success) {
        navigation.navigate('Login', { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
      }
    } catch (e) {
      console.log('❌ Erreur:', e);
      setError(e.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer un compte</Text>
          <Text style={styles.stepIndicator}>{step}/4</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.accent} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ÉTAPE 1 - Informations de connexion */}
          {step === 1 && (
            <>
              <Text style={styles.stepTitle}>Informations de connexion</Text>
              <Text style={styles.stepSubtitle}>Créez vos identifiants</Text>
              <Field icon="person-outline" placeholder="Nom complet *" value={form.name} onChangeText={v => updateForm('name', v)} />
              <Field icon="mail-outline" placeholder="Email *" value={form.email} onChangeText={v => updateForm('email', v)} keyboardType="email-address" autoCapitalize="none" />
              <Field icon="lock-closed-outline" placeholder="Mot de passe *" value={form.password} onChangeText={v => updateForm('password', v)} secureTextEntry />
              <Field icon="lock-closed-outline" placeholder="Confirmer le mot de passe *" value={form.confirmPassword} onChangeText={v => updateForm('confirmPassword', v)} secureTextEntry />
              <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
                <LinearGradient colors={[COLORS.primary, '#0080FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.btnText}>Suivant</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* ÉTAPE 2 - Profil sportif */}
          {step === 2 && (
            <>
              <Text style={styles.stepTitle}>Profil sportif</Text>
              <Text style={styles.stepSubtitle}>Pour personnaliser votre expérience</Text>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Sport principal *</Text>
                <View style={styles.sportsGrid}>
                  {SPORTS.map(sport => (
                    <TouchableOpacity key={sport} style={[styles.sportChip, form.sport === sport && styles.sportChipActive]} onPress={() => updateForm('sport', sport)}>
                      <Text style={[styles.sportChipText, form.sport === sport && styles.sportChipTextActive]}>{sport}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Genre *</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {GENDERS.map(gender => (
                    <RadioButton
                      key={gender}
                      selected={form.gender === gender}
                      onPress={() => updateForm('gender', gender)}
                      label={gender}
                    />
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Niveau *</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {ACTIVITY_LEVELS.map(level => (
                    <RadioButton
                      key={level}
                      selected={form.activityLevel === level}
                      onPress={() => updateForm('activityLevel', level)}
                      label={level}
                    />
                  ))}
                </View>
              </View>

              {/* Date de naissance - Saisie manuelle + calendrier */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Field 
                  icon="calendar-outline" 
                  placeholder="JJ/MM/AAAA" 
                  value={birthDateText}
                  onChangeText={handleBirthDateTextChange}
                  keyboardType="numeric"
                  containerStyle={{ flex: 3 }}
                />
                <TouchableOpacity 
                  style={[styles.inputWrapper, { flex: 1, justifyContent: 'center' }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDatePickerChange}
                  maximumDate={new Date()}
                />
              )}

              {/* Affichage de l'âge calculé */}
              {age ? (
                <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBg, marginTop: 10 }]}>
                  <Ionicons name="fitness-outline" size={20} color={COLORS.green} style={styles.inputIcon} />
                  <Text style={[styles.input, { color: COLORS.green }]}>
                    Âge calculé : {age} ans
                  </Text>
                </View>
              ) : null}
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Field icon="barbell-outline" placeholder="Poids (kg)" value={form.weight} onChangeText={v => updateForm('weight', v)} keyboardType="numeric" containerStyle={{ flex: 1 }} />
                <Field icon="resize-outline" placeholder="Taille (cm)" value={form.height} onChangeText={v => updateForm('height', v)} keyboardType="numeric" containerStyle={{ flex: 1 }} />
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity onPress={() => setStep(1)} style={[styles.btn, { backgroundColor: COLORS.border, flex: 1 }]}>
                  <Text style={[styles.btnText, { color: COLORS.text }]}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(3)} activeOpacity={0.85} style={{ flex: 1 }}>
                  <LinearGradient colors={[COLORS.primary, '#0080FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>Suivant</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ÉTAPE 3 - Sports favoris, Objectifs, Conditions médicales */}
          {step === 3 && (
            <>
              <Text style={styles.stepTitle}>Sports favoris</Text>
              <Text style={styles.stepSubtitle}>Sélectionnez vos sports préférés (optionnel)</Text>
              <View style={styles.sportsGrid}>
                {SPORTS.map(sport => (
                  <TouchableOpacity key={sport} style={[styles.sportChip, form.favoriteSports.includes(sport) && styles.sportChipActive]} onPress={() => toggleFavoriteSport(sport)}>
                    <Text style={[styles.sportChipText, form.favoriteSports.includes(sport) && styles.sportChipTextActive]}>{sport}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={styles.stepTitle}>Objectifs sportifs</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                  {GOALS_OPTIONS.map(goal => (
                    <RadioButton
                      key={goal}
                      selected={!showCustomGoal && form.goals === goal}
                      onPress={() => handleGoalSelect(goal)}
                      label={goal}
                    />
                  ))}
                </View>
                {showCustomGoal && (
                  <Field 
                    icon="create-outline" 
                    placeholder="Précisez votre objectif" 
                    value={customGoal} 
                    onChangeText={setCustomGoal} 
                  />
                )}
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={styles.stepTitle}>Conditions médicales</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                  {MEDICAL_CONDITIONS_OPTIONS.map(condition => (
                    <RadioButton
                      key={condition}
                      selected={!showCustomMedical && form.medicalConditions === condition}
                      onPress={() => handleMedicalSelect(condition)}
                      label={condition}
                    />
                  ))}
                </View>
                {showCustomMedical && (
                  <Field 
                    icon="medkit-outline" 
                    placeholder="Précisez votre condition" 
                    value={customMedicalCondition} 
                    onChangeText={setCustomMedicalCondition} 
                  />
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <TouchableOpacity onPress={() => setStep(2)} style={[styles.btn, { backgroundColor: COLORS.border, flex: 1 }]}>
                  <Text style={[styles.btnText, { color: COLORS.text }]}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(4)} activeOpacity={0.85} style={{ flex: 1 }}>
                  <LinearGradient colors={[COLORS.primary, '#0080FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>Suivant</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ÉTAPE 4 - Préférences */}
          {step === 4 && (
            <>
              <Text style={styles.stepTitle}>Préférences</Text>
              <Text style={styles.stepSubtitle}>Personnalisez votre expérience</Text>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Notifications</Text>
                {NOTIFICATION_PREFERENCES.map(pref => (
                  <View key={pref.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name={pref.icon} size={20} color={COLORS.primary} />
                      <Text style={{ color: COLORS.text }}>{pref.label}</Text>
                    </View>
                    <Switch value={form.preferences.notifications[pref.id]} onValueChange={(value) => updateNotificationPref(pref.id, value)} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={form.preferences.notifications[pref.id] ? '#fff' : COLORS.muted} />
                  </View>
                ))}
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Confidentialité</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
                    <Text style={{ color: COLORS.text }}>Partager mes activités</Text>
                  </View>
                  <Switch value={form.preferences.privacy.shareActivities} onValueChange={(value) => updatePrivacyPref('shareActivities', value)} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={form.preferences.privacy.shareActivities ? '#fff' : COLORS.muted} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                    <Text style={{ color: COLORS.text }}>Partager mon profil</Text>
                  </View>
                  <Switch value={form.preferences.privacy.shareProfile} onValueChange={(value) => updatePrivacyPref('shareProfile', value)} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={form.preferences.privacy.shareProfile ? '#fff' : COLORS.muted} />
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.stepSubtitle, { marginBottom: 10 }]}>Unités de mesure</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {UNITS.map(unit => (
                    <TouchableOpacity key={unit} style={[styles.sportChip, { flex: 1 }, form.preferences.units === unit && styles.sportChipActive]} onPress={() => updateUnits(unit)}>
                      <Text style={[styles.sportChipText, form.preferences.units === unit && styles.sportChipTextActive]}>{unit === 'metric' ? 'Métrique (km, kg)' : 'Impérial (mi, lb)'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <TouchableOpacity onPress={() => setStep(3)} style={[styles.btn, { backgroundColor: COLORS.border, flex: 1 }]}>
                  <Text style={[styles.btnText, { color: COLORS.text }]}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.85} style={{ flex: 1 }}>
                  <LinearGradient colors={[COLORS.primary, '#0080FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    {loading ? <ActivityIndicator color="#fff" /> : <><Text style={styles.btnText}>Créer mon compte</Text><Ionicons name="checkmark" size={18} color="#fff" /></>}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Déjà un compte ? <Text style={{ color: COLORS.primary }}>Se connecter</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ icon, containerStyle, ...props }) {
  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Ionicons name={icon} size={20} color={COLORS.muted} style={styles.inputIcon} />
      <TextInput style={styles.input} placeholderTextColor={COLORS.muted} selectionColor={COLORS.primary} {...props} />
    </View>
  );
}