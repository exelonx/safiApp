export interface ProductoResp { /* INavbarData */

    ok?: boolean,
    msg?: string,
    countProductos?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    productos?: Producto[], /* Retorna cada una de las filas que tiene las tablas */
    producto: Producto

}

export interface Producto {

    ID: number,
    ID_IMPUESTO: number,
    ID_TIPO_PRODUCTO: number,
    NOMBRE: string,
    PRECIO: number,
    EXENTA: boolean,
    DESCRIPCION: string,
    FECHA_INICIO: Date,
    FECHA_FINAL: Date,
    SIN_ESTADO: boolean,
    BEBIDA: boolean,
    IMAGEN: Blob,
    CREADO_POR: number,
    MODIFICADO_POR: number

}