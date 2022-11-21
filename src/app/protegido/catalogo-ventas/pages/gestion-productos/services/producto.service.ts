import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto, ProductoResp } from '../interfaces/producto.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto = {
    ID: 0,
    ID_IMPUESTO: 0,
    ID_TIPO_PRODUCTO: 0,
    NOMBRE: "",
    PRECIO: 0,
    EXENTA: false,
    DESCRIPCION: "",
    FECHA_INICIO: new Date(),
    FECHA_FINAL: new Date(),
    SIN_ESTADO: false,
    BEBIDA: false,
    IMAGEN: new Blob,
    CREADO_POR: 0,
    MODIFICADO_POR: 0
  }

  productos: Producto[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }


  getProductos(id_usuario: number, buscar?: string, limite?: string, desde?: string): Observable<ProductoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/producto/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(resp => {
          this.productos = resp.productos!;
        }),
        catchError(err => of(err.error.msg))
      )

  }

  getProducto(id_producto: number): Observable<ProductoResp> {
    const url: string = `${this.baseURL}/unidad/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(resp => {
          this.producto = resp.producto!
          console.log(this.producto);
        }),
        catchError(err => of(err.error))
      )
  }

  postProducto(unidad_medida: string, nombre: string, id_usuario: number): Observable<ProductoResp> {

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)

    const url: string = `${this.baseURL}/producto/`;

    const body = {
      id_usuario,
      unidad_medida,
      nombre
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putProducto(id_producto: number ,id_impuesto: number, id_tipo_producto: number, nombre: string, precio: number, exenta: boolean, 
             descripcion: string, fecha_inicio: Date, fecha_final: Date, sin_estado: boolean, bebida: boolean, imagen: Blob , 
             id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/producto/actualizarProducto/${id_producto}`;

    const body = {

      id_usuario,
      id_impuesto,
      id_tipo_producto,
      nombre,
      precio,
      exenta,
      descripcion,
      fecha_inicio,
      fecha_final,
      sin_estado,
      bebida,
      imagen
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  deleteProducto(id_producto: number, quienElimina: number) {
    const url: string = `${this.baseURL}/producto/${id_producto}?quienElimina=${quienElimina}`

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
