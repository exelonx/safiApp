import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from './protegido/guards/validar-token-login.guard';
import { ValidarEstadoUsuarioGuard } from './protegido/guards/validar-estado-usuario.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'main',
    loadChildren: () => import('./protegido/protegido.module').then( m => m.ProtegidoModule ),
    // Guard de sesión por token
    canActivate: [ ValidarTokenLoginGuard, ValidarEstadoUsuarioGuard ],
    canLoad:     [ ValidarTokenLoginGuard, ValidarEstadoUsuarioGuard ],
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
