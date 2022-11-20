import { Insumo } from '../../insumo/interfaces/insumo.interface';
export interface KardexResp {
    ok?: boolean,
    msg?: boolean,
    countKardex?: number,
    limite?: number,
    registros?: Kardex[]
    insumo?: Insumo
}

export interface Kardex {
    ID: number,
    ID_USUARIO: number,
    USUARIO: string,
    ID_INSUMO: number,
    NOMBRE: string,
    CANTIDAD: number,
    TIPO_MOVIMIENTO: string,
    FECHA_Y_HORA: Date
}