import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { BackupRest } from '../interface/backup.interface';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getParametros():Observable<BackupRest>{
    const url: string = `${this.baseURL}/db-backup/`;

    return this.http.get<BackupRest>(url)
      .pipe(
        catchError(err => of(err.error))
      )
  }

  getValidarConexion(servidor: string, base: string, usuario: string, contrasena: string):Observable<BackupRest>{

    const url: string = `${this.baseURL}/db-backup/validar-conexion?servidor=${servidor}&usuario=${usuario}&contrasena=${contrasena}&base=${base}`;

    return this.http.get<BackupRest>(url)
      .pipe(
        catchError(err => of(err.error))
      )
  }

  getBackup(id_usuario: number, nombreBackup: string = "backup", ubicacion: string = "") {

    if(!ubicacion) {
      ubicacion = ""
    }

    const url: string = `${this.baseURL}/db-backup/subir`;

    const body = {
      nombreBackup,
      ubicacion,
      id_usuario
    }

    return this.http.post(url, body, {observe: 'response', responseType: 'blob'})
      .pipe(
        catchError(err => of(err.error))
      )
  }
  
}
