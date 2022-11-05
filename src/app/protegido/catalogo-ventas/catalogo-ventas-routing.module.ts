import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';

const routes: Routes = [{

  path: '',
  children: [
  {

    path: 'gestion-producto',
    component: GestionProductosComponent,
    canActivate: [ ValidarTokenLoginGuard ]

  },
  {

    path: 'gestion-categoria',
    component: GestionCategoriaComponent,
    canActivate: [ ValidarTokenLoginGuard ]

  }

]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoVentasRoutingModule { }
