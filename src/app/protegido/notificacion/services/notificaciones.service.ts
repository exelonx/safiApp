import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotificacionUserResp, NotificacionUsuario } from '../interfaces/notificaciones.interfaces';
import { Observable, catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor( private http: HttpClient ) { }

  // Atributos
  notificaciones: NotificacionUsuario[] = [];
  notificacionesNoVistas: number = 0;

  private baseURL: string = environment.baseURL;

  cargarNotificacionesCampana( desde: number = 0, limite?: number ): Observable<NotificacionUsuario> {

    const url: string = `${this.baseURL}/notificacion/?desde=${desde}${limite === undefined ? '' : `&limite=${limite}`}`;
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );

    return this.http.get<NotificacionUserResp>(url, {headers})
      .pipe(tap( resp => {
        this.notificaciones = resp.notificaciones!;
        this.notificacionesNoVistas = resp.cantidadNoVistas!;
        }),
        catchError(err => of(err.error.msg))
      )
  }

  lazyLoadNotificaciones( desde: number = 0, limite?: number ): Observable<NotificacionUsuario> {
    const url: string = `${this.baseURL}/notificacion/?desde=${desde}${limite === undefined ? '' : `&limite=${limite}`}`;
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );
    
    return this.http.get<NotificacionUserResp>(url, {headers})
      .pipe(tap( resp => {
        if(resp.notificaciones?.length! > 0) {

          // Obtener el arreglo de notificaciones
          const notificacionesAux: NotificacionUsuario[] = resp.notificaciones!

          // Insertar las notificaciones
          notificacionesAux.forEach((notificacion: NotificacionUsuario) => {
            this.notificaciones.push(notificacion);
          });

        }
        }),
        catchError(err => of(err.error.msg))
      )
  }

  recibirNotificacion( id_notificacion: number ): Observable<NotificacionUsuario> {
    const url: string = `${this.baseURL}/notificacion/${id_notificacion}`;
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );

    return this.http.get<NotificacionUserResp>(url, {headers})
      .pipe(tap( resp => {

        // Insertar nueva notificación en la nueva posición
        this.notificaciones.unshift(resp.nuevaNotificacion!);

        // Si hay más de 10 notificaciones eliminar la última
        if(this.notificaciones.length > 10) {
          this.notificaciones.pop()
        }

        // Incrementar contador en 1
        this.notificacionesNoVistas++

        }),
        catchError(err => of(err.error.msg))
      )
  }

  verNotificacion( id_notificacion_usuario: string ): Observable<NotificacionUserResp> {
    const url: string = `${this.baseURL}/notificacion/buscar/${id_notificacion_usuario}`;
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );

      return this.http.get<NotificacionUserResp>(url, {headers})
      .pipe(
        tap(resp => {
          this.notificacionesNoVistas = resp.cantidadNoVistas
        }),
        catchError(err => of(err.error.msg))
      )
  }

}
