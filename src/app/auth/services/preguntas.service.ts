import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PreguntaLista } from '../interfaces/PreguntaLista.interface';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor( private http: HttpClient ) { }

  // Preguntas del usuario
  private _preguntas: PreguntaLista[] = []; 

  // Getter inmutable
  get preguntas() {
    return [ ...this._preguntas ]
  }

  private baseURL: string = environment.baseURL;

  cargarPreguntasUsuario( idUsuario: number ) {

    // Url de la API de consulta de las preguntas del usuario
    const url: string = `${this.baseURL}/pregunta-usuario/get-preguntas-usuario/${idUsuario}`

    return this.http.get<PreguntaLista[]>(url)
      .pipe(
        tap( resp => 
          this._preguntas = resp
        ),
        catchError( err => of( err.error.msg ) )
      )
  }
}
