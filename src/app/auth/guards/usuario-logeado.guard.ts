import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLogeadoGuard implements CanActivate {

  constructor( private authService: AuthService,
    private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.revalidarToken()
      .pipe(
        tap( (valido: boolean | any) => {
          if( valido === true ){
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }
  
}
