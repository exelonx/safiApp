import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Impuesto, ImpuestoResp } from '../interfaces/impuesto.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoImpuestoService {

  impuestos: Impuesto[] = [];

  impuesto: Impuesto = {

    ID: 0,
    NOMBRE: "",
    PORCENTAJE: 0,
    CREADO_POR: "",
    FECHA_CREACION: new Date(),
    MODIFICADO_POR: "",
    FECHA_MODIFICACION: new Date(),
  };

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getImpuestos(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<ImpuestoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/impuesto/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<ImpuestoResp>(url)
      .pipe(
        tap(resp => {
          this.impuestos = resp.impuestos!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

  getImpuesto(id_impuesto: number): Observable<ImpuestoResp> {
    const url: string = `${this.baseURL}/impuesto/${id_impuesto}`;

    return this.http.get<ImpuestoResp>(url)
      .pipe(
        tap(resp => {
          console.log(resp);
          this.impuesto = resp.impuesto!
        }),
        catchError(err => of(err.error))
      )
  }

  crearImpuesto(nombre: string, porcentaje: number, id_usuario: string): Observable<ImpuestoResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/impuesto/`;

    const body = {
      nombre,
      porcentaje,
      id_usuario
    }

    return this.http.post<ImpuestoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  actualizarImpuesto(id_impuesto: number, nombre: string, porcentaje: number, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/impuesto/${id_impuesto}`;

    const body = {
      nombre,
      porcentaje,
      id_usuario
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  eliminarImpuesto(id_impuesto: number, quienElimina: number) {
    const url: string = `${this.baseURL}/impuesto/${id_impuesto}?quienElimina=${quienElimina}`

    return this.http.delete(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getReporte(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/impuesto/reporteria/impuesto`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }


}
