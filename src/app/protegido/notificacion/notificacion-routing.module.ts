import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';

const routes: Routes = [{
  path: '',
  component: NotificacionesComponent,
  children: [
    {
      path: ':notificacion',
      component: NotificacionComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificacionRoutingModule { }
