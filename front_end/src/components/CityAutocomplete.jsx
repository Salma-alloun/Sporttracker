// src/components/CityAutocomplete.jsx
// Composant UI d'autocomplétion

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCitySearch } from '../hooks/useCitySearch';
import { COLORS } from '../styles/colors';

export const CityAutocomplete = ({ 
  onSelectCity, 
  placeholder = "Rechercher une ville...", 
  initialValue = "" 
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const { results, loading, search, clearSearch } = useCitySearch();

  const handleTextChange = (text) => {
    setInputValue(text);
    search(text);
  };

  const handleSelectCity = (city) => {
    setInputValue(city.name);
    clearSearch();
    onSelectCity?.(city);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.muted} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          value={inputValue}
          onChangeText={handleTextChange}
          selectionColor={COLORS.primary}
        />
        {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
        {inputValue.length > 0 && !loading && (
          <TouchableOpacity onPress={() => { setInputValue(''); clearSearch(); }}>
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectCity(item)}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultFullName} numberOfLines={1}>
                  {item.fullName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  resultsList: {
    maxHeight: 250,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultTextContainer: { flex: 1 },
  resultName: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
  resultFullName: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
});