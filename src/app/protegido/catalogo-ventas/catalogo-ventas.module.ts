import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CatalogoVentasRoutingModule } from './catalogo-ventas-routing.module';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';

import { NgMaterialModule } from '../../ng-material/ng-material.module';
import { EditarProductoComponent } from './pages/gestion-productos/components/editar/editar-producto.component';
import { NuevoProductoComponent } from './pages/gestion-productos/components/nuevo/nuevo-producto.component';
import { ProductoComponent } from './pages/gestion-productos/components/producto/producto.component';
import { EditarCategoriaComponent } from './pages/gestion-categoria/components/editar-categoria/editar-categoria.component';
import { TipoImpuestoComponent } from './pages/tipo-impuesto/tipo-impuesto.component';
import { EditarImpuestoComponent } from './pages/tipo-impuesto/components/editar-impuesto/editar-impuesto.component';
import { EliminarImpuestoComponent } from './pages/tipo-impuesto/components/eliminar-impuesto/eliminar-impuesto.component';
import { NuevoImpuestoComponent } from './pages/tipo-impuesto/components/nuevo-impuesto/nuevo-impuesto.component';
import { NuevaCategoriaComponent } from './pages/gestion-categoria/components/nueva-categoria/nueva-categoria.component';


@NgModule({
  declarations: [
    GestionProductosComponent,
    GestionCategoriaComponent,
    ProductoComponent,
    EditarProductoComponent,
    NuevoProductoComponent,
    EditarCategoriaComponent,
    TipoImpuestoComponent,
    EditarImpuestoComponent,
    EliminarImpuestoComponent,
    NuevoImpuestoComponent,
    NuevaCategoriaComponent,
  ],
  imports: [
    CommonModule,
    CatalogoVentasRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class CatalogoVentasModule { }
