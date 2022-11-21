import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria, CategoriaResp } from '../interfaces/categoriaItems.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categorias: Categoria[] = [];

  private baseURL: string = environment.baseURL;

    constructor( private http: HttpClient ) { }

    getCategorias(id_usuario: number, buscar?: string, limite?: string, desde?: string):Observable<CategoriaResp>{

        // Evitar enviar "undefined"
        if (!buscar) {
            buscar = ""
        }

        // Url de la API de Parametro (Cambiar el /parametro/?buscar)
        const url: string = `${this.baseURL}/catalogo-venta/?buscar=${buscar}&id_usuario=${id_usuario}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

        // Consumir API cambiar el .get<>
        return this.http.get<CategoriaResp>(url)
        .pipe(
            tap( resp => {
                this.categorias = resp.catalogos!;
            }),
            catchError(err => of(err.error.msg))
        )

    }

    actualizarCatalogo(id: number, nombre_catalogo: string, id_usuario: number) {
        // Url de la API de Parametro (Cambiar el /rol/?buscar)
        const url: string = `${this.baseURL}/catalogo-venta/editar-catalogo/${id}`;

        const body = {
            nombre_catalogo,
            id_usuario
        }

        return this.http.put(url, body)
        .pipe(
            catchError(err => of(err.error.msg))
        )
    }

}
