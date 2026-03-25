import React from 'react';
import { View, Image } from 'react-native';

interface JokerSpriteProps {
  row: number;
  col: number;
  transparent?: boolean;
  style?: any;
}

export default function JokerSprite({ row, col, transparent, style }: JokerSpriteProps) {
  const SPRITE_WIDTH = 71;
  const SPRITE_HEIGHT = 95;

  const x = col * SPRITE_WIDTH;
  const y = row * SPRITE_HEIGHT;

  return (
    <View
      style={[{
        width: SPRITE_WIDTH,
        height: SPRITE_HEIGHT,
        overflow: 'hidden',
        borderWidth: transparent ? 0 : 1,
        borderColor: transparent ? 'transparent' : '#555',
        borderRadius: transparent ? 0 : 4,
        backgroundColor: transparent ? 'transparent' : 'rgba(0,0,0,0.2)',
      }, style]}
    >
      <Image
        source={require('@/assets/images/trivia/players/sprites.png')}
        style={{
          width: 710,
          height: 1520,
          position: 'absolute',
          left: -x,
          top: -y,
          resizeMode: 'stretch',
        }}
      />
    </View>
  );
}
