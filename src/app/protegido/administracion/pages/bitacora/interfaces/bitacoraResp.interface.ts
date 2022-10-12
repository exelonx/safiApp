export interface BitacoraResp {
    ok?: boolean,
    msg?: boolean,
    countBitacora?: number,
    limite?: number,
    registros?: Registro[]
}

export interface Registro {
    FECHA: Date,
    USUARIO: string,
    OBJETO: string,
    ACCION: string,
    DESCRIPCION: string
}