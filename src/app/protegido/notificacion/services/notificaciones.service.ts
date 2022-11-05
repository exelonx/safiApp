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
  cargado: boolean = false;

  private baseURL: string = environment.baseURL;

  cargarNotificacionesCampana( desde: number = 0, limite?: number ): Observable<NotificacionUsuario> {

    const url: string = `${this.baseURL}/notificacion/?desde=${desde}${limite === undefined ? '' : `&limite=${limite}`}`;
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );

    return this.http.get<NotificacionUserResp>(url, {headers})
      .pipe(tap( resp => {
        this.notificaciones = resp.notificaciones!;
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
      this.cargado = true;
      }),
      catchError(err => of(err.error.msg))
    )
  }

}
