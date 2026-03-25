import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface OptionsGridProps {
  opciones: string[];
  opcionesEliminadas: number[];
  respuestaSeleccionada: number | null;
  respuestaCorrecta: boolean | null;
  indiceCorrecta: number;
  onRespuesta: (index: number) => void;
}

export default function OptionsGrid({
  opciones,
  opcionesEliminadas,
  respuestaSeleccionada,
  respuestaCorrecta,
  indiceCorrecta,
  onRespuesta
}: OptionsGridProps) {
  return (
    <View style={styles.optionsContainer}>
      {opciones.map((opcion, index) => {
        const isDisabled = opcionesEliminadas.includes(index);
        const isSelected = respuestaSeleccionada === index;
        const isCorrect = index === indiceCorrecta;

        let colors: [string, string] = ['#3b82f6', '#1d4ed8'];
        if (isDisabled) colors = ['#4b5563', '#374151'];
        else if (isSelected && respuestaCorrecta !== null) {
          colors = isCorrect ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626'];
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onRespuesta(index)}
            disabled={isDisabled || respuestaSeleccionada !== null}
            style={styles.optionTouch}
          >
            <LinearGradient colors={colors} style={[styles.optionButton, isDisabled && styles.disabledOption]}>
              <Text style={[styles.optionText, isDisabled && styles.disabledOptionText]}>{opcion}</Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 15 },
  optionTouch: { width: width / 2.5 },
  optionButton: { padding: 15, borderRadius: 8, borderWidth: 2, borderColor: '#000' },
  optionText: { color: '#fff', textAlign: 'center', fontFamily: 'Balatro', fontSize: 14, textShadowColor: '#000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  disabledOption: { opacity: 0.5 },
  disabledOptionText: { textDecorationLine: 'line-through' },
});
