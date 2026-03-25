import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import JokerSprite from '@/src/components/JokerSprite';
import BalatroScreen from '@/src/components/ui/BalatroScreen';
import BalatroButton from '@/src/components/ui/BalatroButton';

interface OriginalJokersScreenProps {
  onBack: () => void;
}

export default function OriginalJokersScreen({ onBack }: OriginalJokersScreenProps) {
  const RECOUNT = true;

  const emptyIds = [ 91, 92, 93, 99, 125];
  const overlayIds = [94, 95, 96, 97, 98, 93];
  const toSkip = [...emptyIds, ...overlayIds];

  const overlays: Record<number, number> = {
    84: 94,
    85: 95,
    86: 96,
    87: 97,
    88: 98,
    100: 93,
  };

  const getSpritePos = (id: number) => ({
    row: Math.floor((id - 1) / 10),
    col: (id - 1) % 10,
  });

  const allJokers = Array.from({ length: 160 })
    .map((_, i) => i + 1)
    .filter((id) => !toSkip.includes(id))
    .map((id) => {
      const base = getSpritePos(id);
      const layers = [base];
      
      if (overlays[id]) {
        layers.push(getSpritePos(overlays[id]));
      }
      
      return { id: id.toString(), layers };
    });

  return (
    <BalatroScreen style={styles.container} overlayOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>Comodines Originales</Text>
        <BalatroButton 
          title="Volver" 
          colors={['#ef4444', '#dc2626']} 
          onPress={onBack}
          style={styles.backButton}
        />
      </View>

      <FlatList
        data={allJokers}
        keyExtractor={(item) => item.id}
        numColumns={10}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.jokerCard}>
               <View style={styles.stack}>
                 {item.layers.map((layer, idx) => (
                   <View key={idx} style={idx > 0 ? styles.overlaySprite : null}>
                     <JokerSprite row={layer.row} col={layer.col} />
                   </View>
                 ))}
               </View>
               <Text style={styles.jokerIndex}>
                 #{RECOUNT ? index + 1 : item.id}
               </Text>
            </View>
          );
        }}
      />
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 2,
    borderBottomColor: '#444',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#d946ef',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  list: {
    padding: 20,
    alignItems: 'center',
  },
  jokerCard: {
    alignItems: 'center',
    margin: 0,
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  jokerIndex: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  stack: {
    width: 71,
    height: 95,
  },
  overlaySprite: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
