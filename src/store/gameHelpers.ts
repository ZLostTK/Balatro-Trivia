import {
  Pregunta,
  Carta,
  Comodin,
  Dificultad,
  TipoCarta,
  TipoComodin,
  CategoriaCarta,
  RarezaComodin,
} from '@/src/types';

// ─── Constantes ───────────────────────────────────────────────

export const TIENDA_CADA_N_PREGUNTAS = 5;
export const COSTO_ITEM = 3;

// ─── Configuración de dificultad (reemplaza switch/if repetidos) ───

export interface DificultadInfo {
  label: string;
  color: string;
  puntosBase: number;
  siguiente: Dificultad | null;   // al acertar
  anterior: Dificultad | null;    // al fallar
}

export const DIFICULTAD_CONFIG: Record<Dificultad, DificultadInfo> = {
  facil:     { label: 'Fácil',        color: '#10b981', puntosBase: 1, siguiente: 'media',   anterior: null     },
  media:     { label: 'Media',        color: '#f59e0b', puntosBase: 2, siguiente: 'dificil', anterior: 'facil'  },
  dificil:   { label: 'Difícil',      color: '#ef4444', puntosBase: 3, siguiente: null,      anterior: 'media'  },
  imposible: { label: '💀 Imposible', color: '#8b5cf6', puntosBase: 5, siguiente: null,      anterior: 'dificil'},
};

// ─── Datos iniciales de items ─────────────────────────────────

export const CARTAS_INICIALES: Carta[] = [
  { tipo: 'dobleConocimiento', nombre: 'Conocimiento',  descripcion: 'Si la siguiente pregunta la respondes correctamente vale el <blue:doble> de puntos',       disponible: true, categoria: 'tarot',     cantidad: 1, cantidadMax: 5 },
  { tipo: 'adivino',           nombre: 'Divino',        descripcion: 'Ganas <green:1 vida extra> de inmediato',                               disponible: true, categoria: 'tarot',     cantidad: 1, cantidadMax: 5 },
  { tipo: 'precision',         nombre: 'Precisión',      descripcion: 'Elimina <red:2 opciones> incorrectas en la siguiente pregunta',     disponible: true, categoria: 'planeta',   cantidad: 1, cantidadMax: 5 },
  { tipo: 'observador',        nombre: 'Observador',     descripcion: 'Ganas <blue:3 puntos extras> de inmediato',                            disponible: true, categoria: 'planeta',   cantidad: 1, cantidadMax: 5 },
  { tipo: 'escudo',            nombre: 'Escudo',         descripcion: 'Si la siguiente respuesta es incorrecta <green:no se penaliza>',        disponible: true, categoria: 'espectral', cantidad: 1, cantidadMax: 5 },
  { tipo: 'sacrificio',        nombre: 'Sacrificio',     descripcion: 'Pierdes <red:1 vida> pero ganas <blue:5 puntos> inmediatos',                 disponible: true, categoria: 'espectral', cantidad: 1, cantidadMax: 5 },
];

export const COMODINES_INICIALES: Comodin[] = [
  { tipo: 'segundaOportunidad', nombre: 'Segunda Op.',  descripcion: 'Permite responder <green:nuevamente> la pregunta actual',                                            disponible: true, rareza: 'comun',      cantidad: 1, cantidadMax: 5 },
  { tipo: 'astuto',             nombre: 'Astuto',                descripcion: '<blue:+1 racha>. Si racha ≥3: también <blue:+1 punto> extra',                                              disponible: true, rareza: 'comun',      cantidad: 1, cantidadMax: 5 },
  { tipo: 'impulsoPuntaje',     nombre: 'Puntaje',    descripcion: 'Suma <blue:+2 puntos> extra si la respuesta es correcta',                                           disponible: true, rareza: 'poco_comun', cantidad: 1, cantidadMax: 3 },
  { tipo: 'veloz',              nombre: 'Veloz',         descripcion: '<blue:+4 puntos> en la siguiente correcta. Costo: pierdes <orange:escudo>, o <red:1 vida>',  disponible: true, rareza: 'poco_comun', cantidad: 1, cantidadMax: 3 },
  { tipo: 'protectorRacha',     nombre: 'Protector',    descripcion: 'Evita perder tu racha si respondes <red:incorrectamente>',                                         disponible: true, rareza: 'raro',       cantidad: 1, cantidadMax: 2 },
  { tipo: 'vampiro',            nombre: 'Vampiro',               descripcion: '<blue:+8 puntos> inmediatos, <red:racha> → 0. Si Protector está activo, conserva racha',      disponible: true, rareza: 'raro',       cantidad: 1, cantidadMax: 2 },
];

