import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { PedidoResp } from '../interfaces/pedido.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CajaGuardService {

  constructor( private http: HttpClient ) { }

  private baseURL: string = environment.baseURL;

  validarCaja(): Observable<boolean> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/validarCaja`;

    return this.http.get<boolean>(url)
      .pipe(
        catchError( () => of(false) )
      )
  }
}
