import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTriviaStore } from '@/src/store/triviaStore';
import BalatroScreen from '@/src/components/ui/BalatroScreen';
import BalatroButton from '@/src/components/ui/BalatroButton';
import RankingItem from '@/src/components/ranking/RankingItem';
import EmptyRankingMessage from '@/src/components/ranking/EmptyRankingMessage';

interface RankingScreenProps {
  onBackToHome: () => void;
  onRestartTrivia: () => void;
}

export default function RankingScreen({
  onBackToHome,
  onRestartTrivia,
}: RankingScreenProps) {
  const ranking = useTriviaStore((state) => state.ranking);

  return (
    <BalatroScreen overlayOpacity={0.6}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Tabla de Clasificación</Text>

        {ranking.length === 0 ? (
          <EmptyRankingMessage />
        ) : (
          <View style={styles.rankingContainer}>
            {ranking.map((entry, index) => (
              <RankingItem key={index} index={index} entry={entry} />
            ))}
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <BalatroButton 
            title="Reiniciar Trivia" 
            colors={['#3b82f6', '#1d4ed8']} 
            onPress={onRestartTrivia} 
          />
          <BalatroButton 
            title="Volver al Inicio" 
            colors={['#ef4444', '#dc2626']} 
            onPress={onBackToHome} 
          />
        </View>
      </ScrollView>
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Balatro',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#d946ef',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  rankingContainer: {
    gap: 12,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    paddingBottom: 20,
  },
});
