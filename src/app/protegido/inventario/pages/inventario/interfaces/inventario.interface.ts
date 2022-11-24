export interface InventarioResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countInventarios?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   inventarios?: Inventario[], /* Retorna cada una de las filas que tiene las tablas */

}

export interface Inventario{

   ID: number,
   ID_INSUMO: number,
   NOMBRE: number,
   UNIDAD_MEDIDA: string,
   EXISTENCIA: number,
   CANTIDAD_MAXIMA: number,
   CANTIDAD_MINIMA: number
 
 }