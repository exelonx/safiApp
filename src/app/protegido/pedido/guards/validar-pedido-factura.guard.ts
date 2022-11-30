import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FacturacionService } from '../pages/factura/services/facturacion.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarPedidoFacturaGuard implements CanActivate {

  constructor( private facturaService: FacturacionService,
    private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const {id_pedido} = route.params
    
    return this.facturaService.validarPedido(id_pedido)
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
