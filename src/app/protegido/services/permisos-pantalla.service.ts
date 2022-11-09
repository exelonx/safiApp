import { Injectable } from '@angular/core';
import { PermisosPantalla } from '../seguridad/pages/permiso/interfaces/permiso.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PermisosPantallaService {

  // Singlenton de permisos
  private _permisos: PermisosPantalla = {
    PERMISO_CONSULTAR: false,
    PERMISO_ACTUALIZACION: false,
    PERMISO_ELIMINACION: false,
    PERMISO_INSERCION: false
  }

  // Dirección de las API's
  private baseURL: string = environment.baseURL;

  get permisos(): PermisosPantalla {
    return this._permisos
  }

  constructor(private http: HttpClient) { }

  // Método usado para los guards de permisos de pantalla
  validarPermiso(idPantalla: number): Observable<boolean> {
    
    // Url de la apí
    const url: string = `${this.baseURL}/permiso/consulta/${idPantalla}`
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );
    
    return this.http.get<PermisosPantalla>(url, {headers})
      .pipe(
        map( permiso => {
          // Cargar el singlenton con la respuesta del servidor
          this._permisos = {
            PERMISO_INSERCION: permiso.PERMISO_INSERCION,
            PERMISO_ACTUALIZACION: permiso.PERMISO_ACTUALIZACION,
            PERMISO_CONSULTAR: permiso.PERMISO_CONSULTAR,
            PERMISO_ELIMINACION: permiso.PERMISO_ELIMINACION
          }

          if(!permiso.PERMISO_CONSULTAR){
            Swal.fire({
              title: 'Acceso inválido',
              text: 'Su usuario no cuenta con los permisos para acceder',
              icon: 'info',
              iconColor: 'white',
              background: '#3fc3ee',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
          }

          return permiso.PERMISO_CONSULTAR

        }),
        catchError( () => of(false) )
      )

  }
}
