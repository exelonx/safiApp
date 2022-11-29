export interface CocinaResp {

    ok?: boolean,
    msg?: string,
    countCocinas?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    detalles?: Detalle[], /* Retorna cada una de las filas que tiene las tablas */
    detalle?: Detalle
    
 }
 
 export interface Detalle{
 
    ID: number,
    ID_PEDIDO: number,
    ID_PRODUCTO: number,
    NOMBRE_PRODUCTO: string,
    PRECIO_PRODUCTO: string,
    DESCRIPCION: string,
    ID_ESTADO: number,
    ESTADO: string,
    CANTIDAD: number,
    PARA_LLEVAR: boolean,
    HORA: Date,
    INFORMACION: string,
    PRECIO_DETALLE: string,
    TOTAL_IMPUESTO: string,
    PORCENTAJE_IMPUESTO: number,
    ID_IMPUESTO: number
    
 }