// ─── Funciones de cálculo de puntos ───────────────────────────

export function calcularPuntosBase(dificultad: Dificultad): number {
  return DIFICULTAD_CONFIG[dificultad].puntosBase;
}

export function calcularMultiplicador(racha: number): number {
  return racha >= 3 ? 1 + (racha * 0.1) : 1;
}

export function aplicarEfectosCartas(
  puntosBase: number,
  cartasActivas: TipoCarta[],
  comodines: Comodin[],
): number {
  let puntos = puntosBase;

  // Doble conocimiento apilable
  const dobleCount = cartasActivas.filter(c => c === 'dobleConocimiento').length;
  for (let i = 0; i < dobleCount; i++) puntos *= 2;

  // Impulso de puntaje apilable (+2 por cada uno activado)
  const impulsoCount = comodines.filter(c => c.tipo === 'impulsoPuntaje' && !c.disponible).length;
  puntos += 2 * impulsoCount;

  // Veloz apilable (+4 por cada uno activado)
  const velozCount = comodines.filter(c => c.tipo === 'veloz' && !c.disponible).length;
  puntos += 4 * velozCount;

  return puntos;
}

// ─── Procesamiento de respuestas ──────────────────────────────

interface EstadoRespuesta {
  dificultad: Dificultad;
  vidas: number;
  racha: number;
  rachaDificil: number;
  puntaje: number;
  escudoActivo: boolean;
  protectorRachaActivo: boolean;
  cartasActivasProximaPregunta: TipoCarta[];
  comodines: Comodin[];
}

export interface ResultadoRespuesta {
  puntos: number;
  vidas: number;
  dificultad: Dificultad;
  racha: number;
  rachaDificil: number;
}

export function procesarRespuestaCorrecta(state: EstadoRespuesta): ResultadoRespuesta {
  const nuevaRacha = state.racha + 1;
  const base = calcularPuntosBase(state.dificultad);
  const multiplicador = calcularMultiplicador(nuevaRacha);
  const puntosConMultiplicador = Math.floor(base * multiplicador);
  const puntos = aplicarEfectosCartas(puntosConMultiplicador, state.cartasActivasProximaPregunta, state.comodines);

  let nuevaDificultad = state.dificultad;
  let nuevaRachaDificil = state.rachaDificil;

  // Progresión de dificultad difícil → imposible
  if (state.dificultad === 'dificil') {
    nuevaRachaDificil += 1;
    if (nuevaRachaDificil >= 5) nuevaDificultad = 'imposible';
  } else if (state.dificultad !== 'imposible') {
    nuevaRachaDificil = 0;
  }

  // Progresión estándar
  if (nuevaDificultad !== 'imposible') {
    nuevaDificultad = DIFICULTAD_CONFIG[state.dificultad].siguiente ?? state.dificultad;
  }

  return { puntos, vidas: state.vidas, dificultad: nuevaDificultad, racha: nuevaRacha, rachaDificil: nuevaRachaDificil };
}

export function procesarRespuestaIncorrecta(state: EstadoRespuesta): ResultadoRespuesta {
  const nuevaRacha = state.protectorRachaActivo ? state.racha : 0;
  let puntos = 0;
  let nuevasVidas = state.vidas;

  if (!state.escudoActivo) {
    puntos = -1;
    nuevasVidas -= 1;
  }

  const nuevaDificultad = DIFICULTAD_CONFIG[state.dificultad].anterior ?? state.dificultad;

  return { puntos, vidas: nuevasVidas, dificultad: nuevaDificultad, racha: nuevaRacha, rachaDificil: 0 };
}

// ─── Mezcla de preguntas ─────────────────────────────────────

export function mezclarOpciones(pregunta: Pregunta): Pregunta {
  const originalCorrecta = pregunta.opciones[pregunta.respuestaCorrecta];
  const opcionesMezcladas = [...pregunta.opciones].sort(() => Math.random() - 0.5);
  const nuevaCorrecta = opcionesMezcladas.indexOf(originalCorrecta);
  return { ...pregunta, opciones: opcionesMezcladas, respuestaCorrecta: nuevaCorrecta };
}

