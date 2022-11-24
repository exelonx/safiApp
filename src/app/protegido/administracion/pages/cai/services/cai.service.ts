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

  postCAI(cai: string, rango_minimo: string, rango_maximo: string, fecha_autorizado: Date, fecha_limite_emision: Date, id_usuario: string): Observable<CAIResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/SAR/`;

    const body = {
      cai,
      rango_minimo,
      rango_maximo,
      fecha_autorizado,
      fecha_limite_emision,
      id_usuario
    }

    return this.http.post<CAIResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putCAI(id_cai: number, cai: string, rango_minimo: string, rango_maximo: string, fecha_autorizado: Date,
    fecha_limite_emision: Date, numero_actual: string, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/SAR/${id_cai}`;

    const body = {
      cai,
      rango_minimo,
      rango_maximo,
      fecha_autorizado,
      fecha_limite_emision,
      numero_actual,
      id_usuario
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  deleteCAI(id_cai: number, quienElimina: number) {
    const url: string = `${this.baseURL}/SAR/${id_cai}?quienElimina=${quienElimina}`

    return this.http.delete(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getReporte(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/SAR/reporteria/cai`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }


}
