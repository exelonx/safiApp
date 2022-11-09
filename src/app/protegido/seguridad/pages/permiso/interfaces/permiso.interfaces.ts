// Permisos de sistema
export interface PermisoResp {
    ok?: boolean,
    msg?: string,
    permisos?: PermisoSistema[],
    countPermisos?: number,
    limite?: number
}

export interface PermisoSistema {
    ID_PERMISO: number,
    ID_ROL: number,
    ROL: string,
    ID_OBJETO: number,
    OBJETO: string,
    PERMISO_INSERCION: boolean,
    PERMISO_ELIMINACION: boolean,
    PERMISO_ACTUALIZACION: boolean,
    PERMISO_CONSULTAR: boolean,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date
}

// Permisos de notificacion
export interface PermisoNotiResp {
    permisos?: PermisoNotificacion[],
    countPermisos?: number,
    limite?: number
}

export interface PermisoNotificacion {
    ID: number,
    ID_ROL: number,
    ROL: string,
    ID_TIPO_NOTIFICACION: number,
    TIPO_NOTIFICACION: string,
    RECIBIR_NOTIFICACION: boolean,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date
}

export interface PermisosPantalla {
    
    PERMISO_INSERCION: boolean,
    PERMISO_ELIMINACION: boolean,
    PERMISO_ACTUALIZACION: boolean,
    PERMISO_CONSULTAR: boolean,

}