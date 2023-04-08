import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KardexResp } from '../interfaces/kardex.interfaces';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getKardex(id_insumo: string, id_usuario: number, buscar?: string, limite?: string, desde?: string, fechaInicial?: string, fechaFinal?: string): Observable<KardexResp> {
    
    // Evitar enviar "undefined"
    if(!buscar) {
      buscar = ""
    }

    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/kardex/?id_insumo=${id_insumo}&buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde }&fechaInicial=${!fechaInicial ? '' : fechaInicial}&fechaFinal=${!fechaFinal ? '' : fechaFinal}`;

    // Consumir API
    return this.http.get<KardexResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }
  
  validarIdInsumoKardex(id_insumo: string): Observable<boolean> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/kardex/validar/${id_insumo}`;

    // Consumir API
    return this.http.get<boolean>(url)
      .pipe(
        catchError( err => of(false))
      )
  }

  getNombreInsumoKardex(id_insumo: string): Observable<KardexResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/kardex/nombre/${id_insumo}`;

    // Consumir API
    return this.http.get<KardexResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  getReporte(buscar: string = "", fechaInicial: string = "", fechaFinal: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/kardex/reporteria/kardex`;
  
    const body = {
      buscar,
      fechaInicial,
      fechaFinal,
      id_usuario
    }
  
    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )
  
  }    
}
