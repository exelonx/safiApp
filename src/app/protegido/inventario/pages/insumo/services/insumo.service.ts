import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Insumo, InsumoResp } from '../interfaces/insumo.interface';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  insumos: Insumo[] = []; 

  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getInsumos(quienBusco: number, buscar?: string, limite?: string, desde?: string):Observable<InsumoResp>{

    // Evitar enviar "undefined"
    if (!buscar) {
        buscar = ""
    }

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/insumo/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde}`;

    // Consumir API cambiar el .get<>
    return this.http.get<InsumoResp>(url)
    .pipe(
        tap( resp => {
            this.insumos = resp.insumos!;
        }),
        catchError(err => of(err.error.msg))
    )

}
}
