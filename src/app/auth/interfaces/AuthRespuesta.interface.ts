export interface AuthRespuesta {
    ok: boolean;
    id_usuario?: number;
    id_rol?: number;
    nombre?: string;
    estado?: string;
    token?: string;
    msg?: string;
    cod?: string;
}