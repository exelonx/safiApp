import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { CambioContrasenaComponent } from './pages/cambio-contrasena/cambio-contrasena.component';
import { RecuperarPorCorreoComponent } from './pages/recuperar-por-correo/recuperar-por-correo.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';
import { PreguntaSecretaComponent } from './pages/pregunta-secreta/pregunta-secreta.component';

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
        path: 'cambio-contrasena',
        component: CambioContrasenaComponent
      },
      {
        path: 'recuperar-contrasena',
        component: RecuperarContrasenaComponent
      },
      {
        path: 'recuperar-por-correo',
        component: RecuperarPorCorreoComponent
      },
      {
        path: 'pregunta-secreta',
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
