import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Detalle, CocinaResp } from '../interfaces/cocina.interface';

@Injectable({
  providedIn: 'root'
})
export class CocinaService {

  detalles: Detalle[] = [];
  
  detalle: Detalle = {
    ID: 0,
    ID_PEDIDO: 0,
    ID_PRODUCTO: 0,
    NOMBRE_PRODUCTO: "",
    PRECIO_PRODUCTO: "",
    DESCRIPCION: "",
    ID_ESTADO: 0,
    ESTADO: "",
    CANTIDAD: 0,
    PARA_LLEVAR: false,
    HORA: new Date(),
    INFORMACION: "",
    PRECIO_DETALLE: "",
    TOTAL_IMPUESTO: "",
    PORCENTAJE_IMPUESTO: 0,
    ID_IMPUESTO: 0
  }

  private baseURL: string = environment.baseURL;


  constructor(private http: HttpClient) { }

  getDetallePedido(): Observable<CocinaResp>{
    // Url de la API
    const url: string = `${this.baseURL}/cocina/`;

    return this.http.get<CocinaResp>(url)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )
  }
}
