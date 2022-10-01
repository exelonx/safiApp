import { PreguntaListaTotal } from './PreguntaLista.interface';
export interface PreguntaRespuesta {
    preguntas: PreguntaListaTotal[],
    countPregunta?: number
}