import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, of, Observable } from 'rxjs';
import { BitacoraResp } from '../interfaces/bitacoraResp.interface';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getBitacora(id_usuario: number, buscar?: string, limite?: string, desde?: string, fechaInicial?: string, fechaFinal?: string): Observable<BitacoraResp> {
    
    // Evitar enviar "undefined"
    if(!buscar) {
      buscar = ""
    }

    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/bitacora/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde }&fechaInicial=${!fechaInicial ? '' : fechaInicial}&fechaFinal=${!fechaFinal ? '' : fechaFinal}`;

    // Consumir API
    return this.http.get<BitacoraResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  getReporte( buscar: string = "", fechaInicial: string = "", fechaFinal: string = "" ) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/reporteria/bitacora`;

    const body = {
      buscar, 
      fechaInicial, 
      fechaFinal
    }

    return this.http.post(url, body, { responseType: 'blob'})
      .pipe(
        catchError(err => of(err.error.msg))
      )
      
  }
}
