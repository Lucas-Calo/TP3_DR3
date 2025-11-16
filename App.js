import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Configuração da API e Tema ---
const API_KEY = 'fc65584349fcc4f6dd8b6bacbdce6b83';

const API_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

const COLOUR_BACKGROUND = '#141414';
const COLOUR_RED = '#E50914';
const TEXT_WHITE = '#FFFFFF';
const TEXT_GRAY = '#999';

// --- Componente Principal ---
const App = () => {
  // --- Estados ---
  // useState para guardar a lista de filmes
  const [movies, setMovies] = useState([]);
  // useState para controlar o indicador de "carregando"
  const [loading, setLoading] = useState(true);

  // --- Funções ---
  // Função que busca os dados na API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Montando a URL: filmes populares, com nossa chave, em português
      const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;
      
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

  useEffect(() => {
    fetchMovies();
  }, []);

  // --- Renderização ---

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={COLOUR_RED} />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    );
  }

  // Se (else) não estiver carregando, mostramos a lista de filmes
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Título do App */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Populares</Text>
      </View>

      {/* Lista de Filmes */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        )}
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    textAlign: 'center',
  },
  movieItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  movieTitle: {
    fontSize: 18,
    color: TEXT_WHITE,
  },
});

export default App;