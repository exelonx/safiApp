import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { ProveedorResp, Proveedor } from "../interfaces/proveedorItems.interface";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ProveedorService{

    proveedores: Proveedor[] = [];
    proveedor: Proveedor = {

        ID: 0,
        NOMBRE: "",
        ID_DIRECCION: 0,
        DETALLE: "",
        ID_MUNICIPIO: 0,
        MUNICIPIO: "",
        ID_DEPARTAMENTO: 0,
        DEPARTAMENTO: "",
        TELEFONO: "",
        CREADO_POR: "",
        FECHA_CREACION: new Date(),
        MODIFICACION_POR: "",
        FECHA_MODIFICACION: new Date(),

    };

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getProveedores(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<ProveedorResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/proveedor/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<ProveedorResp>(url)
        .pipe(
            tap( resp => {
                this.proveedores = resp.proveedores!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

    actualizarProveedor(id: number, nombre: string, direccion: string, id_direccion:number, id_departamento: number, id_municipio: number, telefono: string, id_usuario: number) {
        // Url de la API de Parametro (Cambiar el /rol/?buscar)
        const url: string = `${this.baseURL}/proveedor/actualizar-proveedor/${id}?id_usuario=${id_usuario}`;

        const body = {
            nombre,
            direccion,
            id_direccion,
            id_departamento, 
            id_municipio,
            telefono
            
        }

        return this.http.put(url, body)
        .pipe(
            catchError(err => of(err.error.msg))
        )
    }

    crearProveedor(nombre: string, id_municipio: number, detalle: string, telefono: string, id_usuario: number) {
        const url: string = `${this.baseURL}/proveedor/`

        const body = {
            nombre,
            id_municipio,
            detalle,
            telefono,
            id_usuario
        }

        return this.http.post(url, body)
            .pipe(
                catchError(err => of(err.error.msg))
            )
    }


    eliminarRol(id: number, quienElimina: number) {
        const url: string = `${this.baseURL}/proveedor/${id}?quienElimina=${quienElimina}`

        return this.http.delete(url)
        .pipe(
            catchError(err => of(err.error.msg))
        )
            
    }

    getUnProveedor(id: number):Observable<ProveedorResp> {
        const url: string = `${this.baseURL}/proveedor/${id}`;
    
        return this.http.get<ProveedorResp>(url)
          .pipe(
            tap( resp => {
              this.proveedor = resp.proveedor!
            }),
            catchError(err => of(err.error))
          )
    }

    getReporte( buscar: string = "", id_usuario: number) {
        // Url de la API de Bitacora
        const url: string = `${this.baseURL}/proveedor/reporteria/proveedor`;
    
        const body = {
          buscar,
          id_usuario
        }
    
        return this.http.post(url, body, { responseType: 'blob'})
          .pipe(
            catchError(err => of(err.error.msg))
          )
          
    }

}