// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';

const SPORTS = ['Course', 'Vélo', 'Natation', 'Football', 'Basketball', 'Randonnée', 'Gym', 'Tennis'];
const GENDERS = ['Homme', 'Femme', 'Autre'];
const ACTIVITY_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

export const EditProfileModal = ({ visible, user, onClose, onSave }) => {
  // ✅ Initialisation du formulaire avec les valeurs actuelles de l'utilisateur
  const [form, setForm] = useState({
    name: '',
    sport: '',
    gender: '',
    activityLevel: '',
    age: '',
    weight: '',
    height: '',
    goals: '',
    medicalConditions: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Mettre à jour le formulaire quand l'utilisateur change (modal s'ouvre)
  useEffect(() => {
    if (visible && user) {
      setForm({
        name: user.name || '',
        sport: user.sport || '',
        gender: user.gender || '',
        activityLevel: user.activityLevel || '',
        age: user.age ? String(user.age) : '',
        weight: user.weight ? String(user.weight) : '',
        height: user.height ? String(user.height) : '',
        goals: user.goals || '',
        medicalConditions: user.medicalConditions || '',
      });
      setError('');
    }
  }, [visible, user]);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name) {
      setError('Le nom est requis');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const updateData = {
      name: form.name,
      sport: form.sport,
      gender: form.gender,
      activityLevel: form.activityLevel,
      age: form.age ? parseInt(form.age) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      height: form.height ? parseInt(form.height) : null,
      goals: form.goals,
      medicalConditions: form.medicalConditions,
    };
    
    const result = await onSave(updateData);
    setLoading(false);
    
    if (result) {
      onClose();
    }
  };

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

  const Field = ({ icon, placeholder, value, onChangeText, keyboardType, containerStyle }) => (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Ionicons name={icon} size={20} color={COLORS.muted} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        selectionColor={COLORS.primary}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            {/* Nom complet */}
            <Field 
              icon="person-outline" 
              placeholder="Nom complet" 
              value={form.name} 
              onChangeText={v => updateForm('name', v)} 
            />
            
            {/* Sport principal */}
            <Text style={styles.label}>Sport principal</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
              {SPORTS.map(sport => (
                <TouchableOpacity
                  key={sport}
                  style={[styles.optionChip, form.sport === sport && styles.optionChipActive]}
                  onPress={() => updateForm('sport', sport)}
                >
                  <Text style={[styles.optionChipText, form.sport === sport && styles.optionChipTextActive]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Genre */}
            <Text style={styles.label}>Genre</Text>
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
            
            {/* Niveau d'activité */}
            <Text style={styles.label}>Niveau d'activité</Text>
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
            
            {/* Âge, Poids, Taille */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field 
                icon="fitness-outline" 
                placeholder="Âge" 
                value={form.age} 
                onChangeText={v => updateForm('age', v)} 
                keyboardType="numeric" 
                containerStyle={{ flex: 1 }}
              />
              <Field 
                icon="barbell-outline" 
                placeholder="Poids (kg)" 
                value={form.weight} 
                onChangeText={v => updateForm('weight', v)} 
                keyboardType="numeric" 
                containerStyle={{ flex: 1 }}
              />
              <Field 
                icon="resize-outline" 
                placeholder="Taille (cm)" 
                value={form.height} 
                onChangeText={v => updateForm('height', v)} 
                keyboardType="numeric" 
                containerStyle={{ flex: 1 }}
              />
            </View>
            
            {/* Objectifs sportifs */}
            <Field 
              icon="flag-outline" 
              placeholder="Objectifs sportifs" 
              value={form.goals} 
              onChangeText={v => updateForm('goals', v)} 
            />
            
            {/* Conditions médicales */}
            <Field 
              icon="medkit-outline" 
              placeholder="Conditions médicales" 
              value={form.medicalConditions} 
              onChangeText={v => updateForm('medicalConditions', v)} 
            />
            
            {/* Bouton de sauvegarde */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  optionsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 10,
  },
  optionChipActive: {
    backgroundColor: COLORS.primary,
  },
  optionChipText: {
    color: COLORS.muted,
  },
  optionChipTextActive: {
    color: '#fff',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF3D6B20',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});