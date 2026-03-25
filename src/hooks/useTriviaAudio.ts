import { useEffect } from 'react';
import { useAudioPlayer, AudioPlayer } from 'expo-audio';

export function useTriviaAudio() {
  const correct1 = useAudioPlayer(require('@/assets/sounds/trivia/correct1.mp3'));
  const correct2 = useAudioPlayer(require('@/assets/sounds/trivia/correct2.mp3'));
  const incorrect = useAudioPlayer(require('@/assets/sounds/trivia/wrong.mp3'));
  const end = useAudioPlayer(require('@/assets/sounds/trivia/end.mp3'));
  const card = useAudioPlayer(require('@/assets/sounds/trivia/card.mp3'));
  const joker = useAudioPlayer(require('@/assets/sounds/trivia/joker.mp3'));

  useEffect(() => {
    if (correct1) correct1.volume = 0.3;
    if (correct2) correct2.volume = 0.3;
    if (incorrect) incorrect.volume = 0.3;
  }, [correct1, correct2, incorrect]);

  const wrapPlayer = (player: AudioPlayer) => ({
    replayAsync: async () => {
      await player.seekTo(0);
      player.play();
    }
  });

  return {
    correct1: wrapPlayer(correct1),
    correct2: wrapPlayer(correct2),
    incorrect: wrapPlayer(incorrect),
    end: wrapPlayer(end),
    card: wrapPlayer(card),
    joker: wrapPlayer(joker),
  };
}
