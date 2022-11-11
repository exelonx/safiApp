import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { UnidadComponent } from './pages/unidad/unidad.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { KardexComponent } from './pages/kardex/kardex.component';
import { InsumoComponent } from './pages/insumo/insumo.component';
import { NgMaterialModule } from '../../ng-material/ng-material.module';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComprasComponent } from './pages/compras/compras.component';


@NgModule({
  declarations: [
    UnidadComponent,
    InventarioComponent,
    KardexComponent,
    ProveedorComponent,
    InsumoComponent,
    ComprasComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
