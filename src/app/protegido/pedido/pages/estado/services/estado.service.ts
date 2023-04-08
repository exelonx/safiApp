import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado, EstadoResp } from '../interfaces/estadoItems.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  estados: Estado[] = [];
  estado: Estado = {

    ID: 0,
    ESTADO: "",
    COLOR: "",
    CREADO_POR: "",
    FECHA_CREACION: new Date(),
    MODIFICADO_POR: "",
    FECHA_MODIFICACION: new Date(),

  };

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getEstados(id_usuario: number, buscar?: string, limite?: string, desde?: string): Observable<EstadoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/estado/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<EstadoResp>(url)
      .pipe(
        tap(resp => {
          this.estados = resp.estados!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

  getUnEstado(id: number): Observable<EstadoResp> {
    const url: string = `${this.baseURL}/estado/${id}`;

    return this.http.get<EstadoResp>(url)
    .pipe(
      tap(resp => {
          this.estado = resp.estado!
      }),
      catchError(err => of(err.error))
  )
}

  actualizarEstado(id: number, estado: string, color: string, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/estado/editar-estado/${id}`;

    const body = {
      estado,
      color,
      id_usuario
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  getReporte(buscar: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/estado/reporteria/estado`;

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
