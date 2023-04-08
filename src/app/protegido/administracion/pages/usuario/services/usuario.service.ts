import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario, UsuarioResp } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  usuario: Usuario = {
    ID_USUARIO: 0,
    USUARIO: '', 
    NOMBRE_USUARIO: '', 
    ESTADO_USUARIO: '',
    CONTRASENA: '', 
    ID_ROL: 0,
    ROL: '', 
    FECHA_ULTIMA_CONEXION: new Date(),
    PREGUNTAS_CONTESTADAS: 0,
    PRIMER_INGRESO: 0,
    INTENTOS: 0, 
    FECHA_VENCIMIENTO: new Date(),
    CORREO_ELECTRONICO: '', 
    CREADO_POR: '',
    FECHA_CREACION: new Date(),
    MODIFICACION_POR: '',
    FECHA_MODIFICACION: new Date()
  }

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

  getUsuario(id_usuario: number): Observable<UsuarioResp> {
    const url: string = `${this.baseURL}/usuario/${id_usuario}`;

    return this.http.get<UsuarioResp>(url)
    .pipe(
      tap(resp =>{
        this.usuario = resp.usuario!;
        console.log(resp);
        }
        ),
        catchError(err => of(err.error.msg))
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

  getReporte( buscar: string = "", mostrarInactivos: boolean = false, id_usuario: number ) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/reporteria/usuario`;

    const body = {
      buscar, 
      mostrarInactivos,
      id_usuario
    }

    return this.http.post(url, body, { responseType: 'blob'})
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

  reActivarUsuario(id: number, quienActiva: number) {
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/usuario/activar/${id}`;

    const body = {
      quienActiva
    }

    return this.http.put(url, body)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

}
