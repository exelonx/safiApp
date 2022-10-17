import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioResp } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getUsuarios (quienBusco: number, buscar?: string, limite?: string, desde?: string): Observable<UsuarioResp> {
    // Evitar enviar "undefined"
    if (!buscar) {
      buscar = ""
    }

    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/usuario/?buscar=${buscar}&quienBusco=${quienBusco}&limite=${!limite ? '' : limite}&desde=${!desde ? '' : desde }`;

    // Consumir API
    return this.http.get<UsuarioResp>(url)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  desactivarUsuario(id_usuario:number, quienModifico:number){
    const body = {quienModifico};
    // Url de la API de Bitacora
    const url: string = `${this.baseURL}/usuario/bloquear/${id_usuario}`;

    //Consumo de la API
    return this.http.put<UsuarioResp>(url, body)
      .pipe(
        catchError( err => of(err.error.msg))
      )
  }

  

}
