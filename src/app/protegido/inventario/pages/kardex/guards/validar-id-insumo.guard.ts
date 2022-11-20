import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { KardexService } from '../services/kardex.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarIdInsumoGuard implements CanActivate {

  constructor( private kardexService: KardexService,
    private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const {id_insumo} = route.params
    return this.kardexService.validarIdInsumoKardex(id_insumo)
      .pipe(
        tap( (valido: boolean | any) => {
          if( valido === false ){
            this.router.navigateByUrl('/main/inventario/insumo')
          }
        })
      )
      
  }
  
}
