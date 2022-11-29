import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { PedidoResp, Mesa, Pedido, ProductoAgregado, Detalle } from '../interfaces/pedido.interfaces';
import { Producto } from 'src/app/protegido/catalogo-ventas/pages/gestion-productos/interfaces/producto.interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  mesas: Mesa[] = [];
  pedidoSeleccionado: Pedido = {
    ID: 0,
    ID_USUARIO: 0,
    USUARIO: "",
    NOMBRE_USUARIO: "",
    ID_ESTADO: 0,
    ID_MESA: 0,
    NOMBRE: "",
    TIPO: "",
    ID_CAJA: 0,
    SUBTOTAL: 0.00,
    NOMBRE_CLIENTE: "",
    HORA_SOLICITUD: new Date(),
    HORA_FINALIZACION: new Date(),
    MODIFICADO_POR: "",
    FECHA_MODIFICACION: new Date()
  }

  detalleSeleccionado: Detalle = {
    ID: 0,
    ID_PEDIDO: 0,
    ID_PRODUCTO: 0,
    NOMBRE_PRODUCTO: "",
    PRECIO_PRODUCTO: 0.00,
    DESCRIPCION: "",
    ID_ESTADO: 0,
    ESTADO: "",
    COLOR: "",
    CANTIDAD: 0,
    PARA_LLEVAR: false,
    HORA: new Date,
    INFORMACION: "",
    TOTAL_IMPUESTO: "",
    PRECIO_DETALLE: "",
    PORCENTAJE_IMPUESTO: 0,
    ID_IMPUESTO: 0
  }

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
        catchError( (err) => of(err.error) )
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

  getUnDetallePedido( id_detalle: string ): Observable<PedidoResp>{
    // Url de la API
    const url: string = `${this.baseURL}/mesa/pedido/detalle/un/${id_detalle}`;

    return this.http.get<PedidoResp>(url)
      .pipe(
        tap(
          resp => {
            this.detalleSeleccionado = resp.detalle!
          }
        ),
        catchError( (err) => of(err.error.msg) )
      )
  }

  validarDetalle( id_detalle: number ): Observable<boolean>{
    // Url de la API
    const url: string = `${this.baseURL}/mesa/pedido/detalle/un/${id_detalle}`;

    return this.http.get<boolean>(url)
      .pipe(
        map( resp => {
          return true
        }),
        catchError( (err) => of(false) )
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

  postDetalle(arregloProductos: ProductoAgregado[], id_pedido: number, id_usuario: number):Observable<PedidoResp> {
    // Url de la API
    const url: string = `${this.baseURL}/mesa/detalle`;
    const body = {
      arregloProductos,
      id_pedido,
      id_usuario
    }

    return this.http.post<PedidoResp>(url,body)
      .pipe(
        catchError((err) => of(err.error))
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

  deleteUnDetalle(id_detalle: number, id_usuario: number, razon: string):Observable<PedidoResp> {

    const url: string = `${this.baseURL}/mesa/detalle/${id_detalle}`;

    const body = {
      id_usuario,
      razon
    }

    return this.http.post<PedidoResp>(url,body)
      .pipe(
        catchError((err) => of(err.error))
      )
  }

  deletePedido(id_pedido: number, id_usuario: number, razon: string):Observable<PedidoResp> {

    console.log(id_pedido)
    const url: string = `${this.baseURL}/mesa/pedido/${id_pedido}`;

    const body = {
      id_usuario,
      razon
    }

    return this.http.post<PedidoResp>(url,body)
      .pipe(
        catchError((err) => of(err.error))
      )
  }

  getReporte(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/pedido/reporteria/pedido`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

}
