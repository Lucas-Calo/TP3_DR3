import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieItem from './MovieItem';

// --- Configuração da API e Tema ---
const API_KEY = 'fc65584349fcc4f6dd8b6bacbdce6b83';
const API_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

const COLOUR_BACKGROUND = '#141414';
const COLOUR_RED = '#E50914';
const TEXT_WHITE = '#FFFFFF';
const TEXT_GRAY = '#999';
const INPUT_BACKGROUND = '333';

// --- Componente Principal ---
const App = () => {
  //  Estados:
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Estados para a busca:
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  //  Funções:
  const fetchMovies = async () => {
    setLoading(true);
    let url = '';

    try {
      if (debouncedQuery) {
        // Se temos uma busca, usamos o endpoint de /search/movie
        url = `${API_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${debouncedQuery}&page=1`;
      } else {
        // Se não, continuamos nos /movie/popular
        url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.results) {
        setMovies(data.results);
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };


  // Ciclo de vida:
useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchMovies();
  }, [debouncedQuery]);

  //  Renderização:

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={COLOUR_RED} />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </SafeAreaView>
    );
  }

  // Se (else) não estiver carregando, mostramos a lista de filmes
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Título do App */}
         <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {debouncedQuery ? `Buscando por: "${debouncedQuery}"` : 'Populares'}
        </Text>
      </View>


        {/* Container da Barra de Busca */}
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes..."
          placeholderTextColor={TEXT_GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>


      {/* Lista de Filmes */}
    <FlatList
        data={movies} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieItem movie={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum filme encontrado.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// StyleSheet:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOUR_BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLOUR_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: TEXT_GRAY,
  },
  header: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    textAlign: 'center',
  },
    searchInputContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: INPUT_BACKGROUND,
    color: TEXT_WHITE,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
 listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
   emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: TEXT_GRAY,
    fontSize: 16,
  },
});

export default App;