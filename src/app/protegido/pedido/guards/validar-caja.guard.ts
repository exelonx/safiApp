import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { CajaGuardService } from '../services/caja-guard.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarCajaGuard implements CanActivate {

  constructor( private cajaValidar: CajaGuardService,
    private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.cajaValidar.validarCaja()
      .pipe(
        tap( (permiso: boolean) => {
          if( permiso !== true ) {
            Swal.fire({
              title: 'Acceso inválido',
              text: 'Se necesita abrir la caja para acceder a la pantalla',
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
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }
  
}
