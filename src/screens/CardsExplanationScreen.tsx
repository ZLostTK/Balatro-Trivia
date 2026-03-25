import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import BalatroScreen from '@/src/components/ui/BalatroScreen';
import BalatroButton from '@/src/components/ui/BalatroButton';
import { CARTAS_INICIALES, COMODINES_INICIALES } from '@/src/store/gameHelpers';
import { getItemImage } from '@/src/components/trivia/ItemsInventory';
import { ItemTooltipCard } from '@/src/components/trivia/ItemTooltip';
import { Carta, Comodin } from '@/src/types';

// ─── Item row con imagen y tooltip inline (estilo Balatro) ────

function ItemRow({ item }: { item: Carta | Comodin }) {
  return (
    <View style={styles.itemRow}>
      <Image source={getItemImage(item)} style={styles.cardImage} />
      <View style={styles.tooltipWrapper}>
        <ItemTooltipCard item={item} />
      </View>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────

interface CardsExplanationScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export default function CardsExplanationScreen({
  onStart,
  onBack,
}: CardsExplanationScreenProps) {

  return (
    <BalatroScreen style={styles.container} overlayOpacity={0.6}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cartas y Comodines</Text>

        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Antes de comenzar, conoce las cartas y comodines que podrás usar
            durante la trivia.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Cartas (afectan la siguiente pregunta)
          </Text>
          <View style={styles.itemsList}>
            {CARTAS_INICIALES.map((carta) => (
              <ItemRow key={carta.tipo} item={carta} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Comodines (afectan la pregunta actual)
          </Text>
          <View style={styles.itemsList}>
            {COMODINES_INICIALES.map((comodin) => (
              <ItemRow key={comodin.tipo} item={comodin} />
            ))}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <BalatroButton 
            title="Comenzar Trivia" 
            colors={['#10b981', '#059669']} 
            onPress={onStart} 
          />
          <BalatroButton 
            title="Volver" 
            colors={['#ef4444', '#dc2626']} 
            onPress={onBack} 
          />
        </View>
      </ScrollView>
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    textShadowColor: '#d946ef',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  introContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#444',
  },
  introText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f59e0b',
    marginBottom: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  itemsList: {
    gap: 30,
    width: '100%',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  tooltipWrapper: {
    // Escalar un poco el tooltip card para que no se vea gigante al lado de la carta
    transform: [{ scale: 0.9 }],
  },
  cardImage: {
    width: 80,
    height: 110,
    resizeMode: 'contain',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
});
