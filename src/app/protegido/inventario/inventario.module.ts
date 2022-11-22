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
import { EditarProveedorComponent } from './pages/proveedor/components/editar-proveedor/editar-proveedor.component';
import { EliminarProveedorComponent } from './pages/proveedor/components/eliminar-proveedor/eliminar-proveedor.component';
import { NuevoProveedorComponent } from './pages/proveedor/components/nuevo-proveedor/nuevo-proveedor.component';
import { NuevoInsumoComponent } from './pages/insumo/components/nuevo-insumo/nuevo-insumo.component';
import { EditarInsumoComponent } from './pages/insumo/components/editar-insumo/editar-insumo.component';
import { EliminarInsumoComponent } from './pages/insumo/components/eliminar-insumo/eliminar-insumo.component';
import { NuevaUnidadComponent } from './pages/unidad/components/nueva-unidad/nueva-unidad.component';
import { EditarUnidadComponent } from './pages/unidad/components/editar-unidad/editar-unidad.component';
import { VerDetalleUnidadComponent } from './pages/unidad/components/ver-detalle-unidad/ver-detalle-unidad/ver-detalle-unidad.component';
import { EliminarUnidadComponent } from './pages/unidad/components/eliminar-unidad/eliminar-unidad/eliminar-unidad.component';
import { DetallesProveedorComponent } from './pages/proveedor/components/detalles-proveedor/detalles-proveedor.component';


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
    VerCompraComponent,
    EditarProveedorComponent,
    EliminarProveedorComponent,
    NuevoProveedorComponent,
    NuevoInsumoComponent,
    EditarInsumoComponent,
    EliminarInsumoComponent,
    NuevaUnidadComponent,
    EditarUnidadComponent,
    VerDetalleUnidadComponent,
    EliminarUnidadComponent,
    DetallesProveedorComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
