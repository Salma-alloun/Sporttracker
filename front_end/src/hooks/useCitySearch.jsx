// src/hooks/useCitySearch.js
// Hook React pour la recherche de villes

import { useState, useCallback, useRef } from 'react';
import { searchMoroccoCities } from '../services/geocodingService';

export const useCitySearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const search = useCallback(async (searchQuery) => {
    setQuery(searchQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMoroccoCities(searchQuery);
        setResults(data);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    search,
    clearSearch,
  };
};