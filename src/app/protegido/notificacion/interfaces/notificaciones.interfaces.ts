export interface NotificacionUserResp {
    ok?: boolean,
    notificaciones?: NotificacionUsuario[],
    nuevaNotificacion?: NotificacionUsuario
}

export interface NotificacionUsuario {
    ID_USUARIO: number,
    USUARIO: string,
    ID_NOTIFICACION: number,
    ACCION: string,
    DETALLE: string,
    TIEMPO_TRANSCURRIDO: Date,
    ID_TIPO_NOTIFICACION: number,
    TIPO_NOTIFICACION: string
}