import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompraResp, Compra, DetalleCompra } from '../interfaces/compra.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  compra: Compra = {
    ID: 0,
    ID_PROVEEDOR: 0,
    PROVEEDOR: '',
    TOTAL_PAGADO: 0.00,
    FECHA: new Date(),
    CREADO_POR: '',
    FECHA_CREACION: new Date(),
    MODIFICADO_POR: '',
    FECHA_MODIFICACION: new Date(),
    detalle: []
  }

  detalleCompra: DetalleCompra[] = [];

  compras: Compra[] = [];

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getCompras(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<CompraResp>{

    // Evitar enviar "undefined"
    if (!buscar) {
        buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<CompraResp>(url)
    .pipe(
        tap( resp => {
            this.compras = resp.compras!;
        }),
        catchError(err => of(err.error.msg))
    )
    
  }

  getUnaCompra(id_compra: number):Observable<CompraResp> {
    const url: string = `${this.baseURL}/compra/${id_compra}`;

    return this.http.get<CompraResp>(url)
      .pipe(
        tap( resp => {
          this.compra = resp.compra!
          this.detalleCompra = resp.detalleCompra!
        }),
        catchError(err => of(err.error))
      )
  }

  postCompra(id_usuario: number, id_proveedor: number, arregloDetalle: [], total: string): Observable<CompraResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    
    const url: string = `${this.baseURL}/compra/ingreso/insumos/`;
    
    const body = {
      id_usuario,
      id_proveedor,
      arregloDetalle,
      total
    }

    return this.http.post<CompraResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putMasInsumosEnDetalle(arregloDetalle: [], total: string, id_compra: number): Observable<CompraResp> {

    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/editar/ingreso/${id_compra}`;
    
    const body = {
      arregloDetalle,
      total
    }

    return this.http.post<CompraResp>(url, body, {headers})
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putDetalle(id_detalle: number, nuevo_insumo: number, nueva_cantidad: number, nuevo_precio: number): Observable<CompraResp> {
    
    const headers = new HttpHeaders()
      .set( 'x-token', localStorage.getItem('token') || '' );
      
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/editar/detalle/${id_detalle}`;
    
    const body = {
      nuevo_insumo,
      nueva_cantidad,
      nuevo_precio
    }

    return this.http.put<CompraResp>(url, body, {headers})
    .pipe(
      catchError(err => of(err.error))
    )
  }

  deleteItemDetalle(id_detalle: number) {
    const headers = new HttpHeaders()
    .set( 'x-token', localStorage.getItem('token') || '' );
    
    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/editar/detalle/${id_detalle}`;

    return this.http.delete<CompraResp>(url, {headers})
    .pipe(
      catchError(err => of(err.error))
    )
  }

  putNombreProveedor(id_proveedor: number, id_compra: number, uid: number) {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/editar/proveedor/${id_compra}`;

    const body = {
      id_proveedor,
      uid
    }

    return this.http.put<CompraResp>(url, body)
    .pipe(
      catchError(err => of(err.error))
    )

  }

  anularCompra(id_compra: number, id_usuario: number) {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/compra/anular/${id_compra}`;

    const body = {
      id_usuario
    }

    return this.http.put<CompraResp>(url, body)
    .pipe(
      catchError(err => of(err.error))
    )
  }

  getReporte(buscar: string = "", id_usuario: number ) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/compra/reporteria/compraInsumo`;

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
