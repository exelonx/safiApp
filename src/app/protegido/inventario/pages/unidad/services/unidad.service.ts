import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unidad, UnidadResp } from '../interfaces/unidad.interface';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  unidad: Unidad = {
    ID: 0,
    UNIDAD_MEDIDA: "",
    NOMBRE: ""
  }

  unidades: Unidad[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }


  getUnidades(id_usuario: number, buscar?: string, limite?: string, desde?: string): Observable<UnidadResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/unidad/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<UnidadResp>(url)
      .pipe(
        tap(resp => {
          this.unidades = resp.unidades!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

  getUnidad(id_unidad: number): Observable<UnidadResp> {
    const url: string = `${this.baseURL}/unidad/${id_unidad}`;

    return this.http.get<UnidadResp>(url)
      .pipe(
        tap(resp => {
          this.unidad = resp.unidad!
          console.log(this.unidad);
        }),
        catchError(err => of(err.error))
      )
  }

  postUnidad(unidad_de_medida: string, nombre: string): Observable<UnidadResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/unidad/`;

    const body = {
      unidad_de_medida,
      nombre
    }

    return this.http.post<UnidadResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putUnidad(id_unidad: number, unidad_medida: string, nombre: string, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/unidad/actualizar-unidad/${id_unidad}`;

    const body = {
      id_usuario,
      unidad_medida,
      nombre
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  deleteInsumo(id_unidad: number, quienElimina: number) {
    const url: string = `${this.baseURL}/unidad/${id_unidad}?quienElimina=${quienElimina}`

    return this.http.delete(url)
        .pipe(
            catchError(err => of(err.error.msg))
        )
        
}

  getReporte(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/reporteria/rol`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

}
