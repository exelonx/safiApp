import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { ValidarPantallaGestionCategoriaGuard } from './guards/validar-pantalla-gestion-categoria.guard';
import { ValidarPantallaGestionProductoGuard } from './guards/validar-pantalla-gestion-producto.guard';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';

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

]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoVentasRoutingModule { }
