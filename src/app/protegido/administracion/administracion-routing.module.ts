import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BaseDeDatosComponent } from './pages/base-de-datos/base-de-datos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'bitacora',
        component: BitacoraComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'base-de-datos',
        component: BaseDeDatosComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
