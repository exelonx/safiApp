export interface PreguntaLista {
    id: number,
    pregunta: string,
    enUso?: boolean
}

export interface PreguntaListaTotal {
    ID_PREGUNTA: number,
    PREGUNTA: string,
    usadoPor?: number
}