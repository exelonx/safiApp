export interface ProveedorResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countProveedores?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   proveedores?: Proveedor[], /* Retorna cada una de las filas que tiene las tablas */
   proveedor?: Proveedor

}

export interface Proveedor{

    ID: number,
    NOMBRE: string,
    ID_DIRECCION: number,
    DETALLE: string,
    ID_MUNICIPIO: number,
    MUNICIPIO: string,
    ID_DEPARTAMENTO: number,
    DEPARTAMENTO: string,
    TELEFONO: string,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date,

}