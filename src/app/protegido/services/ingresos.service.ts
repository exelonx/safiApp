import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  // Dirección de las API's
  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  eventoIngreso( id_usuario: number, idPantalla: number ) {

    // Url de la apí
    const url: string = `${this.baseURL}/bitacora/ingreso`

    const body = {
      id_usuario,
      idPantalla
    }

    // Consumo
    return this.http.post(url, body)
      .pipe(
        catchError( err => of(err.error))
      );

  }
  
}
