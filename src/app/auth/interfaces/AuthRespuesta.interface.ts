export interface AuthRespuesta {
    ok: boolean;
    id_usuario?: number;
    id_rol?: number;
    nombre?: string;
    estado?: string;
    correo?: string;
    fecha_vencimiento?: Date;
    token?: string;
    msg?: string;
    cod?: string;
}