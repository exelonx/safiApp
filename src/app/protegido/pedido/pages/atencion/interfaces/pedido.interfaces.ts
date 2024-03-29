import { Producto } from '../../../../catalogo-ventas/pages/gestion-productos/interfaces/producto.interfaces';
export interface PedidoResp {
    ok?: boolean,
    msg?: string,
    pedidos?: Pedido[],
    pedido?: Pedido,
    mesas?: Mesa[],
    mesa?: Mesa,
    detalleDePedido?: Detalle[]
    detalle?: Detalle,
    productos?: Producto[],
    bebidas?: Producto[]
}

export interface Pedido {
    ID: number,
    ID_USUARIO: number,
    USUARIO: string,
    NOMBRE_USUARIO: string,
    ID_ESTADO: number,
    ID_MESA: number,
    NOMBRE: string,
    TIPO: string,
    ID_CAJA: number,
    SUBTOTAL: number,
    NOMBRE_CLIENTE: string,
    HORA_SOLICITUD: Date,
    HORA_FINALIZACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date
}

export interface Mesa {
    ID: number,
    ID_ESTADO: number,
    ESTADO: string,
    COLOR: string,
    NOMBRE: string,
    INFORMACION: string,
    TIPO: string,
    FECHA: Date
}

export interface Detalle {
    ID: number,
    ID_PEDIDO: number,
    ID_PRODUCTO: number,
    NOMBRE_PRODUCTO: string,
    PRECIO_PRODUCTO: number,
    DESCRIPCION: string,
    EXENTA: boolean,
    ID_ESTADO: number,
    ESTADO: string,
    COLOR: string,
    CANTIDAD: number,
    PARA_LLEVAR: boolean,
    HORA: Date,
    INFORMACION: string,
    TOTAL_IMPUESTO: string,
    PRECIO_DETALLE: string,
    PORCENTAJE_IMPUESTO: number,
    ID_IMPUESTO: number,
    canjeado: boolean
}

export interface ProductoAgregado {
    producto: Producto;
    cantidad: number;
    informacion: string;
    comerAqui: boolean;
}