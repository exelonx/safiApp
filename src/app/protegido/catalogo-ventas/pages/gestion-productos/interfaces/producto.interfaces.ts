export interface ProductoResp { /* INavbarData */

    ok?: boolean,
    msg?: string,
    countProducto?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    productos?: Producto[], /* Retorna cada una de las filas que tiene las tablas */
    producto?: Producto,
    tipoProducto?: TipoProducto[],
    insumoProducto?: InsumoProducto[],
    comboProducto?: ProductoCombo[],
    promocionProducto?: PromocionProducto[],
    catalogoProducto?: CatalogoProducto[],
    nombreInsumo?: string,
    nombreCategoria?: string,
    nuevoCatalogoProducto?: CatalogoProducto[],
    nuevoInsumoProducto?: InsumoProducto[],
    nombreCombo?: string,
    nuevoComboProducto?: ProductoCombo[],
    nombrePromo?: string,
    nuevoPromoProducto?: PromocionProducto[]

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

export interface CatalogoProducto {
    ID: number,
    ID_PRODUCTO: number,
    ID_CATALOGO: number,
    NOMBRE_CATALOGO: string,
    editar: boolean
}

export interface InsumoProducto {
    ID: number,
    ID_INSUMO: number,
    NOMBRE_INSUMO: string,
    ID_PRODUCTO: number,
    NOMBRE_PRODUCTO: string,
    CANTIDAD: number,
    editar: boolean
}

export interface ProductoCombo {
    ID: number,
    ID_COMBO: number,
    NOMBRE_COMBO: string,
    ID_PRODUCTO: number,
    NOMBRE_PRODUCTO: string,
    CANTIDAD: number,
    editar: boolean
}

export interface PromocionProducto {
    ID: number,
    ID_PROMOCION: number,
    NOMBRE_PROMOCION: string,
    ID_PRODUCTO: number,
    NOMBRE_PRODUCTO: string,
    CANTIDAD: number,
    editar: boolean
}

export interface TipoProducto {
    id: number,
    TIPO_PRODUCTO: string
}