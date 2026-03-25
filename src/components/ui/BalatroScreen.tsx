import React from 'react';
import { ImageBackground, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useBalatroOrientation } from '@/src/hooks/useBalatroOrientation';

interface BalatroScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayOpacity?: number;
}

export default function BalatroScreen({ children, style, overlayOpacity = 0.6 }: BalatroScreenProps) {
  useBalatroOrientation();

  return (
    <ImageBackground 
      source={require('@/assets/images/trivia/background.gif')} 
      style={[styles.container, style]}
    >
      <View style={[styles.overlay, { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
