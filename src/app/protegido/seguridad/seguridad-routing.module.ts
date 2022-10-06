import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolComponent } from './pages/rol/rol.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { ParametroComponent } from './pages/parametro/parametro.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'rol',
        component: RolComponent
      },
      {
        path: 'pregunta',
        component: PreguntaComponent
      },
      {
        path: 'permiso',
        component: PermisoComponent
      },
      {
        path: 'parametro',
        component: ParametroComponent
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
