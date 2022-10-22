import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ListaPreguntas, PerfilResp } from '../interface/perfil.interface';
import { catchError, of } from 'rxjs';
import { PreguntaRespuesta } from '../../../auth/interfaces/PreguntaRespuesta.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.baseURL;

  actualizarUsuario(id_usuario: number, nombre_usuario: string = "", correo: string = "", quienModifico: number, idPantalla: number) {
    const url: string = `${this.baseUrl}/usuario/actualizar/${id_usuario}`;
    const body = {nombre_usuario, correo, quienModifico, idPantalla};

    //Consumir api put
    return this.http.put<PerfilResp>(url,body)
      .pipe(catchError( err => of(err.error.msg)))
  }

  actualizarContrasena(id_usuario: number, contrasena: string, confirmContrasena: string, confirmContrasenaActual: string) {
    const url: string = `${this.baseUrl}/usuario/cambiar-contrasena/perfil/${id_usuario}`;
    const body = {contrasena, confirmContrasena, confirmContrasenaActual};

    //Consumir api put
    return this.http.put<PerfilResp>(url,body)
      .pipe(catchError( err => of(err.error.msg)))
  }

  cargarPreguntas(id_usuario: number){
    const url: string = `${this.baseUrl}/pregunta-usuario/get-preguntas-usuario/${id_usuario}`;

    //Consumir api put
    return this.http.get<ListaPreguntas>(url)
      .pipe(catchError( err => of(err.error.msg)))
  }

  cargarPreguntasUsuario() {

    // Url de la API de consulta de las preguntas del usuario
    const url: string = `${this.baseUrl}/pregunta/?limit=10000`

    // Consumo
    return this.http.get<PreguntaRespuesta>(url)
      .pipe(
        catchError( err => of( err.error.msg ) )
      );

  };

  actualizarPregunta(id_usuario: number, idRegistro: number, idPregunta: number, respuesta: string, confirmContrasenaActual: string) {
    // Url de la API de consulta de las preguntas del usuario
    const url: string = `${this.baseUrl}/pregunta-usuario/editar-pregunta/${id_usuario}`

    const body = {
      idRegistro,
      idPregunta,
      respuesta,
      confirmContrasenaActual
    }

    return this.http.put(url, body)
      .pipe(catchError(err => of(err.error.msg)))
  }
    
}
