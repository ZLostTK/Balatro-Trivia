import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ItemsInventoryProps {
  comodinesDisponibles: any[];
  cartasDisponibles: any[];
  onItemClick: (tipoItem: 'comodin' | 'carta', item: any) => void;
}

// ─── Mapa de imágenes individuales por tipo ───────────────────

const CARTA_IMAGES: Record<string, any> = {
  dobleConocimiento: require('@/assets/images/trivia/tarot/doble_conocimiento.png'),
  adivino:           require('@/assets/images/trivia/tarot/adivino.png'),
  precision:         require('@/assets/images/trivia/planet/precision.png'),
  observador:        require('@/assets/images/trivia/planet/observador.png'),
  escudo:            require('@/assets/images/trivia/spectral/escudo.png'),
  sacrificio:        require('@/assets/images/trivia/spectral/sacrificio.png'),
};

const COMODIN_IMAGES: Record<string, any> = {
  segundaOportunidad: require('@/assets/images/trivia/jokers/segunda_oportunidad.png'),
  astuto:             require('@/assets/images/trivia/jokers/astuto.png'),
  impulsoPuntaje:     require('@/assets/images/trivia/jokers/impulso_puntaje.png'),
  veloz:              require('@/assets/images/trivia/jokers/veloz.png'),
  protectorRacha:     require('@/assets/images/trivia/jokers/protector_racha.png'),
  vampiro:            require('@/assets/images/trivia/jokers/vampiro.png'),
};

const FALLBACK_IMAGE = require('@/assets/images/trivia/jokers/astuto.png');

export function getItemImage(item: any) {
  if (item.categoria && CARTA_IMAGES[item.tipo]) {
    return CARTA_IMAGES[item.tipo];
  }
  if (item.rareza && COMODIN_IMAGES[item.tipo]) {
    return COMODIN_IMAGES[item.tipo];
  }
  return FALLBACK_IMAGE;
}

interface ItemButtonProps {
  item: any;
  tipoItem: 'comodin' | 'carta';
  onPress: (tipoItem: 'comodin' | 'carta', item: any) => void;
  onLongPress?: (item: any) => void;
}

function ItemButton({ item, tipoItem, onPress, onLongPress }: ItemButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(tipoItem, item)}
      onLongPress={() => onLongPress?.(item)}
      delayLongPress={300}
      style={styles.itemButtonWrapper}
    >
      <Image source={getItemImage(item)} style={styles.itemImage} />
      {item.cantidad > 1 && (
        <View style={styles.stackBadge}>
          <Text style={styles.stackBadgeText}>{item.cantidad}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ItemsInventory({ comodinesDisponibles, cartasDisponibles, onItemClick }: ItemsInventoryProps) {
  return (
    <View style={styles.extrasContainer}>
      {comodinesDisponibles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MIS COMODINES</Text>
          <View style={styles.itemsRow}>
            {comodinesDisponibles.map((c, i) => (
              <ItemButton key={`j-${i}`} item={c} tipoItem="comodin" onPress={onItemClick} />
            ))}
          </View>
        </View>
      )}

      {cartasDisponibles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MIS CARTAS</Text>
          <View style={styles.itemsRow}>
            {cartasDisponibles.map((c, i) => (
              <ItemButton key={`c-${i}`} item={c} tipoItem="carta" onPress={onItemClick} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// Expose ItemButton as a static property for direct use
ItemsInventory.ItemButton = ItemButton;

export default ItemsInventory;

const styles = StyleSheet.create({
  extrasContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  section: { alignItems: 'center' },
  sectionTitle: { fontSize: 12, color: '#eab308', fontFamily: 'Balatro', marginBottom: 5, textShadowColor: '#000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  itemsRow: { flexDirection: 'row', gap: 10 },
  itemButtonWrapper: { position: 'relative' },
  itemImage: { width: 45, height: 60, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  stackBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#eab308', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000' },
  stackBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
});
