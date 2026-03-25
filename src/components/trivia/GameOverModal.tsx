import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GameOverModalProps {
  visible: boolean;
  vidas: number;
  puntaje: number;
  nombreJugador: string;
  setNombreJugador: (n: string) => void;
  onGuardarRanking: () => void;
}

export default function GameOverModal({
  visible,
  vidas,
  puntaje,
  nombreJugador,
  setNombreJugador,
  onGuardarRanking
}: GameOverModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { borderColor: vidas <= 0 ? '#ef4444' : '#10b981' }]}>
          <Text style={[styles.modalTitle, { color: vidas <= 0 ? '#ef4444' : '#10b981' }]}>
            {vidas <= 0 ? '¡PARTIDA PERDIDA!' : '¡PARTIDA COMPLETADA!'}
          </Text>
          <Text style={styles.finalScore}>PUNTAJE: {puntaje}</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="TU NOMBRE"
            placeholderTextColor="#666"
            value={nombreJugador}
            onChangeText={setNombreJugador}
            maxLength={15}
          />
          <TouchableOpacity onPress={onGuardarRanking} style={styles.saveButton}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.saveGradient}>
              <Text style={styles.saveText}>GUARDAR Y REVISAR RANKING</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#111', padding: 20, borderRadius: 10, width: '80%', borderWidth: 2, borderColor: '#444' },
  modalTitle: { color: '#fff', fontSize: 20, fontFamily: 'Balatro', textAlign: 'center', marginBottom: 15 },
  finalScore: { color: '#fff', fontSize: 30, fontFamily: 'Balatro', textAlign: 'center', marginBottom: 15 },
  nameInput: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 5, textAlign: 'center', fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#444', fontFamily: 'Balatro' },
  saveButton: { borderRadius: 5, overflow: 'hidden' },
  saveGradient: { padding: 15, alignItems: 'center' },
  saveText: { color: '#fff', fontFamily: 'Balatro' },
});
