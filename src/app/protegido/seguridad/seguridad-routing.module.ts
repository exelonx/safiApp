import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolComponent } from './pages/rol/rol.component';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { ParametroComponent } from './pages/parametro/parametro.component';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'pregunta',
        component: PreguntaComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'permiso',
        component: PermisoComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'parametro',
        component: ParametroComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: '**',
        redirectTo: 'usuario'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
