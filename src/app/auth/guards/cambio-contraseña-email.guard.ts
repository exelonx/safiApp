import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CambioContraseñaEmailGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    // Extraer el token de la ruta
    const { token } = route.params;

    // Validar Token
    return this.authService.validarPantallaRecuperacion( token, 'validar-token-correo' )
      .pipe(
        tap( (valido: any) => {
          console.log( valido )
          if( !valido.ok ) {
            Swal.fire('Acceso inválido', valido.msg, 'info')
            this.router.navigateByUrl('/auth/login')
          }
        })
      )
  }
  
}
