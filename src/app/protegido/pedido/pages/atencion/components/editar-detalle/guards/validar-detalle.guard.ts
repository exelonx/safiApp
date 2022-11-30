import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PedidoService } from '../../../services/pedido.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarDetalleGuard implements CanActivate {

  constructor( private pedidoService: PedidoService,
    private router: Router ) {}
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const {id_detalle} = route.params

    return this.pedidoService.validarDetalle(id_detalle)
      .pipe(
        tap( (valido: boolean | any) => {

          if( valido === false ){
            this.router.navigateByUrl('/main/pedido/atencion')
          } else {
          }
        })
      )
  }
  
}
