import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PermisosPantallaService } from '../../services/permisos-pantalla.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarPantallaInsumoGuard implements CanActivate {

  constructor(private pantallaService: PermisosPantallaService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.pantallaService.validarPermiso(21)
      .pipe(
        tap((permiso: boolean) => {
          if (permiso !== true) {
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }

}
