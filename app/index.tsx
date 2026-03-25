import React, { useState } from 'react';
import { View } from 'react-native';
import LoadingScreen from '../src/screens/LoadingScreen';
import HomeScreen from '../src/screens/HomeScreen';
import CardsExplanationScreen from '../src/screens/CardsExplanationScreen';
import TriviaScreen from '../src/screens/TriviaScreen';
import RankingScreen from '../src/screens/RankingScreen';
import OriginalJokersScreen from '../src/screens/OriginalJokersScreen';
import { useTriviaStore } from '../src/store/triviaStore';

type Screen =
  | 'loading'
  | 'home'
  | 'cards'
  | 'trivia'
  | 'ranking'
  | 'originalJokers';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const inicializarJuego = useTriviaStore((state) => state.inicializarJuego);

  const handleFinishLoading = () => {
    setCurrentScreen('home');
  };

  const handleStartTrivia = () => {
    setCurrentScreen('cards');
  };

  const handleViewRanking = () => {
    setCurrentScreen('ranking');
  };

  const handleViewCards = () => {
    setCurrentScreen('cards');
  };

  const handleViewOriginalJokers = () => {
    setCurrentScreen('originalJokers');
  };

  const handleStartTriviaFromCards = () => {
    inicializarJuego();
    setCurrentScreen('trivia');
  };

  const handleFinishTrivia = () => {
    setCurrentScreen('ranking');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleRestartTrivia = () => {
    inicializarJuego();
    setCurrentScreen('trivia');
  };

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'loading' && (
        <LoadingScreen onFinish={handleFinishLoading} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen
          onStartTrivia={handleStartTrivia}
          onViewRanking={handleViewRanking}
          onViewCards={handleViewCards}
          onViewOriginalJokers={handleViewOriginalJokers}
        />
      )}
      {currentScreen === 'cards' && (
        <CardsExplanationScreen 
          onStart={handleStartTriviaFromCards} 
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === 'trivia' && (
        <TriviaScreen onFinish={handleFinishTrivia} />
      )}
      {currentScreen === 'ranking' && (
        <RankingScreen
          onBackToHome={handleBackToHome}
          onRestartTrivia={handleRestartTrivia}
        />
      )}
      {currentScreen === 'originalJokers' && (
        <OriginalJokersScreen onBack={handleBackToHome} />
      )}
    </View>
  );
};

export default Index;
