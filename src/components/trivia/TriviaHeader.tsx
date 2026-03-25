import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { SharedValue, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Dificultad } from '@/src/types';
import { DIFICULTAD_CONFIG, calcularPuntosBase, calcularMultiplicador } from '@/src/store/gameHelpers';

// ─── Subcomponente: vida individual (Jimbo) ───────────────────

interface JimboLifeProps {
  shake: SharedValue<number>;
  isLost: boolean;
}

function JimboLife({ shake, isLost }: JimboLifeProps) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.sin(shake.value * Math.PI * 12) * 12 },
      { translateY: Math.sin(shake.value * Math.PI * 14) * 12 },
    ],
  }));

  return (
    <Animated.View style={[styles.jimboWrapper, animStyle]}>
      <Image
        source={require('@/assets/images/trivia/jimbo.png')}
        style={[styles.jimboIcon, isLost && styles.jimboLost]}
      />
    </Animated.View>
  );
}

// ─── Subcomponente: pill de estadística ───────────────────────

interface StatPillProps {
  label: string;
  value: string;
  valueStyle?: object;
}

function StatPill({ label, value, valueStyle }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillLabel}>{label}</Text>
      <Text style={[styles.statPillValue, valueStyle]}>{value}</Text>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────

interface TriviaHeaderProps {
  vidas: number;
  preguntaActual: number;
  totalPreguntas: number;
  racha: number;
  puntaje: number;
  dificultad: Dificultad;
}

export default function TriviaHeader({ vidas, preguntaActual, totalPreguntas, racha, puntaje, dificultad }: TriviaHeaderProps) {
  const [visualVidas, setVisualVidas] = useState(vidas);
  const prevVidas = useRef(vidas);

  const shakes = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  useEffect(() => {
    if (vidas < prevVidas.current && vidas >= 0) {
      const shake = shakes[vidas];
      if (shake) {
        shake.value = 0;
        shake.value = withTiming(1, { duration: 600 });
      }
      setTimeout(() => setVisualVidas(vidas), 600);
    } else {
      setVisualVidas(vidas);
    }
    prevVidas.current = vidas;
  }, [vidas]);

  const config = DIFICULTAD_CONFIG[dificultad];
  const multiplicador = calcularMultiplicador(racha);
  const basePuntos = calcularPuntosBase(dificultad);

  return (
    <View style={styles.header}>
      {/* Columna Izquierda: Vidas, Dificultad, Pregunta */}
      <View style={styles.sideColumn}>
        <View style={styles.livesContainer}>
          {shakes.map((shake, i) => (
            <JimboLife key={i} shake={shake} isLost={visualVidas <= i} />
          ))}
        </View>

        <View style={styles.pillsRow}>
          <View style={[styles.diffBadge, { backgroundColor: config.color + '33', borderColor: config.color }]}>
            <Text style={[styles.diffText, { color: config.color }]}>{config.label}</Text>
          </View>
          <StatPill label="PREGUNTA" value={`${preguntaActual + 1}/${totalPreguntas}`} />
        </View>
      </View>

      {/* Columna Derecha: Puntaje, Racha, Base */}
      <View style={[styles.sideColumn, { alignItems: 'flex-end' }]}>
        <View style={styles.scoreBox}>
          <View style={styles.scoreRow}>
            <View style={styles.chipsBadge}>
              <Text style={styles.chipsText}>{puntaje}</Text>
            </View>
            <Text style={styles.multSymbol}>×</Text>
            <View style={[styles.multBadge, racha >= 3 && styles.multBadgeActive]}>
              <Text style={styles.multText}>{multiplicador.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.pillsRowRight}>
          <StatPill label="RACHA" value={`${racha} 🔥`} valueStyle={racha >= 3 ? { color: '#f59e0b' } : undefined} />
          <StatPill label="BASE" value={`+${basePuntos}`} />
        </View>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  sideColumn: { gap: 8 },
  pillsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pillsRowRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  livesContainer: { flexDirection: 'row', gap: 6 },
  jimboWrapper: { width: 40, height: 40 },
  jimboIcon: { width: '100%', height: '100%', resizeMode: 'contain' },
  jimboLost: { tintColor: '#000', opacity: 0.7 },
  scoreBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#444',
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipsBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#000',
  },
  chipsText: { fontFamily: 'Balatro', color: '#fff', fontSize: 18 },
  multSymbol: { fontFamily: 'Balatro', color: '#fff', fontSize: 16 },
  multBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#000',
  },
  multBadgeActive: { backgroundColor: '#f59e0b' },
  multText: { fontFamily: 'Balatro', color: '#fff', fontSize: 18 },
  diffBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  diffText: { fontFamily: 'Balatro', fontSize: 10 },
  statPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  statPillLabel: { fontSize: 8, color: '#888', fontFamily: 'Balatro' },
  statPillValue: { fontSize: 13, color: '#fff', fontFamily: 'Balatro' },
});
