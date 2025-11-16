import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const TEXT_WHITE = '#FFFFFF';
const TEXT_GRAY = '#999';
const CARD_BACKGROUND = '#222';
const PLACEHOLDER_BACKGROUND = '#333';
const PLACEHOLDER_TEXT = '#777';

// URL Base para Pôsteres
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieItem = ({ movie }) => {
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'Ano Desconhecido';

  // Renderização
  return (
    <View style={styles.container}>
      {movie.poster_path ? (
        <Image
          style={styles.poster}
          source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
        />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderText}>Sem Imagem</Text>
        </View>
      )}

      {/* Informações (Título e Ano) */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{year}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  posterPlaceholder: {
    width: 100,
    height: 150,
    backgroundColor: PLACEHOLDER_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: PLACEHOLDER_TEXT,
    fontSize: 12,
  },
  textContainer: {
    flex: 1, 
    padding: 10, 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
});

export default MovieItem;