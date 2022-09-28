import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenPreguntaGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    
    // Extraer el token de la ruta
    const { token } = route.params;

    // Validar Token
    return this.authService.validarPantallaRecuperacion( token, 'validar-token-pregunta' )
      .pipe(
        tap( (valido: any) => {
          const { ok, msg } = valido;
          console.log(valido)
          if( !ok ) {
            Swal.fire('Acceso inválido', msg, 'info')
            this.router.navigateByUrl('/auth/login')
          }
        })
      )
  }

}
