import { Injectable } from "@angular/core";
import { ItemParametro } from "../interfaces/parametroItems.interface";

@Injectable({
    providedIn: 'root'
})

export class ParametroService{

    parametroData: ItemParametro[] = [
        {

            header: "Parámetro",

        },
        {

            header: "Valor",

        },
        {

            header: "Usuario",
        },
        {

            header: "Fecha de Creación",

        },
        {

            header: "Fecha de Modificación",

        },
        {

            header: "Acción",

        },
    ];

    constructor() { }

}