import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pregunta,
  RankingEntry,
  Dificultad,
  TipoCarta,
  TipoComodin,
  Carta,
  Comodin,
} from '@/src/types';
import preguntasDataRaw from '@/src/data/preguntas.json';
import {
  TIENDA_CADA_N_PREGUNTAS,
  COSTO_ITEM,
  procesarRespuestaCorrecta,
  procesarRespuestaIncorrecta,
  mezclarPreguntas,
  buscarSiguientePregunta,
  calcularOpcionesEliminadas,
  crearCartaAleatoria,
  crearComodinAleatorio,
  marcarPrimeraCarta,
  marcarPrimerComodin,
  CARTA_EFFECTS,
  COMODIN_EFFECTS,
} from '@/src/store/gameHelpers';

const preguntasData = preguntasDataRaw as Pregunta[];

// ─── Tipos del State ──────────────────────────────────────────

interface TriviaState {
  puntaje: number;
  preguntaActual: number;
  dificultad: Dificultad;
  preguntas: Pregunta[];
  cartas: Carta[];
  comodines: Comodin[];
  ranking: RankingEntry[];
  cartasActivasProximaPregunta: TipoCarta[];
  opcionesEliminadas: number[];
  escudoActivo: boolean;
  segundaOportunidadUsada: boolean;
  protectorRachaActivo: boolean;
  respuestaSeleccionada: number | null;
  vidas: number;
  juegoTerminado: boolean;
  racha: number;
  rachaDificil: number;
  preguntasRespondidas: number;
  mostrarTienda: boolean;
  intercambiosTiendaActual: number;

  inicializarJuego: () => void;
  responderPregunta: (respuesta: number) => boolean;
  siguientePregunta: () => void;
  usarCarta: (tipoCarta: TipoCarta) => void;
  usarComodin: (tipoComodin: TipoComodin) => void;
  agregarAlRanking: (nombre: string) => Promise<void>;
  cargarRanking: () => Promise<void>;
  reiniciarJuego: () => void;
  borrarTodoElProgreso: () => Promise<void>;
  comprarItemConPuntos: (tipoItem: 'carta' | 'comodin') => boolean;
  intercambiarItem: (tipoItem: 'carta' | 'comodin', indexViejo: number) => void;
  cerrarTienda: () => void;
}

// ─── Estado inicial ───────────────────────────────────────────

const ESTADO_INICIAL = {
  puntaje: 0,
  preguntaActual: 0,
  dificultad: 'facil' as Dificultad,
  cartasActivasProximaPregunta: [] as TipoCarta[],
  opcionesEliminadas: [] as number[],
  escudoActivo: false,
  segundaOportunidadUsada: false,
  protectorRachaActivo: false,
  respuestaSeleccionada: null as number | null,
  vidas: 3,
  juegoTerminado: false,
  racha: 0,
  rachaDificil: 0,
  preguntasRespondidas: 0,
  mostrarTienda: false,
  intercambiosTiendaActual: 5,
};

// ─── Store ────────────────────────────────────────────────────

