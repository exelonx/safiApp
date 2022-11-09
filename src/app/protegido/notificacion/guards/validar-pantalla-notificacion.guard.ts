import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PermisosPantallaService } from '../../services/permisos-pantalla.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarPantallaNotificacionGuard implements CanActivate, CanLoad {
  
  constructor(private pantallaService: PermisosPantallaService,
  private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.pantallaService.validarPermiso(19)
      .pipe(
        tap((permiso: boolean) => {
          if (permiso !== true) {
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.pantallaService.validarPermiso(19)
      .pipe(
        tap((permiso: boolean) => {
          if (permiso !== true) {
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }
}
