import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CAI, CAIResp } from '../interfaces/cai.interface';

@Injectable({
  providedIn: 'root'
})
export class CAIService {

  cai: CAI = {
    ID: 0,
    CAI: "",
    RANGO_MINIMO: "",
    RANGO_MAXIMO: "",
    FECHA_AUTORIZADO: new Date(),
    FECHA_LIMITE_EMISION: new Date(),
    NUMERO_ACTUAL: ""
  }

  listaCAI: CAI[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAllCAI(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<CAIResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    } 

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/SAR/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<CAIResp>(url)
      .pipe(
        tap(resp => {
          this.listaCAI = resp.sar!;
        }),
        catchError(err => of(err.error.msg))
      )
  }


  getCAI(id_cai: number): Observable<CAIResp> {
    const url: string = `${this.baseURL}/SAR/${id_cai}`;

    return this.http.get<CAIResp>(url)
      .pipe(
        tap(resp => {
          this.cai = resp.unSar!
        }),
        catchError(err => of(err.error))
      )
  }

  getReporte( buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/SAR/reporteria/cai`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob'})
      .pipe(
        catchError(err => of(err.error.msg))
      )
      
  }


}
