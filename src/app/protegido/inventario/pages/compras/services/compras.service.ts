import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompraResp, Compra } from '../interfaces/compra.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

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
            this.compras = resp.compra!;
        }),
        catchError(err => of(err.error.msg))
    )

}
}
