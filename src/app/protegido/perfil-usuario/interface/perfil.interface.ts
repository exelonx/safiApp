export interface PerfilResp {
    ok?: boolean,
    fechaVencimiento?: Date,
    msg?: string,
}

export interface PerfilUsuario {
    ID: number,
    ID_PREGUNTA: number,
    ID_USUARIO: number, 
    RESPUESTA: string
}

export interface ListaPreguntas{
    preguntasMapped: Pregunta[]
}

export interface Pregunta{
    id: number,
    id_pregunta: number,
    pregunta: string
}