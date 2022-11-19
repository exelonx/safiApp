export interface CategoriaResp{

    ok?: boolean,
    msg?: string,
    countCategorias?: number,
    limite?: number,
    catalogos?: Categoria[],

}

export interface Categoria{

    ID: number,
    NOMBRE: string,
    CREADO_POR: string,
    FECHA_CREACION: Date,
    MODIFICADO_POR: string,
    FECHA_MODIFICACION: Date,

}