export function mezclarPreguntas(preguntas: Pregunta[]): Pregunta[] {
  const mezcladas = preguntas.map(mezclarOpciones).sort(() => Math.random() - 0.5);

  // Asegurar que la primera pregunta sea fácil
  const primerFacilIndex = mezcladas.findIndex(p => p.dificultad === 'facil');
  if (primerFacilIndex > 0) {
    [mezcladas[0], mezcladas[primerFacilIndex]] = [mezcladas[primerFacilIndex], mezcladas[0]];
  }

  return mezcladas;
}

// ─── Búsqueda de siguiente pregunta por dificultad ───────────

export function buscarSiguientePregunta(
  preguntas: Pregunta[],
  siguienteIndice: number,
  dificultad: Dificultad,
): Pregunta[] {
  const copia = [...preguntas];
  if (siguienteIndice >= copia.length) return copia;

  let nextMatchIndex = -1;
  for (let i = siguienteIndice; i < copia.length; i++) {
    if (copia[i].dificultad === dificultad) {
      nextMatchIndex = i;
      break;
    }
  }

  if (nextMatchIndex === -1) {
    nextMatchIndex = siguienteIndice + Math.floor(Math.random() * (copia.length - siguienteIndice));
  }

  [copia[siguienteIndice], copia[nextMatchIndex]] = [copia[nextMatchIndex], copia[siguienteIndice]];
  return copia;
}

// ─── Eliminación de opciones (carta Precisión) ───────────────

export function calcularOpcionesEliminadas(pregunta: Pregunta, precisionCount: number): number[] {
  if (precisionCount <= 0) return [];

  const opcionesIncorrectas = pregunta.opciones
    .map((_, index) => index)
    .filter(index => index !== pregunta.respuestaCorrecta);

  const maxEliminar = Math.min(2 * precisionCount, opcionesIncorrectas.length);
  return opcionesIncorrectas.sort(() => Math.random() - 0.5).slice(0, maxEliminar);
}

// ─── Generadores aleatorios de items ─────────────────────────

export function crearCartaAleatoria(cartasActuales: Carta[] = [], categoriaFiltro?: CategoriaCarta): Carta | null {
  const disponiblesParaComprar = CARTAS_INICIALES.filter(c => {
    const act = cartasActuales.find(ac => ac.tipo === c.tipo && ac.disponible);
    if (!act) return true;
    return act.cantidad < act.cantidadMax;
  });

  if (disponiblesParaComprar.length === 0) return null;

  let cat = categoriaFiltro ?? '';
  if (!categoriaFiltro) {
    const r = Math.random();
    if (r < 0.60) cat = 'tarot';
    else if (r < 0.85) cat = 'planeta';
    else cat = 'espectral';
  }

  let filtradas = disponiblesParaComprar.filter(c => c.categoria === cat);
  if (filtradas.length === 0) filtradas = disponiblesParaComprar;

  const elegida = filtradas[Math.floor(Math.random() * filtradas.length)];
  return { ...elegida, disponible: true, cantidad: 1 };
}

export function crearComodinAleatorio(comodinesActuales: Comodin[] = [], rarezaFiltro?: RarezaComodin): Comodin | null {
  // Filtrar los que ya están al máximo
  const disponiblesParaComprar = COMODINES_INICIALES.filter(c => {
    const act = comodinesActuales.find(ac => ac.tipo === c.tipo && ac.disponible);
    if (!act) return true;
    return act.cantidad < act.cantidadMax;
  });

  if (disponiblesParaComprar.length === 0) return null; // Todos están al maximo

  let rareza = rarezaFiltro ?? '';
  if (!rarezaFiltro) {
    const r = Math.random();
    if (r < 0.70) rareza = 'comun';
    else if (r < 0.95) rareza = 'poco_comun';
    else rareza = 'raro';
  }

  let filtrados = disponiblesParaComprar.filter(c => c.rareza === rareza);
  // Si no hay de esa rareza disponible por los stacks max, tomar del pool completo disponible
  if (filtrados.length === 0) filtrados = disponiblesParaComprar;

  const elegido = filtrados[Math.floor(Math.random() * filtrados.length)];
  return { ...elegido, disponible: true, cantidad: 1 };
}

