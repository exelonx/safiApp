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

  postFactura(id_pedido: number, cliente: string = "", RTN: string, direccion: string, id_descuento: number, descuento: number, venta_exenta: number, venta_gravada: number, isv: number, impBebida: number, total: number, id_pago: number, recibido: number, cambio: number, ordenCompra: number, numReg: string, consReg: string, subTotal: number, conCAI?: boolean,): Observable<FacturaResp> {
    // Url de la API
    const url: string = `${this.baseURL}/facturacion/facturar/${id_pedido}`;
    const body = {
      cliente, RTN, direccion, id_descuento, descuento, venta_exenta, venta_gravada, isv, impBebida, total, id_pago, recibido, cambio, conCAI,
      ordenCompra, numReg, consReg, subTotal
    }
    return this.http.post<FacturaResp>(url, body)
      .pipe(
        catchError( (err) => of(err.error) )
      )
  }

  postImprimirFactura(id_pedido: number) {
    // Url de la API
    const url: string = `${this.baseURL}/facturacion/facturar/factura/${id_pedido}`;

    const body = {
      
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError( (err) => of(err.error) )
      )
  }

}
