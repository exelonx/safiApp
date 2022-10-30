import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionRoutingModule } from './notificacion-routing.module';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { NgMaterialModule } from 'src/app/ng-material/ng-material.module';


@NgModule({
  declarations: [
    NotificacionesComponent,
    NotificacionComponent
  ],
  imports: [
    CommonModule,
    NotificacionRoutingModule,
    NgMaterialModule
  ]
})
export class NotificacionModule { }
