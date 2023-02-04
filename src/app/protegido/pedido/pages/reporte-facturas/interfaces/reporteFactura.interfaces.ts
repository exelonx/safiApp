export interface FacturaResp {
    ok?: boolean,
    msg?: string,
    limite?: number,
    countFactura?: number,
    facturas?: Factura[]
}


export interface Factura {
    ID_PEDIDO: number,
    HORA_SOLICITUD: Date
    TOTAL: number,
    NOMBRE_USUARIO: string,
    NOMBRE_MESA: string,
    FORMA_PAGO: string
}