import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { PermisoSistema, PermisoResp, PermisoNotiResp } from '../interfaces/permiso.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private baseURL: string = environment.baseURL;

  permiso: PermisoSistema = {
    ID_PERMISO: 0,
    ID_ROL: 0,
    ROL: '',
    ID_OBJETO: 0,
    OBJETO: '',
    PERMISO_INSERCION: false,
    PERMISO_ELIMINACION: false,
    PERMISO_ACTUALIZACION: false,
    PERMISO_CONSULTAR: false,
    CREADO_POR: '',
    FECHA_CREACION: new Date(),
    MODIFICADO_POR: '',
    FECHA_MODIFICACION: new Date()
  }; 

  constructor(private http: HttpClient) { }

  getPermisos(id_usuario: number, id_rol?: string, id_pantalla?: string, buscar?: string, limite?: string, desde?: string): Observable<PermisoResp>{

    // Evitar enviar "undefined"
    if (!buscar) {
        buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/permiso/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}&id_rol=${!id_rol ? '' : id_rol}&id_pantalla=${!id_pantalla ? '' : id_pantalla}`;

    // Consumir API cambiar el .get<>
    return this.http.get<PermisoSistema>(url)
      .pipe(
          catchError(err => of(err.error.msg))
      )

  }

  getPermisosNotificacion(id_usuario: number, id_rol?: string, id_pantalla?: string, buscar?: string, limite?: string, desde?: string): Observable<PermisoNotiResp> {
    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }
  
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/notificacion/permiso/get?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}&id_rol=${!id_rol ? '' : id_rol}&id_pantalla=${!id_pantalla ? '' : id_pantalla}`;
  
    // Consumir API cambiar el .get<>
    return this.http.get<PermisoSistema>(url)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  getListaPantallas() {
    // Url de la API
    const url: string = `${this.baseURL}/pantalla/`;

    // Consumir API cambiar el .get<>
    return this.http.get(url)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  getListaTipoNotificaciones() {
    // Url de la API
    const url: string = `${this.baseURL}/notificacion/tipo/get`;

    // Consumir API cambiar el .get<>
    return this.http.get(url)
      .pipe(
          catchError(err => of(err.error.msg))
      )
  }

  cargarPermiso(id_permiso: number): Observable<PermisoSistema> {
    // Url de la API
    const url: string = `${this.baseURL}/permiso/${id_permiso}`;
    // Consumir API cambiar el .get<>
    return this.http.get<PermisoSistema>(url)
      .pipe(
          tap(permiso => {
            this.permiso = permiso
            
          } ),
          catchError(err => of(err.error.msg))
      )
  }

  putPermiso(id_usuario: number, id_permiso: number, permiso_insercion: boolean, permiso_eliminacion: boolean, permiso_actualizacion: boolean, permiso_consultar: boolean) {
    // Url de la API
    const url: string = `${this.baseURL}/permiso/${id_permiso}`;

    const body = {
      id_usuario,
      permiso_actualizacion,
      permiso_consultar,
      permiso_eliminacion,
      permiso_insercion
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }
}
