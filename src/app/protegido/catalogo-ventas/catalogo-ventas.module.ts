import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoVentasRoutingModule } from './catalogo-ventas-routing.module';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';
import { GestionCategoriaComponent } from './pages/gestion-categoria/gestion-categoria.component';

import { NgMaterialModule } from '../../ng-material/ng-material.module'; 


@NgModule({
  declarations: [
    GestionProductosComponent,
    GestionCategoriaComponent
  ],
  imports: [
    CommonModule,
    CatalogoVentasRoutingModule,
    NgMaterialModule
  ]
})
export class CatalogoVentasModule { }
