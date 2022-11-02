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

          // Si no es válido, lanzar error y sacar de la pantalla
          if( !valido.ok ) {
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
            this.router.navigateByUrl('/auth/login')
          }
          
        })
      )
  }
  
}
