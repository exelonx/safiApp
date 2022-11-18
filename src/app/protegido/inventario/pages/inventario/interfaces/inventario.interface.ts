export interface InventarioResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countInventario?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   inventarios?: inventario[], /* Retorna cada una de las filas que tiene las tablas */

}

export interface inventario{

    ID_INVENTARIO: number,
    ID_INSUMO: number,
    EXISTENCIA: number
 
 }