import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ListaPreguntas, PerfilResp } from '../interface/perfil.interface';
import { catchError, of } from 'rxjs';

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
    
}
