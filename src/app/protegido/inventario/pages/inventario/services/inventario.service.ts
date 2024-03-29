import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { RolResp } from "src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface";
import { environment } from "src/environments/environment";
import { Inventario, InventarioResp } from '../interfaces/inventario.interface';

@Injectable({
    providedIn: 'root'
})

export class inventarioService {

    inventarios: Inventario[] = [];

    private baseURL: string = environment.baseURL;

    constructor(private http: HttpClient) { }

    getInventario(id_usuario: number, buscar?: string, limite?: string, desde?: string): Observable<InventarioResp> {

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/inventario/?buscar=${buscar}&quienBusco=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<InventarioResp>(url)
            .pipe(
                tap(resp => {
                    this.inventarios = resp.inventarios!;
                }),
                catchError(err => of(err.error.msg))
            )

    }

    /* actualizarRol(id_rol: number, rol: string, descripcion: string, id_usuario: number) {
        // Url de la API de Parametro (Cambiar el /rol/?buscar)
        const url: string = `${this.baseURL}/rol/${id_rol}`;

        const body = {
            rol,
            descripcion,
            id_usuario
        }

        return this.http.put(url, body)
        .pipe(
            catchError(err => of(err.error.msg))
        )
    } */

    /* crearRol(rol: string, descripcion: string, id_usuario: number) {
        const url: string = `${this.baseURL}/rol/`

        const body = {
            rol,
            descripcion,
            id_usuario
        }

        return this.http.post(url, body)
            .pipe(
                catchError(err => of(err.error.msg))
            )
    }
 */
    /* eliminarRol(id_rol: number, quienElimina: number) {
        const url: string = `${this.baseURL}/rol/${id_rol}?quienElimina=${quienElimina}`

        return this.http.delete(url)
            .pipe(
                catchError(err => of(err.error.msg))
            )
            
    } */

    getReporte(buscar: string = "", id_usuario: number) {
        // Url de la API de Bitacora
        const url: string = `${this.baseURL}/inventario/reporteria/inventario`;

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