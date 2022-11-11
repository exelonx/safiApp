import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { ValidarTokenLoginGuard } from './guards/validar-token-login.guard';
import { ValidarPantallaNotificacionGuard } from './notificacion/guards/validar-pantalla-notificacion.guard';
import { ValidarPantallaPerfilUsuarioGuard } from './perfil-usuario/guards/validar-pantalla-perfil-usuario.guard';

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
        path: 'inventario',
        loadChildren: () => import('../protegido/inventario/inventario.module').then( m => m.InventarioModule )
      },
      {
        path: 'seguridad',
        loadChildren: () => import('../protegido/seguridad/seguridad.module').then( m => m.SeguridadModule )
      },
      {
        path: 'administracion',
        loadChildren: () => import('../protegido/administracion/administracion.module').then( m => m.AdministracionModule )
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('../protegido/notificacion/notificacion.module').then( m => m.NotificacionModule ),
        canActivate: [ValidarTokenLoginGuard,ValidarPantallaNotificacionGuard],
        canLoad: [ValidarTokenLoginGuard,ValidarPantallaNotificacionGuard]
      },
      {
        path: "perfil",
        component: PerfilUsuarioComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaPerfilUsuarioGuard ],
        canLoad: [ValidarTokenLoginGuard, ValidarPantallaPerfilUsuarioGuard]
      },
      {
        path: "catalogo",
        loadChildren: () => import('../protegido/catalogo-ventas/catalogo-ventas.module').then( m => m.CatalogoVentasModule )

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
