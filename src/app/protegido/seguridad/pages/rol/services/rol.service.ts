import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from 'rxjs';
import { environment } from "src/environments/environment";
import { RolResp, Rol } from "../interfaces/rolItems.interface"; 
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class RolService{

    roles: Rol[] = [];

    private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getRoles(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<RolResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/rol/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<RolResp>(url)
        .pipe(
            tap( resp => {
                this.roles = resp.roles!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

    actualizarRol(id_rol: number, rol: string, descripcion: string, id_usuario: number) {
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
    }

    crearRol(rol: string, descripcion: string, id_usuario: number) {
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

    eliminarRol(id_rol: number, quienElimina: number) {
        const url: string = `${this.baseURL}/rol/${id_rol}?quienElimina=${quienElimina}`

        return this.http.delete(url)
            .pipe(
                catchError(err => of(err.error.msg))
            )
            
    }

    getReporte( buscar: string = "" ) {
        // Url de la API de Bitacora
        const url: string = `${this.baseURL}/reporteria/rol`;
    
        const body = {
          buscar
        }
    
        return this.http.post(url, body, { responseType: 'blob'})
          .pipe(
            catchError(err => of(err.error.msg))
        )
          
    }

} 