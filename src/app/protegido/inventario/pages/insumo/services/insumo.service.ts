import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Insumo, InsumoResp } from '../interfaces/insumo.interface';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  insumo: Insumo = {
    ID: 0,
    NOMBRE: '',
    ID_UNIDAD: 0,
    UNIDAD_MEDIDA: '',
    CANTIDAD_MAXIMA: 0,
    CANTIDAD_MINIMA: 0,
    EXISTENCIA: 0.00,
    ID_CREADO_POR: 0,
    CREADO_POR: '',
    FECHA_CREACION: new Date(),
    MODIFICACION_POR: '',
    FECHA_MODIFICACION: new Date()
  }


  insumos: Insumo[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getInsumos(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<InsumoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/insumo/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<InsumoResp>(url)
      .pipe(
        tap(resp => {
          this.insumos = resp.insumos!;
        }),
        catchError(err => of(err.error.msg))
      )
  }

  getInsumo(id_insumo: number): Observable<InsumoResp> {
    const url: string = `${this.baseURL}/insumo/${id_insumo}`;

    return this.http.get<InsumoResp>(url)
      .pipe(
        tap(resp => {
          this.insumo = resp.insumo!
        }),
        catchError(err => of(err.error))
      )
  }

  postInsumo(nombre: string, id_unidad: number, cantidad_maxima: number, cantidad_minima: number, creado_por: string): Observable<InsumoResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/insumo/`;

    const body = {
      nombre,
      id_unidad,
      cantidad_maxima,
      cantidad_minima,
      creado_por
    }

    return this.http.post<InsumoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putInsumo(id_insumo: number, quienModifico: number, nombre: string, id_unidad: number, cantidad_maxima: number, cantidad_minima: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/insumo/${id_insumo}`;

    const body = {
      nombre,
      id_unidad,
      cantidad_maxima,
      cantidad_minima,
      quienModifico
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  deleteInsumo(id_insumo: number, quienElimina: number) {
    const url: string = `${this.baseURL}/insumo/${id_insumo}?quienElimina=${quienElimina}`

    return this.http.delete(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getReporte(buscar: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/insumo/reporteria/insumo`;

    const body = {
      buscar,
      id_usuario
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

}
