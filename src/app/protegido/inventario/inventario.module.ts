import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { UnidadComponent } from './pages/unidad/unidad.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { KardexComponent } from './pages/kardex/kardex.component';
import { InsumoComponent } from './pages/insumo/insumo.component';
import { NgMaterialModule } from '../../ng-material/ng-material.module';


@NgModule({
  declarations: [
    UnidadComponent,
    InventarioComponent,
    KardexComponent,
    InsumoComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    NgMaterialModule
  ]
})
export class InventarioModule { }
