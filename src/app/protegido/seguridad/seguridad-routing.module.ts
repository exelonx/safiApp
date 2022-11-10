import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolComponent } from './pages/rol/rol.component';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { ParametroComponent } from './pages/parametro/parametro.component';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { ValidarPantallaPermisoGuard } from './guards/validar-pantalla-permiso.guard';
import { ValidarPantallaParametroGuard } from './guards/validar-pantalla-parametro.guard';
import { ValidarPantallaPreguntaGuard } from './guards/validar-pantalla-pregunta.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaParametroGuard ]
      },
      {
        path: 'pregunta',
        component: PreguntaComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaPreguntaGuard ]
      },
      {
        path: 'permiso',
        component: PermisoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaPermisoGuard ]
      },
      {
        path: 'parametro',
        component: ParametroComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaParametroGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
