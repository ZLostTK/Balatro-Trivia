import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import JokerSprite from '@/src/components/JokerSprite';

interface RankingItemProps {
  index: number;
  entry: {
    nombre: string;
    puntaje: number;
    fecha: string;
  };
}

const topSkins = [98, 97, 96, 95, 94];

const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function RankingItem({ index, entry }: RankingItemProps) {
  const getGradientColors = (): readonly [string, string] => {
    if (index === 0) return ['#fbbf24', '#f59e0b'];
    if (index === 1) return ['#d1d5db', '#9ca3af'];
    if (index === 2) return ['#f97316', '#ea580c'];
    return ['#7c3aed', '#6d28d9'];
  };

  return (
    <View style={styles.rankingItem}>
      <LinearGradient colors={getGradientColors()} style={styles.rankingGradient}>
        <View style={styles.rankingContent}>
          <View style={styles.positionContainer}>
            <Text style={styles.positionText}>#{index + 1}</Text>
          </View>
          <View style={styles.playerInfo}>
            <View style={styles.playerNameContainer}>
              {index < topSkins.length && (
                <View style={styles.spriteWrapper}>
                  <JokerSprite 
                    row={Math.floor((topSkins[index] - 1) / 10)} 
                    col={(topSkins[index] - 1) % 10} 
                    transparent
                  />
                </View>
              )}
              <Text style={styles.playerName}>{entry.nombre}</Text>
            </View>
            <Text style={styles.playerDate}>
              {formatearFecha(entry.fecha)}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{entry.puntaje}</Text>
            <Text style={styles.scoreLabel}>pts</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  rankingItem: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#222',
    overflow: 'hidden',
  },
  rankingGradient: {
    padding: 16,
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionContainer: {
    width: 50,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 24,
    fontFamily: 'Balatro',
    color: '#fff',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  spriteWrapper: {
    transform: [{ scale: 0.7 }],
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'Balatro',
    color: '#fff',
  },
  playerDate: {
    fontSize: 12,
    fontFamily: 'Balatro',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 28,
    fontFamily: 'Balatro',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Balatro',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
