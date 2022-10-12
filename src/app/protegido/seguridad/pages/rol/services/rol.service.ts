import { Injectable } from "@angular/core";
import { ItemRol } from "../interfaces/rolItems.interface"

@Injectable({
    providedIn: 'root'
})

export class RolService{

    rolData: ItemRol[] = [
        {

            header: "Rol",

        },
        {

            header: "Descripción",

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