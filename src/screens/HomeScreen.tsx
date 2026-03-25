import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
  View,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useTriviaStore } from '@/src/store/triviaStore';
import BalatroScreen from '@/src/components/ui/BalatroScreen';
import BalatroButton from '@/src/components/ui/BalatroButton';

interface HomeScreenProps {
  onStartTrivia: () => void;
  onViewRanking: () => void;
  onViewCards: () => void;
  onViewOriginalJokers: () => void;
}

export default function HomeScreen({
  onStartTrivia,
  onViewRanking,
  onViewCards,
  onViewOriginalJokers,
}: HomeScreenProps) {
  const cargarRanking = useTriviaStore((state) => state.cargarRanking);
  const titleAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const popAnim = useRef(new Animated.Value(0)).current;
  const [tapCount, setTapCount] = useState(0);
  const [isEasterEggVisible, setIsEasterEggVisible] = useState(false);
  const jokerPlayer = useAudioPlayer(require('@/assets/sounds/trivia/joker.mp3'));

  const borrarTodoElProgreso = useTriviaStore((state) => state.borrarTodoElProgreso);

  const handleSubtitleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 5) {
      setIsEasterEggVisible(true);
      if (jokerPlayer) {
        jokerPlayer.seekTo(0);
        jokerPlayer.play();
      }
      Animated.spring(popAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }
  };

  const confirmarBorrarProgreso = () => {
    Alert.alert(
      'Borrar Progreso',
      '¿Estás seguro de que quieres borrar todo el ranking y el progreso? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: borrarTodoElProgreso },
      ]
    );
  };

  useEffect(() => {
    cargarRanking();

    const timer = setTimeout(() => {
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);

    return () => clearTimeout(timer);
  }, [cargarRanking, titleAnim, buttonsAnim]);

  const titleScale = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const buttonsTranslateY = buttonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <BalatroScreen style={styles.container}>
      {/* Reset button - discrete top right like Balatro's version tag */}
      <TouchableOpacity onPress={confirmarBorrarProgreso} style={styles.deleteProgress}>
        <Text style={styles.deleteProgressText}>Reset</Text>
      </TouchableOpacity>

      {/* Main content area - center logo */}
      <View style={styles.centerArea}>
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleAnim,
              transform: [{ scale: titleScale }],
            },
          ]}
        >
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity activeOpacity={1} onPress={handleSubtitleTap}>
            <Text style={styles.subtitle}>Trivia</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom buttons row - Balatro style horizontal layout */}
      <Animated.View
        style={[
          styles.bottomBar,
          {
            opacity: buttonsAnim,
            transform: [{ translateY: buttonsTranslateY }],
          },
        ]}
      >
        <BalatroButton 
          title="PLAY" 
          colors={['#3b82f6', '#1d4ed8']} 
          onPress={onStartTrivia}
          style={styles.mainButton}
        />

        <BalatroButton 
          title="RANKING" 
          colors={['#ef4444', '#dc2626']} 
          onPress={onViewRanking}
          style={styles.sideButton}
        />

        <BalatroButton 
          title="COLECCIÓN" 
          colors={['#10b981', '#059669']} 
          onPress={onViewCards}
          style={styles.sideButton}
        />

        {isEasterEggVisible && (
          <Animated.View style={{ transform: [{ scale: popAnim }] }}>
            <BalatroButton 
              title="ORIGINALES" 
              colors={['#f59e0b', '#d97706']} 
              onPress={onViewOriginalJokers}
              style={styles.sideButton}
            />
          </Animated.View>
        )}
      </Animated.View>
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 120,
    marginBottom: -5,
  },
  subtitle: {
    fontSize: 42,
    fontFamily: 'Balatro',
    color: '#f59e0b',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexWrap: 'wrap',
  },
  mainButton: {
    paddingVertical: 16,
    paddingHorizontal: 35,
  },
  sideButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  deleteProgress: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
    zIndex: 10,
  },
  deleteProgressText: {
    color: '#888',
    fontFamily: 'Balatro',
    fontSize: 10,
  },
});
