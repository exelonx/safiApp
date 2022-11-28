export interface ProductoResp { /* INavbarData */

    ok?: boolean,
    msg?: string,
    countProducto?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    productos?: Producto[], /* Retorna cada una de las filas que tiene las tablas */
    producto?: Producto,
    tipoProducto?: TipoProducto[]

}

export interface Producto {

    ID: number,
    ID_IMPUESTO: number,
    PORCENTAJE: Number,
    ID_TIPO_PRODUCTO: number,
    NOMBRE: string,
    PRECIO: number,
    EXENTA: boolean,
    DESCRIPCION: string,
    FECHA_INICIO: Date,
    FECHA_FINAL: Date,
    ESTADO: Boolean,
    SIN_ESTADO: boolean,
    BEBIDA: boolean,
    IMAGEN: Blob,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICACION_POR: string,
    FECHA_MODIFICACION: Date

}

export interface TipoProducto {
    id: number,
    TIPO_PRODUCTO: string
}