import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { PedidoResp } from '../interfaces/pedido.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor( private http: HttpClient ) { }

  private baseURL: string = environment.baseURL;

  postMesaPedido(tipoPedido: string, nombre: string, id_usuario: number, informacion: string = "", arregloNombres: string[] = []): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/`;

    const body = {
      tipoPedido,
      nombre,
      id_usuario,
      informacion,
      arregloNombres
    }

    return this.http.post<PedidoResp>(url, body)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )

  }
}
