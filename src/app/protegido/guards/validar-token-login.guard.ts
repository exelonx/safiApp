import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenLoginGuard implements CanActivate, CanLoad {

  constructor( private authService: AuthService,
               private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    return this.authService.revalidarToken()
    .pipe(
      tap( (valido: boolean | any) => {

        if( valido !== true ){
          this.router.navigateByUrl('/auth')
          if( valido.cod === 'T-401' ) {

            Swal.fire('Acceso inválido', valido.msg, 'info')

          }
        }
      })
    );
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {

    return this.authService.revalidarToken()
    .pipe(
      tap( (valido: boolean | any) => {

        if( valido !== true ){
          this.router.navigateByUrl('/auth')
          if( valido.cod === 'T-401' ) {

            Swal.fire('Acceso inválido', valido.msg, 'info')

          }
        }
      })
    );
  }
}
