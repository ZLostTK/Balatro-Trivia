import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Image, Pressable } from 'react-native';
import { Carta, Comodin } from '@/src/types';
import { getItemImage } from '@/src/components/trivia/ItemsInventory';

// ─── Config de colores por categoría/rareza ───────────────────

const CATEGORIA_BADGE: Record<string, { bg: string; label: string }> = {
  tarot:     { bg: '#8b5cf6', label: 'Tarot' },
  planeta:   { bg: '#06b6d4', label: 'Planeta' },
  espectral: { bg: '#94a3b8', label: 'Espectral' },
};

const RAREZA_BADGE: Record<string, { bg: string; label: string }> = {
  comun:      { bg: '#2563eb', label: 'Común' }, // Blue pill like Balatro
  poco_comun: { bg: '#10b981', label: 'Poco Común' }, // Green
  raro:       { bg: '#ef4444', label: 'Raro' }, // Red
};

function getItemBadge(item: Carta | Comodin) {
  if ('categoria' in item && item.categoria) return CATEGORIA_BADGE[item.categoria] ?? CATEGORIA_BADGE.tarot;
  if ('rareza' in item && item.rareza) return RAREZA_BADGE[item.rareza] ?? RAREZA_BADGE.comun;
  return RAREZA_BADGE.comun;
}

// ─── Utilidad para texto a color con tags ─────────────────────

export function renderColoredText(text: string) {
  const parts = text.split(/(<[^>]+>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<') && part.endsWith('>')) {
      const inline = part.slice(1, -1);
      const colonIdx = inline.indexOf(':');
      if (colonIdx > -1) {
        const colorName = inline.slice(0, colonIdx);
        const content = inline.slice(colonIdx + 1);
        
        let colorHex = '#000000';
        if (colorName === 'red') colorHex = '#ef4444';
        else if (colorName === 'green') colorHex = '#10b981';
        else if (colorName === 'blue') colorHex = '#3b82f6';
        else if (colorName === 'orange') colorHex = '#f59e0b';
        else if (colorName === 'purple') colorHex = '#8b5cf6';
        
        return <Text key={i} style={{ color: colorHex, fontWeight: 'bold' }}>{content}</Text>;
      }
    }
    return <Text key={i}>{part}</Text>;
  });
}

// ─── Tooltip card (reusable, no modal) ────────────────────────

interface ItemTooltipCardProps {
  item: Carta | Comodin;
}

export function ItemTooltipCard({ item }: ItemTooltipCardProps) {
  const badge = getItemBadge(item);

  return (
    <View style={styles.tooltipCard}>
      {/* Name */}
      <Text style={styles.tooltipName}>{item.nombre}</Text>

      {/* Description box — Balatro style: white bg, black text */}
      <View style={styles.descriptionBox}>
        <Text style={styles.tooltipDescription}>
          {renderColoredText(item.descripcion)}
        </Text>
      </View>

      {/* Rarity/Category badge pill overlapping the bottom */}
      <View style={styles.badgeWrapper}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={styles.badgeText}>{badge.label}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Full-screen tooltip modal (long press) ───────────────────

interface ItemTooltipProps {
  item: Carta | Comodin;
  visible: boolean;
  onClose: () => void;
}

export function ItemTooltip({ item, visible, onClose }: ItemTooltipProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      {/* Sin fondo oscurecido (transparent) aparente para que no parezca un modal bloqueante feo */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalContent}>
          {/* Item image above the tooltip card */}
          <Image source={getItemImage(item)} style={styles.tooltipImage} />
          <ItemTooltipCard item={item} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Hook helper ──────────────────────────────────────────────

export function useItemTooltip() {
  const [tooltipItem, setTooltipItem] = useState<(Carta | Comodin) | null>(null);

  return {
    tooltipItem,
    showTooltip: (item: Carta | Comodin) => setTooltipItem(item),
    hideTooltip: () => setTooltipItem(null),
  };
}

// ─── Estilos (estilo clásico Balatro) ─────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 30,
    borderRadius: 20,
  },
  tooltipImage: {
    width: 90,
    height: 125,
    resizeMode: 'contain',
    marginBottom: -6,
    zIndex: 1,
  },

  // ─── Tooltip card (Balatro classic) ───
  tooltipCard: {
    backgroundColor: '#3f434a', // Dark grey typical Balatro tooltip
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    padding: 12,
    paddingBottom: 20, // Extra space for the pill
    alignItems: 'center',
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltipName: {
    fontFamily: 'Balatro',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  tooltipDescription: {
    fontFamily: 'Balatro',
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 20,
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: -12,
    zIndex: 2,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontFamily: 'Balatro',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
