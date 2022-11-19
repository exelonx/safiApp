export interface ImpuestoResp {
   ok?: boolean,
   msg?: string,
   countImpuestos?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   impuestos?: Impuesto[], /* Retorna cada una de las filas que tiene las tablas */
   impuesto?: Impuesto
}

export interface Impuesto{
    ID: number,
    PORCENTAJE: number,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date
}