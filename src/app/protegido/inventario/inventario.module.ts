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
import { NuevaCompraComponent } from './pages/compras/components/nueva-compra/nueva-compra.component';
import { EditarCompraComponent } from './pages/compras/components/editar-compra/editar-compra.component';
import { VerCompraComponent } from './pages/compras/components/ver-compra/ver-compra.component';


@NgModule({
  declarations: [
    UnidadComponent,
    InventarioComponent,
    KardexComponent,
    ProveedorComponent,
    InsumoComponent,
    ComprasComponent,
    NuevaCompraComponent,
    EditarCompraComponent,
    VerCompraComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
