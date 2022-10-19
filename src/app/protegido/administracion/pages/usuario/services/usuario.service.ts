import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioResp } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getUsuarios (quienBusco: number, mostrarInactivos: boolean = false, buscar?: string, limite?: string, desde?: string): Observable<UsuarioResp> {
    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/usuario/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde }&mostrarInactivos=${mostrarInactivos}`;

    // Consumir API
    return this.http.get<UsuarioResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  desactivarUsuario(id_usuario:number, quienModifico:number){
    const body = {quienModifico};
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/usuario/bloquear/${id_usuario}`;

    //Consumo de la API
    return this.http.put<UsuarioResp>(url, body)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  actualizarUsuario(id_usuario: number, nombre_usuario: string, correo: string, id_rol: number, estado: string, quienModifico: number) {
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/usuario/actualizar/${id_usuario}`;

    const body = {
        nombre_usuario,
        correo,
        id_rol,
        estado,
        quienModifico,
        idPantalla: 2
    }

    return this.http.put(url, body)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  generarPassword() {
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/usuario/generador/password`;

    return this.http.get(url)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  actualizarContrasena(id_usuario: number, contrasena: string, quienModifico: number) {
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/usuario/cambiar-contrasena/mantenimiento/${id_usuario}`;

    const body = {
      contrasena,
      quienModifico
    }

    return this.http.put(url, body)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  crearUsuario(usuario: string, nombre_usuario: string, contrasena: string, id_rol: number, correo: string, quienCreo: number) {
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/usuario/nuevo-usuario`;

    const body = {
      usuario,
      nombre_usuario,
      id_rol,
      correo,
      contrasena,
      quienCreo
    }

    return this.http.post(url, body)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

}
