import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthRespuesta } from '../interfaces/AuthRespuesta.interface';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PreguntaListaTotal } from '../interfaces/PreguntaLista.interface';
import { PreguntaRespuesta } from '../interfaces/PreguntaRespuesta.interface';
import { ListaDeRespuestas } from '../interfaces/ListaRespuestas.interface';

@Injectable({
  providedIn: 'root'
})
export class PreguntasConfigService {

  constructor( private http: HttpClient ) { }

  preguntasFaltantes: number = 0;

  listaPreguntas: PreguntaListaTotal[] = [];
  listaRespuestas: ListaDeRespuestas[] = [];

  private baseURL: string = environment.baseURL;

  // Consultar preguntas faltantes a configurar
  calcularPreguntasFaltantes( idUsuario: number ) {

    // Url de API de calculo de preguntas
    const url: string = `${this.baseURL}/pregunta-usuario/pregunta-faltante/${idUsuario}`;

    // Consumo
    return this.http.get<AuthRespuesta>(url)
      .pipe(
        tap( resp => {
          if( resp.ok === true ){
            this.preguntasFaltantes = parseInt(resp.msg!, 10) 
          }
        }),
        map( resp => resp.msg ), // Traer solo el número,
        catchError( err => of( err.error.msg ) )
      )
  }

  cargarPreguntas() {
    // Url de API para traer todas las pregutas
    const url: string = `${this.baseURL}/pregunta/?limit=10000`;

    return this.http.get<PreguntaRespuesta>(url)
      .pipe(
        tap( resp => {
          this.listaPreguntas = resp.preguntas.map( pregunta => {
            return {
              ID_PREGUNTA: pregunta.ID_PREGUNTA,
              PREGUNTA: pregunta.PREGUNTA,
              usadoPor: -1
            }
          })

        }),
        catchError( err => of( err.error.msg ))
      )

  }

  insertarRespuestas( arregloRespuestas: ListaDeRespuestas[] ) {
    // Url de API para insertar todas las respuestas contestadas
    const url: string = `${this.baseURL}/pregunta-usuario/configurar-preguntas`;
    const body = { arregloRespuestas }

    return this.http.post<AuthRespuesta>(url, body)
      .pipe(
        catchError( err => of(err.error.msg) )
      )
  }

}
