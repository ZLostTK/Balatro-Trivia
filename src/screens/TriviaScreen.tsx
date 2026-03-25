import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTriviaStore } from '@/src/store/triviaStore';
import { TipoCarta, TipoComodin } from '@/src/types';
import { useTriviaAudio } from '@/src/hooks/useTriviaAudio';
import BalatroScreen from '@/src/components/ui/BalatroScreen';
import TriviaHeader from '@/src/components/trivia/TriviaHeader';
import OptionsGrid from '@/src/components/trivia/OptionsGrid';
import ItemsInventory from '@/src/components/trivia/ItemsInventory';
import ItemUseModal from '@/src/components/trivia/ItemUseModal';
import GameOverModal from '@/src/components/trivia/GameOverModal';
import Shop from '@/src/components/trivia/Shop';
import { ItemTooltip, useItemTooltip } from '@/src/components/trivia/ItemTooltip';

interface TriviaScreenProps {
  onFinish: () => void;
}

export default function TriviaScreen({ onFinish }: TriviaScreenProps) {
  const {
    puntaje,
    preguntaActual,
    dificultad,
    preguntas,
    cartas,
    comodines,
    responderPregunta,
    siguientePregunta,
    usarCarta,
    usarComodin,
    opcionesEliminadas,
    respuestaSeleccionada,
    agregarAlRanking,
    vidas,
    juegoTerminado,
    racha,
    mostrarTienda,
  } = useTriviaStore();

  const sounds = useTriviaAudio();
  const [itemToUse, setItemToUse] = useState<{ tipoItem: 'comodin' | 'carta'; item: any } | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);
  const [mostrarModalFinal, setMostrarModalFinal] = useState(false);
  const [nombreJugador, setNombreJugador] = useState('');
  const { tooltipItem, showTooltip, hideTooltip } = useItemTooltip();

  const pregunta = preguntas[preguntaActual];
  const cartasDisponibles = cartas.filter((c) => c.disponible);
  const comodinesDisponibles = comodines.filter((c) => c.disponible);

  useEffect(() => {
    if ((preguntaActual >= preguntas.length || juegoTerminado) && !mostrarModalFinal) {
      setMostrarModalFinal(true);
      sounds.end?.replayAsync();
    }
  }, [preguntaActual, juegoTerminado, preguntas.length, mostrarModalFinal, sounds.end]);

  const reproducirSonidosRacha = async (rachaActual: number) => {
    const playCorrect2WithProbabilities = async () => {
      if (!sounds.correct2) return;
      await sounds.correct2.replayAsync();
      if (Math.random() <= 0.25) {
        await new Promise(r => setTimeout(r, 200));
        await sounds.correct2.replayAsync();
      }
    };

    if (rachaActual === 1) {
      await playCorrect2WithProbabilities();
    } else if (rachaActual > 1) {
      if (sounds.correct1 && sounds.correct2) {
        const repeticiones = Math.min(rachaActual - 1, 4); 
        for (let i = 0; i < repeticiones; i++) {
          await sounds.correct1.replayAsync();
          if (Math.random() <= 0.20) sounds.correct2.replayAsync();
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        await playCorrect2WithProbabilities();
      }
    }
  };

  const handleRespuesta = (opcionIndex: number) => {
    if (respuestaSeleccionada !== null) return;

    const esCorrecta = responderPregunta(opcionIndex);
    setRespuestaCorrecta(esCorrecta);

    const nuevaRacha = esCorrecta ? racha + 1 : 0; 
    
    if (esCorrecta) {
      reproducirSonidosRacha(nuevaRacha);
    } else {
      sounds.incorrect?.replayAsync();
    }

    setTimeout(() => {
      // Check if shop should open (store sets mostrarTienda)
      const state = useTriviaStore.getState();
      if (state.mostrarTienda) {
        // Shop is open, don't advance yet
        setRespuestaCorrecta(null);
        return;
      }
      
      if (preguntaActual + 1 >= preguntas.length || (vidas <= 0 && !esCorrecta)) {
        setMostrarModalFinal(true);
        sounds.end?.replayAsync();
      } else {
        siguientePregunta();
        setRespuestaCorrecta(null);
      }
    }, 1500);
  };

  // When shop closes, advance to next question
  useEffect(() => {
    if (!mostrarTienda && respuestaSeleccionada !== null && !mostrarModalFinal) {
      const state = useTriviaStore.getState();
      if (state.preguntaActual + 1 >= state.preguntas.length || state.juegoTerminado) {
        setMostrarModalFinal(true);
        sounds.end?.replayAsync();
      } else {
        siguientePregunta();
        setRespuestaCorrecta(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarTienda]);

  const handleItemClick = (tipoItem: 'comodin' | 'carta', item: any) => {
    if (respuestaSeleccionada !== null) return;
    setItemToUse({ tipoItem, item });
  };

  const confirmarUsoItem = () => {
    if (!itemToUse) return;
    if (itemToUse.tipoItem === 'carta') {
      sounds.card?.replayAsync();
      usarCarta(itemToUse.item.tipo as TipoCarta);
    } else {
      sounds.joker?.replayAsync();
      usarComodin(itemToUse.item.tipo as TipoComodin);
    }
    setItemToUse(null);
  };

  const cancelarUsoItem = () => setItemToUse(null);

  const handleGuardarRanking = async () => {
    if (nombreJugador.trim()) {
      await agregarAlRanking(nombreJugador.trim());
      onFinish();
    }
  };

  if (!pregunta) return null;

  return (
    <BalatroScreen overlayOpacity={0.5}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TriviaHeader 
          vidas={vidas}
          preguntaActual={preguntaActual}
          totalPreguntas={preguntas.length}
          racha={racha}
          puntaje={puntaje}
          dificultad={dificultad}
        />

        {/* Jokers top-center + Cards top-right (Balatro layout) */}
        <View style={styles.inventoryRow}>
          <View style={styles.jokersSection}>
            <Text style={styles.inventoryLabel}>COMODINES</Text>
            <View style={styles.itemsRowCompact}>
              {comodinesDisponibles.map((c, i) => (
                <ItemsInventory.ItemButton 
                  key={`j-${i}`} 
                  item={c} 
                  tipoItem="comodin" 
                  onPress={handleItemClick}
                  onLongPress={showTooltip}
                />
              ))}
            </View>
          </View>
          <View style={styles.cardsSection}>
            <Text style={styles.inventoryLabel}>CARTAS</Text>
            <View style={styles.itemsRowCompact}>
              {cartasDisponibles.map((c, i) => (
                <ItemsInventory.ItemButton 
                  key={`c-${i}`} 
                  item={c} 
                  tipoItem="carta" 
                  onPress={handleItemClick}
                  onLongPress={showTooltip}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{pregunta.pregunta}</Text>
        </View>

        <OptionsGrid 
          opciones={pregunta.opciones}
          opcionesEliminadas={opcionesEliminadas}
          respuestaSeleccionada={respuestaSeleccionada}
          respuestaCorrecta={respuestaCorrecta}
          indiceCorrecta={pregunta.respuestaCorrecta}
          onRespuesta={handleRespuesta}
        />
      </ScrollView>

      <ItemUseModal 
        itemToUse={itemToUse}
        onConfirm={confirmarUsoItem}
        onCancel={cancelarUsoItem}
      />

      <GameOverModal 
        visible={mostrarModalFinal}
        vidas={vidas}
        puntaje={puntaje}
        nombreJugador={nombreJugador}
        setNombreJugador={setNombreJugador}
        onGuardarRanking={handleGuardarRanking}
      />

      <Shop />

      {tooltipItem && (
        <ItemTooltip item={tooltipItem} visible={true} onClose={hideTooltip} />
      )}
    </BalatroScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 15 },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  jokersSection: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardsSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  inventoryLabel: {
    fontSize: 9,
    color: '#eab308',
    fontFamily: 'Balatro',
    marginBottom: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemsRowCompact: {
    flexDirection: 'row',
    gap: 6,
  },
  questionContainer: { 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    padding: 15, 
    borderRadius: 10, 
    borderLeftWidth: 5, 
    borderLeftColor: '#f59e0b', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#555' 
  },
  questionText: { 
    color: '#fff', 
    fontSize: 18, 
    fontFamily: 'Balatro', 
    textAlign: 'center' 
  },
});
