import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { FacturaResp } from '../interfaces/factura.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(private http: HttpClient ) { }

  private baseURL: string = environment.baseURL;

  validarPedido(id_pedido: number): Observable<boolean> {
    // Url de la API
    const url: string = `${this.baseURL}/facturacion/pedido/${id_pedido}`;

    return this.http.get<boolean>(url)
      .pipe(
        catchError( () => of(false) )
      )
  }

  getInformacion(id_pedido: number): Observable<FacturaResp> {
    // Url de la API
    const url: string = `${this.baseURL}/facturacion/?id_pedido=${id_pedido}`;

    return this.http.get<FacturaResp>(url)
      .pipe(
        catchError( (err) => of(err.error) )
      )
  }

  getTipoPago(): Observable<FacturaResp> {
    // Url de la API
    const url: string = `${this.baseURL}/tipo-pago/`;

    return this.http.get<FacturaResp>(url)
      .pipe(
        catchError( (err) => of(err.error) )
      )
  }

}
