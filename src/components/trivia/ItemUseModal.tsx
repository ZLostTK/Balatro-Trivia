import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getItemImage } from '@/src/components/trivia/ItemsInventory';
import { ItemTooltipCard } from '@/src/components/trivia/ItemTooltip';

interface ItemUseModalProps {
  itemToUse: { tipoItem: 'comodin' | 'carta'; item: any } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ItemUseModal({ itemToUse, onConfirm, onCancel }: ItemUseModalProps) {
  return (
    <Modal visible={!!itemToUse} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={styles.itemModalContent}>
          {itemToUse && (
            <>
              {/* Item image above the tooltip card */}
              <Image source={getItemImage(itemToUse.item)} style={styles.modalItemLargeImage} />
              
              {/* Use the shared Balatro-style tooltip card */}
              <ItemTooltipCard item={itemToUse.item} />
              
              <View style={styles.itemModalActions}>
                <TouchableOpacity onPress={onConfirm} style={styles.useButton}>
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.useGradient}>
                    <Text style={styles.useText}>USAR</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  itemModalContent: { 
    alignItems: 'center', 
  },
  modalItemLargeImage: { 
    width: 90, 
    height: 125, 
    resizeMode: 'contain', 
    marginBottom: -6, 
    zIndex: 1 
  },
  itemModalActions: { 
    flexDirection: 'row', 
    gap: 15, 
    marginTop: 25 // Space below the pill badge 
  },
  useButton: { 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  useGradient: { 
    paddingHorizontal: 25, 
    paddingVertical: 12 
  },
  useText: { 
    color: '#fff', 
    fontFamily: 'Balatro', 
    fontSize: 16 
  },
  cancelButton: { 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderWidth: 2, 
    borderColor: '#555', 
    borderRadius: 5,
    backgroundColor: '#2a2a2a'
  },
  cancelText: { 
    color: '#aaa', 
    fontFamily: 'Balatro', 
    fontSize: 16 
  },
});
