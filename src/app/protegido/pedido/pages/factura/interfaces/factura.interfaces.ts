import { CAI } from '../../../../administracion/pages/cai/interfaces/cai.interface';
import { Detalle, Pedido } from '../../atencion/interfaces/pedido.interfaces';
export interface FacturaResp {
    ok?: boolean,
    msg?: string,
    countCompra?: number,
    cai?: CAI[],
    pedido?: Pedido,
    detalle?: Detalle[]
    tipoPago?: MetodoPago[]
}


export interface MetodoPago {
    id: number,
    FORMA_PAGO: string
}