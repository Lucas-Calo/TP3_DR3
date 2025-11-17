import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieItem from './MovieItem';

//  Configuração da API e Tema:
const API_KEY = 'fc65584349fcc4f6dd8b6bacbdce6b83';
const API_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

const COLOUR_BACKGROUND = '#141414';
const COLOUR_RED = '#E50914';
const TEXT_WHITE = '#FFFFFF';
const TEXT_GRAY = '#999';
const INPUT_BACKGROUND = '#333';

// Componente Principal:
const App = () => {
  // --- Estados ---
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para a Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Estados para Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);


  // Estado para Tratamento de Erros:
  const [error, setError] = useState(null);

  // Funções:

  const fetchMovies = async () => {
    setLoading(true);
    setError(null); 
    let url = '';

    try {
      if (debouncedQuery) {
        url = `${API_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${debouncedQuery}&page=1`;
      } else {
        url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha na resposta da rede.');
      }

      const data = await response.json();

      if (data && data.results) {
        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
        setPage(1);
      }
    } catch (err) {
      console.error('Erro ao buscar filmes:', err);
      setError('Ops! Algo deu errado ao carregar os filmes. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || page >= totalPages) {
      return;
    }

    setLoadingMore(true);
    const nextPage = page + 1;
    let url = '';

    try {
      if (debouncedQuery) {
        url = `${API_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${debouncedQuery}&page=${nextPage}`;
      } else {
        url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=${nextPage}`;
      }
      
      const response = await fetch(url);
       if (!response.ok) {
        throw new Error('Falha na resposta da rede ao carregar mais.');
      }
      

      const data = await response.json();

      if (data && data.results) {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
        setPage(nextPage); 
      }
    } catch (err) {
      console.error('Erro ao carregar mais filmes:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  //Ciclo de Vida:

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // useEffect Principal:
  // Quando a busca (debouncedQuery) muda, ele chama o fetchMovies,
  // que por sua vez reinicia a lista e a contagem de páginas.
  useEffect(() => {
    fetchMovies();
  }, [debouncedQuery]);

  //Renderização:

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={COLOUR_RED} />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={COLOUR_RED} />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </SafeAreaView>
    );
  }

   if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMovies}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {debouncedQuery ? `Buscando por: "${debouncedQuery}"` : 'Populares'}
        </Text>
      </View>

      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes..."
          placeholderTextColor={TEXT_GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de Filmes (com novas props) */}
      <FlatList
        data={movies} 
        keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
        renderItem={({ item }) => <MovieItem movie={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum filme encontrado.</Text>
          </View>
        }
        // Props de Paginação:
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

//StyleSheet:
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
    paddingTop: 10,
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
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: TEXT_GRAY,
    fontSize: 16,
  },
  footerLoading: {
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLOUR_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: TEXT_GRAY,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLOUR_RED,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: TEXT_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;