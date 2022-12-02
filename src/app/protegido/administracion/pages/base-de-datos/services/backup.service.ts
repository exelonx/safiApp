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
  
}
