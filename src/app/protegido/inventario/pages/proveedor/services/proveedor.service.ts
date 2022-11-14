import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { ProveedorResp, Proveedor } from "../interfaces/proveedorItems.interface";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ProveedorService{

    proveedores: Proveedor[] = [];

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getProveedores(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<ProveedorResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/proveedor/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<ProveedorResp>(url)
        .pipe(
            tap( resp => {
                this.proveedores = resp.proveedores!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

}