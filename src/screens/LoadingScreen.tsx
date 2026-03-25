import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import BalatroScreen from '@/src/components/ui/BalatroScreen';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim, onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <BalatroScreen style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Trivia</Text>
        </View>
        <Text style={styles.loading}>Inicializando juego...</Text>

        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </Animated.View>
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#444'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: -10,
  },
  subtitle: {
    fontSize: 32,
    fontFamily: 'Balatro',
    color: '#f59e0b',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loading: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    fontFamily: 'Balatro'
  },
  progressBar: {
    width: width * 0.5,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ef4444',
  },
});
