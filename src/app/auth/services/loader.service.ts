import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  enEjecucion: boolean = false;

  ejecutandoLogin(bool: boolean): Observable<boolean> {
    return of(bool).pipe(
      tap( resp => {
        this.enEjecucion = resp
      })
    );
  }

  constructor() { }
}
