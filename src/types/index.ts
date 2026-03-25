export type Dificultad = 'facil' | 'media' | 'dificil' | 'imposible';

export interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  dificultad: Dificultad;
}

export type CategoriaCarta = 'tarot' | 'planeta' | 'espectral';
export type RarezaComodin = 'comun' | 'poco_comun' | 'raro';

export type TipoCarta =
  | 'dobleConocimiento' | 'adivino' // tarot
  | 'precision' | 'observador'      // planeta
  | 'escudo' | 'sacrificio';        // espectral

export type TipoComodin =
  | 'segundaOportunidad' | 'astuto' // comun
  | 'impulsoPuntaje' | 'veloz'      // poco comun
  | 'protectorRacha' | 'vampiro';   // raro

export interface Carta {
  tipo: TipoCarta;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  categoria: CategoriaCarta;
  cantidad: number;
  cantidadMax: number;
}

export interface Comodin {
  tipo: TipoComodin;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  rareza: RarezaComodin;
  cantidad: number;
  cantidadMax: number;
}

export interface RankingEntry {
  nombre: string;
  puntaje: number;
  fecha: string;
}
