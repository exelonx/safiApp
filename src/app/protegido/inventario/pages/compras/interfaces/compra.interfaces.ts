export interface CompraResp {
    ok?: boolean,
    msg?: string,
    countCompra?: number,
    limite?: number,
    compras?: Compra[]
    compra?: Compra,
    detalleCompra?: DetalleCompra[]
}

export interface Compra {
    ID: number,
    ID_PROVEEDOR: number,
    PROVEEDOR: string,
    TOTAL_PAGADO: number,
    FECHA: Date,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date
}

export interface DetalleCompra {
    id: number,
    ID_INSUMO: number,
    CANTIDAD: number,
    PRECIO_COMPRA: number,
    editar: boolean // Para permitir editar desde el formulario
}