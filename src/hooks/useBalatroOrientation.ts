import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export function useBalatroOrientation() {
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      
      if (Platform.OS === 'android') {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (e) {
          console.log('Failed to hide navigation bar:', e);
        }
      }
    }
    lockOrientation();

    // No desbloquearemos explícitamente al salir porque el juego entero
    // base asume landscape y en Balatro todo está en Landscape.
  }, []);
}
