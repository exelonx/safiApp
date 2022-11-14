export interface CompraResp {
    ok?: boolean,
    msg?: boolean,
    countCompra?: number,
    limite?: number,
    compra?: Compra[]
}

export interface Compra {
    ID: number,
    ID_PROVEEDOR: number,
    PROVEEDOR: string,
    TOTAL_PAGADO: number,
    FECHA: Date,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string
    FECHA_MODIFICACION: Date
}