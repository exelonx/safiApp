import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Descuento, DescuentoResp } from '../interfaces/descuento.interface';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

  descuento: Descuento = {
    ID: 0,
    NOMBRE: "",
    CANTIDAD: 0,
    ID_TIPO_DESCUENTO: 0,
    DETALLE: "",
    ES_PORCENTAJE: false
  }

  descuentos: Descuento[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getDescuentos(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<DescuentoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/descuento/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<DescuentoResp>(url)
      .pipe(
        tap(resp => {
          this.descuentos = resp.descuentos!;
        }),
        catchError(err => of(err.error.msg))
      )
  }

  getDescuento(id_descuento: number): Observable<DescuentoResp> {
    const url: string = `${this.baseURL}/descuento/${id_descuento}`;

    return this.http.get<DescuentoResp>(url)
      .pipe(
        tap(resp => {
          this.descuento = resp.descuento!
        }),
        catchError(err => of(err.error))
      )
  }

  postDescuento(nombre: string, id_descuento: number, cantidad: number, id_usuario: string): Observable<DescuentoResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/descuento/`;

    const body = {
      nombre,
      id_descuento,
      cantidad,
      id_usuario
    }

    return this.http.post<DescuentoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putDescuento(id: number, nombre: string, id_descuento: number, cantidad: number, id_usuario: string) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/descuento/${id}`;

    const body = {
      nombre,
      id_descuento,
      cantidad,
      id_usuario
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  deleteDescuento(id_descuento: number, quienElimina: number) {
    const url: string = `${this.baseURL}/descuento/${id_descuento}?quienElimina=${quienElimina}`

    return this.http.delete(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }



}
