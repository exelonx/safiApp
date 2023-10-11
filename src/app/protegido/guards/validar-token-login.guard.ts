import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { tap } from 'rxjs/operators';
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
          Swal.fire({
            title: 'Acceso inválido',
            text: valido.msg,
            icon: 'info',
            iconColor: 'white',
            background: '#3fc3ee',
            color: 'white',
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 4500,
            timerProgressBar: true,
          })
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
          Swal.fire({
            title: 'Acceso inválido',
            text: valido.msg,
            icon: 'info',
            iconColor: 'white',
            background: '#3fc3ee',
            color: 'white',
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 4500,
            timerProgressBar: true,
          })
        }
      })
    );
  }
}
