import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PreguntaLista, PreguntaListaTotal } from '../interfaces/PreguntaLista.interface';
import { AuthRespuesta } from '../interfaces/AuthRespuesta.interface';
import { PreguntaRespuesta } from '../interfaces/PreguntaRespuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor( private http: HttpClient ) { }

  // Preguntas del usuario
  private _preguntas: PreguntaListaTotal[] = []; 

  // Getter inmutable
  get preguntas() {
    return [ ...this._preguntas ]
  }

  private baseURL: string = environment.baseURL;

  cargarPreguntasUsuario() {

    // Url de la API de consulta de las preguntas del usuario
    const url: string = `${this.baseURL}/pregunta/?limit=10000`

    // Consumo
    return this.http.get<PreguntaRespuesta>(url)
      .pipe(
        tap( resp => 
          this._preguntas = resp.preguntas
        ),
        catchError( err => of( err.error.msg ) )
      );

  };

  compararRespuestas( id: number, respuesta: string, id_usuario: number ) {

    // Url de la API de comparación de respuestas
    const url: string = `${this.baseURL}/pregunta-usuario/comparar-pregunta`

    // Body
    const body = {
      id,
      respuesta,
      id_usuario
    };

    console.log(body)
    // Consumo de la API
    return this.http.post<AuthRespuesta>(url, body)
      .pipe(
        map( resp => resp.ok),
        catchError(err => of( err.error.msg ) )
      );

  };

}
