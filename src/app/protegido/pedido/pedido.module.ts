import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { AtencionComponent } from './pages/atencion/atencion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { MesaComponent } from './components/mesa/mesa.component';
import { BarraEstadoComponent } from './components/barra-estado/barra-estado.component';


@NgModule({
  declarations: [
    AtencionComponent,
    CocinaComponent,
    MesaComponent,
    BarraEstadoComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule
  ]
})
export class PedidoModule { }
