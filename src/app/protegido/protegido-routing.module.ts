import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './seguridad/pages/usuario/usuario.component';

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

        path: "gestion-usuario",
        component: UsuarioComponent

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
