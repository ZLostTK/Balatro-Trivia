import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyRankingMessage() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Aún no hay jugadores en el ranking.
      </Text>
      <Text style={styles.emptySubtext}>
        ¡Sé el primero en completar la trivia!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: 'Balatro',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#d946ef',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Balatro',
  },
});
