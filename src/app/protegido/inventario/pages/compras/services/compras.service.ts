import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompraResp, Compra, DetalleCompra } from '../interfaces/compra.interfaces';
import { FormArray } from '@angular/forms';

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
    FECHA_MODIFICACION: new Date()
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

}
