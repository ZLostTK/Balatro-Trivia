import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ShopBuyItemProps {
  onPress: () => void;
  imageSource: any;
  label: string;
  price: number;
}

export default function ShopBuyItem({ onPress, imageSource, label, price }: ShopBuyItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buyItem}>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>${price}</Text>
      </View>
      <Image source={imageSource} style={styles.shopItemImage} />
      <Text style={styles.buyLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buyItem: {
    alignItems: 'center',
    backgroundColor: '#1a1a30',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
    padding: 10,
    flex: 1,
  },
  priceTag: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  priceText: {
    fontFamily: 'Balatro',
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shopItemImage: {
    width: 55,
    height: 75,
    resizeMode: 'contain',
    marginBottom: 5,
    borderRadius: 4,
  },
  buyLabel: {
    fontFamily: 'Balatro',
    color: '#ccc',
    fontSize: 11,
  },
});
