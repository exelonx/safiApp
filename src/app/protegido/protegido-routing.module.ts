import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { UsuarioComponent } from './seguridad/pages/usuario/usuario.component';
import { RecuperarContrasenaComponent } from '../auth/pages/recuperar-contrasena/recuperar-contrasena.component';
import { NuevoUsuarioComponent } from './seguridad/pages/nuevo-usuario/nuevo-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'pedido',
        loadChildren: () => import('../protegido/pedido/pedido.module').then( m => m.PedidoModule )
      },
      {
        path: 'seguridad',
        loadChildren: () => import('../protegido/seguridad/seguridad.module').then( m => m.SeguridadModule )
      },
      {
        path: "perfil",
        component: PerfilUsuarioComponent
      },
   /*    {

        path: "gestion-usuario",
        component: UsuarioComponent

      }, */
      {
        path: "nuevo-usuario",
        component: NuevoUsuarioComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtegidoRoutingModule { }
