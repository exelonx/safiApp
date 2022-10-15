export interface RolResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countParametro?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   roles?: Rol[], /* Retorna cada una de las filas que tiene las tablas */

}

export interface Rol{

   ID_PARAMETRO: number,
   ROL: string,
   DESCRIPCION: string,
   CREADO_POR: string,
   FECHA_CREACION: Date,
   MODIFICADO_POR: string,
   FECHA_MODIFICACION: Date,

}