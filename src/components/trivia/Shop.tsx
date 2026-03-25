import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTriviaStore } from '@/src/store/triviaStore';
import { COSTO_ITEM } from '@/src/store/gameHelpers';
import ShopBuyItem from '@/src/components/trivia/ShopBuyItem';
import ShopSwapList from '@/src/components/trivia/ShopSwapList';

type SwapSelection = { tipo: 'carta' | 'comodin'; index: number };

export default function Shop() {
  const {
    mostrarTienda,
    cerrarTienda,
    puntaje,
    cartas,
    comodines,
    intercambiosTiendaActual,
    comprarItemConPuntos,
    intercambiarItem,
  } = useTriviaStore();

  const [selectedSwap, setSelectedSwap] = useState<SwapSelection | null>(null);

  const handleComprar = (tipoItem: 'carta' | 'comodin') => {
    if (!comprarItemConPuntos(tipoItem)) {
      Alert.alert('Sin puntos', `Necesitas al menos ${COSTO_ITEM} puntos para comprar.`);
    }
  };

  const handleIntercambiar = () => {
    if (!selectedSwap) return;
    intercambiarItem(selectedSwap.tipo, selectedSwap.index);
    setSelectedSwap(null);
  };

  const handleCerrar = () => {
    setSelectedSwap(null);
    cerrarTienda();
  };

  return (
    <Modal visible={mostrarTienda} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.shopContainer}>
          {/* Header */}
          <View style={styles.shopHeader}>
            <Text style={styles.shopTitle}>TIENDA</Text>
            <View style={styles.puntajeBadge}>
              <Text style={styles.puntajeText}>${puntaje}</Text>
            </View>
          </View>

          <ScrollView style={styles.shopBody} contentContainerStyle={styles.shopBodyContent}>
            {/* Sección Comprar */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>COMPRAR ({COSTO_ITEM} PTS)</Text>
              <View style={styles.buyRow}>
                <ShopBuyItem
                  onPress={() => handleComprar('comodin')}
                  imageSource={require('@/assets/images/trivia/jokers/astuto.png')}
                  label="COMODÍN"
                  price={COSTO_ITEM}
                />
                <ShopBuyItem
                  onPress={() => handleComprar('carta')}
                  imageSource={require('@/assets/images/trivia/tarot/doble_conocimiento.png')}
                  label="CARTA"
                  price={COSTO_ITEM}
                />
              </View>
            </View>

            {/* Sección Intercambiar */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>INTERCAMBIAR ({intercambiosTiendaActual}/5)</Text>
              <Text style={styles.swapHint}>Toca un item y luego &quot;Cambiar&quot; para obtener otro del mismo tipo</Text>

              <ShopSwapList
                tipo="comodin"
                label="COMODINES"
                items={comodines.filter(c => c.disponible)}
                selectedSwap={selectedSwap}
                onSelect={setSelectedSwap}
              />

              <ShopSwapList
                tipo="carta"
                label="CARTAS"
                items={cartas.filter(c => c.disponible)}
                selectedSwap={selectedSwap}
                onSelect={setSelectedSwap}
              />

              {selectedSwap && (
                <TouchableOpacity 
                  onPress={handleIntercambiar} 
                  style={[styles.swapButton, intercambiosTiendaActual <= 0 && { opacity: 0.4 }]}
                  disabled={intercambiosTiendaActual <= 0}
                >
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.swapGradient}>
                    <Text style={styles.swapButtonText}>CAMBIAR</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity onPress={handleCerrar} style={styles.nextRoundButton}>
            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.nextRoundGradient}>
              <Text style={styles.nextRoundText}>SIGUIENTE RONDA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#e74c3c',
    width: '92%',
    maxHeight: '85%',
    overflow: 'hidden',
    flexShrink: 1,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#0f0f1a',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  shopTitle: {
    fontSize: 24,
    fontFamily: 'Balatro',
    color: '#f59e0b',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  puntajeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  puntajeText: {
    fontFamily: 'Balatro',
    color: '#fff',
    fontSize: 18,
  },
  shopBody: { 
    flexGrow: 1, 
    flexShrink: 1 
  },
  shopBodyContent: { padding: 12, gap: 12 },
  sectionBox: {
    backgroundColor: '#111122',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    padding: 12,
  },
  sectionLabel: {
    fontFamily: 'Balatro',
    color: '#eab308',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  swapHint: {
    fontFamily: 'Balatro',
    color: '#888',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
  },
  swapButton: {
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
    alignSelf: 'center',
  },
  swapGradient: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  swapButtonText: {
    fontFamily: 'Balatro',
    color: '#fff',
    fontSize: 14,
  },
  nextRoundButton: {
    borderRadius: 0,
    overflow: 'hidden',
  },
  nextRoundGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextRoundText: {
    fontFamily: 'Balatro',
    color: '#fff',
    fontSize: 16,
  },
});
