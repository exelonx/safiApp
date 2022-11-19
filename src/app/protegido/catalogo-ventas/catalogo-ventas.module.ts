import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoVentasRoutingModule } from './catalogo-ventas-routing.module';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';

import { NgMaterialModule } from '../../ng-material/ng-material.module';
import { EditarProductoComponent } from './pages/gestion-productos/components/editar/editar-producto.component';
import { NuevoProductoComponent } from './pages/gestion-productos/components/nuevo/nuevo-producto.component';
import { ProductoComponent } from './pages/gestion-productos/components/producto/producto.component';
import { EditarCategoriaComponent } from './pages/gestion-categoria/components/editar-categoria/editar-categoria.component';


@NgModule({
  declarations: [
    GestionProductosComponent,
    GestionCategoriaComponent,
    ProductoComponent,
    EditarProductoComponent,
    NuevoProductoComponent,
    EditarCategoriaComponent
  ],
  imports: [
    CommonModule,
    CatalogoVentasRoutingModule,
    NgMaterialModule
  ]
})
export class CatalogoVentasModule { }
