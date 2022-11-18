export interface UnidadResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countUnidad?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   unidades?: Unidad[], /* Retorna cada una de las filas que tiene las tablas */
   unidad: Unidad

}

export interface Unidad{

    ID: number,
    UNIDAD_MEDIDA: string
 
 }