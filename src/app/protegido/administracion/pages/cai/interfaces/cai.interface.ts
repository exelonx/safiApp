export interface CAIResp {

    ok?: boolean,
    msg?: string,
    countSar?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    sar?: CAI[], /* Retorna cada una de las filas que tiene las tablas */
    unSar?: CAI

}

export interface CAI{
    
    ID: number,
    CAI: string,
    RANGO_MINIMO: string,
    RANGO_MAXIMO: string,
    FECHA_AUTORIZADO: Date,
    FECHA_LIMITE_EMISION: Date,
    NUMERO_ACTUAL: string

}