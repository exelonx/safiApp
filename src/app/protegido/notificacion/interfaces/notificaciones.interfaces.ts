export interface NotificacionUserResp {
    ok?: boolean,
    cantidadNoVistas: number,
    notificaciones?: NotificacionUsuario[],
    nuevaNotificacion?: NotificacionUsuario,
    notificacion?: NotificacionUsuario
}

export interface NotificacionUsuario {
    ID: number,
    ID_USUARIO: number,
    USUARIO: string,
    VISTO: boolean,
    ID_NOTIFICACION: number,
    ACCION: string,
    DETALLE: string,
    TIEMPO_TRANSCURRIDO: Date,
    ID_TIPO_NOTIFICACION: number,
    TIPO_NOTIFICACION: string,
    ID_INSUMO?: number,
    INSUMO?: string,
    ID_RESPONSABLE?: number,
    RESPONSABLE?: string
}