export interface CajaResp{

    ok?: boolean,
    msg?: string,
    countCajas?: number,
    limite?: number,
    cajas?: Caja[],
    caja?: Caja,
    cajaAbierta?: Caja

}

export interface Caja{

    ID_USUARIO: number,
    SALDO_APERTURA: number,
    SALDO_ACTUAL: number,
    ESTADO: boolean,
    SALDO_CIERRE: number,
    FECHA_APERTURA: Date, 
    FECHA_CIERRE: Date 

}