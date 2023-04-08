import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto, ProductoResp, InsumoProducto, ProductoCombo, PromocionProducto, CatalogoProducto } from '../interfaces/producto.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto = {
    ID: 0,
    ID_IMPUESTO: 0,
    PORCENTAJE: 0,
    ID_TIPO_PRODUCTO: 0,
    NOMBRE: "",
    PRECIO: 0,
    EXENTA: false,
    DESCRIPCION: "",
    FECHA_INICIO: new Date(),
    FECHA_FINAL: new Date(),
    ESTADO: false,
    SIN_ESTADO: false,
    BEBIDA: false,
    IMAGEN: new Blob,
    CREADO_POR: '',
    FECHA_CREACION: new Date(),
    MODIFICACION_POR: '',
    FECHA_MODIFICACION: new Date()
  }

  catalogoProducto: CatalogoProducto[] = [];

  insumoProducto: InsumoProducto[] = [];

  comboProducto: ProductoCombo[] = [];

  promoProducto: PromocionProducto[] = [];

  productos: Producto[] = [];

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getTipoProducto(): Observable<ProductoResp> {
    const url: string = `${this.baseURL}/tipo-producto/`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  getProductos(id_Tipo_Producto: number, id_usuario: number, buscar?: string, limite?: string, desde?: string): Observable<ProductoResp> {

    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/producto/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}&idTipoProducto=${!id_Tipo_Producto ? '' : id_Tipo_Producto}`;

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
    const url: string = `${this.baseURL}/producto/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(resp => {
          this.producto = resp.producto!
        }),
        catchError(err => of(err.error))
      )
  }

  postProducto(id_usuario: number, nombre: string, precio: number, impuesto: number, descripcion: string,
    exenta: boolean, esBebida: boolean, sinEstado: boolean, arregloInsumo: [],
    arregloCategoria: []): Observable<ProductoResp> {

    const url: string = `${this.baseURL}/producto/`;

    const body = {
      id_usuario,
      nombre,
      precio,
      impuesto,
      descripcion,
      exenta,
      esBebida,
      sinEstado,
      arregloInsumo,
      arregloCategoria
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  postCombo(id_usuario: number, nombre: string, precio: number, impuesto: number, descripcion: string,
    sinEstado: boolean, arregloProductos: [],
    arregloCategoria: []): Observable<ProductoResp> {

    const url: string = `${this.baseURL}/producto/combo/`;

    const body = {
      id_usuario,
      nombre,
      precio,
      impuesto,
      descripcion,
      sinEstado,
      arregloProductos,
      arregloCategoria
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  postPromocion(id_usuario: number, nombre: string, precio: number, impuesto: number, descripcion: string,
    sinEstado: boolean, fecha_inicio: Date, fecha_final: Date,
    arregloProductos: [], arregloCategoria: []): Observable<ProductoResp> {

    const url: string = `${this.baseURL}/producto/promocion/`;

    const body = {
      id_usuario,
      nombre,
      precio,
      impuesto,
      descripcion,
      sinEstado,
      fecha_inicio,
      fecha_final,
      arregloProductos,
      arregloCategoria
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  deleteProducto(id_producto: number, quienElimina: number) {
    const url: string = `${this.baseURL}/producto/${id_producto}?quienElimina=${quienElimina}`

    return this.http.delete(url)
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  putProducto(id_producto: number, id_impuesto: number, id_tipo_producto: number, porcentaje: number, nombre: string, precio: number,
    exenta: boolean, descripcion: string, fecha_inicio: Date, fecha_final: Date, sin_estado: boolean, bebida: boolean, imagen: Blob,
    creado_por: string, fecha_creacion: Date, id_usuario: number) {
    // Url de la API de Parametro (Cambiar el /rol/?buscar)
    const url: string = `${this.baseURL}/producto/actualizarProducto/${id_producto}`;

    const body = {

      id_usuario,
      id_impuesto,
      porcentaje,
      id_tipo_producto,
      nombre,
      precio,
      exenta,
      descripcion,
      fecha_inicio,
      fecha_final,
      sin_estado,
      bebida,
      imagen,
      creado_por,
      fecha_creacion
    }

    return this.http.put(url, body)
      .pipe(
        catchError(err => of(err.error.msg))
      )
  }

  getReporteProducto(buscar: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/reporteria/producto`;

    const body = {
      buscar,
      id_usuario
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getReporteCombo(buscar: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/reporteria/combo`;

    const body = {
      buscar,
      id_usuario
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getReportePromocion(buscar: string = "", id_usuario: number) {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/reporteria/promocion`;

    const body = {
      buscar,
      id_usuario
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getComboProducto(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/reporteria/combo`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  getInsumoProducto(id_producto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/insumo-producto/insumos/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(
          resp => {
            this.insumoProducto = resp.insumoProducto!
          }
        ),
        catchError(err => of(err.error.msg))
      )

  }

  getCatalogoProducto(id_producto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/catalogo/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(
          resp => {
            this.catalogoProducto = resp.catalogoProducto!
          }
        ),
        catchError(err => of(err.error.msg))
      )

  }

  getComboProductoLista(id_producto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/combo/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(
          resp => {
            this.comboProducto = resp.comboProducto!
          }
        ),
        catchError(err => of(err.error.msg))
      )

  }

  getPromoProductoLista(id_producto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/promo/${id_producto}`;

    return this.http.get<ProductoResp>(url)
      .pipe(
        tap(
          resp => {
            this.promoProducto = resp.promocionProducto!
          }
        ),
        catchError(err => of(err.error.msg))
      )

  }

  getPromocionProducto(buscar: string = "") {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/reporteria/promocion`;

    const body = {
      buscar
    }

    return this.http.post(url, body, { responseType: 'blob' })
      .pipe(
        catchError(err => of(err.error.msg))
      )

  }

  putInfoProducto(id_usuario: number, id_producto: number, nombre: string, precio: number, id_impuesto: number, descripcion: string, estado: boolean, bebida?: boolean, exento?: boolean, fecha_inicio?: Date, fecha_final?: Date): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/${id_producto}`;

    const body = {
      nombre,
      precio,
      id_impuesto,
      descripcion,
      estado,
      bebida,
      exento,
      fecha_final,
      fecha_inicio,
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putInsumoProducto(id_usuario: number, id_insumoDetalle: number, nuevo_insumo: number, nueva_cantidad: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/insumo-producto/${id_insumoDetalle}`;

    const body = {
      nuevo_insumo,
      nueva_cantidad,
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putComboProducto(id_usuario: number, id_comboDetalle: number, nuevo_producto: number, nueva_cantidad: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/combo-producto/${id_comboDetalle}`;

    const body = {
      nuevo_producto,
      nueva_cantidad,
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putPromoProducto(id_usuario: number, id_promoDetalle: number, nuevo_producto: number, nueva_cantidad: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/promo-producto/${id_promoDetalle}`;

    const body = {
      nuevo_producto,
      nueva_cantidad,
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putCategoriaProducto(id_usuario: number, id_catalogoProducto: number, nueva_categoria: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/categoria-producto/${id_catalogoProducto}`;

    const body = {
      nueva_categoria,
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putMasCategoriaProducto(id_usuario: number, id_producto: number, arregloCatalogo: []): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/categoria-producto/add/${id_producto}`;

    const body = {
      arregloCatalogo,
      id_usuario
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putMasInsumoProducto(id_usuario: number, id_producto: number, arregloInsumo: []): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/insumo-producto/add/${id_producto}`;

    const body = {
      arregloInsumo,
      id_usuario
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putMasComboProducto(id_usuario: number, id_producto: number, arregloProducto: []): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/combo-producto/add/${id_producto}`;

    const body = {
      arregloProducto,
      id_usuario
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  putMasPromoProducto(id_usuario: number, id_producto: number, arregloProducto: []): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/promo-producto/add/${id_producto}`;

    const body = {
      arregloProducto,
      id_usuario
    }

    return this.http.post<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  deleteInsumoProducto(id_usuario: number, id_insumoProducto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/insumo-producto/delete/${id_insumoProducto}`;

    const body = {
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  deleteComboProducto(id_usuario: number, id_ComboProducto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/combo-producto/delete/${id_ComboProducto}`;

    const body = {
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  deletePromoProducto(id_usuario: number, id_PromoProducto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/promo-producto/delete/${id_PromoProducto}`;

    const body = {
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }

  deleteCategoriaProducto(id_usuario: number, id_CategoriaProducto: number): Observable<ProductoResp> {
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/producto/categoria-producto/delete/${id_CategoriaProducto}`;

    const body = {
      id_usuario
    }

    return this.http.put<ProductoResp>(url, body)
      .pipe(
        catchError(err => of(err.error))
      )

  }
}
