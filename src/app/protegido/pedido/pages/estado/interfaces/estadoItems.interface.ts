export interface EstadoResp{

    ok?: boolean,
    msg?: string,
    countEstados?: number,
    limite?: number,
    estados?: Estado[],
    estado?: Estado,

}

export interface Estado{

    ID: number,
    ESTADO: string,
    COLOR: string,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date,

}