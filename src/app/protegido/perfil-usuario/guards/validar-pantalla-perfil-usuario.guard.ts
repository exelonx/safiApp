import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree, CanLoad } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PermisosPantallaService } from '../../services/permisos-pantalla.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarPantallaPerfilUsuarioGuard implements CanActivate, CanLoad {

  constructor( private pantallaService: PermisosPantallaService,
    private router: Router ) {}
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.pantallaService.validarPermiso(13)
      .pipe(
        tap( (permiso: boolean) => {
          if( permiso !== true ) {
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.pantallaService.validarPermiso(13)
      .pipe(
        tap((permiso: boolean) => {
          if (permiso !== true) {
            this.router.navigateByUrl('/main/dashboard')
          }
        })
      );
  }
  
}
