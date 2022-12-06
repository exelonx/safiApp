import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoResp } from '../../atencion/interfaces/pedido.interfaces';
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
    MESA: "",
    NOMBRE_PRODUCTO: "",
    PRECIO_PRODUCTO: "",
    DESCRIPCION: "",
    ID_ESTADO: 0,
    ESTADO: "",
    COLOR: "",
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

  getDetallePedido(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<CocinaResp>{
    
    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }
    
    // Url de la API
    const url: string = `${this.baseURL}/cocina/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    return this.http.get<CocinaResp>(url)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )
  }

  getDetalleVistaCliente(quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<CocinaResp>{
    
    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }
    
    // Url de la API
    const url: string = `${this.baseURL}/cocina/vista-clientes/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    return this.http.get<CocinaResp>(url)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )
  }

  putEstadoDetalle( id_detalle: number, id_usuario: number ):Observable<PedidoResp> {
    const url: string = `${this.baseURL}/mesa/detalle/${id_detalle}`;

    const body = {
      id_usuario
    }

    return this.http.put<PedidoResp>(url,body)
      .pipe(
        catchError((err) => of(err.error))
      )
  }

  getReporte(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/cocina/reporteria/cocina`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }
}
