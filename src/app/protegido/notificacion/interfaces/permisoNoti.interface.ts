export interface ListaPermisoResp {
    permisos?: PermisoNotificacionSoloRol[],
    id_notificacion?: number
}

export interface PermisoNotificacionSoloRol {
    ID_ROL?: number;
}