export const useTriviaStore = create<TriviaState>((set, get) => ({
  ...ESTADO_INICIAL,
  preguntas: [...preguntasData],
  cartas: [],
  comodines: [],
  ranking: [],

  // ── Inicializar juego ──

  inicializarJuego: () => {
    set({
      ...ESTADO_INICIAL,
      preguntas: mezclarPreguntas(preguntasData),
      cartas: [],
      comodines: [],
    });
  },

  // ── Responder pregunta ──

  responderPregunta: (respuesta: number): boolean => {
    const state = get();
    const pregunta = state.preguntas[state.preguntaActual];
    const esCorrecta = respuesta === pregunta.respuestaCorrecta;

    const resultado = esCorrecta
      ? procesarRespuestaCorrecta(state)
      : procesarRespuestaIncorrecta(state);

    const nuevasPreguntasRespondidas = state.preguntasRespondidas + 1;
    const abrirTienda =
      nuevasPreguntasRespondidas > 0 &&
      nuevasPreguntasRespondidas % TIENDA_CADA_N_PREGUNTAS === 0 &&
      resultado.vidas > 0;

    set({
      puntaje: Math.max(0, state.puntaje + resultado.puntos),
      respuestaSeleccionada: respuesta,
      vidas: resultado.vidas,
      dificultad: resultado.dificultad,
      juegoTerminado: resultado.vidas <= 0,
      racha: resultado.racha,
      rachaDificil: resultado.rachaDificil,
      preguntasRespondidas: nuevasPreguntasRespondidas,
      mostrarTienda: abrirTienda,
      ...(abrirTienda ? { 
        intercambiosTiendaActual: 5,
        cartas: state.cartas.filter(c => c.disponible),
        comodines: state.comodines.filter(c => c.disponible),
      } : {}),
    });

    return esCorrecta;
  },

  // ── Siguiente pregunta ──

  siguientePregunta: () => {
    const state = get();
    const siguienteIndice = state.preguntaActual + 1;

    const nuevasPreguntas = buscarSiguientePregunta(state.preguntas, siguienteIndice, state.dificultad);

    const cartasActivas = state.cartasActivasProximaPregunta;
    const precisionCount = cartasActivas.filter(c => c === 'precision').length;
    const opcionesEliminadas =
      precisionCount > 0 && siguienteIndice < nuevasPreguntas.length
        ? calcularOpcionesEliminadas(nuevasPreguntas[siguienteIndice], precisionCount)
        : [];

    set({
      preguntas: nuevasPreguntas,
      preguntaActual: siguienteIndice,
      opcionesEliminadas,
      escudoActivo: cartasActivas.includes('escudo'),
      cartasActivasProximaPregunta: [],
      cartas: state.cartas.filter(c => c.disponible),
      comodines: state.comodines.filter(c => c.disponible),
      segundaOportunidadUsada: false,
      protectorRachaActivo: false,
      respuestaSeleccionada: null,
    });
  },

  // ── Usar carta ──

  usarCarta: (tipoCarta: TipoCarta) => {
    set((state) => {
      const cartas = marcarPrimeraCarta(state.cartas, tipoCarta);
      const efectos = CARTA_EFFECTS[tipoCarta](state);
      return { cartas, ...efectos };
    });
  },

  // ── Usar comodín ──

  usarComodin: (tipoComodin: TipoComodin) => {
    set((state) => {
      const comodines = marcarPrimerComodin(state.comodines, tipoComodin);
      const efectos = COMODIN_EFFECTS[tipoComodin](state);
      return { comodines, ...efectos };
    });
  },

  // ── Comprar item ──

  comprarItemConPuntos: (tipoItem: 'carta' | 'comodin'): boolean => {
    const state = get();
    if (state.puntaje < COSTO_ITEM) return false;

    if (tipoItem === 'carta') {
      const nuevoItem = crearCartaAleatoria(state.cartas);
      if (!nuevoItem) return false;

      let cartas = [...state.cartas];
      const index = cartas.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible);
      if (index !== -1) {
        if (cartas[index].cantidad >= cartas[index].cantidadMax) return false;
        cartas[index] = { ...cartas[index], cantidad: cartas[index].cantidad + 1 };
      } else {
        cartas.push(nuevoItem as Carta);
      }
      set({ puntaje: state.puntaje - COSTO_ITEM, cartas });
    } else {
      const nuevoItem = crearComodinAleatorio(state.comodines);
      if (!nuevoItem) return false;

      let comodines = [...state.comodines];
      const index = comodines.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible);
      if (index !== -1) {
        if (comodines[index].cantidad >= comodines[index].cantidadMax) return false; // Por si acaso
        comodines[index] = { ...comodines[index], cantidad: comodines[index].cantidad + 1 };
      } else {
        comodines.push(nuevoItem as Comodin);
      }
      set({ puntaje: state.puntaje - COSTO_ITEM, comodines });
    }
    return true;
  },

  // ── Intercambiar item ──

  intercambiarItem: (tipoItem: 'carta' | 'comodin', indexViejo: number) => {
    const state = get();
    if (state.intercambiosTiendaActual <= 0) return;

    if (tipoItem === 'carta') {
      const viejo = state.cartas[indexViejo];
      if (!viejo || !viejo.disponible) return;

      const nuevoItem = crearCartaAleatoria(state.cartas);
      if (!nuevoItem) return;

      let nuevas = [...state.cartas];

      if (nuevas[indexViejo].cantidad > 1) {
        nuevas[indexViejo] = { ...nuevas[indexViejo], cantidad: nuevas[indexViejo].cantidad - 1 };
        
        const iDest = nuevas.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible);
        if (iDest !== -1) {
          nuevas[iDest] = { ...nuevas[iDest], cantidad: nuevas[iDest].cantidad + 1 };
        } else {
          nuevas.push(nuevoItem as Carta);
        }
      } else {
        const iDest = nuevas.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible && c !== nuevas[indexViejo]);
        if (iDest !== -1) {
          nuevas[iDest] = { ...nuevas[iDest], cantidad: nuevas[iDest].cantidad + 1 };
          nuevas.splice(indexViejo, 1);
        } else {
          nuevas[indexViejo] = nuevoItem as Carta;
        }
      }

      set({ cartas: nuevas, intercambiosTiendaActual: state.intercambiosTiendaActual - 1 });
    } else {
      const viejo = state.comodines[indexViejo];
      if (!viejo || !viejo.disponible) return;
      
      const nuevoItem = crearComodinAleatorio(state.comodines);
      if (!nuevoItem) return; // No hay más para obtener

      let nuevos = [...state.comodines];
      
      if (nuevos[indexViejo].cantidad > 1) {
        // Reducimos cantidad del stack actual
        nuevos[indexViejo] = { ...nuevos[indexViejo], cantidad: nuevos[indexViejo].cantidad - 1 };
        
        const iDest = nuevos.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible);
        if (iDest !== -1) {
          nuevos[iDest] = { ...nuevos[iDest], cantidad: nuevos[iDest].cantidad + 1 };
        } else {
          nuevos.push(nuevoItem as Comodin);
        }
      } else {
        // El viejo se reemplazará
        const iDest = nuevos.findIndex(c => c.tipo === nuevoItem.tipo && c.disponible && c !== nuevos[indexViejo]);
        if (iDest !== -1) {
          nuevos[iDest] = { ...nuevos[iDest], cantidad: nuevos[iDest].cantidad + 1 };
          nuevos.splice(indexViejo, 1);
        } else {
          nuevos[indexViejo] = nuevoItem as Comodin;
        }
      }

      set({ comodines: nuevos, intercambiosTiendaActual: state.intercambiosTiendaActual - 1 });
    }
  },

  // ── Tienda ──

  cerrarTienda: () => set({ mostrarTienda: false }),

  // ── Ranking ──

  agregarAlRanking: async (nombre: string) => {
    const state = get();
    const nuevoEntry: RankingEntry = {
      nombre,
      puntaje: state.puntaje,
      fecha: new Date().toISOString(),
    };
    const nuevoRanking = [...state.ranking, nuevoEntry]
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 10);

    set({ ranking: nuevoRanking });
    await AsyncStorage.setItem('ranking', JSON.stringify(nuevoRanking));
  },

  cargarRanking: async () => {
    try {
      const rankingGuardado = await AsyncStorage.getItem('ranking');
      if (rankingGuardado) set({ ranking: JSON.parse(rankingGuardado) });
    } catch (error) {
      console.error('Error cargando ranking:', error);
    }
  },

  reiniciarJuego: () => get().inicializarJuego(),

  borrarTodoElProgreso: async () => {
    try {
      await AsyncStorage.removeItem('ranking');
      set({ ranking: [] });
    } catch (e) {
      console.error('Error borrando progreso:', e);
    }
  },
}));
