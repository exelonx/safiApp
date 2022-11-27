import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { PedidoResp, Mesa, Pedido } from '../interfaces/pedido.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  mesas: Mesa[] = [];

  constructor( private http: HttpClient ) { }

  private baseURL: string = environment.baseURL;

  getMesas(): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        tap( resp => {
          this.mesas = resp.mesas!;
        }),
        catchError( (err) => of(err.error.msg) )
      )
  }

  getMesa(id_mesa: number): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/get/${id_mesa}`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        tap( resp => {
          this.mesas.push(resp.mesa!)
        }),
        catchError( (err) => of(err.error.msg) )
      )
  }

  getPedidoDeMesa( id_mesa: number ): Observable<PedidoResp>{
    // Url de la API
    const url: string = `${this.baseURL}/mesa/pedido/${id_mesa}`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )
  }

  getProductos( buscar: string = "", idTipoProducto: string = "", idCategoria: string = "" ): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/pedido/productos/agregar?buscar=${buscar}&idTipoProducto=${!idTipoProducto ? '' : idTipoProducto}&idCategoria=${!idCategoria ? '' : idCategoria}`;
    return this.http.get<PedidoResp>(url)
    .pipe(
      catchError( (err) => of(err.error.msg) )
    )
  }

  postMesaPedido(tipoPedido: string, nombre: string, id_usuario: number, informacion: string = "", arregloNombres: string[] = []): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/`;

    const body = {
      tipoPedido,
      nombre,
      id_usuario,
      informacion,
      arregloNombres
    }

    return this.http.post<PedidoResp>(url, body)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )

  }

  getDetallePedido( id_pedido: number ): Observable<PedidoResp>{
    // Url de la API
    const url: string = `${this.baseURL}/mesa/pedido/detalle/${id_pedido}`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        catchError( (err) => of(err.error.msg) )
      )
  }

  getBebidas(): Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/bebida/lista`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        catchError((err) => of(err.error.msg))
      )
  }

}
