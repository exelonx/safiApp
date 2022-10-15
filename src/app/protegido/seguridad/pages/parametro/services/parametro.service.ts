import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { ParametroResp, Parametro } from '../interfaces/parametroItems.interface';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ParametroService{

    parametros: Parametro[] = [];

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getParametros(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<ParametroResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/parametro/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<ParametroResp>(url)
        .pipe(
            tap( resp => {
                this.parametros = resp.parametros!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

    actualizarParametro(id_parametro: number, valor: string, id_usuario: number) {
        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/parametro/${id_parametro}`;

        const body = {
            valor,
            id_usuario
        }

        return this.http.put(url, body)
            .pipe(
                catchError(err => of(err.error.msg))
            )
    }

}
