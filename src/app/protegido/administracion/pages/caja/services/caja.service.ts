import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Caja, CajaResp } from '../interface/cajaItems.interface';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  cajas: Caja[] = [];
  caja: Caja = {

    ID_USUARIO: 0,
    SALDO_APERTURA: 0,
    ESTADO: false,
    SALDO_CIERRE: 0,
    FECHA_APERTURA: new Date(),
    FECHA_CIERRE: new Date()

  };

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getCajas(id_usuario: number, buscar?: string, limite?: string, desde?: string, fechaInicial?: Date, fechaFinal?: Date): Observable<CajaResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/caja/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}&fechaInicial=${!fechaInicial ? '' : fechaInicial}&fechaFinal=${!fechaFinal ? '' : fechaFinal}`;

    // Consumir API cambiar el .get<>
    return this.http.get<CajaResp>(url)
      .pipe(
        tap(resp => {
          this.cajas = resp.cajas!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

  getCajaAbierta(): Observable<CajaResp> {

   
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/caja/abierta`;

    // Consumir API cambiar el .get<>
    return this.http.get<CajaResp>(url)
      .pipe(
        tap(resp => {
          this.cajas = resp.cajas!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

    
}
