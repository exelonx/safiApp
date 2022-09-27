import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PreguntaSecretaComponent } from './pages/pregunta-secreta/pregunta-secreta.component';
import { CambioPorCorreoComponent } from './pages/cambio-por-correo/cambio-por-correo.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'cambio-contrasena/:token',
        component: CambioPorCorreoComponent
      },
      {
        path: 'pregunta-secreta/:token',
        component: PreguntaSecretaComponent
      },
      {
        path: 'registro',
        component: RegistroComponent
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
