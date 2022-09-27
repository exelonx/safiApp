export interface AuthRespuesta {
    ok: boolean;
    id_usuario?: number;
    id_rol?: number;
    estado?: string;
    token?: string;
    msg?: string;
}