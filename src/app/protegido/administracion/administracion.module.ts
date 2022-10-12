import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { NgMaterialModule } from 'src/app/ng-material/ng-material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BitacoraComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class AdministracionModule { }
