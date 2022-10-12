export interface Usuario {
    id_usuario: number;
    id_rol: number;
    estado: string;
    nombre: string;
    correo: string;
    usuario: string;
    rol: string;
    fecha_vencimiento: Date;
}