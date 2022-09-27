import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from "rxjs/operators";
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthRespuesta } from '../interfaces/AuthRespuesta.interface';
import { Usuario } from '../interfaces/Usuario.interface';
import { IdUsuarioRecovery } from '../interfaces/IdUsuarioRecovery.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL: string = environment.baseURL;
  // Datos de login exitoso
  private _usuario!: Usuario;
  // Datos de usuario sin contraseña
  private _idUsuario!: IdUsuarioRecovery;
  
  // Getter de usuario
  get usuario() {
    // Inmutabilidad
    return { ...this._usuario };
  }

  // Getter de usuario
  get idUsuario() {
    // Inmutabilidad
    return { ...this._idUsuario };
  }

  constructor( private http: HttpClient ) { }

  login( usuario: string, contrasena: string ) {

    // Url de la API de Login
    const url: string = `${this.baseURL}/auth/login`;

    // Pasar usuario a Mayúscula
    usuario = usuario.toUpperCase();  

    // Crear el Body para la API
    const body = { usuario, contrasena };

    // Consumir API
    return this.http.post<AuthRespuesta>( url, body )
      .pipe(
        tap( resp => {
          if( resp.ok === true ) {
            localStorage.setItem( 'token', resp.token! )
            this._usuario = {
              id_usuario: resp.id_usuario!,
              id_rol: resp.id_rol!,
              estado: resp.estado!
            }
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) )
      );

  };

  // Métodos de recuperación de contraseña
  solicitarCorreoRecuperacion( usuario: string ) {  //Método de recuperación por email

    // Url de la API de Login
    const url: string = `${this.baseURL}/auth/generar-correo-recuperacion`;

    // Pasar usuario a Mayúscula
    usuario = usuario.toUpperCase();  

    // Crear el Body para la API
    const body = { usuario };

    // Consumo de API
    return this.http.post<AuthRespuesta>( url, body )
      .pipe(
        catchError( err => of( err.error.msg ) )
      );

  };

  // API´s de recuperación por preguntas
  validarUsuarioRecovery( usuario: string ) {   // Método de recuperación por pregunta secreta
  
    // Url de la API de Login
    const url: string = `${this.baseURL}/auth/buscar/username-password`;

    // Pasar usuario a Mayúscula
    usuario = usuario.toUpperCase();  

    // Crear el Body para la API
    const body = { usuario };

    // Consumo de API
    return this.http.post<AuthRespuesta>( url, body )
      .pipe(
        catchError( err => of( err.error.msg ) )
      );

  };

  validarPantallaPreguntas( token: string ) {

    // Url de la API de Login con el token
    const url: string = `${this.baseURL}/auth/validar-token-pregunta/${token}`;

    return this.http.get<AuthRespuesta>(url)
      .pipe(
        catchError( err => of( err.error.msg ) )
      );

  };
}
