import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { ValidarPantallaGestionCategoriaGuard } from './guards/validar-pantalla-gestion-categoria.guard';
import { ValidarPantallaGestionProductoGuard } from './guards/validar-pantalla-gestion-producto.guard';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';
import { TipoImpuestoComponent } from './pages/tipo-impuesto/tipo-impuesto.component';
import { ValidarPantallaTipoImpuestoGuard } from './guards/validar-pantalla-tipo-impuesto.guard';

const routes: Routes = [{

  path: '',
  children: [
  {

    path: 'gestion-producto',
    component: GestionProductosComponent,
    canActivate: [ ValidarTokenLoginGuard ,ValidarPantallaGestionProductoGuard ]

  },
  {

    path: 'gestion-categoria',
    component: GestionCategoriaComponent,
    canActivate: [ ValidarTokenLoginGuard, ValidarPantallaGestionCategoriaGuard ]

  },
  {

    path: 'tipo-impuesto',
    component: TipoImpuestoComponent,
    canActivate: [ ValidarTokenLoginGuard, ValidarPantallaTipoImpuestoGuard ]

  },

]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoVentasRoutingModule { }
