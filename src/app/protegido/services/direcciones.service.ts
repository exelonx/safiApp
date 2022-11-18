import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Departamento } from '../interfaces/departamento.interface';
import { direccionRes } from '../interfaces/direccion.interface';

@Injectable({
  providedIn: 'root'
})

export class DireccionesService {

  // Dirección de las API's
  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getDepartamentos(): Observable<direccionRes>{

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/direccion`;

    // Consumir API cambiar el .get<>
    return this.http.get<direccionRes>(url)
    .pipe(
        
    )

  }

  getMunicipios(id_departamento:number){

    // Url de la API de Parametro (Cambiar el /parametro/?buscar)
    const url: string = `${this.baseURL}/direccion/municipios/${id_departamento}`;

    // Consumir API cambiar el .get<>
    return this.http.get<direccionRes>(url)
    .pipe(
        
    )

  }

}
