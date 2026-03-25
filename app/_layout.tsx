import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAudioPlayer } from 'expo-audio';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Balatro': require('../assets/fonts/balatro.otf/balatro.otf'),
  });

  const bgMusicPlayer = useAudioPlayer(require('../assets/sounds/trivia/background.mp3'));

  useFrameworkReady();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (bgMusicPlayer) {
      bgMusicPlayer.loop = true;
      bgMusicPlayer.volume = 0.01;
      bgMusicPlayer.play();
    }
  }, [bgMusicPlayer]);

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <ExpoStatusBar hidden={true} />
    </>
  );
}
