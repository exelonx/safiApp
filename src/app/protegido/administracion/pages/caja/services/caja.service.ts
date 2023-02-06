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
  cajaAbierta: Caja = {

    id:0,
    ID_USUARIO: 0,
    SALDO_APERTURA: 0,
    SALDO_ACTUAL: 0,
    ESTADO: false,
    SALDO_CIERRE: 0,
    FECHA_APERTURA: new Date(),
    FECHA_CIERRE: new Date()

  };

  // Acumuladores
  transferencia: number = 0;
  tarjeta: number = 0;
  efectivo: number = 0;
  totalMesa: number = 0;
  totalMostrador: number = 0;
  // Contadores
  clientes: number = 0;
  mesa: number = 0;
  mostrador: number = 0;

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getCajasCerradas(id_usuario: number, buscar?: string, limite?: string, desde?: string, fechaInicial?: Date, fechaFinal?: Date): Observable<CajaResp> {

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

          if (resp.cajaAbierta) {
            this.cajaAbierta = resp.cajaAbierta!;
            this.efectivo = resp.efectivo!;
            this.tarjeta = resp.tarjeta!;
            this.transferencia = resp.transferencia!;
            this.clientes = resp.clientes!;
            this.mesa = resp.mesa!;
            this.mostrador = resp.mostrador!;
            this.totalMesa = resp.totalMesa!;
            this.totalMostrador = resp.totalMostrador!;
          }

        }),
        catchError(err => of(err.error.msg))
      )

  }

  actualizarCajaCerrada(id: number, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/caja/${id}`;

    const body = {
        id_usuario
    }

    return this.http.put(url, body)
        .pipe(
            catchError(err => of(err.error.msg))
        )
  }

  crearCajaAbierta(saldo_apertura: number, id_usuario: number): Observable<CajaResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/caja/crear/`;

    const body = {
        saldo_apertura,
        id_usuario
    }

    return this.http.post<CajaResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

}

  getReporte(buscar: string = "", fechaInicial: string = "", fechaFinal: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/caja/reporteria/caja`;

    const body = {
      buscar,
      fechaInicial,
      fechaFinal
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }   

  getReporteCajaCerrada(idCaja: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/caja/reporteria/caja/cerrada`;

    const body = {
      idCaja
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }
}
