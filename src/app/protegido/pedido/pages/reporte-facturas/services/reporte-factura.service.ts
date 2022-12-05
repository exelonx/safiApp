import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacturaResp } from '../interfaces/reporteFactura.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReporteFacturaService {

  constructor( private http: HttpClient ) { }

  private baseURL: string = environment.baseURL;

  getFacturas(limite?: string, desde?: string, fechaInicial?: Date, fechaFinal?: Date): Observable<FacturaResp> {
    // Url de la API
    const url: string = `${this.baseURL}/facturacion/facturas/?limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}&fechaInicial=${!fechaInicial ? '' : fechaInicial}&fechaFinal=${!fechaFinal ? '' : fechaFinal}`;

    return this.http.get<FacturaResp>(url)
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
