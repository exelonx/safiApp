import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { ParametroResp } from "../interfaces/parametroItems.interface";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ParametroService{

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getParametros(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<any>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/parametro/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        console.log(url)

        // Consumir API cambiar el .get<>
        return this.http.get<any>(url)
        .pipe(

            tap(resp=>console.log(resp)),
            catchError(err => of(err.error.msg))
        )

    }

}