// ─── Marcadores de uso de items ──────────────────────────────

export function marcarPrimeraCarta(cartas: Carta[], tipoCarta: TipoCarta): Carta[] {
  let marcado = false;
  return cartas.map(carta => {
    if (carta.tipo === tipoCarta && carta.disponible && !marcado) {
      marcado = true;
      const nuevaCant = carta.cantidad - 1;
      return { ...carta, cantidad: Math.max(0, nuevaCant), disponible: nuevaCant > 0 };
    }
    return carta;
  });
}

export function marcarPrimerComodin(comodines: Comodin[], tipoComodin: TipoComodin): Comodin[] {
  let marcado = false;
  return comodines.map(comodin => {
    if (comodin.tipo === tipoComodin && comodin.disponible && !marcado) {
      marcado = true;
      const nuevaCant = comodin.cantidad - 1;
      return { ...comodin, cantidad: Math.max(0, nuevaCant), disponible: nuevaCant > 0 };
    }
    return comodin;
  });
}

// ─── Handlers de efectos inmediatos (cartas) ─────────────────

type CartaEffectHandler = (state: { vidas: number; puntaje: number; cartasActivasProximaPregunta: TipoCarta[] }) =>
  Partial<{ vidas: number; puntaje: number; juegoTerminado: boolean; cartasActivasProximaPregunta: TipoCarta[] }>;

export const CARTA_EFFECTS: Record<TipoCarta, CartaEffectHandler> = {
  adivino:           (s) => ({ vidas: s.vidas + 1 }),
  observador:        (s) => ({ puntaje: s.puntaje + 3 }),
  sacrificio:        (s) => {
    const nuevasVidas = s.vidas - 1;
    return { vidas: nuevasVidas, puntaje: s.puntaje + 5, ...(nuevasVidas <= 0 && { juegoTerminado: true }) };
  },
  dobleConocimiento: (s) => ({ cartasActivasProximaPregunta: [...s.cartasActivasProximaPregunta, 'dobleConocimiento'] }),
  precision:         (s) => ({ cartasActivasProximaPregunta: [...s.cartasActivasProximaPregunta, 'precision'] }),
  escudo:            (s) => ({ cartasActivasProximaPregunta: [...s.cartasActivasProximaPregunta, 'escudo'] }),
};

// ─── Handlers de efectos inmediatos (comodines) ──────────────

interface ComodinEffectState {
  racha: number;
  puntaje: number;
  vidas: number;
  escudoActivo: boolean;
  protectorRachaActivo: boolean;
}

type ComodinEffectResult = Partial<{
  protectorRachaActivo: boolean;
  segundaOportunidadUsada: boolean;
  respuestaSeleccionada: number | null;
  racha: number;
  puntaje: number;
  vidas: number;
  escudoActivo: boolean;
  juegoTerminado: boolean;
}>;

type ComodinEffectHandler = (state: ComodinEffectState) => ComodinEffectResult;

export const COMODIN_EFFECTS: Record<TipoComodin, ComodinEffectHandler> = {
  protectorRacha:     ()  => ({ protectorRachaActivo: true }),
  segundaOportunidad: ()  => ({ segundaOportunidadUsada: true, respuestaSeleccionada: null }),

  // Condición: si racha ≥ 3 → +1 racha + 1 punto extra
  astuto: (s) => {
    const bonus = s.racha >= 3 ? 1 : 0;
    return { racha: s.racha + 1, ...(bonus > 0 && { puntaje: s.puntaje + bonus }) };
  },

  // Condición: si protector activo → conserva racha; si no → racha a 0
  vampiro: (s) => ({
    puntaje: s.puntaje + 8,
    racha: s.protectorRachaActivo ? s.racha : 0,
  }),

  impulsoPuntaje: () => ({}), // efecto pasivo al responder correcta

  // Condición: si escudo activo → pierde escudo; si no → pierde 1 vida
  veloz: (s) => {
    if (s.escudoActivo) {
      return { escudoActivo: false };
    }
    const nuevasVidas = s.vidas - 1;
    return { vidas: nuevasVidas, ...(nuevasVidas <= 0 && { juegoTerminado: true }) };
  },
};
