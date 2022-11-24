import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { MainComponent } from '../main/main.component';
import { AtencionComponent } from './pages/atencion/atencion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { ValidarCajaGuard } from './guards/validar-caja.guard';
import { EstadoComponent } from './pages/estado/estado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'atencion',
        component: AtencionComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarCajaGuard ]
      },
      {
        path: 'cocina',
        component: CocinaComponent
      },
      {
        path: 'estado',
        component: EstadoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarCajaGuard ]
      },
      {
        path: '**',
        redirectTo: 'atencion'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
