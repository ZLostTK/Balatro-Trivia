import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Carta, Comodin } from '@/src/types';
import { getItemImage } from '@/src/components/trivia/ItemsInventory';
import { ItemTooltip } from '@/src/components/trivia/ItemTooltip';

interface SwapSelection {
  tipo: 'carta' | 'comodin';
  index: number;
}

interface ShopSwapListProps {
  tipo: 'carta' | 'comodin';
  label: string;
  items: (Carta | Comodin)[];
  selectedSwap: SwapSelection | null;
  onSelect: (selection: SwapSelection) => void;
}

function isDisabled(item: Carta | Comodin): boolean {
  return !item.disponible;
}

export default function ShopSwapList({ tipo, label, items, selectedSwap, onSelect }: ShopSwapListProps) {
  const [tooltipItem, setTooltipItem] = useState<(Carta | Comodin) | null>(null);

  if (items.length === 0) return null;

  return (
    <View style={styles.swapCategory}>
      <Text style={styles.swapCategoryLabel}>{label}</Text>
      <View style={styles.swapRow}>
        {items.map((item, i) => {
          const isSelected = selectedSwap?.tipo === tipo && selectedSwap?.index === i;
          return (
            <TouchableOpacity
              key={`${tipo}-${i}`}
              onPress={() => onSelect({ tipo, index: i })}
              onLongPress={() => setTooltipItem(item)}
              delayLongPress={300}
              style={[styles.swapItem, isSelected && styles.swapItemSelected, isDisabled(item) && { opacity: 0.5 }]}
            >
              <Image source={getItemImage(item)} style={styles.swapItemImage} />
              <Text style={styles.swapItemName} numberOfLines={1}>{item.nombre}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tooltipItem && (
        <ItemTooltip item={tooltipItem} visible={true} onClose={() => setTooltipItem(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  swapCategory: {
    marginBottom: 8,
  },
  swapCategoryLabel: {
    fontFamily: 'Balatro',
    color: '#8b5cf6',
    fontSize: 11,
    marginBottom: 6,
  },
  swapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swapItem: {
    alignItems: 'center',
    backgroundColor: '#1a1a30',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    padding: 6,
    width: 65,
  },
  swapItemSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#2a2a40',
  },
  swapItemImage: {
    width: 35,
    height: 48,
    resizeMode: 'contain',
    borderRadius: 3,
  },
  swapItemName: {
    fontFamily: 'Balatro',
    color: '#ccc',
    fontSize: 7,
    marginTop: 3,
    textAlign: 'center',
  },
});
