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

  getKardex(id_usuario: number, buscar?: string, limite?: string, desde?: string, fechaInicial?: string, fechaFinal?: string): Observable<KardexResp> {
    
    // Evitar enviar "undefined"
    if(!buscar) {
      buscar = ""
    }

    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/kardex/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde }&fechaInicial=${!fechaInicial ? '' : fechaInicial}&fechaFinal=${!fechaFinal ? '' : fechaFinal}`;

    // Consumir API
    return this.http.get<KardexResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }
  
}
