export interface DescuentoResp {

    ok?: boolean,
    msg?: string,
    countDescuentos?: number, /* Cuantos hay en total */
    limite?: number, /* Límite de items que se mostrarán en la tabla */
    descuentos?: Descuento[], /* Retorna cada una de las filas que tiene las tablas */
    descuento?: Descuento
    
 }
 
 export interface Descuento{
 
    ID: number,
    NOMBRE: string,
    CANTIDAD: number,
    ID_TIPO_DESCUENTO: number,
    DETALLE: string
    ES_PORCENTAJE: boolean
 
 }