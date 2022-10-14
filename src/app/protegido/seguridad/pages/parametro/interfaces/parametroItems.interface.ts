export interface ParametroResp{

   ok?: boolean,
   msg?: string,
   countParametro?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   parametros?: Parametro[], /* Retorna cada una de las filas que tiene las tablas */

}

export interface Parametro{

   ID_PARAMETRO: number,
   PARAMETRO: string,
   VALOR: string,
   CREADO_POR: string,
   FECHA_CREACION: Date,
   MODIFICADO_POR: string,
   FECHA_MODIFICACION: Date,

}