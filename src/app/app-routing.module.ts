import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from './protegido/guard/validar-token-login.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'main',
    loadChildren: () => import('./protegido/protegido.module').then( m => m.ProtegidoModule ),
    // Guard de sesión por token
    canActivate: [ ValidarTokenLoginGuard ],
    canLoad:     [ ValidarTokenLoginGuard ],
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
