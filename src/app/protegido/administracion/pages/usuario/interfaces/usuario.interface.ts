export interface UsuarioResp {
    ok?: boolean,
    msg?: string,
    countUsuarios?: number,
    limite?: number,
    usuarios?: Usuario[]
}

export interface Usuario{
    ID_USUARIO: number,
    USUARIO: string, 
    NOMBRE_USUARIO: string, 
    ESTADO_USUARIO: string,
    CONTRASENA?:string, 
    ID_ROL: number,
    ROL?: string, 
    FECHA_ULTIMA_CONEXION?: Date,
    PREGUNTAS_CONTESTADAS?: number,
    PRIMER_INGRESO?: number,
    INTENTOS?: number, 
    FECHA_VENCIMIENTO?: Date,
    CORREO_ELECTRONICO: string, 
    CREADO_POR?: string,
    FECHA_CREACION?: Date,
    MODIFICACION_POR?: string,
    FECHA_MODIFICACION?: Date
}