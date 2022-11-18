export interface InsumoResp {

   ok?: boolean,
   msg?: string,
   countInsumos?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   insumos?: Insumo[], /* Retorna cada una de las filas que tiene las tablas */
   insumo?: Insumo
   
}

export interface Insumo{

   ID: number,
   NOMBRE: string,
   ID_UNIDAD: number,
   UNIDAD_MEDIDA: string,
   CANTIDAD_MAXIMA: number,
   CANTIDAD_MINIMA: number,
   EXISTENCIA: number,
   ID_CREADO_POR: number,
   CREADO_POR: string,
   FECHA_CREACION: Date,
   MODIFICACION_POR: string,
   FECHA_MODIFICACION: Date

}