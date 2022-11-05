import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { PreguntaResp, Pregunta } from "../interfaces/preguntaItems.interface"; 
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PreguntaService{

    preguntas: Pregunta[] = [];

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getPreguntas(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<PreguntaResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/pregunta/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<PreguntaResp>(url)
        .pipe(
            tap( resp => {
                this.preguntas = resp.preguntas!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

    actualizarPregunta(id_pregunta: number, pregunta: string, id_usuario: number) {
        // Url de la API de Parametro (Cambiar el /rol/?buscar)
        const url: string = `${this.baseURL}/pregunta/${id_pregunta}`;

        const body = {
            pregunta,
            id_usuario
        }

        return this.http.put(url, body)
        .pipe(
            catchError(err => of(err.error.msg))
        )
    }

    crearPregunta(pregunta: string, id_usuario: number) {
        const url: string = `${this.baseURL}/pregunta/`

        const body = {
            pregunta,
            id_usuario
        }
        console.log(pregunta)

        return this.http.post(url, body)
            .pipe(
                catchError(err => of(err.error.msg))
            )
    }

    eliminarPregunta(id_pregunta: number, quienElimina: number) {
        const url: string = `${this.baseURL}/pregunta/${id_pregunta}?quienElimina=${quienElimina}`

        return this.http.delete(url)
            .pipe(
                catchError(err => of(err.error.msg))
            )
            
    }

    getReporte( buscar: string = "" ) {
        // Url de la API de Bitacora
        const url: string = `${this.baseURL}/reporteria/pregunta`;
    
        const body = {
          buscar
        }
    
        return this.http.post(url, body, { responseType: 'blob'})
          .pipe(
            catchError(err => of(err.error.msg))
        )
          
    } 

} 