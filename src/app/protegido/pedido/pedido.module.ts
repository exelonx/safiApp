import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { AtencionComponent } from './pages/atencion/atencion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { BarraEstadoComponent } from './pages/atencion/components/barra-estado/barra-estado.component';
import { CrearPedidoComponent } from './pages/atencion/components/crear-pedido/crear-pedido.component';
import { MesasComponent } from './pages/atencion/components/mesas/mesas.component';
import { NgMaterialModule } from '../../ng-material/ng-material.module';
import { TablaAtencionComponent } from './pages/atencion/components/tabla-atencion/tabla-atencion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EstadoComponent } from './pages/estado/estado.component';

@NgModule({
  declarations: [
    AtencionComponent,
    CocinaComponent,
    BarraEstadoComponent,
    CrearPedidoComponent,
    MesasComponent,
    TablaAtencionComponent,
    EstadoComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class PedidoModule { }
